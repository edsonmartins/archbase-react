/**
 * ArchbasePhoneInput — input de telefone internacional integrado ao DataSource (v1/v2)
 * com suporte a validação, estado controlado e seleção de país.
 * @status stable
 */
import { Input, MantineSize, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import type { DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames, useArchbaseDidUpdate, useArchbaseV1V2Compatibility } from '@archbase/data';
import { useValidationErrors } from '@archbase/core';
import type { CountryCode } from 'libphonenumber-js';

export interface ArchbasePhoneInputProps<T, ID> {
	/** Fonte de dados onde será atribuído o valor do phone input (V1 ou V2) */
	dataSource?: IArchbaseDataSourceBase<T>;
	/** Campo onde deverá ser atribuído o valor do phone input na fonte de dados */
	dataField?: string;
	/** Valor controlado do phone input (modo standalone) */
	value?: string;
	/** Valor padrão do phone input (modo standalone) */
	defaultValue?: string;
	/** País padrão selecionado no seletor de bandeiras */
	defaultCountry?: CountryCode;
	/** Se true, exibe o número em formato internacional (+55 ...) */
	international?: boolean;
	/** Título/label do phone input */
	label?: string;
	/** Descrição exibida abaixo do label */
	description?: string;
	/** Mensagem de erro a ser exibida */
	error?: string;
	/** Texto de placeholder do phone input */
	placeholder?: string;
	/** Indicador se o preenchimento é obrigatório */
	required?: boolean;
	/** Indicador se o phone input está desabilitado */
	disabled?: boolean;
	/** Indicador se o phone input é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
	readOnly?: boolean;
	/** Evento quando o valor do phone input é alterado */
	onChangeValue?: (value: string | undefined) => void;
	/** Evento quando o phone input recebe o foco */
	onFocusEnter?: FocusEventHandler<HTMLInputElement> | undefined;
	/** Evento quando o foco sai do phone input */
	onFocusExit?: FocusEventHandler<HTMLInputElement> | undefined;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
	/** Estilo CSS customizado aplicado ao wrapper */
	style?: CSSProperties;
	/** Classe CSS customizada aplicada ao wrapper */
	className?: string;
	/** Largura do componente */
	width?: string | number;
	/** Tamanho do componente seguindo o padrão Mantine */
	size?: MantineSize;
}

export function ArchbasePhoneInput<T, ID>({
	dataSource,
	dataField,
	value: valueProp,
	defaultValue = '',
	defaultCountry = 'BR',
	international = true,
	label,
	description,
	error,
	placeholder,
	required,
	disabled = false,
	readOnly = false,
	onChangeValue,
	onFocusEnter,
	onFocusExit,
	innerRef,
	style,
	className,
	width,
	size = 'sm',
}: ArchbasePhoneInputProps<T, ID>) {
	// Hook de compatibilidade V1/V2
	const v1v2Compatibility = useArchbaseV1V2Compatibility<string>(
		'ArchbasePhoneInput',
		dataSource,
		dataField,
		'',
	);

	const innerComponentRef = innerRef || useRef<any>(null);
	const [currentValue, setCurrentValue] = useState<string>(valueProp || defaultValue || '');
	const forceUpdate = useForceUpdate();
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();

	// Contexto de validação (opcional - pode não existir)
	const validationContext = useValidationErrors();

	// Chave única para o field
	const fieldKey = `${dataField}`;

	// Recuperar erro do contexto se existir
	const contextError = validationContext?.getError(fieldKey);

	// Detecta automaticamente se é DataSource V2
	const isDataSourceV2 =
		dataSource &&
		('appendToFieldArray' in dataSource || 'updateFieldArrayItem' in dataSource);

	// Para V2: estado otimizado (sem re-renders desnecessários)
	const [v2Value, setV2Value] = useState<string>('');

	// Apenas atualizar se o prop error vier definido
	useEffect(() => {
		if (error !== undefined && error !== internalError) {
			setInternalError(error);
		}
	}, [error]);

	const loadDataSourceFieldValue = () => {
		let initialValue: any = valueProp || defaultValue || '';

		if (dataSource && dataField) {
			initialValue = dataSource.getFieldValue(dataField);
			if (!initialValue) {
				initialValue = '';
			}
		}

		if (isDataSourceV2) {
			setV2Value(initialValue);
		} else {
			setCurrentValue(initialValue);
		}
	};

	const fieldChangedListener = useCallback(() => {
		loadDataSourceFieldValue();
	}, []);

	const dataSourceEvent = useCallback(
		(event: DataSourceEvent<T>) => {
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
						forceUpdate();
					}
				}

				if (
					event.type === DataSourceEventNames.onFieldError &&
					event.fieldName === dataField
				) {
					setInternalError(event.error);
					validationContext?.setError(fieldKey, event.error);
					if (!isDataSourceV2) {
						forceUpdate();
					}
				}
			}
		},
		[isDataSourceV2, dataSource, dataField, validationContext, fieldKey],
	);

	// Ref para manter callback sempre atualizado (corrige problema de closure desatualizada)
	const dataSourceEventRef = useRef(dataSourceEvent);
	useEffect(() => {
		dataSourceEventRef.current = dataSourceEvent;
	}, [dataSourceEvent]);

	// Wrapper estável que delega para ref - nunca muda, então o listener permanece consistente
	const stableDataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
		dataSourceEventRef.current(event);
	}, []);

	// Registrar listeners com cleanup apropriado
	useEffect(() => {
		loadDataSourceFieldValue();
		if (dataSource && dataField) {
			const hasFieldListener =
				typeof (dataSource as any).addFieldChangeListener === 'function';
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

	useArchbaseDidUpdate(() => {
		loadDataSourceFieldValue();
	}, []);

	const handleChange = (newValue: string | undefined) => {
		const changedValue = newValue || '';

		// Limpa erro quando usuário edita o campo
		const hasError = internalError || contextError;
		if (hasError) {
			setInternalError(undefined);
			validationContext?.clearError(fieldKey);
		}

		if (isDataSourceV2) {
			setV2Value(changedValue);
			if (
				dataSource &&
				!dataSource.isBrowsing() &&
				dataField &&
				dataSource.getFieldValue(dataField) !== changedValue
			) {
				dataSource.setFieldValue(dataField, changedValue);
			}
		} else {
			setCurrentValue(changedValue);
			if (
				dataSource &&
				!dataSource.isBrowsing() &&
				dataField &&
				dataSource.getFieldValue(dataField) !== changedValue
			) {
				dataSource.setFieldValue(dataField, changedValue);
			}
		}

		if (onChangeValue) {
			onChangeValue(newValue);
		}
	};

	const handleOnFocusExit = (event: React.FocusEvent<HTMLInputElement>) => {
		if (onFocusExit) {
			onFocusExit(event);
		}
	};

	const handleOnFocusEnter = (event: React.FocusEvent<HTMLInputElement>) => {
		if (onFocusEnter) {
			onFocusEnter(event);
		}
	};

	const isReadOnly = (): boolean => {
		return readOnly || v1v2Compatibility.isReadOnly;
	};

	// Erro a ser exibido: local ou do contexto
	const displayError = internalError || contextError;

	const isDark = colorScheme === 'dark';

	// Mantine-compatible sizing
	const inputHeight =
		size === 'xs'
			? 30
			: size === 'sm'
				? 36
				: size === 'md'
					? 42
					: size === 'lg'
						? 50
						: size === 'xl'
							? 60
							: 36;

	const fontSize =
		size === 'xs'
			? 12
			: size === 'sm'
				? 14
				: size === 'md'
					? 16
					: size === 'lg'
						? 18
						: size === 'xl'
							? 20
							: 14;

	return (
		<Input.Wrapper
			label={label}
			description={description}
			error={displayError}
			required={required}
			size={size}
			style={{ width, ...style }}
			className={className}
		>
			<PhoneInput
				ref={innerComponentRef}
				international={international}
				defaultCountry={defaultCountry}
				value={isDataSourceV2 ? v2Value : currentValue}
				onChange={handleChange}
				onFocus={handleOnFocusEnter}
				onBlur={handleOnFocusExit}
				disabled={disabled}
				readOnly={isReadOnly()}
				placeholder={placeholder}
				style={{
					'--PhoneInputCountryFlag-height': '1em',
					'--PhoneInputCountrySelectArrow-color': isDark
						? theme.colors.dark[1]
						: theme.colors.gray[6],
					'--PhoneInput-color--focus': theme.colors[theme.primaryColor][isDark ? 4 : 6],
				} as React.CSSProperties}
				numberInputProps={{
					style: {
						height: inputHeight,
						fontSize,
						backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
						color: isDark ? theme.colors.dark[0] : theme.black,
						border: `1px solid ${
							displayError
								? theme.colors.red[isDark ? 4 : 6]
								: isDark
									? theme.colors.dark[4]
									: theme.colors.gray[4]
						}`,
						borderRadius: theme.radius.sm,
						paddingLeft: 8,
						paddingRight: 8,
						outline: 'none',
						width: '100%',
					},
				}}
				countrySelectProps={{
					style: {
						backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
						color: isDark ? theme.colors.dark[0] : theme.black,
					},
				}}
			/>
		</Input.Wrapper>
	);
}

ArchbasePhoneInput.displayName = 'ArchbasePhoneInput';
