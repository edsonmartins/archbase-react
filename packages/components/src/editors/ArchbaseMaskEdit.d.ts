import { __InputProps, InputStylesNames, InputVariant, InputWrapperStylesNames, MantineSize, PolymorphicFactory, StylesApiProps } from '@mantine/core';
import type { CSSProperties } from 'react';
import React from 'react';
import type { ArchbaseDataSource } from '@archbase/data';
export declare enum MaskPattern {
    CNPJ = "00.000.000/0000-00",
    CEP = "00.000-000",
    CPF = "000.000.000-00",
    PLACA = "aaa-00*00",
    PHONE = "(00) 00000-0000"
}
export type ArchbaseMaskEditStylesNames = InputStylesNames | InputWrapperStylesNames;
export interface ArchbaseMaskEditProps<T, ID> extends StylesApiProps<ArchbaseMaskEditFactory>, __InputProps, Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
    /** Tipo de campo html */
    type?: React.HTMLInputTypeAttribute;
    /** Propriedades para atribuir ao wrapper do mask edit */
    wrapperProps?: Record<string, any>;
    /** Nome do seletor estático */
    __staticSelector?: string;
    /** Fonte de dados onde será atribuido o valor do mask edit */
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o valor do mask edit na fonte de dados */
    dataField?: string;
    /** Indicador se o mask edit está desabilitado */
    disabled?: boolean;
    /** Indicador se o mask edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
    readOnly?: boolean;
    /** Estilo do mask edit */
    style?: CSSProperties;
    /** Tamanho do mask edit */
    size?: MantineSize;
    /** Largura do mask edit */
    width?: string | number | undefined;
    /** Valor inicial do mask edit */
    value?: any;
    /** Texto sugestão do mask edit */
    placeholder?: string;
    /** Caractere a ser mostrado onde não houver valor no campo */
    placeholderChar?: string;
    /** Indicador se apresenta ou não a máscara */
    showMask?: boolean;
    /** Mascara podendo ser o tipo MaskPattern, uma Function ou uma string. Mais detalhes em: https://github.com/uNmAnNeR/imaskjs */
    mask?: MaskPattern | Function | string;
    /** Indicador se deverá ser salvo o valor com a máscara */
    saveWithMask?: boolean;
    /** Evento quando o foco sai do edit */
    onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o edit recebe o foco */
    onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o valor do edit é alterado */
    onChangeValue?: (value: string, event: any) => void;
    /** Referência para o componente interno */
    innerRef?: React.RefObject<HTMLInputElement> | undefined;
    /** Último erro ocorrido no mask edit */
    error?: string;
    /** Título do edit */
    title?: string;
    /** Título do edit */
    label?: string;
    /** Evento que retorna o valor do erro */
    onChangeError?: (error: string) => void;
    /** Mensagem customizada a ser exibida quando o campo está incompleto */
    customIncompleteErrorMessage?: string;
}
export type ArchbaseMaskEditFactory = PolymorphicFactory<{
    props: ArchbaseMaskEditProps<any, any>;
    defaultRef: HTMLInputElement;
    defaultComponent: 'input';
    stylesNames: ArchbaseMaskEditStylesNames;
    variant: InputVariant;
}>;
export declare function ArchbaseMaskEdit<T, ID>(props: ArchbaseMaskEditProps<any, any>): import("react/jsx-runtime").JSX.Element;
export declare namespace ArchbaseMaskEdit {
    var displayName: string;
}
//# sourceMappingURL=ArchbaseMaskEdit.d.ts.map