/**
 * ArchbaseTagInput — editor de tags integrado ao DataSource (v1/v2) com suporte a validacao e estado controlado.
 * Utiliza o componente TagsInput do Mantine internamente.
 * @status stable
 */
import { MantineSize, TagsInput } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames, useArchbaseDidUpdate, useArchbaseV1V2Compatibility } from '@archbase/data';
import { useValidationErrors } from '@archbase/core';

export interface ArchbaseTagInputProps<T, ID> {
	/** Fonte de dados onde sera atribuido o valor das tags (V1 ou V2) */
	dataSource?: IArchbaseDataSourceBase<T>;
	/** Campo onde devera ser atribuido o valor das tags na fonte de dados */
	dataField?: string;
	/** Valor controlado (array de strings) quando usado sem dataSource */
	value?: string[];
	/** Valor padrao inicial (array de strings) */
	defaultValue?: string[];
	/** Delimitador usado para serializar/deserializar quando o campo no dataSource e uma string. Padrao: ',' */
	delimiter?: string;
	/** Titulo do campo */
	label?: string;
	/** Descricao do campo */
	description?: string;
	/** Ultimo erro ocorrido no campo */
	error?: string;
	/** Texto sugestao do campo */
	placeholder?: string;
	/** Indicador se o preenchimento e obrigatorio */
	required?: boolean;
	/** Indicador se o campo esta desabilitado */
	disabled?: boolean;
	/** Indicador se o campo e somente leitura. Obs: usado em conjunto com o status da fonte de dados */
	readOnly?: boolean;
	/** Lista de caracteres que, ao serem digitados, criam uma nova tag. Ex: [',', ' ', 'Enter'] */
	separators?: string[];
	/** Numero maximo de tags permitidas */
	maxTags?: number;
	/** Permite tags duplicadas */
	allowDuplicates?: boolean;
	/** Evento quando o valor das tags e alterado */
	onChangeValue?: (value: string[], event?: any) => void;
	/** Evento quando o campo recebe o foco */
	onFocusEnter?: FocusEventHandler<HTMLInputElement>;
	/** Evento quando o foco sai do campo */
	onFocusExit?: FocusEventHandler<HTMLInputElement>;
	/** Referencia para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement>;
	/** Estilo do campo */
	style?: CSSProperties;
	/** Classe CSS adicional */
	className?: string;
	/** Largura do campo */
	width?: string | number;
	/** Tamanho do campo (Mantine size) */
	size?: MantineSize;
}

export function ArchbaseTagInput<T, ID>({
	dataSource,
	dataField,
	value: valueProp,
	defaultValue,
	delimiter = ',',
	label,
	description,
	error,
	placeholder,
	required = false,
	disabled = false,
	readOnly = false,
	separators,
	maxTags,
	allowDuplicates = false,
	onChangeValue = () => {},
	onFocusEnter = () => {},
	onFocusExit = () => {},
	innerRef,
	style,
	className,
	width,
	size,
}: ArchbaseTagInputProps<T, ID>) {
	// Hook de compatibilidade V1/V2
	const v1v2Compatibility = useArchbaseV1V2Compatibility<string[]>(
		'ArchbaseTagInput',
		dataSource,
		dataField,
		[],
	);

	const [tags, setTags] = useState<string[]>(valueProp || defaultValue || []);
	const innerComponentRef = useRef<any>(null);
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const forceUpdate = useForceUpdate();
	/** Guarda se o valor original no dataSource e uma string (para serializar de volta) */
	const originalIsStringRef = useRef<boolean>(false);

	// Contexto de validacao (opcional - pode nao existir)
	const validationContext = useValidationErrors();

	// Chave unica para o field
	const fieldKey = `${dataField}`;

	// Recuperar erro do contexto se existir
	const contextError = validationContext?.getError(fieldKey);

	// Atualizar erro externo
	useEffect(() => {
		if (error !== undefined && error !== internalError) {
			setInternalError(error);
		}
	}, [error]);

	/**
	 * Converte o valor bruto do campo do dataSource em um array de strings.
	 * Se o valor for uma string, faz split pelo delimiter.
	 * Se for um array, usa diretamente.
	 */
	const parseFieldValue = (raw: any): string[] => {
		if (raw === null || raw === undefined || raw === '') {
			return [];
		}
		if (Array.isArray(raw)) {
			originalIsStringRef.current = false;
			return raw.map(String);
		}
		if (typeof raw === 'string') {
			originalIsStringRef.current = true;
			return raw
				.split(delimiter)
				.map((s) => s.trim())
				.filter((s) => s.length > 0);
		}
		return [];
	};

	/**
	 * Serializa o array de tags de volta para o formato original do campo no dataSource.
	 * Se o campo original era string, junta pelo delimiter; se era array, mantem como array.
	 */
	const serializeValue = (tagsArray: string[]): string | string[] => {
		if (originalIsStringRef.current) {
			return tagsArray.join(delimiter);
		}
		return tagsArray;
	};

	const loadDataSourceFieldValue = () => {
		let initialValue: string[] = valueProp || defaultValue || [];

		if (dataSource && dataField) {
			const raw = dataSource.getFieldValue(dataField);
			initialValue = parseFieldValue(raw);
		}

		setTags(initialValue);
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
					event.type === DataSourceEventNames.afterEdit ||
					event.type === DataSourceEventNames.afterInsert
				) {
					loadDataSourceFieldValue();
					if (!v1v2Compatibility.isDataSourceV2) {
						forceUpdate();
					}
				}

				// Limpa erros em eventos de edicao/cancelamento
				if (
					event.type === DataSourceEventNames.afterEdit ||
					event.type === DataSourceEventNames.afterInsert ||
					event.type === DataSourceEventNames.afterCancel
				) {
					setInternalError(undefined);
					validationContext?.clearError(fieldKey);
				}

				if (
					event.type === DataSourceEventNames.onFieldError &&
					event.fieldName === dataField
				) {
					setInternalError(event.error);
					validationContext?.setError(fieldKey, event.error);
					if (!v1v2Compatibility.isDataSourceV2) {
						forceUpdate();
					}
				}
			}
		},
		[
			v1v2Compatibility.isDataSourceV2,
			dataSource,
			dataField,
			loadDataSourceFieldValue,
			forceUpdate,
			validationContext,
			fieldKey,
		],
	);

	// Ref para manter callback sempre atualizado (corrige problema de closure desatualizada)
	const dataSourceEventRef = useRef(dataSourceEvent);
	useEffect(() => {
		dataSourceEventRef.current = dataSourceEvent;
	}, [dataSourceEvent]);

	// Wrapper estavel que delega para ref - nunca muda, entao o listener permanece consistente
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
					(dataSource as any).removeFieldChangeListener(
						dataField,
						fieldChangedListener,
					);
				}
			};
		}
	}, [dataSource, dataField, stableDataSourceEvent, fieldChangedListener]);

	useArchbaseDidUpdate(() => {
		loadDataSourceFieldValue();
	}, []);

	const handleChange = (newTags: string[]) => {
		// Limpa erro quando usuario edita o campo
		const hasError = internalError || contextError;
		if (hasError) {
			setInternalError(undefined);
			validationContext?.clearError(fieldKey);
		}

		setTags(newTags);

		if (
			dataSource &&
			!dataSource.isBrowsing() &&
			dataField
		) {
			const serialized = serializeValue(newTags);
			v1v2Compatibility.handleValueChange(serialized as any);
		}

		if (onChangeValue) {
			onChangeValue(newTags);
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

	return (
		<TagsInput
			value={tags}
			onChange={handleChange}
			label={label}
			description={description}
			error={displayError}
			placeholder={placeholder}
			required={required}
			disabled={disabled}
			readOnly={isReadOnly()}
			size={size}
			className={className}
			maxTags={maxTags}
			allowDuplicates={allowDuplicates}
			splitChars={separators}
			ref={innerRef || innerComponentRef}
			onFocus={handleOnFocusEnter}
			onBlur={handleOnFocusExit}
			style={{
				width,
				...style,
			}}
		/>
	);
}

ArchbaseTagInput.displayName = 'ArchbaseTagInput';
