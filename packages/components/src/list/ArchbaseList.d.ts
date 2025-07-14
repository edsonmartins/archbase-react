import React, { FocusEventHandler } from 'react';
import { ArchbaseDataSource } from '@archbase/data';
export interface ArchbaseListCustomItemProps<T, _ID> {
    /** Chave */
    key: string;
    /** Id do item */
    id: any;
    /** Indicador se o Item está ativo */
    active: boolean;
    /** Indice dentro da lista */
    index: number;
    /** Registro contendo dados de uma linha na lista */
    recordData: T;
    /** Indicador se item da lista está desabilitado */
    disabled: boolean;
}
export interface ComponentDefinition {
    type: React.ElementType;
    props?: any;
}
export interface ArchbaseListProps<T, ID> {
    /** Cor de fundo do item ativo */
    activeBackgroundColor?: string;
    /** Cor do item ativo */
    activeColor?: string;
    /** Alinhamento dos itens na lista */
    align?: 'left' | 'right' | 'center';
    /** Cor de fundo da lista */
    backgroundColor?: string;
    /** Cor do texto da lista */
    color?: string;
    /** Altura da lista */
    height?: number | string;
    /** Largura da lista */
    width?: number | string;
    /** desabilita todos os itens da lista */
    disabled?: boolean;
    /** Indicador se os itens da lista devem ser justificados */
    justify?: 'flex-start' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    /** Evento que ocorre quando um item da lista é selecionado */
    onSelectListItem?: (index: number, data: any) => void;
    /** Mostra uma borda ao redor da lista */
    withBorder?: boolean;
    /** Cor da borda */
    borderColor?: string;
    /** Arredondamento dos cantos da borda */
    borderRadius?: string | number | undefined;
    /** Propriedade do objeto de dados que representa o texto a ser apresentado na lista */
    dataFieldText?: string;
    /** Propriedade do objeto de dados que representa o ID do item na lista para controle */
    dataFieldId?: string;
    /** Indice do item ativo na lista */
    activeIndex?: number | undefined;
    /** Evento gerado quando o mouse está sobre um item */
    onItemEnter?: (event: React.MouseEvent, data: any) => void;
    /** Evento gerado quando o mouse sai de um item */
    onItemLeave?: (event: React.MouseEvent, data: any) => void;
    /** Permite costumizar o style da lista */
    style?: React.CSSProperties;
    /** Id da lista */
    id?: string;
    /** Fonte de dados a ser usado pela lista */
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Filtro a ser aplicado na lista */
    filter?: string;
    /** Function a ser aplicada na lista para filtrar os itens */
    onFilter?: (record: any) => boolean;
    /** Definições do componente customizado a ser renderizado para um Item da lista */
    component?: ComponentDefinition;
    /** Somente componentes <ArchbaseListItem /> */
    children?: React.ReactNode[];
    /** Tipo de lista: ol,ul,div */
    type?: 'ordered' | 'unordered' | 'none';
    /** Incluir preenchimento à esquerda para compensar a lista do conteúdo principal */
    withPadding?: boolean;
    /** Tamanho da fonte do tema ou número para definir o valor */
    size?: string | number | undefined;
    /** Ícone que deve substituir o ponto do item da lista */
    icon?: React.ReactNode;
    /** Imagem ou source de uma imagem para mostrar no item da lista */
    image?: React.ReactNode | string;
    /** Arredondamento da Imagem */
    imageRadius?: string | number | undefined;
    /** Altura da imagem */
    imageHeight?: number | string;
    /** Largura da Imagem */
    imageWidth?: number | string;
    /** Espaçamento entre os valores do item */
    spacing?: string | number | undefined;
    /** Centralizar itens com ícone */
    center?: boolean;
    /** Lista horizontal */
    horizontal?: boolean;
    /** force update list */
    update?: number;
    /** Estilo de lista */
    listStyleType?: React.CSSProperties['listStyleType'];
    onFocusEnter?: FocusEventHandler<HTMLDivElement> | undefined;
    onFocusExit?: FocusEventHandler<HTMLDivElement> | undefined;
}
export declare function ArchbaseList<T, ID>(props: ArchbaseListProps<T, ID>): import("react/jsx-runtime").JSX.Element;
export declare namespace ArchbaseList {
    var displayName: string;
}
//# sourceMappingURL=ArchbaseList.d.ts.map