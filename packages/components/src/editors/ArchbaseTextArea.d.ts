import { MantineSize } from '@mantine/core';
import type { CSSProperties } from 'react';
import React from 'react';
import type { ArchbaseDataSource } from '@archbase/data';
export interface ArchbaseTextAreaProps<T, ID> {
    /** Fonte de dados onde será atribuido o valor do textarea */
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o valor do textarea na fonte de dados */
    dataField?: string;
    /** Indicador se o textarea está desabilitado */
    disabled?: boolean;
    /** Indicador se o textarea é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
    readOnly?: boolean;
    /** Indicador se o preenchimento do textarea é obrigatório */
    required?: boolean;
    /** Estilo do textarea */
    style?: CSSProperties;
    /** Tamanho do textarea */
    size?: MantineSize;
    /** Largura do textarea */
    width?: string | number | undefined;
    /** Indicador se textarea crescerá com o conteúdo até que maxRows sejam atingidos  */
    autosize?: boolean;
    /** Número mínimo de linhas obrigatórias */
    minRows?: number;
    /** Número máximo de linhas aceitas */
    maxRows?: number;
    /** Desabilita conversão do conteúdo em base64 antes de salvar na fonte de dados */
    disabledBase64Convertion?: boolean;
    /** Texto sugestão do textarea */
    placeholder?: string;
    /** Título do textarea */
    label?: string;
    /** Descrição do textarea */
    description?: string;
    /** Último erro ocorrido no textarea */
    error?: string;
    /** Evento quando o foco sai do textarea */
    onFocusExit?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    /** Evento quando o textarea recebe o foco */
    onFocusEnter?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    /** Evento quando o valor do textarea é alterado */
    onChangeValue?: (value: any, event: any) => void;
    /** Referência para o componente interno */
    innerRef?: React.RefObject<HTMLTextAreaElement> | undefined;
}
export declare function ArchbaseTextArea<T, ID>({ dataSource, dataField, disabled, readOnly, style, placeholder, label, description, error, onFocusExit, onFocusEnter, onChangeValue, autosize, minRows, maxRows, required, disabledBase64Convertion, innerRef, }: ArchbaseTextAreaProps<T, ID>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseTextArea.d.ts.map