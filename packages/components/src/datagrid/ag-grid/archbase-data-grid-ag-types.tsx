/**
 * ArchbaseDataGridAG Types
 *
 * Type definitions for the AG Grid implementation of ArchbaseDataGrid.
 * Maintains API compatibility with the MUI DataGrid version.
 */
import React, { MutableRefObject, ReactNode, RefObject } from 'react';
import type { ColDef, GridApi, RowSelectionOptions } from 'ag-grid-community';
import type { IArchbaseDataSourceBase } from '@archbase/data';
import type {
  ArchbaseFilterDefinition,
  ArchbaseActiveFilter,
} from '../../filters/ArchbaseCompositeFilters.types';

/**
 * Reference interface for external grid control
 */
export interface ArchbaseDataGridAGRef<T = any> {
  /** Get selected rows */
  getSelectedRows: () => T[];
  /** Clear selection */
  clearSelection: () => void;
  /** Refresh grid data */
  refreshData: () => void;
  /** Export grid data */
  exportData: () => void;
  /** Print grid data */
  printData: () => void;
  /** Expand a specific row's detail panel */
  expandRow: (rowId: string | number) => void;
  /** Collapse a specific row's detail panel */
  collapseRow: (rowId: string | number) => void;
  /** Collapse all expanded detail panels */
  collapseAllRows: () => void;
  /** Get all expanded row IDs */
  getExpandedRows: () => (string | number)[];
  /** Get current filter model */
  getFilterModel: () => any;
  /** Get AG Grid API */
  getGridApi: () => GridApi | null;
}

/**
 * Data types supported by grid columns
 */
export type FieldDataType =
  | 'text'
  | 'integer'
  | 'float'
  | 'currency'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'time'
  | 'enum'
  | 'image'
  | 'uuid';

/**
 * Column props (same API as MUI version)
 */
export interface ArchbaseDataGridAGColumnProps<T = any> {
  /** Column header text */
  header: string;
  /** Column footer text */
  footer?: string;
  /** Data field to bind */
  dataField: string;
  /** Enable column filtering */
  enableColumnFilter?: boolean;
  /** Enable global filter search on this column */
  enableGlobalFilter?: boolean;
  /** Custom accessor function */
  dataFieldAcessorFn?: (originalRow: T) => any;
  /** Data type for formatting and filtering */
  dataType: FieldDataType;
  /** Mask options for text formatting */
  maskOptions?: any;
  /** Input filter type */
  inputFilterType?: string;
  /** Enum values for select filters */
  enumValues?: Array<{ label: string; value: string }>;
  /** Minimum column width */
  minSize?: number;
  /** Maximum column width */
  maxSize?: number;
  /** Custom cell renderer */
  render?: (data: any) => ReactNode;
  /** Column visibility */
  visible: boolean;
  /** Column width */
  size: number;
  /** Enable click to copy */
  enableClickToCopy: boolean;
  /** Enable sorting */
  enableSorting: boolean;
  /** Cell alignment */
  align?: 'left' | 'center' | 'right';
  /** Header alignment */
  headerAlign?: 'left' | 'center' | 'right';
  /** Footer alignment */
  footerAlign?: 'left' | 'center' | 'right';

  // Security props (optional)
  /** Permission name to view this column */
  viewPermission?: string;
  /** Permission name to edit this column */
  editPermission?: string;
  /** Fallback content when no permission */
  fallbackContent?: ReactNode | string;
  /** Hide column completely when no permission */
  hideWhenNoPermission?: boolean;
  /** Auto-register column permission */
  autoRegisterPermission?: boolean;
}

/**
 * Default column props
 */
export const defaultColumnProps: Partial<ArchbaseDataGridAGColumnProps> = {
  visible: true,
  size: 100,
  align: 'left',
  enableColumnFilter: true,
  enableGlobalFilter: true,
  headerAlign: 'left',
  footerAlign: 'left',
  enableClickToCopy: false,
  enableSorting: true,
  dataType: 'text',
  inputFilterType: 'text',
  enumValues: [],
  hideWhenNoPermission: false,
  autoRegisterPermission: true,
  fallbackContent: '***',
};

/**
 * Props for toolbar actions
 */
export interface GridToolBarActionsProps {
  children: ReactNode;
}

/**
 * Props for columns wrapper
 */
export interface GridColumnsProps {
  children: ReactNode;
}

/**
 * Cell click event data
 */
export interface CellClickEvent<T = any> {
  id: string | number;
  columnName: string;
  rowData: T;
}

/**
 * Main ArchbaseDataGridAG props
 */
export interface ArchbaseDataGridAGProps<T extends object = any, ID = any> {
  // Data properties
  /** DataSource (V1 or V2 compatible) */
  dataSource: IArchbaseDataSourceBase<T>;
  /** Function to get row ID */
  getRowId?: (row: T) => ID;

  // Security props (optional)
  /** Resource name for grid security */
  resourceName?: string;
  /** Resource description */
  resourceDescription?: string;
  /** Column security options */
  columnSecurityOptions?: {
    defaultFallback?: ReactNode | string;
    hideByDefault?: boolean;
    permissionPrefix?: string;
  };

  // Feature toggles
  /** Enable column resizing */
  enableColumnResizing?: boolean;
  /** Enable row numbers */
  enableRowNumbers?: boolean;
  /** Enable row selection with checkboxes */
  enableRowSelection?: boolean;
  /** Enable row actions column */
  enableRowActions?: boolean;
  /** Enable column filter modes */
  enableColumnFilterModes?: boolean;
  /** Enable global filter search */
  enableGlobalFilter?: boolean;
  /** Enable top toolbar */
  enableTopToolbar?: boolean;
  /** Enable toolbar actions */
  enableTopToolbarActions?: boolean;
  /** Show pagination */
  showPagination?: boolean;

  // Manual mode flags
  /** Manual filtering (server-side) */
  manualFiltering?: boolean;
  /** Manual pagination (server-side) */
  manualPagination?: boolean;
  /** Manual sorting (server-side) */
  manualSorting?: boolean;

  // State
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  isError?: boolean;
  /** Error object */
  error?: any;

  // Dimensions
  /** Grid height */
  height?: string | number;
  /** Grid width */
  width?: string | number;

  // Pagination
  /** Page size */
  pageSize?: number;
  /** Current page index */
  pageIndex?: number;

  // Content and rendering
  /** Column definitions as children */
  children?: ReactNode;
  /** Render row actions */
  renderRowActions?: (row: T) => ReactNode;
  /** Render toolbar actions */
  renderToolbarActions?: () => ReactNode;
  /** Render internal toolbar actions */
  renderToolbarInternalActions?: (props: { table: any }) => ReactNode | null;
  /** Custom top toolbar */
  renderTopToolbar?: ReactNode;

  // Detail panel
  /** Render detail panel content */
  renderDetailPanel?: (props: { row: T }) => ReactNode;
  /** Allow multiple detail panels open */
  allowMultipleDetailPanels?: boolean;
  /** Minimum detail panel height */
  detailPanelMinHeight?: number;
  /** Detail panel style */
  detailPanelStyle?: React.CSSProperties;
  /** Detail panel class name */
  detailPanelClassName?: string;
  /** Callback when detail panels change */
  onDetailPanelChange?: (expandedRowIds: (string | number)[]) => void;
  /** Detail panel display mode */
  detailPanelDisplayMode?: 'auto' | 'inline' | 'modal' | 'drawer';
  /** Detail panel title */
  detailPanelTitle?: string | ((rowId: string | number, rowData: T) => string);
  /** Detail panel position (for drawer) */
  detailPanelPosition?: 'right' | 'left' | 'bottom' | 'top';
  /** Detail panel size (for modal/drawer) */
  detailPanelSize?: string | number;

  // Permissions
  /** Allow column filters */
  allowColumnFilters?: boolean;
  /** Allow data export */
  allowExportData?: boolean;
  /** Allow data print */
  allowPrintData?: boolean;

  // Composite filters
  /** Use ArchbaseCompositeFilters */
  useCompositeFilters?: boolean;
  /** Filter definitions */
  filterDefinitions?: ArchbaseFilterDefinition[];
  /** Active filters */
  activeFilters?: ArchbaseActiveFilter[];
  /** Callback when filters change */
  onFiltersChange?: (filters: ArchbaseActiveFilter[], rsql?: string) => void;
  /** Hide AG Grid native filters */
  hideAgGridFilters?: boolean;

  // Appearance
  /** Show border */
  withBorder?: boolean;
  /** Show column borders */
  withColumnBorders?: boolean;
  /** Highlight row on hover */
  highlightOnHover?: boolean;
  /** Striped rows */
  striped?: boolean;
  /** CSS class name */
  className?: string;
  /** Grid variant */
  variant?: 'filled' | 'outlined';
  /** Font size */
  fontSize?: string | number;
  /** Cell padding */
  cellPadding?: string | number;
  /** Table head cell padding */
  tableHeadCellPadding?: string;
  /** Auto column width */
  columnAutoWidth?: boolean;
  /** Row height */
  rowHeight?: number;

  // Internal border controls
  /** Show toolbar border */
  withToolbarBorder?: boolean;
  /** Show pagination border */
  withPaginationBorder?: boolean;
  /** Toolbar padding */
  toolbarPadding?: string | number;
  /** Pagination padding */
  paginationPadding?: string | number;

  // Export/Print
  /** Print title */
  printTitle?: string;
  /** Print logo */
  logoPrint?: string;
  /** Global date format */
  globalDateFormat?: string;
  /** CSV export options */
  csvOptions?: any;

  // Layout
  /** Toolbar alignment */
  toolbarAlignment?: 'left' | 'right' | 'center';
  /** Actions column position */
  positionActionsColumn?: 'first' | 'last';
  /** Actions column width */
  actionsColumnWidth?: number;
  /** Toolbar left content */
  toolbarLeftContent?: ReactNode;
  /** Bottom toolbar min height */
  bottomToolbarMinHeight?: string | number;

  // Labels
  /** Pagination labels */
  paginationLabels?: Record<string, string>;

  // Display flags
  /** Show progress bars */
  showProgressBars?: boolean;
  /** Hide footer */
  hideFooter?: boolean;

  // Callbacks
  /** Selected rows changed callback */
  onSelectedRowsChanged?: (rows: T[]) => void;
  /** Cell double click callback */
  onCellDoubleClick?: (params: CellClickEvent<T>) => void;
  /** Export callback */
  onExport?: (callback: () => void) => void;
  /** Print callback */
  onPrint?: (callback: () => void) => void;
  /** Filter model change callback */
  onFilterModelChange?: (filterModel: any) => void;

  // Reference
  /** Grid reference */
  gridRef?: RefObject<ArchbaseDataGridAGRef<T>> | MutableRefObject<ArchbaseDataGridAGRef<T> | null>;
}

/**
 * Declarative Column component
 */
export function ArchbaseDataGridAGColumn<T>(_props: ArchbaseDataGridAGColumnProps<T>) {
  return null;
}

ArchbaseDataGridAGColumn.defaultProps = defaultColumnProps;

/**
 * Columns wrapper component
 */
export function Columns(props: GridColumnsProps) {
  return <>{props.children}</>;
}

Columns.componentName = 'Columns';

/**
 * Toolbar actions wrapper
 */
export function GridToolBarActions(props: GridToolBarActionsProps) {
  return <>{props.children}</>;
}

/**
 * Internal AG Grid ColDef with extended properties
 */
export interface ExtendedColDef extends ColDef {
  enableGlobalFilter?: boolean;
  dataType?: FieldDataType;
}
