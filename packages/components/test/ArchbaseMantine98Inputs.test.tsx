import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { ArchbaseDataSource } from '@archbase/data';
import { ArchbasePhoneInput } from '../src/editors/ArchbasePhoneInput';
import { ArchbaseMaskedDateEdit } from '../src/editors/ArchbaseMaskedDateEdit';
import { ArchbaseWeekPickerInput } from '../src/editors/ArchbaseWeekPickerInput';
import { ArchbaseQuarterPickerInput } from '../src/editors/ArchbaseQuarterPickerInput';
import { dateFieldToDateString, dateStringToDateField } from '../src/editors/archbaseDateField';

/**
 * Wrappers Archbase (DataSource v1/v2) sobre os inputs novos do Mantine 9.8: PhoneInput,
 * MaskedDateInput, WeekPickerInput e QuarterPickerInput.
 */

interface Registro {
	id: number;
	telefone?: string | null;
	data?: string | Date | null;
}

const wrapper = ({ children }: { children: React.ReactNode }) => <MantineProvider>{children}</MantineProvider>;

function criarDataSource(records: Registro[]) {
	return new ArchbaseDataSource<Registro, number>('registros', {
		records,
		grandTotalRecords: records.length,
		currentPage: 0,
		totalPages: 1,
		pageSize: 10,
	});
}

describe('archbaseDateField', () => {
	it('lê Date, string ISO com hora e vazio', () => {
		expect(dateFieldToDateString(new Date(2024, 4, 15))).toBe('2024-05-15');
		// Só a parte da data: meia-noite UTC não pode virar dia 14 no fuso de Brasília.
		expect(dateFieldToDateString('2024-05-15T00:00:00Z')).toBe('2024-05-15');
		expect(dateFieldToDateString('2024-05-15')).toBe('2024-05-15');
		expect(dateFieldToDateString('')).toBeNull();
		expect(dateFieldToDateString(null)).toBeNull();
		expect(dateFieldToDateString('lixo')).toBeNull();
	});

	it('grava string ou Date local conforme valueType', () => {
		expect(dateStringToDateField('2024-05-15', 'string')).toBe('2024-05-15');
		const d = dateStringToDateField('2024-05-15', 'date') as Date;
		expect([d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()]).toEqual([2024, 4, 15, 0]);
		expect(dateStringToDateField(null, 'date')).toBeNull();
	});
});

describe('ArchbasePhoneInput', () => {
	it('carrega o valor E.164 do DataSource e acompanha a navegação', async () => {
		const ds = criarDataSource([
			{ id: 1, telefone: '+5511987654321' },
			{ id: 2, telefone: null },
		]);
		render(<ArchbasePhoneInput dataSource={ds} dataField="telefone" label="Telefone" />, { wrapper });

		const input = screen.getByLabelText('Telefone') as HTMLInputElement;
		expect(input.value.replace(/\D/g, '')).toBe('5511987654321');

		act(() => {
			ds.next();
		});
		await waitFor(() => expect(input.value.replace(/\D/g, '')).toMatch(/^5?5?$/));
	});

	it('grava E.164 no DataSource em edição e informa o país', async () => {
		const user = userEvent.setup();
		const ds = criarDataSource([{ id: 1, telefone: null }]);
		ds.edit();
		const onChangeValue = vi.fn();
		render(<ArchbasePhoneInput dataSource={ds} dataField="telefone" label="Telefone" onChangeValue={onChangeValue} />, {
			wrapper,
		});

		await user.type(screen.getByLabelText('Telefone'), '11987654321');

		expect(ds.getFieldValue('telefone')).toBe('+5511987654321');
		expect(onChangeValue).toHaveBeenLastCalledWith('+5511987654321', expect.objectContaining({ country: expect.objectContaining({ iso2: 'br' }) }));
	});

	it('não grava com o DataSource em navegação e fica somente leitura', () => {
		const ds = criarDataSource([{ id: 1, telefone: '+5511987654321' }]);
		render(<ArchbasePhoneInput dataSource={ds} dataField="telefone" label="Telefone" />, { wrapper });

		expect(screen.getByLabelText('Telefone')).toHaveAttribute('readonly');
	});

	it('exibe erro de campo vindo do DataSource', async () => {
		const ds = criarDataSource([{ id: 1, telefone: null }]);
		render(<ArchbasePhoneInput dataSource={ds} dataField="telefone" label="Telefone" error="Telefone inválido" />, { wrapper });

		expect(screen.getByText('Telefone inválido')).toBeInTheDocument();
	});
});

describe('ArchbaseMaskedDateEdit', () => {
	const campos = () => ({
		dia: screen.getByLabelText('Day') as HTMLInputElement,
		mes: screen.getByLabelText('Month') as HTMLInputElement,
		ano: screen.getByLabelText('Year') as HTMLInputElement,
	});

	it('carrega Date ou string ISO do DataSource nos campos dia/mês/ano', async () => {
		const ds = criarDataSource([
			{ id: 1, data: new Date(1990, 4, 15) },
			{ id: 2, data: '2024-12-31T00:00:00Z' },
		]);
		render(<ArchbaseMaskedDateEdit dataSource={ds} dataField="data" label="Nascimento" />, { wrapper });

		expect([campos().dia.value, campos().mes.value, campos().ano.value]).toEqual(['15', '05', '1990']);

		act(() => {
			ds.next();
		});
		await waitFor(() => expect([campos().dia.value, campos().mes.value, campos().ano.value]).toEqual(['31', '12', '2024']));
	});

	it('digitar a data completa grava `YYYY-MM-DD` (valueType string, padrão)', async () => {
		const user = userEvent.setup();
		const ds = criarDataSource([{ id: 1, data: null }]);
		ds.edit();
		const onChangeValue = vi.fn();
		render(<ArchbaseMaskedDateEdit dataSource={ds} dataField="data" label="Nascimento" onChangeValue={onChangeValue} />, {
			wrapper,
		});

		await user.click(campos().dia);
		await user.keyboard('15051990');

		await waitFor(() => expect(ds.getFieldValue('data')).toBe('1990-05-15'));
		expect(onChangeValue).toHaveBeenLastCalledWith('1990-05-15');
	});

	it('valueType="date" grava Date local', async () => {
		const user = userEvent.setup();
		const ds = criarDataSource([{ id: 1, data: null }]);
		ds.edit();
		render(<ArchbaseMaskedDateEdit dataSource={ds} dataField="data" label="Nascimento" valueType="date" />, { wrapper });

		await user.click(campos().dia);
		await user.keyboard('15051990');

		await waitFor(() => expect(ds.getFieldValue('data')).toBeInstanceOf(Date));
		const d = ds.getFieldValue('data') as Date;
		expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([1990, 4, 15]);
	});

	it('data incompleta não grava no DataSource', async () => {
		const user = userEvent.setup();
		const ds = criarDataSource([{ id: 1, data: null }]);
		ds.edit();
		const onChangeValue = vi.fn();
		render(<ArchbaseMaskedDateEdit dataSource={ds} dataField="data" label="Nascimento" onChangeValue={onChangeValue} />, {
			wrapper,
		});

		await user.click(campos().dia);
		await user.keyboard('1505');

		expect(ds.getFieldValue('data')).toBeNull();
		// Enquanto incompleta, a data continua null: nenhuma mudança a notificar.
		expect(onChangeValue).not.toHaveBeenCalled();
		// e os campos digitados não são apagados pelo valor controlado null
		expect([campos().dia.value, campos().mes.value]).toEqual(['15', '05']);
	});

	it('standalone: value controlado aceita Date', () => {
		render(<ArchbaseMaskedDateEdit label="Data" value={new Date(2020, 0, 2)} />, { wrapper });
		expect([campos().dia.value, campos().mes.value, campos().ano.value]).toEqual(['02', '01', '2020']);
	});
});

describe.each([
	['ArchbaseWeekPickerInput', ArchbaseWeekPickerInput],
	['ArchbaseQuarterPickerInput', ArchbaseQuarterPickerInput],
] as const)('%s', (_nome, Componente) => {
	it('carrega o valor do DataSource e o exibe no botão', () => {
		const ds = criarDataSource([{ id: 1, data: '2024-04-01' }]);
		render(<Componente dataSource={ds} dataField="data" label="Período" valueFormat="DD/MM/YYYY" />, { wrapper });

		expect(screen.getByRole('button', { name: /Período/ })).toHaveTextContent('01/04/2024');
	});

	it('escolher no dropdown grava no DataSource em edição', async () => {
		const user = userEvent.setup();
		const ds = criarDataSource([{ id: 1, data: '2024-04-01' }]);
		ds.edit();
		const onChangeValue = vi.fn();
		render(<Componente dataSource={ds} dataField="data" label="Período" onChangeValue={onChangeValue} />, { wrapper });

		await user.click(screen.getByRole('button', { name: /Período/ }));
		// Uma opção qualquer diferente da atual: o valor gravado deve ser uma data `YYYY-MM-DD`.
		const opcoes = await waitFor(() => {
			const botoes = Array.from(document.querySelectorAll<HTMLButtonElement>('table button:not([data-selected]):not([disabled])'));
			expect(botoes.length).toBeGreaterThan(0);
			return botoes;
		});
		await user.click(opcoes[opcoes.length - 1]);

		await waitFor(() => expect(onChangeValue).toHaveBeenCalled());
		const gravado = ds.getFieldValue('data');
		expect(gravado).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		expect(gravado).not.toBe('2024-04-01');
		expect(onChangeValue).toHaveBeenLastCalledWith(gravado);
	});

	it('com o DataSource em navegação fica somente leitura', () => {
		const ds = criarDataSource([{ id: 1, data: '2024-04-01' }]);
		render(<Componente dataSource={ds} dataField="data" label="Período" />, { wrapper });

		expect(screen.getByRole('button', { name: /Período/ })).toHaveAttribute('data-read-only', 'true');
	});
});
