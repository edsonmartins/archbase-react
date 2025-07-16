import type { ArchbaseRemoteApiService, Page } from '../service';
import { ArchbaseRemoteFilterDataSource, RemoteFilter } from '../datasource';
import { ArchbaseStateValues } from '../types';
import { IDataSourceValidator } from '../datasource/ArchbaseDataSource';
export type UseArchbaseRemoteFilterDataSourceProps = {
    name: string;
    service: ArchbaseRemoteApiService<RemoteFilter, number>;
    store?: ArchbaseStateValues;
    filter?: string;
    sort?: string[];
    loadOnStart?: boolean;
    initialDataSource?: ArchbaseRemoteFilterDataSource | undefined;
    pageSize?: number;
    currentPage?: number;
    transformData?: (data: any) => Page<RemoteFilter>;
    onLoadComplete?: (dataSource: ArchbaseRemoteFilterDataSource) => void;
    onError?: (error: any, originError: any) => void;
    onDestroy?: (dataSource: ArchbaseRemoteFilterDataSource) => void;
    filterData?: (data: any) => Page<RemoteFilter>;
    findAll?<T, ID>(page: number, size: number): Promise<Page<T>>;
    findAllWithSort?<T, ID>(page: number, size: number, sort: string[]): Promise<Page<T>>;
    findAllWithFilter?<T, ID>(filter: string, page: number, size: number): Promise<Page<T>>;
    findAllWithFilterAndSort?<T, ID>(filter: string, page: number, size: number, sort: string[]): Promise<Page<T>>;
    findOne?<T, ID>(id: ID): Promise<Page<T>>;
    validator?: IDataSourceValidator;
};
export type UseArchbaseRemoteFilterDataSourceReturnType = {
    dataSource: ArchbaseRemoteFilterDataSource;
    isLoading: boolean;
    isError: boolean;
    error: any;
    clearError: () => void;
};
export declare function useArchbaseRemoteFilterDataSource(props: UseArchbaseRemoteFilterDataSourceProps): UseArchbaseRemoteFilterDataSourceReturnType;
//# sourceMappingURL=useArchbaseRemoteFilterDataSource.d.ts.map
