import { MantineNumberSize, MantineSize, TextInput } from '@mantine/core';
import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useState, useCallback, useRef } from 'react';

import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '../hooks/lifecycle';

import type { DataSourceEvent, ArchbaseDataSource } from '../datasource';
import { DataSourceEventNames } from '../datasource';

export interface ArchbaseEditProps<T,ID> {
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
  /** Estilo do edit */
  style?: CSSProperties;
  /** Tamanho do edit */
  size?: MantineSize;
  /** Largura do edit */
  width?: MantineNumberSize;
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
  innerRef?: React.RefObject<HTMLInputElement>|undefined;
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
  size,
  width,
  innerRef,
  onFocusExit = () => {},
  onFocusEnter = () => {},
  onChangeValue = () => {},
}: ArchbaseEditProps<T,ID>) {
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

  useArchbaseWillUnmount(() => {
    if (dataSource && dataField) {
      dataSource.removeListener(dataSourceEvent)
      dataSource.removeFieldChangeListener(dataField, fieldChangedListener)
    }
  })

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
    <TextInput
      disabled={disabled}
      readOnly={isReadOnly()}
      type={'text'}
      size={size!}
      style={{ 
        width,
        ...style,
      }}
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
