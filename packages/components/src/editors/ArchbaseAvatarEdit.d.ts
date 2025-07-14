import { ActionIconVariant } from '@mantine/core';
import { ArchbaseDataSource } from '@archbase/data';
import React, { CSSProperties } from 'react';
export interface ArchbaseAvatarEditProps<T, ID> {
    /** Fonte de dados onde será atribuido o valor do avatar */
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o valor do avatar na fonte de dados */
    dataField?: string;
    /** Indicador se o avatar está desabilitado */
    disabled?: boolean;
    /** Indicador se o avatar é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
    readOnly?: boolean;
    /** Indicador se o preenchimento do avatar é obrigatório */
    required?: boolean;
    /** Estilo do avatar */
    style?: CSSProperties;
    /** Título do avatar */
    label?: string;
    /** Descrição do avatar */
    description?: string;
    /** Último erro ocorrido no avatar */
    error?: string;
    /** Controla a aparência dos botões, sendo padrão "transparent". */
    variant?: ActionIconVariant;
    /** Image src */
    src?: string | null;
    /** Largura do avatar, padrão 200 */
    width?: number;
    /** Altura do avatar, padrão 200 */
    height?: number;
    /** Zoom inicial do avatar, padrão 1 */
    initialZoom?: number;
    /** Chave de theme.radius ou qualquer valor CSS válido para definir border-radius, 0 por padrão */
    radius?: string | number | undefined;
    /** Referência para o componente interno */
    innerRef?: React.RefObject<HTMLInputElement> | undefined;
    /** Callback quando a imagem for alterada */
    onChangeImage?: (image: any) => void;
    /** Desabilita conversão do conteúdo em base64 antes de salvar na fonte de dados */
    disabledBase64Convertion?: boolean;
    /** Cor de fundo de hover do avatar */
    hoverBackgroundColor?: string;
    /** Tamanho máximo da imagem em kilobytes */
    maxSizeKB?: number;
    /** Qualidade da compressão da imagem (0 a 1), sendo 1 melhor qualidade */
    imageQuality?: number;
}
export declare function ArchbaseAvatarEdit<T, ID>({ width, height, dataSource, dataField, disabled, readOnly, required, label, description, error, src, radius, initialZoom, onChangeImage, disabledBase64Convertion, innerRef, variant, hoverBackgroundColor, maxSizeKB, // 0 significa sem limite
imageQuality, ...otherProps }: ArchbaseAvatarEditProps<T, ID>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseAvatarEdit.d.ts.map