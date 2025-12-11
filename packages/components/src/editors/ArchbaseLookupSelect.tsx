/**
 * ArchbaseLookupSelect — lookup remoto/local com integração a dataSource e campos configuráveis.
 * @status stable
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArchbaseError } from '@archbase/core';
import { ArchbaseObjectHelper } from '@archbase/core';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames, IArchbaseDataSourceBase } from '@archbase/data';
import { useArchbaseDidUpdate } from '@archbase/data';
import { useArchbaseV1V2Compatibility } from '@archbase/data';
import { useForceUpdate } from '@mantine/hooks';
import { useValidationErrors } from '@archbase/core';
import { ArchbaseSelect, ArchbaseSelectProps } from './ArchbaseSelect';

export interface ArchbaseLookupSelectProps<T, ID, O> extends Omit<ArchbaseSelectProps<T, ID, O>, 'getOptionLabel'> {
	lookupDataSource: IArchbaseDataSourceBase<O> | undefined;
	lookupDataFieldText: string | ((record: any) => string);
	lookupDataFieldId: string;
	simpleValue?: boolean;
  }
  

const getTextValue = (lookupDataFieldText: string | ((record: any) => string), record: any) => {
	if (typeof lookupDataFieldText === 'function') {
		return lookupDataFieldText(record);
	} else {
		return ArchbaseObjectHelper.getNestedProperty(record, lookupDataFieldText);
	}
};

function rebuildOptions<_T, O>(
	lookupDataSource: IArchbaseDataSourceBase<O> | undefined,
	lookupDataFieldText: string | ((record: any) => string),
	lookupDataFieldId: string,
): any[] | undefined {
	const options: any[] = [];
	if (lookupDataSource && lookupDataSource.getTotalRecords() > 0) {
		lookupDataSource.browseRecords().map((record: any) => {
			if (lookupDataFieldId && !lookupDataFieldId.includes('.')) {
				if (!record.hasOwnProperty(lookupDataFieldId) || !record[lookupDataFieldId]) {
					throw new ArchbaseError('Foi encontrado um registro sem ID no dataSource passado para o Select.');
				}
				if (typeof lookupDataFieldText !== 'function') {
					if (!record.hasOwnProperty(lookupDataFieldText) || !record[lookupDataFieldText]) {
						throw new ArchbaseError('Foi encontrado um registro sem o texto no dataSource passado para a Select.');
					}
				}
			}

			options.push({
				label: record.label ? record.label : getTextValue(lookupDataFieldText, record),
				disabled: record.disabled,
				value: ArchbaseObjectHelper.getNestedProperty(record, lookupDataFieldId),
				origin: record,
			});
		});
	}

	return options;
}

export function ArchbaseLookupSelect<T, ID, O>({
	lookupDataSource,
	lookupDataFieldText,
	lookupDataFieldId,
	simpleValue,
	children,
	dataSource,
	dataField,
	options,
	error,
	getOptionValue,
	...otherProps
}: ArchbaseLookupSelectProps<T, ID, O>) {
	const forceUpdate = useForceUpdate();

	// 🔄 MIGRAÇÃO V1/V2: Hook de compatibilidade
	const v1v2Compatibility = useArchbaseV1V2Compatibility<any>(
		'ArchbaseLookupSelect',
		dataSource,
		dataField,
		null
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

	const [currentOptions, setCurrentOptions] = useState<any[] | undefined>(() =>
		rebuildOptions(lookupDataSource, lookupDataFieldText, lookupDataFieldId),
	);
	const [internalError, setInternalError] = useState<string | undefined>(error);

	// ✅ CORRIGIDO: Apenas atualizar se o prop error vier definido
	// Não limpar o internalError se o prop error for undefined
	useEffect(() => {
		if (error !== undefined && error !== internalError) {
			setInternalError(error);
		}
	}, [error]);

	const lookupDataSourceEvent = useCallback((event: DataSourceEvent<O>) => {
		if (lookupDataSource) {
			if (
				event.type === DataSourceEventNames.dataChanged ||
				event.type === DataSourceEventNames.fieldChanged ||
				event.type === DataSourceEventNames.recordChanged ||
				event.type === DataSourceEventNames.afterScroll ||
				event.type === DataSourceEventNames.afterCancel
			) {
				if (lookupDataSource) {
					setCurrentOptions(rebuildOptions(lookupDataSource, lookupDataFieldText, lookupDataFieldId));
				}
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
	}, [v1v2Compatibility.isDataSourceV2, lookupDataSource, lookupDataFieldText, lookupDataFieldId, dataField, validationContext, fieldKey]);

	const getDataSourceFieldValue = () => {
		let result = '';
		if (dataSource && dataField) {
			result = dataSource.getFieldValue(dataField);
			if (result && !simpleValue) {
				if (typeof lookupDataFieldText === 'function') {
					result = lookupDataFieldText(dataSource.getCurrentRecord());
				} else {
					result = ArchbaseObjectHelper.getNestedProperty(result, lookupDataFieldId);
				}
			} else if (!result) {
				result = '';
			}
		}
		return result;
	};

	const setDataSourceFieldValue = (value: any) => {
		if (value !== undefined && value !== '' && value !== null) {
			if (
				lookupDataSource &&
				lookupDataFieldId &&
				lookupDataSource.locate({
					[lookupDataFieldId]: ArchbaseObjectHelper.getNestedProperty(value, lookupDataFieldId),
				})
			) {
				if (dataSource && dataField) {
					const newValue = !simpleValue ? lookupDataSource.getCurrentRecord() : getOptionValue(value);
					// 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
					v1v2Compatibility.handleValueChange(newValue);
				}
			}
		} else {
			if (dataSource && dataField) {
				// 🔄 MIGRAÇÃO V1/V2: Usar handleValueChange do padrão de compatibilidade
				v1v2Compatibility.handleValueChange(null);
			}
		}
	};

	// Ref para manter callback sempre atualizado (corrige problema de closure desatualizada)
	const lookupDataSourceEventRef = useRef(lookupDataSourceEvent);
	useEffect(() => {
		lookupDataSourceEventRef.current = lookupDataSourceEvent;
	}, [lookupDataSourceEvent]);

	// Wrapper estável que delega para ref
	const stableLookupDataSourceEvent = useCallback((event: DataSourceEvent<O>) => {
		lookupDataSourceEventRef.current(event);
	}, []);

	// Registrar listeners com cleanup apropriado
	useEffect(() => {
		setCurrentOptions(rebuildOptions(lookupDataSource, lookupDataFieldText, lookupDataFieldId));
		if (lookupDataSource) {
			lookupDataSource.addListener(stableLookupDataSourceEvent);

			return () => {
				lookupDataSource.removeListener(stableLookupDataSourceEvent);
			};
		}
	}, [lookupDataSource, stableLookupDataSourceEvent, lookupDataFieldText, lookupDataFieldId]);

	useArchbaseDidUpdate(() => {
		setCurrentOptions(rebuildOptions(lookupDataSource, lookupDataFieldText, lookupDataFieldId));
	}, []);

	const getOptionLabel=(value: any) =>{
		return value.label ? value.label : getTextValue(lookupDataFieldText, value)
	}

	// Erro a ser exibido: local ou do contexto
	const displayError = internalError || contextError;

	return (
		<ArchbaseSelect
			{...otherProps}
			getOptionLabel={getOptionLabel}
			getOptionValue={getOptionValue}
			dataSource={dataSource}
			dataField={dataField}
			customGetDataSourceFieldValue={getDataSourceFieldValue}
			customSetDataSourceFieldValue={setDataSourceFieldValue}
			options={currentOptions}
			error={displayError}
		>
			{children}
		</ArchbaseSelect>
	);
}
