import { GridFilterModel, GridRowSelectionModel, GridSortModel, GridPaginationModel, GridEventListener } from '@mui/x-data-grid';
import { ArchbaseDataSource } from '@archbase/data';
/**
 * Interface para o estado do grid
 */
export interface ArchbaseGridState<T> {
    rows: T[];
    totalRecords: number;
    totalPages: number;
    isLoading: boolean;
    paginationModel: GridPaginationModel;
    sortModel: GridSortModel;
    filterModel: GridFilterModel;
    selectionModel: GridRowSelectionModel;
    selectedRowsData: T[];
    setPaginationModel: (model: GridPaginationModel) => void;
    setSortModel: (model: GridSortModel) => void;
    setFilterModel: (model: GridFilterModel) => void;
    setSelectionModel: (model: GridRowSelectionModel) => void;
    refreshData: () => void;
    handleCellKeyDown: GridEventListener<'cellKeyDown'>;
}
/**
 * Hook personalizado para integrar o MUI X DataGrid com o ArchbaseDataSource
 */
export declare function useGridData<T extends object, ID>({ dataSource, pageSize, pageIndex, getRowId, columns }: {
    dataSource: ArchbaseDataSource<T, ID>;
    pageSize?: number;
    pageIndex?: number;
    getRowId: (row: T) => any;
    columns: any[];
}): ArchbaseGridState<T>;
//# sourceMappingURL=use-grid-data.d.ts.map