import { MantineColor, MantineSize } from '@mantine/core';
import type { CSSProperties } from 'react';
import React from 'react';
import type { ArchbaseDataSource } from '@archbase/data';
export interface ArchbaseSwitchProps<T, ID> {
    /** Fonte de dados onde será atribuido o valor do switch */
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o valor do switch na fonte de dados */
    dataField?: string;
    /** Indicador se o switch está desabilitado */
    disabled?: boolean;
    /** Indicador se o switch é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
    readOnly?: boolean;
    /** Indicador se o preenchimento do switch é obrigatório */
    required?: boolean;
    /** Estilo do switch */
    style?: CSSProperties;
    /** Valor quando o switch estiver true */
    trueValue?: any;
    /** Valor quando o switch estiver false */
    falseValue?: any;
    /** Rótulo interno quando o switch está no estado desmarcado */
    offLabel?: React.ReactNode;
    /** Rótulo interno quando o switch está no estado checado */
    onLabel?: React.ReactNode;
    /** Mude a cor do estado marcado de theme.colors, padrão para theme.primaryColor*/
    color?: MantineColor;
    /** Valor de tamanho predefinido */
    size?: MantineSize;
    /** Chave de theme.radius ou qualquer valor CSS válido para definir border-radius, "xl" por padrão */
    radius?: string | number | undefined;
    /** Ícone dentro do polegar do interruptor */
    thumbIcon?: React.ReactNode;
    /** Indicador se o switch está marcado */
    isChecked?: boolean;
    /** Título do switch */
    label?: string;
    /** Largura do switch */
    width?: string | number | undefined;
    /** Descrição do switch */
    description?: string;
    /** Último erro ocorrido no switch */
    error?: string;
    /** Evento quando o foco sai do switch */
    onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o switch recebe o foco */
    onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o valor do switch é alterado */
    onChangeValue?: (value: any, event: any) => void;
    /** Referência para o componente interno */
    innerRef?: React.RefObject<HTMLInputElement> | undefined;
}
export declare function ArchbaseSwitch<T, ID>({ dataSource, dataField, disabled, readOnly, required, style, trueValue, falseValue, isChecked, width, label, description, error, offLabel, onLabel, size, radius, thumbIcon, onFocusExit, onFocusEnter, onChangeValue, innerRef, }: ArchbaseSwitchProps<T, ID>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseSwitch.d.ts.map