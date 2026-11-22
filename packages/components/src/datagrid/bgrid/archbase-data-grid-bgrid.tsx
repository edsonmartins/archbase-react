/**
 * ArchbaseDataGrid - implementação sobre a beautiful-grid (BGrid).
 *
 * Mantém exatamente o mesmo contrato público da versão AG Grid
 * (ArchbaseDataGridAGProps / ArchbaseDataGridAGRef): props, events e ref.
 * Toolbar, paginação, detail panel e exportação/impressão continuam sendo os
 * componentes Mantine compartilhados; a BGrid cuida só do corpo da grid.
 */
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
  useMemo,
  useCallback,
  Children,
  isValidElement,
  type ReactNode,
  type ReactElement,
} from 'react';
import {
  BGrid,
  type BGridColumn,
  type BGridColumnFilterConfig,
  type BGridDataItem,
  type BGridDataQuery,
  type BGridDataQueryChangeEvent,
  type BGridFilterParam,
  type BGridItemRenderProps,
  type BGridRef,
  type BGridSortParam,
} from 'beautiful-grid';
import 'beautiful-grid/style.css';
import { ActionIcon, Box, Group, Title, useMantineColorScheme } from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconX } from '@tabler/icons-react';

import type {
  ArchbaseDataGridAGProps,
  ArchbaseDataGridAGRef,
  ArchbaseDataGridAGColumnProps,
  FieldDataType,
} from '../ag-grid/archbase-data-grid-ag-types';
import { Columns } from '../ag-grid/archbase-data-grid-ag-types';
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
} from '../ag-grid/archbase-data-grid-ag-utils';
import {
  getCellRendererByDataType,
  getAlignmentByDataType,
} from '../ag-grid/archbase-data-grid-ag-formatters';
import { BGRID_LOCALE_PTBR } from './bgrid-locale-ptbr';

import { ArchbaseDataGridToolbar } from '../main/archbase-data-grid-toolbar';
import { ArchbaseDataGridPagination } from '../main/archbase-data-grid-pagination';
import { ExportModal } from '../modals/export-modal';
import { PrintModal } from '../modals/print-modal';
import { exportData, ExportConfig } from '../modals/export-data';
import { printData, PrintConfig } from '../modals/print-data';
import {
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

const EXPAND_COLUMN_ID = '__expand__';
const ACTIONS_COLUMN_ID = '__actions__';
const HEADER_HEIGHT = 40;
const ITEM_PADDING = 7;
/** Largura aproximada da coluna de checkbox + barra de rolagem, usada nos cálculos de ajuste. */
const SELECTION_COLUMN_WIDTH = 40;
const SCROLLBAR_ALLOWANCE = 16;
/** Tamanho usado quando o container ainda não pôde ser medido (ex.: jsdom, aba oculta). */
const FALLBACK_WIDTH = 800;
const FALLBACK_HEIGHT = 400;

/**
 * A BGrid identifica a linha por um campo (`rowKey`), e o nosso contrato usa uma
 * função (`getRowId`). Cada registro é embrulhado: `__id` é a chave e `__row` o
 * registro original, intocado (sem clonar — preserva instâncias de classe).
 */
interface BGridRow<T> {
  __id: string;
  __row: T;
}

/** Definição interna de coluna: o formato que exportação/impressão e os builders de RSQL já consomem. */
interface InternalColumn<T> {
  field: string;
  headerName: string;
  width: number;
  minWidth?: number;
  maxWidth?: number;
  sortable: boolean;
  filter: boolean;
  resizable: boolean;
  align: 'left' | 'center' | 'right';
  headerAlign?: 'left' | 'center' | 'right';
  truncate?: boolean;
  renderCell?: (row: T, value: any) => ReactNode;
  enableGlobalFilter?: boolean;
  dataType?: FieldDataType;
  enumValues?: Array<{ label: string; value: string }>;
  exportValue?: (row: T) => string;
  exportable?: boolean;
}

/**
 * Mesma ideia do hook da versão AG: `children` só muda de referência quando a
 * forma estrutural muda, para não reconstruir as colunas a cada render do pai.
 */
function useStableChildren(children: ReactNode): ReactNode {
  const ref = useRef<ReactNode>(children);
  const prevSignature = useRef<string>('');

  const currentElements = Children.toArray(children).filter(isValidElement) as ReactElement[];
  const currentSignature = currentElements
    .map(
      (el) =>
        `${String((el.type as any)?.displayName || (el.type as any)?.name || el.type)}::${String(el.key ?? '')}`
    )
    .join('|');

  if (currentSignature !== prevSignature.current) {
    prevSignature.current = currentSignature;
    ref.current = children;
  }
  return ref.current;
}

/** Mede o elemento; a BGrid exige largura e altura numéricas para virtualizar. */
function useMeasuredSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);
      setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
    };

    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);

  return size;
}

/** Converte os filtros de coluna da BGrid para o formato que `buildFilterExpression` entende. */
function toFilterModel(filterParams: BGridFilterParam[]): Record<string, any> {
  const model: Record<string, any> = {};

  for (const param of filterParams || []) {
    const field = param.columnId;
    if (!field) continue;

    if (param.type === 'values') {
      if (param.values && param.values.length > 0) {
        model[field] = { values: param.values };
      }
    } else if (param.type === 'text') {
      if (param.value === undefined || param.value === '') continue;
      const type =
        param.operator === 'equals' ? 'equals' : param.operator === 'notEquals' ? 'notEqual' : 'contains';
      model[field] = { type, filter: param.value };
    } else if (param.type === 'number') {
      if (param.operator === 'between') {
        if (param.min === undefined || param.max === undefined) continue;
        model[field] = { type: 'inRange', filter: param.min, filterTo: param.max };
        continue;
      }
      if (param.value === undefined) continue;
      const typeByOperator: Record<string, string> = {
        equals: 'equals',
        notEquals: 'notEqual',
        gt: 'greaterThan',
        gte: 'greaterThanOrEqual',
        lt: 'lessThan',
        lte: 'lessThanOrEqual',
      };
      model[field] = { type: typeByOperator[param.operator] || 'equals', filter: param.value };
    }
  }

  return model;
}

/** Filtro de coluna da BGrid equivalente ao tipo de dado. Tipos sem equivalente não têm filtro. */
function getColumnFilterConfig<T>(column: InternalColumn<T>): BGridColumnFilterConfig<BGridRow<T>> | false {
  switch (column.dataType || 'text') {
    case 'text':
    case 'uuid':
      return { type: 'text' };
    case 'integer':
    case 'float':
    case 'currency':
      return { type: 'number' };
    case 'boolean':
      return {
        type: 'values',
        values: [true, false],
        formatValue: (value) => (value ? 'Sim' : 'Não'),
      };
    case 'enum': {
      const enumValues = column.enumValues || [];
      if (enumValues.length === 0) return { type: 'text' };
      return {
        type: 'values',
        values: enumValues.map((option) => option.value),
        formatValue: (value) => enumValues.find((option) => option.value === value)?.label ?? String(value),
      };
    }
    default:
      return false;
  }
}

function getNestedValue(row: any, field: string): any {
  if (!field.includes('.')) return row?.[field];
  let result = row;
  for (const part of field.split('.')) {
    if (result && typeof result === 'object') {
      result = result[part];
    } else {
      return undefined;
    }
  }
  return result;
}

const clampWidth = (width: number, min?: number, max?: number): number => {
  let result = width;
  if (typeof min === 'number' && result < min) result = min;
  if (typeof max === 'number' && result > max) result = max;
  return Math.round(result);
};

const truncateStyle: React.CSSProperties = {
  display: 'block',
  width: '100%',
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

const centeredCellStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
};

function ArchbaseDataGridBGrid<T extends object = any, ID = any>(props: ArchbaseDataGridAGProps<T, ID>) {
  const {
    dataSource,
    getRowId,
    enableColumnResizing = true,
    enableRowNumbers = false,
    enableRowSelection = true,
    enableRowActions = true,
    enableGlobalFilter = true,
    enableTopToolbar = true,
    enableTopToolbarActions = true,
    showPagination = true,
    manualFiltering = true,
    manualPagination = true,
    manualSorting = true,
    isLoading = false,
    height = '100%',
    width = '100%',
    pageSize = 15,
    pageIndex = 0,
    children,
    renderRowActions,
    renderToolbarActions,
    renderToolbarInternalActions,
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
    fontSize,
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
    globalDateFormat = 'dd/MM/yyyy',
    toolbarAlignment = 'right',
    positionActionsColumn = 'first',
    actionsColumnWidth = 120,
    toolbarLeftContent,
    bottomToolbarMinHeight,
    paginationLabels,
    onSelectedRowsChanged,
    onCellDoubleClick,
    onExport,
    onPrint,
    onFilterModelChange,
    gridRef,
  } = props;

  const theme = useArchbaseTheme();
  const { colorScheme: mantineColorScheme } = useMantineColorScheme();
  const colorScheme: 'light' | 'dark' = mantineColorScheme === 'dark' ? 'dark' : 'light';
  const appContext = useArchbaseAppContext();

  const bgridRef = useRef<BGridRef<BGridRow<T>> | null>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const gridBodyRef = useRef<HTMLDivElement>(null);
  const measured = useMeasuredSize(gridBodyRef);

  const stableChildren = useStableChildren(children);
  const isV2 = isDataSourceV2(dataSource);

  // State
  const [rows, setRows] = useState<T[]>(() => getRecordsFromDataSource<T>(dataSource));
  const [isLoadingInternal, setIsLoadingInternal] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [currentRowKey, setCurrentRowKey] = useState<string | undefined>(undefined);
  const [totalRecords, setTotalRecords] = useState<number>(() => {
    const total = dataSource.getGrandTotalRecords();
    return Number.isFinite(total) ? Math.max(0, total) : 0;
  });

  const [paginationModel, setPaginationModel] = useState({
    page: Number.isFinite(getCurrentPageFromDataSource(dataSource))
      ? getCurrentPageFromDataSource(dataSource)
      : pageIndex,
    pageSize: Math.min(
      Number.isFinite(dataSource?.getPageSize?.()) ? dataSource.getPageSize() : pageSize,
      MAX_PAGE_SIZE
    ),
  });

  // Ordenação e filtros de coluna (estado controlado da BGrid)
  const [dataQuery, setDataQuery] = useState<BGridDataQuery>(() => ({
    sortParams: getInitialSortModel(dataSource)
      .filter((sort) => !!sort.colId)
      .map((sort): BGridSortParam => ({ columnId: sort.colId, orderBy: sort.sort === 'desc' ? 'desc' : 'asc' })),
    filterParams: [],
  }));

  // Filtro no formato da toolbar (compatível com o que sempre foi exposto)
  const dsOptions = getDataSourceOptions(dataSource);
  const [filterModel, setFilterModel] = useState({
    items: dsOptions.originFilter || [],
    quickFilterValues: dsOptions.originGlobalFilter ? [dsOptions.originGlobalFilter] : [],
  });

  // Modelo de filtros de coluna usado para montar o RSQL
  const [columnFilterModel, setColumnFilterModel] = useState<Record<string, any>>({});
  const [quickFilterText, setQuickFilterText] = useState<string>(dsOptions.originGlobalFilter || '');

  const [internalActiveFilters, setInternalActiveFilters] = useState<typeof externalActiveFilters>([]);
  const activeFilters = externalActiveFilters !== undefined ? externalActiveFilters : internalActiveFilters;

  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [printModalOpen, setPrintModalOpen] = useState<boolean>(false);

  // Larguras alteradas pelo usuário (redimensionamento) ou pelos métodos de auto-ajuste
  const [widthOverrides, setWidthOverrides] = useState<Record<string, number>>({});

  const syncInProgress = useRef<boolean>(false);
  const lastClickRef = useRef<{ row: T; field: string } | null>(null);
  const checkedKeysRef = useRef<string[]>(checkedKeys);
  checkedKeysRef.current = checkedKeys;

  // Detail panels
  const {
    expandedRowIds,
    detailPanelRefs,
    toggleExpand,
    closeDetailPanel,
    closeAllDetailPanels,
    expandDetailPanel,
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

  // Linhas embrulhadas + índice por chave
  const { gridData, rowByKey, indexByKey } = useMemo(() => {
    const data: BGridDataItem<BGridRow<T>>[] = [];
    const byKey = new Map<string, T>();
    const idxByKey = new Map<string, number>();

    rows.forEach((row, index) => {
      const id = safeGetRowId(row, getRowId);
      let key = id !== undefined && id !== null ? String(id) : `__idx_${index}`;
      if (byKey.has(key)) key = `${key}__dup_${index}`;
      byKey.set(key, row);
      idxByKey.set(key, index);
      data.push({ values: { __id: key, __row: row } });
    });

    return { gridData: data, rowByKey: byKey, indexByKey: idxByKey };
  }, [rows, getRowId]);

  const keyOfRow = useCallback(
    (row: T | undefined): string | undefined => {
      if (!row) return undefined;
      const id = safeGetRowId(row, getRowId);
      if (id === undefined || id === null) return undefined;
      const key = String(id);
      return rowByKey.has(key) ? key : undefined;
    },
    [getRowId, rowByKey]
  );

  // Definições internas de coluna a partir dos children
  const columnDefs = useMemo((): InternalColumn<T>[] => {
    const cols: InternalColumn<T>[] = [];

    if (renderDetailPanel) {
      cols.push({
        field: EXPAND_COLUMN_ID,
        headerName: '',
        width: 50,
        minWidth: 50,
        maxWidth: 50,
        sortable: false,
        filter: false,
        resizable: false,
        align: 'center',
        enableGlobalFilter: false,
        exportable: false,
        renderCell: (row) => {
          const rowId = safeGetRowId(row, getRowId);
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
      });
    }

    if (enableRowActions && renderRowActions) {
      const actionsCol: InternalColumn<T> = {
        field: ACTIONS_COLUMN_ID,
        headerName: 'Ações',
        width: actionsColumnWidth,
        sortable: false,
        filter: false,
        resizable: false,
        align: 'center',
        enableGlobalFilter: false,
        renderCell: (row) => renderRowActions(row),
      };

      if (positionActionsColumn === 'first') {
        cols.unshift(actionsCol);
      } else {
        cols.push(actionsCol);
      }
    }

    Children.forEach(stableChildren, (child) => {
      if (isValidElement(child) && child.type === Columns) {
        Children.forEach((child.props as any).children, (column) => {
          if (!isValidElement(column)) return;
          const columnProps = column.props as ArchbaseDataGridAGColumnProps<T>;
          if (columnProps.visible === false) return;

          const dataType = columnProps.dataType || 'text';
          const renderer = getCellRendererByDataType(
            dataType,
            columnProps.render
              ? (params: any) =>
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

          cols.push({
            field: columnProps.dataField,
            headerName: columnProps.header,
            width: columnProps.size || 150,
            minWidth: columnProps.minSize,
            maxWidth: columnProps.maxSize,
            sortable: columnProps.enableSorting !== false,
            filter: columnProps.enableColumnFilter !== false && allowColumnFilters && !hideAgGridFilters,
            resizable: enableColumnResizing,
            align: getAlignmentByDataType(dataType, columnProps.align),
            headerAlign: columnProps.headerAlign,
            truncate: columnProps.truncate,
            renderCell: (row, value) => renderer({ value, data: row } as any),
            enableGlobalFilter: columnProps.enableGlobalFilter,
            dataType: columnProps.dataType,
            enumValues: columnProps.enumValues,
            exportValue: columnProps.exportValue,
            exportable: columnProps.exportable !== false,
          });
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
    allowColumnFilters,
    hideAgGridFilters,
    appContext?.dateFormat,
    appContext?.dateTimeFormat,
    globalDateFormat,
  ]);

  const gridWidth = measured.width > 0 ? measured.width : typeof width === 'number' ? width : FALLBACK_WIDTH;
  const gridHeight = measured.height > 0 ? measured.height : typeof height === 'number' ? height : FALLBACK_HEIGHT;

  /** Distribui a largura disponível entre as colunas redimensionáveis (equivalente ao sizeColumnsToFit). */
  const computeFitWidths = useCallback(
    (cols: InternalColumn<T>[], current: Record<string, number>): Record<string, number> => {
      const available =
        gridWidth - (enableRowSelection ? SELECTION_COLUMN_WIDTH : 0) - SCROLLBAR_ALLOWANCE;
      const fixed = cols.filter((col) => !col.resizable);
      const flexible = cols.filter((col) => col.resizable);
      if (flexible.length === 0) return current;

      const fixedTotal = fixed.reduce((sum, col) => sum + col.width, 0);
      const flexibleTotal = flexible.reduce((sum, col) => sum + col.width, 0);
      const target = available - fixedTotal;
      if (target <= 0 || flexibleTotal <= 0) return current;

      const ratio = target / flexibleTotal;
      const next: Record<string, number> = { ...current };
      flexible.forEach((col) => {
        next[col.field] = clampWidth(col.width * ratio, col.minWidth ?? 40, col.maxWidth);
      });
      return next;
    },
    [gridWidth, enableRowSelection]
  );

  /** Estima a largura pelo conteúdo (equivalente ao autoSizeAllColumns). */
  const computeContentWidths = useCallback(
    (cols: InternalColumn<T>[], skipHeader: boolean): Record<string, number> => {
      const next: Record<string, number> = {};
      const charWidth = 8;
      const padding = 28;

      cols.forEach((col) => {
        if (!col.resizable) return;
        let maxChars = skipHeader ? 0 : String(col.headerName ?? '').length + 3;
        rows.slice(0, 200).forEach((row) => {
          const value = getNestedValue(row, col.field);
          if (value === undefined || value === null) return;
          const text =
            col.dataType === 'enum'
              ? col.enumValues?.find((option) => option.value === value)?.label ?? String(value)
              : typeof value === 'object'
                ? ''
                : String(value);
          if (text.length > maxChars) maxChars = text.length;
        });
        next[col.field] = clampWidth(maxChars * charWidth + padding, col.minWidth ?? 60, col.maxWidth ?? 600);
      });

      return next;
    },
    [rows]
  );

  // Estratégia inicial de auto-ajuste (mesmas props da versão AG)
  const autoSizeApplied = useRef<boolean>(false);
  useEffect(() => {
    if (autoSizeApplied.current || !autoSizeStrategy || measured.width <= 0) return;
    if (autoSizeStrategy === 'fitCellContents' && rows.length === 0) return;
    autoSizeApplied.current = true;
    setWidthOverrides((prev) =>
      autoSizeStrategy === 'fitCellContents'
        ? { ...prev, ...computeContentWidths(columnDefs, skipHeaderOnAutoSize) }
        : computeFitWidths(columnDefs, prev)
    );
  }, [
    autoSizeStrategy,
    measured.width,
    rows.length,
    columnDefs,
    skipHeaderOnAutoSize,
    computeContentWidths,
    computeFitWidths,
  ]);

  // Larguras efetivas: override do usuário > columnAutoWidth (ocupa a largura) > tamanho declarado
  const effectiveWidths = useMemo(() => {
    const base: Record<string, number> = {};
    columnDefs.forEach((col) => {
      base[col.field] = clampWidth(col.width, col.minWidth, col.maxWidth);
    });

    let result = base;
    if (columnAutoWidth) {
      const total = columnDefs.reduce((sum, col) => sum + col.width, 0);
      const available =
        gridWidth - (enableRowSelection ? SELECTION_COLUMN_WIDTH : 0) - SCROLLBAR_ALLOWANCE;
      // Só expande; nunca encolhe abaixo do tamanho declarado.
      if (total < available) result = computeFitWidths(columnDefs, base);
    }

    return { ...result, ...widthOverrides };
  }, [columnDefs, columnAutoWidth, gridWidth, enableRowSelection, computeFitWidths, widthOverrides]);

  // Colunas da BGrid
  const bgridColumns = useMemo((): BGridColumn<BGridRow<T>>[] => {
    return columnDefs.map((col) => {
      const isSynthetic = col.field === EXPAND_COLUMN_ID || col.field === ACTIONS_COLUMN_ID;
      const filterConfig = col.filter ? getColumnFilterConfig(col) : false;

      const itemRender: React.FC<BGridItemRenderProps<BGridRow<T>>> = ({ values, value }) => {
        const row = values?.__row;
        if (!row) return null;
        const content = col.renderCell ? col.renderCell(row, value) : (value as ReactNode);

        if (isSynthetic) {
          return <div style={centeredCellStyle}>{content}</div>;
        }
        if (col.truncate) {
          return (
            <span title={value == null ? '' : String(value)} style={truncateStyle}>
              {content}
            </span>
          );
        }
        return <>{content}</>;
      };

      return {
        id: col.field,
        key: isSynthetic ? '__id' : ['__row', ...col.field.split('.')],
        label: col.headerName,
        width: effectiveWidths[col.field] ?? col.width,
        align: col.align,
        headerAlign: col.headerAlign ?? (isSynthetic ? 'center' : 'left'),
        sortDisable: !col.sortable,
        hideable: false,
        searchable: !isSynthetic,
        filter: filterConfig,
        toolbox: filterConfig ? { sort: col.sortable, filter: true } : false,
        itemRender,
      };
    });
  }, [columnDefs, effectiveWidths]);

  const frozenColumnIndex = 0;

  // Definições de filtro geradas automaticamente (filtros compostos)
  const autoGeneratedFilterDefinitions = useMemo(() => {
    if (externalFilterDefinitions) {
      return externalFilterDefinitions;
    }
    return convertColumnsToFilterDefinitions(columnDefs as any, {
      excludeColumns: [ACTIONS_COLUMN_ID, EXPAND_COLUMN_ID, 'id'],
      onlyFilterable: true,
    });
  }, [columnDefs, externalFilterDefinitions]);

  // Redimensionamento de coluna feito pelo usuário
  const handleChangeColumns = useCallback(
    (_columnIndex: number | null, info: { columns: BGridColumn<BGridRow<T>>[] }) => {
      setWidthOverrides((prev) => {
        let changed = false;
        const next = { ...prev };
        info.columns.forEach((column) => {
          const id = column.id;
          if (!id || typeof column.width !== 'number') return;
          const def = columnDefs.find((col) => col.field === id);
          if (!def) return;
          const clamped = clampWidth(column.width, def.minWidth, def.maxWidth);
          if ((effectiveWidths[id] ?? def.width) !== clamped) {
            next[id] = clamped;
            changed = true;
          }
        });
        return changed ? next : prev;
      });
    },
    [columnDefs, effectiveWidths]
  );

  // Sincroniza o registro corrente do DataSource com a linha clicada/focada
  const syncCursor = useCallback(
    (row: T | undefined) => {
      if (!row) return;
      setCurrentRowKey(keyOfRow(row));

      if (syncInProgress.current) return;
      if (!dataSource.gotoRecordByData) return;

      const currentRecord = dataSource.getCurrentRecord?.();
      if (currentRecord) {
        try {
          const currentId = safeGetRowId(currentRecord, getRowId);
          const focusedId = safeGetRowId(row, getRowId);
          if (String(currentId) === String(focusedId)) return;
        } catch {
          // se a comparação falhar, segue com a sincronização
        }
      }

      syncInProgress.current = true;
      try {
        dataSource.gotoRecordByData(row);
      } catch (error) {
        console.error('[CELL FOCUS] Error syncing with DataSource:', error);
      }
      setTimeout(() => {
        syncInProgress.current = false;
      }, 100);
    },
    [dataSource, getRowId, keyOfRow]
  );

  const handleCellClick = useCallback(
    (params: { item: BGridRow<T>; column: BGridColumn<BGridRow<T>> }) => {
      const row = params?.item?.__row;
      if (!row) return;
      lastClickRef.current = { row, field: params.column?.id ?? '' };
      syncCursor(row);
    },
    [syncCursor]
  );

  const isManualQuery = manualSorting && manualFiltering;

  // Navegação por teclado: só mapeia índice -> registro quando a ordem exibida é a do servidor
  const handleActiveCellChange = useCallback(
    (cell?: { rowIndex: number; columnIndex: number }) => {
      if (!cell || !isManualQuery) return;
      syncCursor(rows[cell.rowIndex]);
    },
    [isManualQuery, rows, syncCursor]
  );

  // Duplo clique: a BGrid só expõe onClick, então o evento é capturado no container.
  const handleDoubleClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!onCellDoubleClick) return;
      const cell = (event.target as HTMLElement | null)?.closest?.('td[data-bgrid-cell="true"]');
      if (!cell) return;

      let row: T | undefined = lastClickRef.current?.row;
      let field: string | undefined = lastClickRef.current?.field;

      if (!row || !field) {
        const rowIndex = Number(
          cell.getAttribute('data-bgrid-logical-row-index') ?? cell.getAttribute('data-row-index')
        );
        const columnIndex = Number(cell.getAttribute('data-column-index'));
        row = Number.isFinite(rowIndex) ? rows[rowIndex] : undefined;
        field = Number.isFinite(columnIndex) ? columnDefs[columnIndex]?.field : undefined;
      }

      if (!row || !field) return;

      onCellDoubleClick({
        id: safeGetRowId(row, getRowId) || '',
        columnName: field,
        rowData: row,
      });
    },
    [onCellDoubleClick, rows, columnDefs, getRowId]
  );

  // Seleção por checkbox
  const handleCheckedChange = useCallback(
    (_checkedIndexes: number[], checkedRowKeys: React.Key[]) => {
      const keys = (checkedRowKeys || []).map(String);
      setCheckedKeys(keys);

      const selected = keys.map((key) => rowByKey.get(key)).filter((row): row is T => row !== undefined);
      setSelectedRows(selected);

      if (onSelectedRowsChanged) {
        onSelectedRowsChanged(selected);
      }

      if (syncInProgress.current) return;

      if (selected.length === 1 && dataSource.gotoRecordByData) {
        syncInProgress.current = true;
        try {
          dataSource.gotoRecordByData(selected[0]);
        } catch (error) {
          console.error('[SELECTION] Error syncing with DataSource:', error);
        }
        setCurrentRowKey(keys[0]);
        setTimeout(() => {
          syncInProgress.current = false;
        }, 100);
      }
    },
    [rowByKey, onSelectedRowsChanged, dataSource]
  );

  // Quando as linhas mudam (nova página, refresh), descarta seleções que não existem mais
  useEffect(() => {
    const current = checkedKeysRef.current;
    if (current.length === 0) return;
    const remaining = current.filter((key) => rowByKey.has(key));
    if (remaining.length === current.length) {
      setSelectedRows(remaining.map((key) => rowByKey.get(key) as T));
      return;
    }
    setCheckedKeys(remaining);
    const selected = remaining.map((key) => rowByKey.get(key) as T);
    setSelectedRows(selected);
    if (onSelectedRowsChanged) {
      onSelectedRowsChanged(selected);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowByKey]);

  const rowChecked = useMemo(() => {
    if (!enableRowSelection) return undefined;
    return {
      checkedRowKeys: checkedKeys as React.Key[],
      onChange: handleCheckedChange,
    };
  }, [enableRowSelection, checkedKeys, handleCheckedChange]);

  // Ordenação / filtros de coluna
  const handleQueryChange = useCallback(
    (query: BGridDataQuery, event: BGridDataQueryChangeEvent) => {
      setDataQuery(query);

      if (event.type === 'sort') {
        const newSortModel = (query.sortParams || [])
          .filter((sort) => !!sort.columnId)
          .map((sort) => ({ colId: sort.columnId as string, sort: sort.orderBy }));

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
            // `field` acompanha `colId` para que getInitialSortModel consiga reler a ordenação.
            options.originSort = newSortModel.map((sort) => ({ ...sort, field: sort.colId }));
            setIsLoadingInternal(true);
            (dataSource as any).refreshData?.(options);
          }

          closeAllDetailPanels();
        }
        return;
      }

      if (!manualFiltering || hideAgGridFilters) return;

      const newFilterModel = toFilterModel(query.filterParams || []);
      setColumnFilterModel(newFilterModel);

      const rsql = buildFilterExpression(newFilterModel, columnDefs as any, quickFilterText);

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
      manualSorting,
      manualFiltering,
      hideAgGridFilters,
      isV2,
      dataSource,
      paginationModel,
      columnDefs,
      quickFilterText,
      closeAllDetailPanels,
    ]
  );

  const dataControl = useMemo(
    () => ({
      mode: (isManualQuery ? 'manual' : 'client') as 'manual' | 'client',
      multiSort: false,
      query: dataQuery,
      onChange: handleQueryChange,
    }),
    [isManualQuery, dataQuery, handleQueryChange]
  );

  // Busca global da toolbar
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

      const rsql = buildFilterExpression(columnFilterModel, columnDefs as any, quickFilterValue);

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
      columnFilterModel,
      columnDefs,
      isV2,
      dataSource,
      paginationModel.pageSize,
      closeAllDetailPanels,
    ]
  );

  // Filtros compostos
  const handleCompositeFiltersChange = useCallback(
    (filters: any[], rsql?: string) => {
      if (externalActiveFilters === undefined) {
        setInternalActiveFilters(filters);
      }

      if (externalOnFiltersChange) {
        externalOnFiltersChange(filters, rsql);
      }

      if (rsql || (filters && filters.length > 0)) {
        setColumnFilterModel(convertActiveFiltersToAgGridModel(filters || []));
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
        setColumnFilterModel({});

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

  const handleRefresh = useCallback(() => {
    const rsql = buildFilterExpression(columnFilterModel, columnDefs as any, quickFilterText);

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
  }, [columnFilterModel, columnDefs, quickFilterText, isV2, dataSource, paginationModel, closeAllDetailPanels]);

  const handlePaginationChange = useCallback(
    (newPaginationModel: { page: number; pageSize: number }) => {
      const safePageSize = Math.min(newPaginationModel.pageSize, MAX_PAGE_SIZE);

      setPaginationModel({
        page: newPaginationModel.page,
        pageSize: safePageSize,
      });

      if (manualPagination) {
        const rsql = buildFilterExpression(columnFilterModel, columnDefs as any, quickFilterText);

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
    [manualPagination, columnFilterModel, columnDefs, quickFilterText, isV2, dataSource, closeAllDetailPanels]
  );

  // Exportação / impressão
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

  useEffect(() => {
    if (onExport) onExport(handleExportClick);
    if (onPrint) onPrint(handlePrintClick);
  }, [onExport, onPrint, handleExportClick, handlePrintClick]);

  // Ref público: mesmos métodos da versão AG
  useImperativeHandle(
    gridRef,
    () => ({
      refreshData: handleRefresh,
      getSelectedRows: () => selectedRows,
      clearSelection: () => {
        const hadSelection = checkedKeysRef.current.length > 0;
        setCheckedKeys([]);
        setSelectedRows([]);
        if (hadSelection && onSelectedRowsChanged) {
          onSelectedRowsChanged([]);
        }
      },
      exportData: handleExportClick,
      printData: handlePrintClick,
      expandRow: (rowId) => expandDetailPanel(rowId),
      collapseRow: (rowId) => closeDetailPanel(rowId),
      collapseAllRows: closeAllDetailPanels,
      getExpandedRows: () => Array.from(expandedRowIds),
      getFilterModel: () => filterModel,
      // A engine não é mais o AG Grid: não há GridApi para devolver (o tipo já admitia null).
      getGridApi: () => null,
      autoSizeAllColumns: (skipHeader = false) => {
        setWidthOverrides((prev) => ({ ...prev, ...computeContentWidths(columnDefs, skipHeader) }));
      },
      sizeColumnsToFit: () => {
        setWidthOverrides((prev) => computeFitWidths(columnDefs, prev));
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
      onSelectedRowsChanged,
      columnDefs,
      computeContentWidths,
      computeFitWidths,
    ]
  );

  // Eventos do DataSource
  const indexByKeyRef = useRef(indexByKey);
  indexByKeyRef.current = indexByKey;

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

        const dsPageSize = Number.isFinite(dataSource.getPageSize?.())
          ? Math.min(Math.max(1, dataSource.getPageSize()), MAX_PAGE_SIZE)
          : 10;

        setPaginationModel({ page: currentPage, pageSize: dsPageSize });

        const grandTotal = Number.isFinite(dataSource.getGrandTotalRecords?.())
          ? Math.max(0, dataSource.getGrandTotalRecords())
          : 0;

        setTotalRecords(grandTotal);
        setIsLoadingInternal(false);
        closeAllDetailPanels();
      } else if (event.type === DataSourceEventNames.onError) {
        setIsLoadingInternal(false);
      } else if (event.type === DataSourceEventNames.afterScroll) {
        if (syncInProgress.current) return;

        const currentRecord = dataSource.getCurrentRecord();
        if (!currentRecord) return;

        try {
          const currentId = safeGetRowId(currentRecord, getRowId);
          if (currentId === undefined || currentId === null) return;
          const key = String(currentId);
          const index = indexByKeyRef.current.get(key);

          setCurrentRowKey(key);
          if (index !== undefined) {
            bgridRef.current?.scrollToRow(index);
          }

          // Com várias linhas marcadas o usuário está montando uma seleção em lote:
          // mover o cursor não pode apagá-la. Só garante que o registro fique visível.
          if (checkedKeysRef.current.length > 1) return;

          syncInProgress.current = true;
          setCheckedKeys(index !== undefined ? [key] : []);
          setSelectedRows([currentRecord]);
          if (onSelectedRowsChanged) {
            onSelectedRowsChanged([currentRecord]);
          }

          setTimeout(() => {
            syncInProgress.current = false;
          }, 100);
        } catch (error) {
          console.error('[DATASOURCE] Error processing afterScroll:', error);
          syncInProgress.current = false;
        }
      }
    };

    dataSource.addListener(handleDataSourceEvent);
    return () => {
      dataSource.removeListener(handleDataSourceEvent);
    };
  }, [dataSource, getRowId, onSelectedRowsChanged, closeAllDetailPanels]);

  const modalColumns = useMemo(() => {
    return columnDefs
      .filter((col) => col.field && !col.field.startsWith('__') && col.exportable !== false)
      .map((col) => ({
        id: col.field,
        title: col.headerName || col.field,
      }));
  }, [columnDefs]);

  const containerStyle = useMemo(
    () => ({
      height,
      width,
      display: 'flex',
      flexDirection: 'column' as const,
      overflow: 'hidden',
      border: withBorder ? `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 8 : 3]}` : 'none',
      borderRadius: theme.radius.sm,
      backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
    }),
    [height, width, withBorder, theme, colorScheme]
  );

  // Tema Mantine -> variáveis CSS da BGrid (aplicadas direto no root da grid)
  const gridStyle = useMemo((): React.CSSProperties => {
    const isDark = colorScheme === 'dark';
    const primary = theme.colors[theme.primaryColor] || theme.colors.blue;
    const bodyBg = isDark ? theme.colors.dark[6] : theme.white;
    const border = isDark ? theme.colors.dark[4] : theme.colors.gray[3];

    return {
      '--bgrid-primary-color': primary[isDark ? 5 : 6],
      '--bgrid-body-bg': bodyBg,
      '--bgrid-body-color': isDark ? theme.colors.dark[0] : theme.black,
      '--bgrid-body-odd-bg': striped ? (isDark ? theme.colors.dark[5] : theme.colors.gray[0]) : bodyBg,
      '--bgrid-body-hover-bg': highlightOnHover ? (isDark ? theme.colors.dark[4] : theme.colors.gray[1]) : bodyBg,
      '--bgrid-body-hover-odd-bg': highlightOnHover
        ? isDark
          ? theme.colors.dark[4]
          : theme.colors.gray[1]
        : striped
          ? isDark
            ? theme.colors.dark[5]
            : theme.colors.gray[0]
          : bodyBg,
      '--bgrid-body-active-bg': isDark ? theme.colors.dark[4] : primary[0],
      '--bgrid-header-bg': isDark ? theme.colors.dark[7] : theme.colors.gray[0],
      '--bgrid-header-color': isDark ? theme.colors.dark[0] : theme.colors.gray[8],
      '--bgrid-header-font-weight': String(headerFontWeight),
      '--bgrid-border-color-base': border,
      '--bgrid-border-color-light': border,
      '--bgrid-border-color-subtle': border,
      '--bgrid-font-family': theme.fontFamily,
      '--bgrid-font-size':
        fontSize !== undefined ? (typeof fontSize === 'number' ? `${fontSize}px` : fontSize) : theme.fontSizes.sm,
    } as React.CSSProperties;
  }, [theme, colorScheme, striped, highlightOnHover, headerFontWeight, fontSize]);

  const cellNavigationOptions = useMemo(
    () => ({ enabled: true, onActiveCellChange: handleActiveCellChange }),
    [handleActiveCellChange]
  );

  const renderFixedDetailPanel = () => {
    if (!renderDetailPanel || expandedRowIds.size === 0) return null;

    const rowId = Array.from(expandedRowIds)[0];
    const rowData = rows.find((row) => String(safeGetRowId(row, getRowId)) === String(rowId));

    if (!rowData) return null;

    const panelTitle =
      typeof detailPanelTitle === 'function' ? detailPanelTitle(rowId, rowData) : detailPanelTitle;

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
          <Box>{renderDetailPanel({ row: rowData })}</Box>
        </Box>
      </div>
    );
  };

  const renderFloatingDetailPanels = () => {
    if (!renderDetailPanel || expandedRowIds.size === 0) return null;

    return Array.from(expandedRowIds).map((rowId) => {
      const rowData = rows.find((row) => String(safeGetRowId(row, getRowId)) === String(rowId));
      if (!rowData) return null;

      const panelTitle =
        typeof detailPanelTitle === 'function' ? detailPanelTitle(rowId, rowData) : detailPanelTitle;

      if (detailPanelDisplayMode === 'drawer') {
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
      }

      if (detailPanelDisplayMode === 'modal' || (detailPanelDisplayMode === 'auto' && shouldUseModal)) {
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

  const itemHeight = Math.max(12, rowHeight - ITEM_PADDING * 2);

  return (
    <Box
      className={`archbase-data-grid archbase-data-grid-bgrid ${
        enableColumnResizing ? '' : 'archbase-data-grid-bgrid-no-resize'
      } ${className}`}
      ref={gridContainerRef}
      style={containerStyle}
    >
      {!enableColumnResizing && (
        <style
          dangerouslySetInnerHTML={{
            __html: '.archbase-data-grid-bgrid-no-resize .bgrid-col-resizer{display:none !important;}',
          }}
        />
      )}

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
          apiRef={{ current: bgridRef.current }}
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

      {(detailPanelDisplayMode === 'inline' || (detailPanelDisplayMode === 'auto' && !shouldUseModal)) &&
        renderFixedDetailPanel()}

      <Box
        ref={gridBodyRef}
        style={{ flex: 1, overflow: 'hidden', position: 'relative', minHeight: 0 }}
        onDoubleClick={handleDoubleClick}
      >
        <BGrid<BGridRow<T>>
          ref={bgridRef}
          width={gridWidth}
          height={gridHeight}
          headerHeight={HEADER_HEIGHT}
          bottomBarHeight={0}
          itemHeight={itemHeight}
          itemPadding={ITEM_PADDING}
          columns={bgridColumns}
          data={gridData}
          rowKey="__id"
          selectedRowKey={currentRowKey}
          frozenColumnIndex={frozenColumnIndex}
          rowChecked={rowChecked}
          dataControl={dataControl}
          onClick={handleCellClick as any}
          onChangeColumns={handleChangeColumns as any}
          loading={isLoadingInternal || isLoading}
          showLineNumber={enableRowNumbers}
          variant={withColumnBorders ? 'vertical-bordered' : 'default'}
          msg={BGRID_LOCALE_PTBR}
          status={{ visible: false }}
          pagination={{ visible: false }}
          cellNavigationOptions={cellNavigationOptions}
          style={gridStyle}
        />
      </Box>

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

      {renderFloatingDetailPanels()}

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

export default ArchbaseDataGridBGrid;
