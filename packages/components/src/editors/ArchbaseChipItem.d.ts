import { ChipVariant } from '@mantine/core';
import { CSSProperties } from 'react';
export interface ArchbaseChipItemProps<T> {
    /** Texto a ser apresentado no select */
    label: string;
    /** Cor de fundo do item */
    value?: T;
    /** Controla a aparência do chip, sendo padrão "filled" para dark theme e "outline" para light theme. ("outline" | "light" | "filled")*/
    variant?: ChipVariant;
    /** Tipo do chip */
    type?: 'checkbox' | 'radio';
    /** Estilo do chip */
    style?: CSSProperties;
}
export declare function ArchbaseChipItem<T>(_props: ArchbaseChipItemProps<T>): any;
export declare namespace ArchbaseChipItem {
    var displayName: string;
}
//# sourceMappingURL=ArchbaseChipItem.d.ts.map