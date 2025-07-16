import { ArchbaseDataSource } from './ArchbaseDataSource';
import { ArchbaseQueryFilterDelegator, DelegatorCallback, IQueryFilterEntity } from '@archbase/core';
export declare class LocalFilter {
    id?: any;
    companyId?: any;
    filter?: string;
    name?: string;
    description?: string;
    viewName?: string;
    componentName?: string;
    componentId?: string;
    userName?: string;
    userOwner?: string;
    shared?: boolean;
    readOnly?: boolean;
    code?: string;
    constructor(data?: Partial<LocalFilter>);
}
export declare class ArchbaseLocalFilterDataSource extends ArchbaseDataSource<LocalFilter, number> implements ArchbaseQueryFilterDelegator {
    getFilterById(id: any): IQueryFilterEntity | undefined;
    protected convertCurrentRecordToFilter(): IQueryFilterEntity | undefined;
    addNewFilter(filter: IQueryFilterEntity, onResult: DelegatorCallback): Promise<void>;
    saveFilter(filter: IQueryFilterEntity, onResult: DelegatorCallback): Promise<void>;
    removeFilterBy(filter: IQueryFilterEntity, onResult: DelegatorCallback): Promise<void>;
    getFirstFilter(): IQueryFilterEntity | undefined;
    getFilters(): IQueryFilterEntity[];
}
//# sourceMappingURL=ArchbaseLocalFilterDataSource.d.ts.map
