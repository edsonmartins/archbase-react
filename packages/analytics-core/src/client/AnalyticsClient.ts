import type { AnalyticsQuery } from '../exploration/types';
import type { RawMetaResponse } from '../meta/types';
import { AnalyticsError, toAnalyticsError } from './errors';

/** Cabecalhos de truncamento. RFC de contratos, secao 3.2. */
const HEADER_TRUNCATED = 'X-Analytics-Truncated';
const HEADER_ROW_LIMIT = 'X-Analytics-Row-Limit';

export interface RawResultSet {
  query?: AnalyticsQuery;
  data?: Array<Record<string, unknown>>;
  annotation?: unknown;
}

export interface LoadResponse {
  /** Um conjunto por periodo. Comparacao produz mais de um. */
  resultSets: RawResultSet[];
  truncated: boolean;
  rowLimit?: number;
}

export interface AnalyticsClientOptions {
  /** Prefixo do hospedeiro. A biblioteca nunca monta caminho fixo. */
  baseUrl: string;
  tokenProvider: () => Promise<string>;
  fetchImpl?: typeof fetch;
}

function joinUrl(baseUrl: string, path: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}

/**
 * Normaliza as duas formas de envelope de carga da camada semantica: a moderna,
 * com `results`, e a antiga, com `data` na raiz. Sem isso a versao do servidor
 * vazaria para o Anel 1.
 */
function toResultSets(body: unknown): RawResultSet[] {
  if (typeof body !== 'object' || body === null) return [];

  const withResults = body as { results?: unknown };
  if (Array.isArray(withResults.results)) {
    return withResults.results as RawResultSet[];
  }

  const flat = body as RawResultSet;
  return Array.isArray(flat.data) ? [flat] : [];
}

export class AnalyticsClient {
  private readonly baseUrl: string;
  private readonly tokenProvider: () => Promise<string>;
  private readonly fetchImpl: typeof fetch;

  constructor(options: AnalyticsClientOptions) {
    this.baseUrl = options.baseUrl;
    this.tokenProvider = options.tokenProvider;
    this.fetchImpl = options.fetchImpl ?? globalThis.fetch.bind(globalThis);
  }

  async loadMeta(signal?: AbortSignal): Promise<RawMetaResponse> {
    const response = await this.request('v1/meta', { method: 'GET' }, signal);
    const body = await this.parseBody(response);
    return (typeof body === 'object' && body !== null ? body : {}) as RawMetaResponse;
  }

  async load(query: AnalyticsQuery, signal?: AbortSignal): Promise<LoadResponse> {
    const response = await this.request(
      'v1/load',
      { method: 'POST', body: JSON.stringify({ query }) },
      signal,
    );
    const body = await this.parseBody(response);

    const rowLimitHeader = response.headers.get(HEADER_ROW_LIMIT);
    const rowLimit = rowLimitHeader === null ? undefined : Number(rowLimitHeader);

    return {
      resultSets: toResultSets(body),
      truncated: response.headers.get(HEADER_TRUNCATED) === 'true',
      rowLimit: rowLimit === undefined || Number.isNaN(rowLimit) ? undefined : rowLimit,
    };
  }

  /**
   * Executa a requisicao, renovando o token uma unica vez diante de 401.
   *
   * Uma tentativa apenas: token recem-obtido que segue recusado indica problema
   * de emissao, e repetir so multiplica carga sobre o emissor.
   */
  private async request(path: string, init: RequestInit, signal?: AbortSignal): Promise<Response> {
    const response = await this.send(path, init, signal);
    if (response.status !== 401) return response;

    const retried = await this.send(path, init, signal);
    if (retried.status === 401) {
      throw new AnalyticsError('UPSTREAM_ERROR', { status: 401 });
    }
    return retried;
  }

  private async send(path: string, init: RequestInit, signal?: AbortSignal): Promise<Response> {
    let token: string;
    try {
      token = await this.tokenProvider();
    } catch (cause) {
      throw new AnalyticsError('NETWORK', { cause });
    }

    try {
      return await this.fetchImpl(joinUrl(this.baseUrl, path), {
        ...init,
        signal,
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
          ...(init.headers ?? {}),
        },
      });
    } catch (cause) {
      // Aborto e intencao do chamador, nao falha de rede: propaga inalterado
      // para que a troca rapida de consulta nao vire mensagem de erro.
      if (cause instanceof DOMException && cause.name === 'AbortError') throw cause;
      throw new AnalyticsError('NETWORK', { cause });
    }
  }

  private async parseBody(response: Response): Promise<unknown> {
    let body: unknown;
    try {
      body = await response.json();
    } catch {
      body = undefined;
    }

    if (!response.ok) {
      throw toAnalyticsError(body, response.status);
    }
    return body;
  }
}
