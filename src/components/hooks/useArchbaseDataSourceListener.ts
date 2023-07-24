import { useEffect } from 'react'
import type { DataSourceEvent, MandalaDataSource } from '../MandalaDataSource'

export type UseMandalaDataSourceListenerProps<T, ID> = {
  dataSource: MandalaDataSource<T, ID>
  listener: (event: DataSourceEvent<T>) => void
}

export const useMandalaDataSourceListener = <T, ID>(
  props: UseMandalaDataSourceListenerProps<T, ID>
): void => {
  /**
   * Registrando listeners
   * @param dataSource
   */
  const registerListeners = (dataSource: MandalaDataSource<T, string>) => {
    dataSource.addListener(props.listener)
  }
  /**
   * Removendo listeners
   * @param dataSource
   */
  const unRegisterListeners = (dataSource: MandalaDataSource<T, string>) => {
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
