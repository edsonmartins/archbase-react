import { useCallback, useEffect } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import type {
  ArchbaseActiveFilter,
  FilterHistoryEntry,
  UseArchbaseFilterHistoryOptions,
  UseArchbaseFilterHistoryReturn,
} from '../ArchbaseCompositeFilters.types';
import { convertToRSQL } from '../ArchbaseCompositeFilters.utils';

/**
 * Hook para gerenciar histórico de filtros aplicados
 *
 * @param activeFilters - Filtros atuais ativos
 * @param options - Opções de configuração
 * @returns Objeto com histórico e ações para gerenciá-lo
 *
 * @example
 * ```ts
 * const {
 *   history,
 *   recentHistory,
 *   loadFromHistory,
 *   clearHistory,
 *   removeHistoryItem,
 *   hasHistory
 * } = useArchbaseFilterHistory(activeFilters, {
 *   storageKey: 'my-app-filter-history',
 *   maxHistory: 20
 * });
 * ```
 */
export function useArchbaseFilterHistory(
  activeFilters: ArchbaseActiveFilter[],
  options: UseArchbaseFilterHistoryOptions = {}
): UseArchbaseFilterHistoryReturn {
  const {
    storageKey = 'archbase-filter-history',
    maxHistory = 10,
    enabled = true,
  } = options;

  const [filterHistory, setFilterHistory] = useLocalStorage<FilterHistoryEntry[]>({
    key: storageKey,
    defaultValue: [],
  });

  // Adiciona ao histórico quando os filtros mudam
  useEffect(() => {
    if (!enabled || activeFilters.length === 0) {
      return;
    }

    const newEntry: FilterHistoryEntry = {
      filters: activeFilters,
      timestamp: Date.now(),
      rsql: convertToRSQL(activeFilters),
    };

    setFilterHistory(prev => {
      // Verifica se os mesmos filtros já existem no histórico
      const exists = prev.some(
        entry => JSON.stringify(entry.filters) === JSON.stringify(activeFilters)
      );

      if (exists) {
        return prev;
      }

      // Adiciona nova entrada no início e mantém apenas maxHistory
      return [newEntry, ...prev].slice(0, maxHistory);
    });
  }, [activeFilters, enabled, maxHistory, setFilterHistory]);

  // Histórico recente (primeiras 5 entradas)
  const recentHistory = filterHistory.slice(0, 5);

  // Limpa todo o histórico
  const clearHistory = useCallback(() => {
    setFilterHistory([]);
  }, [setFilterHistory]);

  // Remove uma entrada específica do histórico
  const removeHistoryItem = useCallback(
    (timestamp: number) => {
      setFilterHistory(prev => prev.filter(h => h.timestamp !== timestamp));
    },
    [setFilterHistory]
  );

  // Carrega filtros do histórico
  const loadFromHistory = useCallback(
    (timestamp: number) => {
      const entry = filterHistory.find(h => h.timestamp === timestamp);
      if (entry) {
        return entry.filters;
      }
      return [];
    },
    [filterHistory]
  );

  return {
    history: filterHistory,
    recentHistory,
    loadFromHistory,
    clearHistory,
    removeHistoryItem,
    hasHistory: filterHistory.length > 0,
  };
}
