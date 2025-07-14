import { ChipVariant } from '@mantine/core';
import { CSSProperties, ReactNode } from 'react';
import type { ArchbaseDataSource } from '@archbase/data';
export interface ArchbaseChipGroupProps<T, ID, O> {
    /** Fonte de dados onde será atribuido o valor do ChipGroup*/
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o valor do ChipGroup na fonte de dados */
    dataField?: string;
    /** Evento quando um valor é selecionado */
    onSelectValue?: (value: any) => void;
    /** Function que retorna o label de uma ChipItem */
    getOptionLabel?: (option: O) => string;
    /** Function que retorna o valor de uma ChipItem */
    getOptionValue?: (option: O) => any;
    /** Function que converte os valores do datasource para uma lista de chips selecionados do tipo padrão string[] ou string */
    convertToValue?: (source: any) => string[] | string;
    /** Function que converte o valor selecionado do tipo padrão string[] ou string para o tipo desejado */
    convertFromValue?: (selected: string[] | string) => any;
    /** Opções de seleção iniciais */
    initialOptions?: O[] | object;
    /** Coleção de ChipItem[] que representam as opções do select */
    children?: ReactNode | ReactNode[];
    /** Valor de entrada controlado */
    value?: any;
    /** Valor padrão de entrada não controlado */
    defaultValue?: any;
    /** Controla a aparência do chip, sendo padrão "filled" para dark theme e "outline" para light theme. ("outline" | "light" | "filled")*/
    variant?: ChipVariant;
    /** Tipo do chip */
    type?: 'checkbox' | 'radio';
    /** Permite que múltiplos valores sejam selecionados */
    multiple?: boolean;
    /** Estilo do chip */
    style?: CSSProperties;
    /** Último erro ocorrido no chip */
    error?: string;
    /** Título do edit */
    label?: string;
    /** Descrição do edit */
    description?: string;
}
export declare function ArchbaseChipGroup<T, ID, O>({ dataSource, dataField, onSelectValue, getOptionLabel, getOptionValue, convertToValue, convertFromValue, value, defaultValue, initialOptions, children, variant, type, multiple, error, style, label, description, }: ArchbaseChipGroupProps<T, ID, O>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseChipGroup.d.ts.map