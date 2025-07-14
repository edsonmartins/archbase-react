import React from 'react';
import { GridRowId } from '@mui/x-data-grid';
/**
 * Componente para renderizar o painel de detalhes como popover quando não há espaço suficiente
 */
export declare function ArchbaseDetailPopover<T extends object = any>({ rowId, rowData, renderDetailPanel, onClose, theme, className, style, opened, targetRef, // Referência ao elemento alvo (botão de expandir)
width, maxHeight }: {
    rowId: GridRowId;
    rowData: T;
    renderDetailPanel: (props: {
        row: T;
    }) => React.ReactNode;
    onClose: (rowId: GridRowId) => void;
    theme: any;
    className?: string;
    style?: React.CSSProperties;
    opened: boolean;
    targetRef: React.RefObject<HTMLElement>;
    width?: number | string;
    maxHeight?: number;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Componente alternativo usando HoverCard (útil quando quiser mostrar detalhes ao passar o mouse)
 */
export declare function ArchbaseDetailHoverCard<T extends object = any>({ rowId, rowData, renderDetailPanel, onClose, theme, className, style, targetRef, width }: {
    rowId: GridRowId;
    rowData: T;
    renderDetailPanel: (props: {
        row: T;
    }) => React.ReactNode;
    onClose: (rowId: GridRowId) => void;
    theme: any;
    className?: string;
    style?: React.CSSProperties;
    targetRef: React.RefObject<HTMLElement>;
    width?: number | string;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=archbase-grid-popover.d.ts.map