import { Rating } from '@mantine/core';
import { ArchbaseDataSource } from '@components/datasource';
import React, { CSSProperties, FocusEventHandler } from 'react';

export interface ArchbaseSpotlightProps<T, ID> {
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
  /** Estilo do checkbox */
  style?: CSSProperties;
  /** Texto sugestão do rating */
  placeholder?: string;
  /** Título do rating */
  label?: string;
  /** Descrição do rating */
  description?: string;
  /** Último erro ocorrido no rating */
  error?: string;
  /** Evento quando o foco sai do rating */
  onFocusExit?: FocusEventHandler<T> | undefined;
  /** Evento quando o rating recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined;
  /** Evento quando o valor do rating é alterado */
  onChangeValue?: (value: any, event: any) => void;
}

export function ArchbaseSpotlight<T, ID>(_props: ArchbaseSpotlightProps<T, ID>) {
  return <Rating defaultValue={2} />;
}
