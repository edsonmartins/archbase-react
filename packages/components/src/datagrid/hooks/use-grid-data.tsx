import { useState, useEffect, useCallback, useRef } from 'react';
import {
  GridFilterModel,
  GridRowSelectionModel,
  GridSortModel,
  GridPaginationModel,
  GridCellParams,
  GridCallbackDetails,
  GridEventListener
} from '@mui/x-data-grid';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@archbase/data';
import { useArchbaseV1V2Compatibility } from '@archbase/data';

/**
 * Interface para o estado do grid
 */
export interface ArchbaseGridState<T> {
  // Dados
  rows: T[];
  totalRecords: number;
  totalPages: number;
  isLoading: boolean;
  paginationModel: GridPaginationModel;
  sortModel: GridSortModel;
  filterModel: GridFilterModel;
  selectionModel: GridRowSelectionModel;
  selectedRowsData: T[];

  // Métodos
  setPaginationModel: (model: GridPaginationModel) => void;
  setSortModel: (model: GridSortModel) => void;
  setFilterModel: (model: GridFilterModel) => void;
  setSelectionModel: (model: GridRowSelectionModel) => void;
  refreshData: () => void;
  handleCellKeyDown: GridEventListener<'cellKeyDown'>;
}

/**
 * Função para construir expressão de busca global
 */
const buildGlobalFilterExpression = (filterValue: string, columns: any[]): string | undefined => {
  if (!filterValue || !columns || columns.length === 0) {
    return undefined;
  }

  // Filtrar colunas que suportam busca global
  const filterableColumns = columns.filter(col => col.enableGlobalFilter !== false);

  if (filterableColumns.length === 0) {
    return undefined;
  }

  return `globalSearch=*${filterValue}*`;
};

/**
 * Constrói uma expressão de filtro
 */
const buildFilterExpression = (filterModel: GridFilterModel, columns: any[]): string | undefined => {
  // Se não tiver filtros, verificar se tem filtro global
  if (!filterModel.items || filterModel.items.length === 0) {
    if (filterModel.quickFilterValues && filterModel.quickFilterValues.length > 0) {
      const globalFilterValue = filterModel.quickFilterValues[0];
      if (globalFilterValue) {
        return buildGlobalFilterExpression(globalFilterValue, columns);
      }
    }
    return undefined;
  }

  // Processar filtros de coluna
  const filterParts: string[] = [];

  filterModel.items.forEach(item => {
    const { field, operator, value } = item;

    if (value === undefined || value === null || value === '') {
      return;
    }

    let filterExpr = '';
    switch (operator) {
      case 'contains':
        filterExpr = `${field}==*${value}*`;
        break;
      case 'equals':
        filterExpr = `${field}==${value}`;
        break;
      case 'startsWith':
        filterExpr = `${field}==${value}*`;
        break;
      case 'endsWith':
        filterExpr = `${field}==*${value}`;
        break;
      case 'isEmpty':
        filterExpr = `${field}==null`;
        break;
      case 'isNotEmpty':
        filterExpr = `${field}!=null`;
        break;
      case 'is':
        filterExpr = `${field}==${value}`;
        break;
      case 'not':
        filterExpr = `${field}!=${value}`;
        break;
      case '>':
        filterExpr = `${field}>${value}`;
        break;
      case '>=':
        filterExpr = `${field}>=${value}`;
        break;
      case '<':
        filterExpr = `${field}<${value}`;
        break;
      case '<=':
        filterExpr = `${field}<=${value}`;
        break;
      default:
        filterExpr = `${field}==${value}`;
    }

    if (filterExpr) {
      filterParts.push(filterExpr);
    }
  });

  // Adicionar filtro global se existir
  if (filterModel.quickFilterValues && filterModel.quickFilterValues.length > 0) {
    const globalFilterValue = filterModel.quickFilterValues[0];
    if (globalFilterValue) {
      const globalFilter = buildGlobalFilterExpression(globalFilterValue, columns);
      if (globalFilter) {
        filterParts.push(globalFilter);
      }
    }
  }

  if (filterParts.length === 0) {
    return undefined;
  }

  // Combinar todos os filtros com AND (;)
  return filterParts.join(';');
};

/**
 * Constrói uma expressão de ordenação a partir do modelo de ordenação do MUI X DataGrid
 */
const buildSortExpression = (sortModel: GridSortModel): string[] | undefined => {
  if (!sortModel || sortModel.length === 0) {
    return undefined;
  }

  return sortModel.map(sort => `${sort.field}:${sort.sort}`);
};

/**
 * Obtém ordenação inicial do DataSource
 */
const getInitialSortModel = <T, ID>(dataSource: ArchbaseDataSource<T, ID>): GridSortModel => {
  if (dataSource && dataSource.getOptions().originSort) {
    return dataSource.getOptions().originSort;
  }

  if (dataSource && dataSource.getOptions() && dataSource.getOptions().sort) {
    return dataSource.getOptions().sort!.map((sort: string) => {
      const [field, order] = sort.split(':');
      return {
        field,
        sort: order === 'desc' ? 'desc' : 'asc',
      };
    });
  }

  return [];
};

/**
 * Hook personalizado para integrar o MUI X DataGrid com o ArchbaseDataSource
 */
export function useGridData<T extends object, ID>({
  dataSource,
  pageSize = 10,
  pageIndex = 0,
  getRowId,
  columns
}: {
  dataSource: ArchbaseDataSource<T, ID>;
  pageSize?: number;
  pageIndex?: number;
  getRowId: (row: T) => any;
  columns: any[];
}): ArchbaseGridState<T> {
  // V1/V2 Compatibility Pattern
  const {
    isDataSourceV2,
    v1State: { forceUpdate }
  } = useArchbaseV1V2Compatibility<T>(
    'useGridData',
    dataSource
  );

  // Ref para o dataSource para evitar loops
  const dataSourceRef = useRef(dataSource);

  // Estados do grid
  const [rows, setRows] = useState<T[]>(() => dataSource.browseRecords());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>(() => ({
    page: dataSource ? dataSource.getCurrentPage() : pageIndex,
    pageSize: dataSource ? dataSource.getPageSize() : pageSize,
  }));
  const [sortModel, setSortModel] = useState<GridSortModel>(() =>
    getInitialSortModel(dataSource)
  );
  const [filterModel, setFilterModel] = useState<GridFilterModel>(() => ({
    items: dataSource && dataSource.getOptions().originFilter ? dataSource.getOptions().originFilter : [],
    quickFilterValues: dataSource && dataSource.getOptions().originGlobalFilter ? [dataSource.getOptions().originGlobalFilter] : []
  }));
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
  const [selectedRowsData, setSelectedRowsData] = useState<T[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(() => dataSource.getGrandTotalRecords());
  const [totalPages, setTotalPages] = useState<number>(() =>
    Math.ceil(dataSource.getGrandTotalRecords() / (dataSource.getPageSize() || pageSize))
  );

  // Refs para controle de estado
  const pendingRefresh = useRef<boolean>(false);
  const internalSelectionChange = useRef<boolean>(false);
  const isInitialMount = useRef<boolean>(true);
  const eventListenerRef = useRef<any>(null);

  // Atualizar a referência do dataSource
  useEffect(() => {
    dataSourceRef.current = dataSource;
  }, [dataSource]);

  // Handler para atualização de paginação
  const handlePaginationModelChange = useCallback((model: GridPaginationModel) => {
    setPaginationModel(model);

    const options = dataSourceRef.current.getOptions();
    options.currentPage = model.page;
    options.pageSize = model.pageSize;

    pendingRefresh.current = true;
    setIsLoading(true);
    dataSourceRef.current.refreshData(options);
    
    // Force update for V1 DataSource
    if (!isDataSourceV2) {
      forceUpdate();
    }
  }, [forceUpdate, isDataSourceV2]);

  // Handler para atualização de ordenação
  const handleSortModelChange = useCallback((model: GridSortModel) => {
    setSortModel(model);

    const options = dataSourceRef.current.getOptions();
    options.sort = buildSortExpression(model);
    options.originSort = model;

    pendingRefresh.current = true;
    setIsLoading(true);
    dataSourceRef.current.refreshData(options);
    
    // Force update for V1 DataSource
    if (!isDataSourceV2) {
      forceUpdate();
    }
  }, [forceUpdate, isDataSourceV2]);

  // Handler para atualização de filtros
  const handleFilterModelChange = useCallback((model: GridFilterModel) => {
    setFilterModel(model);

    const options = dataSourceRef.current.getOptions();
    options.filter = buildFilterExpression(model, columns);
    options.originFilter = model.items;

    // Salvar também os valores de filtro global
    options.originGlobalFilter = model.quickFilterValues && model.quickFilterValues.length > 0
      ? model.quickFilterValues[0]
      : '';

    // Importante: voltar para a primeira página ao aplicar filtro
    options.currentPage = 0;
    setPaginationModel(prev => ({ ...prev, page: 0 }));

    pendingRefresh.current = true;
    setIsLoading(true);
    dataSourceRef.current.refreshData(options);
    
    // Force update for V1 DataSource
    if (!isDataSourceV2) {
      forceUpdate();
    }
  }, [columns, forceUpdate, isDataSourceV2]);

  // Handler para atualização de seleção
  const handleSelectionModelChange = useCallback((model: GridRowSelectionModel) => {
    // Impedir execução duplicada
    if (internalSelectionChange.current) return;

    try {
      internalSelectionChange.current = true;

      setSelectionModel(model);

      // Mapear IDs selecionados para objetos de dados
      const selected: T[] = [];
      model.forEach(id => {
        const rowData = rows.find(row => {
          try {
            return String(getRowId(row)) === String(id);
          } catch (e) {
            console.error("Error comparing row IDs:", e);
            return false;
          }
        });
        if (rowData) {
          selected.push(rowData);
        }
      });

      setSelectedRowsData(selected);

      // Se tivermos exatamente uma linha selecionada, vamos sincronizar com o dataSource
      if (model.length === 1 && selected.length === 1) {
        // Verificar se o registro atual do dataSource é diferente do selecionado
        const currentDataSourceRecord = dataSourceRef.current.getCurrentRecord();

        // Lógica para comparar se o registro atual é diferente do selecionado
        let shouldUpdateDataSource = false;

        if (!currentDataSourceRecord) {
          shouldUpdateDataSource = true;
        } else {
          try {
            const currentId = getRowId(currentDataSourceRecord);
            shouldUpdateDataSource = String(currentId) !== String(model[0]);
          } catch (e) {
            console.error("Error comparing current record:", e);
          }
        }

        if (shouldUpdateDataSource) {
          dataSourceRef.current.gotoRecordByData(selected[0]);
        }
      }
    } finally {
      // Resetar a flag após um pequeno delay para permitir que o evento seja processado
      setTimeout(() => {
        internalSelectionChange.current = false;
      }, 200);
    }
  }, [rows, getRowId]);

  // Handler para eventos de teclado em células
  const handleCellKeyDown: GridEventListener<'cellKeyDown'> = useCallback((params, event, details) => {
    // Processar apenas se não estivermos em uma operação de seleção interna
    if (internalSelectionChange.current) return;

    // Detectar navegação com setas
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      // Verificar se temos uma seleção atual
      if (selectionModel.length === 1) {
        const currentIndex = rows.findIndex(row => {
          try {
            return String(getRowId(row)) === String(selectionModel[0]);
          } catch (e) {
            console.error("Error comparing row IDs:", e);
            return false;
          }
        });

        // Calcular próximo índice
        let nextIndex = currentIndex;
        if (event.key === 'ArrowUp' && currentIndex > 0) {
          nextIndex = currentIndex - 1;
        } else if (event.key === 'ArrowDown' && currentIndex < rows.length - 1) {
          nextIndex = currentIndex + 1;
        }

        // Se o índice mudou, atualizar seleção e dataSource
        if (nextIndex !== currentIndex) {
          const nextRow = rows[nextIndex];
          try {
            const nextRowId = getRowId(nextRow);

            // Marcar que estamos fazendo uma alteração interna para evitar loops
            internalSelectionChange.current = true;

            // Atualizar seleção
            setSelectionModel([nextRowId]);
            setSelectedRowsData([nextRow]);

            // Sincronizar com o dataSource
            dataSourceRef.current.gotoRecordByData(nextRow);

            // Resetar a flag após um breve delay
            setTimeout(() => {
              internalSelectionChange.current = false;
            }, 200);
          } catch (e) {
            console.error("Error during keyboard navigation:", e);
            internalSelectionChange.current = false;
          }
        }
      }
    }
  }, [rows, selectionModel, getRowId]);

  // Atualiza os dados quando o dataSource muda
  const refreshData = useCallback(() => {
    pendingRefresh.current = true;
    setIsLoading(true);
    dataSourceRef.current.refreshData();
    
    // Force update for V1 DataSource
    if (!isDataSourceV2) {
      forceUpdate();
    }
  }, [forceUpdate, isDataSourceV2]);

  // Configura o listener do DataSource uma única vez
  useEffect(() => {
    console.log('Setting up DataSource event listener in useGridData');

    // Handler para processar eventos do DataSource
    const handleDataSourceEvent = (event: DataSourceEvent<T>): void => {
      // Ignorar se ainda estamos montando o componente
      if (isInitialMount.current) return;

      // Ignorar se estamos processando uma mudança interna
      if (internalSelectionChange.current && event.type === DataSourceEventNames.afterScroll) {
        return;
      }

      // Quando os dados são atualizados
      if (event.type === DataSourceEventNames.refreshData) {
        setRows(dataSourceRef.current.browseRecords());
        setPaginationModel({
          page: dataSourceRef.current.getCurrentPage(),
          pageSize: dataSourceRef.current.getPageSize(),
        });
        setTotalRecords(dataSourceRef.current.getGrandTotalRecords());
        setTotalPages(Math.ceil(dataSourceRef.current.getGrandTotalRecords() / dataSourceRef.current.getPageSize()));
        setIsLoading(false);
        pendingRefresh.current = false;
        
        // Force update for V1 DataSource
        if (!isDataSourceV2) {
          forceUpdate();
        }

        // Após o refresh, verificar o registro atual do dataSource e atualizar a seleção na grid
        const currentRecord = dataSourceRef.current.getCurrentRecord();
        if (currentRecord) {
          try {
            const recordId = getRowId(currentRecord);
            if (recordId !== undefined) {
              setSelectionModel([recordId]);
              setSelectedRowsData([currentRecord]);
            }
          } catch (e) {
            console.error("Error getting row ID:", e);
          }
        } else {
          // Se não há registro atual, limpar a seleção
          setSelectionModel([]);
          setSelectedRowsData([]);
        }
      }
      // Quando os dados são modificados
      else if (
        event.type === DataSourceEventNames.dataChanged ||
        event.type === DataSourceEventNames.afterRemove ||
        event.type === DataSourceEventNames.afterSave ||
        event.type === DataSourceEventNames.afterAppend ||
        event.type === DataSourceEventNames.afterCancel
      ) {
        setRows(dataSourceRef.current.browseRecords());
        setPaginationModel({
          page: dataSourceRef.current.getCurrentPage(),
          pageSize: dataSourceRef.current.getPageSize(),
        });
        setTotalRecords(dataSourceRef.current.getGrandTotalRecords());
        setTotalPages(Math.ceil(dataSourceRef.current.getGrandTotalRecords() / dataSourceRef.current.getPageSize()));
        setIsLoading(false);
        pendingRefresh.current = false;
        
        // Force update for V1 DataSource
        if (!isDataSourceV2) {
          forceUpdate();
        }
      }
      // Quando o registro atual do dataSource muda
      else if (event.type === DataSourceEventNames.afterScroll) {
        // Ignorar se estamos processando uma seleção interna
        if (internalSelectionChange.current) return;

        const currentRecord = dataSourceRef.current.getCurrentRecord();
        if (currentRecord) {
          try {
            const recordId = getRowId(currentRecord);

            if (recordId !== undefined) {
              // Verificar se este ID já está selecionado
              const isAlreadySelected = selectionModel.some(
                id => String(id) === String(recordId)
              );

              if (!isAlreadySelected) {
                internalSelectionChange.current = true;
                setSelectionModel([recordId]);
                setSelectedRowsData([currentRecord]);

                setTimeout(() => {
                  internalSelectionChange.current = false;
                }, 200);
              }
            }
          } catch (e) {
            console.error("Error processing afterScroll event:", e);
          }
        }
      }
    };

    // Armazenar referência da função listener
    eventListenerRef.current = handleDataSourceEvent;

    // Adicionar o listener ao dataSource
    dataSource.addListener(handleDataSourceEvent);

    // Marcar que a montagem inicial foi concluída após o setup
    isInitialMount.current = false;

    // Sincronizar dados iniciais
    setRows(dataSource.browseRecords());
    setTotalRecords(dataSource.getGrandTotalRecords());
    setTotalPages(Math.ceil(dataSource.getGrandTotalRecords() / (dataSource.getPageSize() || pageSize)));

    // Sincronizar seleção com o registro atual do dataSource
    const currentRecord = dataSource.getCurrentRecord();
    if (currentRecord) {
      try {
        const recordId = getRowId(currentRecord);
        if (recordId !== undefined) {
          setSelectionModel([recordId]);
          setSelectedRowsData([currentRecord]);
        }
      } catch (e) {
        console.error("Error during initial selection setup:", e);
      }
    }

    // Cleanup: remover o listener quando o efeito for limpo
    return () => {
      console.log('Cleaning up DataSource event listener in useGridData');
      if (eventListenerRef.current) {
        dataSource.removeListener(eventListenerRef.current);
        eventListenerRef.current = null;
      }
    };
  }, [dataSource, getRowId, pageSize, forceUpdate, isDataSourceV2]); // Dependências minimizadas para evitar ciclos

  return {
    // Dados
    rows,
    totalRecords,
    totalPages,
    isLoading,
    paginationModel,
    sortModel,
    filterModel,
    selectionModel,
    selectedRowsData,

    // Métodos
    setPaginationModel: handlePaginationModelChange,
    setSortModel: handleSortModelChange,
    setFilterModel: handleFilterModelChange,
    setSelectionModel: handleSelectionModelChange,
    refreshData,
    handleCellKeyDown
  };
}
