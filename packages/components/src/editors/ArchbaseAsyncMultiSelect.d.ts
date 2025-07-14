import { FloatingPosition, MantineSize, OptionsFilter, ScrollAreaProps } from '@mantine/core';
import React, { CSSProperties, ReactNode } from 'react';
import { ArchbaseDataSource } from '@archbase/data';
export type OptionsResult<O> = {
    options: O[];
    page: number;
    totalPages: number;
};
export interface ArchbaseAsyncMultiSelectProps<T, ID, O> {
    /** Permite ou não desselecionar um item */
    allowDeselect?: boolean;
    /** Indicador se permite limpar o select */
    clearable?: boolean;
    /** Fonte de dados onde será atribuido o item selecionado */
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o item selecionado na fonte de dados */
    dataField?: string;
    /** Tempo de espero antes de realizar a busca */
    debounceTime?: number;
    /** Minimo caracteres para busca */
    minCharsToSearch?: number;
    /** Indicador se o select está desabilitado */
    disabled?: boolean;
    /** Indicador se o select é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
    readOnly?: boolean;
    /** Texto explicativo do select */
    placeholder?: string;
    /** Título do select */
    label?: string;
    /** Descrição do select */
    description?: string;
    /** Último erro ocorrido no select */
    error?: string;
    /** Permite pesquisar no select */
    searchable?: boolean;
    /** Icon a esquerda do select */
    icon?: ReactNode;
    /** Largura do icone a esquerda do select */
    iconWidth?: MantineSize;
    /** Valor de entrada controlado */
    value?: any;
    /** Valor padrão de entrada não controlado */
    defaultValue?: any;
    /** Função com base em quais itens no menu suspenso são filtrados */
    filter?: OptionsFilter;
    /** Estilo do select */
    style?: CSSProperties;
    /** Tamanho do campo */
    size?: MantineSize;
    /** Largura do select */
    width?: number | string | undefined;
    /** Estado aberto do menu suspenso inicial */
    initiallyOpened?: boolean;
    /** Alterar renderizador de item */
    itemComponent?: React.FC<any>;
    /** Alterar renderizador de item selecionado */
    selectedItemComponent?: React.FC<any>;
    /** Chamado quando o menu suspenso é aberto */
    onDropdownOpen?(): void;
    /** Chamado quando o menu suspenso é aberto */
    onDropdownClose?(): void;
    /** Limite a quantidade de itens exibidos por vez para seleção pesquisável */
    limit?: number;
    /** Rótulo nada encontrado */
    nothingFound?: React.ReactNode;
    /** Índice z dropdown */
    zIndex?: React.CSSProperties['zIndex'];
    /** Comportamento de posicionamento dropdown */
    dropdownPosition?: FloatingPosition;
    /** Evento quando os valores selecionados são alterados */
    onChangeValues?: (values: O[]) => void;
    /** Evento quando o foco sai do select */
    onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o select recebe o foco */
    onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Opções de seleção iniciais */
    initialOptions?: OptionsResult<O>;
    /** Function que retorna o label de uma opção */
    getOptionLabel: (option: O) => string;
    /** Function que retorna o valor de uma opção */
    getOptionValue: (option: O) => any;
    /** Function que retorna a imagem de uma opção */
    getOptionImage?: (option: O) => any | undefined | null;
    /** Function responsável por retornar uma promessa contendo opções. Usado para buscar dados remotos. */
    getOptions: (page: number, value: string) => Promise<OptionsResult<O>>;
    /** Evento quando ocorreu um erro carregando dados através da promessa fornecida por getOptions. */
    onErrorLoadOptions?: (error: string) => void;
    /** Indica se o select tem o preenchimento obrigatório */
    required?: boolean;
    /** Chamado sempre que o valor da pesquisa muda */
    onSearchChange?(query: string): void;
    /** Converte o valor antes de atribuir ao field do registro atual no datasource */
    converter?: (value: O) => any;
    /** Function que busca o valor original antes de converter pelo valor de retorno do converter */
    getConvertedOption?: (value: any) => Promise<O>;
}
export declare const SelectItem: ({ image, label, description, values, ...others }: {
    [x: string]: any;
    image: any;
    label: any;
    description: any;
    values: any;
}) => import("react/jsx-runtime").JSX.Element;
export declare const SelectedItem: ({ item, value, onRemove, label }: {
    item: any;
    value: any;
    onRemove: any;
    label: any;
}) => import("react/jsx-runtime").JSX.Element;
export declare function ArchbaseAsyncMultiSelect<T, ID, O>({ allowDeselect, clearable, dataSource, dataField, disabled, debounceTime, minCharsToSearch, readOnly, placeholder, initialOptions, searchable, label, description, error, icon, iconWidth, required, getOptionLabel, getOptionValue, getOptionImage, getOptions, onFocusEnter, onFocusExit, onChangeValues, value, defaultValue, filter, size, style, width, initiallyOpened, itemComponent: ItemComponent, selectedItemComponent: SelectedItemComponent, onDropdownOpen, onDropdownClose, limit, nothingFound, zIndex, dropdownPosition, onErrorLoadOptions, onSearchChange, converter, getConvertedOption }: ArchbaseAsyncMultiSelectProps<T, ID, O>): import("react/jsx-runtime").JSX.Element;
export declare const CustomSelectScrollArea: React.ForwardRefExoticComponent<ScrollAreaProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=ArchbaseAsyncMultiSelect.d.ts.map