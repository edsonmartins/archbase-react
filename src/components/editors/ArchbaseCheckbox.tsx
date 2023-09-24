import { Checkbox, MantineNumberSize, MantineSize } from '@mantine/core';
import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useState, useCallback, useRef, ReactNode, useEffect } from 'react';

import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '../hooks/lifecycle';

import type { DataSourceEvent, ArchbaseDataSource } from '../datasource';
import { DataSourceEventNames } from '../datasource';

export interface ArchbaseCheckboxProps<T, ID> {
  /** Fonte de dados onde será atribuido o valor do checkbox */
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Campo onde deverá ser atribuido o valor do checkbox na fonte de dados */
  dataField?: string;
  /** Indicador se o checkbox está desabilitado */
  disabled?: boolean;
  /** Indicador se o checkbox é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean;
  /** Indicador se o preenchimento do checkbox é obrigatório */
  required?: boolean;
  /** Estilo do checkbox */
  style?: CSSProperties;
  /** Chave de theme.radius ou qualquer valor CSS válido para definir border-radius, theme.defaultRadius por padrão */
  radius?: MantineNumberSize;
  /** Valor quando o checkbox estiver true */
  trueValue?: any;
  /** Valor quando o checkbox estiver false */
  falseValue?: any;
  /** Indicador se o checkbox está marcado */
  isChecked?: boolean;
  /** Título do checkbox */
  label?: ReactNode;
  /** Largura do checkbox */
  width?: MantineNumberSize;
  /** Descrição do checkbox */
  description?: string;
  /** Último erro ocorrido no checkbox */
  error?: string;
  /** Valor de tamanho predefinido */
  size?: MantineSize;
  /** Evento quando o foco sai do checkbox */
  onFocusExit?: FocusEventHandler<T> | undefined;
  /** Evento quando o checkbox recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined;
  /** Evento quando o valor do checkbox é alterado */
  onChangeValue?: (value: any, event: any) => void;
  /** Referência para o componente interno */
  innerRef?: React.RefObject<HTMLInputElement> | undefined;
}

export function ArchbaseCheckbox<T, ID>({
  dataSource,
  dataField,
  disabled = false,
  readOnly = false,
  required = false,
  style,
  trueValue = true,
  falseValue = false,
  isChecked = false,
  width,
  label,
  description,
  error,
  size,
  radius,
  onFocusExit = () => {},
  onFocusEnter = () => {},
  onChangeValue = () => {},
  innerRef,
}: ArchbaseCheckboxProps<T, ID>) {
  const [checked, setChecked] = useState<boolean | undefined>(isChecked);
  const innerComponentRef = useRef<any>();
  const [internalError, setInternalError] = useState<string | undefined>(error);

  useEffect(() => {
    setInternalError(undefined);
  }, [checked]);

  const loadDataSourceFieldValue = () => {
    let currentChecked = checked;
    if (dataSource && dataField) {
      const fieldValue = dataSource.getFieldValue(dataField);
      if (fieldValue !== null && fieldValue !== undefined) {
        currentChecked = fieldValue === trueValue;
      }
    }

    setChecked(currentChecked);
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

  useArchbaseWillUnmount(() => {
    if (dataSource && dataField) {
      dataSource.removeListener(dataSourceEvent);
      dataSource.removeFieldChangeListener(dataField, fieldChangedListener);
    }
  });

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue();
  }, []);

  const handleChange = (event) => {
    const changedChecked = event.target.checked;
    const resultValue = changedChecked ? trueValue : falseValue;

    setChecked(changedChecked);

    if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== resultValue) {
      dataSource.setFieldValue(dataField, resultValue);
    }

    if (onChangeValue) {
      onChangeValue(resultValue, event);
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

  const isReadOnly = () => {
    let tmpRreadOnly = readOnly;
    if (dataSource && !readOnly) {
      tmpRreadOnly = dataSource.isBrowsing();
    }

    return tmpRreadOnly;
  };

  return (
    <Checkbox
      disabled={disabled}
      readOnly={isReadOnly()}
      required={required}
      style={{ ...style, width }}
      checked={checked}
      ref={innerRef || innerComponentRef}
      value={checked ? trueValue : falseValue}
      onChange={handleChange}
      onBlur={handleOnFocusExit}
      onFocus={handleOnFocusEnter}
      description={description}
      label={label}
      labelPosition="right"
      size={size}
      radius={radius}
      error={internalError}
    />
  );
}
