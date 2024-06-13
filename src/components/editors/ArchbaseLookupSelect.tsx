import React, { useCallback, useState } from 'react';
import { ArchbaseError } from '../core';
import { ArchbaseObjectHelper } from '../core/helper';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '../datasource';
import { useArchbaseDidMount, useArchbaseDidUpdate, useArchbaseWillUnmount } from '../hooks';
import { ArchbaseSelect, ArchbaseSelectProps } from './ArchbaseSelect';

export interface ArchbaseLookupSelectProps<T, ID, O> extends Omit<ArchbaseSelectProps<T, ID, O>, 'getOptionLabel'> {
	lookupDataSource: ArchbaseDataSource<O, ID> | undefined;
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

function rebuildOptions<_T, ID, O>(
	lookupDataSource: ArchbaseDataSource<O, ID> | undefined,
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
	const [currentOptions, setCurrentOptions] = useState<any[] | undefined>(() =>
		rebuildOptions(lookupDataSource, lookupDataFieldText, lookupDataFieldId),
	);
	const [internalError, setInternalError] = useState<string | undefined>(error);

	const lookupDataSourceEvent = (event: DataSourceEvent<O>) => {
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
			}
			if (event.type === DataSourceEventNames.onFieldError && event.fieldName === dataField) {
				setInternalError(event.error);
			}
		}
	};

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
					if (!simpleValue) {
						dataSource.setFieldValue(dataField, lookupDataSource.getCurrentRecord());
					} else {
						dataSource.setFieldValue(dataField, getOptionValue(value));
					}
				}
			}
		} else {
			if (dataSource && dataField) {
				dataSource.setFieldValue(dataField, null);
			}
		}
	};

	useArchbaseDidMount(() => {
		setCurrentOptions(rebuildOptions(lookupDataSource, lookupDataFieldText, lookupDataFieldId));
		if (lookupDataSource) {
			lookupDataSource.addListener(lookupDataSourceEvent);
		}
	});

	useArchbaseDidUpdate(() => {
		setCurrentOptions(rebuildOptions(lookupDataSource, lookupDataFieldText, lookupDataFieldId));
	}, []);

	useArchbaseWillUnmount(() => {
		if (lookupDataSource) {
			lookupDataSource.removeListener(lookupDataSourceEvent);
		}
	});

	const getOptionLabel=(value: any) =>{
		return value.label ? value.label : getTextValue(lookupDataFieldText, value)
	}

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
			error={internalError}
		>
			{children}
		</ArchbaseSelect>
	);
}
