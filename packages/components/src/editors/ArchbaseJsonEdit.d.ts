import { MantineSize } from '@mantine/core';
import type { CSSProperties } from 'react';
import React from 'react';
import type { ArchbaseDataSource } from '@archbase/data';
export interface ArchbaseJsonEditProps<T, ID> {
    /** Fonte de dados onde será atribuido o valor do json input */
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o valor do json input na fonte de dados */
    dataField?: string;
    /** Indicador se o json input está desabilitado */
    disabled?: boolean;
    /** Indicador se o json input é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
    readOnly?: boolean;
    /** Indicador se o preenchimento do json input é obrigatório */
    required?: boolean;
    /** Estilo do json input */
    style?: CSSProperties;
    /** Tamanho do json input */
    size?: MantineSize;
    /** Largura do json input */
    width?: string | number | undefined;
    /** Indicador se json input crescerá com o conteúdo até que maxRows sejam atingidos  */
    autosize?: boolean;
    /** Número mínimo de linhas obrigatórias */
    minRows?: number;
    /** Número máximo de linhas aceitas */
    maxRows?: number;
    /** Tamanho máximo em caracteres aceitos */
    maxLength?: number;
    /** Desabilita conversão do conteúdo em base64 antes de salvar na fonte de dados */
    disabledBase64Convertion?: boolean;
    /** Texto sugestão do json input */
    placeholder?: string;
    /** Título do json input */
    label?: string;
    /** Descrição do json input */
    description?: string;
    /** Último erro ocorrido no json input */
    error?: string;
    /** Evento quando o foco sai do json input */
    onFocusExit?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    /** Evento quando o json input recebe o foco */
    onFocusEnter?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
    /** Evento quando o valor do json input é alterado */
    onChangeValue?: (value: any) => void;
    /** Referência para o componente interno */
    innerRef?: React.RefObject<HTMLTextAreaElement> | undefined;
}
export declare function ArchbaseJsonEdit<T, ID>({ dataSource, dataField, disabled, readOnly, style, placeholder, label, description, error, onFocusExit, onFocusEnter, onChangeValue, autosize, minRows, maxRows, maxLength, required, disabledBase64Convertion, innerRef, }: ArchbaseJsonEditProps<T, ID>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseJsonEdit.d.ts.map