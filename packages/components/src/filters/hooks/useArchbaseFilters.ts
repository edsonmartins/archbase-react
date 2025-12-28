import { useCallback, useMemo, useState } from 'react';
import type {
  ArchbaseActiveFilter,
  ArchbaseFilterDefinition,
  UseArchbaseFiltersOptions,
  UseArchbaseFiltersReturn,
  ApiFilterFormat,
} from '../ArchbaseCompositeFilters.types';
import {
  convertToRSQL,
  convertToApiFormatList,
  generateFilterId,
  validateFilterValue,
  getDisplayValue,
} from '../ArchbaseCompositeFilters.utils';

/**
 * Hook principal para gerenciamento de filtros com conversão RSQL
 *
 * @param filterDefinitions - Definições dos campos filtráveis
 * @param options - Opções de configuração
 * @returns Objeto com estado e ações para gerenciar filtros
 *
 * @example
 * ```ts
 * const filters: ArchbaseFilterDefinition[] = [
 *   { key: 'nome', label: 'Nome', type: 'text' },
 *   { key: 'idade', label: 'Idade', type: 'integer' }
 * ];
 *
 * const {
 *   activeFilters,
 *   rsqlQuery,
 *   addFilter,
 *   removeFilter,
 *   clearFilters
 * } = useArchbaseFilters(filters);
 * ```
 */
export function useArchbaseFilters(
  filterDefinitions: ArchbaseFilterDefinition[],
  options?: UseArchbaseFiltersOptions
): UseArchbaseFiltersReturn {
  const [activeFilters, setActiveFilters] = useState<ArchbaseActiveFilter[]>(
    options?.initialFilters || []
  );

  // Gera a query RSQL atual
  const rsqlQuery = useMemo(() => {
    return convertToRSQL(activeFilters);
  }, [activeFilters]);

  // Notifica mudança nos filtros
  const handleFiltersChange = useCallback(
    (newFilters: ArchbaseActiveFilter[]) => {
      setActiveFilters(newFilters);
      options?.onFiltersChange?.(newFilters, convertToRSQL(newFilters));
    },
    [options]
  );

  // Adiciona um novo filtro
  const addFilter = useCallback(
    (filter: Omit<ArchbaseActiveFilter, 'id'>) => {
      const fieldDef = filterDefinitions.find(f => f.key === filter.key);
      if (!fieldDef) {
        console.warn(`Field definition not found for key: ${filter.key}`);
        return;
      }

      // Valida o valor
      if (!validateFilterValue(filter.value, filter.type, filter.operator)) {
        console.warn(`Invalid filter value for ${filter.key}`);
        return;
      }

      const newFilter: ArchbaseActiveFilter = {
        ...filter,
        id: generateFilterId(),
        displayValue: getDisplayValue(
          filter.value,
          filter.type,
          filter.operator,
          fieldDef.options
        ),
      };

      // Verifica se já existe um filtro para o mesmo campo
      const existingIndex = activeFilters.findIndex(f => f.key === filter.key);
      if (existingIndex >= 0) {
        // Substitui o filtro existente
        const newFilters = [...activeFilters];
        newFilters[existingIndex] = newFilter;
        handleFiltersChange(newFilters);
      } else {
        // Adiciona novo filtro
        handleFiltersChange([...activeFilters, newFilter]);
      }
    },
    [activeFilters, filterDefinitions, handleFiltersChange]
  );

  // Remove um filtro pelo ID
  const removeFilter = useCallback(
    (id: string) => {
      handleFiltersChange(activeFilters.filter(f => f.id !== id));
    },
    [activeFilters, handleFiltersChange]
  );

  // Limpa todos os filtros
  const clearFilters = useCallback(() => {
    handleFiltersChange([]);
  }, [handleFiltersChange]);

  // Atualiza um filtro existente
  const updateFilter = useCallback(
    (id: string, updates: Partial<ArchbaseActiveFilter>) => {
      handleFiltersChange(
        activeFilters.map(f => (f.id === id ? { ...f, ...updates } : f))
      );
    },
    [activeFilters, handleFiltersChange]
  );

  // Define todos os filtros de uma vez
  const setFilters = useCallback(
    (filters: ArchbaseActiveFilter[]) => {
      handleFiltersChange(filters);
    },
    [handleFiltersChange]
  );

  // Converte para RSQL
  const toRSQL = useCallback(() => {
    return convertToRSQL(activeFilters);
  }, [activeFilters]);

  // Converte para formato de API
  const toApiFormat = useCallback((): ApiFilterFormat[] => {
    return convertToApiFormatList(activeFilters);
  }, [activeFilters]);

  // Verifica se existe um filtro para uma chave
  const hasFilter = useCallback(
    (key: string) => {
      return activeFilters.some(f => f.key === key);
    },
    [activeFilters]
  );

  // Obtém um filtro por chave
  const getFilter = useCallback(
    (key: string) => {
      return activeFilters.find(f => f.key === key);
    },
    [activeFilters]
  );

  return {
    activeFilters,
    rsqlQuery,
    addFilter,
    removeFilter,
    clearFilters,
    updateFilter,
    setFilters,
    toRSQL,
    toApiFormat,
    filtersCount: activeFilters.length,
    hasFilter,
    getFilter,
  };
}

/**
 * Hook simplificado para gerenciamento de filtros com valor controlado
 */
export function useArchbaseFiltersControlled(
  filterDefinitions: ArchbaseFilterDefinition[],
  value: ArchbaseActiveFilter[],
  onChange: (filters: ArchbaseActiveFilter[], rsql?: string) => void
): Omit<UseArchbaseFiltersReturn, 'activeFilters' | 'rsqlQuery'> & {
  activeFilters: ArchbaseActiveFilter[];
  rsqlQuery: string | undefined;
} {
  const rsqlQuery = useMemo(() => convertToRSQL(value), [value]);

  const addFilter = useCallback(
    (filter: Omit<ArchbaseActiveFilter, 'id'>) => {
      const fieldDef = filterDefinitions.find(f => f.key === filter.key);
      if (!fieldDef || !validateFilterValue(filter.value, filter.type, filter.operator)) {
        return;
      }

      const newFilter: ArchbaseActiveFilter = {
        ...filter,
        id: generateFilterId(),
        displayValue: getDisplayValue(filter.value, filter.type, filter.operator, fieldDef.options),
      };

      const existingIndex = value.findIndex(f => f.key === filter.key);
      let newFilters: ArchbaseActiveFilter[];
      if (existingIndex >= 0) {
        newFilters = [...value];
        newFilters[existingIndex] = newFilter;
      } else {
        newFilters = [...value, newFilter];
      }

      onChange(newFilters, convertToRSQL(newFilters));
    },
    [filterDefinitions, value, onChange]
  );

  const removeFilter = useCallback(
    (id: string) => {
      const newFilters = value.filter(f => f.id !== id);
      onChange(newFilters, convertToRSQL(newFilters));
    },
    [value, onChange]
  );

  const clearFilters = useCallback(() => {
    onChange([], undefined);
  }, [onChange]);

  const updateFilter = useCallback(
    (id: string, updates: Partial<ArchbaseActiveFilter>) => {
      const newFilters = value.map(f => (f.id === id ? { ...f, ...updates } : f));
      onChange(newFilters, convertToRSQL(newFilters));
    },
    [value, onChange]
  );

  const setFilters = useCallback(
    (filters: ArchbaseActiveFilter[]) => {
      onChange(filters, convertToRSQL(filters));
    },
    [onChange]
  );

  const toRSQL = useCallback(() => {
    return rsqlQuery;
  }, [rsqlQuery]);

  const toApiFormat = useCallback(() => {
    return convertToApiFormatList(value);
  }, [value]);

  const hasFilter = useCallback(
    (key: string) => {
      return value.some(f => f.key === key);
    },
    [value]
  );

  const getFilter = useCallback(
    (key: string) => {
      return value.find(f => f.key === key);
    },
    [value]
  );

  return {
    activeFilters: value,
    rsqlQuery,
    addFilter,
    removeFilter,
    clearFilters,
    updateFilter,
    setFilters,
    toRSQL,
    toApiFormat,
    filtersCount: value.length,
    hasFilter,
    getFilter,
  };
}
