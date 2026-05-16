import React, { createContext, useContext, useRef, useEffect } from 'react';
import { useStore } from 'zustand';
import { createTabStore, TabStore, TabLocalState } from '../state/createTabStore';
import { useTabRegistryStore } from '../state/tabRegistryStore';

const TabStoreContext = createContext<TabStore | null>(null);

export interface TabStoreProviderProps {
  tabId: string;
  children: React.ReactNode;
}

export const TabStoreProvider: React.FC<TabStoreProviderProps> = ({
  tabId,
  children
}) => {
  const { getSnapshot, saveSnapshot } = useTabRegistryStore();

  // Criar store apenas uma vez por mount
  const storeRef = useRef<TabStore | undefined>(undefined);
  if (!storeRef.current) {
    const snapshot = getSnapshot(tabId);
    storeRef.current = createTabStore(snapshot);
  }

  // Salvar snapshot ao desmontar
  useEffect(() => {
    return () => {
      if (storeRef.current) {
        const state = storeRef.current.getState();
        saveSnapshot(tabId, state.serialize());
      }
    };
  }, [tabId, saveSnapshot]);

  return (
    <TabStoreContext.Provider value={storeRef.current ?? null}>
      {children}
    </TabStoreContext.Provider>
  );
};

/**
 * Hook para acessar o store local da tab com um selector
 * @param selector Funcao que seleciona parte do estado
 * @returns O valor selecionado do estado
 */
export function useTabStore<T>(selector: (state: TabLocalState) => T): T {
  const store = useContext(TabStoreContext);
  if (!store) {
    throw new Error('useTabStore must be used within TabStoreProvider');
  }
  return useStore(store, selector);
}

/**
 * Hook para acessar o store completo (para casos avancados)
 * @returns A instancia do store da tab
 */
export function useTabStoreApi(): TabStore {
  const store = useContext(TabStoreContext);
  if (!store) {
    throw new Error('useTabStoreApi must be used within TabStoreProvider');
  }
  return store;
}

/**
 * Hook opcional que retorna o store se disponivel, ou null caso contrario
 * Util para componentes que podem ou nao estar dentro de um TabStoreProvider
 */
export function useTabStoreOptional(): TabStore | null {
  return useContext(TabStoreContext);
}
