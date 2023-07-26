import { useEffect, useState } from 'react'
import { ArchbaseDataSource, DataSourceOptions } from '../datasource/ArchbaseDataSource'

export type UseArchbaseDataSourceProps<T, ID> = {
  initialData: any[],
  initialDataSource?: ArchbaseDataSource<T, ID> | undefined
  name: string,
  insertOnInit?: boolean,
  editOnInit?: boolean,
  onLoadComplete?: (dataSource: ArchbaseDataSource<T, ID>) => void
}

export type UseArchbaseDataSourceReturnType<T, ID> = {
  dataSource?: ArchbaseDataSource<T, ID>
}

export const useArchbaseDataSource = <T, ID>(
  props: UseArchbaseDataSourceProps<T, ID>
): UseArchbaseDataSourceReturnType<T, ID> => {
  const {initialData,name,insertOnInit,editOnInit,initialDataSource,onLoadComplete} = props;
  const [dataSource,setDataSource] = useState<ArchbaseDataSource<T, ID>>(initialDataSource ??
    new ArchbaseDataSource<T, ID>(name, {
      records: [],
      grandTotalRecords: 0,
      currentPage: 0,
      totalPages: 0,
      pageSize: 0
    }))

  useEffect(()=>{
    setDataSource((prevDataSource)=>{
      const dsOptions: DataSourceOptions<T> = {
        records: initialData,
        grandTotalRecords: initialData.length,
        totalPages: 0,
        currentPage: 0,  
        pageSize:0            
      }
      if (prevDataSource.isActive()) {
        prevDataSource.setData(dsOptions)
      } else {
        prevDataSource.open(dsOptions)
      }
      return prevDataSource
    })
    if (onLoadComplete) {
      onLoadComplete(dataSource)
    }
  },[initialData,name,insertOnInit,editOnInit])

  return {dataSource}
}
