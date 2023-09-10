import { useEffect, useState } from 'react'
import {
  ArchbaseDataSource,
  DataSourceEvent,
  DataSourceEventRefreshDataType,
  DataSourceOptions,
  DataSourceEventNames
} from '../datasource'
import { ArchbaseRemoteDataSource } from '../datasource/ArchbaseRemoteDataSource'
import { processErrorMessage } from '../core/exceptions'
import { ArchbaseRemoteApiService, DefaultPage, Page } from '../service/ArchbaseRemoteApiService'
import { ArchbaseStateValues } from '../template'
import { IDataSourceValidator } from '../datasource/ArchbaseDataSource'

export type UseArchbaseRemoteDataSourceProps<T, ID> = {
  name: string
  service: ArchbaseRemoteApiService<T, ID>
  store?: ArchbaseStateValues
  filter?: string
  sort?: string[]
  id?: ID
  loadOnStart?: boolean
  initialDataSource?: ArchbaseRemoteDataSource<T, ID> | undefined
  pageSize?: number
  currentPage?: number
  transformData?: (data: any) => Page<T>
  onLoadComplete?: (dataSource: ArchbaseRemoteDataSource<T, ID>) => void
  onError?: (error, originError) => void
  onDestroy?: (dataSource: ArchbaseRemoteDataSource<T, ID>) => void
  filterData?: (data: any) => Page<T>
  findAll?<T, ID>(page: number, size: number): Promise<Page<T>>
  findAllWithSort?<T, ID>(page: number, size: number, sort: string[]): Promise<Page<T>>
  findAllWithFilter?<T, ID>(filter: string, page: number, size: number): Promise<Page<T>>
  findAllWithFilterAndSort?<T, ID>(
    filter: string,
    page: number,
    size: number,
    sort: string[]
  ): Promise<Page<T>>
  findOne?<T, ID>(id: ID): Promise<Page<T>>
  validator?: IDataSourceValidator
}

export type UseArchbaseRemoteDataSourceReturnType<T, ID> = {
  dataSource: ArchbaseRemoteDataSource<T, ID>
  isLoading: boolean
  isError: boolean
  error: any
  clearError: () => void
}

type UseArchbaseRemoteDataSourceState<T, ID> = {
  dataSource: ArchbaseRemoteDataSource<T, ID>
  isLoading: boolean
  isError: boolean
  error: any
  name: string
  filter?: string
  sort?: string[]
  id?: ID
  currentPage?: number
  pageSize?: number
  loadDataCount: number  
}
export function useArchbaseRemoteDataSource<T, ID>(
  props: UseArchbaseRemoteDataSourceProps<T, ID>
): UseArchbaseRemoteDataSourceReturnType<T, ID> {
  const {
    name,
    service,
    filter,
    sort,
    transformData,
    onLoadComplete,
    onDestroy,
    filterData,
    findAll,
    findAllWithSort,
    findAllWithFilter,
    findAllWithFilterAndSort,
    initialDataSource,
    pageSize = 50,
    currentPage = 0,
    loadOnStart = true,
    store,
    id,
    validator
  } = props
  const existsDataSource = () => {
    if (store && store.existsValue(name)) {
      return true
    }
    if (initialDataSource) {
      return true
    }
    return false
  }
  const buildDataSource = () => {
    if (store && store.existsValue(name)) {
      return store.values.get(name)
    }
    if (initialDataSource) {
      return initialDataSource
    }
    return new ArchbaseRemoteDataSource<T, ID>(service, name, {
      records: [],
      grandTotalRecords: 0,
      currentPage,
      totalPages: 0,
      pageSize,
      validator
    })
  }
  const getCurrentPage = () => {
    if (store && store.existsValue(name)) {
      return (store.values.get(name) as ArchbaseRemoteDataSource<T, ID>).getCurrentPage()
    }
    if (initialDataSource) {
      return initialDataSource.getCurrentPage()
    }
    return 0
  }
  const [internalState, setInternalState] = useState<UseArchbaseRemoteDataSourceState<T, ID>>({
    dataSource: buildDataSource(),
    isLoading: false,
    isError: false,
    error: '',
    name,
    filter,
    sort,
    id,
    currentPage: getCurrentPage(),
    pageSize,
    loadDataCount: existsDataSource() ? 1 : 0
  })

  const queryFn = async (
    _name: string,
    currentPage: number,
    pageSize: number,
    filter?: string,
    sort?: string[],
    id?: ID,
    originFilter?: any,
    originSort?: any,
    originGlobalFilter?: any
  ): Promise<void> => {
    let result: Page<T>
    if (id) {
      const value = await service.findOne(id)
      if (value){
        result = DefaultPage.createFromValues([value],1,0,0,0);
      } else {
        result = DefaultPage.createFromValues([],0,0,0,0);
      }
    } else if (findAllWithFilterAndSort && filter && sort && sort.length > 0) {
      result = await findAllWithFilterAndSort(filter, currentPage, pageSize, sort)
    } else if (findAllWithFilter && filter) {
      result = await findAllWithFilter(filter, currentPage, pageSize)
    } else if (findAllWithSort && sort && sort.length > 0) {
      result = await findAllWithSort(currentPage, pageSize, sort)
    } else if (findAll) {
      result = await findAll(currentPage, pageSize)
    } else if (filter && sort && sort.length > 0) {
      result = await service.findAllWithFilterAndSort(filter, currentPage, pageSize, sort)
    } else if (filter) {
      result = await service.findAllWithFilter(filter, currentPage, pageSize)
    } else if (sort && sort.length > 0) {
      result = await service.findAllWithSort(currentPage, pageSize, sort)
    } else {
      result = await service.findAll(currentPage, pageSize)
    }

    if (filterData) {
      result = filterData(result)
    }

    if (transformData) {
      result = transformData(result)
    }

    setInternalState((prev) => {
      const dsOptions: DataSourceOptions<T> = {
        records: result.content,
        grandTotalRecords: result.totalElements,
        totalPages: result.totalPages,
        currentPage: result.pageable.pageNumber,
        pageSize,
        filter,
        sort,
        originFilter,
        originGlobalFilter,
        originSort,
        validator
      }
      if (prev.dataSource.isActive()) {
        prev.dataSource.setData(dsOptions)
      } else {
        prev.dataSource.open(dsOptions)
      }
      return {
        ...prev,
        currentPage,
        pageSize,
        filter,
        sort,
        id,
        isLoading: false,
        isError: false,
        error: '',
        loadDataCount: prev.loadDataCount + 1
      }
    })
    if (store) {
      store.setValue(name, internalState.dataSource)
    }
    if (onLoadComplete) {
      onLoadComplete(internalState.dataSource)
    }
  }

  /**
   * Registrando listeners
   * @param dataSource
   */
  const handleDataSourceEventListener = (event: DataSourceEvent<T>): void => {
    if (event.type === DataSourceEventNames.refreshData) {
      const options = (event as DataSourceEventRefreshDataType<T>).options
      try {
        setInternalState((prev) => {
          return {
            ...prev,
            isLoading: true,
            filter: options.filter,
            sort: options.sort,
            currentPage: options.currentPage
          }
        })
        queryFn(
          internalState.name,
          options.currentPage,
          options.pageSize,
          options.filter,
          options.sort,
          internalState.id,
          options.originFilter,
          options.originSort,
          options.originGlobalFilter
        ).catch((err) => {
          const userError = processErrorMessage(err)
          setInternalState((prev) => ({
            ...prev,
            isError: true,
            isLoading: false,
            error: userError
          }))
          if (props.onError) {
            props.onError(userError, err)
          }
        })
      } catch (error) {
        const userError = processErrorMessage(error)
        setInternalState((prev) => ({
          ...prev,
          isError: true,
          isLoading: false,
          error: userError
        }))
        if (props.onError) {
          props.onError(userError, error)
        }
      }
    }
  }

  const registerListeners = (dataSource: ArchbaseDataSource<T, string>) => {
    dataSource.addListener(handleDataSourceEventListener)
  }
  /**
   * Removendo listeners
   * @param dataSource
   */
  const unRegisterListeners = (dataSource: ArchbaseDataSource<T, string>) => {
    dataSource.removeListener(handleDataSourceEventListener)
  }

  useEffect(() => {
    try {
      registerListeners(internalState.dataSource)
      if (loadOnStart && internalState.loadDataCount === 0) {
        setInternalState((prev) => {
          return { ...prev, isLoading: true }
        })
        queryFn(
          internalState.name,
          currentPage,
          pageSize,
          internalState.filter,
          internalState.sort,
          internalState.id
        ).catch((err) => {
          const userError = processErrorMessage(err)
          setInternalState((prev) => ({
            ...prev,
            isError: true,
            isLoading: false,
            error: userError
          }))
          if (props.onError) {
            props.onError(userError, err)
          }
        })
      }
      return () => {
        if (onDestroy) {
          unRegisterListeners(internalState.dataSource)
          onDestroy(internalState.dataSource)
        }
      }
    } catch (error) {
      const userError = processErrorMessage(error)
      setInternalState((prev) => ({
        ...prev,
        isError: true,
        isLoading: false,
        error: userError
      }))
      if (props.onError) {
        props.onError(userError, error)
      }
    }
  }, [
    internalState.name,
    internalState.sort,
    internalState.filter,
    internalState.id,
    internalState.currentPage,
    internalState.pageSize
  ])

  const clearError = () => {
    setInternalState((prev) => ({
      ...prev,
      isError: false,
      isLoading: false,
      error: ''
    }))
  }

  return {
    isLoading: internalState.isLoading,
    isError: internalState.isError,
    error: internalState.error,
    dataSource: internalState.dataSource,
    clearError
  }
}
