import { ActionIcon, MantineNumberSize, MantineSize, TextInput } from '@mantine/core';
import type { CSSProperties, FocusEventHandler, ReactNode } from 'react';
import React, { useState, useCallback } from 'react';

import { useArchbaseDidMount, useArchbaseDidUpdate } from '../hooks/lifecycle';

import type { DataSourceEvent, ArchbaseDataSource } from '../datasource';
import { DataSourceEventNames } from '../datasource';
import { IconSearch } from '@tabler/icons-react';


export interface ArchbaseLookupEditProps<T,ID,_O> {
  /** Fonte de dados onde será atribuido o valor do lookup edit */
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Campo onde deverá ser atribuido o valor do lookup edit na fonte de dados */
  dataField?: string;
  /** Campo da fonte de dados que será usado para apresentar o valor no lookup edit */
  lookupField?: string;
  /** Indicador se o lookup edit está desabilitado */
  disabled?: boolean;
  /** Indicador se o lookup edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean;
  /** Indicador se o preenchimento do lookup edit é obrigatório */
  required?: boolean;
  /** Estilo do lookup edit */
  style?: CSSProperties;
  /** Tamanho do campo */
  size?: MantineSize;
  /** Largura do lookup edit */
  width?: MantineNumberSize;
  /** Texto sugestão do lookup edit */
  placeholder?: string;
  /** Título do lookup edit */
  label?: string;
  /** Descrição do lookup edit */
  description?: string;
  /** Último erro ocorrido no lookup edit */
  error?: string;
  /** Icone para apresentar lado direito do lookup edit que representa a busca */
  iconSearch?: ReactNode;
  /** Evento quando o foco sai do lookup edit */
  onFocusExit?: FocusEventHandler<T> | undefined;
  /** Evento quando o lookup edit recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined;
  /** Evento quando o valor do lookup edit é alterado */
  onChangeValue?: (value: any, event: any) => void;
}

export function ArchbaseLookupEdit<T,ID,O>({
  dataSource,
  dataField,
  lookupField,
  iconSearch,
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
  onFocusExit = () => {},
  onFocusEnter = () => {},
  onChangeValue = () => {},
}: ArchbaseLookupEditProps<T,ID,O>) {
  const [value, setValue] = useState<string>('');

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
      switch (event.type) {
        case (DataSourceEventNames.dataChanged,
        DataSourceEventNames.fieldChanged,
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
  
  const icon = iconSearch?iconSearch:<IconSearch size="1rem" />;

  return (
    <TextInput
      disabled={disabled}
      readOnly={isReadOnly()}
      type={'text'}
      value={value}
      required={required}
      onChange={handleChange}
      onBlur={handleOnFocusExit}
      onFocus={handleOnFocusEnter}
      placeholder={placeholder}
      description={description}
      label={label}
      error={error}
      size={size}
      rightSection={<ActionIcon>{icon}</ActionIcon>}
      style={{ 
        width,
        ...style,
      }}
    />
  );
}
