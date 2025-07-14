import { ReactNode } from 'react';
export interface ArchbaseSelectItemProps<T> {
    /** Texto a ser apresentado no select */
    label: ReactNode;
    /** Valor do item */
    value?: T;
    /** Indicador se o item está desabilitado */
    disabled?: boolean;
    /** Parâmetros adicionais */
    [key: string]: any;
}
export declare function ArchbaseSelectItem<T>(_props: ArchbaseSelectItemProps<T>): any;
export declare namespace ArchbaseSelectItem {
    var displayName: string;
}
//# sourceMappingURL=ArchbaseSelectItem.d.ts.map