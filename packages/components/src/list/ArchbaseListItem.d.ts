import { ReactNode } from 'react';
export interface ArchbaseListItemProps<T, ID> {
    /** Indicador se o item está ativo(selecionado) */
    active: boolean;
    /** Cor de fundo do item */
    activeBackgroundColor?: string;
    /** Cor do item se ele estiver ativo */
    activeColor?: string;
    /** Alinhamento do texto do item */
    align?: 'left' | 'right' | 'center';
    /** Cor de fundo do item não selecionado */
    backgroundColor?: string;
    /** Texto do item */
    caption: string;
    /** Cor da fonte do item */
    color: string;
    /** Filhos do item */
    children?: ReactNode;
    /** Indicador se o item está desabilitado */
    disabled: boolean;
    /** Icone a ser apresentado ao lado esquerdo do item */
    icon?: ReactNode;
    /** Id do item */
    id: any;
    /** Posição do item dentro da lista */
    index: number;
    /** Imagem a ser apresentada ao lado esquerdo do item */
    image?: ReactNode | string;
    /** Arredondamento da Imagem */
    imageRadius?: string | number | undefined;
    /** Altura da imagem */
    imageHeight?: number | string;
    /** Largura da Imagem */
    imageWidth?: number | string;
    /** Indicador se o conteúdo do item deve ser justificado */
    justify?: 'flex-start' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    /** Indicador se o item deve ter uma borda */
    withBorder?: boolean;
    /** Cor da borda */
    borderColor?: string;
    /** Arredondamento dos cantos da borda */
    borderRadius?: string | number | undefined;
    /** Dados do item a ser apresentado */
    recordData?: T;
    /** Indicador se o item está visivel na lista */
    visible?: boolean;
    /** Espaçamento entre os valores do item */
    spacing?: string | number | undefined;
}
export declare function ArchbaseListItem<T, ID>({ active, activeBackgroundColor, activeColor, backgroundColor, caption, color, disabled, icon, id, index, image, imageRadius, imageHeight, imageWidth, justify, children, recordData, spacing, }: ArchbaseListItemProps<T, ID>): import("react/jsx-runtime").JSX.Element;
export declare namespace ArchbaseListItem {
    var defaultProps: {
        align: string;
        justify: boolean;
        showBorder: boolean;
        disabled: boolean;
    };
    var displayName: string;
}
//# sourceMappingURL=ArchbaseListItem.d.ts.map