import { useEffect, useState } from 'react';
import { ArchbaseDataSource } from '@components/datasource/ArchbaseDataSource';
import { ArchbaseStateValues } from '../template';

export type UseArchbaseDataSourceProps<T, ID> = {
  store?: ArchbaseStateValues;
  initialData: any[];
  initialDataSource?: ArchbaseDataSource<T, ID> | undefined;
  name: string;
  onLoadComplete?: (dataSource: ArchbaseDataSource<T, ID>) => void;
};

export type UseArchbaseDataSourceReturnType<T, ID> = {
  dataSource?: ArchbaseDataSource<T, ID>;
};

export const useArchbaseDataSource = <T, ID>(props: UseArchbaseDataSourceProps<T, ID>): UseArchbaseDataSourceReturnType<T, ID> => {
  const { name, initialDataSource, onLoadComplete, store } = props;
  const buildDataSource = () => {
    if (store && store.existsValue(name)) {
      return store.values.get(name);
    }
    if (initialDataSource) {
      return initialDataSource;
    }

    return new ArchbaseDataSource<T, ID>(name, {
      records: [],
      grandTotalRecords: 0,
      currentPage: 0,
      totalPages: 0,
      pageSize: 0,
    });
  };
  const [dataSource, _setDataSource] = useState<ArchbaseDataSource<T, ID>>(buildDataSource());

  useEffect(() => {
    if (store) {
      store.setValue(name, dataSource);
    }
    if (onLoadComplete) {
      onLoadComplete(dataSource);
    }
  }, [name]);

  return { dataSource };
};
