import { useEffect } from 'react';
import type { DataSourceEvent, ArchbaseDataSource } from '../datasource/ArchbaseDataSource';

export type UseArchbaseDataSourceListenerProps<T, ID> = {
  dataSource: ArchbaseDataSource<T, ID>;
  listener: (event: DataSourceEvent<T>) => void;
};

export const useArchbaseDataSourceListener = <T, ID>(props: UseArchbaseDataSourceListenerProps<T, ID>): void => {
  /**
   * Registrando listeners
   * @param dataSource
   */
  const registerListeners = (dataSource: ArchbaseDataSource<T, string>) => {
    dataSource.addListener(props.listener);
  };
  /**
   * Removendo listeners
   * @param dataSource
   */
  const unRegisterListeners = (dataSource: ArchbaseDataSource<T, string>) => {
    dataSource.removeListener(props.listener);
  };

  useEffect(() => {
    if (props.dataSource) {
      unRegisterListeners(props.dataSource);
      registerListeners(props.dataSource);
    }

    return () => {
      if (props.dataSource) {
        unRegisterListeners(props.dataSource);
      }
    };
  }, [props.dataSource.uuid]);
};
