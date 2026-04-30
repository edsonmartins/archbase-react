/**
 * ArchbaseMentionInput — input com suporte a mentions (@user, #tag, etc.) integrado ao DataSource (v1/v2).
 * Wrapper sobre react-mentions com tema Mantine e validacao.
 * @status stable
 */
import { Input, MantineSize, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames, useArchbaseDidUpdate, useArchbaseV1V2Compatibility } from '@archbase/data';
import { useValidationErrors } from '@archbase/core';
import { MentionsInput, Mention } from 'react-mentions';

export interface ArchbaseMentionConfig {
	/** Caractere gatilho da mention (ex: '@', '#') */
	trigger: string;
	/** Lista estatica ou funcao async que retorna sugestoes */
	data:
		| Array<{ id: string; display: string }>
		| ((search: string, callback: (data: Array<{ id: string; display: string }>) => void) => void);
	/** Markup template. Padrao: '[__display__](__id__)' */
	markup?: string;
	/** Funcao para transformar exibicao */
	displayTransform?: (id: string, display: string) => string;
	/** Permite espacos na busca */
	allowSpaceInQuery?: boolean;
	/** Estilos customizados para a mention */
	style?: React.CSSProperties;
}

export interface ArchbaseMentionInputProps<T, ID> {
	/** Fonte de dados onde sera atribuido o valor (V1 ou V2) */
	dataSource?: IArchbaseDataSourceBase<T>;
	/** Campo onde devera ser atribuido o valor na fonte de dados */
	dataField?: string;
	/** Valor controlado (standalone) */
	value?: string;
	/** Valor padrao (standalone) */
	defaultValue?: string;
	/** Titulo do campo */
	label?: string;
	/** Descricao do campo */
	description?: string;
	/** Ultimo erro ocorrido */
	error?: string;
	/** Texto sugestao */
	placeholder?: string;
	/** Indicador se o preenchimento e obrigatorio */
	required?: boolean;
	/** Indicador se o campo esta desabilitado */
	disabled?: boolean;
	/** Indicador se o campo e somente leitura */
	readOnly?: boolean;
	/** Configuracoes de mention (triggers, data, etc.) */
	mentions: ArchbaseMentionConfig[];
	/** Modo linha unica */
	singleLine?: boolean;
	/** Permitir sugestoes acima do cursor */
	allowSuggestionsAboveCursor?: boolean;
	/** Evento quando o valor e alterado */
	onChangeValue?: (value: string, event: any) => void;
	/** Evento quando o campo recebe foco */
	onFocusEnter?: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>;
	/** Evento quando o foco sai do campo */
	onFocusExit?: FocusEventHandler<HTMLTextAreaElement | HTMLInputElement>;
	/** Referencia para o componente interno */
	innerRef?: React.RefObject<HTMLTextAreaElement | HTMLInputElement>;
	/** Estilos customizados */
	style?: CSSProperties;
	/** Classes CSS customizadas */
	className?: string;
	/** Largura do campo */
	width?: string | number;
	/** Altura do campo */
	height?: string | number;
	/** Tamanho do campo (Mantine) */
	size?: MantineSize;
}

export function ArchbaseMentionInput<T, ID>({
	dataSource,
	dataField,
	value: valueProp,
	defaultValue,
	label,
	description,
	error,
	placeholder,
	required = false,
	disabled = false,
	readOnly = false,
	mentions,
	singleLine = false,
	allowSuggestionsAboveCursor = true,
	onChangeValue,
	onFocusEnter,
	onFocusExit,
	innerRef,
	style,
	className,
	width,
	height,
	size,
}: ArchbaseMentionInputProps<T, ID>) {
	const v1v2Compatibility = useArchbaseV1V2Compatibility<string>(
		'ArchbaseMentionInput',
		dataSource,
		dataField,
		'',
	);

	const [currentValue, setCurrentValue] = useState<string>(valueProp ?? defaultValue ?? '');
	const innerComponentRef = useRef<any>(null);
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const forceUpdate = useForceUpdate();

	const validationContext = useValidationErrors();
	const fieldKey = `${dataField}`;
	const contextError = validationContext?.getError(fieldKey);

	const isDark = colorScheme === 'dark';

	useEffect(() => {
		if (error !== undefined && error !== internalError) {
			setInternalError(error);
		}
	}, [error]);

	// Sincronizar prop value quando nao tem datasource
	useEffect(() => {
		if (!dataSource && valueProp !== undefined) {
			setCurrentValue(valueProp);
		}
	}, [valueProp, dataSource]);

	const loadDataSourceFieldValue = () => {
		let initialValue: any = valueProp ?? defaultValue ?? '';

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
					if (!v1v2Compatibility.isDataSourceV2) {
						forceUpdate();
					}
				}

				if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
					setInternalError(event.error);
					validationContext?.setError(fieldKey, event.error);
					if (!v1v2Compatibility.isDataSourceV2) {
						forceUpdate();
					}
				}
			}
		},
		[v1v2Compatibility.isDataSourceV2, dataSource, dataField, loadDataSourceFieldValue, forceUpdate, validationContext, fieldKey],
	);

	const dataSourceEventRef = useRef(dataSourceEvent);
	useEffect(() => {
		dataSourceEventRef.current = dataSourceEvent;
	}, [dataSourceEvent]);

	const stableDataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
		dataSourceEventRef.current(event);
	}, []);

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

	useArchbaseDidUpdate(() => {
		loadDataSourceFieldValue();
	}, []);

	const handleChange = (event: any, newValue: string, newPlainTextValue: string, mentions: any[]) => {
		const hasError = internalError || contextError;
		if (hasError) {
			setInternalError(undefined);
			validationContext?.clearError(fieldKey);
		}

		setCurrentValue(newValue);

		if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== newValue) {
			v1v2Compatibility.handleValueChange(newValue);
		}

		if (onChangeValue) {
			onChangeValue(newValue, event);
		}
	};

	const handleOnFocusExit = (event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		if (onFocusExit) {
			onFocusExit(event);
		}
	};

	const handleOnFocusEnter = (event: React.FocusEvent<HTMLTextAreaElement | HTMLInputElement>) => {
		if (onFocusEnter) {
			onFocusEnter(event);
		}
	};

	const isReadOnly = () => {
		return readOnly || v1v2Compatibility.isReadOnly;
	};

	const displayError = internalError || contextError;

	// Tamanhos baseados no MantineSize
	const sizeMap: Record<string, { fontSize: number; minHeight: number; padding: string }> = {
		xs: { fontSize: 12, minHeight: 28, padding: '4px 8px' },
		sm: { fontSize: 14, minHeight: 34, padding: '6px 10px' },
		md: { fontSize: 14, minHeight: 36, padding: '8px 12px' },
		lg: { fontSize: 16, minHeight: 42, padding: '10px 14px' },
		xl: { fontSize: 18, minHeight: 48, padding: '12px 16px' },
	};

	const currentSize = sizeMap[size || 'sm'] || sizeMap.sm;

	const borderColor = displayError
		? (theme.colors.red[isDark ? 4 : 6])
		: (isDark ? theme.colors.dark[4] : theme.colors.gray[4]);

	const focusBorderColor = displayError
		? (theme.colors.red[isDark ? 4 : 6])
		: (theme.colors[theme.primaryColor][isDark ? 5 : 6]);

	const mentionsInputStyle: any = {
		control: {
			fontSize: currentSize.fontSize,
			fontWeight: 'normal',
		},
		'&multiLine': {
			control: {
				minHeight: height || currentSize.minHeight,
			},
			highlighter: {
				padding: currentSize.padding,
				border: '1px solid transparent',
				minHeight: height || currentSize.minHeight,
			},
			input: {
				padding: currentSize.padding,
				border: `1px solid ${borderColor}`,
				borderRadius: theme.radius.sm,
				backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
				color: isDark ? theme.colors.dark[0] : theme.black,
				minHeight: height || currentSize.minHeight,
				outline: 'none',
				'&:focus': {
					borderColor: focusBorderColor,
				},
			},
		},
		'&singleLine': {
			display: 'inline-block',
			width: '100%',
			highlighter: {
				padding: currentSize.padding,
				border: '1px solid transparent',
			},
			input: {
				padding: currentSize.padding,
				border: `1px solid ${borderColor}`,
				borderRadius: theme.radius.sm,
				backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
				color: isDark ? theme.colors.dark[0] : theme.black,
				height: height || currentSize.minHeight,
				outline: 'none',
				'&:focus': {
					borderColor: focusBorderColor,
				},
			},
		},
		suggestions: {
			list: {
				backgroundColor: isDark ? theme.colors.dark[7] : theme.white,
				border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
				borderRadius: theme.radius.sm,
				fontSize: currentSize.fontSize,
				maxHeight: 200,
				overflowY: 'auto',
				boxShadow: theme.shadows.md,
				zIndex: 1000,
			},
			item: {
				padding: '6px 12px',
				color: isDark ? theme.colors.dark[0] : theme.black,
				'&focused': {
					backgroundColor: isDark ? theme.colors.dark[4] : theme.colors[theme.primaryColor][0],
					color: isDark ? theme.white : theme.black,
				},
			},
		},
	};

	const defaultMentionStyle: React.CSSProperties = {
		backgroundColor: isDark
			? `${theme.colors[theme.primaryColor][9]}40`
			: `${theme.colors[theme.primaryColor][1]}`,
		borderRadius: '2px',
	};

	return (
		<Input.Wrapper
			label={label}
			description={description}
			error={displayError}
			required={required}
			size={size}
			style={{ width, ...style }}
		>
			<MentionsInput
				value={currentValue}
				onChange={handleChange}
				onBlur={handleOnFocusExit as any}
				onFocus={handleOnFocusEnter as any}
				placeholder={placeholder}
				disabled={disabled}
				readOnly={isReadOnly()}
				singleLine={singleLine}
				allowSuggestionsAboveCursor={allowSuggestionsAboveCursor}
				inputRef={innerRef || innerComponentRef}
				className={className}
				style={mentionsInputStyle}
			>
				{mentions.map((mentionConfig, index) => (
					<Mention
						key={`${mentionConfig.trigger}-${index}`}
						trigger={mentionConfig.trigger}
						data={mentionConfig.data}
						markup={mentionConfig.markup || '[__display__](__id__)'}
						displayTransform={mentionConfig.displayTransform}
						style={mentionConfig.style || defaultMentionStyle}
					/>
				))}
			</MentionsInput>
		</Input.Wrapper>
	);
}

ArchbaseMentionInput.displayName = 'ArchbaseMentionInput';
