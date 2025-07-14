import { MantineSize } from '@mantine/core';
import type { CSSProperties, ReactNode } from 'react';
import React from 'react';
import type { ArchbaseDataSource } from '@archbase/data';
export interface ArchbaseLookupEditProps<T, ID, O> {
    /** Fonte de dados onde será atribuido o valor do lookup edit */
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o valor do lookup edit na fonte de dados */
    dataField?: string;
    /** Campo da fonte de dados que será usado para apresentar o valor no lookup edit */
    lookupField?: string;
    /** Indicador se o lookup edit está desabilitado */
    disabled?: boolean;
    /** Indicador se o lookup edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
    readOnly?: boolean;
    /** Indicador se o preenchimento do lookup edit é obrigatório */
    required?: boolean;
    /** Validar ao sair do campo se localizou o valor */
    validateOnExit?: boolean;
    /** Mensagem caso falhe ao localizar o valor */
    validateMessage?: string;
    /** Estilo do lookup edit */
    style?: CSSProperties;
    /** Tamanho do campo */
    size?: MantineSize;
    /** Largura do lookup edit */
    width?: string | number | undefined;
    /** Texto sugestão do lookup edit */
    placeholder?: string;
    /** Título do lookup edit */
    label?: string;
    /** Descrição do lookup edit */
    description?: string;
    /** Último erro ocorrido no lookup edit */
    error?: string;
    /** Icone para apresentar lado direito do lookup edit que representa a busca */
    iconSearch?: ReactNode;
    /** Dica para botão localizar */
    tooltipIconSearch?: string;
    /** Evento ocorre quando clica no botão localizar */
    onActionSearchExecute?: () => void;
    /** Evento quando o foco sai do lookup edit */
    onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o lookup edit recebe o foco */
    onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o valor do lookup edit é alterado */
    onChangeValue?: (value: any, event: any) => void;
    /** Evento ocorre quando um valor é localizado */
    onLookupResult?: (value: O) => void;
    /** Evento ocorre quando se obtém um erro ao localizar valor */
    onLookupError?: (error: string) => void;
    /** Função responsável por localizar um valor */
    lookupValueDelegator: (value: any) => Promise<O>;
    /** Referência para o componente interno */
    innerRef?: React.RefObject<HTMLInputElement> | undefined;
}
export declare function ArchbaseLookupEdit<T, ID, O>({ dataSource, dataField, lookupField, iconSearch, disabled, readOnly, style, placeholder, label, description, error, required, size, width, lookupValueDelegator, onLookupError, onLookupResult, validateMessage, tooltipIconSearch, validateOnExit, onFocusExit, onFocusEnter, onChangeValue, onActionSearchExecute, innerRef, }: ArchbaseLookupEditProps<T, ID, O>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseLookupEdit.d.ts.map