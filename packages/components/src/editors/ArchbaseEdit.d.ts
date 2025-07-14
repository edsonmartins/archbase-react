import { ActionIconVariant, MantineSize } from '@mantine/core';
import type { CSSProperties, FocusEventHandler, ReactNode } from 'react';
import React from 'react';
import type { ArchbaseDataSource } from '@archbase/data';
export interface ArchbaseEditProps<T, ID> {
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
    /** Icone à direita */
    icon?: ReactNode;
    /** Dica para botão localizar */
    tooltipIconSearch?: string;
    /** Evento ocorre quando clica no botão localizar */
    onActionSearchExecute?: () => void;
    /** Texto sugestão do edit */
    placeholder?: string;
    /** Título do edit */
    label?: string;
    /** Descrição do edit */
    description?: string;
    /** Último erro ocorrido no edit */
    error?: string;
    /** Evento quando o foco sai do edit */
    onFocusExit?: FocusEventHandler<T> | undefined;
    /** Evento quando o edit recebe o foco */
    onFocusEnter?: FocusEventHandler<T> | undefined;
    /** Evento quando o valor do edit é alterado */
    onChangeValue?: (value: any, event: any) => void;
    onKeyDown?: (event: any) => void;
    onKeyUp?: (event: any) => void;
    /** Referência para o componente interno */
    innerRef?: React.RefObject<HTMLInputElement> | undefined;
    variant?: ActionIconVariant;
    minLength?: number;
    maxLength?: number;
}
export declare function ArchbaseEdit<T, ID>({ dataSource, dataField, disabled, readOnly, style, placeholder, label, description, error, required, size, width, innerRef, value, icon, onKeyDown, onKeyUp, onActionSearchExecute, tooltipIconSearch, onFocusExit, onFocusEnter, onChangeValue, variant, minLength, maxLength }: ArchbaseEditProps<T, ID>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseEdit.d.ts.map