import { Chip, MantineSize } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import type { CSSProperties, FocusEventHandler } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { ArchbaseDataSource, DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames } from '@archbase/data';
import { useArchbaseDidUpdate } from '@archbase/data';
import { useArchbaseV1V2Compatibility } from '@archbase/data';
import { useValidationErrors } from '@archbase/core';

export interface ArchbaseChipProps<T, ID> {
	/** Fonte de dados onde será atribuido o valor do chip (V1 ou V2) */
	dataSource?: IArchbaseDataSourceBase<T>;
	/** Campo onde deverá ser atribuido o valor do chip na fonte de dados */
	dataField?: string;
	/** Indicador se o chip está desabilitado */
	disabled?: boolean;
	/** Indicador se o chip é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
	readOnly?: boolean;
	/** Indicador se o preenchimento do chip é obrigatório */
	required?: boolean;
	/** Estilo do chip */
	style?: CSSProperties;
	/** Chave de theme.radius ou qualquer valor CSS válido para definir border-radius, theme.defaultRadius por padrão */
	radius?: string | number | undefined;
	/** Valor quando o chip estiver true */
	trueValue?: any;
	/** Valor quando o chip estiver false */
	falseValue?: any;
	/** Indicador se o chip está marcado */
	isChecked?: boolean;
	/** Título do chip */
	label?: string;
	/** Largura do chip */
	width?: string | number | undefined;
	/** Valor de tamanho predefinido */
	size?: MantineSize;
	/** Evento quando o foco sai do chip */
	onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o chip recebe o foco */
	onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o valor do chip é alterado */
	onChangeValue?: (value: any) => void;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
	/** Último erro ocorrido no chip */
	error?: string;
}

export function ArchbaseChip<T, ID>({
	dataSource,
	dataField,
	disabled = false,
	readOnly = false,
	required = false,
	style,
	trueValue = true,
	falseValue = false,
	isChecked,
	width,
	label,
	size,
	radius,
	error,
	onFocusExit = () => {},
	onFocusEnter = () => {},
	onChangeValue = () => {},
	innerRef,
}: ArchbaseChipProps<T, ID>) {
	// 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade
	const v1v2Compatibility = useArchbaseV1V2Compatibility<any>(
		'ArchbaseChip',
		dataSource,
		dataField,
		falseValue
	);

	// Contexto de validação (opcional - pode não existir)
	const validationContext = useValidationErrors();

	// Chave única para o field
	const fieldKey = `${dataField}`;

	// Recuperar erro do contexto se existir
	const contextError = validationContext?.getError(fieldKey);

	// 🔄 MIGRAÇÃO V1/V2: Debug info para desenvolvimento
	if (process.env.NODE_ENV === 'development' && dataSource) {
	}
	const [checked, setChecked] = useState<boolean>(isChecked ? true : false);
	const innerComponentRef = innerRef || useRef<any>(null);
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const forceUpdate = useForceUpdate();

	// ✅ CORRIGIDO: Apenas atualizar se o prop error vier definido
	// Não limpar o internalError se o prop error for undefined
	useEffect(() => {
		if (error !== undefined && error !== internalError) {
			setInternalError(error);
		}
	}, [error]);

	const loadDataSourceFieldValue = () => {
		let currentChecked = checked;
		if (dataSource && dataField) {
			const fieldValue = dataSource.getFieldValue(dataField);
			if (fieldValue !== null && fieldValue !== undefined) {
				currentChecked = fieldValue === trueValue;
			}
		}

		setChecked(currentChecked);
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
				event.type === DataSourceEventNames.afterInsert ||
				event.type === DataSourceEventNames.afterEdit
			) {
				loadDataSourceFieldValue();
				// 🔄 MIGRAÇÃO V1/V2: forceUpdate apenas para V1
				if (!v1v2Compatibility.isDataSourceV2) {
					forceUpdate();
				}
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

	useArchbaseDidUpdate(() => {
		loadDataSourceFieldValue();
	}, []);

	const handleChange = (changedChecked) => {
		// ✅ Limpa erro quando usuário edita o campo (tanto do estado local quanto do contexto)
		const hasError = internalError || contextError;
		if (hasError) {
			setInternalError(undefined);
			validationContext?.clearError(fieldKey);
		}

		const resultValue = changedChecked ? trueValue : falseValue;

		setChecked(changedChecked);

		if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== resultValue) {
			// 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
			v1v2Compatibility.handleValueChange(resultValue);
		}

		if (onChangeValue) {
			onChangeValue(resultValue);
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

	const isReadOnly = () => {
		// 🔄 MIGRAÇÃO V1/V2: Usar padrão de compatibilidade para isReadOnly
		return readOnly || v1v2Compatibility.isReadOnly;
	};

	return (
		<Chip
			disabled={disabled}
			readOnly={isReadOnly()}
			required={required}
			style={{ ...style, width }}
			checked={checked}
			ref={innerComponentRef}
			value={checked ? trueValue : falseValue}
			onChange={handleChange}
			onBlur={handleOnFocusExit}
			onFocus={handleOnFocusEnter}
			size={size}
			radius={radius}
		>
			{label}
		</Chip>
	);
}
