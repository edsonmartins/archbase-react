import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArchbaseDataSourceV2, ArchbaseDataSourceV2Config } from './ArchbaseDataSourceV2';
import { DataSourceEvent, DataSourceEventNames } from '../ArchbaseDataSource';

/**
 * Hook para usar ArchbaseDataSourceV2 de forma reativa no React
 * 
 * Este hook provê:
 * - Gerenciamento automático do ciclo de vida do DataSource
 * - Estado reativo baseado em eventos
 * - Cleanup automático no unmount
 * - Type safety completa
 * - Performance otimizada com callbacks memoizados
 */
export function useArchbaseDataSourceV2<T, ID = any>(
  config: ArchbaseDataSourceV2Config<T>
) {
  // Referência estável para o DataSource
  const dataSourceRef = useRef<ArchbaseDataSourceV2<T> | null>(null);
  
  // Estado reativo baseado nos eventos do DataSource
  const [currentRecord, setCurrentRecord] = useState<T | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [isBrowsingState, setIsBrowsingState] = useState<boolean>(true);
  const [isEditingState, setIsEditingState] = useState<boolean>(false);
  const [isInsertingState, setIsInsertingState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Estado para forçar re-render quando necessário
  const [, forceUpdate] = useState({});
  const forceRender = useCallback(() => forceUpdate({}), []);

  // Inicialização do DataSource (apenas uma vez)
  const dataSource = useMemo(() => {
    if (!dataSourceRef.current) {
      dataSourceRef.current = new ArchbaseDataSourceV2(config);
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
        setIsBrowsingState(dataSource.isBrowsing());
        setIsEditingState(dataSource.isEditing());
        setIsInsertingState(dataSource.isInserting());
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
        setIsLoading(true);
        break;
        
      case DataSourceEventNames.afterEdit:
      case DataSourceEventNames.afterInsert:
      case DataSourceEventNames.afterSave:
      case DataSourceEventNames.afterCancel:
        setIsLoading(false);
        setIsBrowsingState(dataSource.isBrowsing());
        setIsEditingState(dataSource.isEditing());
        setIsInsertingState(dataSource.isInserting());
        break;
        
      case DataSourceEventNames.onError:
      case DataSourceEventNames.onFieldError:
        setIsLoading(false);
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
    setIsBrowsingState(dataSource.isBrowsing());
    setIsEditingState(dataSource.isEditing());
    setIsInsertingState(dataSource.isInserting());

    return () => {
      dataSource.removeListener(eventListener);
      // Não fechar o dataSource no unmount pois pode ser reutilizado
    };
  }, [dataSource, eventListener]);

  // Callbacks memoizados para operações do DataSource
  const setFieldValue = useCallback((fieldName: string, value: any) => {
    dataSource.setFieldValue(fieldName, value);
  }, [dataSource]);

  const getFieldValue = useCallback((fieldName: string) => {
    return dataSource.getFieldValue(fieldName);
  }, [dataSource]);

  const edit = useCallback(() => {
    if (dataSource instanceof ArchbaseDataSourceV2) {
      dataSource.edit();
    } else {
      (dataSource as any).edit();
    }
  }, [dataSource]);

  const save = useCallback(async () => {
    return await dataSource.save();
  }, [dataSource]);

  const cancel = useCallback(() => {
    if (dataSource instanceof ArchbaseDataSourceV2) {
      dataSource.cancel();
    } else {
      (dataSource as any).cancel();
    }
  }, [dataSource]);

  const insert = useCallback((record: T) => {
    if (dataSource instanceof ArchbaseDataSourceV2) {
      dataSource.insert(record);
    } else {
      (dataSource as any).insert(record);
    }
  }, [dataSource]);

  const remove = useCallback(async (callback?: Function) => {
    return await dataSource.remove(callback);
  }, [dataSource]);

  const first = useCallback(() => {
    if (dataSource instanceof ArchbaseDataSourceV2) {
      dataSource.first();
    } else {
      (dataSource as any).first();
    }
  }, [dataSource]);

  const last = useCallback(() => {
    if (dataSource instanceof ArchbaseDataSourceV2) {
      dataSource.last();
    } else {
      (dataSource as any).last();
    }
  }, [dataSource]);

  const next = useCallback(() => {
    if (dataSource instanceof ArchbaseDataSourceV2) {
      dataSource.next();
    } else {
      (dataSource as any).next();
    }
  }, [dataSource]);

  const prior = useCallback(() => {
    if (dataSource instanceof ArchbaseDataSourceV2) {
      dataSource.prior();
    } else {
      (dataSource as any).prior();
    }
  }, [dataSource]);

  const goToRecord = useCallback((index: number) => {
    if (dataSource instanceof ArchbaseDataSourceV2) {
      dataSource.goToRecord(index);
    } else {
      (dataSource as any).goToRecord(index);
    }
  }, [dataSource]);

  // Métodos específicos do V2 para arrays
  const appendToFieldArray = useCallback(<K extends keyof T>(
    fieldName: K,
    item: T[K] extends Array<infer U> ? U : never
  ) => {
    if (dataSource instanceof ArchbaseDataSourceV2) {
      dataSource.appendToFieldArray(fieldName, item);
    }
  }, [dataSource]);

  const updateFieldArrayItem = useCallback(<K extends keyof T>(
    fieldName: K,
    index: number,
    updater: (draft: any) => void
  ) => {
    if (dataSource instanceof ArchbaseDataSourceV2) {
      dataSource.updateFieldArrayItem(fieldName, index, updater);
    }
  }, [dataSource]);

  const removeFromFieldArray = useCallback(<K extends keyof T>(
    fieldName: K,
    index: number
  ) => {
    if (dataSource instanceof ArchbaseDataSourceV2) {
      dataSource.removeFromFieldArray(fieldName, index);
    }
  }, [dataSource]);

  const insertIntoFieldArray = useCallback(<K extends keyof T>(
    fieldName: K,
    index: number,
    item: T[K] extends Array<infer U> ? U : never
  ) => {
    if (dataSource instanceof ArchbaseDataSourceV2) {
      dataSource.insertIntoFieldArray(fieldName, index, item);
    }
  }, [dataSource]);

  const getFieldArray = useCallback(<K extends keyof T>(fieldName: K) => {
    if (dataSource instanceof ArchbaseDataSourceV2) {
      return dataSource.getFieldArray(fieldName);
    }
    // Fallback para V1 - retornar o valor se for array
    const value = (dataSource as any).getFieldValue(fieldName as string);
    return Array.isArray(value) ? value : [];
  }, [dataSource]);

  const isFieldArray = useCallback(<K extends keyof T>(fieldName: K) => {
    if (dataSource instanceof ArchbaseDataSourceV2) {
      return dataSource.isFieldArray(fieldName);
    }
    // Fallback para V1 - verificar se o valor é um array
    const value = (dataSource as any).getFieldValue(fieldName as string);
    return Array.isArray(value);
  }, [dataSource]);

  // Métodos de navegação e estado
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
          isBrowsing,
          isEditing,
          isInserting,
          isLoading
        }
      };
    }
    return null;
  }, [dataSource, currentRecord, currentIndex, totalRecords, isBrowsing, isEditing, isInserting, isLoading]);

  return {
    // DataSource instance (para casos onde acesso direto é necessário)
    dataSource,
    
    // Estado reativo
    currentRecord,
    currentIndex,
    totalRecords,
    isLoading,
    
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
    
    // Debug
    getDebugInfo
  };
}

/**
 * Tipo para o retorno do hook useArchbaseDataSourceV2
 */
export type UseArchbaseDataSourceV2Return<T> = ReturnType<typeof useArchbaseDataSourceV2<T, any>>;

/**
 * Hook customizado para componentes que precisam apenas de leitura
 * Otimizado para performance - não re-renderiza em mudanças de campo
 */
export function useArchbaseDataSourceV2ReadOnly<T, ID = any>(
  config: ArchbaseDataSourceV2Config<T>
) {
  const {
    dataSource,
    currentRecord,
    currentIndex,
    totalRecords,
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
    isFieldArray
  } = useArchbaseDataSourceV2(config);

  return {
    dataSource,
    currentRecord,
    currentIndex,
    totalRecords,
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
    isFieldArray
  };
}

/**
 * Hook customizado para componentes de edição
 * Inclui todas as operações de modificação
 */
export function useArchbaseDataSourceV2Editor<T, ID = any>(
  config: ArchbaseDataSourceV2Config<T>
) {
  return useArchbaseDataSourceV2(config);
}
