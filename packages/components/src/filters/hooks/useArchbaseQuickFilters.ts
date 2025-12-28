import { useCallback, useState } from 'react';
import type {
  ArchbaseActiveFilter,
  QuickFilterPreset,
  UseArchbaseQuickFiltersReturn,
} from '../ArchbaseCompositeFilters.types';

/**
 * Hook para gerenciar filtros rápidos predefinidos
 *
 * @param predefinedFilters - Filtros rápidos predefinidos
 * @param onApply - Callback quando um filtro rápido é aplicado
 * @returns Objeto com filtros rápidos e ações
 *
 * @example
 * ```ts
 * const quickFilters: QuickFilterPreset[] = [
 *   {
 *     id: 'active-users',
 *     name: 'Active Users',
 *     filters: [
 *       { key: 'status', label: 'Status', type: 'text', operator: '=', value: 'active', displayValue: 'active' }
 *     ]
 *   }
 * ];
 *
 * const { quickFilters, applyQuickFilter } = useArchbaseQuickFilters(quickFilters, (filters) => {
 *   console.log('Applied:', filters);
 * });
 * ```
 */
export function useArchbaseQuickFilters(
  predefinedFilters: QuickFilterPreset[] = [],
  onApply?: (filters: ArchbaseActiveFilter[]) => void
): UseArchbaseQuickFiltersReturn {
  const [quickFilters, setQuickFilters] = useState<QuickFilterPreset[]>(predefinedFilters);

  // Aplica um filtro rápido
  const applyQuickFilter = useCallback(
    (presetId: string) => {
      const preset = quickFilters.find(f => f.id === presetId);
      if (!preset) {
        console.warn(`Quick filter not found: ${presetId}`);
        return;
      }

      // Adiciona IDs aos filtros
      const filtersWithIds: ArchbaseActiveFilter[] = preset.filters.map(f => ({
        ...f,
        id: `quick-filter-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      }));

      onApply?.(filtersWithIds);
    },
    [quickFilters, onApply]
  );

  // Adiciona um novo filtro rápido
  const addQuickFilter = useCallback(
    (preset: QuickFilterPreset) => {
      setQuickFilters(prev => [...prev, preset]);
    },
    []
  );

  // Remove um filtro rápido
  const removeQuickFilter = useCallback(
    (presetId: string) => {
      setQuickFilters(prev => prev.filter(f => f.id !== presetId));
    },
    []
  );

  return {
    quickFilters,
    applyQuickFilter,
    addQuickFilter,
    removeQuickFilter,
  };
}
