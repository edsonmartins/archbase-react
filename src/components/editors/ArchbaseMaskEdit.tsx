import {
  InputSharedProps,
  InputStylesNames,
  InputWrapperBaseProps,
  InputWrapperStylesNames,
  useInputProps,
  Input,
  DefaultProps,
  MantineSize,
} from '@mantine/core';
import { useId } from '@mantine/hooks';
import { IMaskInput } from 'react-imask';

import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useState, useCallback, forwardRef } from 'react';

import { useArchbaseDidMount, useArchbaseDidUpdate } from '../hooks/lifecycle';

import type { DataSourceEvent, ArchbaseDataSource } from '../datasource';
import { DataSourceEventNames } from '../datasource';

export enum MaskPattern {
  CNPJ = '00.000.000/0000-00',
  CEP = '00.000-000',
  CPF = '000.000.000-00',
  PLACA = 'aaa-00*00',
  PHONE = '(00) 00000-0000',
}

export type ArchbaseMaskEditStylesNames = InputStylesNames | InputWrapperStylesNames;

export interface ArchbaseMaskEditProps<T>
  extends DefaultProps<ArchbaseMaskEditStylesNames>,
    InputSharedProps,
    InputWrapperBaseProps,
    Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
  type?: React.HTMLInputTypeAttribute;
  wrapperProps?: Record<string, any>;
  size?: MantineSize;
  __staticSelector?: string;
  dataSource?: ArchbaseDataSource<any, any>;
  dataField?: string;
  disabled?: boolean;
  readOnly?: boolean;
  style?: CSSProperties;
  value?: any;
  placeholder?: string;
  placeholderChar?: string;
  showMask?: boolean;
  mask?: MaskPattern | Function | string;
  saveWithMask?: boolean;
  onFocusExit?: FocusEventHandler<T> | undefined;
  onFocusEnter?: FocusEventHandler<T> | undefined;
  onChangeValue?: (value: any, event: any) => void;
}

const defaultProps: Partial<ArchbaseMaskEditProps<any>> = {
  type: 'text',
  size: 'sm',
  __staticSelector: 'ArchbaseMaskEdit',
  value: '',
  readOnly: false,
  disabled: false,
  placeholderChar: '_',
  placeholder: '',
  mask: '',
  showMask: true,
  saveWithMask: false,
};

export const ArchbaseMaskEdit = forwardRef<HTMLInputElement, ArchbaseMaskEditProps<any>>(
  (props: ArchbaseMaskEditProps<any>, ref) => {
    const { inputProps, wrapperProps, mask, placeholderChar, placeholder, ...others } = useInputProps(
      'ArchbaseMaskEdit',
      defaultProps,
      props,
    );
    const id = useId();

    const [value, setValue] = useState<string>('');

    const { dataSource, dataField, onChangeValue, onFocusEnter, onFocusExit, saveWithMask } = props;

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

    const dataSourceEvent = useCallback((event: DataSourceEvent<any>) => {
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
      const changedValue = event.currentTarget.value;
      if (changedValue.replaceAll('_', '').length !== mask?.length) {
        return;
      }
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

    return (
      <Input.Wrapper {...wrapperProps}>
        <Input<any>
          {...inputProps}
          {...others}
          ref={ref}
          component={IMaskInput}
          mask={mask}
          lazy={false}
          value={value}
          placeholderChar={placeholderChar}
          id={id}
          placeholder={placeholder}
          onInput={handleChange}
          onBlur={handleOnFocusExit}
          onFocus={handleOnFocusEnter}
        />
      </Input.Wrapper>
    );
  },
);

ArchbaseMaskEdit.displayName = 'ArchbaseMaskEdit';
