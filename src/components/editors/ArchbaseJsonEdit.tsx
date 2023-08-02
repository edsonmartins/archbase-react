import { JsonInput } from '@mantine/core';
import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useState, useCallback, useRef } from 'react';

import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '../hooks/lifecycle';

import type { DataSourceEvent, ArchbaseDataSource } from '../datasource';
import { DataSourceEventNames } from '../datasource';

export interface ArchbaseJsonEditProps<T,ID> {
  /** Fonte de dados onde será atribuido o valor do json edit  */
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Campo onde deverá ser atribuido o valor do json edit  na fonte de dados */
  dataField?: string;
  /** Indicador se o json edit  está desabilitado */
  disabled?: boolean;
  /** Indicador se o json edit  é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean;
  /** Indicador se o preenchimento do json edit  é obrigatório */
  required?: boolean;
  /** Estilo do checkbox */
  style?: CSSProperties;
  /** Texto sugestão do json edit  */
  placeholder?: string;
  /** Título do json edit  */
  label?: string;
  /** Descrição do json edit  */
  description?: string;
  /** Último erro ocorrido no json edit  */
  error?: string;
  /** Evento quando o foco sai do json edit  */
  onFocusExit?: FocusEventHandler<T> | undefined;
  /** Evento quando o json edit  recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined;
  /** Evento quando o valor do json edit  é alterado */
  onChangeValue?: (value: any, event: any) => void;
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLTextAreaElement>|undefined;
}

export function ArchbaseEdit<T,ID>({
  dataSource,
  dataField,
  disabled = false,
  readOnly = false,
  style,
  placeholder,
  label,
  description,
  error,
  required,
  onFocusExit = () => {},
  onFocusEnter = () => {},
  onChangeValue = () => {},
  innerRef
}: ArchbaseJsonEditProps<T,ID>) {
  const [value, setValue] = useState<string>('');
  const innerComponentRef = innerRef || useRef<any>();

  const loadDataSourceFieldValue = () => {
    let initialValue: any = value;

    if (dataSource && dataField) {
      initialValue = dataSource.getFieldValue(dataField);
      if (!initialValue) {
        initialValue = '';
      }
    }

    setValue(initialValue);
  };

  const fieldChangedListener = useCallback(() => {}, []);

  const dataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
    if (dataSource && dataField) {
      if ((event.type === DataSourceEventNames.dataChanged) ||
          (event.type === DataSourceEventNames.fieldChanged) ||
          (event.type === DataSourceEventNames.recordChanged) ||
          (event.type === DataSourceEventNames.afterScroll) ||
          (event.type === DataSourceEventNames.afterCancel)) {
          loadDataSourceFieldValue();
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

  useArchbaseWillUnmount(() => {
    if (dataSource && dataField) {
      dataSource.removeListener(dataSourceEvent)
      dataSource.removeFieldChangeListener(dataField, fieldChangedListener)
    }
  })

  const handleChange = (event) => {
    event.preventDefault();
    const changedValue = event.target.value;

    event.persist();
    setValue((_prev) => changedValue);

    if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== changedValue) {
      dataSource.setFieldValue(dataField, changedValue);
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

  const isReadOnly = () =>{
    let _readOnly = readOnly;
    if (dataSource && !readOnly) {
      _readOnly = dataSource.isBrowsing();
    }
    return _readOnly;
  }    

  return (
    <JsonInput
      disabled={disabled}
      readOnly={isReadOnly()}
      formatOnBlur={true}
      style={style}
      value={value}
      ref={innerComponentRef}
      required={required}
      onChange={handleChange}
      onBlur={handleOnFocusExit}
      onFocus={handleOnFocusEnter}
      placeholder={placeholder}
      description={description}
      label={label}
      error={error}
    />
  );
}
