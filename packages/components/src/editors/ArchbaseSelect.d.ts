import { ComboboxItem, CSSProperties, MantineSize, MantineStyleProp, MantineTheme, SelectProps, SelectStylesNames } from '@mantine/core';
import React, { ReactNode } from 'react';
import { ArchbaseDataSource } from '@archbase/data';
export interface SelectItem extends ComboboxItem {
    selected?: boolean;
    group?: string;
    [key: string]: any;
}
export interface ArchbaseSelectProps<T, ID, O> {
    /** Permite ou não delecionar um item */
    allowDeselect?: boolean;
    /** Indicador se permite limpar o select */
    clearable?: boolean;
    /** Fonte de dados onde será atribuido o item selecionado */
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o item selecionado na fonte de dados */
    dataField?: string;
    /** Tempo de espero antes de realizar a busca */
    debounceTime?: number;
    /** Indicador se o select está desabilitado */
    disabled?: boolean;
    /** Indicador se o select é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
    readOnly?: boolean;
    /** Estilo do select */
    style?: MantineStyleProp;
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
    filter?(value: string, item: any): boolean;
    /** Tamanho de entrada */
    size?: MantineSize;
    /** Estado aberto do menu suspenso inicial */
    initiallyOpened?: boolean;
    /** Alterar renderizador de item */
    itemComponent?: React.FC<any>;
    /** Largura do select */
    width?: string | number;
    /** Estado do dropdown controlado*/
    dropdownOpened?: boolean;
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
    dropdownPosition?: 'bottom' | 'top' | 'flip';
    /** Evento quando um valor é selecionado */
    onSelectValue?: (value: O, origin: any) => void;
    /** Evento de click */
    onClick?: React.MouseEventHandler<HTMLInputElement>;
    /** Evento quando o foco sai do select */
    onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o select recebe o foco */
    onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Opções de seleção iniciais */
    initialOptions?: O[];
    /** Function que retorna o label de uma opção */
    getOptionLabel: (option: O) => string;
    /** Function que retorna o valor de uma opção */
    getOptionValue: (option: O) => string;
    /** Coleção de ArchbaseSelectItem[] que representam as opções do select */
    children?: ReactNode | ReactNode[];
    /** Indica se o select tem o preenchimento obrigatório */
    required?: boolean;
    /** Referência para o componente interno */
    innerRef?: React.RefObject<HTMLInputElement> | undefined;
    /** Selecione os dados usados ​​para renderizar itens no menu suspenso */
    options?: ReadonlyArray<string | SelectItem> | ArchbaseDataSource<any, any>;
    optionsLabelField?: string;
    customGetDataSourceFieldValue?: () => any;
    customSetDataSourceFieldValue?: (value: any) => void;
    classNames?: Partial<Record<SelectStylesNames, string>> | ((theme: MantineTheme, props: SelectProps, ctx: unknown) => Partial<Record<SelectStylesNames, string>>);
    styles?: Partial<Record<SelectStylesNames, CSSProperties>> | ((theme: MantineTheme, props: SelectProps, ctx: unknown) => Partial<Record<SelectStylesNames, CSSProperties>>);
    /** Converte o valor antes de atribuir ao field do registro atual no datasource
     * Por exemplo: (obj) => obj.id para armazenar apenas o ID de um objeto
     */
    converter?: (value: O) => any;
    /** Function que busca o valor original antes de converter pelo valor de retorno do converter
     * Por exemplo: (id) => fetchObjectById(id) para converter ID de volta ao objeto
     */
    getConvertedOption?: (value: any) => Promise<O>;
}
export declare function ArchbaseSelect<T, ID, O>({ allowDeselect, clearable, dataSource, dataField, disabled, debounceTime, readOnly, placeholder, initialOptions, searchable, label, description, error, icon, iconWidth, required, width, getOptionLabel, getOptionValue, optionsLabelField, onFocusEnter, onFocusExit, onSelectValue, onClick, value, defaultValue, filter, size, initiallyOpened, itemComponent: ItemComponent, dropdownOpened, onDropdownOpen, onDropdownClose, limit, nothingFound, zIndex, style, dropdownPosition, children, innerRef, options, customGetDataSourceFieldValue, customSetDataSourceFieldValue, classNames, styles, converter, getConvertedOption }: ArchbaseSelectProps<T, ID, O>): import("react/jsx-runtime").JSX.Element;
export declare namespace ArchbaseSelect {
    var displayName: string;
}
//# sourceMappingURL=ArchbaseSelect.d.ts.map