import { ActionIconVariant, ImageProps } from '@mantine/core';
import React, { CSSProperties } from 'react';
import { ArchbaseDataSource } from '@archbase/data';
export interface ArchbaseImageEditProps<T, ID> extends ImageProps {
    /** Fonte de dados onde será atribuido o valor do rich edit*/
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o valor do rich edit na fonte de dados */
    dataField?: string;
    /** Indicador se o rich edit está desabilitado */
    disabled?: boolean;
    /** Indicador se o rich edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
    readOnly?: boolean;
    /** Indicador se o preenchimento do rich edit é obrigatório */
    required?: boolean;
    /** Estilo do checkbox */
    style?: CSSProperties;
    /** Título do rich edit */
    label?: string;
    /** Descrição do rich edit */
    description?: string;
    /** Último erro ocorrido no rich edit */
    error?: string;
    /** Controla a aparência dos botões, sendo padrão "transparent". ("filled" | "light" | "outline" | "transparent" | "white" | "subtle" | "default" | "gradient")*/
    variant?: ActionIconVariant;
    /** Image src */
    src?: string | null;
    /** Texto alternativo da imagem, usado como título para espaço reservado se a imagem não foi carregada */
    alt?: string;
    /** Largura da imagem, padrão de 100%, não pode exceder 100% */
    width?: number | string;
    /** Altura da imagem, o padrão é a altura da imagem original ajustada para determinada largura */
    height?: number | string;
    /** Chave de theme.radius ou qualquer valor CSS válido para definir border-radius, 0 por padrão */
    radius?: string | number | undefined;
    /** Obter ref do elemento de imagem */
    imageRef?: React.ForwardedRef<HTMLImageElement>;
    /** Legenda da imagem, exibida abaixo da imagem */
    caption?: React.ReactNode;
    aspectRatio?: number | null;
    objectFit?: 'cover' | 'contain' | 'fill' | 'revert' | 'scale-down';
    compressInitial?: number | undefined | null;
    onChangeImage?: (image: any) => void;
    /** Desabilita conversão do conteúdo em base64 antes de salvar na fonte de dados */
    disabledBase64Convertion?: boolean;
    /** Referência para o componente interno */
    innerRef?: React.RefObject<HTMLInputElement> | undefined;
    /** Cor de fundo da imagem */
    imageBackgroundColor?: string;
}
export declare function ArchbaseImageEdit<T, ID>({ width, height, dataSource, dataField, disabled, readOnly, required, label, description, error, src, radius, aspectRatio, objectFit, compressInitial, onChangeImage, disabledBase64Convertion, innerRef, variant, imageBackgroundColor, ...otherProps }: ArchbaseImageEditProps<T, ID>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseImageEdit.d.ts.map