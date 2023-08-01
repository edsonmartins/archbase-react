import { Radio } from '@mantine/core';
import { ArchbaseDataSource } from 'components/datasource';
import React, { CSSProperties, FocusEventHandler } from 'react';

interface Enum {
    [id: number]: string
}

export interface ArchbaseRadioGroupProps<T, ID> {
  /** Fonte de dados onde será atribuido o valor do RadioGroup*/
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Campo onde deverá ser atribuido o valor do RadioGroup na fonte de dados */
  dataField?: string;
  /** Indicador se o RadioGroup está desabilitado */
  disabled?: boolean;
  /** Indicador se o RadioGroup é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean;
  /** Indicador se o preenchimento do RadioGroup é obrigatório */
  required?: boolean;
  /** Estilo do checkbox */
  style?: CSSProperties;
  /** Texto sugestão do RadioGroup */
  placeholder?: string;
  /** Título do RadioGroup */
  label?: string;
  /** Descrição do RadioGroup */
  description?: string;
  /** Último erro ocorrido no RadioGroup */
  error?: string;
  /** Evento quando o foco sai do RadioGroup */
  onFocusExit?: FocusEventHandler<T> | undefined;
  /** Evento quando o RadioGroup recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined;
  /** Evento quando o valor do RadioGroup é alterado */
  onChangeValue?: (value: any, event: any) => void;
  /** Enumerator que será usado para criar as opções do RadioGroup */
  enumerator?: Enum;
}

export function ArchbaseRadioGroup<T, ID>(_props: ArchbaseRadioGroupProps<T, ID>) {
  return (
    <>
      <Radio checked disabled label="React" value="react" />
      <Radio disabled label="Angular" value="nu" />
      <Radio disabled label="Svelte" value="sv" />
    </>
  );
}
