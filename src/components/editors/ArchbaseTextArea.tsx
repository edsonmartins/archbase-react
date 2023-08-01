import { Textarea } from '@mantine/core';

import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useState, useCallback } from 'react';

import { useArchbaseDidMount, useArchbaseDidUpdate } from '../hooks/lifecycle';

import type { DataSourceEvent, ArchbaseDataSource } from '../datasource';
import { DataSourceEventNames } from '../datasource';
import { isBase64 } from '@components/core/utils';

export interface ArchbaseTextProps<T> {
  dataSource?: ArchbaseDataSource<T, any>;
  dataField?: string;
  disabled?: boolean;
  readOnly?: boolean;
  style?: CSSProperties;
  placeholder?: string;
  label?: string;
  description?: string;
  error?: string;
  onFocusExit?: FocusEventHandler<T> | undefined;
  onFocusEnter?: FocusEventHandler<T> | undefined;
  onChangeValue?: (value: any, event: any) => void;
  autosize?: boolean;
  minRows?: number;
  maxRows?: number;
  required?: boolean;
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
}: ArchbaseTextProps<T>) {
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
