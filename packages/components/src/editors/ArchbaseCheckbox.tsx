import { Checkbox, MantineSize } from '@mantine/core';
import { useForceUpdate } from '@mantine/hooks';
import type { CSSProperties, FocusEventHandler } from 'react';
import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import type { ArchbaseDataSource, DataSourceEvent } from '@archbase/data';
import { DataSourceEventNames } from '@archbase/data';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '@archbase/data';
import { useArchbaseV1V2Compatibility } from '@archbase/data';
import { useValidationErrors } from '@archbase/core';

export interface ArchbaseCheckboxProps<T, ID> {
	/** Fonte de dados onde será atribuido o valor do checkbox */
	dataSource?: ArchbaseDataSource<T, ID>;
	/** Campo onde deverá ser atribuido o valor do checkbox na fonte de dados */
	dataField?: string;
	/** Indicador se o checkbox está desabilitado */
	disabled?: boolean;
	/** Indicador se o checkbox é somente leitura. Obs: usado em conjunto com o status da fonte de dados */
	readOnly?: boolean;
	/** Indicador se o preenchimento do checkbox é obrigatório */
	required?: boolean;
	/** Estilo do checkbox */
	style?: CSSProperties;
	/** Chave de theme.radius ou qualquer valor CSS válido para definir border-radius, theme.defaultRadius por padrão */
	radius?: string | number | undefined;
	/** Valor quando o checkbox estiver true */
	trueValue?: any;
	/** Valor quando o checkbox estiver false */
	falseValue?: any;
	/** Indicador se o checkbox está marcado */
	isChecked?: boolean;
	/** Título do checkbox */
	label?: ReactNode;
	/** Largura do checkbox */
	width?: string | number | undefined;
	/** Descrição do checkbox */
	description?: string;
	/** Último erro ocorrido no checkbox */
	error?: string;
	/** Valor de tamanho predefinido */
	size?: MantineSize;
	/** Evento quando o foco sai do checkbox */
	onFocusExit?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o checkbox recebe o foco */
	onFocusEnter?: (event: React.FocusEvent<HTMLInputElement>) => void;
	/** Evento quando o valor do checkbox é alterado */
	onChangeValue?: (value: any, event: any) => void;
	/** Referência para o componente interno */
	innerRef?: React.RefObject<HTMLInputElement> | undefined;
}

export function ArchbaseCheckbox<T, ID>({
	dataSource,
	dataField,
	disabled = false,
	readOnly = false,
	required = false,
	style,
	trueValue = true,
	falseValue = false,
	isChecked = false,
	width,
	label,
	description,
	error,
	size,
	radius,
	onFocusExit = () => {},
	onFocusEnter = () => {},
	onChangeValue = () => {},
	innerRef,
}: ArchbaseCheckboxProps<T, ID>) {
	// 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade
	const v1v2Compatibility = useArchbaseV1V2Compatibility<any>(
		'ArchbaseCheckbox',
		dataSource,
		dataField,
		falseValue
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

	const [checked, setChecked] = useState<boolean | undefined>(isChecked);
	const innerComponentRef = useRef<any>(null);
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const forceUpdate = useForceUpdate();

	// ❌ REMOVIDO: Não limpar erro automaticamente quando valor muda
	// O erro deve ser limpo apenas quando o usuário EDITA o campo (no handleChange)
	// useEffect(() => {
	// 	setInternalError(undefined);
	// }, [checked]);

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

	useArchbaseDidMount(() => {
		loadDataSourceFieldValue();
		if (dataSource && dataField) {
			dataSource.addListener(dataSourceEvent);
			dataSource.addFieldChangeListener(dataField, fieldChangedListener);
		}
	});

	useArchbaseWillUnmount(() => {
		if (dataSource && dataField) {
			dataSource.removeListener(dataSourceEvent);
			dataSource.removeFieldChangeListener(dataField, fieldChangedListener);
		}
	});

	useArchbaseDidUpdate(() => {
		loadDataSourceFieldValue();
	}, []);

	const handleChange = (event, isReadOnly) => {
		if (isReadOnly) return

		// ✅ Limpa erro quando usuário edita o campo (tanto do estado local quanto do contexto)
		const hasError = internalError || contextError;
		if (hasError) {
			setInternalError(undefined);
			validationContext?.clearError(fieldKey);
		}

		const changedChecked = event.target.checked;
		const resultValue = changedChecked ? trueValue : falseValue;

		setChecked(changedChecked);

		if (dataSource && !dataSource.isBrowsing() && dataField && dataSource.getFieldValue(dataField) !== resultValue) {
			// 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
			v1v2Compatibility.handleValueChange(resultValue);
		}

		if (onChangeValue) {
			onChangeValue(resultValue, event);
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

	// Erro a ser exibido: local ou do contexto
	const displayError = internalError || contextError;

	return (
		<Checkbox
			disabled={disabled}
			required={required}
			style={{ ...style, width }}
			checked={checked}
			ref={innerRef || innerComponentRef}
			value={checked ? trueValue : falseValue}
			onChange={(event) => handleChange(event, isReadOnly())}
			onBlur={handleOnFocusExit}
			onFocus={handleOnFocusEnter}
			description={description}
			label={label}
			labelPosition="right"
			size={size}
			radius={radius}
			error={displayError}
		/>
	);
}
