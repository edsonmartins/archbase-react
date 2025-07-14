/**
 * Filter and Query types for Archbase Core
 */
export interface IQueryFilterEntity {
    id?: any;
    companyId?: any;
    filter?: string;
    name?: string;
    description?: string;
    userOwner?: string;
    shared?: boolean;
    readOnly?: boolean;
    componentId?: string;
}
export declare class QueryFilterEntity implements IQueryFilterEntity {
    id?: any;
    companyId?: any;
    filter?: string;
    name?: string;
    description?: string;
    userOwner?: string;
    shared?: boolean;
    readOnly?: boolean;
    componentId?: string;
    constructor(data?: Partial<IQueryFilterEntity>);
}
export type DelegatorCallback = (error: string | null, result?: any) => void;
export interface ArchbaseQueryFilterDelegator {
    onSaveFilter?: DelegatorCallback;
    onRemoveFilter?: DelegatorCallback;
    onSelectFilter?: DelegatorCallback;
    onClearFilter?: DelegatorCallback;
    addNewFilter?(filter: IQueryFilterEntity, onResult: DelegatorCallback): void;
    saveFilter?(filter: IQueryFilterEntity, onResult: DelegatorCallback): void;
    removeFilterBy?(filter: IQueryFilterEntity, onResult: DelegatorCallback): void;
    getFilterById?(id: any): IQueryFilterEntity | undefined;
    getFirstFilter?(): IQueryFilterEntity | undefined;
    getFilters?(): IQueryFilterEntity[];
}
export interface ArchbaseQueryFilter {
    filter?: any;
    sort?: any;
    searchText?: string;
    activeFilterIndex?: number;
    quickFilterText?: string;
    activeFilter?: IQueryFilterEntity;
}
export declare const FILTER_TYPE: {
    readonly QUICK: "QUICK";
    readonly NORMAL: "NORMAL";
    readonly ADVANCED: "ADVANCED";
};
export type FilterType = typeof FILTER_TYPE[keyof typeof FILTER_TYPE];
export declare const QUICK: "QUICK";
export declare const NORMAL: "NORMAL";
export declare const ADVANCED: "ADVANCED";
//# sourceMappingURL=filter.d.ts.map