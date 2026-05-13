/**
 * useArchbaseIsolatedDataSource
 *
 * Hook que cria um DataSource isolado para uso em modais/forms,
 * trabalhando com uma cópia do registro para evitar re-renders
 * no componente pai (ex: Grid) durante a edição.
 *
 * Resolve o problema de performance onde digitar em inputs
 * de uma modal causa re-renderização do grid porque ambos
 * compartilham o mesmo DataSource.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArchbaseDataSource, DataSourceOptions, DataSourceEvent, DataSourceEventNames } from '../datasource';

export interface UseArchbaseIsolatedDataSourceOptions<T> {
  /** DataSource principal (parent) de onde o registro será copiado */
  parentDataSource: ArchbaseDataSource<T, any>;
  /** Se a modal está aberta (controla quando criar/destruir o DS isolado) */
  opened: boolean;
  /** Nome único para o DataSource isolado */
  name?: string;
  /** Callback quando o DS isolado é criado */
  onReady?: (ds: ArchbaseDataSource<T, any>) => void;
}

export interface UseArchbaseIsolatedDataSourceResult<T> {
  /** DataSource isolado para uso na modal */
  dataSource: ArchbaseDataSource<T, any>;
  /** Função para aplicar as mudanças de volta ao DataSource pai */
  applyChanges: () => T | undefined;
  /** Função para descartar as mudanças */
  discardChanges: () => void;
  /** Indica se há mudanças pendentes */
  isDirty: boolean;
  /** Indica se está em modo de inserção */
  isInserting: boolean;
  /** Indica se está em modo de edição */
  isEditing: boolean;
  /** Registro atual do DS isolado */
  currentRecord: T | undefined;
}

/**
 * Cria uma cópia profunda de um objeto
 */
function deepClone<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Hook para criar um DataSource isolado para modais
 */
export function useArchbaseIsolatedDataSource<T extends object>(
  options: UseArchbaseIsolatedDataSourceOptions<T>
): UseArchbaseIsolatedDataSourceResult<T> {
  const { parentDataSource, opened, name = 'isolatedDS', onReady } = options;

  const [isDirty, setIsDirty] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<T | undefined>(undefined);
  const [isInserting, setIsInserting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const dsRef = useRef<ArchbaseDataSource<T, any> | null>(null);
  const initialRecordRef = useRef<T | undefined>(undefined);

  // Criar o DataSource isolado
  const dataSource = useMemo(() => {
    if (!opened) {
      return null;
    }

    const parentRecord = parentDataSource.getCurrentRecord();
    const parentIsInserting = parentDataSource.isInserting();
    const parentIsEditing = parentDataSource.isEditing();

    if (!parentRecord) {
      return null;
    }

    // Clonar o registro para isolar mudanças
    const clonedRecord = deepClone(parentRecord);
    initialRecordRef.current = deepClone(parentRecord);

    const dsOptions: DataSourceOptions<T> = {
      records: [clonedRecord],
      grandTotalRecords: 1,
      currentPage: 0,
      totalPages: 1,
      pageSize: 1,
    };

    const ds = new ArchbaseDataSource<T, any>(name, dsOptions);
    ds.open();

    // Colocar no mesmo modo que o parent
    if (parentIsInserting) {
      ds.insert(clonedRecord);
    } else if (parentIsEditing) {
      ds.edit();
    }

    dsRef.current = ds;
    return ds;
  }, [opened, name]); // Intencionalmente não inclui parentDataSource nas deps

  // Listener para eventos do DS isolado
  useEffect(() => {
    if (!dataSource) return;

    const handleEvent = (event: DataSourceEvent<T>) => {
      if (event.type === DataSourceEventNames.fieldChanged) {
        setIsDirty(true);
        setCurrentRecord(dataSource.getCurrentRecord());
      } else if (
        event.type === DataSourceEventNames.dataChanged ||
        event.type === DataSourceEventNames.recordChanged ||
        event.type === DataSourceEventNames.afterScroll
      ) {
        setCurrentRecord(dataSource.getCurrentRecord());
      } else if (event.type === DataSourceEventNames.afterEdit) {
        setIsEditing(true);
        setIsInserting(false);
      } else if (event.type === DataSourceEventNames.afterInsert) {
        setIsInserting(true);
        setIsEditing(false);
      }
    };

    dataSource.addListener(handleEvent);

    // Sincronizar estado inicial
    setCurrentRecord(dataSource.getCurrentRecord());
    setIsInserting(dataSource.isInserting());
    setIsEditing(dataSource.isEditing());
    setIsDirty(false);

    if (onReady) {
      onReady(dataSource);
    }

    return () => {
      dataSource.removeListener(handleEvent);
    };
  }, [dataSource, onReady]);

  // Aplicar mudanças de volta ao DataSource pai
  const applyChanges = useCallback((): T | undefined => {
    if (!dataSource || !dsRef.current) {
      return undefined;
    }

    const isolatedRecord = dataSource.getCurrentRecord();
    if (!isolatedRecord) {
      return undefined;
    }

    // Copiar cada campo do registro isolado para o parent
    const parentRecord = parentDataSource.getCurrentRecord();
    if (parentRecord) {
      // Garantir que o parent está em modo de edição
      if (parentDataSource.isBrowsing()) {
        parentDataSource.edit();
      }

      // Copiar todos os campos
      Object.keys(isolatedRecord).forEach((key) => {
        const value = (isolatedRecord as any)[key];
        parentDataSource.setFieldValue(key, value);
      });
    }

    setIsDirty(false);
    return isolatedRecord;
  }, [dataSource, parentDataSource]);

  // Descartar mudanças
  const discardChanges = useCallback(() => {
    if (!dataSource || !initialRecordRef.current) {
      return;
    }

    // Restaurar registro inicial
    const restored = deepClone(initialRecordRef.current);
    Object.keys(restored).forEach((key) => {
      dataSource.setFieldValue(key, (restored as any)[key]);
    });

    setIsDirty(false);
  }, [dataSource]);

  // Cleanup quando a modal fecha
  useEffect(() => {
    if (!opened && dsRef.current) {
      dsRef.current.close();
      dsRef.current = null;
      setIsDirty(false);
      setCurrentRecord(undefined);
      setIsInserting(false);
      setIsEditing(false);
      initialRecordRef.current = undefined;
    }
  }, [opened]);

  // Retornar um DataSource nulo-seguro quando não está aberto
  const safeDataSource = dataSource || (new ArchbaseDataSource<T, any>('empty', {
    records: [],
    grandTotalRecords: 0,
    currentPage: 0,
    totalPages: 0,
    pageSize: 1,
  }));

  return {
    dataSource: safeDataSource,
    applyChanges,
    discardChanges,
    isDirty,
    isInserting,
    isEditing,
    currentRecord,
  };
}

export default useArchbaseIsolatedDataSource;
