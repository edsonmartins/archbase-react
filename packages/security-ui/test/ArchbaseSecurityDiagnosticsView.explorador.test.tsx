// @vitest-environment jsdom
/**
 * O explorador de segurança: navegação em árvore com carregamento por demanda.
 *
 * <p><b>O que estes testes protegem.</b> A tela deixou de ser três abas paralelas e virou um
 * diretório navegável. As propriedades que importam não são visuais — são de comportamento, e
 * silenciosas quando quebram:
 *
 * <ul>
 *   <li>a árvore <b>não carrega nada</b> antes de o ramo ser aberto. Um tenant real tem centenas de
 *       recursos, e uma regressão que carregue tudo no primeiro render não aparece em
 *       desenvolvimento — aparece em produção, travando o navegador;</li>
 *   <li>a busca vai para o <b>servidor</b>. Filtrar no cliente exigiria ter carregado tudo antes,
 *       que é o problema que a paginação existe para evitar;</li>
 *   <li>navegar pela árvore <b>alimenta a simulação</b>. É o que substitui digitar o nome do
 *       recurso de cabeça — a origem do falso negativo, porque errar uma letra devolve "não pode",
 *       indistinguível de uma negação real;</li>
 *   <li>os <b>slots</b> continuam alcançáveis. Ao trocar a navegação, é fácil deixar um ponto de
 *       inserção pendurado sem que nada acuse.</li>
 * </ul>
 */
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

// ─────────────────────────── dublês ───────────────────────────

const servico = {
	browse: vi.fn(async (_branch: string, _opts: any) => ({
		content: [],
		totalElements: 0,
		totalPages: 1,
		number: 0,
		size: 50,
	})),
	getOverview: vi.fn(async () => ({
		users: 0,
		administrators: 0,
		groups: 0,
		profiles: 0,
		resources: 0,
		apiResources: 0,
		apiResourcesInactive: 0,
		resourcesWithoutAction: 0,
		actions: 0,
		actionsInactive: 0,
		actionsWithoutPermission: 0,
		permissions: 0,
		permissionsPointingToInactive: 0,
		permissionsBySecurityType: {},
		flags: {
			requireActive: false,
			scanConfigured: false,
			adminEndpointsPolicy: 'permit',
			requireRoleNoResolverPolicy: 'permit',
			roleResolverRegistered: false,
		},
	})),
	getGroup: vi.fn(async () => ({
		groupId: 'g1',
		groupName: 'TIME-SAC',
		description: 'Atendimento',
		grants: [{ resource: 'ticket.kanban', action: 'view', situation: 'EFFECTIVE' }],
		members: [
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
		],
	})),
	getProfile: vi.fn(async () => ({
		groupId: 'p1',
		groupName: 'ATENDIMENTO',
		grants: [],
		members: [],
	})),
	getReach: vi.fn(async () => [
		{
			userId: 'u1',
			userName: 'Helena Braga',
			email: 'helena@exemplo.test',
			via: 'grupo TIME-SAC',
			kind: 'GRUPO',
			situation: 'EFFECTIVE',
		},
		{
			userId: 'u9',
			userName: 'Ana Ribeiro',
			email: 'ana@exemplo.test',
			via: 'administrador',
			kind: 'ADMINISTRADOR',
			situation: 'EFFECTIVE',
		},
	]),
	getEffectiveAccessByUserId: vi.fn(async () => ({
		userId: 'u1',
		label: 'Helena Braga',
		profileName: 'ATENDIMENTO',
		groupNames: [],
		administrator: false,
		enabled: true,
		total: 0,
		effective: 0,
		inert: 0,
		denied: 0,
		capabilities: [],
	})),
	getEffectiveAccessByEmail: vi.fn(),
	getOverviewItems: vi.fn(async () => ({ content: [], totalElements: 0, totalPages: 1, number: 0, size: 25 })),
	simulate: vi.fn(),
};

vi.mock('@archbase/core', async (importOriginal) => ({
	...(await importOriginal<any>()),
	processErrorMessage: (e: any) => String(e),
}));

vi.mock('@archbase/data', async (importOriginal) => ({
	...(await importOriginal<any>()),
	useArchbaseRemoteServiceApi: () => servico,
}));

import { ArchbaseSecurityDiagnosticsView } from '../src/securityDiagnostics/ArchbaseSecurityDiagnosticsView';

const montar = (props: any = {}) =>
	render(
		<MantineProvider>
			<ArchbaseSecurityDiagnosticsView {...props} />
		</MantineProvider>,
	);

/** Um nó de árvore, para o browse devolver conforme o ramo pedido. */
const no = (over: any) => ({
	id: 'x',
	kind: 'USER',
	label: 'x',
	badge: null,
	hasChildren: false,
	severity: null,
	...over,
});

// O jsdom não implementa nem matchMedia (que o MantineProvider consulta no primeiro render) nem
// ResizeObserver (que o ScrollArea da árvore usa). Sem os dois, a montagem falha antes de qualquer
// asserção — e o erro não diz nada sobre o componente sendo testado.
beforeAll(() => {
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
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			addListener: vi.fn(),
			removeListener: vi.fn(),
			dispatchEvent: vi.fn(),
		}),
	});
});

beforeEach(() => {
	vi.clearAllMocks();
	servico.browse.mockImplementation(async () => ({
		content: [],
		totalElements: 0,
		totalPages: 1,
		number: 0,
		size: 50,
	}));
});

afterEach(() => cleanup());

describe('carregamento por demanda', () => {
	it('não busca ramo nenhum antes de alguém abrir', async () => {
		montar();
		// A tela abre no Panorama, que faz a própria consulta. A ÁRVORE, não: um tenant real tem
		// centenas de recursos, e carregar tudo no primeiro render trava o navegador.
		await waitFor(() => expect(servico.getOverview).toHaveBeenCalled());
		expect(servico.browse).not.toHaveBeenCalled();
	});

	it('busca só o ramo aberto, e uma vez só', async () => {
		servico.browse.mockImplementation(async (branch: string) => ({
			content: branch === 'USERS' ? [no({ id: 'u1', label: 'Helena Braga' })] : [],
			totalElements: branch === 'USERS' ? 1 : 0,
			totalPages: 1,
			number: 0,
			size: 50,
		}));

		montar();
		fireEvent.click(screen.getByText('Pessoas'));

		await waitFor(() => expect(screen.getByText('Helena Braga')).toBeTruthy());

		const ramosPedidos = servico.browse.mock.calls.map((c: any[]) => c[0]);
		expect(ramosPedidos).toEqual(['USERS']);
	});

	it('a busca vai para o servidor, não filtra em memória', async () => {
		montar();
		fireEvent.change(screen.getByLabelText('Buscar na árvore'), { target: { value: 'ana' } });

		// Sem isto, filtrar exigiria ter carregado tudo antes — o problema que a paginação evita.
		await waitFor(
			() => {
				const comFiltro = servico.browse.mock.calls.filter((c: any[]) => c[1]?.q === 'ana');
				expect(comFiltro.length).toBeGreaterThan(0);
			},
			{ timeout: 2000 },
		);
	});
});

describe('navegação entre objetos', () => {
	it('abrir um grupo mostra os membros com o total de cada um', async () => {
		servico.browse.mockImplementation(async (branch: string) => ({
			content: branch === 'GROUPS' ? [no({ id: 'g1', kind: 'GROUP', label: 'TIME-SAC', hasChildren: true })] : [],
			totalElements: branch === 'GROUPS' ? 1 : 0,
			totalPages: 1,
			number: 0,
			size: 50,
		}));

		montar();
		fireEvent.click(screen.getByText('Grupos'));
		await waitFor(() => expect(screen.getAllByText('TIME-SAC').length).toBeGreaterThan(0));

		fireEvent.click(screen.getAllByText('TIME-SAC')[0]);

		await waitFor(() => expect(servico.getGroup).toHaveBeenCalledWith('g1'));
		// O total do membro (6) não é o do grupo (1 concessão): ele soma perfil e outras vias.
		await waitFor(() => expect(screen.getByText('Helena Braga')).toBeTruthy());
		expect(screen.getByText('6')).toBeTruthy();
	});

	it('a consulta reversa marca quem alcança pelo atalho de administrador', async () => {
		servico.browse.mockImplementation(async (branch: string, opts: any) => {
			if (branch === 'RESOURCES') {
				return {
					content: [no({ id: 'r1', kind: 'RESOURCE', label: 'tms.ordemservico', hasChildren: true })],
					totalElements: 1,
					totalPages: 1,
					number: 0,
					size: 50,
				};
			}
			if (branch === 'ACTIONS_OF_RESOURCE' && opts?.parentId === 'r1') {
				return {
					content: [no({ id: 'a1', kind: 'ACTION', label: 'aprovar_custo' })],
					totalElements: 1,
					totalPages: 1,
					number: 0,
					size: 50,
				};
			}
			return { content: [], totalElements: 0, totalPages: 1, number: 0, size: 50 };
		});

		montar();
		fireEvent.click(screen.getByText('Recursos'));
		await waitFor(() => expect(screen.getByText('tms.ordemservico')).toBeTruthy());

		fireEvent.click(screen.getByText('tms.ordemservico'));
		await waitFor(() => expect(screen.getByText('aprovar_custo')).toBeTruthy());

		fireEvent.click(screen.getByText('aprovar_custo'));
		await waitFor(() => expect(servico.getReach).toHaveBeenCalledWith('a1'));

		// Administrador alcança sem concessão nenhuma. Omiti-lo daria a resposta errada para a
		// pergunta "quem pode" — justamente na conta que mais importa numa auditoria.
		await waitFor(() => expect(screen.getByText('Ana Ribeiro')).toBeTruthy());
		expect(screen.getByText('atalho')).toBeTruthy();
	});

	it('clicar numa pessoa carrega o efetivo dela sem passar pela caixa de busca', async () => {
		servico.browse.mockImplementation(async (branch: string) => ({
			content: branch === 'USERS' ? [no({ id: 'u1', label: 'Helena Braga' })] : [],
			totalElements: branch === 'USERS' ? 1 : 0,
			totalPages: 1,
			number: 0,
			size: 50,
		}));

		montar();
		fireEvent.click(screen.getByText('Pessoas'));
		await waitFor(() => expect(screen.getByText('Helena Braga')).toBeTruthy());

		fireEvent.click(screen.getByText('Helena Braga'));

		// Escolher na árvore já é a busca: exigir um segundo clique em "Consultar" seria um passo
		// redundante logo depois de clicar na pessoa.
		await waitFor(() => expect(servico.getEffectiveAccessByUserId).toHaveBeenCalledWith('u1'));
	});
});

describe('simulação alimentada pela árvore', () => {
	it('escolher pessoa e ação preenche a simulação, sem digitação', async () => {
		servico.browse.mockImplementation(async (branch: string, opts: any) => {
			if (branch === 'USERS') {
				return { content: [no({ id: 'u1', label: 'Helena Braga' })], totalElements: 1, totalPages: 1, number: 0, size: 50 };
			}
			if (branch === 'RESOURCES') {
				return {
					content: [no({ id: 'r1', kind: 'RESOURCE', label: 'tms.ordemservico', hasChildren: true })],
					totalElements: 1,
					totalPages: 1,
					number: 0,
					size: 50,
				};
			}
			if (branch === 'ACTIONS_OF_RESOURCE' && opts?.parentId === 'r1') {
				return {
					content: [no({ id: 'a1', kind: 'ACTION', label: 'aprovar_custo' })],
					totalElements: 1,
					totalPages: 1,
					number: 0,
					size: 50,
				};
			}
			return { content: [], totalElements: 0, totalPages: 1, number: 0, size: 50 };
		});

		montar();

		fireEvent.click(screen.getByText('Pessoas'));
		await waitFor(() => expect(screen.getByText('Helena Braga')).toBeTruthy());
		fireEvent.click(screen.getByText('Helena Braga'));

		fireEvent.click(screen.getByText('Recursos'));
		await waitFor(() => expect(screen.getByText('tms.ordemservico')).toBeTruthy());
		fireEvent.click(screen.getByText('tms.ordemservico'));
		await waitFor(() => expect(screen.getByText('aprovar_custo')).toBeTruthy());
		fireEvent.click(screen.getByText('aprovar_custo'));

		fireEvent.click(screen.getByText('Simular acesso'));

		// É o ponto do explorador: digitar "tms.ordemservico" de cabeça e errar uma letra devolve
		// "não pode", igual a uma negação real. Escolher substitui lembrar.
		await waitFor(() => {
			const usuario = screen.getByLabelText('Usuário') as HTMLInputElement;
			expect(usuario.value).toBe('u1');
		});
		expect((screen.getByLabelText('Ação') as HTMLInputElement).value).toBe('aprovar_custo');
	});
});

describe('pontos de inserção', () => {
	it('a busca própria da aplicação continua alcançável, ao lado da árvore', async () => {
		// Este slot existe porque o framework identifica alguém por id ou e-mail e não sabe o que é
		// departamento. Ao trocar a navegação, era fácil deixá-lo pendurado sem nada acusar.
		const slots = {
			renderUserSearch: (onSelect: (id: string) => void) => (
				<button type="button" onClick={() => onSelect('u1')}>
					Buscar por departamento
				</button>
			),
		};

		montar({ slots });

		fireEvent.click(screen.getByText('Buscar por departamento'));
		await waitFor(() => expect(servico.getEffectiveAccessByUserId).toHaveBeenCalledWith('u1'));
	});

	it('colunas de negócio entram na tabela de membros do grupo', async () => {
		servico.browse.mockImplementation(async (branch: string) => ({
			content: branch === 'GROUPS' ? [no({ id: 'g1', kind: 'GROUP', label: 'TIME-SAC', hasChildren: true })] : [],
			totalElements: branch === 'GROUPS' ? 1 : 0,
			totalPages: 1,
			number: 0,
			size: 50,
		}));

		const slots = {
			additionalMemberColumns: [
				{ header: 'Departamento', render: () => <span>Atendimento ao cliente</span> },
			],
		};

		montar({ slots });
		fireEvent.click(screen.getByText('Grupos'));
		await waitFor(() => expect(screen.getAllByText('TIME-SAC').length).toBeGreaterThan(0));
		fireEvent.click(screen.getAllByText('TIME-SAC')[0]);

		await waitFor(() => expect(screen.getByText('Departamento')).toBeTruthy());
		expect(screen.getByText('Atendimento ao cliente')).toBeTruthy();
	});
});
