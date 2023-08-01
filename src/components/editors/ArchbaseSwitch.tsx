import { Switch } from "@mantine/core";
import { ArchbaseDataSource } from "components/datasource";
import React, { CSSProperties, FocusEventHandler } from "react";

export interface ArchbaseSwitchProps<T, ID> {
    /** Fonte de dados onde será atribuido o valor do switch */
    dataSource?: ArchbaseDataSource<T, ID>;
    /** Campo onde deverá ser atribuido o valor do switch na fonte de dados */
    dataField?: string;
    /** Indicador se o switch está desabilitado */
    disabled?: boolean;
    /** Indicador se o switch é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
    readOnly?: boolean;
    /** Indicador se o preenchimento do switch é obrigatório */
    required?: boolean;
    /** Estilo do switch */
    style?: CSSProperties;
    /** Valor quando o switch estiver true */
    trueValue: any;
    /** Valor quando o switch estiver false */
    falseValue: any;
    /** Indicador se o switch está marcado */
    isChecked?: boolean;
    /** Título do switch */
    label?: string;
    /** Descrição do switch */
    description?: string;
    /** Último erro ocorrido no switch */
    error?: string;
    /** Evento quando o foco sai do switch */
    onFocusExit?: FocusEventHandler<T> | undefined;
    /** Evento quando o switch recebe o foco */
    onFocusEnter?: FocusEventHandler<T> | undefined;
    /** Evento quando o valor do switch é alterado */
    onChangeValue?: (value: any, event: any) => void;
  }
export function ArchbaseSwitch<T,ID>(_props: ArchbaseSwitchProps<T,ID>) {
    return <Switch
    label="I agree to sell my privacy"
  />
}