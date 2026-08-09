// @vitest-environment jsdom
/**
 * O que esta suíte protege, nas quatro mudanças pedidas em uso:
 *
 * <ul>
 *   <li><b>voltar</b> — a navegação aqui é lateral (perfil → membro → capacidade → quem alcança), e
 *       sem histórico ver o segundo membro do mesmo perfil obrigava a refazer o caminho desde a
 *       árvore;</li>
 *   <li><b>filtro nas listas</b> — uma pessoa com muitos perfis passa de cem capacidades, e rolar
 *       não é procurar. O filtro precisa ignorar acento e caixa, senão devolve vazio e passa a
 *       impressão de que a capacidade não existe;</li>
 *   <li><b>escolher em vez de digitar</b> na simulação — o nome errado devolve "não pode",
 *       indistinguível de uma negação real de permissão.</li>
 * </ul>
 */
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

const MEMBROS = [
	{
		userId: 'u1',
		name: 'Helena Braga',
		email: 'helena@exemplo.test',
		profileName: 'ATENDIMENTO',
		administrator: false,
		enabled: true,
		total: 6,
		effective: 4,
		inert: 1,
		denied: 1,
	},
	{
		userId: 'u2',
		name: 'Joana Prado',
		email: 'joana@exemplo.test',
		profileName: 'COMERCIAL',
		administrator: false,
		enabled: true,
		total: 3,
		effective: 3,
		inert: 0,
		denied: 0,
	},
];

const CAPACIDADES = [
	{
		resource: 'tms.ordemservico',
		action: 'aprovar_custo',
		grantedByType: 'GROUP',
		grantedByName: 'TIME-SAC',
		situation: 'EFFECTIVE',
	},
	{
		resource: 'financeiro.serviço',
		action: 'ver',
		grantedByType: 'PROFILE',
		grantedByName: 'ATENDIMENTO',
		situation: 'EFFECTIVE',
	},
];

/** Os campos são os que o painel lê de fato — errar um deixa a lista vazia sem acusar. */
const RELATORIO_EFETIVO = {
	userId: 'u1',
	userLabel: 'Helena Braga',
	profileName: 'ATENDIMENTO',
	groupNames: ['TIME-SAC'],
	administrator: false,
	enabled: true,
	granted: 2,
	effective: 2,
	inert: 0,
	denied: 0,
	capabilities: CAPACIDADES,
};

const servico = {
	browse: vi.fn(async (branch: string, opts: any) => {
		if (branch === 'PROFILES') {
			return pagina([{ id: 'p1', kind: 'PROFILE', label: 'ATENDIMENTO', hasChildren: false }]);
		}
		if (branch === 'USERS') {
			return pagina([
				{ id: 'u1', kind: 'USER', label: 'Helena Braga', hasChildren: false },
				{ id: 'u2', kind: 'USER', label: 'Joana Prado', hasChildren: false },
			]);
		}
		if (branch === 'RESOURCES' && opts?.parentId) {
			return pagina([{ id: 'a1', kind: 'ACTION', label: 'aprovar_custo', hasChildren: false }]);
		}
		if (branch === 'RESOURCES') {
			return pagina([{ id: 'r1', kind: 'RESOURCE', label: 'tms.ordemservico', hasChildren: true }]);
		}
		return pagina([]);
	}),
	getProfile: vi.fn(async () => ({
		groupId: 'p1',
		groupName: 'ATENDIMENTO',
		description: 'Perfil de atendimento',
		grants: [],
		members: MEMBROS,
	})),
	getGroup: vi.fn(async () => ({ groupId: 'g1', groupName: 'G', grants: [], members: [] })),
	getEffectiveAccessByUserId: vi.fn(async () => RELATORIO_EFETIVO),
	getEffectiveAccessByEmail: vi.fn(async () => RELATORIO_EFETIVO),
	getOverview: vi.fn(async () => ({ flags: {}, permissionsBySecurityType: {} })),
	getReach: vi.fn(async () => []),
	simulate: vi.fn(async () => ({ allowed: true, chain: [] })),
	getOverviewItems: vi.fn(async () => pagina([])),
};

const pagina = (content: any[]) => ({
	content,
	totalElements: content.length,
	totalPages: 1,
	number: 0,
	size: 50,
});

vi.mock('@archbase/core', async (importOriginal) => ({
	...(await importOriginal<any>()),
	processErrorMessage: (e: any) => String(e),
}));

vi.mock('@archbase/data', async (importOriginal) => ({
	...(await importOriginal<any>()),
	useArchbaseRemoteServiceApi: () => servico,
}));

import { ArchbaseSecurityDiagnosticsView } from '../src/securityDiagnostics/ArchbaseSecurityDiagnosticsView';

const montar = () =>
	render(
		<MantineProvider>
			<ArchbaseSecurityDiagnosticsView />
		</MantineProvider>,
	);

beforeAll(() => {
	// jsdom não traz nenhum dos dois, e o Mantine usa os dois.
	(globalThis as any).ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: (query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: () => {},
			removeEventListener: () => {},
			addListener: () => {},
			removeListener: () => {},
			dispatchEvent: () => false,
		}),
	});
});

beforeEach(() => vi.clearAllMocks());
afterEach(() => cleanup());

/** Abre Perfis na árvore e entra no perfil — o ponto de partida das navegações laterais. */
const entrarNoPerfil = async () => {
	montar();
	fireEvent.click(await screen.findByText('Perfis'));
	fireEvent.click(await screen.findByText('ATENDIMENTO'));
	await screen.findByText('Perfil de atendimento');
};

describe('voltar', () => {
	it('não aparece antes de navegar — não há para onde voltar', () => {
		montar();
		expect(screen.queryByRole('button', { name: /voltar/i })).toBeNull();
	});

	it('volta do membro para o perfil de onde se veio', async () => {
		await entrarNoPerfil();

		fireEvent.click(await screen.findByText('Helena Braga'));
		await screen.findAllByText((_, el) => el?.textContent === 'grupo TIME-SAC');

		fireEvent.click(screen.getByRole('button', { name: /voltar para o item anterior/i }));

		// De volta ao perfil, com os dois membros à vista.
		expect(await screen.findByText('Perfil de atendimento')).toBeTruthy();
		expect(screen.getByText('Joana Prado')).toBeTruthy();
	});

	it('diz para onde volta, para não ser um salto às cegas', async () => {
		await entrarNoPerfil();
		fireEvent.click(await screen.findByText('Helena Braga'));
		expect(await screen.findByText(/para ATENDIMENTO/)).toBeTruthy();
	});
});

describe('filtro das listas', () => {
	it('recorta as capacidades e informa que está escondendo', async () => {
		await entrarNoPerfil();
		fireEvent.click(await screen.findByText('Helena Braga'));
		await screen.findAllByText((_, el) => el?.textContent === 'grupo TIME-SAC');

		fireEvent.change(screen.getByLabelText('Filtrar capacidades'), { target: { value: 'aprovar' } });

		await waitFor(() =>
			expect(screen.queryAllByText((_, el) => el?.textContent === 'perfil ATENDIMENTO')).toHaveLength(0),
		);
		expect(screen.getByText('1 de 2')).toBeTruthy();
	});

	it('acha "serviço" quando se digita "servico" — sem isso o filtro mente', async () => {
		await entrarNoPerfil();
		fireEvent.click(await screen.findByText('Helena Braga'));
		await screen.findAllByText((_, el) => el?.textContent === 'grupo TIME-SAC');

		fireEvent.change(screen.getByLabelText('Filtrar capacidades'), { target: { value: 'FINANCEIRO.SERVICO' } });

		expect(await screen.findAllByText((_, el) => el?.textContent === 'perfil ATENDIMENTO')).not.toHaveLength(0);
	});

	it('filtra os membros de um perfil pelo nome', async () => {
		await entrarNoPerfil();
		fireEvent.change(screen.getByLabelText('Filtrar pessoas'), { target: { value: 'joana' } });

		await waitFor(() => expect(screen.queryByText('Helena Braga')).toBeNull());
		expect(screen.getByText('Joana Prado')).toBeTruthy();
	});
});

describe('simulação por escolha', () => {
	it('o campo de usuário não aceita digitação — escolher é o ponto', async () => {
		montar();
		fireEvent.click(await screen.findByText('Simular acesso'));
		const campo = (await screen.findByLabelText('Usuário')) as HTMLInputElement;
		expect(campo.readOnly).toBe(true);
	});

	it('escolher a pessoa na árvore preenche o campo com o nome', async () => {
		montar();
		fireEvent.click(await screen.findByText('Simular acesso'));
		fireEvent.click(await screen.findByLabelText('Usuário'));

		fireEvent.click(await screen.findByText('Joana Prado'));

		await waitFor(() =>
			expect((screen.getByLabelText('Usuário') as HTMLInputElement).value).toBe('Joana Prado'),
		);
	});

	it('recurso e ação vêm juntos: escolher a ação traz o recurso pai', async () => {
		montar();
		fireEvent.click(await screen.findByText('Simular acesso'));
		fireEvent.click(await screen.findByLabelText('Recurso e ação'));

		// O recurso abre em vez de ser escolhido — simular contra recurso sem ação não é pergunta.
		fireEvent.click(await screen.findByText('tms.ordemservico'));
		fireEvent.click(await screen.findByText('aprovar_custo'));

		await waitFor(() =>
			expect((screen.getByLabelText('Recurso e ação') as HTMLInputElement).value).toBe(
				'tms.ordemservico · aprovar_custo',
			),
		);
	});
});
