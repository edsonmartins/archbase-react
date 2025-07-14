import React from 'react';
interface GridToolbarProps {
    onRefresh: () => void;
    onExport: () => void;
    onPrint: () => void;
    globalFilterValue: string;
    onGlobalFilterChange: (value: string) => void;
    renderAdditionalActions?: () => React.ReactNode;
    enableGlobalFilter?: boolean;
    allowExportData?: boolean;
    allowPrintData?: boolean;
    toolbarAlignment?: 'left' | 'right' | 'center';
    toolbarLeftContent?: React.ReactNode;
}
/**
 * Componente para a barra de ferramentas do grid
 */
export declare const GridToolbar: React.FC<GridToolbarProps>;
export default GridToolbar;
//# sourceMappingURL=grid-toolbar.d.ts.map