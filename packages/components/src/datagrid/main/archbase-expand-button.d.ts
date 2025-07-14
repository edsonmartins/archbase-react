import React from 'react';
import { GridRowId } from '@mui/x-data-grid';
/**
 * Componente que renderiza o botão de expansão para mostrar/ocultar detalhes
 */
export declare function ArchbaseExpandButton({ rowId, expanded, onClick, buttonRef }: {
    rowId: GridRowId;
    expanded: boolean;
    onClick: (rowId: GridRowId) => void;
    buttonRef?: React.RefObject<HTMLButtonElement>;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Função auxiliar para criar a coluna de expansão com referências aos botões
 */
export declare function createExpandColumn(expandedRowIds: Set<GridRowId>, onToggleExpand: (rowId: GridRowId) => void, buttonRefs?: Map<GridRowId, React.RefObject<HTMLButtonElement>>): {
    field: string;
    headerName: string;
    sortable: boolean;
    filterable: boolean;
    width: number;
    renderCell: (params: any) => import("react/jsx-runtime").JSX.Element;
};
//# sourceMappingURL=archbase-expand-button.d.ts.map