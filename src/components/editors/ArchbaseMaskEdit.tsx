import {
  InputSharedProps,
  InputStylesNames,
  InputWrapperBaseProps,
  InputWrapperStylesNames,
  useInputProps,
  Input,
  DefaultProps,
  MantineSize,
  MantineNumberSize,
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

export interface ArchbaseMaskEditProps<T,ID>
  extends DefaultProps<ArchbaseMaskEditStylesNames>,
    InputSharedProps,
    InputWrapperBaseProps,
    Omit<React.ComponentPropsWithoutRef<'input'>, 'size'> {
  /** Tipo de campo html */
  type?: React.HTMLInputTypeAttribute;
  /** Propriedades para atribuir ao wrapper do mask edit */
  wrapperProps?: Record<string, any>;
  /** Nome do seletor estático */
  __staticSelector?: string;
  /** Fonte de dados onde será atribuido o valor do mask edit */
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Campo onde deverá ser atribuido o valor do mask edit na fonte de dados */
  dataField?: string;
  /** Indicador se o mask edit está desabilitado */
  disabled?: boolean;
  /** Indicador se o mask edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean;
  /** Estilo do mask edit */
  style?: CSSProperties;
  /** Tamanho do mask edit */
  size?: MantineSize;
  /** Largura do mask edit */
  width?: MantineNumberSize;
  /** Valor inicial do mask edit */
  value?: any;
  /** Texto sugestão do mask edit */
  placeholder?: string;
  /** Caractere a ser mostrado onde não houver valor no campo */
  placeholderChar?: string;
  /** Indicador se apresenta ou não a máscara */
  showMask?: boolean;
  /** Mascara podendo ser o tipo MaskPattern, uma Function ou uma string. Mais detalhes em: https://github.com/uNmAnNeR/imaskjs */
  mask?: MaskPattern | Function | string;
  /** Indicador se deverá ser salvo o valor com a máscara */
  saveWithMask?: boolean;
  /** Evento quando o foco sai do edit */
  onFocusExit?: FocusEventHandler<T> | undefined;
  /** Evento quando o edit recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined;
  /** Evento quando o valor do edit é alterado */
  onChangeValue?: (value: any, event: any) => void;
}

const defaultProps: Partial<ArchbaseMaskEditProps<any,any>> = {
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

export const ArchbaseMaskEdit = forwardRef<HTMLInputElement, ArchbaseMaskEditProps<any,any>>(
  (props: ArchbaseMaskEditProps<any,any>, ref) => {
    const { inputProps, wrapperProps, mask, placeholderChar, placeholder, readOnly, disabled, width, ...others } = useInputProps(
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

    const handleAccept = (changedValue, maskObject) => {
      if (maskObject.value.replaceAll('_', '').length !== mask?.length) {
        return;
      }
      setValue((_prev) => changedValue);

      if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== changedValue) {
        dataSource.setFieldValue(dataField, changedValue);
      }

      if (onChangeValue) {
        onChangeValue(changedValue, maskObject.value);
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
      <Input.Wrapper {...wrapperProps}>
        <Input<any>
          {...inputProps}
          {...others}
          ref={ref}
          component={IMaskInput}
          mask={mask}
          unmask={!saveWithMask}
          lazy={false}
          value={value}
          style={{ 
            width,
            ...props.style,
          }}
          size={props.size}
          placeholderChar={placeholderChar}
          id={id}
          readOnly={isReadOnly()}
          disabled={disabled}
          placeholder={placeholder}
          onAccept={handleAccept}
          onBlur={handleOnFocusExit}
          onFocus={handleOnFocusEnter}
        />
      </Input.Wrapper>
    );
  },
);

ArchbaseMaskEdit.displayName = 'ArchbaseMaskEdit';
