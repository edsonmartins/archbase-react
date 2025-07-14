import { ArchbaseDataSource, IDataSourceValidator } from '../datasource/ArchbaseDataSource';
import { ArchbaseStore } from './useArchbaseStore';
export type UseArchbaseDataSourceProps<T, ID> = {
    store?: ArchbaseStore;
    initialData: any[];
    initialDataSource?: ArchbaseDataSource<T, ID> | undefined;
    name: string;
    label?: string;
    onLoadComplete?: (dataSource: ArchbaseDataSource<T, ID>) => void;
    validator?: IDataSourceValidator;
};
export type UseArchbaseDataSourceReturnType<T, ID> = {
    dataSource: ArchbaseDataSource<T, ID>;
};
export declare const useArchbaseDataSource: <T, ID>(props: UseArchbaseDataSourceProps<T, ID>) => UseArchbaseDataSourceReturnType<T, ID>;
//# sourceMappingURL=useArchbaseDataSource.d.ts.map