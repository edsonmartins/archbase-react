import { __InputProps, CloseButtonProps, InputStylesNames, InputVariant, InputWrapperStylesNames, MantineSize, PolymorphicFactory, PopoverProps, StylesApiProps } from '@mantine/core';
import { CalendarBaseProps, CalendarLevel, CalendarStylesNames, DecadeLevelSettings, MonthLevelSettings, YearLevelSettings } from '@mantine/dates';
type DateValue = Date | null;
import React, { CSSProperties } from 'react';
import { type ArchbaseDataSource } from '@archbase/data';
export declare function assignTime(originalDate: DateValue, resultDate: DateValue): Date;
export type ArchbaseDatePickerEditStylesNames = CalendarStylesNames | InputStylesNames | InputWrapperStylesNames;
export interface ArchbaseDatePickerEditProps<T, ID> extends StylesApiProps<ArchbaseDatePickerEditFactory>, __InputProps, CalendarBaseProps, DecadeLevelSettings, YearLevelSettings, MonthLevelSettings, Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'value' | 'defaultValue' | 'onChange'> {
    /** Analisa a entrada do usuário para convertê-la em um objeto Date */
    dateParser?: (value: string) => DateValue;
    /** Valor do componente controlado */
    value?: DateValue | string;
    /** Valor padrão para componente não controlado */
    defaultValue?: DateValue | string;
    /** Chamado quando o valor muda */
    onChange?(value: DateValue): void;
    /** Evento quando o valor é alterado */
    onChangeValue?: (value: any, event: any) => void;
    /** Adereços adicionados ao componente Popover */
    popoverProps?: Partial<Omit<PopoverProps, 'children'>>;
    /** Determina se o valor de entrada pode ser limpo, adiciona o botão limpar à seção direita, falso por padrão */
    clearable?: boolean;
    /** Adereços adicionados ao botão limpar */
    clearButtonProps?: CloseButtonProps;
    /** Determina se o valor de entrada deve ser revertido para o último valor válido conhecido no desfoque, verdadeiro por padrão */
    fixOnBlur?: boolean;
    /** Determina se o valor pode ser desmarcado quando o usuário clica na data selecionada no calendário ou apaga o conteúdo da entrada, verdadeiro se prop limpável estiver definido, falso por padrão */
    allowDeselect?: boolean;
    /** Determina se o tempo (horas, minutos, segundos e milissegundos) deve ser preservado quando uma nova data é escolhida, verdadeiro por padrão */
    preserveTime?: boolean;
    /** Nível máximo que o usuário pode atingir (década, ano, mês), o padrão é década */
    maxLevel?: CalendarLevel;
    /** Nível inicial exibido ao usuário (década, ano, mês), usado para componente não controlado */
    defaultLevel?: CalendarLevel;
    /** Nível atual exibido ao usuário (década, ano, mês), usado para componente controlado */
    level?: CalendarLevel;
    /** Chamado quando o nível muda */
    onLevelChange?(level: CalendarLevel): void;
    /** Fonte de dados onde será atribuido o valor do datePicker */
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o valor do datePicker na fonte de dados */
    dataField?: string;
    /** Indicador se o date picker está desabilitado */
    disabled?: boolean;
    /** Indicador se o date picker é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
    readOnly?: boolean;
    /** Estilo do date picker */
    style?: CSSProperties;
    /** Tamanho do date picker */
    size?: MantineSize;
    /** Largura do date picker */
    width?: string | number | undefined;
    /** Possíveis formatos para a data */
    dateFormat?: 'DD/MM/YYYY' | 'DD-MM-YYYY' | 'YYYY/MM/DD' | 'YYYY-MM-DD';
    /** Caracter a ser mostrado quando não houver um valor*/
    placeholderChar?: string;
    /** Indicador se o caracter deve ser mostrado quando não houver um valor */
    showPlaceholderFormat?: boolean;
    /** Evento quando o foco sai do date picker */
    onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o date picker recebe o foco */
    onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Indica se o date picker tem o preenchimento obrigatório */
    required?: boolean;
    /** Referência para o componente interno */
    innerRef?: React.RefObject<HTMLInputElement> | undefined;
    /** Último erro ocorrido no datepicker */
    error?: string;
    /** Título do edit */
    title?: string;
    /** Título do edit */
    label?: string;
}
export type ArchbaseDatePickerEditFactory = PolymorphicFactory<{
    props: ArchbaseDatePickerEditProps<any, any>;
    defaultRef: HTMLInputElement;
    defaultComponent: 'input';
    stylesNames: ArchbaseDatePickerEditStylesNames;
    variant: InputVariant;
}>;
export declare function ArchbaseDatePickerEdit<T, ID>(props: ArchbaseDatePickerEditProps<T, ID>): import("react/jsx-runtime").JSX.Element;
export declare namespace ArchbaseDatePickerEdit {
    var displayName: string;
}
export {};
//# sourceMappingURL=ArchbaseDatePickerEdit.d.ts.map