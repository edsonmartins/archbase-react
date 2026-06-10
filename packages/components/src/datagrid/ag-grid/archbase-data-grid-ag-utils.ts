/**
 * ArchbaseDataGridAG Utilities
 *
 * Helper functions for AG Grid implementation.
 */
import type { ColDef, SortModelItem } from 'ag-grid-community';
import { builder, emit } from '@archbase/core';
import type { IArchbaseDataSourceBase } from '@archbase/data';
import type {
  ArchbaseFilterDefinition,
  ArchbaseActiveFilter,
  ArchbaseFieldDataType,
  ArchbaseFilterOperator,
} from '../../filters/ArchbaseCompositeFilters.types';

/**
 * Maximum page size for MIT license compatibility
 */
export const MAX_PAGE_SIZE = 100;

/**
 * Safely get row ID from row data
 */
export const safeGetRowId = <T extends object>(
  row: T,
  getRowId?: (row: T) => any
): string | number | undefined => {
  if (!row) return undefined;

  try {
    if (getRowId) {
      const id = getRowId(row);
      return id !== undefined ? id : undefined;
    }
    return (row as any).id;
  } catch (error) {
    console.error('Error in safeGetRowId:', error);
    return undefined;
  }
};

/**
 * Check if DataSource is V2
 */
export const isDataSourceV2 = (ds: any): boolean => {
  return ds && ('appendToFieldArray' in ds || 'updateFieldArrayItem' in ds || 'getRecords' in ds);
};

/**
 * Get records from DataSource (V1/V2 compatible)
 */
export const getRecordsFromDataSource = <T>(ds: IArchbaseDataSourceBase<T>): T[] => {
  if (isDataSourceV2(ds)) {
    return (ds as any).getRecords?.() || [];
  }
  return (ds as any).browseRecords?.() || [];
};

/**
 * Get options from DataSource (V1 only)
 */
export const getDataSourceOptions = (ds: any): any => {
  if (isDataSourceV2(ds)) {
    return {};
  }
  return ds.getOptions?.() || {};
};

/**
 * Get current page from DataSource
 */
export const getCurrentPageFromDataSource = (ds: any): number => {
  const page = ds.getCurrentPage?.() ?? 0;
  return page;
};

/**
 * Convert hex color to RGB string
 */
export const hexToRgb = (hex: string): string => {
  try {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return '0, 0, 0';
    }

    return `${r}, ${g}, ${b}`;
  } catch {
    return '0, 0, 0';
  }
};

/**
 * Build global filter RSQL expression
 */
export const buildGlobalFilterExpression = (
  filterValue: string,
  columns: ColDef[]
): string | undefined => {
  if (!filterValue || !columns || columns.length === 0) {
    return undefined;
  }

  try {
    const filterableColumns = columns.filter((col) => {
      return col.field && col.field !== 'actions' && (col as any).enableGlobalFilter !== false;
    });

    if (filterableColumns.length === 0) {
      return undefined;
    }

    const filterExpressions = filterableColumns.map((col) => `${col.field}==^*${filterValue}*`);
    return filterExpressions.join(',');
  } catch (error) {
    console.error('Error building global filter expression:', error);
    return undefined;
  }
};

/**
 * Build filter RSQL expression from AG Grid filter model
 */
export const buildFilterExpression = (
  filterModel: Record<string, any>,
  columns: ColDef[],
  quickFilterValue?: string
): string | undefined => {
  const filterParts: string[] = [];

  // Process column filters
  if (filterModel && Object.keys(filterModel).length > 0) {
    Object.entries(filterModel).forEach(([field, filter]) => {
      if (!filter) return;

      const { type, filter: value, filterTo, values } = filter;

      if (value === undefined && !values) return;

      let filterExpr = '';
      switch (type) {
        case 'contains':
          filterExpr = `${field}==*${value}*`;
          break;
        case 'equals':
          filterExpr = emit(builder.eq(field, value));
          break;
        case 'notEqual':
          filterExpr = emit(builder.neq(field, value));
          break;
        case 'startsWith':
          filterExpr = `${field}==${value}*`;
          break;
        case 'endsWith':
          filterExpr = `${field}==*${value}`;
          break;
        case 'blank':
          filterExpr = `${field}==null`;
          break;
        case 'notBlank':
          filterExpr = `${field}!=null`;
          break;
        case 'greaterThan':
          filterExpr = emit(builder.gt(field, value));
          break;
        case 'greaterThanOrEqual':
          filterExpr = emit(builder.ge(field, value));
          break;
        case 'lessThan':
          filterExpr = emit(builder.lt(field, value));
          break;
        case 'lessThanOrEqual':
          filterExpr = emit(builder.le(field, value));
          break;
        case 'inRange':
          filterExpr = emit(builder.bt(field, value, filterTo));
          break;
        default:
          if (value) {
            filterExpr = emit(builder.eq(field, value));
          }
      }

      // Handle set filter (enum) — values array from ArchbaseEnumSetFilter
      if (!filterExpr && values && Array.isArray(values) && values.length > 0) {
        filterExpr = values.length === 1
          ? emit(builder.eq(field, String(values[0])))
          : emit(builder.in(field, values.map(String)));
      }

      if (filterExpr) {
        filterParts.push(filterExpr);
      }
    });
  }

  // Add global filter if present
  if (quickFilterValue) {
    const globalFilter = buildGlobalFilterExpression(quickFilterValue, columns);
    if (globalFilter) {
      filterParts.push(`(${globalFilter})`);
    }
  }

  if (filterParts.length === 0) {
    return undefined;
  }

  return filterParts.join(';');
};

/**
 * Convert AG Grid sort model to DataSource format
 */
export const convertSortModelToDataSource = (sortModel: SortModelItem[]): string[] => {
  return sortModel.map((sort) => `${sort.colId}:${sort.sort}`);
};

/**
 * Get initial sort model from DataSource
 */
export const getInitialSortModel = (dataSource: any): SortModelItem[] => {
  const options = dataSource && typeof dataSource.getOptions === 'function' ? dataSource.getOptions() : {};

  if (options && options.originSort) {
    return options.originSort.map((s: any) => ({
      colId: s.field,
      sort: s.sort,
    }));
  }

  if (options && options.sort) {
    return options.sort.map((sort: string) => {
      const [field, order] = sort.split(':');
      return {
        colId: field,
        sort: order === 'desc' ? ('desc' as const) : ('asc' as const),
      };
    });
  }

  return [];
};

/**
 * Convert ArchbaseActiveFilter[] to AG Grid filter model
 */
export const convertActiveFiltersToAgGridModel = (
  activeFilters: ArchbaseActiveFilter[]
): Record<string, any> => {
  if (!activeFilters || activeFilters.length === 0) {
    return {};
  }

  const filterModel: Record<string, any> = {};

  for (const filter of activeFilters) {
    const operatorMap: Record<ArchbaseFilterOperator, string> = {
      contains: 'contains',
      starts_with: 'startsWith',
      ends_with: 'endsWith',
      '=': 'equals',
      '!=': 'notEqual',
      '>': 'greaterThan',
      '<': 'lessThan',
      '>=': 'greaterThanOrEqual',
      '<=': 'lessThanOrEqual',
      is_null: 'blank',
      is_not_null: 'notBlank',
      between: 'inRange',
      date_before: 'lessThan',
      date_after: 'greaterThan',
      date_between: 'inRange',
      in: 'inSet',
      not_in: 'notInSet',
    };

    const agType = operatorMap[filter.operator] || 'equals';

    filterModel[filter.key] = {
      type: agType,
      filter: filter.value,
    };
  }

  return filterModel;
};

/**
 * Convert columns to ArchbaseFilterDefinition[]
 */
export const convertColumnsToFilterDefinitions = (
  columns: ColDef[],
  options?: {
    includeColumns?: string[];
    excludeColumns?: string[];
    onlyFilterable?: boolean;
  }
): ArchbaseFilterDefinition[] => {
  const { includeColumns, excludeColumns = ['actions', 'id'], onlyFilterable = true } = options || {};

  const definitions: ArchbaseFilterDefinition[] = [];

  for (const col of columns) {
    if (!col.field || col.field === 'actions') continue;

    if (includeColumns && includeColumns.length > 0 && !includeColumns.includes(col.field)) {
      continue;
    }

    if (excludeColumns && excludeColumns.includes(col.field)) {
      continue;
    }

    if (onlyFilterable && col.filter === false) {
      continue;
    }

    let dataType: ArchbaseFieldDataType = 'text';
    const colDataType = (col as any).dataType;
    if (colDataType) {
      const typeMap: Record<string, ArchbaseFieldDataType> = {
        text: 'text',
        integer: 'integer',
        float: 'float',
        currency: 'currency',
        boolean: 'boolean',
        date: 'date',
        datetime: 'datetime',
        time: 'datetime',
        enum: 'text',
      };
      dataType = typeMap[colDataType] || 'text';
    }

    const definition: ArchbaseFilterDefinition = {
      key: col.field,
      label: String(col.headerName || col.field),
      type: dataType,
    };

    definitions.push(definition);
  }

  return definitions;
};

/**
 * Get AG Grid filter type from data type
 */
export const getAgGridFilterType = (dataType: string): string => {
  switch (dataType) {
    case 'integer':
    case 'float':
    case 'currency':
      return 'agNumberColumnFilter';
    case 'date':
    case 'datetime':
      return 'agDateColumnFilter';
    case 'boolean':
      return 'agSetColumnFilter';
    default:
      return 'agTextColumnFilter';
  }
};

/**
 * Get alignment class for AG Grid
 */
export const getAlignmentClass = (align?: 'left' | 'center' | 'right'): string => {
  switch (align) {
    case 'right':
      return 'ag-right-aligned-cell';
    case 'center':
      return 'ag-center-aligned-cell';
    default:
      return '';
  }
};

/**
 * Get default alignment by data type
 */
export const getDefaultAlignment = (dataType: string): 'left' | 'center' | 'right' => {
  switch (dataType) {
    case 'integer':
    case 'float':
    case 'currency':
      return 'right';
    case 'boolean':
    case 'date':
    case 'datetime':
    case 'time':
      return 'center';
    default:
      return 'left';
  }
};
