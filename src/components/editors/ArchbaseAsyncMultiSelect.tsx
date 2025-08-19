import {
	CheckIcon,
	CloseButton,
	Combobox,
	ComboboxDropdown,
	ComboboxTarget,
	FloatingPosition,
	Group,
	Image,
	Loader,
	MantineSize,
	OptionsFilter,
	Pill,
	PillsInput,
	ScrollArea,
	ScrollAreaProps,
	Text,
	useCombobox,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { uniqueId } from 'lodash';
import React, {
	CSSProperties,
	FocusEventHandler,
	forwardRef,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '../datasource';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '../hooks';
import {
	ArchbaseAsyncSelectContext,
	ArchbaseAsyncSelectContextValue,
	ArchbaseAsyncSelectProvider,
} from './ArchbaseAsyncSelect.context';

export type OptionsResult<O> = {
  options: O[];
  page: number;
  totalPages: number;
};

export interface ArchbaseAsyncMultiSelectProps<T, ID, O> {
  /** Permite ou não desselecionar um item */
  allowDeselect?: boolean;
  /** Indicador se permite limpar o select */
  clearable?: boolean;
  /** Fonte de dados onde será atribuido o item selecionado */
  dataSource?: ArchbaseDataSource<T, ID>;
  /** Campo onde deverá ser atribuido o item selecionado na fonte de dados */
  dataField?: string;
  /** Tempo de espero antes de realizar a busca */
  debounceTime?: number;
  /** Minimo caracteres para busca */
  minCharsToSearch?: number;
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
  value?: any;
  /** Valor padrão de entrada não controlado */
  defaultValue?: any;
  /** Função com base em quais itens no menu suspenso são filtrados */
  filter?: OptionsFilter;
  /** Estilo do select */
  style?: CSSProperties;
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
  initialOptions?: OptionsResult<O>;
  /** Function que retorna o label de uma opção */
  getOptionLabel: (option: O) => string;
  /** Function que retorna o valor de uma opção */
  getOptionValue: (option: O) => any;
  /** Function que retorna a imagem de uma opção */
  getOptionImage?: (option: O) => any | undefined | null;
  /** Function responsável por retornar uma promessa contendo opções. Usado para buscar dados remotos. */
  getOptions: (page: number, value: string) => Promise<OptionsResult<O>>;
  /** Evento quando ocorreu um erro carregando dados através da promessa fornecida por getOptions. */
  onErrorLoadOptions?: (error: string) => void;
  /** Indica se o select tem o preenchimento obrigatório */
  required?: boolean;
  /** Chamado sempre que o valor da pesquisa muda */
  onSearchChange?(query: string): void;
  /** Converte o valor antes de atribuir ao field do registro atual no datasource */
  converter?: (value: O) => any;
  /** Function que busca o valor original antes de converter pelo valor de retorno do converter */
  getConvertedOption?: (value: any) => Promise<O>;
}
function buildOptions<O>(
  initialOptions: O[],
  getOptionLabel: (option: O) => string,
  getOptionValue: (option: O) => any,
  getOptionImage?: (option: O) => any | undefined | null,
): any {
  if (!initialOptions) {
    return [];
  }
  if (getOptionImage) {
    return initialOptions.map((item: O) => {
      return {
        label: getOptionLabel(item),
        value: getOptionValue(item),
        image: getOptionImage(item),
        origin: item,
        key: uniqueId('select'),
      };
    });
  }

  return initialOptions.map((item: O) => {
    return {
      label: getOptionLabel(item),
      value: getOptionValue(item),
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
      <Image w={50} src={image} />
      <div>
        <Text size="sm">{label}</Text>
        <Text size="xs" opacity={0.65}>
          {description}
        </Text>
      </div>
      {values.includes(others.value) ? <CheckIcon size={12} /> : null}
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

export function ArchbaseAsyncMultiSelect<T, ID, O>({
  allowDeselect = true,
  clearable = true,
  dataSource,
  dataField,
  disabled = false,
  debounceTime = 500,
  minCharsToSearch = 3,
  readOnly = false,
  placeholder,
  initialOptions = { options: [], page: 0, totalPages: 0 },
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
  getOptions,
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
  onErrorLoadOptions,
  onSearchChange,
  converter,
  getConvertedOption
}: ArchbaseAsyncMultiSelectProps<T, ID, O>) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  const [options, setOptions] = useState<any[]>(
    buildOptions<O>(initialOptions.options, getOptionLabel, getOptionValue, getOptionImage),
  );
  const [selectedValues, setSelectedValues] = useState<O[]>([]);
  const [updateCounter, setUpdateCounter] = useState(0);
  const [queryValue, setQueryValue] = useState<string>('');
  const [debouncedQueryValue] = useDebouncedValue(queryValue, debounceTime);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(initialOptions.page);
  const [totalPages, setTotalPages] = useState(initialOptions.totalPages);
  const [isLastPage, setIsLastPage] = useState(currentPage === totalPages - 1);
  const [originData, setOriginData] = useState(initialOptions.options);
  const [internalError, setInternalError] = useState<string | undefined>(error);

  const loadDataSourceFieldValue = async () => {
    let initialValue: any = value;

    if (dataSource && dataField) {
      initialValue = dataSource.getFieldValue(dataField);
      if (!initialValue) {
        initialValue = [];
      }
    }
    if (getConvertedOption && converter && initialValue) {
      initialValue = await getConvertedOption(initialValue)
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
      if (event.type === DataSourceEventNames.beforeClose) {
        setOptions([]);
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

  useEffect(() => {
    if (onSearchChange) {
      onSearchChange(debouncedQueryValue);
    }
    if (
      debouncedQueryValue &&
      debouncedQueryValue.length >= minCharsToSearch
    ) {
      setLoading(true);
      loadOptions(0, false);
    }
  }, [debouncedQueryValue]);

  useEffect(() => { }, [currentPage, totalPages]);

  useArchbaseDidUpdate(() => {
    loadDataSourceFieldValue();
  }, []);

  useEffect(() => {
    setInternalError(undefined);
  }, [value, selectedValues, debouncedQueryValue]);

  const handleConverter = (value) => {
    if (converter && value) {
      return converter(value)
    }
    return value
  }

  const handleValueRemove = (val: O) => {
    setSelectedValues((current) => {
      const updatedValues = current.filter((item) => getOptionValue(item) !== getOptionValue(val))
      const convertedValues = updatedValues.map(updatedValue => handleConverter(updatedValue))
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

      return updatedValues
    });
  }

  const handleChange = (value) => {
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
      const convertedValues = updatedValues.map(updatedValue => handleConverter(updatedValue))
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

  const handleDropdownScrollEnded = () => {
    if (debouncedQueryValue && debouncedQueryValue.length >= minCharsToSearch && currentPage < totalPages - 1) {
      setLoading(true);
      loadOptions(currentPage + 1, true);
    }
  };

  const handleSearchChange = (query: string) => {
    if (!selectedValues) {
      setQueryValue(query);
    }
    if (query && query.length >= minCharsToSearch) {
      combobox.openDropdown();
    }
  };

  const loadOptions = async (page: number, incremental = false) => {
    const promise = getOptions(page, debouncedQueryValue);
    promise.then(
      (data: OptionsResult<O>) => {
        setLoading(false);
        if (data === undefined || data == null) {
          if (onErrorLoadOptions) {
            onErrorLoadOptions('Response incorreto.');
          }
        }
        const options = incremental ? originData.concat(data.options) : data.options;
        setOriginData(options);
        setOptions(buildOptions<O>(options, getOptionLabel, getOptionValue, getOptionImage));
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
        setIsLastPage(data.page === data.totalPages - 1);
        setUpdateCounter((prevCounter) => prevCounter + 1);
      },
      (err) => {
        setLoading(false);
        if (onErrorLoadOptions) {
          onErrorLoadOptions(err);
        }
      },
    );
  };

  const isReadOnly = () => {
    let isReadOnly = readOnly;
    if (dataSource && !readOnly) {
      isReadOnly = dataSource.isBrowsing();
    }

    return isReadOnly;
  };
  const selectedValuesLabels = selectedValues.map(selecteValue => getOptionLabel(selecteValue).toLowerCase())
  const filteredOptions = options.filter((item) => {
      return item.label.toLowerCase().includes(queryValue.toLowerCase().trim()) && !selectedValuesLabels.includes(item.label.toLowerCase());
  })

  const values = selectedValues.map((item) => (
    <SelectedItemComponent
      item={item}
      value={getOptionValue(item)}
      onRemove={() => handleValueRemove(item)}
      label={getOptionLabel(item)}
    />
  ));

  return (
    <ArchbaseAsyncSelectProvider
      value={{
        handleDropdownScrollEnded,
      }}
    >
      <Combobox
        store={combobox}
        withinPortal={true}
        position={dropdownPosition}
        zIndex={zIndex}
        onOptionSubmit={(val) => {
          handleChange(val);
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
                {loading && <Loader size="xs" />}
                {!loading && selectedValues !== null && clearable && !disabled && !isReadOnly() ? (
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
                        onChangeValues([])
                      }
                    }}
                    aria-label="Clear value"
                  />
                ) : (
                  <Combobox.Chevron />
                )}
              </>
            }
            rightSectionPointerEvents={selectedValues === null ? 'none' : 'all'}
          >
            <Pill.Group>
              {values}
              <PillsInput.Field
                readOnly={isReadOnly()}
                value={queryValue}
                onChange={(event) => {
                  setQueryValue(event.currentTarget.value);
                  if (filteredOptions.length > 0) {
                    combobox.openDropdown();
                  }
                  combobox.updateSelectedOptionIndex();
                  handleSearchChange(event.currentTarget.value);
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
                    handleValueRemove(selectedValues[selectedValues.length - 1]);
                  }
                }}
              />
            </Pill.Group>
          </PillsInput>
        </ComboboxTarget>
        <ComboboxDropdown>
          <Combobox.Options>
            <CustomSelectScrollArea mah={280}>
              {(limit ? filteredOptions.slice(0, limit) : filteredOptions).map((option) => (
                <Combobox.Option
                  value={option.value}
                  key={option.key}
                  onClick={() => {
                    setQueryValue("")
                    combobox.closeDropdown()
                  }}
                >
                  {ItemComponent ? <ItemComponent values={selectedValues} {...option} /> : option.label}
                </Combobox.Option>
              ))}
            </CustomSelectScrollArea>
          </Combobox.Options>
        </ComboboxDropdown>
      </Combobox>
    </ArchbaseAsyncSelectProvider>
  );
}

export const CustomSelectScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ style, ...others }: ScrollAreaProps, _ref) => {
    const sRef = useRef<any>();
    const selectContextValue = useContext<ArchbaseAsyncSelectContextValue>(ArchbaseAsyncSelectContext);
    const handleScrollPositionChange = (_position: { x: number; y: number }): void => {
      if (sRef && sRef.current) {
        if (sRef.current.scrollTop === sRef.current.scrollHeight - sRef.current.offsetHeight) {
          selectContextValue.handleDropdownScrollEnded!();
        }
      }
    };

    return (
      <ScrollArea.Autosize
        {...others}
        style={{ width: '100%', ...style }}
        viewportProps={{ tabIndex: -1 }}
        viewportRef={sRef}
        onScrollPositionChange={handleScrollPositionChange}
      >
        {others.children}
      </ScrollArea.Autosize>
    );
  },
);

CustomSelectScrollArea.displayName = 'CustomSelectScrollArea';