import {
	CheckIcon,
	CloseButton,
	Combobox,
	ComboboxDropdown,
	ComboboxTarget,
	FloatingPosition,
	Group,
	Image,
	MantineSize,
	MantineStyleProp,
	OptionsFilter,
	Pill,
	PillsInput,
	ScrollArea,
	Text,
	useCombobox,
} from '@mantine/core';
import { uniqueId } from 'lodash';
import React, {
	CSSProperties,
	FocusEventHandler,
	forwardRef,
	ReactNode,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '../datasource';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '../hooks';

export interface ArchbaseMultiSelectProps<T, ID, O> {
  /** Permite ou não desselecionar um item */
  allowDeselect?: boolean;
  /** Indicador se permite limpar o select */
  clearable?: boolean;
  /** Fonte de dados onde será atribuido o item selecionado */
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Campo onde deverá ser atribuido o item selecionado na fonte de dados */
  dataField?: string;
  /** Indicador se o select está desabilitado */
  disabled?: boolean;
  /** Indicador se o select é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
  readOnly?: boolean;
  /** Texto explicativo do select */
  placeholder?: string;
  /** Título do select */
  label?: string;
  /** Descrição do select */
  description?: string;
  /** Último erro ocorrido no select */
  error?: string;
  /** Permite pesquisar no select */
  searchable?: boolean;
  /** Icon a esquerda do select */
  icon?: ReactNode;
  /** Largura do icone a esquerda do select */
  iconWidth?: MantineSize;
  /** Valor de entrada controlado */
  value?: any[];
  /** Valor padrão de entrada não controlado */
  defaultValue?: any[];
  /** Função com base em quais itens no menu suspenso são filtrados */
  filter?: OptionsFilter;
  /** Estilo do select */
  style?: MantineStyleProp;
  /** Tamanho do campo */
  size?: MantineSize;
  /** Largura do select */
  width?: number | string | undefined;
  /** Estado aberto do menu suspenso inicial */
  initiallyOpened?: boolean;
  /** Alterar renderizador de item */
  itemComponent?: React.FC<any>;
  /** Alterar renderizador de item selecionado */
  selectedItemComponent?: React.FC<any>;
  /** Chamado quando o menu suspenso é aberto */
  onDropdownOpen?(): void;
  /** Chamado quando o menu suspenso é aberto */
  onDropdownClose?(): void;
  /** Limite a quantidade de itens exibidos por vez para seleção pesquisável */
  limit?: number;
  /** Rótulo nada encontrado */
  nothingFound?: React.ReactNode;
  /** Índice z dropdown */
  zIndex?: React.CSSProperties['zIndex'];
  /** Comportamento de posicionamento dropdown */
  dropdownPosition?: FloatingPosition;
  /** Evento quando os valores selecionados são alterados */
  onChangeValues?: (values: O[]) => void;
  /** Evento quando o foco sai do select */
  onFocusExit?: FocusEventHandler<T> | undefined;
  /** Evento quando o select recebe o foco */
  onFocusEnter?: FocusEventHandler<T> | undefined;
  /** Opções de seleção iniciais */
  initialOptions?: O[];
  /** Function que retorna o label de uma opção */
  getOptionLabel: (option: O) => string;
  /** Function que retorna o valor de uma opção */
  getOptionValue: (option: O) => any;
  /** Function que retorna a imagem de uma opção */
  getOptionImage?: (option: O) => any | undefined | null;
  /** Indica se o select tem o preenchimento obrigatório */
  required?: boolean;
  /** Chamado sempre que o valor da pesquisa muda */
  onSearchChange?(query: string): void;
  /** Converte o valor antes de atribuir ao field do registro atual no datasource */
  converter?: (value: O) => any;
  /** Function que busca o valor original antes de converter pelo valor de retorno do converter */
  getConvertedOption?: (value: any) => Promise<O>;
  /** Coleção de opções do select */
  options?: ReadonlyArray<any> | ArchbaseDataSource<any, any>;
  /** Campo do label quando options é um ArchbaseDataSource */
  optionsLabelField?: string;
  /** Coleção de ReactNode que representam as opções do select */
  children?: ReactNode | ReactNode[];
  /** Máxima altura do dropdown */
  maxDropdownHeight?: number;
}

function buildOptions<O>(
  options?: ReadonlyArray<any> | ArchbaseDataSource<any, any>,
  initialOptions?: O[],
  children?: ReactNode | ReactNode[] | undefined,
  getOptionLabel?: (option: O) => string,
  getOptionValue?: (option: O) => any,
  getOptionImage?: (option: O) => any | undefined | null,
  optionsLabelField?: string
): any {
  if (!initialOptions && !children && !options) {
    return [];
  }

  // Se options é um ArchbaseDataSource
  if (
    options &&
    options instanceof ArchbaseDataSource &&
    getOptionLabel &&
    getOptionValue &&
    optionsLabelField
  ) {
    const ds = options as ArchbaseDataSource<any, any>;
    ds.first();
    const result: any[] = [];
    while (!ds.isEOF()) {
      const record = ds.getCurrentRecord();
      result.push({
        label: ds.getFieldValue(optionsLabelField),
        value: getOptionValue(record),
        image: getOptionImage ? getOptionImage(record) : undefined,
        origin: record,
        key: uniqueId('select'),
      });
      ds.next();
    }
    ds.first();
    return result;
  }

  // Se options é um array
  if (options && Array.isArray(options)) {
    return options;
  }

  // Se children foi passado
  if (children) {
    return React.Children.toArray(children).map((item: any) => {
      const { label, value, origin, ...others } = item.props;
      return {
        label: label,
        value: value,
        origin: origin !== undefined ? origin : value,
        key: uniqueId('select'),
        ...others
      };
    });
  }

  // Se initialOptions foi passado
  if (getOptionImage) {
    return initialOptions!.map((item: O) => {
      return {
        label: getOptionLabel!(item),
        value: getOptionValue!(item),
        image: getOptionImage(item),
        origin: item,
        key: uniqueId('select'),
      };
    });
  }

  return initialOptions!.map((item: O) => {
    return {
      label: getOptionLabel!(item),
      value: getOptionValue!(item),
      origin: item,
      key: uniqueId('select'),
    };
  });
}

const areArraysEqual = (arr1: any[], arr2: any[]) => {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
};

export const SelectItem = ({ image, label, description, values, ...others }) => (
  <div {...others}>
    <Group style={{ flexWrap: "nowrap" }}>
      {image && <Image w={50} src={image} />}
      <div>
        <Text size="sm">{label}</Text>
        {description && (
          <Text size="xs" opacity={0.65}>
            {description}
          </Text>
        )}
      </div>
      {values && values.includes(others.value) ? <CheckIcon size={12} /> : null}
    </Group>
  </div>
);

export const SelectedItem = ({ item, value, onRemove, label }) => (
  <Pill
    key={value}
    withRemoveButton
    onRemove={() => onRemove()}
  >
    {label}
  </Pill>
);

export function ArchbaseMultiSelect<T, ID, O>({
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
  icon,
  iconWidth,
  required,
  getOptionLabel,
  getOptionValue,
  getOptionImage,
  onFocusEnter,
  onFocusExit,
  onChangeValues,
  value,
  defaultValue,
  filter,
  size,
  style,
  width,
  initiallyOpened,
  itemComponent: ItemComponent = SelectItem,
  selectedItemComponent: SelectedItemComponent = SelectedItem,
  onDropdownOpen,
  onDropdownClose,
  limit,
  nothingFound,
  zIndex,
  dropdownPosition,
  onSearchChange,
  converter,
  getConvertedOption,
  options,
  optionsLabelField,
  children,
  maxDropdownHeight = 280
}: ArchbaseMultiSelectProps<T, ID, O>) {
  const combobox = useCombobox({
    onDropdownClose: () => {
      combobox.resetSelectedOption();
      if (onDropdownClose) {
        onDropdownClose();
      }
    },
    onDropdownOpen: () => {
      if (onDropdownOpen) {
        onDropdownOpen();
      }
    }
  });

  const [selectedValues, setSelectedValues] = useState<O[]>(defaultValue || []);
  const [updateCounter, setUpdateCounter] = useState(0);
  const [queryValue, setQueryValue] = useState<string>('');
  const [internalError, setInternalError] = useState<string | undefined>(error);

  const currentOptions: any[] = useMemo(() => {
    return buildOptions<O>(
      options,
      initialOptions,
      children,
      getOptionLabel,
      getOptionValue,
      getOptionImage,
      optionsLabelField
    );
  }, [
    updateCounter,
    options,
    initialOptions,
    children,
    getOptionLabel,
    getOptionValue,
    getOptionImage,
    optionsLabelField
  ]);

  const loadDataSourceFieldValue = async () => {
    let initialValue: any = value;

    if (dataSource && dataField) {
      initialValue = dataSource.getFieldValue(dataField);
      if (!initialValue) {
        initialValue = [];
      }
    }
    if (getConvertedOption && converter && initialValue && initialValue.length > 0) {
      // Converte cada item do array
      const convertedPromises = initialValue.map(item => getConvertedOption(item));
      initialValue = await Promise.all(convertedPromises);
    }
    setSelectedValues(initialValue ?? []);
  };

  const fieldChangedListener = useCallback(() => {
    loadDataSourceFieldValue();
  }, []);

  const dataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
    if (dataSource && dataField) {
      if (
        event.type === DataSourceEventNames.dataChanged ||
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

  const dataSourceOptionsEvent = useCallback((event: DataSourceEvent<T>) => {
    if (event.type === DataSourceEventNames.dataChanged) {
      setUpdateCounter((prevCounter) => prevCounter + 1);
    }
  }, []);

  useArchbaseDidMount(() => {
    loadDataSourceFieldValue();
    if (dataSource && dataField) {
      dataSource.addListener(dataSourceEvent);
      dataSource.addFieldChangeListener(dataField, fieldChangedListener);
    }

    if (options && options instanceof ArchbaseDataSource) {
      (options as ArchbaseDataSource<T, ID>).addListener(dataSourceOptionsEvent);
    }
  });

  useArchbaseWillUnmount(() => {
    if (dataSource && dataField) {
      dataSource.removeListener(dataSourceEvent);
      dataSource.removeFieldChangeListener(dataField, fieldChangedListener);
    }

    if (options && options instanceof ArchbaseDataSource) {
      (options as ArchbaseDataSource<T, ID>).removeListener(dataSourceOptionsEvent);
    }
  });

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue();
  }, []);

  useEffect(() => {
    setInternalError(undefined);
  }, [value, selectedValues, queryValue]);

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValues(value);
    }
  }, [value]);

  const handleConverter = (value) => {
    if (converter && value) {
      return converter(value);
    }
    return value;
  };

  const handleValueRemove = (val: O) => {
    setSelectedValues((current) => {
      const updatedValues = current.filter((item) => getOptionValue(item) !== getOptionValue(val));
      const convertedValues = updatedValues.map(updatedValue => handleConverter(updatedValue));

      if (
        dataSource &&
        !dataSource.isBrowsing() &&
        dataField &&
        !areArraysEqual(
          dataSource.getFieldValue(dataField) || [],
          convertedValues
        )
      ) {
        dataSource.setFieldValue(dataField, convertedValues);
      }

      if (onChangeValues) {
        onChangeValues(updatedValues);
      }

      return updatedValues;
    });
  };

  const handleChange = (optionValue) => {
    // Encontra o objeto original da opção
    const option = currentOptions.find(opt => opt.value === optionValue);
    const value = option && option.origin ? option.origin : optionValue;

    setSelectedValues((prevSelected) => {
      const isSelected = prevSelected.some(
        (item) => getOptionValue(item) === getOptionValue(value)
      );

      // Se o valor já está selecionado, o removemos. Caso contrário, adicionamos.
      const updatedValues = isSelected
        ? prevSelected.filter(
          (item) => getOptionValue(item) !== getOptionValue(value)
        )
        : [...prevSelected, value];

      const convertedValues = updatedValues.map(updatedValue => handleConverter(updatedValue));

      if (
        dataSource &&
        !dataSource.isBrowsing() &&
        dataField &&
        !areArraysEqual(
          dataSource.getFieldValue(dataField) || [],
          convertedValues
        )
      ) {
        dataSource.setFieldValue(dataField, convertedValues);
      }

      if (onChangeValues) {
        onChangeValues(updatedValues);
      }

      return updatedValues;
    });
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

  const handleSearchChange = (query: string) => {
    setQueryValue(query);
    if (onSearchChange) {
      onSearchChange(query);
    }
  };

  const isReadOnly = () => {
    let isReadOnly = readOnly;
    if (dataSource && !readOnly) {
      isReadOnly = dataSource.isBrowsing();
    }

    return isReadOnly;
  };

  const selectedValuesLabels = selectedValues.map(selecteValue => getOptionLabel(selecteValue).toLowerCase());

  const filteredOptions = currentOptions.filter((item) => {
    const matchesSearch = !searchable || item.label.toLowerCase().includes(queryValue.toLowerCase().trim());
    const notSelected = !selectedValuesLabels.includes(item.label.toLowerCase());
    return matchesSearch && notSelected;
  });

  const values = selectedValues.map((item) => (
    <SelectedItemComponent
      key={getOptionValue(item)}
      item={item}
      value={getOptionValue(item)}
      onRemove={() => handleValueRemove(item)}
      label={getOptionLabel(item)}
    />
  ));

  const displayedOptions = limit ? filteredOptions.slice(0, limit) : filteredOptions;

  return (
    <Combobox
      store={combobox}
      withinPortal={true}
      position={dropdownPosition}
      zIndex={zIndex}
      onOptionSubmit={(val) => {
        handleChange(val);
        setQueryValue('');
      }}
    >
      <ComboboxTarget>
        <PillsInput
          disabled={disabled}
          leftSection={icon}
          leftSectionWidth={iconWidth}
          label={label}
          w={width}
          description={description}
          error={internalError}
          required={required}
          style={style}
          onClick={() => combobox.openDropdown()}
          rightSection={
            <>
              {selectedValues.length > 0 && clearable && !disabled && !isReadOnly() ? (
                <CloseButton
                  size="sm"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    setQueryValue('');
                    setSelectedValues([]);
                    if (
                      dataSource &&
                      !dataSource.isBrowsing() &&
                      dataField
                    ) {
                      dataSource.setFieldValue(dataField, []);
                    }
                    if (onChangeValues) {
                      onChangeValues([]);
                    }
                  }}
                  aria-label="Clear value"
                />
              ) : (
                <Combobox.Chevron />
              )}
            </>
          }
          rightSectionPointerEvents={selectedValues.length === 0 ? 'none' : 'all'}
        >
          <Pill.Group>
            {values}
            <PillsInput.Field
              readOnly={isReadOnly()}
              value={queryValue}
              onChange={(event) => {
                handleSearchChange(event.currentTarget.value);
                if (filteredOptions.length > 0) {
                  combobox.openDropdown();
                }
                combobox.updateSelectedOptionIndex();
              }}
              onBlur={(event) => {
                handleOnFocusExit(event);
              }}
              onFocus={(event) => handleOnFocusEnter(event)}
              onClick={() => {
                if (filteredOptions.length > 0) {
                  combobox.openDropdown();
                }
              }}
              placeholder={placeholder}
              onKeyDown={(event) => {
                if (event.key === 'Backspace' && queryValue.length === 0) {
                  if (selectedValues.length > 0) {
                    handleValueRemove(selectedValues[selectedValues.length - 1]);
                  }
                }
              }}
            />
          </Pill.Group>
        </PillsInput>
      </ComboboxTarget>
      <ComboboxDropdown>
        <Combobox.Options>
          <ScrollArea.Autosize mah={maxDropdownHeight} type="scroll">
            {displayedOptions.length === 0 ? (
              <Combobox.Empty>{nothingFound || 'Nada encontrado'}</Combobox.Empty>
            ) : (
              displayedOptions.map((option) => (
                <Combobox.Option
                  value={option.value}
                  key={option.key}
                >
                  {ItemComponent ? (
                    <ItemComponent
                      values={selectedValues.map(v => getOptionValue(v))}
                      {...option}
                    />
                  ) : (
                    option.label
                  )}
                </Combobox.Option>
              ))
            )}
          </ScrollArea.Autosize>
        </Combobox.Options>
      </ComboboxDropdown>
    </Combobox>
  );
}

ArchbaseMultiSelect.displayName = 'ArchbaseMultiSelect';
