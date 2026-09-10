// @vitest-environment jsdom
/**
 * O que o seletor MOSTRA em cada linha.
 *
 * <p>Três defeitos de usabilidade encontrados operando a tela de simulação com dados reais:
 *
 * <ul>
 *   <li>recurso e ação apareciam pelo identificador técnico — `ArchbaseAdvancedSidebar` onde quem
 *       administra deveria ler "Navegação", e ação nenhuma trazia descrição;</li>
 *   <li>pessoa aparecia só pelo nome, e havia três "Marcos" no tenant: escolher entre dois
 *       idênticos era chute, com o e-mail disponível o tempo todo;</li>
 *   <li>o número à direita não dizia o que contava — `aprovar 4` e `ticket.kanban 14` lado a lado,
 *       com significados diferentes.</li>
 * </ul>
 */
import React from 'react';
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

const pagina = (c: any[]) => ({ content: c, totalElements: c.length, totalPages: 1, number: 0, size: 50 });

const RECURSOS = [
	{ id: 'r1', kind: 'RESOURCE', label: 'ArchbaseAdvancedSidebar', description: 'Navegação', badge: '3', hasChildren: true },
	{ id: 'r2', kind: 'RESOURCE', label: 'tms.pneu', badge: '2', hasChildren: true },
];
const ACOES = [{ id: 'a1', kind: 'ACTION', label: 'abrir', description: 'Abrir o menu lateral', badge: '4', hasChildren: false }];
const PESSOAS = [
	{ id: 'u1', kind: 'USER', label: 'Marcos', description: 'marcos@exemplo.test', hasChildren: false },
	{ id: 'u2', kind: 'USER', label: 'Marcos', description: 'marcos.marinho@rioquality.com.br', hasChildren: false },
];

const servico = {
	browse: vi.fn(async (branch: string) => {
		if (branch === 'ACTIONS_OF_RESOURCE') return pagina(ACOES);
		if (branch === 'USERS') return pagina(PESSOAS);
		return pagina(RECURSOS);
	}),
};

vi.mock('@archbase/core', async (o) => ({
	...(await o<any>()),
	processErrorMessage: (e: any) => String(e),
	getI18nextInstance: () => ({ t: (k: string) => k }),
}));
vi.mock('@archbase/data', async (o) => ({ ...(await o<any>()), useArchbaseRemoteServiceApi: () => servico }));

import { SeletorEmArvore } from '../src/securityDiagnostics/explorer/SeletorEmArvore';

beforeAll(() => {
	(globalThis as any).ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false }),
	});
});
afterEach(() => { cleanup(); servico.browse.mockClear(); });

const abrirSeletorDeCapacidade = () => {
	render(
		<MantineProvider>
			<SeletorEmArvore label="Recurso e ação" branch="RESOURCES" branchDosFilhos="ACTIONS_OF_RESOURCE" somenteFolhas onSelecionar={vi.fn()} />
		</MantineProvider>,
	);
	fireEvent.click(screen.getByLabelText('Recurso e ação'));
};

describe('o que cada linha mostra', () => {
	it('recurso aparece pela DESCRIÇÃO, com o identificador ao lado', async () => {
		abrirSeletorDeCapacidade();

		expect(await screen.findByText('Navegação')).toBeTruthy();
		// O identificador não some: é ele que a simulação envia ao servidor, e é por ele que se
		// procura quando se conhece o código.
		expect(screen.getByText('ArchbaseAdvancedSidebar')).toBeTruthy();
	});

	it('recurso sem descrição continua aparecendo pelo identificador, sem duplicá-lo', async () => {
		abrirSeletorDeCapacidade();

		await screen.findByText('Navegação');
		expect(screen.getAllByText('tms.pneu')).toHaveLength(1);
	});

	it('ação aparece pela descrição — antes não tinha nenhuma', async () => {
		abrirSeletorDeCapacidade();
		fireEvent.click(await screen.findByText('Navegação'));

		expect(await screen.findByText('Abrir o menu lateral')).toBeTruthy();
		expect(screen.getByText('abrir')).toBeTruthy();
	});

	it('pessoa leva o e-mail ao lado — é o que distingue homônimos', async () => {
		render(
			<MantineProvider>
				<SeletorEmArvore label="Usuário" branch="USERS" onSelecionar={vi.fn()} />
			</MantineProvider>,
		);
		fireEvent.click(screen.getByLabelText('Usuário'));

		// Dois "Marcos" — indistinguíveis sem o e-mail.
		expect(await screen.findAllByText('Marcos')).toHaveLength(2);
		expect(screen.getByText('marcos@exemplo.test')).toBeTruthy();
		expect(screen.getByText('marcos.marinho@rioquality.com.br')).toBeTruthy();
	});

	it('o número à direita diz o que conta', async () => {
		abrirSeletorDeCapacidade();

		const badge = await screen.findByText('3');
		expect(badge.getAttribute('title')).toBe('ações neste recurso');
	});
});

describe('estado ao reabrir', () => {
	it('a busca não fica presa na consulta anterior', async () => {
		abrirSeletorDeCapacidade();
		await screen.findByText('Navegação');

		const busca = screen.getByPlaceholderText('Buscar…');
		fireEvent.change(busca, { target: { value: 'pneu' } });
		await waitFor(() => expect((busca as HTMLInputElement).value).toBe('pneu'));

		// Fecha e reabre pelo campo de cima, que é `readOnly` e serve de gatilho.
		fireEvent.click(screen.getByLabelText('Recurso e ação'));
		fireEvent.click(screen.getByLabelText('Recurso e ação'));

		expect((screen.getByPlaceholderText('Buscar…') as HTMLInputElement).value).toBe('');
	});

	it('o ramo aberto não volta expandido — sugeriria uma escolha corrente que não existe', async () => {
		abrirSeletorDeCapacidade();
		fireEvent.click(await screen.findByText('Navegação'));
		expect(await screen.findByText('Abrir o menu lateral')).toBeTruthy();

		fireEvent.click(screen.getByLabelText('Recurso e ação'));
		fireEvent.click(screen.getByLabelText('Recurso e ação'));

		await screen.findByText('Navegação');
		expect(screen.queryByText('Abrir o menu lateral')).toBeNull();
	});
});
