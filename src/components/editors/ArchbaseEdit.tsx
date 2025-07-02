import {
	ActionIcon,
	ActionIconVariant,
	MantineSize,
	TextInput,
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

export interface ArchbaseEditProps<T, ID> {
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
	onChangeValue?: (value: any, event: any) => void;
	onKeyDown?: (event: any) => void;
	onKeyUp?: (event: any) => void;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
	variant?: ActionIconVariant;
	minLength?: number;
	maxLength?: number;
}

export function ArchbaseEdit<T, ID>({
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
	icon,
	onKeyDown,
	onKeyUp,
	onActionSearchExecute,
	tooltipIconSearch = 'Clique aqui para Localizar',
	onFocusExit = () => {},
	onFocusEnter = () => {},
	onChangeValue = () => {},
	variant,
	minLength,
	maxLength
}: ArchbaseEditProps<T, ID>) {
	const [currentValue, setCurrentValue] = useState<string>(value || '');
	const innerComponentRef = useRef<any>();
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const forceUpdate = useForceUpdate();

	// Detecta automaticamente se é DataSource V2
	const isDataSourceV2 = dataSource && ('appendToFieldArray' in dataSource || 'updateFieldArrayItem' in dataSource);
	
	// Para V2: estado otimizado (sem re-renders desnecessários)
	const [v2Value, setV2Value] = useState<string>('');
	const [v2ShouldUpdate, setV2ShouldUpdate] = useState(0);

	useEffect(() => {
		setInternalError(undefined);
	}, [currentValue]);

	useEffect(() => {
		if (error !== internalError) {
			setInternalError(error);
		}
	}, [error]);

	const loadDataSourceFieldValue = () => {
		let initialValue: any = value || '';

		if (dataSource && dataField) {
			initialValue = dataSource.getFieldValue(dataField);
			if (!initialValue) {
				initialValue = '';
			}
		}

		if (isDataSourceV2) {
			// V2: Update otimizado
			setV2Value(initialValue);
			setV2ShouldUpdate(prev => prev + 1);
		} else {
			// V1: Comportamento original
			setCurrentValue(initialValue);
		}
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
				if (!isDataSourceV2) {
					// V1: Força re-render (comportamento original)
					forceUpdate();
				}
				// V2: Re-render automático via estado otimizado
			}

			if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
				setInternalError(event.error);
			}
		}
	}, [isDataSourceV2]);

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
		const changedValue = event.target.value;

		event.persist();
		
		if (isDataSourceV2) {
			// V2: Otimizado com menos re-renders
			setV2Value(changedValue);
			if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== changedValue) {
				dataSource.setFieldValue(dataField, changedValue);
			}
		} else {
			// V1: Comportamento original mantido
			setCurrentValue((_prev) => changedValue);
			if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== changedValue) {
				dataSource.setFieldValue(dataField, changedValue);
			}
		}

		if (onChangeValue) {
			onChangeValue(changedValue, event);
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
		<TextInput
			disabled={disabled}
			readOnly={isReadOnly()}
			type={'text'}
			size={size!}
			style={{
				width,
				...style,
			}}
			value={isDataSourceV2 ? v2Value : currentValue}
			ref={innerRef || innerComponentRef}
			required={required}
			onChange={handleChange}
			onBlur={handleOnFocusExit}
			onFocus={handleOnFocusEnter}
			placeholder={placeholder}
			description={description}
			onKeyDown={onKeyDown}
			onKeyUp={onKeyUp}
			label={label}
			error={internalError}
			minLength={minLength}
			maxLength={maxLength}
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
