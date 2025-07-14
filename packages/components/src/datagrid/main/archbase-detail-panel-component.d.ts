import React from 'react';
import { GridRowId } from '@mui/x-data-grid';
/**
 * Componente para renderizar o painel de detalhes inline (diretamente abaixo da linha na grid)
 */
export declare function ArchbaseDetailPanel<T extends object = any>({ rowData, rowId, renderDetailPanel, onClose, theme, className, style, title, fixed }: {
    rowData: T;
    rowId: GridRowId;
    renderDetailPanel: (props: {
        row: T;
    }) => React.ReactNode;
    onClose: (rowId: GridRowId) => void;
    theme: any;
    className?: string;
    style?: React.CSSProperties;
    title?: string;
    fixed?: boolean;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Componente para renderizar o painel de detalhes como modal
 */
export declare function ArchbaseDetailModal<T extends object = any>({ rowId, rowData, renderDetailPanel, onClose, theme, className, style, opened, title }: {
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
    title?: string;
}): import("react/jsx-runtime").JSX.Element;
/**
 * Componente para renderizar o painel de detalhes como drawer (desliza da direita/esquerda)
 */
export declare function ArchbaseDetailDrawer<T extends object = any>({ rowId, rowData, renderDetailPanel, onClose, theme, className, style, opened, title, position, size }: {
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
    title?: string;
    position?: 'left' | 'right' | 'top' | 'bottom';
    size?: string | number;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=archbase-detail-panel-component.d.ts.map