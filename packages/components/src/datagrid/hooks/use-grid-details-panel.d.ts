import { GridRowId } from '@mui/x-data-grid';
/**
 * Hook personalizado para gerenciar os painéis de detalhes
 */
export declare function useDetailPanels<T extends object = any>({ allowMultipleDetailPanels, onDetailPanelChange, detailPanelMinHeight }?: {
    allowMultipleDetailPanels?: boolean;
    onDetailPanelChange?: (expandedRowIds: GridRowId[]) => void;
    detailPanelMinHeight?: number;
}): {
    expandedRowIds: Set<GridRowId>;
    detailPanelHeight: number;
    detailPanelRefs: import("react").RefObject<Map<GridRowId, HTMLDivElement>>;
    toggleExpand: (rowId: GridRowId) => void;
    closeDetailPanel: (rowId: GridRowId) => void;
    closeAllDetailPanels: () => void;
    expandDetailPanel: (rowId: GridRowId) => void;
    setExpandedRowIds: import("react").Dispatch<import("react").SetStateAction<Set<GridRowId>>>;
};
/**
 * Hook para detectar cliques fora e scroll para fechar os painéis de detalhes
 */
export declare function useDetailPanelAutoClose({ containerRef, expandedRowIds, detailPanelRefs, closeAllDetailPanels }: {
    containerRef: React.RefObject<HTMLElement>;
    expandedRowIds: Set<GridRowId>;
    detailPanelRefs: React.MutableRefObject<Map<GridRowId, HTMLDivElement>>;
    closeAllDetailPanels: () => void;
}): void;
/**
 * Hook para calcular as posições dos painéis de detalhes inline
 */
export declare function useDetailPanelPositions<T extends object = any>({ rows, getRowId, safeGetRowId, expandedRowIds, detailPanelHeights, rowHeight, headerHeight, detailPanelMinHeight }: {
    rows: T[];
    getRowId?: (row: T) => any;
    safeGetRowId: (row: T, getRowId?: any) => any;
    expandedRowIds: Set<GridRowId>;
    detailPanelHeights: Map<GridRowId, number>;
    rowHeight?: number;
    headerHeight?: number;
    detailPanelMinHeight?: number;
}): () => Map<GridRowId, number>;
/**
 * Hook para verificar o espaço disponível na viewport
 */
export declare function useAvailableSpace<T extends object = any>({ containerRef, rows, getRowId, safeGetRowId, rowHeight, detailPanelMinHeight }: {
    containerRef: React.RefObject<HTMLElement>;
    rows: T[];
    getRowId?: (row: T) => any;
    safeGetRowId: (row: T, getRowId?: any) => any;
    rowHeight?: number;
    detailPanelMinHeight?: number;
}): boolean;
//# sourceMappingURL=use-grid-details-panel.d.ts.map