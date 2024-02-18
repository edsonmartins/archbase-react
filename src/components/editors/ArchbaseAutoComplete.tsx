import {
	ActionIcon,
	Autocomplete,
	MantineSize,
	TextInput,
	Tooltip,
	useMantineColorScheme,
	useMantineTheme,
} from '@mantine/core';
import { Autocomplete as MantineAutocomplete } from '@mantine/core';
import type { ComboboxStringData, AutocompleteProps as MantineAutocompleteProps, OptionsFilter } from '@mantine/core';
import { useColorScheme, useForceUpdate } from '@mantine/hooks';
import type { CSSProperties, FocusEventHandler, ReactNode } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ArchbaseDataSource, DataSourceEvent } from '../datasource';
import { DataSourceEventNames } from '../datasource';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '../hooks/lifecycle';
import { ArchbaseEditProps } from './ArchbaseEdit';

export interface ArchbaseAutoCompleteProps<T, ID> {
	/** Dados para a lista de autocompletar, geralmente strings ou objetos com formato específico */
	data: ComboboxStringData;
	/** Limita o número de itens exibidos na lista de autocompletar */
	limit?: number;
	/** Altura máxima da lista de opções do autocompletar */
	maxDropdownHeight?: number | string;
	/** Componente personalizado para renderizar cada item da lista de autocompletar */
	itemComponent?: React.FC<any>;
	/** Função de filtragem para determinar quais itens são mostrados com base na entrada do usuário */
	filter?: OptionsFilter;
	/** Seção à direita dentro do campo de autocompletar, geralmente usada para botões ou ícones adicionais */
	rightSection?: React.ReactNode;
	/** Propriedades adicionais para a seção à direita */
	rightSectionProps?: Record<string, any>;
	/** Largura da seção direita dentro do campo de autocompletar */
	rightSectionWidth?: CSSProperties['width'];
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
	/** Valor inicial */
	value?: string;
	/** Estilo do edit */
	style?: CSSProperties;
	/** Tamanho do edit */
	size?: MantineSize;
	/** Largura do edit */
	width?: string | number | undefined;
	/** Ícone a ser exibido no lado esquerdo do campo de autocompletar */
	icon?: React.ReactNode;
	/** Largura da seção do ícone dentro do campo de autocompletar */
	iconWidth?: CSSProperties['width'];
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
	onChangeValue?: (value: any) => void;
	onKeyDown?: (event: any) => void;
	onKeyUp?: (event: any) => void;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
	variant?: string;
}

export function ArchbaseAutoComplete<T, ID>({
	dataSource,
	dataField,
	data,
	limit,
	maxDropdownHeight,
	itemComponent,
	iconWidth,
	filter,
	rightSection,
	rightSectionProps,
	rightSectionWidth,
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
	icon,
	onKeyDown,
	onKeyUp,
	onActionSearchExecute,
	tooltipIconSearch = 'Clique aqui para Localizar',
	onFocusExit = () => {},
	onFocusEnter = () => {},
	onChangeValue = () => {},
	variant,
}: ArchbaseAutoCompleteProps<T, ID>) {
	const [currentValue, setCurrentValue] = useState<string>(value || '');
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

	const loadDataSourceFieldValue = () => {
		let initialValue: any = currentValue;

		if (dataSource && dataField) {
			initialValue = dataSource.getFieldValue(dataField);
			if (!initialValue) {
				initialValue = '';
			}
		}

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
		loadDataSourceFieldValue();
	}, []);

	const handleChange = (value) => {
		const changedValue = value;

		setCurrentValue((_prev) => changedValue);

		if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== changedValue) {
			dataSource.setFieldValue(dataField, changedValue);
		}

		if (onChangeValue) {
			onChangeValue(changedValue);
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
		// TODO trocar por combobox?
		// <Autocomplete
		// 	data={data}
		// 	limit={limit}
		// 	maxDropdownHeight={maxDropdownHeight}
		// 	itemComponent={itemComponent}
		// 	icon={icon}
		// 	iconWidth={iconWidth}
		// 	filter={filter}
		// 	rightSectionProps={rightSectionProps}
		// 	rightSectionWidth={rightSectionWidth}
		// 	disabled={disabled}
		// 	readOnly={isReadOnly()}
		// 	withinPortal={true}
		// 	type={'text'}
		// 	size={size!}
		// 	style={{
		// 		width,
		// 		...style,
		// 	}}
		// 	value={currentValue}
		// 	ref={innerRef || innerComponentRef}
		// 	required={required}
		// 	onChange={handleChange}
		// 	onBlur={handleOnFocusExit}
		// 	onFocus={handleOnFocusEnter}
		// 	placeholder={placeholder}
		// 	description={description}
		// 	onKeyDown={onKeyDown}
		// 	onKeyUp={onKeyUp}
		// 	label={label}
		// 	error={internalError}
		// 	rightSection={
		// 		onActionSearchExecute ? (
		// 			<Tooltip withinPortal withArrow label={tooltipIconSearch}>
		// 				<ActionIcon
		// 					style={{
		// 						backgroundColor:
		// 							variant === 'filled'
		// 								? colorScheme === 'dark'
		// 									? theme.colors[theme.primaryColor][5]
		// 									: theme.colors[theme.primaryColor][6]
		// 								: undefined,
		// 					}}
		// 					tabIndex={-1}
		// 					variant={variant}
		// 					onClick={onActionSearchExecute}
		// 				>
		// 					{icon}
		// 				</ActionIcon>
		// 			</Tooltip>
		// 		) : null
		// 	}
		// />
		<div></div>
	);
}
