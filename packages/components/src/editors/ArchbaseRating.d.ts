import { MantineSize } from '@mantine/core';
import React, { CSSProperties } from 'react';
import { ArchbaseDataSource } from '@archbase/data';
export interface ArchbaseRatingProps<T, ID> {
    /** Fonte de dados onde será atribuido o valor do rating*/
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o valor do rating na fonte de dados */
    dataField?: string;
    /** Indicador se o rating está desabilitado */
    disabled?: boolean;
    /** Indicador se o rating é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
    readOnly?: boolean;
    /** Indicador se o preenchimento do rating é obrigatório */
    required?: boolean;
    /** Quantidade de controles a ser renderizado */
    count: number;
    /** Valor inicial */
    value?: number;
    /** O ícone que é exibido quando o símbolo está vazio*/
    emptySymbol?: React.ReactNode | ((value: number) => React.ReactNode);
    /** Este ícone que é exibido quando o símbolo está cheio */
    fullSymbol?: React.ReactNode | ((value: number) => React.ReactNode);
    /** Número de frações em que cada item pode ser dividido, 1 por padrão */
    fractions?: number;
    /** Chamado quando o item é pairado */
    onHover?(value: number): void;
    /** A função deve retornar labelText para os símbolos */
    getSymbolLabel?: (value: number) => string;
    /** Nome da avaliação, deve ser único na página */
    name?: string;
    /** Se verdadeiro, apenas o símbolo selecionado mudará para símbolo completo */
    highlightSelectedOnly?: boolean;
    /** Estilo do rating */
    style?: CSSProperties;
    /** Título do rating */
    label?: string;
    /** Descrição do rating */
    description?: string;
    /** Último erro ocorrido no rating */
    error?: string;
    /** Tamanho do rating */
    size?: MantineSize;
    /** Evento quando o foco sai do rating */
    onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o rating recebe o foco */
    onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** Evento quando o valor do rating é alterado */
    onChangeValue?: (value?: number) => void;
    /** Referência para o componente interno */
    innerRef?: React.RefObject<HTMLInputElement> | undefined;
}
export declare function ArchbaseRating<T, ID>({ dataSource, dataField, readOnly, style, size, innerRef, value, fractions, onFocusExit, onFocusEnter, onChangeValue, error, label, description, }: ArchbaseRatingProps<T, ID>): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=ArchbaseRating.d.ts.map