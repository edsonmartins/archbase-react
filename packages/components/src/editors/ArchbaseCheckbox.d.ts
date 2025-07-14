import { MantineSize } from '@mantine/core';
import type { CSSProperties } from 'react';
import React, { ReactNode } from 'react';
import type { ArchbaseDataSource } from '@archbase/data';
export interface ArchbaseCheckboxProps<T, ID> {
    /** Fonte de dados onde será atribuido o valor do checkbox */
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o valor do checkbox na fonte de dados */
    dataField?: string;
    /** Indicador se o checkbox está desabilitado */
    disabled?: boolean;
    /** Indicador se o checkbox é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
    readOnly?: boolean;
    /** Indicador se o preenchimento do checkbox é obrigatório */
    required?: boolean;
    /** Estilo do checkbox */
    style?: CSSProperties;
    /** Chave de theme.radius ou qualquer valor CSS válido para definir border-radius, theme.defaultRadius por padrão */
    radius?: string | number | undefined;
    /** Valor quando o checkbox estiver true */
    trueValue?: any;
    /** Valor quando o checkbox estiver false */
    falseValue?: any;
    /** Indicador se o checkbox está marcado */
    isChecked?: boolean;
    /** Título do checkbox */
    label?: ReactNode;
    /** Largura do checkbox */
    width?: string | number | undefined;
    /** Descrição do checkbox */
    description?: string;
    /** Último erro ocorrido no checkbox */
    error?: string;
    /** Valor de tamanho predefinido */
    size?: MantineSize;
    /** Evento quando o foco sai do checkbox */
    onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o checkbox recebe o foco */
    onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o valor do checkbox é alterado */
    onChangeValue?: (value: any, event: any) => void;
    /** Referência para o componente interno */
    innerRef?: React.RefObject<HTMLInputElement> | undefined;
}
export declare function ArchbaseCheckbox<T, ID>({ dataSource, dataField, disabled, readOnly, required, style, trueValue, falseValue, isChecked, width, label, description, error, size, radius, onFocusExit, onFocusEnter, onChangeValue, innerRef, }: ArchbaseCheckboxProps<T, ID>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseCheckbox.d.ts.map