import { Chip, Flex } from '@mantine/core';
import React, { useState, useCallback, ReactNode, CSSProperties } from 'react';
import { uniqueId } from 'lodash';
import { useArchbaseDidMount, useArchbaseDidUpdate } from '../hooks/lifecycle';
import type { DataSourceEvent, ArchbaseDataSource } from '../datasource';
import { DataSourceEventNames } from '../datasource';

export interface ArchbaseChipGroupProps<T, ID, O> {
  /** Fonte de dados onde será atribuido o valor do ChipGroup*/
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Campo onde deverá ser atribuido o valor do ChipGroup na fonte de dados */
  dataField?: string;
  /** Evento quando um valor é selecionado */
  onSelectValue?: (value: any) => void;
  /** Function que retorna o label de uma ChipItem */
  getOptionLabel?: (option: O) => string;
  /** Function que retorna o valor de uma ChipItem */
  getOptionValue?: (option: O) => any;
  /** Function que converte os valores do datasource para uma lista de chips selecionados do tipo padrão string[] ou string */
  convertToValue?: (source: any) => string[] | string;
  /** Function que converte o valor selecionado do tipo padrão string[] ou string para o tipo desejado */
  convertFromValue?: (selected: string[] | string) => any;
  /** Opções de seleção iniciais */
  initialOptions?: O[] | object;
  /** Coleção de ChipItem[] que representam as opções do select */
  children?: ReactNode | ReactNode[];
  /** Valor de entrada controlado */
  value?: any;
  /** Valor padrão de entrada não controlado */
  defaultValue?: any;
  /** Controla a aparência do chip, sendo padrão "filled" para dark theme e "outline" para light theme. ("outline" | "light" | "filled")*/
  variant?: 'outline' | 'light' | 'filled';
  /** Tipo do chip */
  type?: 'checkbox' | 'radio';
  /** Permite que múltiplos valores sejam selecionados */
  multiple?: boolean;
  /** Estilo do chip */
  style?: CSSProperties;
}

interface ChipItemProps {
  label: string;
  value: any;
  key: string;
}

function buildOptions<O>(
  initialOptions: O[] | object,
  children: ReactNode | ReactNode[] | undefined,
  getOptionLabel: (option: O) => string,
  getOptionValue: (option: O) => any,
): any {
  if (!initialOptions && !children) {
    return [];
  }

  if (children) {
    return React.Children.toArray(children).map((item: any) => {
      return { label: item.props.label, value: item.props.value.toString(), key: uniqueId('chip') };
    });
  }
  if (Array.isArray(initialOptions)) {
    return initialOptions.map((item: O) => {
      return { label: getOptionLabel(item), value: getOptionValue(item), key: uniqueId('chip') };
    });
  }

  return Object.keys(initialOptions).map((key) => ({
    label: key,
    value: initialOptions[key].toString(),
    key: uniqueId('chip'),
  }));
}

export function ArchbaseChipGroup<T, ID, O>({
  dataSource,
  dataField,
  onSelectValue = () => {},
  getOptionLabel = (o: any) => o.label,
  getOptionValue = (o: any) => o.value,
  convertToValue = (value) => value.toString(),
  convertFromValue,
  value,
  defaultValue,
  initialOptions = [],
  children,
  variant,
  type,
  multiple = false,
  style,
}: ArchbaseChipGroupProps<T, ID, O>) {
  const [options, _setOptions] = useState<ChipItemProps[]>(
    buildOptions<O>(initialOptions, children, getOptionLabel, getOptionValue),
  );
  const [selectedValue, setSelectedValue] = useState<any>(value);

  const loadDataSourceFieldValue = () => {
    let initialValue: any = value;

    if (dataSource && dataField) {
      initialValue = multiple
        ? dataSource.getFieldValue(dataField).map((it) => convertToValue(it))
        : convertToValue(dataSource.getFieldValue(dataField));

      if (!initialValue) {
        initialValue = multiple ? [] : '';
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

  const handleChange = (currentSelectedValue: string[]) => {
    setSelectedValue((_prev) => currentSelectedValue);

    let savedValue = currentSelectedValue;
    if (convertFromValue) {
      savedValue = convertFromValue(currentSelectedValue);
    }
    if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== savedValue) {
      dataSource.setFieldValue(dataField, savedValue);
    }

    if (onSelectValue) {
      onSelectValue(savedValue);
    }
  };

  return (
    <Chip.Group
      defaultValue={selectedValue ? getOptionValue(selectedValue) : defaultValue}
      value={selectedValue}
      onChange={handleChange}
      multiple={multiple}
    >
      <Flex gap="md" justify="center" align="center" direction="column" wrap="wrap">
        {options.map((item) => (
          <Chip style={style} value={item.value} key={item.key} variant={variant} type={type}>
            {item.label}
          </Chip>
        ))}
      </Flex>
    </Chip.Group>
  );
}
