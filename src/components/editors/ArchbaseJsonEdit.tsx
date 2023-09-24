import { JsonInput, MantineNumberSize, MantineSize } from '@mantine/core';

import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useState, useCallback, useRef, useEffect } from 'react';

import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '../hooks/lifecycle';

import type { DataSourceEvent, ArchbaseDataSource } from '../datasource';
import { DataSourceEventNames } from '../datasource';
import { isBase64 } from '../core/utils';

export interface ArchbaseJsonEditProps<T, ID> {
  /** Fonte de dados onde será atribuido o valor do json input */
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Campo onde deverá ser atribuido o valor do json input na fonte de dados */
  dataField?: string;
  /** Indicador se o json input está desabilitado */
  disabled?: boolean;
  /** Indicador se o json input é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean;
  /** Indicador se o preenchimento do json input é obrigatório */
  required?: boolean;
  /** Estilo do json input */
  style?: CSSProperties;
  /** Tamanho do json input */
  size?: MantineSize;
  /** Largura do json input */
  width?: MantineNumberSize;
  /** Indicador se json input crescerá com o conteúdo até que maxRows sejam atingidos  */
  autosize?: boolean;
  /** Número mínimo de linhas obrigatórias */
  minRows?: number;
  /** Número máximo de linhas aceitas */
  maxRows?: number;
  /** Tamanho máximo em caracteres aceitos */
  maxLength?: number;
  /** Desabilita conversão do conteúdo em base64 antes de salvar na fonte de dados */
  disabledBase64Convertion?: boolean;
  /** Texto sugestão do json input */
  placeholder?: string;
  /** Título do json input */
  label?: string;
  /** Descrição do json input */
  description?: string;
  /** Último erro ocorrido no json input */
  error?: string;
  /** Evento quando o foco sai do json input */
  onFocusExit?: FocusEventHandler<T> | undefined;
  /** Evento quando o json input recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined;
  /** Evento quando o valor do json input é alterado */
  onChangeValue?: (value: any) => void;
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLTextAreaElement> | undefined;
}

export function ArchbaseJsonEdit<T, ID>({
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
  maxLength,
  required = false,
  disabledBase64Convertion = false,
  innerRef,
}: ArchbaseJsonEditProps<T, ID>) {
  const [value, setValue] = useState<string>('');
  const innerComponentRef = innerRef || useRef<any>();
  const [internalError, setInternalError] = useState<string | undefined>(error);

  useEffect(() => {
    setInternalError(undefined);
  }, [value]);

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
      if (
        event.type === DataSourceEventNames.dataChanged ||
        event.type === DataSourceEventNames.fieldChanged ||
        event.type === DataSourceEventNames.recordChanged ||
        event.type === DataSourceEventNames.afterScroll ||
        event.type === DataSourceEventNames.afterCancel
      ) {
        loadDataSourceFieldValue();
      }

      if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
        setInternalError(event.error);
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

  const handleChange = (value) => {
    setValue((_prev) => value);
    if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== value) {
      dataSource.setFieldValue(dataField, disabledBase64Convertion ? value : btoa(value));
    }

    if (onChangeValue) {
      onChangeValue(value);
    }
  };

  useArchbaseWillUnmount(() => {
    if (dataSource && dataField) {
      dataSource.removeListener(dataSourceEvent);
      dataSource.removeFieldChangeListener(dataField, fieldChangedListener);
    }
  });

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

  const isReadOnly = () => {
    let tmpRreadOnly = readOnly;
    if (dataSource && !readOnly) {
      tmpRreadOnly = dataSource.isBrowsing();
    }

    return tmpRreadOnly;
  };

  return (
    <JsonInput
      disabled={disabled}
      readOnly={isReadOnly()}
      formatOnBlur={true}
      style={style}
      value={value}
      autosize={autosize}
      minRows={minRows}
      maxRows={maxRows}
      maxLength={maxLength}
      ref={innerComponentRef}
      required={required}
      onChange={handleChange}
      onBlur={handleOnFocusExit}
      onFocus={handleOnFocusEnter}
      placeholder={placeholder}
      description={description}
      label={label}
      error={internalError}
    />
  );
}
