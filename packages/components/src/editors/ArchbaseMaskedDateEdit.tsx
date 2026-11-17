/**
 * ArchbaseMaskedDateEdit — data com campos mascarados separados (dia / mês / ano) e calendário,
 * integrada ao DataSource (v1/v2). Wrapper sobre o `MaskedDateInput` do @mantine/dates (9.8+).
 *
 * Alternativa ao ArchbaseDatePickerEdit (input único com react-imask), que continua disponível:
 * este não expõe um `<input>` único, então não tem `innerRef`, `placeholderChar` nem `dateParser`.
 * @status beta
 */
import { MaskedDateInput, type MaskedDateInputProps } from '@mantine/dates';
import React from 'react';
import type { IArchbaseDataSourceBase } from '@archbase/data';
import { useArchbaseBoundField } from './useArchbaseBoundField';
import { type ArchbaseDateFieldValueType, dateFieldToDateString, dateStringToDateField } from './archbaseDateField';

export interface ArchbaseMaskedDateEditProps<T, _ID>
	extends Omit<MaskedDateInputProps, 'value' | 'defaultValue' | 'onChange' | 'error' | 'withTime' | 'withSeconds'> {
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
	/** Chamado quando a data fica completa ou é limpa, já no formato de `valueType` */
	onChangeValue?: (value: Date | string | null) => void;
}

export function ArchbaseMaskedDateEdit<T = any, _ID = any>({
	dataSource,
	dataField,
	valueType = 'string',
	value,
	defaultValue,
	error,
	readOnly,
	onChangeValue,
	...props
}: ArchbaseMaskedDateEditProps<T, _ID>) {
	const field = useArchbaseBoundField<T, string | null>({
		componentName: 'ArchbaseMaskedDateEdit',
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
		<MaskedDateInput
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

ArchbaseMaskedDateEdit.displayName = 'ArchbaseMaskedDateEdit';
