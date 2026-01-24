// @ts-nocheck
// ArchbaseDataGrid.tsx - Implementação completa com Detail Panel
/**
 * ArchbaseDataGrid — grid reativo ligado ao DataSource com toolbar, exportação e painéis de detalhe.
 * @status stable
 */
import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  useMemo,
  useCallback
} from 'react'
import {
  DataGrid,
  GridColDef,
  GridRowSelectionModel,
  useGridApiRef,
  GridColumnVisibilityModel,
  GridCellParams,
  GridRowId
} from '@mui/x-data-grid'
import { ptBR } from '@mui/x-data-grid/locales'
import { ActionIcon, Box, Group, Title, useMantineColorScheme } from '@mantine/core'
import { Children, isValidElement } from 'react'
import { ExportConfig, exportData } from '../modals/export-data'
import { PrintConfig, printData } from '../modals/print-data'
import { ExportModal } from '../modals/export-modal'
import { PrintModal } from '../modals/print-modal'
import { getAlignmentByDataType, getRendererByDataType } from './archbase-data-grid-formatters'

// Importar componentes e tipos relacionados
import {
  ArchbaseDataGridProps,
  ArchbaseDataGridColumnProps,
  Columns,
  ArchbaseDataGridRef
} from './archbase-data-grid-types'
import {
  safeGetRowId,
  buildFilterExpression,
  getRgbValues,
  getInitialSortModel,
  convertColumnsToFilterDefinitions,
  convertActiveFiltersToFilterModel
} from './archbase-data-grid-utils'
import { ArchbaseDataGridToolbar } from './archbase-data-grid-toolbar'
import { ArchbaseDataGridPagination } from './archbase-data-grid-pagination'

// Importar componentes específicos do Detail Panel
import {
  ArchbaseDetailPanel,
  ArchbaseDetailModal,
  ArchbaseDetailDrawer
} from './archbase-detail-panel-component'
import { ArchbaseExpandButton, createExpandColumn } from './archbase-expand-button'
import {
  useDetailPanels,
  useDetailPanelAutoClose,
  useDetailPanelPositions,
  useAvailableSpace
} from '../hooks/use-grid-details-panel'
import { IconX } from '@tabler/icons-react'
import { useArchbaseTheme } from '@archbase/core'
import { useArchbaseAppContext } from '@archbase/core'
import { DataSourceEvent, DataSourceEventNames } from '@archbase/data'


// Constante para o limite máximo de pageSize permitido na versão MIT do DataGrid
const MAX_PAGE_SIZE_MIT = 100

/**
 * Helper para detectar se o dataSource é V2
 * V2 tem métodos específicos como appendToFieldArray e updateFieldArrayItem
 */
const isDataSourceV2 = (ds: any): boolean => {
  return ds && ('appendToFieldArray' in ds || 'updateFieldArrayItem' in ds || 'getRecords' in ds);
}

/**
 * Helper para obter registros do dataSource (compatível com V1 e V2)
 */
const getRecordsFromDataSource = <T,>(ds: any): T[] => {
  if (isDataSourceV2(ds)) {
    return ds.getRecords?.() || [];
  }
  return ds.browseRecords?.() || [];
}

/**
 * Helper para obter opções do dataSource (V1 only, V2 retorna objeto vazio)
 */
const getDataSourceOptions = (ds: any): any => {
  if (isDataSourceV2(ds)) {
    return {};
  }
  return ds.getOptions?.() || {};
}

/**
 * Helper para obter página atual (compatível com V1 e V2)
 */
const getCurrentPageFromDataSource = (ds: any): number => {
  // Ambos V1 e V2 agora têm getCurrentPage()
  const page = ds.getCurrentPage?.() ?? 0;
  console.log('[getCurrentPageFromDataSource] isV2:', isDataSourceV2(ds), 'page:', page);
  return page;
}

/**
 * Componente ArchbaseDataGrid - Grid avançada baseada no MUI X DataGrid
 * com toolbar e paginação extraídos para fora da grid para evitar problemas de foco
 *
 * Suporta tanto ArchbaseDataSource (V1) quanto ArchbaseRemoteDataSourceV2 (V2)
 */
function ArchbaseDataGrid<T extends object = any, ID = any>(props: ArchbaseDataGridProps<T, ID>) {
  const {
    dataSource,
    enableColumnResizing = true,
    enableRowNumbers = true,
    enableRowSelection = true,
    enableRowActions = true,
    enableColumnFilterModes = true,
    enableGlobalFilter = true,
    enableTopToolbar = true,
    enableTopToolbarActions = true,
    manualFiltering = true,
    manualPagination = true,
    manualSorting = true,
    isLoading = false,
    isError = false,
    error,
    height = '100%',
    width = '100%',
    pageSize = 15,
    pageIndex = 0,
    children,
    onSelectedRowsChanged,
    onCellDoubleClick,
    getRowId,
    renderRowActions,
    renderToolbarActions,
    renderToolbarInternalActions,
    allowColumnFilters = true,
    allowExportData = true,
    allowPrintData = true,
    withBorder = true,
    withColumnBorders = true,
    highlightOnHover = true,
    striped = false,
    className = '',
    printTitle = 'Data Grid Print',
    logoPrint,
    globalDateFormat = 'dd/MM/yyyy',
    csvOptions,
    toolbarAlignment = 'right',
    positionActionsColumn = 'first',
    toolbarLeftContent,
    columnAutoWidth = false,
    rowHeight = 52,
    paginationLabels,
    onExport,
    onPrint,
    onFilterModelChange,
    showProgressBars = true,
    variant = 'filled',
    fontSize,
    cellPadding,
    renderTopToolbar,
    tableHeadCellPadding,
    bottomToolbarMinHeight,
    gridRef,
    // Propriedades para o detail panel
    renderDetailPanel,
    allowMultipleDetailPanels = false,
    detailPanelMinHeight = 200,
    detailPanelStyle,
    detailPanelClassName,
    onDetailPanelChange,
    detailPanelDisplayMode = 'auto', // 'auto', 'inline', 'modal', 'drawer'
    detailPanelTitle = 'Detalhes',
    detailPanelPosition = 'right',
    detailPanelSize = 'md',
    showPagination = true,
    // Props de segurança
    resourceName,
    resourceDescription,
    columnSecurityOptions,
    // Props para ArchbaseCompositeFilters
    useCompositeFilters = false,
    filterDefinitions: externalFilterDefinitions,
    activeFilters: externalActiveFilters,
    onFiltersChange: externalOnFiltersChange,
    hideMuiFilters = false,
    // Props para controle de bordas internas
    withToolbarBorder = true,
    withPaginationBorder = true,
    toolbarPadding,
    paginationPadding,
  } = props
  const theme = useArchbaseTheme()
  const { colorScheme } = useMantineColorScheme();
  const apiRef = useGridApiRef()
  const appContext = useArchbaseAppContext()

  // 🔐 HOOK DE SEGURANÇA INTERNO
  const useGridSecurity = (resourceName?: string) => {
    const [securityState, setSecurityState] = useState({
      isAvailable: false,
      hasPermission: (permission?: string) => true,
      registerAction: (action?: string, description?: string) => {},
    });

    useEffect(() => {
      // Só ativa segurança SE resourceName fornecido
      if (!resourceName) return;

      try {
        // Tentar usar o contexto de segurança se disponível
        // Por enquanto, apenas simula que sempre tem permissão
        console.debug(`Grid solicitou segurança para '${resourceName}', mas integração ainda em desenvolvimento.`);
        setSecurityState({
          isAvailable: false, // Desabilita por enquanto
          hasPermission: (permission?: string) => true,
          registerAction: (action?: string, description?: string) => {},
        });
      } catch (error) {
        console.debug('Módulo de segurança não disponível');
      }
    }, [resourceName]);

    return securityState;
  };

  const security = useGridSecurity(resourceName);

  // Referência para o contêiner da grid (para detectar cliques e scroll)
  const gridContainerRef = useRef<HTMLDivElement>(null)

  // Referências para os botões de expansão
  const expandButtonRefs = useRef<Map<GridRowId, React.RefObject<HTMLButtonElement>>>(new Map())

  // Detectar versão do DataSource
  const isV2 = isDataSourceV2(dataSource);

  // Estados para dados e funcionalidades da grid
  const [rows, setRows] = useState<T[]>(() => getRecordsFromDataSource<T>(dataSource))
  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>({})
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false)
  const [printModalOpen, setPrintModalOpen] = useState<boolean>(false)
  const [isLoadingInternal, setIsLoadingInternal] = useState<boolean>(false)
  const [rowSelection, setRowSelection] = useState<GridRowSelectionModel>([])
  const [selectedRows, setSelectedRows] = useState<T[]>([])
  const [totalRecords, setTotalRecords] = useState<number>(() => {
    const total = dataSource.getGrandTotalRecords();
    return Number.isFinite(total) ? Math.max(0, total) : 0;
  });

  // Estado para paginação com limitação de tamanho de página (MIT version)
  const [paginationModel, setPaginationModel] = useState({
    page: Number.isFinite(getCurrentPageFromDataSource(dataSource)) ? getCurrentPageFromDataSource(dataSource) : pageIndex,
    pageSize: Math.min(
      Number.isFinite(dataSource?.getPageSize?.()) ? dataSource.getPageSize() : pageSize,
      MAX_PAGE_SIZE_MIT
    )
  });

  const [sortModel, setSortModel] = useState(() => getInitialSortModel(dataSource))
  const dsOptions = getDataSourceOptions(dataSource);
  const [filterModel, setFilterModel] = useState({
    items: dsOptions.originFilter || [],
    quickFilterValues: dsOptions.originGlobalFilter ? [dsOptions.originGlobalFilter] : []
  })

  // Estado interno para ArchbaseCompositeFilters (se não controlado externamente)
  const [internalActiveFilters, setInternalActiveFilters] = useState<typeof externalActiveFilters>([])
  const activeFilters = externalActiveFilters !== undefined ? externalActiveFilters : internalActiveFilters

  // Usar os hooks personalizados para gerenciar os painéis de detalhes
  const {
    expandedRowIds,
    detailPanelHeight,
    detailPanelRefs,
    toggleExpand,
    closeDetailPanel,
    closeAllDetailPanels,
    expandDetailPanel,
    setExpandedRowIds
  } = useDetailPanels({
    allowMultipleDetailPanels,
    onDetailPanelChange,
    detailPanelMinHeight
  })

  // Hook para fechar painéis ao clicar fora ou fazer scroll
  useDetailPanelAutoClose({
    containerRef: gridContainerRef,
    expandedRowIds,
    detailPanelRefs,
    closeAllDetailPanels
  })

  // Verificar espaço disponível
  const shouldUseModal = useAvailableSpace({
    containerRef: gridContainerRef,
    rows,
    getRowId,
    safeGetRowId,
    rowHeight,
    detailPanelMinHeight
  })
  // Refs para controle de operações internas
  const syncInProgress = useRef<boolean>(false)
  const keyboardNavDebounceTimer = useRef<NodeJS.Timeout | null>(null)
  const skipNextFocusSync = useRef<boolean>(false)

  // Limpar timer ao desmontar
  useEffect(() => {
    return () => {
      if (keyboardNavDebounceTimer.current) {
        clearTimeout(keyboardNavDebounceTimer.current)
      }
    }
  }, [])

  // Configurar a sincronização entre o Grid e o DataSource usando o evento cellFocusIn
  useEffect(() => {
    const handleCellFocusChange = (params: any) => {
      // Se já estamos em processo de sincronização ou devemos pular, ignorar
      if (syncInProgress.current || skipNextFocusSync.current) {
        skipNextFocusSync.current = false
        return
      }

      // Se o foco for em uma célula válida (não header)
      if (params.id !== undefined && params.field) {
        try {
          // Obter os dados da linha a partir do id
          const row = apiRef.current.getRow(params.id)

          if (row) {
            // Sincronizar com o dataSource
            syncInProgress.current = true

            // Ir para o registro correspondente no DataSource (V1 e V2)
            if (dataSource.gotoRecordByData) {
              dataSource.gotoRecordByData(row)
            }

            // Resetar flag após um breve delay
            setTimeout(() => {
              syncInProgress.current = false
            }, 100)
          }
        } catch (error) {
          console.error('[FOCUS] Erro ao sincronizar com DataSource:', error)
          syncInProgress.current = false
        }
      }
    }

    // Registrar o listener para o evento de mudança de foco
    let focusInSubscription: any = null

    if (apiRef.current) {
      focusInSubscription = apiRef.current.subscribeEvent('cellFocusIn', handleCellFocusChange)
    }

    // Limpar a inscrição quando o componente for desmontado
    return () => {
      if (focusInSubscription) {
        focusInSubscription()
      }
    }
  }, [apiRef, dataSource])

  // Handler para clique duplo em célula
  const handleCellDoubleClick = (params: GridCellParams) => {
    if (onCellDoubleClick) {
      // Obter os dados da linha
      const rowData = params.row as T

      onCellDoubleClick({
        id: params.id,
        columnName: params.field,
        rowData
      })
    }
  }

  // Handler para mudança na seleção da linha
  const handleSelectionModelChange = (newSelectionModel: GridRowSelectionModel) => {
    // Se já estamos em processo de sincronização, ignorar
    if (syncInProgress.current) return

    skipNextFocusSync.current = true
    setRowSelection(newSelectionModel)

    // Mapear IDs selecionados para objetos de dados
    const selected: T[] = []
    newSelectionModel.forEach((id) => {
      const rowData = rows.find((row) => {
        try {
          return String(safeGetRowId(row, getRowId)) === String(id)
        } catch (e) {
          return false
        }
      })

      if (rowData) {
        selected.push(rowData)
      }
    })

    setSelectedRows(selected)

    // Notificar sobre a mudança de seleção
    if (onSelectedRowsChanged) {
      onSelectedRowsChanged(selected)
    }

    // Se temos exatamente uma linha, atualizar o dataSource (V1 e V2)
    if (selected.length === 1 && dataSource.gotoRecordByData) {
      syncInProgress.current = true

      try {
        // Tentar ir para o registro no dataSource
        dataSource.gotoRecordByData(selected[0])
      } catch (error) {
        console.error('[SELECTION] Erro ao atualizar dataSource:', error)
      }

      // Resetar a flag após um breve delay
      setTimeout(() => {
        syncInProgress.current = false
      }, 100)
    }
  }

  // Métodos para exportação e impressão com modais
  const handleExportClick = () => {
    setExportModalOpen(true)
  }

  const handlePrintClick = () => {
    setPrintModalOpen(true)
  }

  const handleExportConfirm = (exportConfig: ExportConfig) => {
    exportData(rows, columns, exportConfig)
    setExportModalOpen(false)
  }

  const handlePrintConfirm = (printConfig: PrintConfig) => {
    printData(rows, columns, printConfig)
    setPrintModalOpen(false)
  }

  // Métodos para atualização de dados
  const handleRefresh = () => {
    // V2: Agora também chama refreshData no dataSource
    if (isV2) {
      // Construir a expressão de filtro
      const filter = buildFilterExpression(filterModel, columns)
      const originGlobalFilter =
        filterModel.quickFilterValues && filterModel.quickFilterValues.length > 0
          ? filterModel.quickFilterValues[0]
          : ''

      console.log('[REFRESH V2] Refresh com filtro global:', originGlobalFilter);

      setIsLoadingInternal(true)
      ;(dataSource as any).refreshData?.({
        currentPage: paginationModel.page,
        pageSize: paginationModel.pageSize,
        filter: filter,
        originFilter: filterModel.items,
        originGlobalFilter: originGlobalFilter
      })
      closeAllDetailPanels()
      return
    }

    // V1: Comportamento original
    const options = getDataSourceOptions(dataSource)

    // Reutilizar o filtro atual
    options.filter = buildFilterExpression(filterModel, columns)
    options.originFilter = filterModel.items

    // Garantir que o filtro global seja preservado
    options.originGlobalFilter =
      filterModel.quickFilterValues && filterModel.quickFilterValues.length > 0
        ? filterModel.quickFilterValues[0]
        : ''

    console.log('[REFRESH] Refresh com filtro global:', options.originGlobalFilter);

    // Indicar que estamos carregando
    setIsLoadingInternal(true);

    // Aplicar a atualização com os filtros
    (dataSource as any).refreshData?.(options);

    // Fechar todos os painéis de detalhes
    closeAllDetailPanels()
  }

  const handlePaginationChange = (newPaginationModel: { page: number; pageSize: number }) => {
    console.log('[PAGINATION] Mudou pagination model ', newPaginationModel.page, newPaginationModel.pageSize, 'isV2:', isV2)
    // Garantir que o pageSize não exceda o limite
    const safePageSize = Math.min(newPaginationModel.pageSize, MAX_PAGE_SIZE_MIT)

    setPaginationModel({
      page: newPaginationModel.page,
      pageSize: safePageSize
    })

    // V2: Agora também chama refreshData para recarregar dados
    if (isV2) {
      console.log('[PAGINATION V2] Chamando refreshData com page:', newPaginationModel.page, 'size:', safePageSize)
      setIsLoadingInternal(true)
      ;(dataSource as any).refreshData?.({
        currentPage: newPaginationModel.page,
        pageSize: safePageSize
      })
      closeAllDetailPanels()
      return
    }

    // V1: Comportamento original
    const options = getDataSourceOptions(dataSource)
    options.currentPage = newPaginationModel.page
    options.pageSize = safePageSize

    setIsLoadingInternal(true)
    ;(dataSource as any).refreshData?.(options)

    // Fechar todos os painéis de detalhes ao mudar de página
    closeAllDetailPanels()
  }

  const handleSortModelChange = (newSortModel: any) => {
    setSortModel(newSortModel)

    // V2: Agora também chama refreshData para recarregar dados com nova ordenação
    if (isV2) {
      const sortFields = newSortModel.map((sort: any) => `${sort.field}:${sort.sort}`)
      setIsLoadingInternal(true)
      ;(dataSource as any).refreshData?.({
        currentPage: paginationModel.page,
        pageSize: paginationModel.pageSize,
        sort: sortFields
      })
      closeAllDetailPanels()
      return
    }

    // V1: Comportamento original
    const options = getDataSourceOptions(dataSource)
    options.sort = newSortModel.map((sort: any) => `${sort.field}:${sort.sort}`)
    options.originSort = newSortModel

    setIsLoadingInternal(true)
    ;(dataSource as any).refreshData?.(options)

    // Fechar todos os painéis de detalhes ao mudar a ordenação
    closeAllDetailPanels()
  }

  const handleFilterModelChange = (newFilterModel: any) => {
    // Atualizar o estado do filtro primeiro
    setFilterModel(newFilterModel)

    // Notificar callback externo (parent component) se fornecido
    if (onFilterModelChange) {
      onFilterModelChange(newFilterModel)
    }

    // Certificar que estamos usando o valor mais recente
    console.log('[FILTER] Aplicando filtro:', newFilterModel)

    // V2: Agora também chama refreshData para recarregar dados com filtro
    if (isV2) {
      setPaginationModel((prev) => ({ ...prev, page: 0 }))

      // Construir a expressão de filtro
      const filter = buildFilterExpression(newFilterModel, columns)
      const originGlobalFilter =
        newFilterModel.quickFilterValues && newFilterModel.quickFilterValues.length > 0
          ? newFilterModel.quickFilterValues[0]
          : ''

      console.log('[FILTER V2] filter construído:', filter, 'tipo:', typeof filter)
      console.log('[FILTER V2] originGlobalFilter:', originGlobalFilter)

      setIsLoadingInternal(true)
      ;(dataSource as any).refreshData?.({
        currentPage: 0,
        pageSize: paginationModel.pageSize,
        filter: filter,
        originFilter: newFilterModel.items,
        originGlobalFilter: originGlobalFilter
      })
      closeAllDetailPanels()
      return
    }

    // V1: Comportamento original
    const options = getDataSourceOptions(dataSource)

    // Construir a expressão de filtro
    options.filter = buildFilterExpression(newFilterModel, columns)
    options.originFilter = newFilterModel.items

    // Salvar o valor do filtro global para uso posterior
    options.originGlobalFilter =
      newFilterModel.quickFilterValues && newFilterModel.quickFilterValues.length > 0
        ? newFilterModel.quickFilterValues[0]
        : ''

    console.log('[FILTER] Filtro global definido como:', options.originGlobalFilter)

    // Voltar para a primeira página ao aplicar filtro
    options.currentPage = 0
    setPaginationModel((prev) => ({ ...prev, page: 0 }))

    // Indicar que estamos carregando
    setIsLoadingInternal(true)

    // Aplicar o filtro no dataSource
    ;(dataSource as any).refreshData?.(options)

    // Fechar todos os painéis de detalhes ao filtrar
    closeAllDetailPanels()
  }

  // Handler para mudança nos filtros compostos (ArchbaseCompositeFilters)
  const handleCompositeFiltersChange = useCallback((filters: any[], rsql?: string) => {
    console.log('[COMPOSITE FILTERS] Filtros alterados:', filters, 'RSQL:', rsql)

    // Atualizar estado interno se não controlado externamente
    if (externalActiveFilters === undefined) {
      setInternalActiveFilters(filters)
    }

    // Chamar callback externo se fornecido
    if (externalOnFiltersChange) {
      externalOnFiltersChange(filters, rsql)
    }

    // Se tivermos RSQL, converter para filterModel do MUI e aplicar
    if (rsql || (filters && filters.length > 0)) {
      // Converter activeFilters para filterModel
      const newFilterModel = convertActiveFiltersToFilterModel(filters || [])

      // Atualizar o filterModel para manter sincronia com o MUI
      setFilterModel(newFilterModel)

      // Aplicar o filtro no dataSource
      if (isV2) {
        setPaginationModel((prev) => ({ ...prev, page: 0 }))

        setIsLoadingInternal(true)
        ;(dataSource as any).refreshData?.({
          currentPage: 0,
          pageSize: paginationModel.pageSize,
          filter: rsql,
          originFilter: newFilterModel.items,
          originGlobalFilter: undefined // RSQL substitui o filtro global
        })
        closeAllDetailPanels()
        return
      }

      // V1: Comportamento original
      const options = getDataSourceOptions(dataSource)
      options.filter = rsql
      options.originFilter = newFilterModel.items
      options.currentPage = 0

      setIsLoadingInternal(true)
      ;(dataSource as any).refreshData?.(options)

      closeAllDetailPanels()
    } else {
      // Se não há filtros, limpar
      setFilterModel({ items: [], quickFilterValues: [] })

      if (isV2) {
        setIsLoadingInternal(true)
        ;(dataSource as any).refreshData?.({
          currentPage: 0,
          pageSize: paginationModel.pageSize,
          filter: undefined,
          originFilter: [],
          originGlobalFilter: undefined
        })
        closeAllDetailPanels()
        return
      }

      const options = getDataSourceOptions(dataSource)
      options.filter = undefined
      options.originFilter = []

      setIsLoadingInternal(true)
      ;(dataSource as any).refreshData?.(options)

      closeAllDetailPanels()
    }
  }, [externalActiveFilters, externalOnFiltersChange, isV2, dataSource, paginationModel.pageSize])

  // Registrar funções de exportação e impressão nos callbacks, se fornecidos
  useEffect(() => {
    if (onExport) {
      onExport(handleExportClick)
    }
    if (onPrint) {
      onPrint(handlePrintClick)
    }
  }, [onExport, onPrint])

  // Expor métodos via ref - Correção para tipos
  useImperativeHandle<any, ArchbaseDataGridRef<T>>(
    gridRef,
    () => ({
      refreshData: handleRefresh,
      getSelectedRows: () => selectedRows,
      clearSelection: () => {
        setRowSelection([])
        setSelectedRows([])
      },
      exportData: handleExportClick,
      printData: handlePrintClick,
      // Métodos adicionais para o detail panel
      expandRow: (rowId: GridRowId) => expandDetailPanel(rowId),
      collapseRow: (rowId: GridRowId) => closeDetailPanel(rowId),
      collapseAllRows: closeAllDetailPanels,
      getExpandedRows: () => Array.from(expandedRowIds),
      getFilterModel: () => filterModel
    }),
    [selectedRows, expandedRowIds, expandDetailPanel, closeDetailPanel, closeAllDetailPanels, filterModel]
  )

  // Configurar estilos personalizados para o grid
  const getThemedStyles = () => {
    return {
      root: {
        height: '100%', // Garante que o DataGrid ocupe toda a altura do container
        border: withBorder
          ? `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 8 : 3]}`
          : '0',
        borderRadius: theme.radius.sm,
        overflow: 'hidden', // Garante que o conteúdo respeite o border-radius
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        color: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[9],

        // Scrollbar customizada do MUI DataGrid - estilo Mantine (mais fina e elegante)
        '& .MuiDataGrid-scrollbar': {
          '&.MuiDataGrid-scrollbar--horizontal': {
            height: '8px !important',
          },
          '&.MuiDataGrid-scrollbar--vertical': {
            width: '8px !important',
          },
          backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
          borderRadius: '4px',
          '& .MuiDataGrid-scrollbarContent': {
            borderRadius: '4px',
          },
        },

        // Scrollbar nativa (fallback) - estilo Mantine
        '& .MuiDataGrid-virtualScroller': {
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[5],
            },
          },
          // Firefox
          scrollbarWidth: 'thin',
          scrollbarColor: colorScheme === 'dark'
            ? `${theme.colors.dark[3]} ${theme.colors.dark[6]}`
            : `${theme.colors.gray[4]} ${theme.colors.gray[1]}`,
        },

        fontSize:
          typeof fontSize === 'string' &&
          ['xs', 'sm', 'md', 'lg', 'xl'].includes(fontSize as string)
            ? theme.fontSizes[fontSize as 'xs' | 'sm' | 'md' | 'lg' | 'xl']
            : theme.fontSizes.sm,

        // Estilos dos cabeçalhos
        '& .MuiDataGrid-columnHeaders': {
          backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          color:
            colorScheme === 'dark'
              ? theme.colors.gray[0]
              : theme.colors[theme.primaryColor][6],
          fontWeight: 600
        },

        // Estilos das células
        '& .MuiDataGrid-cell': {
          borderRight: withColumnBorders
            ? `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 3]}`
            : 'none',
          padding: typeof cellPadding === 'number' ? `${cellPadding}px` : cellPadding || '4px',
          color: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[9]
        },

        // Estilos das linhas
        '& .MuiDataGrid-row': {
          backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
          color: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[9],
          '&:hover': {
            backgroundColor: highlightOnHover
              ? colorScheme === 'dark'
                ? theme.colors.dark[5]
                : theme.colors.gray[1]
              : 'inherit'
          },
          '&.Mui-selected': {
            backgroundColor: `rgba(${getRgbValues(
              theme.colors[theme.primaryColor][colorScheme === 'dark' ? 9 : 1]
            )}, ${colorScheme === 'dark' ? 0.8 : 0.1})`,
            '&:hover': {
              backgroundColor: `rgba(${getRgbValues(
                theme.colors[theme.primaryColor][colorScheme === 'dark' ? 8 : 2]
              )}, ${colorScheme === 'dark' ? 0.4 : 0.15})`
            }
          },
          '&:nth-of-type(even)': {
            backgroundColor: striped
              ? colorScheme === 'dark'
                ? theme.colors.dark[5]
                : theme.colors.gray[0]
              : 'inherit'
          }
        },

        // Melhorando a visibilidade do checkbox
        '& .MuiCheckbox-root': {
          color: colorScheme === 'dark' ? theme.colors.gray[3] : theme.colors.dark[6],
          '&.Mui-checked': {
            color:
              colorScheme === 'dark'
                ? theme.colors[theme.primaryColor][5]
                : theme.colors[theme.primaryColor][7]
          }
        },

        // Células selecionadas (diferente da célula com foco)
        '& .MuiDataGrid-cell.MuiDataGrid-cell--selected': {
          backgroundColor: 'transparent', // Remover destaque padrão do MUI
          color: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[9],
          outline: 'none'
        },

        '& .MuiDataGrid-cell:focus': {
          backgroundColor: theme.colors[theme.primaryColor][6],
          color: theme.white
        },

        // Estilos específicos para o painel de detalhes
        '& .detail-panel-container': {
          borderTop: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 3]}`,
          backgroundColor:
            colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
          padding: theme.spacing.md,
          width: '100%'
        },
        
        '& .MuiDataGrid-virtualScroller': {
          paddingBottom: '14px !important'
        }
      }
    }
  }

  // Calcular a altura total da grid, incluindo os painéis de detalhes
  const gridHeight = useMemo(() => {
    // Se a altura for uma string (e.g., '100%'), retorna a string diretamente
    if (typeof height === 'string') {
      return height
    }

    // Se a altura for um número, ajusta para incluir a altura dos painéis de detalhes
    return Math.max(height as number, (height as number) + detailPanelHeight)
  }, [height, detailPanelHeight])

  // Extrai as colunas dos children
  const columns = useMemo(() => {
    const columnsDefs: GridColDef[] = []

    // Objeto para armazenar metadados personalizados
    const columnMetadata = {} as Record<string, any>

    // Adiciona coluna de expansão se renderDetailPanel estiver disponível
    if (renderDetailPanel) {
      columnsDefs.push(createExpandColumn(expandedRowIds, toggleExpand, expandButtonRefs.current))
    }

    // Adiciona coluna de ações se necessário
    if (enableRowActions && renderRowActions) {
      const actionsColumn :any = {
        field: 'actions',
        headerName: 'Ações',
        type: 'string' as const,
        sortable: false,
        filterable: false,
        width: 60,
        renderCell: (params) => renderRowActions(params.row as T)
      }

      // Adicionar no início ou no final conforme a configuração
      if (positionActionsColumn === 'first') {
        columnsDefs.unshift(actionsColumn)
      } else {
        columnsDefs.push(actionsColumn)
      }

      // Adicionar aos metadados também
      columnMetadata['actions'] = {
        enableGlobalFilter: false
      }
    }

    // Extrai definições de colunas dos children com SEGURANÇA
    Children.forEach(children, (child) => {
      if ((isValidElement(child) && child.type === Columns)) {
        Children.forEach((child.props as any).children, (column) => {
          if (isValidElement(column)) {
            // Tratamos column.props como desconhecido e fornecemos tipagem explícita
            const columnProps = column.props as ArchbaseDataGridColumnProps<any>

            // 🔐 VERIFICAR SEGURANÇA DA COLUNA
            const permissionName = columnProps.viewPermission ? 
              (columnSecurityOptions?.permissionPrefix ? 
                `${columnSecurityOptions.permissionPrefix}${columnProps.viewPermission}` : 
                columnProps.viewPermission) : 
              undefined;

            const hasColumnPermission = !security.isAvailable || 
                                       !permissionName || 
                                       security.hasPermission(permissionName);

            // SE NÃO TEM PERMISSÃO E deve ocultar completamente
            if (!hasColumnPermission && columnProps.hideWhenNoPermission) {
              return; // Pula esta coluna completamente
            }

            if (columnProps.visible !== false) {
              // Auto-registrar permissão se solicitado
              if (security.isAvailable && 
                  columnProps.autoRegisterPermission !== false && 
                  permissionName) {
                security.registerAction(
                  permissionName, 
                  `Visualizar coluna ${columnProps.header}`
                );
              }

              // Armazenar metadados personalizados
              columnMetadata[columnProps.dataField] = {
                enableGlobalFilter: columnProps.enableGlobalFilter,
                dataType: columnProps.dataType
              }

              // Obter o renderizador adequado para o tipo de dados
              const originalRenderer = getRendererByDataType(columnProps.dataType, columnProps.render, {
                maskOptions: columnProps.maskOptions,
                dateFormat: appContext?.dateFormat || globalDateFormat,
                dateTimeFormat: appContext?.dateTimeFormat,
                timeFormat: 'HH:mm:ss',
                enumValues: columnProps.enumValues,
                decimalPlaces: 2 // Padrão para campos percentuais ou decimais
              })

              // 🔐 CRIAR RENDERIZADOR SEGURO
              const secureRenderer = (params: any) => {
                // Se não tem permissão, mostrar fallback
                if (!hasColumnPermission) {
                  const fallback = columnProps.fallbackContent || 
                                 columnSecurityOptions?.defaultFallback || 
                                 '***';
                  return typeof fallback === 'string' ? 
                    <span style={{ color: '#999', fontStyle: 'italic' }}>{fallback}</span> : 
                    fallback;
                }
                
                // Se tem permissão, renderizar normalmente
                return originalRenderer(params);
              };

              // Obter o alinhamento adequado para o tipo de dados
              const alignment = getAlignmentByDataType(columnProps.dataType, columnProps.align)

              columnsDefs.push({
                field: columnProps.dataField,
                headerName: columnProps.header,
                width: columnProps.size || 150,
                minWidth: columnProps.minSize,
                maxWidth: columnProps.maxSize,
                sortable: columnProps.enableSorting !== false,
                filterable: columnProps.enableColumnFilter !== false,
                editable: false,
                flex: columnAutoWidth ? 1 : undefined,
                // 🔐 Usar o renderizador seguro
                renderCell: (params) => {
                  return (
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent:
                          alignment === 'left'
                            ? 'flex-start'
                            : alignment === 'right'
                            ? 'flex-end'
                            : 'center',
                        alignItems: 'center'
                      }}
                    >
                      {secureRenderer({
                        getValue: () => params.value,
                        row: params.row
                      })}
                    </div>
                  )
                },
                valueGetter: (value, row, column) => {
                  // Suporte para caminhos aninhados (user.address.street)
                  if (columnProps.dataField.includes('.')) {
                    const parts = columnProps.dataField.split('.')
                    let result = row
                    for (const part of parts) {
                      if (result && typeof result === 'object') {
                        result = result[part]
                      } else {
                        return undefined
                      }
                    }
                    return result
                  }
                  return row[columnProps.dataField]
                }
              })
            }
          }
        })
      }
    })

    // Adicionar metadados às colunas de forma segura
    columnsDefs.forEach((col) => {
      const metadata = columnMetadata[col.field]
      if (metadata) {
        ;(col as any).enableGlobalFilter = metadata.enableGlobalFilter
        ;(col as any).dataType = metadata.dataType
      }
    })

    return columnsDefs
  }, [
    children,
    enableRowActions,
    columnAutoWidth,
    renderRowActions,
    appContext?.dateFormat,
    appContext?.dateTimeFormat,
    globalDateFormat,
    positionActionsColumn,
    renderDetailPanel,
    expandedRowIds,
    toggleExpand,
    // Dependências de segurança
    security,
    columnSecurityOptions
  ])

  // Gerar automaticamente as definições de filtro a partir das colunas
  const autoGeneratedFilterDefinitions = useMemo(() => {
    if (externalFilterDefinitions) {
      return externalFilterDefinitions
    }
    return convertColumnsToFilterDefinitions(columns, {
      excludeColumns: ['actions', 'id'],
      onlyFilterable: true
    })
  }, [columns, externalFilterDefinitions])

  // Listener para eventos do DataSource
  useEffect(() => {
    const handleDataSourceEvent = (event: DataSourceEvent<T>) => {
      // Quando os dados são atualizados
      if (event.type === DataSourceEventNames.refreshData) {
        setRows(getRecordsFromDataSource<T>(dataSource));

      // Validar valores da paginação
      const currentPage = Number.isFinite(getCurrentPageFromDataSource(dataSource))
        ? getCurrentPageFromDataSource(dataSource)
        : 0;

      const pageSize = Number.isFinite(dataSource.getPageSize?.())
        ? Math.min(Math.max(1, dataSource.getPageSize()), MAX_PAGE_SIZE_MIT)
        : 10;

      setPaginationModel({
        page: currentPage,
        pageSize: pageSize
      });

      // Validar o total de registros
      const grandTotal = Number.isFinite(dataSource.getGrandTotalRecords?.())
        ? Math.max(0, dataSource.getGrandTotalRecords())
        : 0;

      setTotalRecords(grandTotal);
      setIsLoadingInternal(false);

      // Fechar todos os painéis quando os dados são atualizados
      closeAllDetailPanels();
      }
      // Quando os dados são modificados
      else if (
        event.type === DataSourceEventNames.dataChanged ||
        event.type === DataSourceEventNames.afterRemove ||
        event.type === DataSourceEventNames.afterSave ||
        event.type === DataSourceEventNames.afterAppend ||
        event.type === DataSourceEventNames.afterCancel
      ) {
        setRows(getRecordsFromDataSource<T>(dataSource));

      // Validar valores da paginação
      const currentPage = Number.isFinite(getCurrentPageFromDataSource(dataSource))
        ? getCurrentPageFromDataSource(dataSource)
        : 0;

      const pageSize = Number.isFinite(dataSource.getPageSize?.())
        ? Math.min(Math.max(1, dataSource.getPageSize()), MAX_PAGE_SIZE_MIT)
        : 10;

      setPaginationModel({
        page: currentPage,
        pageSize: pageSize
      });

      // Validar o total de registros
      const grandTotal = Number.isFinite(dataSource.getGrandTotalRecords?.())
        ? Math.max(0, dataSource.getGrandTotalRecords())
        : 0;

      setTotalRecords(grandTotal);
      setIsLoadingInternal(false);

      // Fechar todos os painéis quando os dados são modificados
      closeAllDetailPanels();
      }
      // Quando o registro atual do dataSource muda
      else if (event.type === DataSourceEventNames.afterScroll) {
        // Ignorar se estamos em um processo de sincronização iniciado pela grid
        if (syncInProgress.current) return

        const currentRecord = dataSource.getCurrentRecord()
        if (currentRecord) {
          try {
            const currentId = safeGetRowId(currentRecord, getRowId)

            if (currentId !== undefined) {
              // Encontrar a primeira coluna disponível
              const firstField = columns[0]?.field

              if (firstField && apiRef.current) {
                // Iniciar o processo de sincronização
                syncInProgress.current = true

                try {
                  // Tentar atualizar a seleção para refletir o registro atual
                  const newSelection = [currentId]
                  setRowSelection(newSelection)

                  // Encontrar o objeto de linha e atualizá-lo na lista de linhas selecionadas
                  const rowData = rows.find(
                    (row) => String(safeGetRowId(row, getRowId)) === String(currentId)
                  )

                  if (rowData) {
                    setSelectedRows([rowData])

                    if (onSelectedRowsChanged) {
                      onSelectedRowsChanged([rowData])
                    }
                  }

                  // Opcional: também atualizar o foco para a célula
                  setTimeout(() => {
                    try {
                      apiRef.current.scrollToIndexes({
                        rowIndex: rows.findIndex(
                          (row) => String(safeGetRowId(row, getRowId)) === String(currentId)
                        )
                      })
                      apiRef.current.setCellFocus(currentId, firstField)
                    } catch (error) {
                      console.error('[DATASOURCE] Erro ao ajustar foco:', error)
                    }

                    // Resetar a flag de sincronização
                    syncInProgress.current = false
                  }, 100)
                } catch (error) {
                  console.error('[DATASOURCE] Erro ao processar afterScroll:', error)
                  syncInProgress.current = false
                }
              }
            }
          } catch (error) {
            console.error('[DATASOURCE] Erro ao processar afterScroll:', error)
            syncInProgress.current = false
          }
        }
      }
    }

    // Adicionar listener ao dataSource
    dataSource.addListener(handleDataSourceEvent)

    // Cleanup: remover o listener quando o componente for desmontado
    return () => {
      dataSource.removeListener(handleDataSourceEvent)
    }
  }, [dataSource, getRowId, columns, rows, apiRef, onSelectedRowsChanged, closeAllDetailPanels])

  // Criar os modais para exportação e impressão
  const modalColumns = useMemo(() => {
    return columns.map((col) => ({
      id: col.field,
      title: col.headerName || col.field
    }))
  }, [columns])

  const renderFixedDetailPanel = () => {
    if (!renderDetailPanel || expandedRowIds.size === 0) return null

    // Pegar apenas o primeiro rowId expandido
    const rowId = Array.from(expandedRowIds)[0]
    const rowData = rows.find((row) => String(safeGetRowId(row, getRowId)) === String(rowId))

    if (!rowData) return null

    // Determinar o título do painel
    const panelTitle =
      typeof detailPanelTitle === 'function' ? detailPanelTitle(rowId, rowData) : detailPanelTitle

    // Gerar o conteúdo do painel usando a função renderDetailPanel
    const detailContent = renderDetailPanel({ row: rowData })

    return (
      <div
        key={`fixed-detail-panel-${rowId}`}
        ref={(el) => {
          if (el) detailPanelRefs.current.set(rowId, el)
        }}
        style={{
          width: '100%',
          borderBottom: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 3]}`,
          marginBottom: '8px',
          zIndex: 2
        }}
      >
        <Box
          className={`detail-panel-container ${detailPanelClassName || ''}`}
          style={{
            padding: 8,
            backgroundColor:
              colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
            borderTop: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 3]}`,
            width: '100%',
            ...(detailPanelStyle || {})
          }}
        >
          <Group justify="apart" mb="xs">
            <Title order={4} style={{ fontSize: '1rem', fontWeight: 500 }}>
              {panelTitle}
            </Title>
            <ActionIcon onClick={() => closeDetailPanel(rowId)} size="sm" color="gray">
              <IconX size={16} />
            </ActionIcon>
          </Group>

          <Box>{detailContent}</Box>
        </Box>
      </div>
    )
  }

  const renderFloatingDetailPanels = () => {
    if (!renderDetailPanel || expandedRowIds.size === 0) return null

    return Array.from(expandedRowIds).map((rowId) => {
      const rowData = rows.find((row) => String(safeGetRowId(row, getRowId)) === String(rowId))
      if (!rowData) return null

      // Determinar o título do painel
      const panelTitle =
        typeof detailPanelTitle === 'function' ? detailPanelTitle(rowId, rowData) : detailPanelTitle

      // Renderizar de acordo com o modo explicitamente definido
      // Sem conversão automática de drawer para modal
      if (detailPanelDisplayMode === 'modal') {
        return (
          <ArchbaseDetailModal
            key={`detail-modal-${rowId}`}
            rowId={rowId}
            rowData={rowData}
            renderDetailPanel={renderDetailPanel}
            onClose={closeDetailPanel}
            theme={theme}
            className={detailPanelClassName}
            style={detailPanelStyle}
            opened={expandedRowIds.has(rowId)}
            title={panelTitle}
          />
        )
      } else if (detailPanelDisplayMode === 'drawer') {
        return (
          <ArchbaseDetailDrawer
            key={`detail-drawer-${rowId}`}
            rowId={rowId}
            rowData={rowData}
            renderDetailPanel={renderDetailPanel}
            onClose={closeDetailPanel}
            theme={theme}
            className={detailPanelClassName}
            style={detailPanelStyle}
            opened={expandedRowIds.has(rowId)}
            title={panelTitle}
            position={detailPanelPosition}
            size={detailPanelSize}
          />
        )
      } else if (detailPanelDisplayMode === 'auto') {
        // No modo auto, escolher entre modal e inline baseado no shouldUseModal
        if (shouldUseModal) {
          return (
            <ArchbaseDetailModal
              key={`detail-modal-${rowId}`}
              rowId={rowId}
              rowData={rowData}
              renderDetailPanel={renderDetailPanel}
              onClose={closeDetailPanel}
              theme={theme}
              className={detailPanelClassName}
              style={detailPanelStyle}
              opened={expandedRowIds.has(rowId)}
              title={panelTitle}
            />
          )
        }
        // Se shouldUseModal for false no modo auto, não renderizamos nada aqui
        // porque renderFixedDetailPanel já cuidará disso
        return null
      }

      // Caso default: não renderizar nada (inline será tratado por renderFixedDetailPanel)
      return null
    })
  }

  // Renderização do componente com toolbar e paginação extraídas
  return (
    <Box
      className={`archbase-data-grid ${className}`}
      ref={gridContainerRef}
      style={{
        height: gridHeight,
        width: width,
        position: 'relative',
        color: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[9],
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Toolbar extraída para fora da grid */}
      {enableTopToolbar && (
        <ArchbaseDataGridToolbar
          dataSource={dataSource}
          filterModel={filterModel}
          enableGlobalFilter={enableGlobalFilter}
          enableTopToolbarActions={enableTopToolbarActions}
          allowExportData={allowExportData}
          allowPrintData={allowPrintData}
          toolbarAlignment={toolbarAlignment}
          toolbarLeftContent={toolbarLeftContent}
          renderToolbarActions={renderToolbarActions}
          renderToolbarInternalActions={renderToolbarInternalActions}
          theme={theme}
          onFilterModelChange={handleFilterModelChange}
          onRefresh={handleRefresh}
          onExport={handleExportClick}
          onPrint={handlePrintClick}
          apiRef={apiRef}
          children={children}
          // Props para ArchbaseCompositeFilters
          useCompositeFilters={useCompositeFilters}
          filterDefinitions={autoGeneratedFilterDefinitions}
          activeFilters={activeFilters}
          onFiltersChange={handleCompositeFiltersChange}
          hideMuiFilters={hideMuiFilters}
          // Props para controle de bordas
          withBorder={withToolbarBorder}
          padding={toolbarPadding}
        />
      )}

      {/* Detail Panel fixo (apenas no modo inline ou auto com espaço suficiente) */}
      {(detailPanelDisplayMode === 'inline' ||
        (detailPanelDisplayMode === 'auto' && !shouldUseModal)) &&
        renderFixedDetailPanel()}

      {/* Grid sem toolbar interna */}
      <Box style={{ flex: 1, overflow: 'hidden', position: 'relative', minHeight: 0 }}>
        <DataGrid
          apiRef={apiRef}
          rows={rows}
          density="compact"
          columns={columns}
          loading={isLoadingInternal || isLoading}
          pagination
          paginationMode="server"
          filterMode="server"
          sortingMode="server"
          rowCount={totalRecords}
          paginationModel={paginationModel}
          onPaginationModelChange={handlePaginationChange}
          sortModel={sortModel}
          onSortModelChange={handleSortModelChange}
          filterModel={filterModel}
          onFilterModelChange={handleFilterModelChange}
          rowHeight={rowHeight}
          checkboxSelection={enableRowSelection}
          rowSelectionModel={rowSelection}
          columnVisibilityModel={columnVisibilityModel}
          onRowSelectionModelChange={handleSelectionModelChange}
          onCellDoubleClick={handleCellDoubleClick}
          onColumnVisibilityModelChange={setColumnVisibilityModel}
          getRowId={(row) => safeGetRowId(row, getRowId) || ''}
          sx={getThemedStyles().root}
          disableColumnFilter={!allowColumnFilters}
          disableColumnMenu={true}
          slots={{
            // Removemos os slots de toolbar e paginação pois eles agora estão fora da grid
            toolbar: null,
            pagination: null
          }}
          // Adicionando internacionalização em português
          localeText={ptBR.components.MuiDataGrid.defaultProps.localeText}
          // Configurações importantes para separar foco de seleção
          disableRowSelectionOnClick={true} // NÃO selecionar linha ao clicar na célula
          isRowSelectable={(params) => (enableRowSelection ? true : false)}
        />
      </Box>

      {/* Paginação extraída para fora da grid */}
      {showPagination?<ArchbaseDataGridPagination
        paginationModel={paginationModel}
        totalRecords={totalRecords}
        onPaginationModelChange={handlePaginationChange}
        paginationLabels={paginationLabels}
        bottomToolbarMinHeight={bottomToolbarMinHeight}
        theme={theme}
        // Props para controle de bordas
        withBorder={withPaginationBorder}
        padding={paginationPadding}
      />:null}

      {/* Painéis de detalhes nos modos não-inline (modal/drawer) */}
      {renderFloatingDetailPanels()}

      {/* Modais de exportação e impressão */}
      <ExportModal
        opened={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExportConfirm}
        columns={modalColumns}
        defaultConfig={{
          filename: printTitle || 'export',
          dateFormat: globalDateFormat
        }}
      />

      <PrintModal
        opened={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        onPrint={handlePrintConfirm}
        columns={modalColumns}
        defaultConfig={{
          title: printTitle,
          orientation: 'landscape',
          pageSize: 'A4'
        }}
      />
    </Box>
  )
}

export default ArchbaseDataGrid
