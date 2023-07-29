import { Checkbox } from '@mantine/core';
import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useState, useCallback } from 'react';

import { useArchbaseDidMount, useArchbaseDidUpdate } from '../hooks/lifecycle';

import type { DataSourceEvent, ArchbaseDataSource } from '../datasource';
import { DataSourceEventNames } from '../datasource';

export interface ArchbaseCheckBoxProps<T, ID> {
  dataSource?: ArchbaseDataSource<T, ID>;
  dataField?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  style?: CSSProperties;
  trueValue: any;
  falseValue: any;
  isChecked?: boolean;
  label?: string;
  description?: string;
  error?: string;
  onFocusExit?: FocusEventHandler<T> | undefined;
  onFocusEnter?: FocusEventHandler<T> | undefined;
  onChangeValue?: (value: any, event: any) => void;
}

export function ArchbaseCheckBox<T, ID>({
  dataSource,
  dataField,
  disabled = false,
  readOnly = false,
  required = false,
  style,
  trueValue,
  falseValue,
  isChecked,
  label,
  description,
  error,
  onFocusExit = () => {},
  onFocusEnter = () => {},
  onChangeValue = () => {},
}: ArchbaseCheckBoxProps<T, ID>) {
  const [checked, setChecked] = useState<boolean>(isChecked ? true : false);

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
    const changedChecked = event.target.checked;
    const resultValue = changedChecked ? trueValue : falseValue;

    setChecked(changedChecked);

    if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== resultValue) {
      dataSource.setFieldValue(dataField, resultValue);
    }

    if (onChangeValue) {
      onChangeValue(event, resultValue);
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
    <Checkbox
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      style={style}
      checked={checked}
      value={checked ? trueValue : falseValue}
      onChange={handleChange}
      onBlur={handleOnFocusExit}
      onFocus={handleOnFocusEnter}
      description={description}
      label={label}
      labelPosition="right"
      size="sm"
      radius="sm"
      error={error}
    />
  );
}
