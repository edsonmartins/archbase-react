import { MantineSize } from '@mantine/core';
import type { CSSProperties } from 'react';
import React, { ReactNode } from 'react';
import type { ArchbaseDataSource } from '@archbase/data';
export interface ArchbaseRadioGroupProps<T, ID, O> {
    /** Fonte de dados onde será atribuido o valor do RadioGroup*/
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o valor do RadioGroup na fonte de dados */
    dataField?: string;
    /** Estilo do componente */
    style?: CSSProperties;
    /** Estilo do componente filho */
    childStyle?: CSSProperties;
    /** Tamanho do edit */
    size?: MantineSize;
    /** Título do RadioGroup */
    label?: string;
    /** Descrição do RadioGroup */
    description?: string;
    /** Último erro ocorrido no RadioGroup */
    error?: string;
    /** Evento quando o foco sai do RadioGroup */
    onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o RadioGroup recebe o foco */
    onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando um valor é selecionado */
    onSelectValue?: (value: any) => void;
    /** Function que retorna o label de uma RadioItem */
    getOptionLabel?: (option: O) => string;
    /** Function que retorna o valor de uma RadioItem */
    getOptionValue?: (option: O) => any;
    /** Function que converte o valor selecionado do tipo padrão string para o tipo desejado */
    convertFromString?: (selected: string) => any;
    /** Opções de seleção iniciais */
    initialOptions?: O[] | object;
    /** Coleção de RadioItem[] que representam as opções do select */
    children?: ReactNode | ReactNode[];
    /** Valor de entrada controlado */
    value?: any;
    /** Valor padrão de entrada não controlado */
    defaultValue?: any;
    /** Direção dos itens do RadioGroup */
    direction?: 'horizontal' | 'vertical';
}
export declare function ArchbaseRadioGroup<T, ID, O>({ dataSource, dataField, style, childStyle, size, label, description, error, onFocusExit, onFocusEnter, onSelectValue, getOptionLabel, getOptionValue, convertFromString, value, defaultValue, initialOptions, children, direction, }: ArchbaseRadioGroupProps<T, ID, O>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseRadioGroup.d.ts.map