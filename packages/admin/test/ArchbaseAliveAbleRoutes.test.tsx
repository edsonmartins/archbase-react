import React, { useEffect, useRef, useState } from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import {
	ArchbaseAliveAbleRoutes,
	ArchbaseKeepAliveRoute,
	KeepAliveCacheProvider,
	useKeepAliveCache,
	useKeepAliveVisibility,
} from '../src/ArchbaseAliveAbleRoutes';

/**
 * Reproduz o cenário de duas rotas keepAlive que compartilham o MESMO componente:
 * /tickets/novo e /tickets/editar/:id. Cada instância montada recebe um número
 * sequencial para revelar quando o keepAlive reaproveita a árvore anterior.
 */
let instanceCounter = 0;

const FormView = () => {
	const instanceIdRef = useRef<number>(0);
	if (instanceIdRef.current === 0) {
		instanceIdRef.current = ++instanceCounter;
	}
	const { id } = useParams();
	// Simula o dataSource: só é preenchido pelo efeito que observa o id da rota.
	const [loadedRecord, setLoadedRecord] = useState<string>('vazio');

	useEffect(() => {
		setLoadedRecord(id ? `ticket-${id}` : 'novo-registro');
	}, [id]);

	return (
		<div data-testid="form">
			<span data-testid="instance">{instanceIdRef.current}</span>
			<span data-testid="param">{id ?? ''}</span>
			<span data-testid="record">{loadedRecord}</span>
		</div>
	);
};

const ListView = () => <div data-testid="list">lista</div>;

/**
 * A aplicação real registra a view uma única vez via React.lazy e reaproveita o
 * mesmo componente nas duas rotas, cada uma envolvida em seu próprio Suspense.
 */
const LazyFormView = React.lazy(async () => ({ default: FormView }));
const withSuspense = (node: React.ReactNode): React.ReactNode => (
	<React.Suspense fallback={<div data-testid="loading">carregando</div>}>{node}</React.Suspense>
);

let navigateTo: (path: string) => void = () => {};
let destroyTab: (cacheKey: string) => void = () => {};

const NavigationProbe = () => {
	const navigate = useNavigate();
	const cache = useKeepAliveCache();
	navigateTo = navigate;
	destroyTab = (cacheKey: string) => cache?.destroy(cacheKey);
	return null;
};

const renderApp = () =>
	render(
		<MemoryRouter initialEntries={['/tickets']}>
			<KeepAliveCacheProvider>
				<NavigationProbe />
				<ArchbaseAliveAbleRoutes>
					<ArchbaseKeepAliveRoute path="/tickets" component={<ListView />} />
					<ArchbaseKeepAliveRoute path="/tickets/novo" component={<FormView />} />
					<ArchbaseKeepAliveRoute path="/tickets/editar/:id" component={<FormView />} />
				</ArchbaseAliveAbleRoutes>
			</KeepAliveCacheProvider>
		</MemoryRouter>
	);

const go = async (path: string) => {
	await act(async () => {
		navigateTo(path);
	});
};

describe('ArchbaseAliveAbleRoutes com keepAlive', () => {
	beforeEach(() => {
		instanceCounter = 0;
	});

	it('não reaproveita a instância de edição ao abrir a rota de inclusão', async () => {
		renderApp();

		await go('/tickets/editar/123');
		expect(screen.getByTestId('param')).toHaveTextContent('123');
		expect(screen.getByTestId('record')).toHaveTextContent('ticket-123');
		const instanciaEdicao = screen.getByTestId('instance').textContent;

		await go('/tickets');
		expect(screen.getByTestId('list')).toBeInTheDocument();

		await go('/tickets/novo');
		// O formulário de inclusão precisa ser uma instância nova, sem dados residuais.
		expect(screen.getByTestId('instance').textContent).not.toBe(instanciaEdicao);
		expect(screen.getByTestId('param')).toHaveTextContent('');
		expect(screen.getByTestId('record')).toHaveTextContent('novo-registro');
	});

	it('mantém instâncias distintas para ids diferentes da mesma rota', async () => {
		renderApp();

		await go('/tickets/editar/111');
		const primeira = screen.getByTestId('instance').textContent;

		await go('/tickets/editar/222');
		expect(screen.getByTestId('param')).toHaveTextContent('222');
		expect(screen.getByTestId('record')).toHaveTextContent('ticket-222');
		expect(screen.getByTestId('instance').textContent).not.toBe(primeira);
	});

	it('não reaproveita a instância quando as rotas usam o mesmo componente lazy', async () => {
		render(
			<MemoryRouter initialEntries={['/tickets']}>
				<NavigationProbe />
				<ArchbaseAliveAbleRoutes>
					<ArchbaseKeepAliveRoute path="/tickets" component={<ListView />} />
					<ArchbaseKeepAliveRoute path="/tickets/novo" component={withSuspense(<LazyFormView />)} />
					<ArchbaseKeepAliveRoute
						path="/tickets/editar/:id"
						component={withSuspense(<LazyFormView />)}
					/>
				</ArchbaseAliveAbleRoutes>
			</MemoryRouter>
		);

		await go('/tickets/editar/123');
		await act(async () => {});
		expect(screen.getByTestId('record')).toHaveTextContent('ticket-123');
		const instanciaEdicao = screen.getByTestId('instance').textContent;

		await go('/tickets');
		await go('/tickets/novo');
		await act(async () => {});

		expect(screen.getByTestId('instance').textContent).not.toBe(instanciaEdicao);
		expect(screen.getByTestId('record')).toHaveTextContent('novo-registro');
	});

	it('não injeta o id de edição na instância já aberta de inclusão', async () => {
		renderApp();

		await go('/tickets/novo');
		const instanciaInclusao = screen.getByTestId('instance').textContent;
		expect(screen.getByTestId('record')).toHaveTextContent('novo-registro');

		await go('/tickets/editar/256');
		expect(screen.getByTestId('instance').textContent).not.toBe(instanciaInclusao);
		expect(screen.getByTestId('record')).toHaveTextContent('ticket-256');

		// De volta à aba de inclusão: precisa continuar limpa.
		await go('/tickets/novo');
		expect(screen.getByTestId('instance').textContent).toBe(instanciaInclusao);
		expect(screen.getByTestId('param')).toHaveTextContent('');
		expect(screen.getByTestId('record')).toHaveTextContent('novo-registro');
	});

	it('não reaproveita a instância em navegação rápida entre as rotas', async () => {
		renderApp();

		await go('/tickets/editar/123');
		const instanciaEdicao = screen.getByTestId('instance').textContent;

		// Duas navegações no mesmo tick, sem deixar a transição anterior commitar.
		await act(async () => {
			navigateTo('/tickets');
			navigateTo('/tickets/novo');
		});

		expect(screen.getByTestId('instance').textContent).not.toBe(instanciaEdicao);
		expect(screen.getByTestId('param')).toHaveTextContent('');
		expect(screen.getByTestId('record')).toHaveTextContent('novo-registro');
	});

	it('não deixa resíduo ao fechar a aba de edição antes de abrir a de inclusão', async () => {
		renderApp();

		await go('/tickets/editar/256');
		const instanciaEdicao = screen.getByTestId('instance').textContent;

		// Fechar a aba destrói o nó de cache, como faz o ArchbaseAdminTabContainer.
		await act(async () => {
			destroyTab('/tickets/editar/256');
		});
		await go('/tickets/novo');

		expect(screen.getByTestId('instance').textContent).not.toBe(instanciaEdicao);
		expect(screen.getByTestId('param')).toHaveTextContent('');
		expect(screen.getByTestId('record')).toHaveTextContent('novo-registro');
	});

	it('congela location e params das abas inativas', async () => {
		// Cada instância publica o que enxerga, mesmo depois de perder o foco.
		const observado: Record<string, { pathname: string; id: string }> = {};

		const Probe = ({ nome }: { nome: string }) => {
			const location = useLocation();
			const { id = '' } = useParams();
			observado[nome] = { pathname: location.pathname, id };
			return <div data-testid={`probe-${nome}`} />;
		};

		render(
			<MemoryRouter initialEntries={['/tickets']}>
				<KeepAliveCacheProvider>
					<NavigationProbe />
					<ArchbaseAliveAbleRoutes>
						<ArchbaseKeepAliveRoute path="/tickets" component={<ListView />} />
						<ArchbaseKeepAliveRoute path="/tickets/novo" component={<Probe nome="novo" />} />
						<ArchbaseKeepAliveRoute
							path="/tickets/editar/:id"
							component={<Probe nome="editar" />}
						/>
					</ArchbaseAliveAbleRoutes>
				</KeepAliveCacheProvider>
			</MemoryRouter>
		);

		await go('/tickets/novo');
		expect(observado.novo).toEqual({ pathname: '/tickets/novo', id: '' });

		await go('/tickets/editar/256');
		expect(observado.editar).toEqual({ pathname: '/tickets/editar/256', id: '256' });

		// A aba de inclusão continua montada, porém inativa: não pode enxergar a rota de edição.
		expect(observado.novo).toEqual({ pathname: '/tickets/novo', id: '' });
	});

	it('mantém a location viva na aba ativa e navegável de dentro dela', async () => {
		let visto = '';

		const Probe = () => {
			const location = useLocation();
			const navigate = useNavigate();
			visto = location.pathname + location.search;
			return (
				<button type="button" data-testid="ir" onClick={() => navigate('/tickets')}>
					ir
				</button>
			);
		};

		render(
			<MemoryRouter initialEntries={['/tickets']}>
				<KeepAliveCacheProvider>
					<NavigationProbe />
					<ArchbaseAliveAbleRoutes>
						<ArchbaseKeepAliveRoute path="/tickets" component={<ListView />} />
						<ArchbaseKeepAliveRoute path="/tickets/editar/:id" component={<Probe />} />
					</ArchbaseAliveAbleRoutes>
				</KeepAliveCacheProvider>
			</MemoryRouter>
		);

		await go('/tickets/editar/256');
		expect(visto).toBe('/tickets/editar/256');

		// Mesma aba (mesmo pathname), apenas a query muda: precisa ser enxergada.
		await go('/tickets/editar/256?action=view');
		expect(visto).toBe('/tickets/editar/256?action=view');

		// Navegação disparada de dentro da aba continua funcionando.
		await act(async () => {
			screen.getByTestId('ir').click();
		});
		expect(screen.getByTestId('list')).toBeInTheDocument();
	});

	it('sinaliza quando a aba volta do cache através de useKeepAliveVisibility', async () => {
		const Probe = () => {
			const { isVisible, wasRestored, restoreCount } = useKeepAliveVisibility();
			return (
				<div>
					<span data-testid="visivel">{String(isVisible)}</span>
					<span data-testid="restaurado">{String(wasRestored)}</span>
					<span data-testid="restauracoes">{restoreCount}</span>
				</div>
			);
		};

		render(
			<MemoryRouter initialEntries={['/tickets']}>
				<KeepAliveCacheProvider>
					<NavigationProbe />
					<ArchbaseAliveAbleRoutes>
						<ArchbaseKeepAliveRoute path="/tickets" component={<ListView />} />
						<ArchbaseKeepAliveRoute path="/tickets/novo" component={<Probe />} />
					</ArchbaseAliveAbleRoutes>
				</KeepAliveCacheProvider>
			</MemoryRouter>
		);

		await go('/tickets/novo');
		expect(screen.getByTestId('visivel')).toHaveTextContent('true');
		// Primeira exibição não é restauração.
		expect(screen.getByTestId('restaurado')).toHaveTextContent('false');
		expect(screen.getByTestId('restauracoes')).toHaveTextContent('0');

		await go('/tickets');
		await go('/tickets/novo');

		expect(screen.getByTestId('restaurado')).toHaveTextContent('true');
		expect(screen.getByTestId('restauracoes')).toHaveTextContent('1');
	});

	it('preserva o estado ao voltar para uma aba já aberta', async () => {
		renderApp();

		await go('/tickets/editar/123');
		const instanciaEdicao = screen.getByTestId('instance').textContent;

		await go('/tickets/novo');
		await go('/tickets/editar/123');

		// keepAlive: a mesma instância deve ser restaurada, com os dados preservados.
		expect(screen.getByTestId('instance').textContent).toBe(instanciaEdicao);
		expect(screen.getByTestId('record')).toHaveTextContent('ticket-123');
	});
});
