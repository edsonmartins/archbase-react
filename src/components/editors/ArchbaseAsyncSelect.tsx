import { MantineSize, Select } from '@mantine/core';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@components/datasource';
import React, { CSSProperties, FocusEventHandler, useCallback, useEffect, useState } from 'react';
import { uniqueId } from 'lodash';
import { useArchbaseDidMount, useArchbaseDidUpdate } from '@components/hooks';
import { useDebouncedState } from '@mantine/hooks';

export interface ArchbaseAsyncSelectProps<T, ID, O> {
  allowDeselect?: boolean;
  clearable?: boolean;
  dataSource?: ArchbaseDataSource<T, ID>;
  dataField?: string;
  disabled?: boolean;
  readOnly?: boolean;
  style?: CSSProperties;
  placeholder?: string;
  label?: string;
  description?: string;
  error?: string;
  searchable?: boolean;
  size?: MantineSize;
  onSelectValue?: (value: O) => void;
  onFocusExit?: FocusEventHandler<T> | undefined;
  onFocusEnter?: FocusEventHandler<T> | undefined;
  initialOptions?: O[];
  getOptionLabel: (option: O) => string;
  getOptionValue: (option: O) => any;
  getOptions?: (page: number, value: string) => Promise<T>;
}
function buildOptions<O>(
  initialOptions: O[],
  getOptionLabel: (option: O) => string,
  getOptionValue: (option: O) => any,
): any {
  if (!initialOptions) {
    return [];
  }
  return initialOptions.map((item: O) => {
    return { label: getOptionLabel(item), value: getOptionValue(item), origin: item, key: uniqueId('select') };
  });
}

export function ArchbaseAsyncSelect<T, ID, O>({
  allowDeselect = true,
  clearable = true,
  dataSource,
  dataField,
  disabled = false,
  readOnly = false,
  placeholder,
  initialOptions = [],
  searchable = true,
  label,
  description,
  error,
  size,
  getOptionLabel,
  getOptionValue,
  getOptions,
  onFocusEnter,
  onFocusExit,
  onSelectValue
}: ArchbaseAsyncSelectProps<T, ID, O>) {
  const [options, setOptions] = useState<any[]>(buildOptions<O>(initialOptions, getOptionLabel, getOptionValue));
  const [value, setValue] = useState<any>();
  const [queryValue, setQueryValue] = useDebouncedState('',500)

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

  useEffect(()=>{
    console.log(queryValue)
  },[queryValue])

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue();
  }, []);

  const handleChange = (value) => {
    setValue((_prev) => value);

    if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== value) {
      dataSource.setFieldValue(dataField, value);
    }

    if (onSelectValue) {
        onSelectValue(value);
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
    <Select
      allowDeselect={allowDeselect}
      clearable={clearable}
      disabled={disabled}
      description={description}
      placeholder={placeholder}
      searchable={searchable}
      maxDropdownHeight={280}
      label={label}
      error={error}
      data={options}
      size={size!}
      onChange={handleChange}
      onBlur={handleOnFocusExit}
      onFocus={handleOnFocusEnter}
      value={value}
      onSearchChange={setQueryValue}
    />
  );
}
