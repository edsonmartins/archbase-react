import React, { ReactNode } from 'react';
export interface ArchbaseMasonryCustomItemProps<T, _ID> {
    /** Chave */
    key: string;
    /** Id do item */
    id: any;
    /** Indicador se o Item está ativo */
    active: boolean;
    /** Indice dentro da lista */
    index: number;
    /** Registro contendo dados de uma linha na lista */
    recordData: T;
    /** Indicador se item da lista está desabilitado */
    disabled: boolean;
}
export interface ArchbaseMasonryProps {
    children: ReactNode | ReactNode[];
    columnsCount?: number;
    gutter?: string;
    className?: string | null;
    style?: React.CSSProperties;
}
export declare const ArchbaseMasonry: React.FC<ArchbaseMasonryProps>;
interface ArchbaseMasonryResponsiveProps {
    columnsCountBreakPoints?: Record<number, number>;
    children: React.ReactNode | React.ReactNode[];
    className?: string | null;
    style?: React.CSSProperties | null;
}
export declare const ArchbaseMasonryResponsive: React.FC<ArchbaseMasonryResponsiveProps>;
export {};
//# sourceMappingURL=ArchbaseMasonry.d.ts.map