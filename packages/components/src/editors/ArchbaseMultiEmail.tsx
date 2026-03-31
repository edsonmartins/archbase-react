/**
 * ArchbaseMultiEmail — wrapper para react-multi-email integrado ao DataSource (v1/v2).
 * Permite entrada de multiplos e-mails com validacao, exibidos como badges (pills).
 * @status stable
 */
import { Badge, CloseButton, Group, Input, MantineSize, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames, useArchbaseDidUpdate, useArchbaseV1V2Compatibility } from '@archbase/data';
import { useValidationErrors } from '@archbase/core';
import { ReactMultiEmail } from 'react-multi-email';
import 'react-multi-email/dist/style.css';

export interface ArchbaseMultiEmailProps<T, ID> {
	/** Fonte de dados onde sera atribuido o valor (V1 ou V2) */
	dataSource?: IArchbaseDataSourceBase<T>;
	/** Campo onde devera ser atribuido o valor na fonte de dados */
	dataField?: string;
	/** Valor controlado (array de emails) */
	value?: string[];
	/** Valor padrao nao controlado */
	defaultValue?: string[];
	/** Delimitador para converter string do datasource em array (padrao ';') */
	delimiter?: string;
	/** Titulo do campo */
	label?: string;
	/** Descricao do campo */
	description?: string;
	/** Ultimo erro ocorrido */
	error?: string;
	/** Texto de sugestao */
	placeholder?: string;
	/** Indicador se o preenchimento e obrigatorio */
	required?: boolean;
	/** Indicador se o campo esta desabilitado */
	disabled?: boolean;
	/** Indicador se o campo e somente leitura */
	readOnly?: boolean;
	/** Numero maximo de emails permitidos */
	max?: number;
	/** Funcao customizada de validacao de email */
	validateEmail?: (email: string) => boolean;
	/** Evento quando o valor e alterado */
	onChangeValue?: (emails: string[]) => void;
	/** Evento quando o campo recebe o foco */
	onFocusEnter?: FocusEventHandler<HTMLInputElement> | undefined;
	/** Evento quando o foco sai do campo */
	onFocusExit?: FocusEventHandler<HTMLInputElement> | undefined;
	/** Referencia para o componente interno */
	innerRef?: React.RefObject<HTMLDivElement> | undefined;
	/** Estilo do componente */
	style?: CSSProperties;
	/** Classe CSS */
	className?: string;
	/** Largura do componente */
	width?: string | number;
	/** Tamanho do componente */
	size?: MantineSize;
}

export function ArchbaseMultiEmail<T, ID>({
	dataSource,
	dataField,
	value,
	defaultValue,
	delimiter = ';',
	label,
	description,
	error,
	placeholder,
	required,
	disabled = false,
	readOnly = false,
	max,
	validateEmail,
	onChangeValue,
	onFocusEnter,
	onFocusExit,
	innerRef,
	style,
	className,
	width,
	size,
}: ArchbaseMultiEmailProps<T, ID>) {
	// Hook de compatibilidade V1/V2
	const v1v2Compatibility = useArchbaseV1V2Compatibility<string[]>(
		'ArchbaseMultiEmail',
		dataSource,
		dataField,
		defaultValue ?? value ?? [],
	);

	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();
	const forceUpdate = useForceUpdate();
	const [internalError, setInternalError] = useState<string | undefined>(error);

	// Contexto de validacao (opcional)
	const validationContext = useValidationErrors();
	const fieldKey = `${dataField}`;
	const contextError = validationContext?.getError(fieldKey);

	// Estado local dos emails
	const [emails, setEmails] = useState<string[]>(defaultValue ?? value ?? []);

	// Atualizar erro se prop mudar
	useEffect(() => {
		if (error !== undefined && error !== internalError) {
			setInternalError(error);
		}
	}, [error]);

	/**
	 * Converte o valor vindo do datasource para string[].
	 * Se for string, faz split pelo delimitador; se for array, usa diretamente.
	 */
	const parseFieldValue = (fieldValue: any): string[] => {
		if (!fieldValue) return [];
		if (Array.isArray(fieldValue)) return fieldValue;
		if (typeof fieldValue === 'string') {
			return fieldValue
				.split(delimiter)
				.map((e) => e.trim())
				.filter((e) => e.length > 0);
		}
		return [];
	};

	/**
	 * Converte string[] para o formato de armazenamento no datasource.
	 * Se o campo original era string, junta com delimitador.
	 */
	const serializeValue = (emailList: string[]): any => {
		if (dataSource && dataField) {
			const currentFieldValue = dataSource.getFieldValue(dataField);
			if (typeof currentFieldValue === 'string' || currentFieldValue === null || currentFieldValue === undefined) {
				return emailList.join(delimiter);
			}
		}
		return emailList;
	};

	const loadDataSourceFieldValue = () => {
		let initialValue: string[] = defaultValue ?? value ?? [];

		if (dataSource && dataField) {
			const fieldValue = dataSource.getFieldValue(dataField);
			initialValue = parseFieldValue(fieldValue);
		}

		setEmails(initialValue);
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
				}
			}
		},
		[v1v2Compatibility.isDataSourceV2, validationContext, fieldKey],
	);

	// Ref para manter callback sempre atualizado
	const dataSourceEventRef = useRef(dataSourceEvent);
	useEffect(() => {
		dataSourceEventRef.current = dataSourceEvent;
	}, [dataSourceEvent]);

	// Wrapper estavel que delega para ref
	const stableDataSourceEvent = useCallback((event: DataSourceEvent<T>) => {
		dataSourceEventRef.current(event);
	}, []);

	// Registrar listeners com cleanup
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

	// Sincronizar com prop value quando nao ha datasource
	useEffect(() => {
		if (!dataSource && value !== undefined) {
			setEmails(value);
		}
	}, [value, dataSource]);

	const isReadOnly = (): boolean => {
		let tmpReadOnly = readOnly;
		if (dataSource && !readOnly) {
			tmpReadOnly = dataSource.isBrowsing();
		}
		return tmpReadOnly;
	};

	const handleChange = (newEmails: string[]) => {
		// Limpa erro ao editar
		const hasError = internalError || contextError;
		if (hasError) {
			setInternalError(undefined);
			validationContext?.clearError(fieldKey);
		}

		// Aplicar limite max
		const limitedEmails = max ? newEmails.slice(0, max) : newEmails;

		setEmails(limitedEmails);

		// Persistir no datasource
		if (dataSource && !dataSource.isBrowsing() && dataField) {
			const serialized = serializeValue(limitedEmails);
			if (dataSource.getFieldValue(dataField) !== serialized) {
				v1v2Compatibility.handleValueChange(limitedEmails);
				dataSource.setFieldValue(dataField, serialized);
			}
		}

		if (onChangeValue) {
			onChangeValue(limitedEmails);
		}
	};

	const handleRemoveEmail = (index: number) => {
		if (isReadOnly() || disabled) return;
		const newEmails = [...emails];
		newEmails.splice(index, 1);
		handleChange(newEmails);
	};

	const displayError = internalError || contextError;
	const isDark = colorScheme === 'dark';

	return (
		<Input.Wrapper
			label={label}
			description={description}
			error={displayError}
			required={required}
			style={{ width, ...style }}
			className={className}
			size={size}
		>
			<div
				ref={innerRef}
				style={{
					border: `1px solid ${
						displayError
							? theme.colors.red[isDark ? 4 : 6]
							: isDark
								? theme.colors.dark[4]
								: theme.colors.gray[4]
					}`,
					borderRadius: theme.radius.sm,
					padding: '6px 8px',
					minHeight: 36,
					backgroundColor: disabled
						? isDark
							? theme.colors.dark[6]
							: theme.colors.gray[1]
						: isDark
							? theme.colors.dark[6]
							: theme.white,
					opacity: disabled ? 0.6 : 1,
					cursor: disabled || isReadOnly() ? 'not-allowed' : undefined,
				}}
			>
				{isReadOnly() || disabled ? (
					<Group gap={4} style={{ flexWrap: 'wrap' }}>
						{emails.length === 0 && (
							<span
								style={{
									color: isDark ? theme.colors.dark[3] : theme.colors.gray[5],
									fontSize: theme.fontSizes[size ?? 'sm'],
								}}
							>
								{placeholder}
							</span>
						)}
						{emails.map((email, index) => (
							<Badge
								key={`${email}-${index}`}
								variant={isDark ? 'light' : 'outline'}
								size={size ?? 'sm'}
								style={{ textTransform: 'none' }}
							>
								{email}
							</Badge>
						))}
					</Group>
				) : (
					<ReactMultiEmail
						placeholder={placeholder}
						emails={emails}
						onChange={handleChange}
						validateEmail={validateEmail}
						onFocus={onFocusEnter as any}
						onBlur={onFocusExit as any}
						style={{
							border: 'none',
							padding: 0,
							minHeight: 'auto',
							backgroundColor: 'transparent',
						}}
						getLabel={(email, index, removeEmail) => (
							<Badge
								key={`${email}-${index}`}
								variant={isDark ? 'light' : 'outline'}
								size={size ?? 'sm'}
								style={{ textTransform: 'none', marginRight: 4, marginBottom: 2 }}
								rightSection={
									<CloseButton
										size="xs"
										variant="transparent"
										onClick={() => removeEmail(index)}
										tabIndex={-1}
									/>
								}
							>
								{email}
							</Badge>
						)}
					/>
				)}
			</div>
		</Input.Wrapper>
	);
}

ArchbaseMultiEmail.displayName = 'ArchbaseMultiEmail';
