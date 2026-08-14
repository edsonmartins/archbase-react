import { describe, expect, it, vi } from 'vitest';
import { AnalyticsClient } from '../src/client/AnalyticsClient';
import { AnalyticsError } from '../src/client/errors';
import {
  ERRO_CONCORRENCIA,
  ERRO_DESCONHECIDO,
  ERRO_TIMEOUT,
  LOAD_LEGADO,
  LOAD_SIMPLES,
} from './fixtures/loadResponse';
import { FAKE_META } from './fixtures/fakeModel';

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
}

function clientWith(fetchImpl: typeof fetch, tokenProvider = async () => 'Bearer t') {
  return new AnalyticsClient({ baseUrl: '/api/analytics', tokenProvider, fetchImpl });
}

describe('cliente de transporte', () => {
  it('acrescenta o caminho ao baseUrl do hospedeiro sem montar prefixo proprio', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(FAKE_META));
    await clientWith(fetchImpl as unknown as typeof fetch).loadMeta();

    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(fetchImpl.mock.calls[0]?.[0]).toBe('/api/analytics/v1/meta');
  });

  it('envia o token obtido pela porta', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(FAKE_META));
    await clientWith(fetchImpl as unknown as typeof fetch, async () => 'Bearer abc').loadMeta();

    const init = fetchImpl.mock.calls[0]?.[1] as RequestInit;
    expect((init.headers as Record<string, string>).Authorization).toBe('Bearer abc');
  });

  it('normaliza o envelope moderno com results', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(LOAD_SIMPLES));
    const response = await clientWith(fetchImpl as unknown as typeof fetch).load({});

    expect(response.resultSets).toHaveLength(1);
    expect(response.resultSets[0]?.data).toHaveLength(2);
  });

  it('normaliza o envelope antigo sem results', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(LOAD_LEGADO));
    const response = await clientWith(fetchImpl as unknown as typeof fetch).load({});

    expect(response.resultSets).toHaveLength(1);
    expect(response.resultSets[0]?.data).toHaveLength(1);
  });

  it('le o truncamento pelos cabecalhos, preservando o corpo nativo', async () => {
    const fetchImpl = vi.fn(async () =>
      jsonResponse(LOAD_SIMPLES, {
        headers: {
          'Content-Type': 'application/json',
          'X-Analytics-Truncated': 'true',
          'X-Analytics-Row-Limit': '50000',
        },
      }),
    );
    const response = await clientWith(fetchImpl as unknown as typeof fetch).load({});

    expect(response.truncated).toBe(true);
    expect(response.rowLimit).toBe(50000);
    expect(response.resultSets[0]?.data).toHaveLength(2);
  });

  it('traduz o envelope de falha para o codigo fechado', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(ERRO_TIMEOUT, { status: 504 }));
    await expect(clientWith(fetchImpl as unknown as typeof fetch).load({})).rejects.toMatchObject({
      code: 'QUERY_TIMEOUT',
    });
  });

  it('marca CONCURRENCY_LIMIT como recuperavel', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(ERRO_CONCORRENCIA, { status: 429 }));
    await expect(clientWith(fetchImpl as unknown as typeof fetch).load({})).rejects.toMatchObject({
      code: 'CONCURRENCY_LIMIT',
      retryable: true,
    });
  });

  it('degrada codigo fora do conjunto fechado para UPSTREAM_ERROR', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(ERRO_DESCONHECIDO, { status: 500 }));
    await expect(clientWith(fetchImpl as unknown as typeof fetch).load({})).rejects.toMatchObject({
      code: 'UPSTREAM_ERROR',
    });
  });

  it('renova o token uma unica vez diante de 401', async () => {
    let calls = 0;
    const fetchImpl = vi.fn(async () => {
      calls += 1;
      return calls === 1 ? jsonResponse({}, { status: 401 }) : jsonResponse(FAKE_META);
    });

    await clientWith(fetchImpl as unknown as typeof fetch).loadMeta();
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('desiste apos a segunda recusa em vez de insistir sobre o emissor', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse({}, { status: 401 }));
    await expect(clientWith(fetchImpl as unknown as typeof fetch).loadMeta()).rejects.toBeInstanceOf(
      AnalyticsError,
    );
    expect(fetchImpl).toHaveBeenCalledTimes(2);
  });

  it('classifica falha antes da resposta como NETWORK', async () => {
    const fetchImpl = vi.fn(async () => {
      throw new TypeError('failed to fetch');
    });
    await expect(clientWith(fetchImpl as unknown as typeof fetch).loadMeta()).rejects.toMatchObject({
      code: 'NETWORK',
    });
  });

  it('classifica falha do tokenProvider como NETWORK, sem chamar a rede', async () => {
    const fetchImpl = vi.fn(async () => jsonResponse(FAKE_META));
    const client = clientWith(fetchImpl as unknown as typeof fetch, async () => {
      throw new Error('sem sessao');
    });

    await expect(client.loadMeta()).rejects.toMatchObject({ code: 'NETWORK' });
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
