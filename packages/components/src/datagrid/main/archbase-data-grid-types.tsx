import React from 'react'
import { Fragment, MutableRefObject, ReactNode, RefObject } from 'react';
import { GridRowId, GridSortModel, GridFilterModel, GridPaginationModel } from '@mui/x-data-grid';
import { ArchbaseDataSource, IArchbaseDataSourceBase } from '@archbase/data';
import type {
  ArchbaseFilterDefinition,
  ArchbaseActiveFilter,
} from '../../filters/ArchbaseCompositeFilters.types';

/**
 * DataGrid Types - V1/V2 Compatible
 * 
 * These types support both V1 and V2 DataSource versions.
 * The actual V1/V2 compatibility logic is handled in the 
 * components that use these types (like ArchbaseDataGrid and useGridData).
 */

// Interface para a referência externa da Grid
export interface ArchbaseDataGridRef<T = any> {
  /**
   * Obtém as linhas selecionadas
   */
  getSelectedRows: () => T[];
  /**
   * Limpa a seleção
   */
  clearSelection: () => void;
  /**
   * Atualiza os dados da grid
   */
  refreshData: () => void;
  /**
   * Exporta os dados da grid
   */
  exportData: () => void;
  /**
   * Imprime os dados da grid
   */
  printData: () => void;
  // Métodos específicos do detail panel
  expandRow: (rowId: GridRowId) => void;
  collapseRow: (rowId: GridRowId) => void;
  collapseAllRows: () => void;
  getExpandedRows: () => GridRowId[];
  /**
   * Obtém o modelo de filtro atual
   */
  getFilterModel: () => GridFilterModel;
}

// Props para o Toolbar
export interface GridToolBarActionsProps {
  children: ReactNode;
}

// Props para o componente Columns
export interface GridColumnsProps {
  children: ReactNode;
}

// Props para o componente ArchbaseDataGridToolbar
export interface ArchbaseDataGridToolbarProps {
  dataSource: IArchbaseDataSourceBase<any>;
  filterModel: GridFilterModel;
  enableGlobalFilter?: boolean;
  enableTopToolbarActions?: boolean;
  allowExportData?: boolean;
  allowPrintData?: boolean;
  toolbarAlignment?: 'left' | 'right' | 'center';
  toolbarLeftContent?: ReactNode;
  renderToolbarActions?: () => ReactNode;
  renderToolbarInternalActions?: (props: { table: any }) => ReactNode | null;
  theme: any;
  onFilterModelChange: (newFilterModel: GridFilterModel) => void;
  onRefresh: () => void;
  onExport: () => void;
  onPrint: () => void;
  apiRef: any;
  children: ReactNode;

  // Props para ArchbaseCompositeFilters
  useCompositeFilters?: boolean;
  filterDefinitions?: ArchbaseFilterDefinition[];
  activeFilters?: ArchbaseActiveFilter[];
  onFiltersChange?: (filters: ArchbaseActiveFilter[], rsql?: string) => void;
  hideMuiFilters?: boolean;

  // Props para controle de bordas e espaçamento
  /** Exibir borda inferior da toolbar. Default: true */
  withBorder?: boolean;
  /** Padding da toolbar. Default: '8px 12px' */
  padding?: string | number;
  /** Border radius da toolbar. Default: theme.radius.sm */
  borderRadius?: string | number;
}

// Props para o componente ArchbaseDataGridPagination
export interface ArchbaseDataGridPaginationProps {
  paginationModel: GridPaginationModel;
  totalRecords: number;
  onPaginationModelChange: (model: GridPaginationModel) => void;
  paginationLabels?: {
    totalRecords?: string;
    pageSize?: string;
    currentPage?: string;
    of?: string;
  };
  bottomToolbarMinHeight?: string | number;
  theme: any;

  // Props para controle de bordas e espaçamento
  /** Exibir borda superior da paginação. Default: true */
  withBorder?: boolean;
  /** Padding da paginação. Default: '8px 12px' */
  padding?: string | number;
  /** Border radius da paginação. Default: theme.radius.sm */
  borderRadius?: string | number;
}

/**
 * Componente para definir ações na barra de ferramentas
 */
export function GridToolBarActions(props: GridToolBarActionsProps) {
  return <>{props.children}</>;
}

/**
 * Componente para agrupar as definições de colunas
 */
export function Columns(props: GridColumnsProps) {
  return <>{props.children}</>;
}

// Adiciona marca de identificação para o componente Columns
Columns.componentName = 'Columns';

/**
 * Componente para definir uma coluna na grid
 * Este componente é apenas declarativo e não renderiza nada
 */
export function ArchbaseDataGridColumn<T>(_props: ArchbaseDataGridColumnProps<T>) {
  return null;
}

// Valores padrão para as props de ArchbaseDataGridColumn
ArchbaseDataGridColumn.defaultProps = {
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
  
  // Novos defaults de segurança
  hideWhenNoPermission: false, // Por padrão, mostra fallback
  autoRegisterPermission: true, // Auto-registra permissões
  fallbackContent: '***', // Conteúdo padrão quando sem permissão
};

export interface ArchbaseDataGridProps<T extends object = any, ID = any> {
  // Propriedades de dados
  // Aceita tanto ArchbaseDataSource (V1) quanto ArchbaseRemoteDataSourceV2 (V2)
  // A detecção de versão é feita em runtime dentro do componente
  dataSource: IArchbaseDataSourceBase<T>;
  getRowId?: (row: T) => ID;
  
  // NOVAS props de segurança (100% opcionais)
  /** Nome do recurso para ativar segurança no grid */
  resourceName?: string;
  
  /** Descrição do recurso para contexto de segurança */
  resourceDescription?: string;
  
  /** Configurações de segurança para colunas */
  columnSecurityOptions?: {
    /** Fallback padrão para colunas sem permissão */
    defaultFallback?: ReactNode | string;
    /** Se true, oculta colunas sem permissão por padrão */
    hideByDefault?: boolean;
    /** Prefixo para auto-registro de permissões de coluna */
    permissionPrefix?: string;
  };

  // Propriedades de habilitação de recursos
  enableColumnResizing?: boolean;
  enableRowNumbers?: boolean;
  enableRowSelection?: boolean;
  enableRowActions?: boolean;
  enableColumnFilterModes?: boolean;
  enableGlobalFilter?: boolean;
  enableTopToolbar?: boolean;
  enableTopToolbarActions?: boolean;
  showPagination?: boolean;

  // Propriedades de modo manual
  manualFiltering?: boolean;
  manualPagination?: boolean;
  manualSorting?: boolean;

  // Propriedades de estado
  isLoading?: boolean;
  isError?: boolean;
  error?: any;

  // Propriedades de dimensão
  height?: string | number;
  width?: string | number;

  // Propriedades de paginação
  pageSize?: number;
  pageIndex?: number;

  // Propriedades de conteúdo e renderização
  children?: ReactNode;
  renderRowActions?: (row: T) => ReactNode;
  renderToolbarActions?: () => ReactNode;
  renderToolbarInternalActions?: (props: { table: any }) => ReactNode | null;
  renderTopToolbar?: ReactNode;

  // Propriedades de detail panel
  renderDetailPanel?: (props: { row: T }) => ReactNode;
  allowMultipleDetailPanels?: boolean;
  detailPanelMinHeight?: number;
  detailPanelStyle?: React.CSSProperties;
  detailPanelClassName?: string;
  onDetailPanelChange?: (expandedRowIds: GridRowId[]) => void;
  detailPanelDisplayMode?: 'auto' | 'inline' | 'modal' | 'drawer'; // Adicionado novo modo
  detailPanelTitle?: string | ((rowId: GridRowId, rowData: T) => string); // Título para o painel
  detailPanelPosition?: 'right' | 'left' | 'bottom' | 'top'; // Para o Drawer
  detailPanelSize?: string | number; // Tamanho para Modal/Drawer

  // Propriedades de permissões
  allowColumnFilters?: boolean;
  allowExportData?: boolean;
  allowPrintData?: boolean;

  // Propriedades de filtros compostos (ArchbaseCompositeFilters)
  useCompositeFilters?: boolean;
  filterDefinitions?: ArchbaseFilterDefinition[];
  activeFilters?: ArchbaseActiveFilter[];
  onFiltersChange?: (filters: ArchbaseActiveFilter[], rsql?: string) => void;
  hideMuiFilters?: boolean;

  // Propriedades de aparência
  withBorder?: boolean;
  withColumnBorders?: boolean;
  highlightOnHover?: boolean;
  striped?: boolean;
  className?: string;
  variant?: 'filled' | 'outlined';
  fontSize?: string | number;
  cellPadding?: string | number;
  tableHeadCellPadding?: string;
  columnAutoWidth?: boolean;
  rowHeight?: number;

  // Propriedades de controle de bordas internas
  /** Exibir borda inferior da toolbar. Default: true */
  withToolbarBorder?: boolean;
  /** Exibir borda superior da paginação. Default: true */
  withPaginationBorder?: boolean;
  /** Padding da toolbar. Default: '8px 12px' */
  toolbarPadding?: string | number;
  /** Padding da paginação. Default: '8px 12px' */
  paginationPadding?: string | number;

  // Propriedades de exportação e impressão
  printTitle?: string;
  logoPrint?: string;
  globalDateFormat?: string;
  csvOptions?: any;

  // Propriedades de layout
  toolbarAlignment?: 'left' | 'right' | 'center';
  positionActionsColumn?: 'first' | 'last';
  toolbarLeftContent?: ReactNode;
  bottomToolbarMinHeight?: string | number;

  // Labels e mensagens
  paginationLabels?: Record<string, string>;

  // Flags de exibição
  showProgressBars?: boolean;

  // Callbacks
  onSelectedRowsChanged?: (rows: T[]) => void;
  onCellDoubleClick?: (params: { id: any; columnName: string; rowData: T }) => void;
  onExport?: (callback: () => void) => void;
  onPrint?: (callback: () => void) => void;
  onFilterModelChange?: (filterModel: any) => void;

  // Referência para o grid
  gridRef?: RefObject<ArchbaseDataGridRef<T>> | MutableRefObject<ArchbaseDataGridRef<T> | null>;
}

export interface CellClickEvent {
  id: GridRowId;
  columnName: string;
  rowData: any;
}

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

export interface ArchbaseDataGridColumnProps<T = any> {
  header: string;
  footer?: string;
  dataField: string;
  enableColumnFilter?: boolean;
  enableGlobalFilter?: boolean;
  dataFieldAcessorFn?: (originalRow: T) => any;
  dataType: FieldDataType;
  maskOptions?: any;
  inputFilterType?: string;
  enumValues?: Array<{ label: string; value: string }>;
  minSize?: number;
  maxSize?: number;
  render?: (data: any) => ReactNode;
  visible: boolean;
  size: number;
  enableClickToCopy: boolean;
  enableSorting: boolean;
  align?: string;
  headerAlign?: string;
  footerAlign?: string;
  
  // NOVAS props de segurança (100% opcionais)
  /** Nome da permissão para visualizar esta coluna */
  viewPermission?: string;
  
  /** Nome da permissão para editar esta coluna (futuro) */
  editPermission?: string;
  
  /** Componente/texto a ser exibido quando não tem permissão */
  fallbackContent?: ReactNode | string;
  
  /** Se true, oculta coluna completamente sem permissão. Se false, mostra fallback */
  hideWhenNoPermission?: boolean;
  
  /** Auto-registra a permissão da coluna (padrão: true) */
  autoRegisterPermission?: boolean;
}
