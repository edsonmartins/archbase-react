import { ArchbaseDataSource, IDataSourceValidator } from '../datasource/ArchbaseDataSource';
import { ArchbaseLocalFilterDataSource, LocalFilter } from '../datasource/ArchbaseLocalFilterDataSource';
export type UseArchbaseLocalFilterDataSourceProps = {
    initialData: LocalFilter[];
    initialDataSource?: ArchbaseLocalFilterDataSource | undefined;
    name: string;
    onLoadComplete?: (dataSource: ArchbaseDataSource<LocalFilter, number>) => void;
    validator?: IDataSourceValidator;
};
export type UseArchbaseLocalFilterDataSourceReturnType = {
    dataSource?: ArchbaseLocalFilterDataSource;
};
export declare const useArchbaseLocalFilterDataSource: (props: UseArchbaseLocalFilterDataSourceProps) => UseArchbaseLocalFilterDataSourceReturnType;
//# sourceMappingURL=useArchbaseLocalFilterDataSource.d.ts.map
