import { Textarea } from '@mantine/core';

import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useState, useCallback } from 'react';

import { useArchbaseDidMount, useArchbaseDidUpdate } from '../hooks/lifecycle';

import type { DataSourceEvent, ArchbaseDataSource } from '../datasource';
import { DataSourceEventNames } from '../datasource';
import { isBase64 } from '@components/core/utils';

export interface ArchbaseTextAreaProps<T> {
  /** Fonte de dados onde será atribuido o valor do componente */
  dataSource?: ArchbaseDataSource<T, any>;
  /** Campo onde deverá ser atribuído o valor do componente na fonte de dados */
  dataField?: string;
  /** Indicador se o componente está desabilitado */
  disabled?: boolean;
  /** Indicador se o componente é somente leitura. Obs.: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean;
  /** Indicador se o preenchimento do componente é obrigatório */
  required?: boolean;
  /** Estilo do componente*/
  style?: CSSProperties;
  /** Texto de sugestão para preenchimento do componente*/
  placeholder?: string;
  /** Título*/
  label?: string;
  /** Descrição*/
  description?: string;
  /** Último erro ocorrido no componente*/
  error?: string;
  /** Evento quando o foco sai do componente */
  onFocusExit?: FocusEventHandler<T> | undefined;
  /** Evento quando o componente recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined;
  /** Evento quando o valor do componente é alterado */
  onChangeValue?: (value: any, event: any) => void;
  /** Indicador se o componente irá se auto ajustar de tamanho*/
  autosize?: boolean;
  /** Número de linhas inicial*/
  minRows?: number;
  /** Número de linhas máximo que o componente irá se auto ajustar de tamanho*/
  maxRows?: number;
  /** Indicador para determinar se a conversão de base64 estará desabilitada*/
  disabledBase64Convertion?: boolean;
}

export function ArchbaseTextArea<T>({
  dataSource,
  dataField,
  disabled = false,
  readOnly = false,
  style,
  placeholder,
  label,
  description,
  error,
  onFocusExit = () => {},
  onFocusEnter = () => {},
  onChangeValue = () => {},
  autosize = false,
  minRows,
  maxRows,
  required = false,
  disabledBase64Convertion = false,
}: ArchbaseTextAreaProps<T>) {
  const [value, setValue] = useState<string>('');

  const loadDataSourceFieldValue = () => {
    let initialValue: any = value;

    if (dataSource && dataField) {
      initialValue = dataSource.getFieldValue(dataField);
      if (!initialValue) {
        initialValue = '';
      }
    }

    if (isBase64(initialValue) && !disabledBase64Convertion) {
      initialValue = atob(initialValue);
    }

    setValue(initialValue);
  };

  const fieldChangedListener = useCallback(() => {}, []);

  const dataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
    if (dataSource && dataField) {
      switch (event.type) {
        case (DataSourceEventNames.dataChanged,
        DataSourceEventNames.recordChanged,
        DataSourceEventNames.afterScroll,
        DataSourceEventNames.afterCancel): {
          loadDataSourceFieldValue();
          break;
        }
        default:
      }
    }
  }, []);

  useArchbaseDidMount(() => {
    loadDataSourceFieldValue();
    if (dataSource && dataField) {
      dataSource.addListener(dataSourceEvent);
      dataSource.addFieldChangeListener(dataField, fieldChangedListener);
    }
  });

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue();
  }, []);

  const handleChange = (event) => {
    event.preventDefault();
    const changedValue = event.target.value;

    event.persist();
    setValue((_prev) => changedValue);

    if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== changedValue) {
      dataSource.setFieldValue(dataField, disabledBase64Convertion ? changedValue : btoa(changedValue));
    }

    if (onChangeValue) {
      onChangeValue(event, changedValue);
    }
  };

  const handleOnFocusExit = (event) => {
    if (onFocusExit) {
      onFocusExit(event);
    }
  };

  const handleOnFocusEnter = (event) => {
    if (onFocusEnter) {
      onFocusEnter(event);
    }
  };

  return (
    <Textarea
      disabled={disabled}
      readOnly={readOnly}
      style={style}
      value={value}
      onChange={handleChange}
      onBlur={handleOnFocusExit}
      onFocus={handleOnFocusEnter}
      placeholder={placeholder}
      label={label}
      description={description}
      error={error}
      autosize={autosize}
      minRows={minRows}
      maxRows={maxRows}
      required={required}
    />
  );
}
