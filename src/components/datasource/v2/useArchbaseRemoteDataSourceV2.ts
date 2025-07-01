import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArchbaseRemoteDataSourceV2, ArchbaseRemoteDataSourceV2Config } from './ArchbaseRemoteDataSourceV2';
import { DataSourceEvent, DataSourceEventNames } from '../ArchbaseDataSource';
import { ArchbaseQueryFilter } from '../../querybuilder/ArchbaseFilterCommons';

/**
 * Hook para usar ArchbaseRemoteDataSourceV2 de forma reativa no React
 * 
 * Este hook provê:
 * - Gerenciamento automático do ciclo de vida do RemoteDataSource
 * - Estado reativo baseado em eventos
 * - Cleanup automático no unmount
 * - Type safety completa
 * - Performance otimizada com callbacks memoizados
 * - Operações remotas (CRUD, filtragem, paginação)
 */
export function useArchbaseRemoteDataSourceV2<T, ID = any>(
  config: ArchbaseRemoteDataSourceV2Config<T>
) {
  // Referência estável para o DataSource
  const dataSourceRef = useRef<ArchbaseRemoteDataSourceV2<T> | null>(null);
  
  // Estado reativo baseado nos eventos do DataSource
  const [currentRecord, setCurrentRecord] = useState<T | undefined>(undefined);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [grandTotalRecords, setGrandTotalRecords] = useState<number>(0);
  const [isBrowsingState, setIsBrowsingState] = useState<boolean>(true);
  const [isEditingState, setIsEditingState] = useState<boolean>(false);
  const [isInsertingState, setIsInsertingState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para forçar re-render quando necessário
  const [, forceUpdate] = useState({});
  const forceRender = useCallback(() => forceUpdate({}), []);

  // Inicialização do DataSource (apenas uma vez)
  const dataSource = useMemo(() => {
    if (!dataSourceRef.current) {
      dataSourceRef.current = new ArchbaseRemoteDataSourceV2(config);
    }
    return dataSourceRef.current;
  }, []); // Dependências vazias intencionalmente - queremos apenas uma instância

  // Listener principal para eventos do DataSource
  const eventListener = useCallback((event: DataSourceEvent<T>) => {
    switch (event.type) {
      case DataSourceEventNames.dataChanged:
      case DataSourceEventNames.recordChanged:
        setCurrentRecord(dataSource.getCurrentRecord());
        setCurrentIndex(dataSource.getCurrentIndex());
        setTotalRecords(dataSource.getTotalRecords());
        setGrandTotalRecords(dataSource.getGrandTotalRecords());
        setIsBrowsingState(dataSource.isBrowsing());
        setIsEditingState(dataSource.isEditing());
        setIsInsertingState(dataSource.isInserting());
        setError(null);
        break;
        
      case DataSourceEventNames.fieldChanged:
        // Para mudanças de campo, forçamos re-render para garantir que
        // componentes que dependem de campos específicos sejam atualizados
        setCurrentRecord(dataSource.getCurrentRecord());
        forceRender();
        break;
        
      case DataSourceEventNames.afterScroll:
        setCurrentRecord(dataSource.getCurrentRecord());
        setCurrentIndex(dataSource.getCurrentIndex());
        break;
        
      case DataSourceEventNames.beforeEdit:
      case DataSourceEventNames.beforeInsert:
      case DataSourceEventNames.beforeSave:
      case DataSourceEventNames.beforeRemove:
        setIsLoading(true);
        setError(null);
        break;
        
      case DataSourceEventNames.afterEdit:
      case DataSourceEventNames.afterInsert:
      case DataSourceEventNames.afterSave:
      case DataSourceEventNames.afterCancel:
      case DataSourceEventNames.afterRemove:
        setIsLoading(false);
        setIsBrowsingState(dataSource.isBrowsing());
        setIsEditingState(dataSource.isEditing());
        setIsInsertingState(dataSource.isInserting());
        setError(null);
        break;
        
      case DataSourceEventNames.onError:
        setIsLoading(false);
        setError(event.error);
        break;
        
      case DataSourceEventNames.onFieldError:
        setIsLoading(false);
        // Field errors são tratados individualmente pelos componentes
        break;
    }
  }, [dataSource, forceRender]);

  // Configurar listener no mount e remover no unmount
  useEffect(() => {
    dataSource.addListener(eventListener);
    
    // Sincronizar estado inicial
    setCurrentRecord(dataSource.getCurrentRecord());
    setCurrentIndex(dataSource.getCurrentIndex());
    setTotalRecords(dataSource.getTotalRecords());
    setGrandTotalRecords(dataSource.getGrandTotalRecords());
    setIsBrowsingState(dataSource.isBrowsing());
    setIsEditingState(dataSource.isEditing());
    setIsInsertingState(dataSource.isInserting());

    return () => {
      dataSource.removeListener(eventListener);
      // Não fechar o dataSource no unmount pois pode ser reutilizado
    };
  }, [dataSource, eventListener]);

  // Callbacks memoizados para operações básicas do DataSource
  const setFieldValue = useCallback((fieldName: string, value: any) => {
    dataSource.setFieldValue(fieldName, value);
  }, [dataSource]);

  const getFieldValue = useCallback((fieldName: string) => {
    return dataSource.getFieldValue(fieldName);
  }, [dataSource]);

  const edit = useCallback(() => {
    dataSource.edit();
  }, [dataSource]);

  const save = useCallback(async () => {
    try {
      setError(null);
      return await dataSource.save();
    } catch (error: any) {
      setError(error.message || 'Erro ao salvar');
      throw error;
    }
  }, [dataSource]);

  const cancel = useCallback(() => {
    dataSource.cancel();
  }, [dataSource]);

  const insert = useCallback((record: T) => {
    dataSource.insert(record);
  }, [dataSource]);

  const remove = useCallback(async (callback?: Function) => {
    try {
      setError(null);
      return await dataSource.remove(callback);
    } catch (error: any) {
      setError(error.message || 'Erro ao remover');
      throw error;
    }
  }, [dataSource]);

  const first = useCallback(() => {
    dataSource.first();
  }, [dataSource]);

  const last = useCallback(() => {
    dataSource.last();
  }, [dataSource]);

  const next = useCallback(() => {
    dataSource.next();
  }, [dataSource]);

  const prior = useCallback(() => {
    dataSource.prior();
  }, [dataSource]);

  const goToRecord = useCallback((index: number) => {
    dataSource.goToRecord(index);
  }, [dataSource]);

  // Métodos específicos do V2 para arrays
  const appendToFieldArray = useCallback(<K extends keyof T>(
    fieldName: K,
    item: T[K] extends Array<infer U> ? U : never
  ) => {
    dataSource.appendToFieldArray(fieldName, item);
  }, [dataSource]);

  const updateFieldArrayItem = useCallback(<K extends keyof T>(
    fieldName: K,
    index: number,
    updater: (draft: any) => void
  ) => {
    dataSource.updateFieldArrayItem(fieldName, index, updater);
  }, [dataSource]);

  const removeFromFieldArray = useCallback(<K extends keyof T>(
    fieldName: K,
    index: number
  ) => {
    dataSource.removeFromFieldArray(fieldName, index);
  }, [dataSource]);

  const insertIntoFieldArray = useCallback(<K extends keyof T>(
    fieldName: K,
    index: number,
    item: T[K] extends Array<infer U> ? U : never
  ) => {
    dataSource.insertIntoFieldArray(fieldName, index, item);
  }, [dataSource]);

  const getFieldArray = useCallback(<K extends keyof T>(fieldName: K) => {
    return dataSource.getFieldArray(fieldName);
  }, [dataSource]);

  const isFieldArray = useCallback(<K extends keyof T>(fieldName: K) => {
    return dataSource.isFieldArray(fieldName);
  }, [dataSource]);

  // Métodos específicos do RemoteDataSource - Filtragem e Paginação
  const applyRemoteFilter = useCallback((
    filter: ArchbaseQueryFilter,
    page: number,
    callback?: (() => void) | undefined
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      dataSource.applyRemoteFilter(filter, page, () => {
        setIsLoading(false);
        if (callback) callback();
      });
    } catch (error: any) {
      setIsLoading(false);
      setError(error.message || 'Erro ao aplicar filtro');
    }
  }, [dataSource]);

  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Para um refresh simples, aplicamos filtro vazio na página 0
      await dataSource.applyRemoteFilter({} as ArchbaseQueryFilter, 0, () => {
        setIsLoading(false);
      });
    } catch (error: any) {
      setIsLoading(false);
      setError(error.message || 'Erro ao atualizar dados');
      throw error;
    }
  }, [dataSource]);

  // Métodos de configuração
  const setPageSize = useCallback((pageSize: number) => {
    dataSource.setPageSize(pageSize);
  }, [dataSource]);

  const getPageSize = useCallback(() => {
    return dataSource.getPageSize();
  }, [dataSource]);

  // Métodos de navegação e estado derivados
  const canNext = useMemo(() => {
    return currentIndex < totalRecords - 1;
  }, [currentIndex, totalRecords]);

  const canPrior = useMemo(() => {
    return currentIndex > 0;
  }, [currentIndex]);

  const isEmpty = useMemo(() => {
    return totalRecords === 0;
  }, [totalRecords]);

  const isFirst = useMemo(() => {
    return currentIndex === 0;
  }, [currentIndex]);

  const isLast = useMemo(() => {
    return currentIndex === totalRecords - 1;
  }, [currentIndex, totalRecords]);

  const isBrowsing = useMemo(() => {
    return isBrowsingState;
  }, [isBrowsingState]);

  const isEditing = useMemo(() => {
    return isEditingState;
  }, [isEditingState]);

  const isInserting = useMemo(() => {
    return isInsertingState;
  }, [isInsertingState]);

  // Métodos de debug (apenas em desenvolvimento)
  const getDebugInfo = useCallback(() => {
    if (process.env.NODE_ENV === 'development') {
      return {
        ...dataSource.getDebugSnapshot(),
        hookState: {
          currentRecord,
          currentIndex,
          totalRecords,
          grandTotalRecords,
          isBrowsing,
          isEditing,
          isInserting,
          isLoading,
          error
        }
      };
    }
    return null;
  }, [dataSource, currentRecord, currentIndex, totalRecords, grandTotalRecords, isBrowsing, isEditing, isInserting, isLoading, error]);

  return {
    // DataSource instance (para casos onde acesso direto é necessário)
    dataSource,
    
    // Estado reativo
    currentRecord,
    currentIndex,
    totalRecords,
    grandTotalRecords,
    isLoading,
    error,
    
    // Estado derivado
    canNext,
    canPrior,
    isEmpty,
    isFirst,
    isLast,
    isBrowsing,
    isEditing,
    isInserting,
    
    // Operações básicas
    setFieldValue,
    getFieldValue,
    edit,
    save,
    cancel,
    insert,
    remove,
    
    // Navegação
    first,
    last,
    next,
    prior,
    goToRecord,
    
    // Operações de array (V2)
    appendToFieldArray,
    updateFieldArrayItem,
    removeFromFieldArray,
    insertIntoFieldArray,
    getFieldArray,
    isFieldArray,
    
    // Operações remotas
    applyRemoteFilter,
    refreshData,
    setPageSize,
    getPageSize,
    
    // Debug
    getDebugInfo
  };
}

/**
 * Tipo para o retorno do hook useArchbaseRemoteDataSourceV2
 */
export type UseArchbaseRemoteDataSourceV2Return<T> = ReturnType<typeof useArchbaseRemoteDataSourceV2<T, any>>;

/**
 * Hook customizado para componentes que precisam apenas de leitura
 * Otimizado para performance - não re-renderiza em mudanças de campo
 */
export function useArchbaseRemoteDataSourceV2ReadOnly<T, ID = any>(
  config: ArchbaseRemoteDataSourceV2Config<T>
) {
  const {
    dataSource,
    currentRecord,
    currentIndex,
    totalRecords,
    grandTotalRecords,
    isLoading,
    error,
    canNext,
    canPrior,
    isEmpty,
    isFirst,
    isLast,
    isBrowsing,
    first,
    last,
    next,
    prior,
    goToRecord,
    getFieldValue,
    getFieldArray,
    isFieldArray,
    applyRemoteFilter,
    refreshData,
    getPageSize,
    getDebugInfo
  } = useArchbaseRemoteDataSourceV2(config);

  return {
    dataSource,
    currentRecord,
    currentIndex,
    totalRecords,
    grandTotalRecords,
    isLoading,
    error,
    canNext,
    canPrior,
    isEmpty,
    isFirst,
    isLast,
    isBrowsing,
    first,
    last,
    next,
    prior,
    goToRecord,
    getFieldValue,
    getFieldArray,
    isFieldArray,
    applyRemoteFilter,
    refreshData,
    getPageSize,
    getDebugInfo
  };
}

/**
 * Hook customizado para componentes de edição
 * Inclui todas as operações de modificação
 */
export function useArchbaseRemoteDataSourceV2Editor<T, ID = any>(
  config: ArchbaseRemoteDataSourceV2Config<T>
) {
  return useArchbaseRemoteDataSourceV2(config);
}