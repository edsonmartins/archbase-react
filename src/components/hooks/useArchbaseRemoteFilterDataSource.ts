import { useEffect, useState } from 'react'
import type { ArchbaseRemoteApiService, Page } from '../service'
import {
  ArchbaseDataSource,
  DataSourceEvent,
  DataSourceEventRefreshDataType,
  DataSourceOptions,
  DataSourceEventNames,
  ArchbaseRemoteFilterDataSource, 
  RemoteFilter
} from '../datasource'
import { processErrorMessage } from '../core/exceptions'
import { ArchbaseStateValues } from '../template'
import { IDataSourceValidator } from '../datasource/ArchbaseDataSource'

export type UseArchbaseRemoteFilterDataSourceProps = {
  name: string
  service: ArchbaseRemoteApiService<RemoteFilter, number>
  store?: ArchbaseStateValues
  filter?: string
  sort?: string[]
  loadOnStart?: boolean
  initialDataSource?: ArchbaseRemoteFilterDataSource | undefined
  pageSize?: number
  currentPage?: number
  transformData?: (data: any) => Page<RemoteFilter>
  onLoadComplete?: (dataSource: ArchbaseRemoteFilterDataSource) => void
  onError?: (error, originError) => void
  onDestroy?: (dataSource: ArchbaseRemoteFilterDataSource) => void
  filterData?: (data: any) => Page<RemoteFilter>
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

export type UseArchbaseRemoteFilterDataSourceReturnType = {
  dataSource: ArchbaseRemoteFilterDataSource
  isLoading: boolean
  isError: boolean
  error: any
  clearError: () => void
}

type UseArchbaseRemoteFilterDataSourceState = {
  dataSource: ArchbaseRemoteFilterDataSource
  isLoading: boolean
  isError: boolean
  error: any
  name: string
  filter?: string
  sort?: string[]
  currentPage?: number
  pageSize?: number
  loadDataCount: number
}
export function useArchbaseRemoteFilterDataSource(
  props: UseArchbaseRemoteFilterDataSourceProps
): UseArchbaseRemoteFilterDataSourceReturnType {
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
      return store.getValue(name)
    }
    if (initialDataSource) {
      return initialDataSource
    }
    return new ArchbaseRemoteFilterDataSource(service, name, {
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
      return (store.getValue(name) as ArchbaseRemoteFilterDataSource).getCurrentPage()
    }
    if (initialDataSource) {
      return initialDataSource.getCurrentPage()
    }
    return 0
  }
  const [internalState, setInternalState] = useState<UseArchbaseRemoteFilterDataSourceState>({
    dataSource: buildDataSource(),
    isLoading: false,
    isError: false,
    error: '',
    name,
    filter,
    sort,
    currentPage,
    pageSize,
    loadDataCount: existsDataSource() ? 1 : 0
  })

  const queryFn = async (
    _name: string,
    currentPage: number,
    pageSize: number,
    filter?: string,
    sort?: string[],
    originFilter?: any,
    originSort?: any,
    originGlobalFilter?: any
  ): Promise<void> => {
    let result: Page<RemoteFilter>
    if (findAllWithFilterAndSort && filter && sort && sort.length > 0) {
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
      const dsOptions: DataSourceOptions<RemoteFilter> = {
        records: result.content,
        grandTotalRecords: result.totalElements ? result.totalElements : result.page.totalElements,
        totalPages: result.totalPages ? result.totalPages : result.page.totalPages,
        currentPage: result.pageable ? result.pageable.pageNumber : result.page.number,
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
  const handleDataSourceEventListener = (event: DataSourceEvent<RemoteFilter>): void => {
    if (event.type === DataSourceEventNames.refreshData) {
      const options = (event as DataSourceEventRefreshDataType<RemoteFilter>).options
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

  const registerListeners = (dataSource: ArchbaseDataSource<RemoteFilter, number>) => {
    dataSource.addListener(handleDataSourceEventListener)
  }
  /**
   * Removendo listeners
   * @param dataSource
   */
  const unRegisterListeners = (dataSource: ArchbaseDataSource<RemoteFilter, number>) => {
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
          internalState.sort
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
