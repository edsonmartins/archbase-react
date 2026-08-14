import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { AnalyticsProvider } from '../src/provider/AnalyticsProvider';
import { clearMetaCache } from '../src/meta/useAnalyticsMeta';
import { useExploration } from '../src/exploration/useExploration';
import { createInMemorySavedQueryStore } from '../src/reference/inMemorySavedQueryStore';
import { ptBrFormatter } from '../src/reference/formatterPtBR';
import type { AnalyticsEvent, AnalyticsPorts, ChartRenderer, VizType } from '../src/ports/types';
import { FAKE_META } from './fixtures/fakeModel';
import { ERRO_TIMEOUT, LOAD_SIMPLES } from './fixtures/loadResponse';

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

function fakeFetch(loadBody: unknown, loadInit: ResponseInit = {}) {
  return vi.fn(async (url: string) =>
    String(url).endsWith('/v1/meta') ? jsonResponse(FAKE_META) : jsonResponse(loadBody, loadInit),
  ) as unknown as typeof fetch;
}

/** Renderizador que entrega tudo, exceto o que o teste excluir. */
function fakeChartRenderer(unsupported: VizType[] = []): ChartRenderer {
  return {
    supports: (viz) => !unsupported.includes(viz),
    render: () => null,
  };
}

/** `null` significa host sem renderizador; omitir usa um que entrega tudo. */
function wrapper(
  fetchImpl: typeof fetch,
  telemetry?: (event: AnalyticsEvent) => void,
  chartRenderer: ChartRenderer | null = fakeChartRenderer(),
) {
  const ports: AnalyticsPorts = {
    tokenProvider: async () => 'Bearer t',
    savedQueryStore: createInMemorySavedQueryStore(),
    formatter: ptBrFormatter,
    chartRenderer: chartRenderer ?? undefined,
    telemetry,
  };

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AnalyticsProvider baseUrl="/api/analytics" ports={ports} fetchImpl={fetchImpl}>
        {children}
      </AnalyticsProvider>
    );
  };
}

beforeEach(() => {
  clearMetaCache();
});

describe('exploracao', () => {
  it('comeca vazia e sem executar consulta', async () => {
    const fetchImpl = fakeFetch(LOAD_SIMPLES);
    const { result } = renderHook(() => useExploration(), { wrapper: wrapper(fetchImpl) });

    await waitFor(() => expect(result.current.meta).toBeDefined());
    expect(result.current.runnable).toBe(false);
    expect(result.current.result).toBeUndefined();
  });

  it('executa ao selecionar uma measure', async () => {
    const fetchImpl = fakeFetch(LOAD_SIMPLES);
    const { result } = renderHook(() => useExploration(), { wrapper: wrapper(fetchImpl) });
    await waitFor(() => expect(result.current.meta).toBeDefined());

    act(() => result.current.dispatch({ type: 'toggleMeasure', member: 'pedidos.receita_cents' }));

    await waitFor(() => expect(result.current.result).toBeDefined());
    expect(result.current.result?.rows).toHaveLength(2);
  });

  it('deriva a visualizacao inicial do metadado da measure', async () => {
    const fetchImpl = fakeFetch(LOAD_SIMPLES);
    const { result } = renderHook(() => useExploration(), { wrapper: wrapper(fetchImpl) });
    await waitFor(() => expect(result.current.meta).toBeDefined());

    act(() => result.current.dispatch({ type: 'toggleMeasure', member: 'pedidos.receita_cents' }));
    await waitFor(() => expect(result.current.viz).toBe('bar'));
  });

  it('aplica o default interno quando nenhuma measure declara visualizacao', async () => {
    const fetchImpl = fakeFetch(LOAD_SIMPLES);
    const { result } = renderHook(() => useExploration(), { wrapper: wrapper(fetchImpl) });
    await waitFor(() => expect(result.current.meta).toBeDefined());

    act(() => result.current.dispatch({ type: 'toggleMeasure', member: 'pedidos.itens_total' }));
    await waitFor(() => expect(result.current.viz).toBe('table'));
  });

  it('escolha manual do usuario prevalece sobre o metadado', async () => {
    const fetchImpl = fakeFetch(LOAD_SIMPLES);
    const { result } = renderHook(() => useExploration(), { wrapper: wrapper(fetchImpl) });
    await waitFor(() => expect(result.current.meta).toBeDefined());

    act(() => result.current.dispatch({ type: 'toggleMeasure', member: 'pedidos.receita_cents' }));
    await waitFor(() => expect(result.current.viz).toBe('bar'));

    act(() => result.current.dispatch({ type: 'setViz', viz: 'line' }));
    expect(result.current.viz).toBe('line');
  });

  it('visualizacao declarada que o renderizador nao suporta cai para table', async () => {
    const fetchImpl = fakeFetch(LOAD_SIMPLES);
    const { result } = renderHook(() => useExploration(), {
      // O modelo declara `bar` para receita; este renderizador nao entrega bar.
      wrapper: wrapper(fetchImpl, undefined, fakeChartRenderer(['bar'])),
    });
    await waitFor(() => expect(result.current.meta).toBeDefined());

    act(() => result.current.dispatch({ type: 'toggleMeasure', member: 'pedidos.receita_cents' }));

    await waitFor(() => expect(result.current.result).toBeDefined());
    expect(result.current.viz).toBe('table');
  });

  it('sem chartRenderer, so table e number sao oferecidos', async () => {
    const fetchImpl = fakeFetch(LOAD_SIMPLES);
    const { result } = renderHook(() => useExploration(), {
      wrapper: wrapper(fetchImpl, undefined, null),
    });
    await waitFor(() => expect(result.current.meta).toBeDefined());

    expect(result.current.availableViz).toEqual(['table', 'number']);
  });

  it('oferece apenas o que o renderizador entrega', async () => {
    const fetchImpl = fakeFetch(LOAD_SIMPLES);
    const { result } = renderHook(() => useExploration(), {
      wrapper: wrapper(fetchImpl, undefined, fakeChartRenderer(['pie', 'area'])),
    });
    await waitFor(() => expect(result.current.meta).toBeDefined());

    expect(result.current.availableViz).not.toContain('pie');
    expect(result.current.availableViz).not.toContain('area');
    expect(result.current.availableViz).toContain('bar');
  });

  it('so oferece comparacao havendo dimensao temporal', async () => {
    const fetchImpl = fakeFetch(LOAD_SIMPLES);
    const { result } = renderHook(() => useExploration(), { wrapper: wrapper(fetchImpl) });
    await waitFor(() => expect(result.current.meta).toBeDefined());

    act(() => result.current.dispatch({ type: 'toggleMeasure', member: 'pedidos.receita_cents' }));
    await waitFor(() => expect(result.current.result).toBeDefined());
    expect(result.current.canCompare).toBe(false);

    act(() =>
      result.current.dispatch({ type: 'setTimeDimension', dimension: 'pedidos.criado_em' }),
    );
    await waitFor(() => expect(result.current.canCompare).toBe(true));
  });

  it('emite telemetria com membros, origem e duracao', async () => {
    const eventos: AnalyticsEvent[] = [];
    const fetchImpl = fakeFetch(LOAD_SIMPLES);
    const { result } = renderHook(() => useExploration({ origin: 'widget' }), {
      wrapper: wrapper(fetchImpl, (event) => eventos.push(event)),
    });
    await waitFor(() => expect(result.current.meta).toBeDefined());

    act(() => result.current.dispatch({ type: 'toggleMeasure', member: 'pedidos.receita_cents' }));
    await waitFor(() => expect(eventos).toHaveLength(1));

    expect(eventos[0]).toMatchObject({
      type: 'query_executed',
      members: ['pedidos.receita_cents'],
      origin: 'widget',
      rowCount: 2,
    });
    expect(typeof eventos[0]?.durationMs).toBe('number');
  });

  it('traduz timeout em erro tratavel e emite telemetria de falha', async () => {
    const eventos: AnalyticsEvent[] = [];
    const fetchImpl = fakeFetch(ERRO_TIMEOUT, { status: 504 });
    const { result } = renderHook(() => useExploration(), {
      wrapper: wrapper(fetchImpl, (event) => eventos.push(event)),
    });
    await waitFor(() => expect(result.current.meta).toBeDefined());

    act(() => result.current.dispatch({ type: 'toggleMeasure', member: 'pedidos.receita_cents' }));

    await waitFor(() => expect(result.current.error?.code).toBe('QUERY_TIMEOUT'));
    expect(eventos[0]).toMatchObject({ type: 'query_failed', errorCode: 'QUERY_TIMEOUT' });
  });

  it('nao reenvia membro ausente da introspeccao', async () => {
    const fetchImpl = fakeFetch(LOAD_SIMPLES);
    const { result } = renderHook(
      () =>
        useExploration({
          initialState: {
            query: { measures: ['pedidos.receita_cents', 'pedidos.membro_extinto'] },
            viz: { type: 'table' },
            vizAuto: true,
          },
        }),
      { wrapper: wrapper(fetchImpl) },
    );

    await waitFor(() => expect(result.current.result).toBeDefined());

    expect(result.current.reconciliation?.removedCount).toBe(1);
    const chamadaDeCarga = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls.find(
      (call) => String(call[0]).endsWith('/v1/load'),
    );
    expect(String(chamadaDeCarga?.[1]?.body)).not.toContain('membro_extinto');
  });
});

describe('provider', () => {
  it('falha em desenvolvimento com mensagem acionavel quando falta porta obrigatoria', () => {
    const ports = {
      savedQueryStore: createInMemorySavedQueryStore(),
      formatter: ptBrFormatter,
    } as unknown as AnalyticsPorts;

    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      renderHook(() => useExploration(), {
        wrapper: ({ children }) => (
          <AnalyticsProvider baseUrl="/api/analytics" ports={ports}>
            {children}
          </AnalyticsProvider>
        ),
      }),
    ).toThrow(/tokenProvider/);
    error.mockRestore();
  });
});
