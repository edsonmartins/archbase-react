import { useEffect, useState } from 'react';
import { ArchbaseDataSource, DataSourceOptions, IDataSourceValidator } from '../datasource/ArchbaseDataSource';
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

export const useArchbaseLocalFilterDataSource = (
  props: UseArchbaseLocalFilterDataSourceProps,
): UseArchbaseLocalFilterDataSourceReturnType => {
  const { initialData, name, initialDataSource, onLoadComplete, validator } = props;
  const [dataSource, setDataSource] = useState<ArchbaseLocalFilterDataSource>(
    initialDataSource ??
      new ArchbaseLocalFilterDataSource(name, {
        records: initialData,
        grandTotalRecords: initialData.length,
        currentPage: 0,
        totalPages: 0,
        pageSize: 0,
        validator,
      }),
  );

  useEffect(() => {
    setDataSource((prevDataSource) => {
      const dsOptions: DataSourceOptions<LocalFilter> = {
        records: initialData,
        grandTotalRecords: initialData.length,
        totalPages: 0,
        currentPage: 0,
        pageSize: 0,
        validator,
      };
      if (prevDataSource.isActive()) {
        prevDataSource.setData(dsOptions);
      } else {
        prevDataSource.open(dsOptions);
      }

      return prevDataSource;
    });
    if (onLoadComplete) {
      onLoadComplete(dataSource);
    }
  }, [initialData, name]);

  return { dataSource };
};
