import type { AnalyticsErrorCode } from '../ports/types';

const KNOWN_CODES: readonly AnalyticsErrorCode[] = [
  'QUERY_TIMEOUT',
  'CONCURRENCY_LIMIT',
  'FORBIDDEN_MEMBER',
  'UPSTREAM_ERROR',
  'NETWORK',
];

/**
 * Falha de analytics.
 *
 * A biblioteca trata exclusivamente `code`. A mensagem textual do servidor nunca
 * e interpretada: fica em `serverMessage`, exibivel apenas em desenvolvimento.
 * RFC de contratos, secao 3.3.
 */
export class AnalyticsError extends Error {
  readonly code: AnalyticsErrorCode;
  readonly retryable: boolean;
  readonly status?: number;
  readonly serverMessage?: string;

  constructor(
    code: AnalyticsErrorCode,
    options: { retryable?: boolean; status?: number; serverMessage?: string; cause?: unknown } = {},
  ) {
    super(code, { cause: options.cause });
    this.name = 'AnalyticsError';
    this.code = code;
    this.retryable = options.retryable ?? (code === 'CONCURRENCY_LIMIT' || code === 'NETWORK');
    this.status = options.status;
    this.serverMessage = options.serverMessage;
  }
}

export function isAnalyticsError(value: unknown): value is AnalyticsError {
  return value instanceof AnalyticsError;
}

function isKnownCode(value: unknown): value is AnalyticsErrorCode {
  return typeof value === 'string' && (KNOWN_CODES as readonly string[]).includes(value);
}

/**
 * Traduz o envelope de falha em `AnalyticsError`.
 *
 * Codigo fora do conjunto fechado degrada para `UPSTREAM_ERROR` em vez de
 * propagar valor desconhecido: a interface so sabe reagir ao conjunto acordado,
 * e um codigo novo introduzido pelo servidor nao pode quebrar o cliente.
 */
export function toAnalyticsError(body: unknown, status: number): AnalyticsError {
  const envelope =
    typeof body === 'object' && body !== null ? (body as { error?: unknown }).error : undefined;

  const error =
    typeof envelope === 'object' && envelope !== null
      ? (envelope as { code?: unknown; retryable?: unknown; message?: unknown })
      : undefined;

  const rawCode = error?.code;
  const code: AnalyticsErrorCode = isKnownCode(rawCode) ? rawCode : 'UPSTREAM_ERROR';

  return new AnalyticsError(code, {
    retryable: typeof error?.retryable === 'boolean' ? error.retryable : undefined,
    status,
    serverMessage: typeof error?.message === 'string' ? error.message : undefined,
  });
}
