import { MantineSize } from '@mantine/core';
import { DateValue } from '@mantine/dates';
import React from 'react';
import { CSSProperties, ReactNode } from 'react';
export interface ArchbaseDatePickerRangeProps {
    /** Indicador se o date picker range está desabilitado */
    disabled?: boolean;
    /** Indicador se o date picker range é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
    readOnly?: boolean;
    /** Indicador se o preenchimento do date picker range é obrigatório */
    required?: boolean;
    /** Valor inicial */
    value?: string;
    /** Estilo do date picker range */
    style?: CSSProperties;
    /** Tamanho do date picker range */
    size?: MantineSize;
    /** Largura do date picker range */
    width?: string | number | undefined;
    /** Icone à direita */
    icon?: ReactNode;
    /** Texto sugestão do date picker range */
    placeholderStart?: string;
    /** Texto sugestão do date picker range */
    placeholderEnd?: string;
    /** Título do date picker range */
    label?: string;
    /** Descrição do date picker range */
    description?: string;
    /** Último erro ocorrido no date picker range */
    error?: string;
    /** Evento quando o foco sai do date picker range */
    onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o date picker range recebe o foco */
    onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o valor do date picker range é alterado */
    onChangeValue?: (value: any, event: any) => void;
    onKeyDown?: (event: any) => void;
    onKeyUp?: (event: any) => void;
    /** Evento quando o valor do range do date picker range é alterado */
    onSelectDateRange?: (value: DateValue[]) => void;
    /** Referência para o componente interno data inicial*/
    innerRefStart?: React.RefObject<HTMLInputElement> | undefined;
    /** Referência para o componente interno data final*/
    innerRefEnd?: React.RefObject<HTMLInputElement> | undefined;
}
export declare function ArchbaseDatePickerRange({ label, disabled, readOnly, size, width, style, onSelectDateRange, onFocusEnter, onFocusExit, placeholderStart, placeholderEnd, error, }: ArchbaseDatePickerRangeProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseDatePickerRange.d.ts.map