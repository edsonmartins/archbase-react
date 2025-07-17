import { ActionIcon, MantineSize, Tooltip, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import type { CSSProperties, FocusEventHandler, ReactNode } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { formatStr } from '@archbase/core';
import { ArchbaseObjectHelper } from '@archbase/core';
import type { ArchbaseDataSource, DataSourceEvent } from '@archbase/data';
import { DataSourceEventNames } from '@archbase/data';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '@archbase/data';
import { useArchbaseV1V2Compatibility } from '@archbase/data';
import { useForceUpdate } from '@mantine/hooks';
import { ArchbaseNumberEdit } from './ArchbaseNumberEdit';

export interface ArchbaseLookupNumberProps<T, ID, O> {
	/** Fonte de dados onde será atribuido o valor do lookup edit */
	dataSource?: ArchbaseDataSource<T, ID>;
	/** Campo onde deverá ser atribuido o valor do lookup edit na fonte de dados */
	dataField?: string;
	/** Campo da fonte de dados que será usado para apresentar o valor no lookup edit */
	lookupField?: string;
	/** Indicador se o lookup edit está desabilitado */
	disabled?: boolean;
	/** Indicador se o lookup edit é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
	readOnly?: boolean;
	/** Indicador se o preenchimento do lookup edit é obrigatório */
	required?: boolean;
	/** Validar ao sair do campo se localizou o valor */
	validateOnExit?: boolean;
	/** Mensagem caso falhe ao localizar o valor */
	validateMessage?: string;
	/** Estilo do lookup edit */
	style?: CSSProperties;
	/** Tamanho do campo */
	size?: MantineSize;
	/** Largura do lookup edit */
	width?: string | number | undefined;
	/** Texto sugestão do lookup edit */
	placeholder?: string;
	/** Título do lookup edit */
	label?: string;
	/** Descrição do lookup edit */
	description?: string;
	/** Último erro ocorrido no lookup edit */
	error?: string;
	/** Icone para apresentar lado direito do lookup edit que representa a busca */
	iconSearch?: ReactNode;
	/** Dica para botão localizar */
	tooltipIconSearch?: string;
	/** Caracter separador decimal */
	decimalSeparator?: string;
	/** Caracter separador de milhar */
	thousandSeparator?: string;
	/** Número de casas decimais */
	precision?: number;
	/** Permite números negativos */
	allowNegative?: boolean;
	/** Aceita em branco */
	allowEmpty?: boolean;
	/** Valor atual caso não esteje usando fonte de dados*/
	value?: any;
	/** Evento ocorre quando clica no botão localizar */
	onActionSearchExecute?: () => void;
	/** Evento quando o foco sai do lookup edit */
	onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o lookup edit recebe o foco */
	onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o valor do lookup edit é alterado */
	onChangeValue?: (value: any, event: any) => void;
	/** Evento ocorre quando um valor é localizado */
	onLookupResult?: (value: O) => void;
	/** Evento ocorre quando se obtém um erro ao localizar valor */
	onLookupError?: (error: string) => void;
	/** Função responsável por localizar um valor */
	lookupValueDelegator: (value: any) => Promise<O>;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
}

function getInitialValue<T, ID>(value: any, dataSource?: ArchbaseDataSource<T, ID>, lookupField?: string): any {
	let initialValue: any = value;
	if (dataSource && lookupField) {
		initialValue = dataSource.getFieldValue(lookupField);
		if (!initialValue) {
			initialValue = '';
		}
	}
	return initialValue;
}

export function ArchbaseLookupNumber<T, ID, O>({
	dataSource,
	dataField,
	lookupField,
	iconSearch,
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
	value,
	lookupValueDelegator,
	onLookupError,
	onLookupResult,
	validateMessage,
	tooltipIconSearch = 'Clique aqui para Localizar',
	validateOnExit = true,
	onFocusExit = () => {},
	onFocusEnter = () => {},
	onChangeValue = () => {},
	onActionSearchExecute = () => {},
	innerRef,
	decimalSeparator,
	thousandSeparator,
	precision = 0,
	allowNegative = false,
	allowEmpty = true,
}: ArchbaseLookupNumberProps<T, ID, O>) {
	const forceUpdate = useForceUpdate();

	// 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade
	const v1v2Compatibility = useArchbaseV1V2Compatibility<any>(
		'ArchbaseLookupNumber',
		dataSource,
		dataField,
		null
	);

	// 🔄 MIGRAÇÃO V1/V2: Debug info para desenvolvimento
	if (process.env.NODE_ENV === 'development' && dataSource) {
		console.log(`[ArchbaseLookupNumber] DataSource version: ${v1v2Compatibility.dataSourceVersion}`);
	}

	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();
	const [currentValue, setCurrentValue] = useState<any | undefined>(
		getInitialValue<T, ID>(value, dataSource, lookupField),
	);
	const innerComponentRef = innerRef || useRef<any>(null);
	const [internalError, setInternalError] = useState<string | undefined>(error);
	useEffect(() => {
		setInternalError(undefined);
	}, [currentValue]);

	const loadDataSourceFieldValue = () => {
		const initialValue: any = getInitialValue<T, ID>(currentValue, dataSource, lookupField);
		setCurrentValue(initialValue);
		setInternalError(undefined);
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
			if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
				setInternalError(event.error);
			}
		}
	}, [v1v2Compatibility.isDataSourceV2]);

	useArchbaseDidMount(() => {
		loadDataSourceFieldValue();
		if (dataSource && lookupField) {
			dataSource.addListener(dataSourceEvent);
			dataSource.addFieldChangeListener(lookupField, fieldChangedListener);
		}
	});

	useArchbaseDidUpdate(() => {
		loadDataSourceFieldValue();
	}, []);

	useArchbaseWillUnmount(() => {
		if (dataSource && dataField) {
			dataSource.removeListener(dataSourceEvent);
			dataSource.removeFieldChangeListener(dataField, fieldChangedListener);
		}
	});

	const handleChange = (_maskValue: any, value: number, event: any) => {
		setInternalError(undefined);
		setCurrentValue((_prev) => value);

		if (onChangeValue) {
			onChangeValue(event, value);
		}
	};

	const lookupValue = () => {
		if (dataSource && dataField && !dataSource.isBrowsing() && lookupField) {
			if (currentValue != dataSource.getFieldValue(lookupField)) {
				if (!currentValue || currentValue == null) {
					// 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
					v1v2Compatibility.handleValueChange(null);
				} else {
					const promise = lookupValueDelegator(currentValue);
					promise
						.then((data: O) => {
							if (!data || data == null) {
								if (validateOnExit && validateMessage) {
									if (onLookupError) {
										onLookupError(formatStr(validateMessage, value));
									}
								}
							}
							if (onLookupResult) {
								onLookupResult(data);
							}
							// 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
							v1v2Compatibility.handleValueChange(data);
						})
						.catch((error) => {
							// 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
							v1v2Compatibility.handleValueChange(null);
							innerComponentRef.current?.focus();
							if (validateMessage) {
								setInternalError(formatStr(validateMessage, value));
							}
							if (onLookupError) {
								onLookupError(error);
							}
						});
				}
			}
		} else {
			if (value && value != null) {
				const promise = lookupValueDelegator(value);
				promise
					.then((data: O) => {
						if (!data || data == null) {
							if (validateOnExit && validateMessage) {
								if (onLookupError) {
									onLookupError(formatStr(validateMessage, value));
								}
							}
						}
						if (onLookupResult) {
							onLookupResult(data);
						}
						let newValue = ArchbaseObjectHelper.getNestedProperty(data, lookupField);
						if (!newValue) {
							newValue = '';
						}
						setCurrentValue(newValue);
					})
					.catch((error) => {
						setCurrentValue(undefined);
						if (validateMessage) {
							setInternalError(formatStr(validateMessage, value));
						}
						innerComponentRef.current?.focus();
						if (onLookupError) {
							onLookupError(error);
						}
					});
			}
		}
	};

	const handleOnFocusExit = (event) => {
		lookupValue();
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
		// 🔄 MIGRAÇÃO V1/V2: Usar padrão de compatibilidade para isReadOnly
		return readOnly || v1v2Compatibility.isReadOnly;
	};

	const icon = iconSearch ? iconSearch : <IconSearch size="1rem" />;

	return (
		<ArchbaseNumberEdit
			disabled={disabled}
			required={required}
			value={currentValue}
			readOnly={isReadOnly()}
			onChangeValue={handleChange}
			innerRef={innerComponentRef}
			onFocusEnter={handleOnFocusEnter}
			onFocusExit={handleOnFocusExit}
			placeholder={placeholder}
			description={description}
			label={label}
			error={internalError}
			style={style}
			size={size}
			width={width}
			decimalSeparator={decimalSeparator}
			thousandSeparator={thousandSeparator}
			precision={precision}
			allowNegative={allowNegative}
			allowEmpty={allowEmpty}
			rightSection={
				<Tooltip withinPortal withArrow label={tooltipIconSearch}>
					<ActionIcon
						style={{
							backgroundColor:
								colorScheme === 'dark' ? theme.colors[theme.primaryColor][5] : theme.colors[theme.primaryColor][6],
						}}
						tabIndex={-1}
						variant="filled"
						onClick={onActionSearchExecute}
					>
						{icon}
					</ActionIcon>
				</Tooltip>
			}
		/>
	);
}
