import { ArchbaseRemoteDataSource } from '../datasource/ArchbaseRemoteDataSource';
import { ArchbaseRemoteApiService, Page } from '../service/ArchbaseRemoteApiService';
import { IDataSourceValidator } from '../datasource/ArchbaseDataSource';
import { ArchbaseStore } from './useArchbaseStore';
export type UseArchbaseRemoteDataSourceProps<T, ID> = {
    name: string;
    label?: string;
    service: ArchbaseRemoteApiService<T, ID>;
    store?: ArchbaseStore;
    filter?: string;
    sort?: string[];
    id?: ID;
    loadOnStart?: boolean;
    initialDataSource?: ArchbaseRemoteDataSource<T, ID> | undefined;
    pageSize?: number;
    currentPage?: number;
    transformData?: (data: any) => Page<T>;
    onLoadComplete?: (dataSource: ArchbaseRemoteDataSource<T, ID>) => void;
    onError?: (error: any, originError: any) => void;
    onDestroy?: (dataSource: ArchbaseRemoteDataSource<T, ID>) => void;
    filterData?: (data: any) => Page<T>;
    findAll?<T, ID>(page: number, size: number): Promise<Page<T>>;
    findAllWithSort?<T, ID>(page: number, size: number, sort: string[]): Promise<Page<T>>;
    findAllWithFilter?<T, ID>(filter: string, page: number, size: number): Promise<Page<T>>;
    findAllWithFilterAndSort?<T, ID>(filter: string, page: number, size: number, sort: string[]): Promise<Page<T>>;
    findOne?<T, ID>(id: ID): Promise<Page<T>>;
    validator?: IDataSourceValidator;
};
export type UseArchbaseRemoteDataSourceReturnType<T, ID> = {
    dataSource: ArchbaseRemoteDataSource<T, ID>;
    isLoading: boolean;
    isError: boolean;
    error: any;
    clearError: () => void;
};
export declare function useArchbaseRemoteDataSource<T, ID>(props: UseArchbaseRemoteDataSourceProps<T, ID>): UseArchbaseRemoteDataSourceReturnType<T, ID>;
//# sourceMappingURL=useArchbaseRemoteDataSource.d.ts.map