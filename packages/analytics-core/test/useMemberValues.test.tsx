import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { AnalyticsProvider } from '../src/provider/AnalyticsProvider';
import { clearMetaCache } from '../src/meta/useAnalyticsMeta';
import { useMemberValues } from '../src/meta/useMemberValues';
import { createInMemorySavedQueryStore } from '../src/reference/inMemorySavedQueryStore';
import { ptBrFormatter } from '../src/reference/formatterPtBR';
import type { AnalyticsPorts } from '../src/ports/types';
import { FAKE_META } from './fixtures/fakeModel';

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

const VALORES = {
  results: [
    {
      query: { dimensions: ['pedidos.canal'] },
      data: [
        { 'pedidos.canal': 'Loja' },
        { 'pedidos.canal': 'Online' },
        // Repetido de proposito: a sugestao precisa ser distinta.
        { 'pedidos.canal': 'Loja' },
        { 'pedidos.canal': null },
      ],
      annotation: {},
    },
  ],
};

function wrapper(fetchImpl: typeof fetch) {
  const ports: AnalyticsPorts = {
    tokenProvider: async () => 'Bearer t',
    savedQueryStore: createInMemorySavedQueryStore(),
    formatter: ptBrFormatter,
  };

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <AnalyticsProvider baseUrl="/api/analytics" ports={ports} fetchImpl={fetchImpl}>
        {children}
      </AnalyticsProvider>
    );
  };
}

beforeEach(() => clearMetaCache());

describe('sugestao de valores de membro', () => {
  it('devolve valores distintos, descartando ausencia', async () => {
    const fetchImpl = vi.fn(async (url: string) =>
      String(url).endsWith('/v1/meta') ? jsonResponse(FAKE_META) : jsonResponse(VALORES),
    ) as unknown as typeof fetch;

    const { result } = renderHook(() => useMemberValues(), { wrapper: wrapper(fetchImpl) });

    const valores = await result.current.suggest('pedidos.canal');
    expect(valores).toEqual(['Loja', 'Online']);
  });

  it('reaproveita a consulta ao reabrir o mesmo filtro', async () => {
    const fetchImpl = vi.fn(async (url: string) =>
      String(url).endsWith('/v1/meta') ? jsonResponse(FAKE_META) : jsonResponse(VALORES),
    ) as unknown as typeof fetch;

    const { result } = renderHook(() => useMemberValues(), { wrapper: wrapper(fetchImpl) });

    await result.current.suggest('pedidos.canal');
    await result.current.suggest('pedidos.canal');

    const cargas = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls.filter((call) =>
      String(call[0]).endsWith('/v1/load'),
    );
    expect(cargas).toHaveLength(1);
  });

  it('falha de sugestao devolve lista vazia, sem bloquear o filtro', async () => {
    const fetchImpl = vi.fn(async (url: string) =>
      String(url).endsWith('/v1/meta')
        ? jsonResponse(FAKE_META)
        : jsonResponse({ error: { code: 'QUERY_TIMEOUT' } }, { status: 504 }),
    ) as unknown as typeof fetch;

    const { result } = renderHook(() => useMemberValues(), { wrapper: wrapper(fetchImpl) });

    await expect(result.current.suggest('pedidos.canal')).resolves.toEqual([]);
  });

  it('permite nova tentativa apos falha', async () => {
    let falhar = true;
    const fetchImpl = vi.fn(async (url: string) => {
      if (String(url).endsWith('/v1/meta')) return jsonResponse(FAKE_META);
      if (falhar) {
        falhar = false;
        return jsonResponse({ error: { code: 'UPSTREAM_ERROR' } }, { status: 502 });
      }
      return jsonResponse(VALORES);
    }) as unknown as typeof fetch;

    const { result } = renderHook(() => useMemberValues(), { wrapper: wrapper(fetchImpl) });

    expect(await result.current.suggest('pedidos.canal')).toEqual([]);
    // O cache descarta a promessa falha, senao o filtro ficaria vazio para
    // sempre depois de um timeout passageiro.
    await waitFor(async () =>
      expect(await result.current.suggest('pedidos.canal')).toEqual(['Loja', 'Online']),
    );
  });

  it('respeita o teto de sugestoes na consulta', async () => {
    const fetchImpl = vi.fn(async (url: string) =>
      String(url).endsWith('/v1/meta') ? jsonResponse(FAKE_META) : jsonResponse(VALORES),
    ) as unknown as typeof fetch;

    const { result } = renderHook(() => useMemberValues({ limit: 25 }), {
      wrapper: wrapper(fetchImpl),
    });

    await result.current.suggest('pedidos.canal');

    const carga = (fetchImpl as unknown as ReturnType<typeof vi.fn>).mock.calls.find((call) =>
      String(call[0]).endsWith('/v1/load'),
    );
    expect(String(carga?.[1]?.body)).toContain('"limit":25');
  });
});
