import { useEffect, useState } from 'react'
import type { ArchbaseApiService } from '../service'
import type { Page } from '../service'

import {
  ArchbaseDataSource,
  DataSourceEvent,
  DataSourceEventRefreshDataType,
  DataSourceOptions,
  DataSourceEventNames,  
} from '../datasource'
import {
  ArchbaseRemoteDataSource
} from '../datasource/ArchbaseRemoteDataSource'
import { processErrorMessage } from '../core/exceptions'

export type UseMandalaRemoteDataSourceProps<T, ID> = {
  name: string
  service: ArchbaseApiService<T, ID>
  filter?: string
  sort?: string[]
  loadOnStart?: boolean
  initialDataSource?: ArchbaseRemoteDataSource<T, ID> | undefined
  pageSize?: number
  currentPage?: number
  transformData?: (data: any) => Page<T>
  onLoadComplete?: (dataSource: ArchbaseRemoteDataSource<T, ID>) => void
  onError?: (error, originError) => void
  onDestroy?: (dataSource: ArchbaseRemoteDataSource<T, ID>) => void
  filterData?: (data: any) => Page<T>
  findAll?<T, _ID>(page: number, size: number): Promise<Page<T>>
  findAllWithSort?<T, _ID>(page: number, size: number, sort: string[]): Promise<Page<T>>
  findAllWithFilter?<T, _ID>(filter: string, page: number, size: number): Promise<Page<T>>
  findAllWithFilterAndSort?<T, _ID>(
    filter: string,
    page: number,
    size: number,
    sort: string[]
  ): Promise<Page<T>>
  findOne?<T, ID>(id: ID): Promise<Page<T>>
}

export type UseMandalaRemoteDataSourceReturnType<T, ID> = {
  dataSource: ArchbaseRemoteDataSource<T, ID>
  isLoading: boolean
  isError: boolean
  error: any
  clearError: () => void
}

type UseMandalaRemoteDataSourceState<T, ID> = {
  dataSource: ArchbaseRemoteDataSource<T, ID>
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
export function useMandalaRemoteDataSource<T, ID>(
  props: UseMandalaRemoteDataSourceProps<T, ID>
): UseMandalaRemoteDataSourceReturnType<T, ID> {
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
    loadOnStart = true
  } = props
  const [internalState, setInternalState] = useState<UseMandalaRemoteDataSourceState<T, ID>>({
    dataSource:
      initialDataSource ??
      new ArchbaseRemoteDataSource<T, ID>(service, name, {
        records: [],
        grandTotalRecords: 0,
        currentPage,
        totalPages: 0,
        pageSize
      }),
    isLoading: false,
    isError: false,
    error: '',
    name,
    filter,
    sort,
    currentPage,
    pageSize,
    loadDataCount: initialDataSource ? 1 : 0
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
    let result: Page<T>
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
        originSort
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
