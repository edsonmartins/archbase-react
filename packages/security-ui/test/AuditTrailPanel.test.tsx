// @vitest-environment jsdom
/**
 * A trilha é a única parte do explorador que olha para o passado — e por isso tem um risco que as
 * outras não têm: <b>uma lista vazia significa duas coisas opostas</b>. Ou nada aconteceu, ou a
 * trilha está desligada no servidor e nada foi registrado. Confundi-las leva alguém a concluir que
 * não houve acesso indevido quando, na verdade, não houve registro.
 */
import React from 'react';
import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

const EVENTOS = [
	{
		id: 'e1',
		tipo: 'ACESSO_NEGADO',
		dataHora: '2026-08-09T10:00:00',
		usuario: 'helena@exemplo.test',
		recurso: 'tms.ordemservico',
		acao: 'aprovar_custo',
		detalhe: 'GRANT',
		origem: '10.0.0.5',
		sucesso: false,
	},
	{
		id: 'e2',
		tipo: 'LOGIN',
		dataHora: '2026-08-09T09:00:00',
		usuario: 'joana@exemplo.test',
		sucesso: true,
	},
];

const servico = {
	getAuditEvents: vi.fn(async () => ({
		content: EVENTOS,
		totalElements: EVENTOS.length,
		totalPages: 1,
		number: 0,
		size: 50,
	})),
};

vi.mock('@archbase/core', async (o) => ({ ...(await o<any>()), processErrorMessage: (e: any) => String(e) }));
vi.mock('@archbase/data', async (o) => ({ ...(await o<any>()), useArchbaseRemoteServiceApi: () => servico }));

import { AuditTrailPanel } from '../src/securityDiagnostics/AuditTrailPanel';

beforeAll(() => {
	(globalThis as any).ResizeObserver = class {
		observe() {}
		unobserve() {}
		disconnect() {}
	};
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: () => ({
			matches: false,
			addEventListener() {},
			removeEventListener() {},
			addListener() {},
			removeListener() {},
			dispatchEvent: () => false,
		}),
	});
});

beforeEach(() => {
	servico.getAuditEvents.mockReset();
	servico.getAuditEvents.mockResolvedValue({
		content: EVENTOS,
		totalElements: EVENTOS.length,
		totalPages: 1,
		number: 0,
		size: 50,
	});
});

afterEach(() => cleanup());

const montar = () =>
	render(
		<MantineProvider>
			<AuditTrailPanel />
		</MantineProvider>,
	);

describe('trilha de auditoria', () => {
	it('mostra o que aconteceu, com o motivo da negação', async () => {
		montar();

		// Espera pelas células, e não por um rótulo: "Acesso negado" também é o texto de uma opção
		// do filtro de tipo, presente no DOM desde o primeiro instante. Ancorar nele dava o teste
		// por concluído antes de a lista chegar — ele passava sem ter verificado nada.
		await waitFor(() => expect(document.querySelectorAll('td').length).toBeGreaterThan(0));

		const celulas = Array.from(document.querySelectorAll('td')).map((c) => c.textContent?.trim());
		expect(celulas).toContain('helena@exemplo.test');
		// O motivo é o portão que recusou: é ele que diz o que ajustar, em vez de só "negado".
		expect(celulas).toContain('GRANT');
		expect(celulas).toContain('10.0.0.5');
	});

	it('trilha desligada no servidor não é o mesmo que nada ter acontecido', async () => {
		servico.getAuditEvents.mockRejectedValueOnce(new Error('Request failed with status code 404'));

		montar();

		// Sem esta distinção, a tela mostraria uma lista vazia e quem investiga concluiria que não
		// houve acesso indevido — quando o que houve foi ausência de registro.
        expect(await screen.findByText(/Trilha desligada/)).toBeTruthy();
		expect(screen.getByText(/archbase.security.audit.enabled=false/)).toBeTruthy();
	});

	it('filtrar por tipo refaz a consulta no servidor', async () => {
		montar();
		await screen.findByText('Acesso negado');

		fireEvent.change(screen.getByLabelText('Pessoa'), { target: { value: 'helena' } });

		// O filtro precisa ir ao servidor: a trilha é paginada, e filtrar só a página visível
		// esconderia justamente os eventos das páginas seguintes.
		await waitFor(() =>
			expect(servico.getAuditEvents).toHaveBeenCalledWith(
				expect.objectContaining({ usuario: 'helena' }),
			),
		);
	});

	it('lista vazia de verdade diz que não houve evento', async () => {
		servico.getAuditEvents.mockResolvedValueOnce({
			content: [],
			totalElements: 0,
			totalPages: 1,
			number: 0,
			size: 50,
		});

		montar();

		expect(await screen.findByText(/Nenhum evento no período/)).toBeTruthy();
	});
});
