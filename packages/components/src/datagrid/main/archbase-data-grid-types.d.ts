import React from 'react';
import { MutableRefObject, ReactNode, RefObject } from 'react';
import { GridRowId, GridFilterModel, GridPaginationModel } from '@mui/x-data-grid';
import { ArchbaseDataSource } from '@archbase/data';
/**
 * DataGrid Types - V1/V2 Compatible
 *
 * These types support both V1 and V2 DataSource versions.
 * The actual V1/V2 compatibility logic is handled in the
 * components that use these types (like ArchbaseDataGrid and useGridData).
 */
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
    expandRow: (rowId: GridRowId) => void;
    collapseRow: (rowId: GridRowId) => void;
    collapseAllRows: () => void;
    getExpandedRows: () => GridRowId[];
}
export interface GridToolBarActionsProps {
    children: ReactNode;
}
export interface GridColumnsProps {
    children: ReactNode;
}
export interface ArchbaseDataGridToolbarProps {
    dataSource: ArchbaseDataSource<any, any>;
    filterModel: GridFilterModel;
    enableGlobalFilter?: boolean;
    enableTopToolbarActions?: boolean;
    allowExportData?: boolean;
    allowPrintData?: boolean;
    toolbarAlignment?: 'left' | 'right' | 'center';
    toolbarLeftContent?: ReactNode;
    renderToolbarActions?: () => ReactNode;
    renderToolbarInternalActions?: (props: {
        table: any;
    }) => ReactNode | null;
    theme: any;
    onFilterModelChange: (newFilterModel: GridFilterModel) => void;
    onRefresh: () => void;
    onExport: () => void;
    onPrint: () => void;
    apiRef: any;
    children: ReactNode;
}
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
}
/**
 * Componente para definir ações na barra de ferramentas
 */
export declare function GridToolBarActions(props: GridToolBarActionsProps): import("react/jsx-runtime").JSX.Element;
/**
 * Componente para agrupar as definições de colunas
 */
export declare function Columns(props: GridColumnsProps): import("react/jsx-runtime").JSX.Element;
export declare namespace Columns {
    var componentName: string;
}
/**
 * Componente para definir uma coluna na grid
 * Este componente é apenas declarativo e não renderiza nada
 */
export declare function ArchbaseDataGridColumn<T>(_props: ArchbaseDataGridColumnProps<T>): any;
export declare namespace ArchbaseDataGridColumn {
    var defaultProps: {
        visible: boolean;
        size: number;
        align: string;
        enableColumnFilter: boolean;
        enableGlobalFilter: boolean;
        headerAlign: string;
        footerAlign: string;
        enableClickToCopy: boolean;
        enableSorting: boolean;
        dataType: string;
        inputFilterType: string;
        enumValues: any[];
    };
}
export interface ArchbaseDataGridProps<T extends object = any, ID = any> {
    dataSource: ArchbaseDataSource<T, ID>;
    getRowId?: (row: T) => ID;
    enableColumnResizing?: boolean;
    enableRowNumbers?: boolean;
    enableRowSelection?: boolean;
    enableRowActions?: boolean;
    enableColumnFilterModes?: boolean;
    enableGlobalFilter?: boolean;
    enableTopToolbar?: boolean;
    enableTopToolbarActions?: boolean;
    showPagination?: boolean;
    manualFiltering?: boolean;
    manualPagination?: boolean;
    manualSorting?: boolean;
    isLoading?: boolean;
    isError?: boolean;
    error?: any;
    height?: string | number;
    width?: string | number;
    pageSize?: number;
    pageIndex?: number;
    children?: ReactNode;
    renderRowActions?: (row: T) => ReactNode;
    renderToolbarActions?: () => ReactNode;
    renderToolbarInternalActions?: (props: {
        table: any;
    }) => ReactNode | null;
    renderTopToolbar?: ReactNode;
    renderDetailPanel?: (props: {
        row: T;
    }) => ReactNode;
    allowMultipleDetailPanels?: boolean;
    detailPanelMinHeight?: number;
    detailPanelStyle?: React.CSSProperties;
    detailPanelClassName?: string;
    onDetailPanelChange?: (expandedRowIds: GridRowId[]) => void;
    detailPanelDisplayMode?: 'auto' | 'inline' | 'modal' | 'drawer';
    detailPanelTitle?: string | ((rowId: GridRowId, rowData: T) => string);
    detailPanelPosition?: 'right' | 'left' | 'bottom' | 'top';
    detailPanelSize?: string | number;
    allowColumnFilters?: boolean;
    allowExportData?: boolean;
    allowPrintData?: boolean;
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
    printTitle?: string;
    logoPrint?: string;
    globalDateFormat?: string;
    csvOptions?: any;
    toolbarAlignment?: 'left' | 'right' | 'center';
    positionActionsColumn?: 'first' | 'last';
    toolbarLeftContent?: ReactNode;
    bottomToolbarMinHeight?: string | number;
    paginationLabels?: Record<string, string>;
    showProgressBars?: boolean;
    onSelectedRowsChanged?: (rows: T[]) => void;
    onCellDoubleClick?: (params: {
        id: any;
        columnName: string;
        rowData: T;
    }) => void;
    onExport?: (callback: () => void) => void;
    onPrint?: (callback: () => void) => void;
    gridRef?: RefObject<ArchbaseDataGridRef<T>> | MutableRefObject<ArchbaseDataGridRef<T> | null>;
}
export interface CellClickEvent {
    id: GridRowId;
    columnName: string;
    rowData: any;
}
export type FieldDataType = 'text' | 'integer' | 'float' | 'currency' | 'boolean' | 'date' | 'datetime' | 'time' | 'enum' | 'image' | 'uuid';
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
    enumValues?: Array<{
        label: string;
        value: string;
    }>;
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
}
//# sourceMappingURL=archbase-data-grid-types.d.ts.map