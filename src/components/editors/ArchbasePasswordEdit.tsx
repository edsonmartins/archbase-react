import { PasswordInput } from '@mantine/core';
import { IconLock } from '@tabler/icons-react';
import { ArchbaseDataSource } from '@components/datasource';
import React, { CSSProperties, FocusEventHandler } from 'react';

export interface ArchbasePasswordEditProps<T, ID> {
  /** Fonte de dados onde será atribuido o valor do edit */
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Campo onde deverá ser atribuido o valor do edit na fonte de dados */
  dataField?: string;
  /** Indicador se o edit está desabilitado */
  disabled?: boolean;
  /** Indicador se o edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean;
  /** Indicador se o preenchimento do edit é obrigatório */
  required?: boolean;
  /** Estilo do checkbox */
  style?: CSSProperties;
  /** Texto sugestão do edit */
  placeholder?: string;
  /** Título do edit */
  label?: string;
  /** Descrição do edit */
  description?: string;
  /** Último erro ocorrido no edit */
  error?: string;
  /** Evento quando o foco sai do edit */
  onFocusExit?: FocusEventHandler<T> | undefined;
  /** Evento quando o edit recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined;
  /** Evento quando o valor do edit é alterado */
  onChangeValue?: (value: any, event: any) => void;
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement> | undefined;
}

export function ArchbasePasswordEdit<T, ID>(_props: ArchbasePasswordEditProps<T, ID>) {
  return <PasswordInput label="Sua senha" placeholder="Sua senha" icon={<IconLock size="1rem" />} />;
}
