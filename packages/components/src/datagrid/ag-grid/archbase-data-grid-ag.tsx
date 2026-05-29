/**
 * ArchbaseDataGridAG - AG Grid Implementation
 *
 * Grid component using AG Grid Community with Mantine theme integration.
 * API compatible with the MUI DataGrid version for easy migration.
 */
import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  useMemo,
  useCallback,
  Children,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from 'react';

/**
 * Returns a stable reference to `children` as long as the structural shape
 * (number of valid elements, their `type` and `key`) does not change.
 *
 * JSX like `<Comp>{a}{b}</Comp>` creates a NEW children array on every render,
 * even when `a` and `b` are stable references. That makes useMemo deps that
 * include `children` recompute on every parent render. For consumers like
 * AG-Grid where rebuilding column defs invalidates virtualization, this is
 * expensive. This hook lets the consumer skip recomputation when the
 * children only "look the same".
 */
function useStableChildren(children: ReactNode): ReactNode {
  const ref = useRef<ReactNode>(children);
  const prevSignature = useRef<string>('');

  const currentElements = Children.toArray(children).filter(isValidElement) as ReactElement[];
  const currentSignature = currentElements
    .map((el) => `${String((el.type as any)?.displayName || (el.type as any)?.name || el.type)}::${String(el.key ?? '')}`)
    .join('|');

  if (currentSignature !== prevSignature.current) {
    prevSignature.current = currentSignature;
    ref.current = children;
  }
  return ref.current;
}

/**
 * Class applied to AG cells when the user opts into `truncate` on a column.
 * The companion CSS (injected once per document below) makes the React
 * container shrink in the cell's flex layout and clips overflow with an
 * ellipsis. Native `title` attribute on the rendered span shows the full
 * value on hover.
 */
const ARCHBASE_TRUNCATE_CELL_CLASS = 'archbase-ag-truncate-cell';
const ARCHBASE_TRUNCATE_TEXT_CLASS = 'archbase-ag-truncate-text';
const ARCHBASE_TRUNCATE_STYLE_ID = 'archbase-ag-truncate-style';

function ensureTruncateStyleInjected(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(ARCHBASE_TRUNCATE_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = ARCHBASE_TRUNCATE_STYLE_ID;
  style.textContent = `
    .ag-cell.${ARCHBASE_TRUNCATE_CELL_CLASS} {
      overflow: hidden !important;
    }
    .ag-cell.${ARCHBASE_TRUNCATE_CELL_CLASS} .ag-react-container,
    .ag-cell.${ARCHBASE_TRUNCATE_CELL_CLASS} > * {
      flex: 1 1 0 !important;
      min-width: 0 !important;
      max-width: 100% !important;
      overflow: hidden !important;
    }
    .${ARCHBASE_TRUNCATE_TEXT_CLASS} {
      display: block;
      width: 100%;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  `;
  document.head.appendChild(style);
}
import { AgGridReact } from 'ag-grid-react';

// Memoize AgGridReact — recommended by AG-Grid's official performance demo. This
// is by far the biggest scroll-perf win: it skips the full AG-Grid re-render when
// the parent re-renders but every prop reference is the same.
// React.memo apaga o parâmetro genérico de AgGridReact<TData> (TData vira unknown),
// fazendo columnDefs/getRowId tipados com <T> não baterem. O cast preserva a
// assinatura genérica original para que TData seja inferido de rowData={rows} (T[]).
const AgGridReactMemo = React.memo(AgGridReact) as unknown as typeof AgGridReact;
import {
  AllCommunityModule,
  ModuleRegistry,
  type GridApi,
  type ColDef,
  type GridReadyEvent,
  type SelectionChangedEvent,
  type CellDoubleClickedEvent,
  type SortChangedEvent,
  type FilterChangedEvent,
  type RowSelectionOptions,
  type SortModelItem,
  type GetRowIdParams,
} from 'ag-grid-community';
import { ActionIcon, Box, Group, Title, useMantineColorScheme } from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconX } from '@tabler/icons-react';

// Import theme and locale
import { createArchbaseAgGridTheme, getAgGridMantineCssVars, getAgGridCustomStyles } from './ag-grid-mantine-theme';
import { AG_GRID_LOCALE_PTBR } from './ag-grid-locale-ptbr';

// Import types and utilities
import type {
  ArchbaseDataGridAGProps,
  ArchbaseDataGridAGRef,
  ArchbaseDataGridAGColumnProps,
  ExtendedColDef,
  FieldDataType,
} from './archbase-data-grid-ag-types';
import { Columns } from './archbase-data-grid-ag-types';
import {
  safeGetRowId,
  isDataSourceV2,
  getRecordsFromDataSource,
  getDataSourceOptions,
  getCurrentPageFromDataSource,
  buildFilterExpression,
  convertSortModelToDataSource,
  getInitialSortModel,
  convertActiveFiltersToAgGridModel,
  convertColumnsToFilterDefinitions,
  MAX_PAGE_SIZE,
  hexToRgb,
} from './archbase-data-grid-ag-utils';
import {
  getCellRendererByDataType,
  getAlignmentByDataType,
  createValueFormatter,
} from './archbase-data-grid-ag-formatters';

// Import shared components
import { ArchbaseDataGridToolbar } from '../main/archbase-data-grid-toolbar';
import { ArchbaseDataGridPagination } from '../main/archbase-data-grid-pagination';
import { ExportModal } from '../modals/export-modal';
import { PrintModal } from '../modals/print-modal';
import { exportData, ExportConfig } from '../modals/export-data';
import { printData, PrintConfig } from '../modals/print-data';
import {
  ArchbaseDetailPanel,
  ArchbaseDetailModal,
  ArchbaseDetailDrawer,
} from '../main/archbase-detail-panel-component';
import {
  useDetailPanels,
  useDetailPanelAutoClose,
  useAvailableSpace,
} from '../hooks/use-grid-details-panel';

import { useArchbaseTheme, useArchbaseAppContext } from '@archbase/core';
import { DataSourceEvent, DataSourceEventNames } from '@archbase/data';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

/**
 * ArchbaseDataGridAG Component
 *
 * A feature-rich data grid using AG Grid Community with:
 * - Mantine theme integration
 * - DataSource V1/V2 compatibility
 * - Server-side pagination, sorting, filtering
 * - Row selection
 * - Detail panels
 * - Export/Print functionality
 */
function ArchbaseDataGridAG<T extends object = any, ID = any>(
  props: ArchbaseDataGridAGProps<T, ID>
) {
  const {
    dataSource,
    getRowId,
    resourceName,
    resourceDescription,
    columnSecurityOptions,
    enableColumnResizing = true,
    enableRowNumbers = false,
    enableRowSelection = true,
    enableRowActions = true,
    enableColumnFilterModes = true,
    enableGlobalFilter = true,
    enableTopToolbar = true,
    enableTopToolbarActions = true,
    showPagination = true,
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
    renderRowActions,
    renderToolbarActions,
    renderToolbarInternalActions,
    renderTopToolbar,
    renderDetailPanel,
    allowMultipleDetailPanels = false,
    detailPanelMinHeight = 200,
    detailPanelStyle,
    detailPanelClassName,
    onDetailPanelChange,
    detailPanelDisplayMode = 'auto',
    detailPanelTitle = 'Detalhes',
    detailPanelPosition = 'right',
    detailPanelSize = 'md',
    allowColumnFilters = true,
    allowExportData = true,
    allowPrintData = true,
    useCompositeFilters = false,
    filterDefinitions: externalFilterDefinitions,
    activeFilters: externalActiveFilters,
    onFiltersChange: externalOnFiltersChange,
    hideAgGridFilters = false,
    withBorder = true,
    withColumnBorders = true,
    highlightOnHover = true,
    striped = false,
    className = '',
    variant = 'filled',
    fontSize,
    cellPadding,
    tableHeadCellPadding,
    columnAutoWidth = false,
    autoSizeStrategy,
    skipHeaderOnAutoSize = false,
    rowHeight = 40,
    headerFontWeight = 600,
    withToolbarBorder = true,
    withPaginationBorder = true,
    toolbarPadding,
    paginationPadding,
    printTitle = 'Data Grid Print',
    logoPrint,
    globalDateFormat = 'dd/MM/yyyy',
    csvOptions,
    toolbarAlignment = 'right',
    positionActionsColumn = 'first',
    actionsColumnWidth = 120,
    toolbarLeftContent,
    bottomToolbarMinHeight,
    paginationLabels,
    showProgressBars = true,
    hideFooter = true,
    onSelectedRowsChanged,
    onCellDoubleClick,
    onExport,
    onPrint,
    onFilterModelChange,
    gridRef,
  } = props;

  const theme = useArchbaseTheme();
  const { colorScheme: mantineColorScheme } = useMantineColorScheme();
  // Normalizar colorScheme para "light" ou "dark" (tratar "auto" como "light")
  const colorScheme: 'light' | 'dark' = mantineColorScheme === 'dark' ? 'dark' : 'light';
  const appContext = useArchbaseAppContext();

  // AG Grid API reference
  const gridApiRef = useRef<GridApi | null>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);

  // Reference-stable children: only changes when the structural shape changes.
  // Prevents columnDefs useMemo from invalidating on every parent render and
  // forcing AG-Grid to rebuild all columns (which destroys virtualization perf).
  const stableChildren = useStableChildren(children);

  // Detect DataSource version
  const isV2 = isDataSourceV2(dataSource);

  // State
  const [rows, setRows] = useState<T[]>(() => getRecordsFromDataSource<T>(dataSource));
  const [isLoadingInternal, setIsLoadingInternal] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(() => {
    const total = dataSource.getGrandTotalRecords();
    return Number.isFinite(total) ? Math.max(0, total) : 0;
  });

  // Pagination state
  const [paginationModel, setPaginationModel] = useState({
    page: Number.isFinite(getCurrentPageFromDataSource(dataSource))
      ? getCurrentPageFromDataSource(dataSource)
      : pageIndex,
    pageSize: Math.min(
      Number.isFinite(dataSource?.getPageSize?.()) ? dataSource.getPageSize() : pageSize,
      MAX_PAGE_SIZE
    ),
  });

  // Sort state
  const [sortModel, setSortModel] = useState<SortModelItem[]>(() => getInitialSortModel(dataSource));

  // Filter state (for toolbar compatibility)
  const dsOptions = getDataSourceOptions(dataSource);
  const [filterModel, setFilterModel] = useState({
    items: dsOptions.originFilter || [],
    quickFilterValues: dsOptions.originGlobalFilter ? [dsOptions.originGlobalFilter] : [],
  });

  // AG Grid filter model (internal)
  const [agFilterModel, setAgFilterModel] = useState<Record<string, any>>({});
  const [quickFilterText, setQuickFilterText] = useState<string>(dsOptions.originGlobalFilter || '');

  // Internal active filters state
  const [internalActiveFilters, setInternalActiveFilters] = useState<typeof externalActiveFilters>([]);
  const activeFilters = externalActiveFilters !== undefined ? externalActiveFilters : internalActiveFilters;

  // Export/Print modal state
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [printModalOpen, setPrintModalOpen] = useState<boolean>(false);

  // Sync control
  const syncInProgress = useRef<boolean>(false);

  // Detail panels
  const {
    expandedRowIds,
    detailPanelHeight,
    detailPanelRefs,
    toggleExpand,
    closeDetailPanel,
    closeAllDetailPanels,
    expandDetailPanel,
    setExpandedRowIds,
  } = useDetailPanels({
    allowMultipleDetailPanels,
    onDetailPanelChange: (ids) => {
      if (onDetailPanelChange) {
        onDetailPanelChange(Array.from(ids));
      }
    },
    detailPanelMinHeight,
  });

  useDetailPanelAutoClose({
    containerRef: gridContainerRef,
    expandedRowIds,
    detailPanelRefs,
    closeAllDetailPanels,
  });

  const shouldUseModal = useAvailableSpace({
    containerRef: gridContainerRef,
    rows,
    getRowId,
    safeGetRowId,
    rowHeight,
    detailPanelMinHeight,
  });

  // Create AG Grid theme
  const agGridTheme = useMemo(
    () => createArchbaseAgGridTheme(theme, colorScheme, { headerFontWeight }),
    [theme, colorScheme, headerFontWeight]
  );

  // Create column definitions from children
  const columnDefs = useMemo((): ExtendedColDef<T>[] => {
    const cols: ExtendedColDef<T>[] = [];

    // Add expand column if detail panel is enabled
    if (renderDetailPanel) {
      cols.push({
        field: '__expand__' as any,
        headerName: '',
        width: 50,
        maxWidth: 50,
        minWidth: 50,
        sortable: false,
        filter: false,
        resizable: false,
        suppressMovable: true,
        cellRenderer: (params: any) => {
          const rowId = safeGetRowId(params.data, getRowId);
          if (rowId === undefined) return null;
          const isExpanded = expandedRowIds.has(rowId);
          return (
            <ActionIcon
              size="sm"
              variant="subtle"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(rowId);
              }}
            >
              {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
            </ActionIcon>
          );
        },
        cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
      });
    }

    // Add actions column if enabled
    if (enableRowActions && renderRowActions) {
      const actionsCol: ExtendedColDef<T> = {
        field: '__actions__' as any,
        headerName: 'Ações',
        width: actionsColumnWidth,
        sortable: false,
        filter: false,
        resizable: false,
        suppressMovable: true,
        cellRenderer: (params: any) => renderRowActions(params.data),
        cellStyle: { display: 'flex', alignItems: 'center', justifyContent: 'center' },
        enableGlobalFilter: false,
      };

      if (positionActionsColumn === 'first') {
        cols.unshift(actionsCol);
      } else {
        cols.push(actionsCol);
      }
    }

    // Extract column definitions from children (using the structurally-stable
    // reference so this useMemo doesn't recompute on every parent render).
    Children.forEach(stableChildren, (child) => {
      if (isValidElement(child) && child.type === Columns) {
        Children.forEach((child.props as any).children, (column) => {
          if (isValidElement(column)) {
            const columnProps = column.props as ArchbaseDataGridAGColumnProps<T>;

            if (columnProps.visible === false) return;

            const dataType = columnProps.dataType || 'text';
            const alignment = getAlignmentByDataType(dataType, columnProps.align);

            // Get cell renderer
            const baseCellRenderer = getCellRendererByDataType(
              dataType,
              columnProps.render
                ? (params) =>
                    columnProps.render!({
                      getValue: () => params.value,
                      row: params.data,
                    })
                : undefined,
              {
                maskOptions: columnProps.maskOptions,
                dateFormat: appContext?.dateFormat || globalDateFormat,
                dateTimeFormat: appContext?.dateTimeFormat,
                timeFormat: 'HH:mm:ss',
                enumValues: columnProps.enumValues,
                decimalPlaces: 2,
              }
            );

            // Quando truncate=true, envolve o conteúdo num span que ativa o
            // ellipsis (cssClass adicionada à cell faz o flex item interno
            // encolher — ver ensureTruncateStyleInjected).
            const cellRenderer = columnProps.truncate
              ? (params: any) => {
                  const titleValue = params.value == null ? '' : String(params.value);
                  return (
                    <span title={titleValue} className={ARCHBASE_TRUNCATE_TEXT_CLASS}>
                      {baseCellRenderer(params)}
                    </span>
                  );
                }
              : baseCellRenderer;

            if (columnProps.truncate) {
              ensureTruncateStyleInjected();
            }

            // Create value getter for nested fields
            const valueGetter = columnProps.dataField.includes('.')
              ? (params: any) => {
                  const parts = columnProps.dataField.split('.');
                  let result = params.data;
                  for (const part of parts) {
                    if (result && typeof result === 'object') {
                      result = result[part];
                    } else {
                      return undefined;
                    }
                  }
                  return result;
                }
              : undefined;

            const colDef: ExtendedColDef<T> = {
              field: columnProps.dataField as any,
              headerName: columnProps.header,
              width: columnProps.size || 150,
              minWidth: columnProps.minSize,
              maxWidth: columnProps.maxSize,
              sortable: columnProps.enableSorting !== false,
              filter: columnProps.enableColumnFilter !== false && allowColumnFilters,
              resizable: enableColumnResizing,
              flex: columnAutoWidth ? 1 : undefined,
              cellRenderer,
              valueGetter,
              valueFormatter: createValueFormatter(dataType, {
                dateFormat: appContext?.dateFormat || globalDateFormat,
                dateTimeFormat: appContext?.dateTimeFormat,
                enumValues: columnProps.enumValues,
              }),
              cellStyle: {
                display: 'flex',
                alignItems:
                  alignment === 'center'
                    ? 'center'
                    : alignment === 'right'
                      ? 'center'
                      : 'center',
                justifyContent:
                  alignment === 'left'
                    ? 'flex-start'
                    : alignment === 'right'
                      ? 'flex-end'
                      : 'center',
                ...(columnProps.truncate ? { overflow: 'hidden' } : {}),
              },
              cellClass: columnProps.truncate ? ARCHBASE_TRUNCATE_CELL_CLASS : undefined,
              // Custom properties
              enableGlobalFilter: columnProps.enableGlobalFilter,
              dataType: columnProps.dataType,
            };

            cols.push(colDef);
          }
        });
      }
    });

    return cols;
  }, [
    stableChildren,
    enableRowActions,
    renderRowActions,
    actionsColumnWidth,
    positionActionsColumn,
    renderDetailPanel,
    expandedRowIds,
    toggleExpand,
    getRowId,
    enableColumnResizing,
    columnAutoWidth,
    allowColumnFilters,
    appContext?.dateFormat,
    appContext?.dateTimeFormat,
    globalDateFormat,
  ]);

  // Auto-generate filter definitions
  const autoGeneratedFilterDefinitions = useMemo(() => {
    if (externalFilterDefinitions) {
      return externalFilterDefinitions;
    }
    return convertColumnsToFilterDefinitions(columnDefs, {
      excludeColumns: ['__actions__', '__expand__', 'id'],
      onlyFilterable: true,
    });
  }, [columnDefs, externalFilterDefinitions]);

  // Default column definition
  const defaultColDef = useMemo(
    (): ColDef => ({
      resizable: enableColumnResizing,
      sortable: true,
      filter: allowColumnFilters,
      filterParams: {
        buttons: ['reset', 'apply'],
        closeOnApply: true,
      },
    }),
    [enableColumnResizing, allowColumnFilters]
  );

  // Row selection configuration
  const rowSelection = useMemo((): RowSelectionOptions | undefined => {
    if (!enableRowSelection) return undefined;
    return {
      mode: 'multiRow',
      checkboxes: true,
      headerCheckbox: true,
      enableClickSelection: false,
    };
  }, [enableRowSelection]);

  // Estabiliza a referência do getRowId — recomendação da AG-Grid: prop
  // instável invalida o mapeamento interno de linhas e quebra o React.memo do
  // AgGridReactMemo. Junto com columnDefs estável (via useStableChildren),
  // garante que o memo realmente faça o seu trabalho.
  const stableGetRowIdAG = useCallback(
    (params: GetRowIdParams<T>) => {
      const id = safeGetRowId(params.data, getRowId);
      return id !== undefined ? String(id) : '';
    },
    [getRowId]
  );

  // Grid ready handler
  const onGridReady = useCallback((event: GridReadyEvent) => {
    gridApiRef.current = event.api;

    // Apply initial sort
    if (sortModel.length > 0) {
      event.api.applyColumnState({
        state: sortModel.map((s) => ({
          colId: s.colId,
          sort: s.sort,
        })),
      });
    }

    // Apply auto-size strategy after grid is ready
    if (autoSizeStrategy) {
      // Use setTimeout to ensure data is rendered before auto-sizing
      setTimeout(() => {
        if (autoSizeStrategy === 'fitCellContents') {
          event.api.autoSizeAllColumns(skipHeaderOnAutoSize);
        } else if (autoSizeStrategy === 'fitGridWidth') {
          event.api.sizeColumnsToFit();
        }
      }, 100);
    }
  }, [sortModel, autoSizeStrategy, skipHeaderOnAutoSize]);

  // Selection changed handler
  const onSelectionChanged = useCallback(
    (event: SelectionChangedEvent) => {
      if (syncInProgress.current) return;

      const selected = event.api.getSelectedRows() as T[];
      setSelectedRows(selected);

      if (onSelectedRowsChanged) {
        onSelectedRowsChanged(selected);
      }

      // Sync single selection with DataSource
      if (selected.length === 1 && dataSource.gotoRecordByData) {
        syncInProgress.current = true;
        try {
          dataSource.gotoRecordByData(selected[0]);
        } catch (error) {
          console.error('[SELECTION] Error syncing with DataSource:', error);
        }
        setTimeout(() => {
          syncInProgress.current = false;
        }, 100);
      }
    },
    [onSelectedRowsChanged, dataSource]
  );

  // Cell double click handler
  const onCellDoubleClicked = useCallback(
    (event: CellDoubleClickedEvent) => {
      if (onCellDoubleClick && event.colDef.field) {
        onCellDoubleClick({
          id: safeGetRowId(event.data, getRowId) || '',
          columnName: event.colDef.field,
          rowData: event.data,
        });
      }
    },
    [onCellDoubleClick, getRowId]
  );

  // Sort changed handler
  const onSortChanged = useCallback(
    (event: SortChangedEvent) => {
      const columnState = event.api.getColumnState();
      const newSortModel: SortModelItem[] = columnState
        .filter((col) => col.sort)
        .map((col) => ({
          colId: col.colId!,
          sort: col.sort as 'asc' | 'desc',
        }));

      setSortModel(newSortModel);

      if (manualSorting) {
        const sortFields = convertSortModelToDataSource(newSortModel);

        if (isV2) {
          setIsLoadingInternal(true);
          (dataSource as any).refreshData?.({
            currentPage: paginationModel.page,
            pageSize: paginationModel.pageSize,
            sort: sortFields,
          });
        } else {
          const options = getDataSourceOptions(dataSource);
          options.sort = sortFields;
          options.originSort = newSortModel;
          setIsLoadingInternal(true);
          (dataSource as any).refreshData?.(options);
        }

        closeAllDetailPanels();
      }
    },
    [manualSorting, isV2, dataSource, paginationModel, closeAllDetailPanels]
  );

  // Filter changed handler (AG Grid internal filters)
  const onFilterChanged = useCallback(
    (event: FilterChangedEvent) => {
      if (!manualFiltering || hideAgGridFilters) return;

      const newFilterModel = event.api.getFilterModel();
      setAgFilterModel(newFilterModel);

      const rsql = buildFilterExpression(newFilterModel, columnDefs, quickFilterText);

      if (isV2) {
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
        setIsLoadingInternal(true);
        (dataSource as any).refreshData?.({
          currentPage: 0,
          pageSize: paginationModel.pageSize,
          filter: rsql,
        });
      } else {
        const options = getDataSourceOptions(dataSource);
        options.filter = rsql;
        options.currentPage = 0;
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
        setIsLoadingInternal(true);
        (dataSource as any).refreshData?.(options);
      }

      closeAllDetailPanels();
    },
    [
      manualFiltering,
      hideAgGridFilters,
      isV2,
      dataSource,
      paginationModel.pageSize,
      columnDefs,
      quickFilterText,
      closeAllDetailPanels,
    ]
  );

  // Handle toolbar filter model change (for compatibility with existing toolbar)
  const handleToolbarFilterModelChange = useCallback(
    (newFilterModel: any) => {
      setFilterModel(newFilterModel);

      if (onFilterModelChange) {
        onFilterModelChange(newFilterModel);
      }

      const quickFilterValue =
        newFilterModel.quickFilterValues && newFilterModel.quickFilterValues.length > 0
          ? newFilterModel.quickFilterValues[0]
          : '';

      setQuickFilterText(quickFilterValue);

      const rsql = buildFilterExpression(agFilterModel, columnDefs, quickFilterValue);

      if (isV2) {
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
        setIsLoadingInternal(true);
        (dataSource as any).refreshData?.({
          currentPage: 0,
          pageSize: paginationModel.pageSize,
          filter: rsql,
          originGlobalFilter: quickFilterValue,
        });
      } else {
        const options = getDataSourceOptions(dataSource);
        options.filter = rsql;
        options.originFilter = newFilterModel.items;
        options.originGlobalFilter = quickFilterValue;
        options.currentPage = 0;
        setPaginationModel((prev) => ({ ...prev, page: 0 }));
        setIsLoadingInternal(true);
        (dataSource as any).refreshData?.(options);
      }

      closeAllDetailPanels();
    },
    [
      onFilterModelChange,
      agFilterModel,
      columnDefs,
      isV2,
      dataSource,
      paginationModel.pageSize,
      closeAllDetailPanels,
    ]
  );

  // Handle composite filters change
  const handleCompositeFiltersChange = useCallback(
    (filters: any[], rsql?: string) => {
      if (externalActiveFilters === undefined) {
        setInternalActiveFilters(filters);
      }

      if (externalOnFiltersChange) {
        externalOnFiltersChange(filters, rsql);
      }

      if (rsql || (filters && filters.length > 0)) {
        const agModel = convertActiveFiltersToAgGridModel(filters || []);
        setAgFilterModel(agModel);
        setFilterModel({
          items: filters.map((f) => ({ field: f.key, value: f.value, operator: f.operator })),
          quickFilterValues: [],
        });

        if (isV2) {
          setPaginationModel((prev) => ({ ...prev, page: 0 }));
          setIsLoadingInternal(true);
          (dataSource as any).refreshData?.({
            currentPage: 0,
            pageSize: paginationModel.pageSize,
            filter: rsql,
          });
        } else {
          const options = getDataSourceOptions(dataSource);
          options.filter = rsql;
          options.currentPage = 0;
          setIsLoadingInternal(true);
          (dataSource as any).refreshData?.(options);
        }

        closeAllDetailPanels();
      } else {
        setFilterModel({ items: [], quickFilterValues: [] });
        setAgFilterModel({});

        if (isV2) {
          setIsLoadingInternal(true);
          (dataSource as any).refreshData?.({
            currentPage: 0,
            pageSize: paginationModel.pageSize,
            filter: undefined,
          });
        } else {
          const options = getDataSourceOptions(dataSource);
          options.filter = undefined;
          options.originFilter = [];
          setIsLoadingInternal(true);
          (dataSource as any).refreshData?.(options);
        }

        closeAllDetailPanels();
      }
    },
    [
      externalActiveFilters,
      externalOnFiltersChange,
      isV2,
      dataSource,
      paginationModel.pageSize,
      closeAllDetailPanels,
    ]
  );

  // Refresh handler
  const handleRefresh = useCallback(() => {
    const rsql = buildFilterExpression(agFilterModel, columnDefs, quickFilterText);

    if (isV2) {
      setIsLoadingInternal(true);
      (dataSource as any).refreshData?.({
        currentPage: paginationModel.page,
        pageSize: paginationModel.pageSize,
        filter: rsql,
        originGlobalFilter: quickFilterText,
      });
    } else {
      const options = getDataSourceOptions(dataSource);
      options.filter = rsql;
      options.originGlobalFilter = quickFilterText;
      setIsLoadingInternal(true);
      (dataSource as any).refreshData?.(options);
    }

    closeAllDetailPanels();
  }, [
    agFilterModel,
    columnDefs,
    quickFilterText,
    isV2,
    dataSource,
    paginationModel,
    closeAllDetailPanels,
  ]);

  // Pagination handler
  const handlePaginationChange = useCallback(
    (newPaginationModel: { page: number; pageSize: number }) => {
      const safePageSize = Math.min(newPaginationModel.pageSize, MAX_PAGE_SIZE);

      setPaginationModel({
        page: newPaginationModel.page,
        pageSize: safePageSize,
      });

      if (manualPagination) {
        const rsql = buildFilterExpression(agFilterModel, columnDefs, quickFilterText);

        if (isV2) {
          setIsLoadingInternal(true);
          (dataSource as any).refreshData?.({
            currentPage: newPaginationModel.page,
            pageSize: safePageSize,
            filter: rsql,
          });
        } else {
          const options = getDataSourceOptions(dataSource);
          options.currentPage = newPaginationModel.page;
          options.pageSize = safePageSize;
          setIsLoadingInternal(true);
          (dataSource as any).refreshData?.(options);
        }

        closeAllDetailPanels();
      }
    },
    [manualPagination, agFilterModel, columnDefs, quickFilterText, isV2, dataSource, closeAllDetailPanels]
  );

  // Export/Print handlers
  const handleExportClick = useCallback(() => setExportModalOpen(true), []);
  const handlePrintClick = useCallback(() => setPrintModalOpen(true), []);

  const handleExportConfirm = useCallback(
    (exportConfig: ExportConfig) => {
      exportData(rows, columnDefs as any, exportConfig);
      setExportModalOpen(false);
    },
    [rows, columnDefs]
  );

  const handlePrintConfirm = useCallback(
    (printConfig: PrintConfig) => {
      printData(rows, columnDefs as any, printConfig);
      setPrintModalOpen(false);
    },
    [rows, columnDefs]
  );

  // Register export/print callbacks
  useEffect(() => {
    if (onExport) onExport(handleExportClick);
    if (onPrint) onPrint(handlePrintClick);
  }, [onExport, onPrint, handleExportClick, handlePrintClick]);

  // Expose methods via ref
  useImperativeHandle(
    gridRef,
    () => ({
      refreshData: handleRefresh,
      getSelectedRows: () => selectedRows,
      clearSelection: () => {
        gridApiRef.current?.deselectAll();
        setSelectedRows([]);
      },
      exportData: handleExportClick,
      printData: handlePrintClick,
      expandRow: (rowId) => expandDetailPanel(rowId),
      collapseRow: (rowId) => closeDetailPanel(rowId),
      collapseAllRows: closeAllDetailPanels,
      getExpandedRows: () => Array.from(expandedRowIds),
      getFilterModel: () => filterModel,
      getGridApi: () => gridApiRef.current,
      autoSizeAllColumns: (skipHeader = false) => {
        gridApiRef.current?.autoSizeAllColumns(skipHeader);
      },
      sizeColumnsToFit: () => {
        gridApiRef.current?.sizeColumnsToFit();
      },
    }),
    [
      selectedRows,
      expandedRowIds,
      expandDetailPanel,
      closeDetailPanel,
      closeAllDetailPanels,
      filterModel,
      handleRefresh,
      handleExportClick,
      handlePrintClick,
    ]
  );

  // DataSource event listener
  useEffect(() => {
    const handleDataSourceEvent = (event: DataSourceEvent<T>) => {
      if (
        event.type === DataSourceEventNames.refreshData ||
        event.type === DataSourceEventNames.dataChanged ||
        event.type === DataSourceEventNames.afterRemove ||
        event.type === DataSourceEventNames.afterSave ||
        event.type === DataSourceEventNames.afterAppend ||
        event.type === DataSourceEventNames.afterCancel
      ) {
        setRows(getRecordsFromDataSource<T>(dataSource));

        const currentPage = Number.isFinite(getCurrentPageFromDataSource(dataSource))
          ? getCurrentPageFromDataSource(dataSource)
          : 0;

        const pageSize = Number.isFinite(dataSource.getPageSize?.())
          ? Math.min(Math.max(1, dataSource.getPageSize()), MAX_PAGE_SIZE)
          : 10;

        setPaginationModel({ page: currentPage, pageSize });

        const grandTotal = Number.isFinite(dataSource.getGrandTotalRecords?.())
          ? Math.max(0, dataSource.getGrandTotalRecords())
          : 0;

        setTotalRecords(grandTotal);
        setIsLoadingInternal(false);
        closeAllDetailPanels();
      } else if (event.type === DataSourceEventNames.onError) {
        // Reset loading state when an error occurs
        setIsLoadingInternal(false);
      } else if (event.type === DataSourceEventNames.afterScroll) {
        if (syncInProgress.current) return;

        const currentRecord = dataSource.getCurrentRecord();
        if (currentRecord && gridApiRef.current) {
          try {
            const currentId = safeGetRowId(currentRecord, getRowId);
            if (currentId !== undefined) {
              syncInProgress.current = true;

              gridApiRef.current.deselectAll();
              gridApiRef.current.forEachNode((node) => {
                const nodeId = safeGetRowId(node.data, getRowId);
                if (String(nodeId) === String(currentId)) {
                  node.setSelected(true);
                  gridApiRef.current?.ensureNodeVisible(node);
                }
              });

              setSelectedRows([currentRecord]);
              if (onSelectedRowsChanged) {
                onSelectedRowsChanged([currentRecord]);
              }

              setTimeout(() => {
                syncInProgress.current = false;
              }, 100);
            }
          } catch (error) {
            console.error('[DATASOURCE] Error processing afterScroll:', error);
            syncInProgress.current = false;
          }
        }
      }
    };

    dataSource.addListener(handleDataSourceEvent);
    return () => {
      dataSource.removeListener(handleDataSourceEvent);
    };
  }, [dataSource, getRowId, onSelectedRowsChanged, closeAllDetailPanels]);

  // Modal columns for export/print
  const modalColumns = useMemo(() => {
    return columnDefs
      .filter((col) => col.field && !col.field.startsWith('__'))
      .map((col) => ({
        id: col.field!,
        title: col.headerName || col.field!,
      }));
  }, [columnDefs]);

  // Grid container styles
  const containerStyle = useMemo(
    () => ({
      height,
      width,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      border: withBorder
        ? `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 8 : 3]}`
        : 'none',
      borderRadius: theme.radius.sm,
      backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    }),
    [height, width, withBorder, theme, colorScheme]
  );

  // CSS vars for additional styling
  const cssVars = useMemo(
    () => getAgGridMantineCssVars(theme, colorScheme),
    [theme, colorScheme]
  );

  // Custom CSS for cell focus styling
  const customStyles = useMemo(
    () => getAgGridCustomStyles(theme, colorScheme),
    [theme, colorScheme]
  );

  // Render fixed detail panel (inline mode)
  const renderFixedDetailPanel = () => {
    if (!renderDetailPanel || expandedRowIds.size === 0) return null;

    const rowId = Array.from(expandedRowIds)[0];
    const rowData = rows.find((row) => String(safeGetRowId(row, getRowId)) === String(rowId));

    if (!rowData) return null;

    const panelTitle =
      typeof detailPanelTitle === 'function' ? detailPanelTitle(rowId, rowData) : detailPanelTitle;

    const detailContent = renderDetailPanel({ row: rowData });

    return (
      <div
        key={`fixed-detail-panel-${rowId}`}
        ref={(el) => {
          if (el) detailPanelRefs.current.set(rowId, el);
        }}
        style={{
          width: '100%',
          borderBottom: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 3]}`,
          marginBottom: '8px',
          zIndex: 2,
        }}
      >
        <Box
          className={`detail-panel-container ${detailPanelClassName || ''}`}
          style={{
            padding: 8,
            backgroundColor: colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[0],
            borderTop: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 3]}`,
            width: '100%',
            ...(detailPanelStyle || {}),
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
    );
  };

  // Render floating detail panels (modal/drawer mode)
  const renderFloatingDetailPanels = () => {
    if (!renderDetailPanel || expandedRowIds.size === 0) return null;

    return Array.from(expandedRowIds).map((rowId) => {
      const rowData = rows.find((row) => String(safeGetRowId(row, getRowId)) === String(rowId));
      if (!rowData) return null;

      const panelTitle =
        typeof detailPanelTitle === 'function' ? detailPanelTitle(rowId, rowData) : detailPanelTitle;

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
        );
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
        );
      } else if (detailPanelDisplayMode === 'auto' && shouldUseModal) {
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
        );
      }

      return null;
    });
  };

  return (
    <Box
      className={`archbase-data-grid-ag ${className}`}
      ref={gridContainerRef}
      style={containerStyle}
    >
      {/* Custom styles for cell focus */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      {/* Toolbar */}
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
          onFilterModelChange={handleToolbarFilterModelChange}
          onRefresh={handleRefresh}
          onExport={handleExportClick}
          onPrint={handlePrintClick}
          apiRef={{ current: gridApiRef.current }}
          children={children}
          useCompositeFilters={useCompositeFilters}
          filterDefinitions={autoGeneratedFilterDefinitions}
          activeFilters={activeFilters}
          onFiltersChange={handleCompositeFiltersChange}
          hideMuiFilters={hideAgGridFilters}
          withBorder={withToolbarBorder}
          padding={toolbarPadding}
        />
      )}

      {/* Inline Detail Panel */}
      {(detailPanelDisplayMode === 'inline' ||
        (detailPanelDisplayMode === 'auto' && !shouldUseModal)) &&
        renderFixedDetailPanel()}

      {/* AG Grid */}
      <Box style={{ flex: 1, overflow: 'hidden', position: 'relative', minHeight: 0, ...cssVars }}>
        <AgGridReactMemo
          theme={agGridTheme}
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowSelection={rowSelection}
          onGridReady={onGridReady}
          onSelectionChanged={onSelectionChanged}
          onCellDoubleClicked={onCellDoubleClicked}
          onSortChanged={onSortChanged}
          onFilterChanged={onFilterChanged}
          getRowId={stableGetRowIdAG}
          rowHeight={rowHeight}
          headerHeight={40}
          loading={isLoadingInternal || isLoading}
          suppressCellFocus={false}
          suppressRowClickSelection={true}
          animateRows={false}
          localeText={AG_GRID_LOCALE_PTBR}
          suppressPaginationPanel={true}
          suppressScrollOnNewData={true}
          enableCellTextSelection={true}
          ensureDomOrder={true}
          // Perf — recomendações da doc oficial AG-Grid (scrolling-performance):
          // mantém apenas N linhas extra renderizadas fora do viewport.
          rowBuffer={10}
          // Desliga o highlight de hover quando o usuário pediu (perf win).
          suppressRowHoverHighlight={!highlightOnHover}
        />
      </Box>

      {/* Pagination */}
      {showPagination && (
        <ArchbaseDataGridPagination
          paginationModel={paginationModel}
          totalRecords={totalRecords}
          onPaginationModelChange={handlePaginationChange}
          paginationLabels={paginationLabels}
          bottomToolbarMinHeight={bottomToolbarMinHeight}
          theme={theme}
          withBorder={withPaginationBorder}
          padding={paginationPadding}
        />
      )}

      {/* Floating Detail Panels */}
      {renderFloatingDetailPanels()}

      {/* Export Modal */}
      <ExportModal
        opened={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExportConfirm}
        columns={modalColumns}
        defaultConfig={{
          filename: printTitle || 'export',
          dateFormat: globalDateFormat,
        }}
      />

      {/* Print Modal */}
      <PrintModal
        opened={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        onPrint={handlePrintConfirm}
        columns={modalColumns}
        defaultConfig={{
          title: printTitle,
          orientation: 'landscape',
          pageSize: 'A4',
        }}
      />
    </Box>
  );
}

export default ArchbaseDataGridAG;
