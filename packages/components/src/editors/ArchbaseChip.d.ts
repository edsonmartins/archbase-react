import { MantineSize } from '@mantine/core';
import type { CSSProperties } from 'react';
import React from 'react';
import type { ArchbaseDataSource } from '@archbase/data';
export interface ArchbaseChipProps<T, ID> {
    /** Fonte de dados onde será atribuido o valor do chip */
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o valor do chip na fonte de dados */
    dataField?: string;
    /** Indicador se o chip está desabilitado */
    disabled?: boolean;
    /** Indicador se o chip é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
    readOnly?: boolean;
    /** Indicador se o preenchimento do chip é obrigatório */
    required?: boolean;
    /** Estilo do chip */
    style?: CSSProperties;
    /** Chave de theme.radius ou qualquer valor CSS válido para definir border-radius, theme.defaultRadius por padrão */
    radius?: string | number | undefined;
    /** Valor quando o chip estiver true */
    trueValue?: any;
    /** Valor quando o chip estiver false */
    falseValue?: any;
    /** Indicador se o chip está marcado */
    isChecked?: boolean;
    /** Título do chip */
    label?: string;
    /** Largura do chip */
    width?: string | number | undefined;
    /** Valor de tamanho predefinido */
    size?: MantineSize;
    /** Evento quando o foco sai do chip */
    onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o chip recebe o foco */
    onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o valor do chip é alterado */
    onChangeValue?: (value: any) => void;
    /** Referência para o componente interno */
    innerRef?: React.RefObject<HTMLInputElement> | undefined;
    /** Último erro ocorrido no chip */
    error?: string;
}
export declare function ArchbaseChip<T, ID>({ dataSource, dataField, disabled, readOnly, required, style, trueValue, falseValue, isChecked, width, label, size, radius, error, onFocusExit, onFocusEnter, onChangeValue, innerRef, }: ArchbaseChipProps<T, ID>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseChip.d.ts.map