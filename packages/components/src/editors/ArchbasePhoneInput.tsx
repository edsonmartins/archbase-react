/**
 * ArchbasePhoneInput — telefone internacional (seletor de país, detecção e máscara) integrado ao
 * DataSource (v1/v2). Wrapper sobre o `PhoneInput` do @mantine/core (9.8+).
 *
 * O valor gravado é o número em formato E.164 cru: `+5511987654321` (com sufixo `x1234` quando
 * `withExtension`). Para telefone brasileiro com máscara fixa e valor formatado, continue usando o
 * ArchbaseMaskEdit com `ArchbaseMaskPattern.PHONE`.
 * @status beta
 */
import { PhoneInput, type PhoneInputChangeDetails, type PhoneInputProps } from '@mantine/core';
import React from 'react';
import type { IArchbaseDataSourceBase } from '@archbase/data';
import { useArchbaseBoundField } from './useArchbaseBoundField';

export interface ArchbasePhoneInputProps<T, _ID>
	extends Omit<PhoneInputProps, 'value' | 'defaultValue' | 'onChange' | 'error'> {
	/** Fonte de dados onde será atribuído o valor (V1 ou V2) */
	dataSource?: IArchbaseDataSourceBase<T>;
	/** Campo da fonte de dados */
	dataField?: string;
	/** Valor controlado (standalone), E.164: `+5511987654321` */
	value?: string;
	/** Valor inicial (standalone) */
	defaultValue?: string;
	/** Mensagem de erro */
	error?: string;
	/** Chamado a cada alteração com o valor E.164 e os detalhes do Mantine (país, valor formatado) */
	onChangeValue?: (value: string, details: PhoneInputChangeDetails) => void;
}

export function ArchbasePhoneInput<T = any, _ID = any>({
	dataSource,
	dataField,
	value,
	defaultValue,
	error,
	readOnly,
	onChangeValue,
	defaultCountry = 'br',
	...props
}: ArchbasePhoneInputProps<T, _ID>) {
	const field = useArchbaseBoundField<T, string>({
		componentName: 'ArchbasePhoneInput',
		dataSource,
		dataField,
		value,
		defaultValue,
		emptyValue: '',
		error,
		readOnly,
		fromField: (v) => String(v),
		toField: (v) => (v === '' ? null : v),
	});

	return (
		<PhoneInput
			{...props}
			defaultCountry={defaultCountry}
			value={field.value}
			onChange={(raw, details) => {
				field.setValue(raw);
				onChangeValue?.(raw, details);
			}}
			error={field.error}
			readOnly={field.readOnly}
		/>
	);
}

ArchbasePhoneInput.displayName = 'ArchbasePhoneInput';
