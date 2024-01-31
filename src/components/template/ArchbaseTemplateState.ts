import type { ArchbaseRemoteDataSource } from '@components/datasource';

export type ArchbaseTemplateState<T, ID> = {
	dataSource?: ArchbaseRemoteDataSource<T, ID>;
	dataSourceEdition?: ArchbaseRemoteDataSource<T, ID>;
	setDataSource: (ds: ArchbaseRemoteDataSource<T, ID>) => void;
	setDataSourceEdition: (ds: ArchbaseRemoteDataSource<T, ID>) => void;
	clearDataSource: () => void;
	clearDataSourceEdition: () => void;
};
