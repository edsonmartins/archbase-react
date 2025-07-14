import { InputVariant, MantineSize } from '@mantine/core';
import type { CSSProperties } from 'react';
import React from 'react';
import type { ArchbaseDataSource } from '@archbase/data';
export interface ArchbasePasswordEditProps<T, ID> {
    /** Fonte de dados onde será atribuido o valor do edit */
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o valor do edit na fonte de dados */
    dataField?: string;
    /** Indicador se o edit está desabilitado */
    disabled?: boolean;
    /** Indicador se o edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
    readOnly?: boolean;
    /** Indicador se o preenchimento do edit é obrigatório */
    required?: boolean;
    /** Valor inicial */
    value?: string;
    /** Estilo do edit */
    style?: CSSProperties;
    /** Tamanho do edit */
    size?: MantineSize;
    /** Largura do edit */
    width?: string | number | undefined;
    /** Texto sugestão do edit */
    placeholder?: string;
    /** Título do edit */
    label?: string;
    /** Descrição do edit */
    description?: string;
    /** Último erro ocorrido no edit */
    error?: string;
    /** Evento quando o foco sai do edit */
    onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o edit recebe o foco */
    onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o valor do edit é alterado */
    onChangeValue?: (value: any, event: any) => void;
    onKeyDown?: (event: any) => void;
    onKeyUp?: (event: any) => void;
    /** Referência para o componente interno */
    innerRef?: React.RefObject<HTMLInputElement> | undefined;
    variant?: InputVariant;
}
export declare function ArchbasePasswordEdit<T, ID>({ dataSource, dataField, disabled, readOnly, style, placeholder, label, description, error, required, size, width, innerRef, value, onKeyDown, onKeyUp, onFocusExit, onFocusEnter, onChangeValue, variant, }: ArchbasePasswordEditProps<T, ID>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbasePasswordEdit.d.ts.map