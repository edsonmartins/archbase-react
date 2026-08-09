// @vitest-environment jsdom
/**
 * A árvore do seletor tem dois níveis — recurso e ação — e nada garante que o servidor devolva
 * filhos com id diferente do pai. Quando devolvia, a renderização recorria sem fim: a condição de
 * parada olhava um estado global de "nó expandido", igual para todos os níveis.
 */
import React from 'react';
import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

const pagina = (c: any[]) => ({ content: c, totalElements: c.length, totalPages: 1, number: 0, size: 50 });

// O caso patológico: o filho repete o id do pai.
const servico = {
	browse: vi.fn(async (_b: string, opts: any) =>
		opts?.parentId
			? pagina([{ id: 'r1', kind: 'ACTION', label: 'aprovar_custo', hasChildren: false }])
			: pagina([{ id: 'r1', kind: 'RESOURCE', label: 'tms.ordemservico', hasChildren: true }]),
	),
};

vi.mock('@archbase/core', async (o) => ({ ...(await o<any>()), processErrorMessage: (e: any) => String(e) }));
vi.mock('@archbase/data', async (o) => ({ ...(await o<any>()), useArchbaseRemoteServiceApi: () => servico }));

import { SeletorEmArvore } from '../src/securityDiagnostics/explorer/SeletorEmArvore';

beforeAll(() => {
	(globalThis as any).ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false }),
	});
});
afterEach(() => cleanup());

describe('seletor em árvore', () => {
	it('abre um recurso cujo filho repete o id, sem estourar a pilha', async () => {
		const escolhido = vi.fn();
		render(
			<MantineProvider>
				<SeletorEmArvore label="Recurso e ação" branch="RESOURCES" somenteFolhas onSelecionar={escolhido} />
			</MantineProvider>,
		);

		fireEvent.click(screen.getByLabelText('Recurso e ação'));
		fireEvent.click(await screen.findByText('tms.ordemservico'));

		// Sem a correção, isto nunca chega: a renderização entra em recursão infinita.
		expect(await screen.findByText('aprovar_custo')).toBeTruthy();
	});

	it('escolher a ação devolve o recurso como pai', async () => {
		const escolhido = vi.fn();
		render(
			<MantineProvider>
				<SeletorEmArvore label="Recurso e ação" branch="RESOURCES" somenteFolhas onSelecionar={escolhido} />
			</MantineProvider>,
		);
		fireEvent.click(screen.getByLabelText('Recurso e ação'));
		fireEvent.click(await screen.findByText('tms.ordemservico'));
		fireEvent.click(await screen.findByText('aprovar_custo'));

		await waitFor(() => expect(escolhido).toHaveBeenCalled());
		const [no, pai] = escolhido.mock.calls[0];
		expect(no.label).toBe('aprovar_custo');
		expect(pai?.label).toBe('tms.ordemservico');
	});
});
