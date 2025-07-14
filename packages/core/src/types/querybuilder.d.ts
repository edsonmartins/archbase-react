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
    filterType: any;
}
export interface Sort {
    quickFilterSort: string;
    sortFields: SortField[];
    activeIndex: number;
}
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
export declare const QUICK_FILTER_INDEX = -2;
export declare const NEW_FILTER_INDEX = -1;
export declare const OP_NULL = "null";
export declare const OP_NOT_NULL = "notNull";
export declare const OP_CONTAINS = "contains";
export declare const OP_STARTSWITH = "startsWith";
export declare const OP_ENDSWITH = "endsWith";
export declare const OP_EQUALS = "=";
export declare const OP_NOT_EQUALS = "!=";
export declare const OP_GREATER = ">";
export declare const OP_LESS = "<";
export declare const OP_GREATER_OR_EQUAL = ">=";
export declare const OP_LESS_OR_EQUAL = "<=";
export declare const OP_BETWEEN = "between";
export declare const OP_IN_LIST = "inList";
export declare const OP_NOT_IN_LIST = "notInList";
//# sourceMappingURL=querybuilder.d.ts.map