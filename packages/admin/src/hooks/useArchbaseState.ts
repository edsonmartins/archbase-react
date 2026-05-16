import { useCallback, useState as useReactState, useRef, useSyncExternalStore } from 'react';
import { useTabStoreOptional } from '../components/TabStoreProvider';

/**
 * Drop-in replacement para useState que persiste entre trocas de tab.
 *
 * Funciona EXATAMENTE como useState - mesma assinatura, mesmo comportamento.
 * A unica diferenca: o valor persiste quando o usuario troca de tab e volta.
 *
 * Se usado fora de um TabStoreProvider, funciona como useState normal.
 *
 * @param key Chave unica para identificar este estado na tab
 * @param initialValue Valor inicial (igual useState)
 * @returns [value, setValue] - igual useState
 *
 * @example
 * ```tsx
 * // ANTES (useState normal - perde estado ao trocar tab)
 * const [filtro, setFiltro] = useState('');
 * const [pagina, setPagina] = useState(0);
 * const [aberto, setAberto] = useState(false);
 *
 * // DEPOIS (useArchbaseState - persiste entre tabs)
 * const [filtro, setFiltro] = useArchbaseState('filtro', '');
 * const [pagina, setPagina] = useArchbaseState('pagina', 0);
 * const [aberto, setAberto] = useArchbaseState('aberto', false);
 *
 * // Uso identico ao useState
 * setFiltro('novo valor');
 * setPagina(prev => prev + 1);
 * setAberto(true);
 * ```
 */
export function useArchbaseState<T>(
  key: string,
  initialValue: T | (() => T)
): [T, (value: T | ((prev: T) => T)) => void] {
  const store = useTabStoreOptional();

  // Resolver valor inicial apenas uma vez (suporta funcao lazy igual useState)
  const initialRef = useRef<{ resolved: boolean; value: T }>({ resolved: false, value: undefined as T });
  if (!initialRef.current.resolved) {
    initialRef.current = {
      resolved: true,
      value: typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue,
    };
  }
  const resolvedInitial = initialRef.current.value;

  // Fallback para useState normal se nao estiver em TabStoreProvider
  const [localState, setLocalState] = useReactState<T>(resolvedInitial);

  // Se temos store, usar useSyncExternalStore para subscrever mudancas
  const storedValue = useSyncExternalStore(
    // subscribe
    (callback) => {
      if (!store) return () => {};
      return store.subscribe(callback);
    },
    // getSnapshot
    () => {
      if (!store) return undefined;
      return store.getState().customState[key] as T | undefined;
    },
    // getServerSnapshot
    () => undefined
  );

  // Valor final: stored > initial (se tem store) ou local (se nao tem)
  const value = store
    ? (storedValue !== undefined ? storedValue : resolvedInitial)
    : localState;

  // Setter que funciona igual useState (aceita valor ou funcao)
  const setValue = useCallback((newValue: T | ((prev: T) => T)) => {
    if (!store) {
      setLocalState(newValue);
      return;
    }

    const currentValue = store.getState().customState[key] as T | undefined ?? resolvedInitial;
    const resolved = typeof newValue === 'function'
      ? (newValue as (prev: T) => T)(currentValue)
      : newValue;

    store.getState().setCustomState(key, resolved);
  }, [store, key, resolvedInitial]);

  return [value, setValue];
}

/**
 * Versao simplificada que usa o nome da variavel como chave.
 * Util para migracao rapida de codigo existente.
 *
 * @example
 * ```tsx
 * // Cria estado com chave 'filters' automaticamente
 * const [filters, setFilters] = useArchbaseStateAuto({ status: null, date: null });
 * ```
 */
export function useArchbaseStateNamed<T>(
  name: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  return useArchbaseState(name, initialValue);
}
