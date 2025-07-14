import { GridFilterModel, GridRowId, GridSortModel } from '@mui/x-data-grid';
/**
 * Obtém o ID de uma linha de forma segura
 */
export declare const safeGetRowId: <T extends object>(row: T, getRowId?: (row: T) => any) => GridRowId | undefined;
/**
 * Constrói uma expressão de busca global
 */
export declare const buildGlobalFilterExpression: (filterValue: string, columns: any[]) => string | undefined;
/**
 * Constrói uma expressão de filtro
 */
export declare const buildFilterExpression: (filterModel: GridFilterModel, columns: any[]) => string | undefined;
/**
 * Converte valores hexadecimais para RGB
 */
export declare const getRgbValues: (hexColor: string) => string;
/**
 * Obtém o modelo de ordenação inicial a partir do DataSource
 */
export declare const getInitialSortModel: (dataSource: any) => GridSortModel;
//# sourceMappingURL=archbase-data-grid-utils.d.ts.map