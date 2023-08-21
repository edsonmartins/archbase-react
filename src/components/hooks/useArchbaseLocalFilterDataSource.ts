import { useEffect, useState } from 'react'
import { ArchbaseDataSource, DataSourceOptions } from '../datasource/ArchbaseDataSource'
import { ArchbaseLocalFilterDataSource, LocalFilter } from '../../components/datasource/ArchbaseLocalFilterDataSource'

export type UseArchbaseLocalFilterDataSourceProps = {
  initialData: LocalFilter[],
  initialDataSource?: ArchbaseLocalFilterDataSource | undefined
  name: string,
  onLoadComplete?: (dataSource: ArchbaseDataSource<LocalFilter, number>) => void
}

export type UseArchbaseLocalFilterDataSourceReturnType = {
  dataSource?: ArchbaseLocalFilterDataSource
}

export const useArchbaseLocalFilterDataSource = (
  props: UseArchbaseLocalFilterDataSourceProps
): UseArchbaseLocalFilterDataSourceReturnType=> {
  const {initialData,name,initialDataSource,onLoadComplete} = props;
  const [dataSource,setDataSource] = useState<ArchbaseLocalFilterDataSource>(initialDataSource ??
    new ArchbaseLocalFilterDataSource(name, {
      records: initialData,
      grandTotalRecords: initialData.length,
      currentPage: 0,
      totalPages: 0,
      pageSize: 0
    }))

  useEffect(()=>{
    setDataSource((prevDataSource)=>{
      const dsOptions: DataSourceOptions<LocalFilter> = {
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
      return prevDataSource;
    })
    if (onLoadComplete) {
      onLoadComplete(dataSource)
    }
  },[initialData,name])

  return {dataSource}
}
