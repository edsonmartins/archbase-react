import { useEffect } from 'react'
import type { DataSourceEvent } from '../datasource/ArchbaseDataSource'
import type { IArchbaseDataSourceBase } from '../datasource/IArchbaseDataSourceBase'

export type UseArchbaseDataSourceListenerProps<T, ID = any> = {
  dataSource: IArchbaseDataSourceBase<T>
  listener: (event: DataSourceEvent<T>) => void
}

export const useArchbaseDataSourceListener = <T, ID = any>(
  props: UseArchbaseDataSourceListenerProps<T, ID>
): void => {
  /**
   * Registrando listeners
   * @param dataSource
   */
  const registerListeners = (dataSource: IArchbaseDataSourceBase<T>) => {
    dataSource.addListener(props.listener)
  }
  /**
   * Removendo listeners
   * @param dataSource
   */
  const unRegisterListeners = (dataSource: IArchbaseDataSourceBase<T>) => {
    dataSource.removeListener(props.listener)
  }

  useEffect(() => {
    if (props.dataSource) {
      unRegisterListeners(props.dataSource)
      registerListeners(props.dataSource)
    }
    return () => {
      if (props.dataSource) {
        unRegisterListeners(props.dataSource)
      }
    }
  }, [(props.dataSource as any)?.uuid || props.dataSource?.getName()])
}
