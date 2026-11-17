/**
 * ArchbaseQuarterPickerInput — seleção de trimestre (o valor é o primeiro dia do trimestre), integrada ao DataSource (v1/v2).
 * Wrapper sobre o `QuarterPickerInput` do @mantine/dates (9.8+), no modo de valor único.
 * @status beta
 */
import { QuarterPickerInput, type QuarterPickerInputProps } from '@mantine/dates';
import React from 'react';
import type { IArchbaseDataSourceBase } from '@archbase/data';
import { useArchbaseBoundField } from './useArchbaseBoundField';
import { type ArchbaseDateFieldValueType, dateFieldToDateString, dateStringToDateField } from './archbaseDateField';

export interface ArchbaseQuarterPickerInputProps<T, _ID>
	extends Omit<QuarterPickerInputProps<'default'>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'error'> {
	/** Fonte de dados onde será atribuído o valor (V1 ou V2) */
	dataSource?: IArchbaseDataSourceBase<T>;
	/** Campo da fonte de dados. Lê `Date` ou string ISO. */
	dataField?: string;
	/** Formato gravado no DataSource @default 'string' (`YYYY-MM-DD`) */
	valueType?: ArchbaseDateFieldValueType;
	/** Valor controlado (standalone): `Date` ou `YYYY-MM-DD` */
	value?: Date | string | null;
	/** Valor inicial (standalone) */
	defaultValue?: Date | string | null;
	/** Mensagem de erro */
	error?: string;
	/** Chamado ao escolher ou limpar, já no formato de `valueType` */
	onChangeValue?: (value: Date | string | null) => void;
}

export function ArchbaseQuarterPickerInput<T = any, _ID = any>({
	dataSource,
	dataField,
	valueType = 'string',
	value,
	defaultValue,
	error,
	readOnly,
	onChangeValue,
	...props
}: ArchbaseQuarterPickerInputProps<T, _ID>) {
	const field = useArchbaseBoundField<T, string | null>({
		componentName: 'ArchbaseQuarterPickerInput',
		dataSource,
		dataField,
		value: value === undefined ? undefined : dateFieldToDateString(value),
		defaultValue: defaultValue === undefined ? undefined : dateFieldToDateString(defaultValue),
		emptyValue: null,
		error,
		readOnly,
		fromField: dateFieldToDateString,
		toField: (v) => dateStringToDateField(v, valueType),
	});

	return (
		<QuarterPickerInput
			{...props}
			value={field.value}
			onChange={(next) => {
				field.setValue(next);
				onChangeValue?.(dateStringToDateField(next, valueType));
			}}
			error={field.error}
			readOnly={field.readOnly}
		/>
	);
}

ArchbaseQuarterPickerInput.displayName = 'ArchbaseQuarterPickerInput';
