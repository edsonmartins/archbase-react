// @vitest-environment jsdom
/**
 * Caracterização dos cinco fluxos de entidade da ArchbaseSecurityView.
 *
 * <p><b>Por que existe.</b> A view tem cinco famílias de handler quase idênticas — uma por
 * entidade — e o passo seguinte do refatoramento é colapsá-las num hook genérico. "Quase"
 * idênticas é o problema: elas divergem em pontos que compilam igual e se comportam
 * diferente. Estes testes fixam o comportamento <b>atual</b>, incluindo as divergências,
 * para que o colapso as preserve de propósito ou as remova de propósito — nunca por acidente.
 *
 * <p>A divergência mais importante já está documentada em
 * "editar duas vezes": usuário chama {@code edit()} de novo, grupo e perfil não.
 *
 * <p>Não testam aparência. Testam o que cada gesto faz no datasource, que é o que o colapso
 * pode quebrar.
 */
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

// ─────────────────────────── dublês ───────────────────────────

/** Um datasource espião com a superfície que os handlers usam. */
const criarDataSource = () => ({
	isEmpty: vi.fn(() => false),
	isEditing: vi.fn(() => false),
	isBrowsing: vi.fn(() => true),
	gotoRecordByData: vi.fn((registro: any) => registro),
	edit: vi.fn(),
	insert: vi.fn(),
	remove: vi.fn(),
	cancel: vi.fn(),
	save: vi.fn(async () => undefined),
	browseRecords: vi.fn(() => [] as any[]),
	getGrandTotalRecords: vi.fn(() => 0),
	getCurrentRecord: vi.fn(() => undefined),
	getTotalRecords: vi.fn(() => 0),
	getCurrentPage: vi.fn(() => 0),
	getTotalPages: vi.fn(() => 1),
	getPageSize: vi.fn(() => 50),
	isInserting: vi.fn(() => false),
	addListener: vi.fn(),
	removeListener: vi.fn(),
	getName: vi.fn(() => 'ds'),
});

const ds = {
	users: criarDataSource(),
	groups: criarDataSource(),
	profiles: criarDataSource(),
	resources: criarDataSource(),
	accessTokens: criarDataSource(),
};

/** Registros que o grid dublê vai renderizar, por título do painel. */
const REGISTROS: Record<string, any[]> = {
	Usuários: [{ id: 'u1', name: 'Fulano' }],
	Grupos: [{ id: 'g1', name: 'Time SAC' }],
	Perfis: [{ id: 'p1', name: 'Supervisor' }],
	Recursos: [],
	'Tokens de API': [],
};

const confirmDialog = vi.fn();

vi.mock('@archbase/core', async (importOriginal) => ({
	...(await importOriginal<any>()),
	// ARCHBASE_IOC_API_TYPE vem do original: os services do @archbase/security fazem
	// inject com esses símbolos no carregamento do módulo, e um objeto parcial aqui
	// faria o inversify receber undefined.
	builder: { eq: () => ({}) },
	emit: () => '',
	processErrorMessage: (e: any) => String(e),
	processDetailErrorMessage: (e: any) => String(e),
	useValidationErrors: () => ({ clearAll: vi.fn() }),
	useArchbaseTheme: () => ({ colors: { blue: [], yellow: [], red: [], green: [] } }),
	useArchbaseValidator: () => ({}),
	useArchbaseTranslation: () => ({ t: (chave: string) => chave }),
	isBase64Validate: () => false,
}));

vi.mock('@archbase/data', async (importOriginal) => ({
	...(await importOriginal<any>()),
	ArchbaseDataSource: class {},
	useArchbaseStore: () => ({}),
	useArchbaseRemoteServiceApi: () => ({}),
	useArchbaseRemoteDataSourceV2: ({ name }: { name: string }) => {
		const porNome: Record<string, any> = {
			dsUsers: ds.users,
			dsGroups: ds.groups,
			// Singular de propósito: é assim que a view o nomeia, ao contrário dos outros quatro.
			dsProfile: ds.profiles,
			dsResources: ds.resources,
			dsAccessTokens: ds.accessTokens,
		};
		return {
			dataSource: porNome[name] ?? criarDataSource(),
			isLoading: false,
			error: undefined,
			refreshData: vi.fn(),
		};
	},
}));

/**
 * O grid é substituído por um dublê que expõe o que interessa: a barra de ferramentas e as
 * ações de cada linha. É por ele que o teste alcança os handlers.
 */
vi.mock('@archbase/components', async (importOriginal) => ({
	...(await importOriginal<any>()),
	ArchbaseDialog: {
		showConfirmDialogYesNo: (titulo: string, msg: string, sim: () => void, nao: () => void) =>
			confirmDialog(titulo, msg, sim, nao),
	},
	ArchbaseNotifications: { showError: vi.fn(), showSuccess: vi.fn() },
	Columns: ({ children }: any) => <div data-testid="colunas">{children}</div>,
	ArchbaseDataGridColumn: () => null,
	useArchbaseListContext: () => ({}),
	ArchbaseDataGrid: ({ printTitle, toolbarLeftContent, renderRowActions }: any) => (
		<div data-testid={`grid-${printTitle}`}>
			<div data-testid={`barra-${printTitle}`}>{toolbarLeftContent}</div>
			{(REGISTROS[printTitle] ?? []).map((registro) => (
				<div key={registro.id} data-testid={`linha-${printTitle}-${registro.id}`}>
					{renderRowActions ? renderRowActions(registro) : null}
				</div>
			))}
		</div>
	),
}));

vi.mock('../src/UserModal', () => ({ UserModal: () => <div data-testid="modal-usuario" /> }));
vi.mock('../src/GroupModal', () => ({ GroupModal: () => <div data-testid="modal-grupo" /> }));
vi.mock('../src/ProfileModal', () => ({ ProfileModal: () => <div data-testid="modal-perfil" /> }));
vi.mock('../src/PermissionsSelectorModal', () => ({
	PermissionsSelectorModal: () => <div data-testid="modal-permissoes" />,
}));

import { ArchbaseSecurityView } from '../src/ArchbaseSecurityView';

// ─────────────────────────── apoio ───────────────────────────

/** As ações de linha, na ordem em que a view as monta: ver, editar, remover, permissões. */
const acoesDaLinha = (painel: string, id: string) =>
	Array.from(screen.getByTestId(`linha-${painel}-${id}`).querySelectorAll('button'));

const ACAO = { ver: 0, editar: 1, remover: 2, permissoes: 3 };

const renderizar = (props: any = {}) =>
	render(
		<MantineProvider>
			<ArchbaseSecurityView {...props} />
		</MantineProvider>,
	);

// O jsdom não implementa matchMedia, e o Mantine consulta na montagem.
beforeAll(() => {
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
	Object.values(ds).forEach((d) => {
		d.isEmpty.mockReturnValue(false);
		d.isEditing.mockReturnValue(false);
		d.isBrowsing.mockReturnValue(true);
		d.gotoRecordByData.mockImplementation((registro: any) => registro);
		d.save.mockResolvedValue(undefined);
	});
});

// Sem auto-cleanup configurado neste pacote, os renders se acumulariam no DOM e
// os testids apareceriam duplicados a partir do segundo cenário.
afterEach(() => cleanup());

// ─────────────────────────── cenários ───────────────────────────

describe('ArchbaseSecurityView — fluxos de entidade', () => {
	describe('adicionar', () => {
		it.each([
			['Usuários', 'users'],
			['Grupos', 'groups'],
			['Perfis', 'profiles'],
		])('%s: insere um registro novo no datasource', (painel, chave) => {
			renderizar();
			const botao = screen.getByTestId(`barra-${painel}`).querySelector('button');
			expect(botao).not.toBeNull();
			fireEvent.click(botao!);
			expect((ds as any)[chave].insert).toHaveBeenCalledTimes(1);
		});
	});

	describe('editar', () => {
		it.each([
			['Usuários', 'users', 'u1'],
			['Grupos', 'groups', 'g1'],
			['Perfis', 'profiles', 'p1'],
		])('%s: posiciona no registro e entra em edição', (painel, chave, id) => {
			renderizar();
			fireEvent.click(acoesDaLinha(painel, id)[ACAO.editar]);
			const alvo = (ds as any)[chave];
			expect(alvo.gotoRecordByData).toHaveBeenCalled();
			expect(alvo.edit).toHaveBeenCalledTimes(1);
		});

		it.each([
			['Usuários', 'users', 'u1'],
			['Grupos', 'groups', 'g1'],
			['Perfis', 'profiles', 'p1'],
		])('%s: datasource vazio não faz nada', (painel, chave, id) => {
			(ds as any)[chave].isEmpty.mockReturnValue(true);
			renderizar();
			fireEvent.click(acoesDaLinha(painel, id)[ACAO.editar]);
			expect((ds as any)[chave].edit).not.toHaveBeenCalled();
		});

		/**
		 * A DIVERGÊNCIA. Grupo e perfil guardam com isEditing() antes de chamar edit();
		 * usuário não. Este teste existe para que o colapso dos handlers não uniformize isso
		 * sem alguém decidir — e para tornar visível que provavelmente é um esquecimento:
		 * a guarda foi acrescentada em dois dos três.
		 */
		it('usuário chama edit() mesmo já estando em edição — grupo e perfil não', () => {
			ds.users.isEditing.mockReturnValue(true);
			ds.groups.isEditing.mockReturnValue(true);
			ds.profiles.isEditing.mockReturnValue(true);
			renderizar();

			fireEvent.click(acoesDaLinha('Usuários', 'u1')[ACAO.editar]);
			fireEvent.click(acoesDaLinha('Grupos', 'g1')[ACAO.editar]);
			fireEvent.click(acoesDaLinha('Perfis', 'p1')[ACAO.editar]);

			expect(ds.users.edit).toHaveBeenCalledTimes(1);
			expect(ds.groups.edit).not.toHaveBeenCalled();
			expect(ds.profiles.edit).not.toHaveBeenCalled();
		});
	});

	describe('remover', () => {
		it.each([
			['Usuários', 'users', 'u1'],
			['Grupos', 'groups', 'g1'],
			['Perfis', 'profiles', 'p1'],
		])('%s: pede confirmação antes de remover', (painel, chave, id) => {
			renderizar();
			fireEvent.click(acoesDaLinha(painel, id)[ACAO.remover]);
			expect(confirmDialog).toHaveBeenCalledTimes(1);
			expect((ds as any)[chave].remove).not.toHaveBeenCalled();
		});

		it.each([
			['Usuários', 'users', 'u1'],
			['Grupos', 'groups', 'g1'],
			['Perfis', 'profiles', 'p1'],
		])('%s: só remove quando o operador confirma', (painel, chave, id) => {
			renderizar();
			fireEvent.click(acoesDaLinha(painel, id)[ACAO.remover]);
			const aoConfirmar = confirmDialog.mock.calls[0][2] as () => void;
			aoConfirmar();
			expect((ds as any)[chave].remove).toHaveBeenCalledTimes(1);
		});

		it.each([
			['Usuários', 'users', 'u1'],
			['Grupos', 'groups', 'g1'],
			['Perfis', 'profiles', 'p1'],
		])('%s: recusar a confirmação não remove', (painel, chave, id) => {
			renderizar();
			fireEvent.click(acoesDaLinha(painel, id)[ACAO.remover]);
			const aoRecusar = confirmDialog.mock.calls[0][3] as () => void;
			aoRecusar();
			expect((ds as any)[chave].remove).not.toHaveBeenCalled();
		});
	});

	describe('slots de ação por linha', () => {
		it('beforeDefaultUserActions vem antes e afterDefaultUserActions depois das padrão', () => {
			renderizar({
				options: {
					beforeDefaultUserActions: () => <button data-testid="antes">antes</button>,
					afterDefaultUserActions: () => <button data-testid="depois">depois</button>,
				},
			});
			const botoes = acoesDaLinha('Usuários', 'u1');
			expect(botoes[0].getAttribute('data-testid')).toBe('antes');
			expect(botoes[botoes.length - 1].getAttribute('data-testid')).toBe('depois');
		});

		it.each([
			['beforeDefaultGroupActions', 'afterDefaultGroupActions', 'Grupos', 'g1'],
			['beforeDefaultProfileActions', 'afterDefaultProfileActions', 'Perfis', 'p1'],
		])('%s e %s cercam as ações padrão', (antes, depois, painel, id) => {
			renderizar({
				options: {
					[antes]: () => <button data-testid="antes">antes</button>,
					[depois]: () => <button data-testid="depois">depois</button>,
				},
			});
			const botoes = acoesDaLinha(painel, id);
			expect(botoes[0].getAttribute('data-testid')).toBe('antes');
			expect(botoes[botoes.length - 1].getAttribute('data-testid')).toBe('depois');
		});
	});
});
