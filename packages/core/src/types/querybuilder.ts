/**
 * Extended types for QueryBuilder system (specific to querybuilder components)
 * Base types are in filter.ts to avoid duplication
 */

export type PositionType = 'filter' | 'fields' | 'range' | undefined;
export type RangeType = 'month' | 'week' | 'range' | 'day' | undefined;
export type DataType = 'string' | 'number' | 'date' | 'date_time' | 'time' | 'boolean';

export interface FilterValue {
  label: string;
  value: string;
}

export interface SortField {
  name: string;
  selected: boolean;
  order: number;
  asc_desc: string;
  label: string;
}

export interface Field {
  name: string;
  label: string;
  dataType: DataType;
  operator: string;
  quickFilter: boolean;
  quickFilterSort: boolean;
  sortable: boolean;
  listValues: FilterValue[];
  searchComponent?: any;
  searchField?: any;
  nameSql?: string;
}

export interface Rule {
  field: string;
  operator: string;
  value: any;
  condition?: string;
}

export interface Filter {
  id: string;
  selectedFields: Field[];
  quickFilterText: string;
  quickFilterFieldsText: string;
  rules: Rule[];
  condition: string;
  filterType: any; // Reference to FilterType from filter.ts
}

export interface Sort {
  quickFilterSort: string;
  sortFields: SortField[];
  activeIndex: number;
}

// Extended ArchbaseQueryFilter for QueryBuilder (more specific than filter.ts version)
export interface ArchbaseQueryBuilderFilter {
  id?: number;
  filter: Filter;
  sort: Sort;
  name?: string;
  viewName?: string;
  apiVersion?: string;
  selectedFields?: Field[];
}

export interface FilterOptions {
  currentFilter?: ArchbaseQueryBuilderFilter;
  activeFilterIndex: number;
  enabledAdvancedFilter: boolean;
  apiVersion: string;
  viewName: string;
  componentName: string;
  onApplyFilter?: (currentFilter: ArchbaseQueryBuilderFilter, index: number) => void;
}

// Constants for QueryBuilder
export const QUICK_FILTER_INDEX = -2;
export const NEW_FILTER_INDEX = -1;

// Filter operators
export const OP_NULL = 'null';
export const OP_NOT_NULL = 'notNull';
export const OP_CONTAINS = 'contains';
export const OP_STARTSWITH = 'startsWith';
export const OP_ENDSWITH = 'endsWith';
export const OP_EQUALS = '=';
export const OP_NOT_EQUALS = '!=';
export const OP_GREATER = '>';
export const OP_LESS = '<';
export const OP_GREATER_OR_EQUAL = '>=';
export const OP_LESS_OR_EQUAL = '<=';
export const OP_BETWEEN = 'between';
export const OP_IN_LIST = 'inList';
export const OP_NOT_IN_LIST = 'notInList';