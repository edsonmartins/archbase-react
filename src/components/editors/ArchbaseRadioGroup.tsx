import { MantineSize, Radio } from '@mantine/core';
import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useState, useCallback, ReactNode } from 'react';
import { uniqueId } from 'lodash';
import { useArchbaseDidMount, useArchbaseDidUpdate } from '../hooks/lifecycle';
import type { DataSourceEvent, ArchbaseDataSource } from '../datasource';
import { DataSourceEventNames } from '../datasource';

export interface RadioGroupEnum {
  [id: number]: string;
  [id: string]: string;
}

export interface ArchbaseRadioGroupProps<T, ID, O> {
  /** Fonte de dados onde será atribuido o valor do RadioGroup*/
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Campo onde deverá ser atribuido o valor do RadioGroup na fonte de dados */
  dataField?: string;
  /** Estilo do componente */
  style?: CSSProperties;
  /** Estilo do componente filho */
  childStyle?: CSSProperties;
  /** Tamanho do edit */
  size?: MantineSize;
  /** Título do RadioGroup */
  label?: string;
  /** Descrição do RadioGroup */
  description?: string;
  /** Último erro ocorrido no RadioGroup */
  error?: string;
  /** Evento quando o foco sai do RadioGroup */
  onFocusExit?: FocusEventHandler<T> | undefined;
  /** Evento quando o RadioGroup recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined;
  /** Evento quando um valor é selecionado */
  onSelectValue?: (value: O) => void;
  /** Function que retorna o label de uma RadioItem */
  getRadioLabel: (option: O) => string;
  /** Function que retorna o valor de uma RadioItem */
  getRadioValue: (option: O) => any;
  /** Opções de seleção iniciais */
  initialOptions?: O[] | RadioGroupEnum;
  /** Coleção de RadioItem[] que representam as opções do select */
  children?: ReactNode | ReactNode[];
  /** Valor de entrada controlado */
  value?: any;
  /** Valor padrão de entrada não controlado */
  defaultValue?: any;
  /** Direção dos itens do RadioGroup */
  direction?: 'horizontal' | 'vertical';
}

interface RadioItemProps {
  label: string;
  value: string;
  key: string;
}

function buildOptions<O>(
  initialOptions: O[] | RadioGroupEnum,
  children: ReactNode | ReactNode[] | undefined,
  getRadioLabel: (option: O) => string,
  getRadioValue: (option: O) => any,
): any {
  if (!initialOptions && !children) {
    return [];
  }

  if (children) {
    return React.Children.toArray(children).map((item: any) => {
      return { label: item.props.label, value: item.props.value, key: uniqueId('radio') };
    });
  }

  if (Array.isArray(initialOptions)) {
    return initialOptions.map((item: O) => {
      return { label: getRadioLabel(item), value: getRadioValue(item), key: uniqueId('radio') };
    });
  }

  return Object.keys(initialOptions).map((key) => ({ label: initialOptions[key], value: key, key: uniqueId('radio') }));
}

export function ArchbaseRadioGroup<T, ID, O>({
  dataSource,
  dataField,
  style,
  childStyle,
  size,
  label,
  description,
  error,
  onFocusExit = () => {},
  onFocusEnter = () => {},
  onSelectValue = () => {},
  getRadioLabel,
  getRadioValue,
  value,
  defaultValue,
  initialOptions = [],
  children,
  direction = 'vertical',
}: ArchbaseRadioGroupProps<T, ID, O>) {
  const [options, _setOptions] = useState<RadioItemProps[]>(
    buildOptions<O>(initialOptions, children, getRadioLabel, getRadioValue),
  );
  const [selectedValue, setSelectedValue] = useState<any>(value);

  const loadDataSourceFieldValue = () => {
    let initialValue: any = value;

    if (dataSource && dataField) {
      initialValue = dataSource.getFieldValue(dataField);
      if (!initialValue) {
        initialValue = '';
      }
    }

    setSelectedValue(initialValue);
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

  const handleChange = (value) => {
    setSelectedValue((_prev) => value);

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
    <Radio.Group
      description={description}
      defaultValue={selectedValue ? getRadioLabel(selectedValue) : defaultValue}
      value={selectedValue}
      label={label}
      style={style}
      size={size}
      error={error}
      onChange={handleChange}
      onBlur={handleOnFocusExit}
      onFocus={handleOnFocusEnter}
      dir={direction === 'horizontal' ? 'row' : undefined}
      display={direction === 'horizontal' ? 'flex' : undefined}
    >
      {options.map((item) => (
        <Radio
          style={childStyle}
          label={item.label}
          value={item.value}
          key={item.key}
          pr={direction === 'horizontal' ? 20 : 0}
        />
      ))}
    </Radio.Group>
  );
}
