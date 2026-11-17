/**
 * Ligação de um editor a um campo do DataSource (v1/v2) ou a um valor standalone.
 *
 * Concentra o que cada editor repetia: carregar o valor do campo, reagir à navegação e às
 * alterações do DataSource, exibir erros de campo/validação e gravar só quando o DataSource não
 * está em navegação. Mesma lógica do ArchbaseMentionInput, coberta pelos testes dele.
 */
import { useForceUpdate } from '@mantine/hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { DataSourceEvent, IArchbaseDataSourceBase } from '@archbase/data';
import { DataSourceEventNames, useArchbaseV1V2Compatibility } from '@archbase/data';
import { useValidationErrors } from '@archbase/core';

export interface UseArchbaseBoundFieldOptions<T, V> {
	componentName: string;
	dataSource?: IArchbaseDataSourceBase<T>;
	dataField?: string;
	/** Valor controlado (standalone) */
	value?: V;
	/** Valor inicial (standalone) */
	defaultValue?: V;
	/** Valor quando o campo está vazio */
	emptyValue: V;
	/** Erro vindo por prop */
	error?: string;
	readOnly?: boolean;
	/** Converte o valor do campo do DataSource para o formato do editor */
	fromField?: (fieldValue: any) => V;
	/** Converte o valor do editor para o que é gravado no DataSource */
	toField?: (value: V) => any;
}

export function useArchbaseBoundField<T, V>({
	componentName,
	dataSource,
	dataField,
	value: valueProp,
	defaultValue,
	emptyValue,
	error,
	readOnly = false,
	fromField = (v) => v,
	toField = (v) => v,
}: UseArchbaseBoundFieldOptions<T, V>) {
	const compat = useArchbaseV1V2Compatibility<any>(componentName, dataSource, dataField, emptyValue);
	const [currentValue, setCurrentValue] = useState<V>(valueProp ?? defaultValue ?? emptyValue);
	const [internalError, setInternalError] = useState<string | undefined>(error);
	const forceUpdate = useForceUpdate();
	const validationContext = useValidationErrors();
	const fieldKey = `${dataField}`;
	const contextError = validationContext?.getError(fieldKey);

	// Conversores em ref: costumam ser funções inline, e não devem re-registrar listeners.
	const fromFieldRef = useRef(fromField);
	const toFieldRef = useRef(toField);
	fromFieldRef.current = fromField;
	toFieldRef.current = toField;

	useEffect(() => {
		if (error !== undefined && error !== internalError) {
			setInternalError(error);
		}
	}, [error]);

	useEffect(() => {
		if (!dataSource && valueProp !== undefined) {
			setCurrentValue(valueProp);
		}
	}, [valueProp, dataSource]);

	const load = useCallback(() => {
		if (dataSource && dataField) {
			const fieldValue = dataSource.getFieldValue(dataField);
			setCurrentValue(
				fieldValue === undefined || fieldValue === null || fieldValue === ''
					? emptyValue
					: fromFieldRef.current(fieldValue),
			);
		} else {
			setCurrentValue(valueProp ?? defaultValue ?? emptyValue);
		}
	}, [dataSource, dataField]);

	const eventRef = useRef<(event: DataSourceEvent<T>) => void>(() => {});
	eventRef.current = (event: DataSourceEvent<T>) => {
		if (!dataSource || !dataField) return;
		if (
			event.type === DataSourceEventNames.dataChanged ||
			event.type === DataSourceEventNames.recordChanged ||
			event.type === DataSourceEventNames.afterScroll ||
			event.type === DataSourceEventNames.afterCancel ||
			event.type === DataSourceEventNames.afterInsert ||
			event.type === DataSourceEventNames.afterEdit
		) {
			load();
			if (!compat.isDataSourceV2) forceUpdate();
		}
		if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
			setInternalError(event.error);
			validationContext?.setError(fieldKey, event.error);
			if (!compat.isDataSourceV2) forceUpdate();
		}
	};

	useEffect(() => {
		load();
		if (dataSource && dataField) {
			const listener = (event: DataSourceEvent<T>) => eventRef.current(event);
			const fieldListener = () => load();
			const hasFieldListener = typeof (dataSource as any).addFieldChangeListener === 'function';
			dataSource.addListener(listener);
			if (hasFieldListener) (dataSource as any).addFieldChangeListener(dataField, fieldListener);
			return () => {
				dataSource.removeListener(listener);
				if (hasFieldListener) (dataSource as any).removeFieldChangeListener(dataField, fieldListener);
			};
		}
	}, [dataSource, dataField, load]);

	/** Atualiza o editor e, se o DataSource estiver em edição, grava no campo. */
	const setValue = useCallback(
		(newValue: V) => {
			if (internalError || contextError) {
				setInternalError(undefined);
				validationContext?.clearError(fieldKey);
			}
			setCurrentValue(newValue);
			if (dataSource && dataField && !dataSource.isBrowsing()) {
				const fieldValue = toFieldRef.current(newValue);
				if (dataSource.getFieldValue(dataField) !== fieldValue) {
					compat.handleValueChange(fieldValue);
				}
			}
		},
		[dataSource, dataField, internalError, contextError, validationContext, fieldKey, compat],
	);

	return {
		value: currentValue,
		setValue,
		error: internalError || contextError,
		readOnly: readOnly || compat.isReadOnly,
	};
}
