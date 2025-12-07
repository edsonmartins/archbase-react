import {
	CloseButton,
	Combobox,
	ComboboxDropdown,
	ComboboxTarget,
	FloatingPosition,
	Input,
	InputBase,
	Loader,
	MantineSize,
	OptionsFilter,
	ScrollArea,
	ScrollAreaProps,
	useCombobox,
} from '@mantine/core';
import { useDebouncedState, useDebouncedValue } from '@mantine/hooks';
import { uniqueId } from 'lodash';
import React, {
	CSSProperties,
	FocusEventHandler,
	forwardRef,
	ReactElement,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '@archbase/data';
import { useArchbaseDidUpdate } from '@archbase/data';
import { useArchbaseV1V2Compatibility } from '@archbase/data';
import { useValidationErrors } from '@archbase/core';
import { useForceUpdate } from '@mantine/hooks';
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

export interface ArchbaseAsyncSelectProps<T, ID, O> {
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
	/** Evento quando um valor é selecionado */
	onSelectValue?: (value: O) => void;
	/** Evento quando o foco sai do select */
	onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o select recebe o foco */
	onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
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
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
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

export function ArchbaseAsyncSelect<T, ID, O>({
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
	onSelectValue,
	value,
	defaultValue,
	filter,
	size,
	style,
	width,
	initiallyOpened,
	itemComponent: ItemComponent,
	onDropdownOpen,
	onDropdownClose,
	limit,
	nothingFound,
	zIndex,
	dropdownPosition,
	onErrorLoadOptions,
	innerRef,
	onSearchChange,
	converter,
	getConvertedOption
  }: ArchbaseAsyncSelectProps<T, ID, O>) {
	const forceUpdate = useForceUpdate();

	// 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade
	const v1v2Compatibility = useArchbaseV1V2Compatibility<any>(
		'ArchbaseAsyncSelect',
		dataSource,
		dataField,
		null
	);

	// 🔄 MIGRAÇÃO V1/V2: Debug info para desenvolvimento
	if (process.env.NODE_ENV === 'development' && dataSource) {
	}

	// Contexto de validação (opcional - pode não existir)
	const validationContext = useValidationErrors();

	// Chave única para o field
	const fieldKey = `${dataField}`;

	// Recuperar erro do contexto se existir
	const contextError = validationContext?.getError(fieldKey);

	const combobox = useCombobox({
	  onDropdownClose: () => combobox.resetSelectedOption(),
	});
	const [options, setOptions] = useState<any[]>(
	  buildOptions<O>(initialOptions.options, getOptionLabel, getOptionValue, getOptionImage),
	);
	const [selectedValue, setSelectedValue] = useState<any>();
	const [updateCounter, setUpdateCounter] = useState(0);
	const [queryValue, setQueryValue] = useState<string>('');
	const [debouncedQueryValue] = useDebouncedValue(queryValue, debounceTime);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(initialOptions.page);
	const [totalPages, setTotalPages] = useState(initialOptions.totalPages);
	const [_isLastPage, setIsLastPage] = useState(currentPage === totalPages - 1);
	const [originData, setOriginData] = useState(initialOptions.options);
	const innerComponentRef = innerRef || useRef<any>(null);
	const [internalError, setInternalError] = useState<string | undefined>(error);
  
	const loadDataSourceFieldValue = async () => {
	  let initialValue: any = value;
  
	  if (dataSource && dataField) {
		initialValue = dataSource.getFieldValue(dataField);
		if (!initialValue) {
		  initialValue = null;
		}
	  }
	  if (getConvertedOption && converter && initialValue) {
		initialValue = await getConvertedOption(initialValue)
	  }
	  setSelectedValue(initialValue);
	  setQueryValue(getOptionLabel(initialValue) || '');
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
		  // 🔄 MIGRAÇÃO V1/V2: forceUpdate apenas para V1
		  if (!v1v2Compatibility.isDataSourceV2) {
			forceUpdate();
		  }
		}
		if (event.type === DataSourceEventNames.beforeClose) {
		  setOptions([]);
		}
  
		if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
		  setInternalError(event.error);
		  // Salvar no contexto (se disponível)
		  validationContext?.setError(fieldKey, event.error);
		}
	  }
	}, [v1v2Compatibility.isDataSourceV2, validationContext, fieldKey]);
  
	// Ref para manter callback sempre atualizado (corrige problema de closure desatualizada)
	const dataSourceEventRef = useRef(dataSourceEvent);
	useEffect(() => {
		dataSourceEventRef.current = dataSourceEvent;
	}, [dataSourceEvent]);

	// Wrapper estável que delega para ref
	const stableDataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
		dataSourceEventRef.current(event);
	}, []);

	// Registrar listeners com cleanup apropriado
	useEffect(() => {
	  loadDataSourceFieldValue();
	  if (dataSource && dataField) {
		const hasFieldListener = typeof (dataSource as any).addFieldChangeListener === 'function';
		dataSource.addListener(stableDataSourceEvent);
		if (hasFieldListener) {
			(dataSource as any).addFieldChangeListener(dataField, fieldChangedListener);
		}

		return () => {
		  dataSource.removeListener(stableDataSourceEvent);
		  if (hasFieldListener) {
			(dataSource as any).removeFieldChangeListener(dataField, fieldChangedListener);
		  }
		};
	  }
	}, [dataSource, dataField, stableDataSourceEvent, fieldChangedListener]);
  
	useEffect(() => {
	  if (onSearchChange) {
		onSearchChange(debouncedQueryValue);
	  }
	  if (
		debouncedQueryValue &&
		debouncedQueryValue.length >= minCharsToSearch &&
		debouncedQueryValue !== getOptionLabel(selectedValue)
	  ) {
		setLoading(true);
		loadOptions(0, false);
	  }
	}, [debouncedQueryValue]);
  
	useEffect(() => { }, [currentPage, totalPages]);
  
	useArchbaseDidUpdate(() => {
	  loadDataSourceFieldValue();
	}, []);
  
	// ❌ REMOVIDO: Não limpar erro automaticamente quando valor muda
	// O erro deve ser limpo apenas quando o usuário EDITA o campo (no handleChange)
	// useEffect(() => {
	// 	setInternalError(undefined);
	// }, [value, selectedValue, debouncedQueryValue]);

	// ✅ CORRIGIDO: Apenas atualizar se o prop error vier definido
	// Não limpar o internalError se o prop error for undefined
	useEffect(() => {
		if (error !== undefined && error !== internalError) {
			setInternalError(error);
		}
	}, [error]);
  
	const handleConverter = (value) => {
	  if (converter && value) {
		return converter(value)
	  }
	  return value
	}
  
	const handleChange = (value) => {
	  // ✅ Limpa erro quando usuário edita o campo (tanto do estado local quanto do contexto)
	  const hasError = internalError || contextError;
	  if (hasError) {
		setInternalError(undefined);
		validationContext?.clearError(fieldKey);
	  }

	  setSelectedValue((_prev) => value);

	  // 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
	  if (dataSource && dataField) {
		const convertedValue = handleConverter(value);
		v1v2Compatibility.handleValueChange(convertedValue);
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
  
	const handleDropdownScrollEnded = () => {
	  if (debouncedQueryValue && debouncedQueryValue.length >= minCharsToSearch && currentPage < totalPages - 1) {
		setLoading(true);
		loadOptions(currentPage + 1, true);
	  }
	};
  
	const handleSearchChange = (query: string) => {
	  if (!selectedValue) {
		setQueryValue(query);
	  }
	  if (query && getOptionLabel(selectedValue) !== query && query.length >= minCharsToSearch) {
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
	  // 🔄 MIGRAÇÃO V1/V2: Usar padrão de compatibilidade para isReadOnly
	  return readOnly || v1v2Compatibility.isReadOnly;
	};
  
	const shouldFilterOptions = options.every((item) => item !== queryValue);
	const filteredOptions = shouldFilterOptions
	  ? options.filter((item) => {
		return item.label.toLowerCase().includes(queryValue.toLowerCase().trim());
	  })
	  : options;

	// Erro a ser exibido: local ou do contexto
	const displayError = internalError || contextError;

	return (
	  <ArchbaseAsyncSelectProvider
		value={{
		  handleDropdownScrollEnded: handleDropdownScrollEnded,
		}}
	  >
		<Combobox
		  store={combobox}
		  withinPortal={true}
		  position={dropdownPosition}
		  zIndex={zIndex}
		  onOptionSubmit={(val) => {
			handleChange(val);
			handleSearchChange(getOptionLabel(val as O));
			combobox.closeDropdown();
		  }}
		>
		  <ComboboxTarget>
			<InputBase
			  disabled={disabled}
			  readOnly={isReadOnly()}
			  style={style}
				w={width}
			  required={required}
			  leftSection={icon}
			  leftSectionWidth={iconWidth}
			  label={label}
			  description={description}
			  error={displayError}
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
				handleSearchChange(getOptionLabel(selectedValue) || '');
			  }}
			  onFocus={(event) => handleOnFocusEnter(event)}
			  rightSection={
				loading ? (
				  <Loader size="xs" />
				) : (selectedValue !== null && clearable && !disabled && !isReadOnly()) ? (
				  <CloseButton
					size="sm"
					onMouseDown={(event) => event.preventDefault()}
					onClick={() => {
					  setQueryValue('');
					  setSelectedValue(null);
						if(onSelectValue) {
							onSelectValue(null)
						}
					}}
					aria-label="Clear value"
				  />
				) : (
				  <Combobox.Chevron />
				)
			  }
			  onClick={() => {
				if (filteredOptions.length > 0) {
				  combobox.openDropdown();
				}
			  }}
			  rightSectionPointerEvents={selectedValue === null ? 'none' : 'all'}
			  placeholder={placeholder}
			/>
		  </ComboboxTarget>
		  <ComboboxDropdown>
			<Combobox.Options>
			  <CustomSelectScrollArea mah={280}>
				{filteredOptions.slice(0, limit ? limit : filteredOptions.length).map((option) => {
					const {key, ...rest} = option
					return (
					<Combobox.Option value={option.value} key={option.key}>
						{ItemComponent ? <ItemComponent {...rest} /> : option.label}
					</Combobox.Option>
					)
				})}
			  </CustomSelectScrollArea>
			</Combobox.Options>
		  </ComboboxDropdown>
		</Combobox>
	  </ArchbaseAsyncSelectProvider>
	);
  }
  
  export const CustomSelectScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(
	({ style, ...others }: ScrollAreaProps, _ref) => {
	  const sRef = useRef<any>(null);
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
