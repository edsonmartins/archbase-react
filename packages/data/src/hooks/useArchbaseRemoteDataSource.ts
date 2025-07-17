import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArchbaseDataSource,
  DataSourceEvent,
  DataSourceEventRefreshDataType,
  DataSourceOptions,
  DataSourceEventNames
} from '../datasource'
import { ArchbaseRemoteDataSource } from '../datasource/ArchbaseRemoteDataSource'
import { processErrorMessage } from '@archbase/core'
import { ArchbaseRemoteApiService, DefaultPage, Page } from '../service/ArchbaseRemoteApiService'
import { ArchbaseStateValues } from '../types/ArchbaseStateValues'
import { IDataSourceValidator } from '../datasource/ArchbaseDataSource'
import { ArchbaseStore } from './useArchbaseStore'

export type UseArchbaseRemoteDataSourceProps<T, ID> = {
  name: string
  label?: string
  service: ArchbaseRemoteApiService<T, ID>
  store?: ArchbaseStore
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
  label?: string
  filter?: string
  sort?: string[]
  id?: ID
  currentPage?: number
  pageSize?: number
  loadDataCount: number  
}

function getGrandTotalRecords<T>(result: Page<T>) {
  return result.totalElements || result.totalElements === 0 ? result.totalElements : result.page.totalElements;
}

function getTotalPages<T>(result: Page<T>) {
  return result.totalPages || result.totalPages === 0 ? result.totalPages : result.page.totalPages;
} 

function getCurrentPageNumber<T>(result: Page<T>) {
  return result.pageable ? result.pageable.pageNumber : result.page.number;
}

export function useArchbaseRemoteDataSource<T, ID>(
  props: UseArchbaseRemoteDataSourceProps<T, ID>
): UseArchbaseRemoteDataSourceReturnType<T, ID> {
  const {
    name,
    label,
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

  const listenerRegistered = useRef(false);

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
    return new ArchbaseRemoteDataSource<T, ID>(service, name, {
      records: [],
      grandTotalRecords: 0,
      currentPage,
      totalPages: 0,
      pageSize,
      validator
    }, label)
  }
  const getCurrentPage = () => {
    if (store && store.existsValue(name)) {
      return (store.getValue(name) as ArchbaseRemoteDataSource<T, ID>).getCurrentPage()
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
    label,
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
        grandTotalRecords: getGrandTotalRecords(result),
        totalPages: getTotalPages(result),
        currentPage: getCurrentPageNumber(result),
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
  }

  useEffect(()=>{
    if (onLoadComplete && internalState.loadDataCount >0) {
      onLoadComplete(internalState.dataSource);
    }
  },[internalState.loadDataCount])

  /**
   * Registrando listeners
   * @param dataSource
   */
  const handleDataSourceEventListener = useCallback((event: DataSourceEvent<T>): void => {
    if (event.type === DataSourceEventNames.refreshData) {
      const options = (event as DataSourceEventRefreshDataType<T>).options
      try {
        setInternalState((prev) => {
          return {
          ...prev,
          isLoading: true,
          filter: options.filter,
          sort: options.sort,
          currentPage: options.currentPage,
          id: options.id
          }
        })
        queryFn(
          internalState.name,
          options.currentPage,
          options.pageSize,
          options.filter,
          options.sort,
          options.id,
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
  }, [queryFn, name, props.onError])

  const registerListeners = useCallback((dataSource: ArchbaseDataSource<T, string>) => {
    if (!listenerRegistered.current) {
      dataSource.addListener(handleDataSourceEventListener)
      listenerRegistered.current = true;
    }
  }, [handleDataSourceEventListener]);
  /**
   * Removendo listeners
   * @param dataSource
   */
  const unRegisterListeners = useCallback((dataSource: ArchbaseDataSource<T, string>) => {
    if (listenerRegistered.current) {
      dataSource.removeListener(handleDataSourceEventListener)
      listenerRegistered.current = false;
    }
  }, [handleDataSourceEventListener]);

  useEffect(() => {
    try {
      registerListeners(internalState.dataSource)
      if (loadOnStart && internalState.loadDataCount === 0) {
        setInternalState((prev) => {
          return { ...prev, isLoading: true }
        })
        queryFn(
          name,
          currentPage,
          pageSize,
          filter,
          sort,
          id
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
      } else {
        if (onLoadComplete) {
          onLoadComplete(internalState.dataSource)
        }
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
    name,
    sort,
    filter,
    id,
    currentPage,
    pageSize
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
