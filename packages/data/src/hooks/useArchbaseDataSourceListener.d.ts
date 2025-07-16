import type { DataSourceEvent, ArchbaseDataSource } from '../datasource/ArchbaseDataSource';
export type UseArchbaseDataSourceListenerProps<T, ID> = {
    dataSource: ArchbaseDataSource<T, ID>;
    listener: (event: DataSourceEvent<T>) => void;
};
export declare const useArchbaseDataSourceListener: <T, ID>(props: UseArchbaseDataSourceListenerProps<T, ID>) => void;
//# sourceMappingURL=useArchbaseDataSourceListener.d.ts.map
