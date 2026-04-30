import {
	ActionIcon,
	ActionIconVariant,
	MantineSize,
	TagsInput,
	Tooltip,
	useMantineColorScheme,
	useMantineTheme,
} from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import type { CSSProperties, FocusEventHandler, ReactNode } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ArchbaseDataSource, DataSourceEvent } from '../datasource';
import { DataSourceEventNames } from '../datasource';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '../hooks/lifecycle';
import type { ComboboxStringData, ComboboxLikeRenderOptionInput, ComboboxStringItem } from '@mantine/core';
import type { InputClearButtonProps, ScrollAreaProps } from '@mantine/core';

export interface ArchbaseTagInputEditProps<T, ID> {
	/** Fonte de dados onde será atribuido o valor do edit */
	dataSource?: ArchbaseDataSource<T, ID>;
	/** Campo onde deverá ser atribuido o valor do edit na fonte de dados */
	dataField?: string;
	/** Indicador se o edit está desabilitado */
	disabled?: boolean;
	/** Indicador se o edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
	readOnly?: boolean;
	/** Indicador se o preenchimento do edit é obrigatório */
	required?: boolean;
	/** Valor controlado do componente */
	value?: string[];
	/** Valor padrão para componente não controlado */
	defaultValue?: string[];
	/** Estilo do edit */
	style?: CSSProperties;
	/** Tamanho do edit */
	size?: MantineSize;
	/** Largura do edit */
	width?: string | number | undefined;
	/** Icone à direita */
	icon?: ReactNode;
	/** Dica para botão localizar */
	tooltipIconSearch?: string;
	/** Evento ocorre quando clica no botão localizar */
	onActionSearchExecute?: () => void;
	/** Texto sugestão do edit */
	placeholder?: string;
	/** Título do edit */
	label?: string;
	/** Descrição do edit */
	description?: string;
	/** Último erro ocorrido no edit */
	error?: string;
	/** Evento quando o foco sai do edit */
	onFocusExit?: FocusEventHandler<T> | undefined;
	/** Evento quando o edit recebe o foco */
	onFocusEnter?: FocusEventHandler<T> | undefined;
	/** Evento quando o valor do edit é alterado */
	onChangeValue?: (value: string[]) => void;
	/** Chamado quando uma tag é removida */
	onRemove?: (value: string) => void;
	/** Chamado quando o botão limpar é clicado */
	onClear?: () => void;
	onKeyDown?: (event: any) => void;
	onKeyUp?: (event: any) => void;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
	variant?: ActionIconVariant;
	
	// Props específicas do TagsInput baseadas na interface oficial
	/** Dados exibidos no dropdown. Valores devem ser únicos */
	data?: ComboboxStringData;
	/** Valor de busca controlado */
	searchValue?: string;
	/** Valor de busca padrão */
	defaultSearchValue?: string;
	/** Chamado quando a busca muda */
	onSearchChange?: (value: string) => void;
	/** Número máximo de tags, `Infinity` por padrão */
	maxTags?: number;
	/** Determina se tags duplicadas são permitidas, `false` por padrão */
	allowDuplicates?: boolean;
	/** Chamado quando usuário tenta submeter uma tag duplicada */
	onDuplicate?: (value: string) => void;
	/** Caracteres que devem disparar a divisão de tags, `[',']` por padrão */
	splitChars?: string[];
	/** Determina se o botão limpar deve ser exibido quando o componente tem valor, `false` por padrão */
	clearable?: boolean;
	/** Props passadas para o botão limpar */
	clearButtonProps?: InputClearButtonProps & React.ComponentPropsWithoutRef<'button'>;
	/** Props passadas para o input oculto */
	hiddenInputProps?: Omit<React.ComponentPropsWithoutRef<'input'>, 'value'>;
	/** Divisor usado para separar valores no atributo `value` do input oculto, `','` por padrão */
	hiddenInputValuesDivider?: string;
	/** Função para renderizar o conteúdo da opção */
	renderOption?: (input: ComboboxLikeRenderOptionInput<ComboboxStringItem>) => React.ReactNode;
	/** Props passadas para o componente `ScrollArea` subjacente no dropdown */
	scrollAreaProps?: ScrollAreaProps;
	/** Determina se o valor digitado pelo usuário mas não submetido deve ser aceito quando o input perde o foco, `true` por padrão */
	acceptValueOnBlur?: boolean;
	/** Limite de itens exibidos no dropdown */
	limit?: number;
	/** Converter para transformar o valor antes de salvar no dataSource */
	outputConverter?: (tags: string[]) => any;
	/** Converter para transformar o valor do dataSource antes de exibir */
	inputConverter?: (value: any) => string[];
}

export function ArchbaseTagInputEdit<T, ID>({
	dataSource,
	dataField,
	disabled = false,
	readOnly = false,
	style,
	placeholder,
	label,
	description,
	error,
	required,
	size,
	width,
	innerRef,
	value,
	defaultValue,
	icon,
	onKeyDown,
	onKeyUp,
	onActionSearchExecute,
	tooltipIconSearch = 'Clique aqui para Localizar',
	onFocusExit = () => {},
	onFocusEnter = () => {},
	onChangeValue = () => {},
	onRemove,
	onClear,
	variant,
	
	// Props específicas do TagsInput
	data,
	searchValue,
	defaultSearchValue,
	onSearchChange,
	maxTags = Infinity,
	allowDuplicates = false,
	onDuplicate,
	splitChars = [','],
	clearable = false,
	clearButtonProps,
	hiddenInputProps,
	hiddenInputValuesDivider = ',',
	renderOption,
	scrollAreaProps,
	acceptValueOnBlur = true,
	limit,
	outputConverter,
	inputConverter,
}: ArchbaseTagInputEditProps<T, ID>) {
	const [currentValue, setCurrentValue] = useState<string[]>(value || defaultValue || []);
	const innerComponentRef = useRef<any>();
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const forceUpdate = useForceUpdate();

	useEffect(() => {
		setInternalError(undefined);
	}, [currentValue]);

	useEffect(() => {
		if (error !== internalError) {
			setInternalError(error);
		}
	}, [error]);

	useEffect(() => {
		if (value !== undefined && JSON.stringify(value) !== JSON.stringify(currentValue)) {
			setCurrentValue(value);
		}
	}, [value]);

	const loadDataSourceFieldValue = () => {
		let initialValue: string[] = currentValue;

		if (dataSource && dataField) {
			const fieldValue = dataSource.getFieldValue(dataField);
			
			// Usa o inputConverter se fornecido
			if (inputConverter) {
				initialValue = inputConverter(fieldValue);
			} else {
				// Lógica padrão de conversão
				if (Array.isArray(fieldValue)) {
					initialValue = fieldValue;
				} else if (typeof fieldValue === 'string' && fieldValue) {
					// Se o valor no datasource for uma string, tenta fazer parse como JSON ou separar por vírgula
					try {
						const parsed = JSON.parse(fieldValue);
						initialValue = Array.isArray(parsed) ? parsed : [fieldValue];
					} catch {
						initialValue = fieldValue.split(',').map(item => item.trim()).filter(item => item);
					}
				} else {
					initialValue = [];
				}
			}
		}

		initialValue = initialValue.filter(value => value && value.trim() !== '');
		setCurrentValue(initialValue);
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
				event.type === DataSourceEventNames.afterCancel ||
				event.type === DataSourceEventNames.afterEdit
			) {
				loadDataSourceFieldValue();
				forceUpdate();
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

	useArchbaseDidUpdate(() => {
		if (!value) { // Só carrega do datasource se não é controlado
			loadDataSourceFieldValue();
		}
	}, []);

	const handleChange = (changedValue: string[]) => {
		// Filtra valores vazios ou que contenham apenas espaços
		const filteredValue = changedValue.filter(value => value && value.trim() !== '');
		
		setCurrentValue(filteredValue);

		if (dataSource && !dataSource.isBrowsing() && dataField) {
			// Usa o outputConverter se fornecido, senão salva como array
			const valueToSave = outputConverter ? outputConverter(filteredValue) : filteredValue;
			dataSource.setFieldValue(dataField, valueToSave);
		}

		if (onChangeValue) {
			onChangeValue(filteredValue);
		}
	};

	const handleRemove = (removedValue: string) => {
		const newValue = currentValue.filter(value => value !== removedValue && value && value.trim() !== '');
		setCurrentValue(newValue);
		
		if (dataSource && !dataSource.isBrowsing() && dataField) {
			const valueToSave = outputConverter ? outputConverter(newValue) : newValue;
			dataSource.setFieldValue(dataField, valueToSave);
		}

		if (onChangeValue) {
			onChangeValue(newValue);
		}

		if (onRemove) {
			onRemove(removedValue);
		}
	};

	const handleClear = () => {
		const emptyValue: string[] = [];
		setCurrentValue(emptyValue);
		
		if (dataSource && !dataSource.isBrowsing() && dataField) {
			// Usa o outputConverter se fornecido, senão salva como array vazio
			const valueToSave = outputConverter ? outputConverter(emptyValue) : emptyValue;
			dataSource.setFieldValue(dataField, valueToSave);
		}

		if (onChangeValue) {
			onChangeValue(emptyValue);
		}

		if (onClear) {
			onClear();
		}
	};

	useArchbaseWillUnmount(() => {
		if (dataSource && dataField) {
			dataSource.removeListener(dataSourceEvent);
			dataSource.removeFieldChangeListener(dataField, fieldChangedListener);
		}
	});

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

	const isReadOnly = () => {
		let tmpReadOnly = readOnly;
		if (dataSource && !readOnly) {
			tmpReadOnly = dataSource.isBrowsing();
		}
		return tmpReadOnly;
	};

	return (
		<TagsInput
			disabled={disabled}
			readOnly={isReadOnly()}
			size={size!}
			style={{
				width,
				...style,
			}}
			value={currentValue}
			defaultValue={defaultValue}
			ref={innerRef || innerComponentRef}
			required={required}
			onChange={handleChange}
			onRemove={handleRemove}
			onClear={handleClear}
			onBlur={handleOnFocusExit}
			onFocus={handleOnFocusEnter}
			placeholder={placeholder}
			description={description}
			onKeyDown={onKeyDown}
			onKeyUp={onKeyUp}
			label={label}
			error={internalError}
			
			// Props específicas do TagsInput
			data={data}
			searchValue={searchValue}
			defaultSearchValue={defaultSearchValue}
			onSearchChange={onSearchChange}
			maxTags={maxTags}
			allowDuplicates={allowDuplicates}
			onDuplicate={onDuplicate}
			splitChars={splitChars}
			clearable={clearable}
			clearButtonProps={clearButtonProps}
			hiddenInputProps={hiddenInputProps}
			hiddenInputValuesDivider={hiddenInputValuesDivider}
			renderOption={renderOption}
			scrollAreaProps={scrollAreaProps}
			acceptValueOnBlur={acceptValueOnBlur}
			limit={limit}
			
			rightSection={
				onActionSearchExecute ? (
					<Tooltip withinPortal withArrow label={tooltipIconSearch}>
						<ActionIcon
							style={{
								backgroundColor:
									variant === 'filled'
										? colorScheme === 'dark'
											? theme.colors[theme.primaryColor][5]
											: theme.colors[theme.primaryColor][6]
										: undefined,
							}}
							tabIndex={-1}
							variant={variant}
							onClick={onActionSearchExecute}
						>
							{icon}
						</ActionIcon>
					</Tooltip>
				) : null
			}
		/>
	);
}