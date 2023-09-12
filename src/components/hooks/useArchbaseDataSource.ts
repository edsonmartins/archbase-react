import { useEffect, useState } from 'react'
import { ArchbaseDataSource, DataSourceOptions, IDataSourceValidator } from '../datasource/ArchbaseDataSource'
import { ArchbaseStateValues } from '../template'
import { ArchbaseStore } from './useArchbaseStore'

export type UseArchbaseDataSourceProps<T, ID> = {
  store?: ArchbaseStore
  initialData: any[]
  initialDataSource?: ArchbaseDataSource<T, ID> | undefined
  name: string
  onLoadComplete?: (dataSource: ArchbaseDataSource<T, ID>) => void
  validator?: IDataSourceValidator
}

export type UseArchbaseDataSourceReturnType<T, ID> = {
  dataSource?: ArchbaseDataSource<T, ID>
}

export const useArchbaseDataSource = <T, ID>(
  props: UseArchbaseDataSourceProps<T, ID>
): UseArchbaseDataSourceReturnType<T, ID> => {
  const { initialData, name, initialDataSource, onLoadComplete, store, validator } = props
  const buildDataSource = () =>{
    if (store && store.existsValue(name)){
      return store.getValue(name);
    }
    if (initialDataSource){
      return initialDataSource;
    }
    return new ArchbaseDataSource<T, ID>(name, {
      records: [],
      grandTotalRecords: 0,
      currentPage : 0,
      totalPages: 0,
      pageSize: 0,
      validator
    })
  }
  const [dataSource, setDataSource] = useState<ArchbaseDataSource<T, ID>>(
    buildDataSource()
  )

  useEffect(() => {
    if (store){
      store.setValue(name,dataSource);
    }
    if (onLoadComplete) {
      onLoadComplete(dataSource)
    }
  }, [name])

  return { dataSource }
}
