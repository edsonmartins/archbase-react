import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import {
  AnalyticsProvider,
  clearMetaCache,
  createInMemorySavedQueryStore,
  ptBrFormatter,
  serializeExploration,
  type AnalyticsEvent,
  type AnalyticsPorts,
  type SavedQueryStore,
} from '@archbase/analytics-core';
import { AnalyticsExplorer } from '../src/compositions/AnalyticsExplorer';
import { AnalyticsWidget } from '../src/compositions/AnalyticsWidget';
import { META_CRU, fakeChartRenderer } from './fixtures';

const CARGA = {
  results: [
    {
      query: { measures: ['pedidos.receita_cents'], dimensions: ['pedidos.canal'] },
      data: [
        { 'pedidos.canal': 'Loja', 'pedidos.receita_cents': '1250000' },
        { 'pedidos.canal': 'Online', 'pedidos.receita_cents': '800000' },
      ],
      annotation: {},
    },
  ],
};

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

function fakeFetch(carga: unknown = CARGA, init: ResponseInit = {}) {
  return vi.fn(async (url: string) =>
    String(url).endsWith('/v1/meta') ? jsonResponse(META_CRU) : jsonResponse(carga, init),
  ) as unknown as typeof fetch;
}

interface EnvOptions {
  fetchImpl?: typeof fetch;
  telemetry?: (event: AnalyticsEvent) => void;
  store?: SavedQueryStore;
}

function Env({ children, ...options }: EnvOptions & { children: ReactNode }) {
  const ports: AnalyticsPorts = {
    tokenProvider: async () => 'Bearer t',
    savedQueryStore: options.store ?? createInMemorySavedQueryStore(),
    formatter: ptBrFormatter,
    chartRenderer: fakeChartRenderer(),
    telemetry: options.telemetry,
  };

  return (
    <MantineProvider>
      <AnalyticsProvider
        baseUrl="/api/analytics"
        ports={ports}
        fetchImpl={options.fetchImpl ?? fakeFetch()}
      >
        {children}
      </AnalyticsProvider>
    </MantineProvider>
  );
}

beforeEach(() => {
  clearMetaCache();
});

describe('AnalyticsExplorer', () => {
  it('monta a paleta a partir da introspeccao', async () => {
    render(
      <Env>
        <AnalyticsExplorer />
      </Env>,
    );

    await waitFor(() => expect(screen.getByText('Receita')).toBeDefined());
    expect(screen.getByText('Canal')).toBeDefined();
    expect(screen.getByText('Financeiro')).toBeDefined();
  });

  it('comeca vazio e executa apos a primeira selecao', async () => {
    const user = userEvent.setup();
    const fetchImpl = fakeFetch();

    render(
      <Env fetchImpl={fetchImpl}>
        <AnalyticsExplorer />
      </Env>,
    );

    await waitFor(() => expect(screen.getByText('Receita')).toBeDefined());
    expect(screen.getAllByText(/Selecione uma metrica/).length).toBeGreaterThan(0);

    await user.click(screen.getByText('Receita'));

    await waitFor(() => {
      const chamadas = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls;
      expect(chamadas.some((call) => String(call[0]).endsWith('/v1/load'))).toBe(true);
    });
  });

  it('restaura a exploracao a partir do deep link', async () => {
    const estado = {
      query: { measures: ['pedidos.receita_cents'], dimensions: ['pedidos.canal'] },
      viz: { type: 'bar' as const },
      vizAuto: false,
    };
    const search = `?aq=${serializeExploration(estado)}`;

    render(
      <Env>
        <AnalyticsExplorer deepLink={{ search, onChange: vi.fn() }} />
      </Env>,
    );

    // As pills do QueryCanvas provam que a consulta foi reconstruida.
    await waitFor(() => expect(screen.getByText('Metricas')).toBeDefined());
    expect(screen.getByText('Dimensoes')).toBeDefined();
  });

  it('escreve o deep link ao alterar a exploracao', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <Env>
        <AnalyticsExplorer deepLink={{ search: '', onChange }} />
      </Env>,
    );

    await waitFor(() => expect(screen.getByText('Receita')).toBeDefined());
    await user.click(screen.getByText('Receita'));

    await waitFor(() => expect(onChange).toHaveBeenCalled());
    const ultimo = onChange.mock.calls.at(-1)?.[0] as string;
    expect(ultimo).toContain('aq=1.');
  });

  it('nao toca na URL quando o host nao pede deep link', async () => {
    const user = userEvent.setup();
    render(
      <Env>
        <AnalyticsExplorer />
      </Env>,
    );

    await waitFor(() => expect(screen.getByText('Receita')).toBeDefined());
    await user.click(screen.getByText('Receita'));

    // O roteamento pertence ao host: sem a prop, nada e escrito.
    expect(window.location.search).toBe('');
  });

  it('degrada consulta salva com membro fora do alcance do leitor', async () => {
    const store = createInMemorySavedQueryStore();
    const salva = await store.save({
      schemaVersion: 1,
      query: { measures: ['pedidos.receita_cents'], dimensions: ['pedidos.extinto'] },
      viz: { type: 'table' },
      meta: { name: 'Compartilhada', ownerId: 'outro', scope: 'org' },
    });

    render(
      <Env store={store}>
        <AnalyticsExplorer deepLink={{ search: `?aqid=${salva.id}`, onChange: vi.fn() }} />
      </Env>,
    );

    await waitFor(() => expect(screen.getAllByRole('alert').length).toBeGreaterThan(0));

    const avisos = screen.getAllByRole('alert').map((node) => node.textContent ?? '');
    const degradacao = avisos.find((texto) => texto.includes('acesso'));

    expect(degradacao).toBeDefined();
    // Quantitativo, nunca nominal.
    expect(degradacao).not.toContain('extinto');
    expect(degradacao).toContain('1 item');
  });

  it('emite telemetria ao abrir consulta salva', async () => {
    const eventos: AnalyticsEvent[] = [];
    const store = createInMemorySavedQueryStore();
    const salva = await store.save({
      schemaVersion: 1,
      query: { measures: ['pedidos.receita_cents'] },
      viz: { type: 'table' },
      meta: { name: 'Minha', ownerId: 'u', scope: 'private' },
    });

    render(
      <Env store={store} telemetry={(event) => eventos.push(event)}>
        <AnalyticsExplorer deepLink={{ search: `?aqid=${salva.id}`, onChange: vi.fn() }} />
      </Env>,
    );

    await waitFor(() =>
      expect(eventos.some((event) => event.type === 'saved_query_opened')).toBe(true),
    );
    const abertura = eventos.find((event) => event.type === 'saved_query_opened');
    expect(abertura?.savedQueryId).toBe(salva.id);
  });

  it('apresenta timeout como mensagem acionavel, sem detalhe tecnico', async () => {
    const user = userEvent.setup();
    const fetchImpl = vi.fn(async (url: string) =>
      String(url).endsWith('/v1/meta')
        ? jsonResponse(META_CRU)
        : jsonResponse(
            { error: { code: 'QUERY_TIMEOUT', message: 'canceling statement due to timeout' } },
            { status: 504 },
          ),
    ) as unknown as typeof fetch;

    render(
      <Env fetchImpl={fetchImpl}>
        <AnalyticsExplorer />
      </Env>,
    );

    await waitFor(() => expect(screen.getByText('Receita')).toBeDefined());
    await user.click(screen.getByText('Receita'));

    await waitFor(() => {
      const alertas = screen.getAllByRole('alert').map((node) => node.textContent ?? '');
      expect(alertas.some((texto) => texto.includes('demorou demais'))).toBe(true);
    });

    expect(document.body.textContent).not.toContain('canceling statement');
  });

  it('sinaliza truncamento mantendo os dados parciais visiveis', async () => {
    const user = userEvent.setup();
    const fetchImpl = vi.fn(async (url: string) =>
      String(url).endsWith('/v1/meta')
        ? jsonResponse(META_CRU)
        : jsonResponse(CARGA, {
            headers: {
              'Content-Type': 'application/json',
              'X-Analytics-Truncated': 'true',
              'X-Analytics-Row-Limit': '50000',
            },
          }),
    ) as unknown as typeof fetch;

    render(
      <Env fetchImpl={fetchImpl}>
        <AnalyticsExplorer />
      </Env>,
    );

    await waitFor(() => expect(screen.getByText('Receita')).toBeDefined());
    await user.click(screen.getByText('Receita'));

    await waitFor(() => {
      const alertas = screen.getAllByRole('alert').map((node) => node.textContent ?? '');
      expect(alertas.some((texto) => texto.includes('Resultado parcial'))).toBe(true);
    });

    // Os dados parciais continuam em tela: o truncamento sinaliza, nao
    // substitui o resultado. A superficie e o grafico porque a measure declara
    // `default_viz: bar`.
    expect(screen.getByTestId('grafico')).toBeDefined();
    const alertas = screen.getAllByRole('alert').map((node) => node.textContent ?? '');
    expect(alertas.some((texto) => /erro|falha/i.test(texto))).toBe(false);
  });
});

describe('AnalyticsWidget', () => {
  it('exibe consulta direta sem oferecer composicao', async () => {
    render(
      <Env>
        <AnalyticsWidget
          title="Receita por canal"
          query={{ measures: ['pedidos.receita_cents'], dimensions: ['pedidos.canal'] }}
          viz="table"
        />
      </Env>,
    );

    await waitFor(() => expect(screen.getByText('Loja')).toBeDefined());

    expect(screen.getByText('Receita por canal')).toBeDefined();
    // Sem paleta, sem barra de consulta salva, sem seletor de visualizacao.
    expect(screen.queryByPlaceholderText('Buscar')).toBeNull();
    expect(screen.queryByPlaceholderText('Nome da consulta')).toBeNull();
    expect(screen.queryByText('Barras')).toBeNull();
  });

  it('registra a origem widget na telemetria', async () => {
    const eventos: AnalyticsEvent[] = [];

    render(
      <Env telemetry={(event) => eventos.push(event)}>
        <AnalyticsWidget query={{ measures: ['pedidos.receita_cents'] }} viz="table" />
      </Env>,
    );

    await waitFor(() => expect(eventos.length).toBeGreaterThan(0));
    expect(eventos[0]?.origin).toBe('widget');
  });

  it('carrega consulta salva por identificador', async () => {
    const store = createInMemorySavedQueryStore();
    const salva = await store.save({
      schemaVersion: 1,
      query: { measures: ['pedidos.receita_cents'], dimensions: ['pedidos.canal'] },
      viz: { type: 'table' },
      meta: { name: 'Painel', ownerId: 'u', scope: 'private' },
    });

    render(
      <Env store={store}>
        <AnalyticsWidget savedQueryId={salva.id} viz="table" />
      </Env>,
    );

    await waitFor(() => expect(screen.getByText('Loja')).toBeDefined());
  });

  it('formata pela porta, sem dividir centavos na biblioteca', async () => {
    render(
      <Env>
        <AnalyticsWidget
          query={{ measures: ['pedidos.receita_cents'], dimensions: ['pedidos.canal'] }}
          viz="table"
        />
      </Env>,
    );

    await waitFor(() =>
      expect(
        screen.getByText((text) => text.replace(/\s/g, ' ') === 'R$ 12.500,00'),
      ).toBeDefined(),
    );
  });
});
