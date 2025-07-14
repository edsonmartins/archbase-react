import { ArchbaseQueryFilter } from '@archbase/core';
import { DataSourceOptions, ArchbaseDataSource, IDataSource } from './ArchbaseDataSource';
import { ArchbaseRemoteApiService } from '../service/ArchbaseRemoteApiService';
export interface IRemoteDataSource<T> extends IDataSource<T> {
    applyRemoteFilter: (filter: ArchbaseQueryFilter, page: number, callback?: (() => void) | undefined) => void;
}
export declare class ArchbaseRemoteDataSource<T, ID> extends ArchbaseDataSource<T, ID> implements IRemoteDataSource<T> {
    protected service: ArchbaseRemoteApiService<T, ID>;
    constructor(service: ArchbaseRemoteApiService<T, ID>, name: string, options: DataSourceOptions<T>, label?: string);
    save(callback?: Function): Promise<T>;
    remove(callback?: Function): Promise<T | undefined>;
    applyRemoteFilter(filter: ArchbaseQueryFilter, page: number, _callback?: (() => void) | undefined): any;
    protected getDataWithFilter(currentFilter: ArchbaseQueryFilter, page: number): Promise<any>;
    protected getDataWithoutFilter(page: number): any;
    protected getDataWithQuickFilter(currentFilter: ArchbaseQueryFilter, page: number): Promise<import("..").Page<T>>;
    protected getSortFields(currentFilter: ArchbaseQueryFilter): any;
}
//# sourceMappingURL=ArchbaseRemoteDataSource.d.ts.map