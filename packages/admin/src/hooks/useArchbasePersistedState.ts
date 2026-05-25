import { useCallback, useEffect, useRef, RefObject } from 'react';
import { useTabStoreOptional } from '../components/TabStoreProvider';
import { useTabRegistryStore } from '../state/tabRegistryStore';
import { useLocation } from 'react-router-dom';

/**
 * Hook para persistir scroll automaticamente.
 * Basta passar a ref - restaura e salva automaticamente.
 *
 * @example
 * ```tsx
 * const scrollRef = useRef<HTMLDivElement>(null);
 * useArchbaseScrollRestore(scrollRef);
 *
 * return <div ref={scrollRef} style={{ overflow: 'auto' }}>...</div>;
 * ```
 */
export function useArchbaseScrollRestore(
  containerRef: RefObject<HTMLElement | null>,
  options: { debounceMs?: number } = {}
) {
  const { debounceMs = 100 } = options;
  const store = useTabStoreOptional();

  // Restaurar scroll no mount
  useEffect(() => {
    if (!store || !containerRef.current) return;

    const savedScroll = store.getState().scrollY;
    if (savedScroll > 0) {
      requestAnimationFrame(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = savedScroll;
        }
      });
    }
  }, []);

  // Salvar scroll durante interacao e no unmount
  useEffect(() => {
    if (!store || !containerRef.current) return;

    const container = containerRef.current;
    let timeoutId: ReturnType<typeof setTimeout>;

    const saveScroll = () => {
      if (container && store) {
        store.getState().setScrollY(container.scrollTop);
      }
    };

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(saveScroll, debounceMs);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      container.removeEventListener('scroll', handleScroll);
      saveScroll();
    };
  }, [store, containerRef, debounceMs]);
}

/**
 * Hook para detectar quando a tab fica ativa (visivel).
 * Retorna boolean e opcionalmente executa callback.
 *
 * @example
 * ```tsx
 * // Simples - so detecta
 * const isActive = useArchbaseTabActive();
 *
 * // Com callback - refresh quando ativar
 * const isActive = useArchbaseTabActive(() => {
 *   dataSource.refreshData();
 * });
 *
 * // Condicional
 * if (isActive) {
 *   // Tab esta visivel
 * }
 * ```
 */
export function useArchbaseTabActive(onActivate?: () => void): boolean {
  const location = useLocation();
  const activeTabId = useTabRegistryStore((s) => s.activeTabId);
  const currentTabId = location.pathname + location.search;
  const isActive = activeTabId === currentTabId;

  const wasActiveRef = useRef(isActive);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Pular primeiro render
    if (isFirstRender.current) {
      isFirstRender.current = false;
      wasActiveRef.current = isActive;
      return;
    }

    // Detectar quando FICOU ativo (era false, agora true)
    if (isActive && !wasActiveRef.current && onActivate) {
      onActivate();
    }

    wasActiveRef.current = isActive;
  }, [isActive, onActivate]);

  return isActive;
}

/**
 * Hook para estado de modal/drawer com dado associado.
 * Persiste entre trocas de tab.
 *
 * @example
 * ```tsx
 * const drawer = useArchbaseDrawerState<VisitaDTO>('detalhes');
 *
 * // Abrir com dados
 * <Button onClick={() => drawer.open(visitaSelecionada)}>Ver</Button>
 *
 * // No drawer
 * <Drawer opened={drawer.isOpen} onClose={drawer.close}>
 *   {drawer.data && <Detalhes visita={drawer.data} />}
 * </Drawer>
 * ```
 */
export function useArchbaseDrawerState<T = any>(key: string) {
  const store = useTabStoreOptional();
  const openKey = `drawer_${key}_open`;
  const dataKey = `drawer_${key}_data`;

  // Estado local fallback
  const localOpenRef = useRef(false);
  const localDataRef = useRef<T | null>(null);

  const isOpen = store
    ? (store.getState().customState[openKey] as boolean) ?? false
    : localOpenRef.current;

  const data = store
    ? (store.getState().customState[dataKey] as T | null) ?? null
    : localDataRef.current;

  const open = useCallback((itemData?: T) => {
    if (store) {
      if (itemData !== undefined) {
        store.getState().setCustomState(dataKey, itemData);
      }
      store.getState().setCustomState(openKey, true);
    } else {
      if (itemData !== undefined) {
        localDataRef.current = itemData;
      }
      localOpenRef.current = true;
    }
  }, [store, openKey, dataKey]);

  const close = useCallback(() => {
    if (store) {
      store.getState().setCustomState(openKey, false);
    } else {
      localOpenRef.current = false;
    }
  }, [store, openKey]);

  const closeAndClear = useCallback(() => {
    if (store) {
      store.getState().setCustomState(openKey, false);
      store.getState().clearCustomState(dataKey);
    } else {
      localOpenRef.current = false;
      localDataRef.current = null;
    }
  }, [store, openKey, dataKey]);

  return {
    isOpen,
    data,
    open,
    close,
    closeAndClear,
  };
}
