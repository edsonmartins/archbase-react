import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider, getMentions } from '@mantine/core';
import { ArchbaseDataSource } from '@archbase/data';
import { ARCHBASE_MENTION_DEFAULT_MARKUP, ArchbaseMentionInput } from '../src/editors/ArchbaseMentionInput';

/**
 * Testes de caracterização do ArchbaseMentionInput.
 *
 * Escritos contra a implementação antiga (react-mentions) e mantidos na troca para o Mentions do
 * Mantine 9.8: o que eles fixam é o contrato público — sobretudo o FORMATO DO VALOR gravado no
 * DataSource, `[Nome](id)` sem o caractere gatilho. Há textos já persistidos nesse formato; se ele
 * mudar, as menções antigas deixam de ser reconhecidas.
 */

interface Nota {
	id: number;
	texto: string;
}

const usuarios = [
	{ id: '1', display: 'Maria Souza' },
	{ id: '2', display: 'Mario Lima' },
	{ id: '3', display: 'Joana Reis' },
];

const wrapper = ({ children }: { children: React.ReactNode }) => <MantineProvider>{children}</MantineProvider>;

function criarDataSource(texto: string) {
	const ds = new ArchbaseDataSource<Nota, number>('notas', {
		records: [{ id: 1, texto }],
		grandTotalRecords: 1,
		currentPage: 0,
		totalPages: 1,
		pageSize: 10,
	});
	return ds;
}

/** Controle editável. Textarea tem papel textbox; o input de linha única expõe papel combobox. */
const campo = () => (screen.queryByRole('textbox') ?? screen.getByRole('combobox')) as HTMLTextAreaElement | HTMLInputElement;

/** Opção de sugestão pelo texto. O nome acessível não serve (o texto pode vir quebrado em vários nós), e `hidden` cobre o dropdown em portal ainda em transição. */
const opcoes = (nome: string) => screen.queryAllByRole('option', { hidden: true }).filter((el) => el.textContent?.includes(nome));
const acharOpcao = async (nome: string) => {
	let achada: HTMLElement | undefined;
	await waitFor(() => {
		achada = opcoes(nome)[0];
		expect(achada).toBeTruthy();
	});
	return achada!;
};

describe('ArchbaseMentionInput', () => {
	it('exibe o texto visível (sem markup) de um valor gravado com menção', () => {
		const ds = criarDataSource('Olá [Maria Souza](1), tudo bem?');
		render(
			<ArchbaseMentionInput<Nota, number>
				dataSource={ds}
				dataField="texto"
				label="Comentário"
				mentions={[{ trigger: '@', data: usuarios }]}
			/>,
			{ wrapper },
		);

		expect(screen.getByText('Comentário')).toBeInTheDocument();
		expect(campo()).toHaveValue('Olá Maria Souza, tudo bem?');
	});

	it('acompanha a navegação do DataSource', async () => {
		const ds = new ArchbaseDataSource<Nota, number>('notas', {
			records: [
				{ id: 1, texto: 'primeira' },
				{ id: 2, texto: 'segunda com [Joana Reis](3)' },
			],
			grandTotalRecords: 2,
			currentPage: 0,
			totalPages: 1,
			pageSize: 10,
		});
		render(
			<ArchbaseMentionInput<Nota, number> dataSource={ds} dataField="texto" mentions={[{ trigger: '@', data: usuarios }]} />,
			{ wrapper },
		);

		expect(campo()).toHaveValue('primeira');
		act(() => {
			ds.next();
		});
		await waitFor(() => expect(campo()).toHaveValue('segunda com Joana Reis'));
	});

	it('digitação grava no DataSource em edição e chama onChangeValue(valor, {target:{value}})', async () => {
		const user = userEvent.setup();
		const ds = criarDataSource('');
		ds.edit();
		const onChangeValue = vi.fn();
		render(
			<ArchbaseMentionInput<Nota, number>
				dataSource={ds}
				dataField="texto"
				onChangeValue={onChangeValue}
				mentions={[{ trigger: '@', data: usuarios }]}
			/>,
			{ wrapper },
		);

		await user.click(campo());
		await user.type(campo(), 'oi');

		expect(ds.getFieldValue('texto')).toBe('oi');
		expect(onChangeValue).toHaveBeenLastCalledWith('oi', expect.objectContaining({ target: { value: 'oi' } }));
	});

	it('não grava no DataSource quando ele está em navegação (browsing)', async () => {
		const user = userEvent.setup();
		const ds = criarDataSource('original');
		render(
			<ArchbaseMentionInput<Nota, number> dataSource={ds} dataField="texto" mentions={[{ trigger: '@', data: usuarios }]} />,
			{ wrapper },
		);

		await user.click(campo());
		await user.type(campo(), 'x');

		expect(ds.getFieldValue('texto')).toBe('original');
	});

	it('ao escolher uma sugestão grava `[Nome](id)` — formato legado, sem o gatilho', async () => {
		const user = userEvent.setup();
		const ds = criarDataSource('');
		ds.edit();
		render(
			<ArchbaseMentionInput<Nota, number> dataSource={ds} dataField="texto" mentions={[{ trigger: '@', data: usuarios }]} />,
			{ wrapper },
		);

		await user.click(campo());
		await user.type(campo(), 'Olá @Jo');
		const opcao = await acharOpcao('Joana Reis');
		await user.click(opcao);

		await waitFor(() => expect(ds.getFieldValue('texto')).toBe('Olá [Joana Reis](3)'));
	});

	it('aceita `data` como função com callback (assinatura pública existente)', async () => {
		const user = userEvent.setup();
		const buscar = vi.fn((search: string, callback: (d: Array<{ id: string; display: string }>) => void) => {
			setTimeout(() => callback(usuarios.filter((u) => u.display.toLowerCase().includes(search.toLowerCase()))), 0);
		});
		render(<ArchbaseMentionInput<Nota, number> mentions={[{ trigger: '@', data: buscar }]} />, { wrapper });

		await user.click(campo());
		await user.type(campo(), '@Mar');

		expect(await acharOpcao('Maria Souza')).toBeInTheDocument();
		expect(opcoes('Mario Lima')[0]).toBeInTheDocument();
		expect(opcoes('Joana Reis')).toHaveLength(0);
		expect(buscar).toHaveBeenCalledWith('Mar', expect.any(Function));
	});

	it('respeita markup customizado por gatilho', async () => {
		const user = userEvent.setup();
		const onChangeValue = vi.fn();
		render(
			<ArchbaseMentionInput<Nota, number>
				onChangeValue={onChangeValue}
				mentions={[{ trigger: '#', data: [{ id: 'urgente', display: 'urgente' }], markup: '#{__id__}' }]}
			/>,
			{ wrapper },
		);

		await user.click(campo());
		await user.type(campo(), '#urg');
		await user.click(await acharOpcao('urgente'));

		await waitFor(() => expect(onChangeValue).toHaveBeenLastCalledWith('#{urgente}', expect.anything()));
	});

	it('modo standalone: value controlado', () => {
		const { rerender } = render(<ArchbaseMentionInput value="a [Mario Lima](2)" mentions={[{ trigger: '@', data: usuarios }]} />, {
			wrapper,
		});
		expect(campo()).toHaveValue('a Mario Lima');

		rerender(<ArchbaseMentionInput value="b" mentions={[{ trigger: '@', data: usuarios }]} />);
		expect(campo()).toHaveValue('b');
	});

	it('singleLine renderiza um input em vez de textarea', () => {
		render(<ArchbaseMentionInput singleLine value="x" mentions={[{ trigger: '@', data: usuarios }]} />, { wrapper });
		expect(campo().tagName).toBe('INPUT');
	});

	it('readOnly e disabled chegam ao controle', () => {
		const { unmount } = render(<ArchbaseMentionInput readOnly value="x" mentions={[{ trigger: '@', data: usuarios }]} />, { wrapper });
		expect(campo()).toHaveAttribute('readonly');
		unmount();

		render(<ArchbaseMentionInput disabled value="x" mentions={[{ trigger: '@', data: usuarios }]} />, { wrapper });
		expect(campo()).toBeDisabled();
	});

	it('exibe o erro recebido por prop', () => {
		render(<ArchbaseMentionInput error="Campo obrigatório" value="" mentions={[{ trigger: '@', data: usuarios }]} />, { wrapper });
		expect(screen.getByText('Campo obrigatório')).toBeInTheDocument();
	});

	it('innerRef aponta para o elemento editável', () => {
		const ref = React.createRef<HTMLTextAreaElement>();
		render(<ArchbaseMentionInput innerRef={ref} value="x" mentions={[{ trigger: '@', data: usuarios }]} />, { wrapper });
		expect(ref.current).toBe(campo());
	});

	it('getMentions do Mantine extrai menções gravadas no formato legado (exemplo da documentação)', () => {
		const ocorrencias = getMentions('Olá [Maria Souza](1) e [Joana Reis](3)', [
			{ trigger: '@', markup: ARCHBASE_MENTION_DEFAULT_MARKUP },
		]);
		expect(ocorrencias.map((m) => [m.id, m.display])).toEqual([
			['1', 'Maria Souza'],
			['3', 'Joana Reis'],
		]);
	});
});
