import { useEffect } from 'react'
import type { DataSourceEvent, ArchbaseDataSource } from '../datasource/ArchbaseDataSource'

export type UseArchbaseDataSourceListenerProps<T, ID> = {
  dataSource: ArchbaseDataSource<T, ID>
  listener: (event: DataSourceEvent<T>) => void
}

export const useMandalaDataSourceListener = <T, ID>(
  props: UseArchbaseDataSourceListenerProps<T, ID>
): void => {
  /**
   * Registrando listeners
   * @param dataSource
   */
  const registerListeners = (dataSource: ArchbaseDataSource<T, string>) => {
    dataSource.addListener(props.listener)
  }
  /**
   * Removendo listeners
   * @param dataSource
   */
  const unRegisterListeners = (dataSource: ArchbaseDataSource<T, string>) => {
    dataSource.removeListener(props.listener)
  }

  useEffect(() => {
    unRegisterListeners(props.dataSource)
    registerListeners(props.dataSource)
    return () => {
      unRegisterListeners(props.dataSource)
    }
  }, [props.dataSource.uuid])
}
