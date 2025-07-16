import { ArchbaseQueryFilterDelegator, DelegatorCallback, IQueryFilterEntity } from '@archbase/core';
import { ArchbaseRemoteDataSource } from './ArchbaseRemoteDataSource';
export declare class RemoteFilter {
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
    isNewFilter?: boolean;
    constructor(data?: Partial<RemoteFilter>);
}
export declare class ArchbaseRemoteFilterDataSource extends ArchbaseRemoteDataSource<RemoteFilter, number> implements ArchbaseQueryFilterDelegator {
    getFilterById(id: any): IQueryFilterEntity | undefined;
    protected convertCurrentRecordToFilter(): IQueryFilterEntity | undefined;
    addNewFilter(filter: IQueryFilterEntity, onResult: DelegatorCallback): Promise<void>;
    saveFilter(filter: IQueryFilterEntity, onResult: DelegatorCallback): Promise<void>;
    removeFilterBy(filter: IQueryFilterEntity, onResult: DelegatorCallback): Promise<void>;
    getFirstFilter(): IQueryFilterEntity | undefined;
    getFilters(): IQueryFilterEntity[];
}
//# sourceMappingURL=ArchbaseRemoteFilterDataSource.d.ts.map
