import type { DeepLinkParams } from '../provider/AnalyticsContext';
import type { AnalyticsQuery, ExplorationState, VizState } from '../exploration/types';
import { DEFAULT_VIZ, VIZ_TYPES, type VizType } from '../ports/types';

/** Prefixo de versao do payload. RFC de contratos, secao 5. */
export const DEEP_LINK_VERSION = 1;

function warnInDev(message: string): void {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[archbase-analytics] ${message}`);
  }
}

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string): string {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

interface DeepLinkPayload {
  query: AnalyticsQuery;
  viz: VizState;
}

export function serializeExploration(state: ExplorationState): string {
  const payload: DeepLinkPayload = { query: state.query, viz: state.viz };
  return `${DEEP_LINK_VERSION}.${toBase64Url(JSON.stringify(payload))}`;
}

/**
 * Le o payload da URL.
 *
 * Payload irreconhecivel e descartado com aviso e nunca produz erro: uma URL
 * truncada ao ser colada em um chat nao pode transformar a abertura da tela em
 * falha. RFC de contratos, secao 5.
 */
export function deserializeExploration(value: string | null | undefined): ExplorationState | null {
  if (!value) return null;

  const separator = value.indexOf('.');
  if (separator === -1) {
    warnInDev('Deep link sem prefixo de versao. Descartado.');
    return null;
  }

  const version = Number(value.slice(0, separator));
  if (version !== DEEP_LINK_VERSION) {
    warnInDev(`Deep link na versao ${value.slice(0, separator)}, nao reconhecida. Descartado.`);
    return null;
  }

  try {
    const decoded: unknown = JSON.parse(fromBase64Url(value.slice(separator + 1)));
    if (typeof decoded !== 'object' || decoded === null) {
      warnInDev('Deep link com payload invalido. Descartado.');
      return null;
    }

    const payload = decoded as Partial<DeepLinkPayload>;
    if (typeof payload.query !== 'object' || payload.query === null) {
      warnInDev('Deep link sem consulta. Descartado.');
      return null;
    }

    const rawType = payload.viz?.type;
    const type: VizType =
      typeof rawType === 'string' && (VIZ_TYPES as readonly string[]).includes(rawType)
        ? (rawType as VizType)
        : DEFAULT_VIZ;

    return {
      query: payload.query,
      viz: { ...payload.viz, type },
      vizAuto: false,
    };
  } catch {
    warnInDev('Deep link ilegivel. Descartado.');
    return null;
  }
}

export interface DeepLinkRead {
  state: ExplorationState | null;
  savedQueryId: string | null;
}

export function readDeepLink(search: string, params: DeepLinkParams): DeepLinkRead {
  const parsed = new URLSearchParams(search);
  return {
    state: deserializeExploration(parsed.get(params.query)),
    savedQueryId: parsed.get(params.savedQueryId),
  };
}

/**
 * Devolve a query string atualizada. O roteamento pertence ao hospedeiro: a
 * biblioteca apenas le e escreve os parametros configurados.
 */
export function writeDeepLink(
  search: string,
  params: DeepLinkParams,
  state: ExplorationState | null,
): string {
  const parsed = new URLSearchParams(search);

  if (state === null) {
    parsed.delete(params.query);
    parsed.delete(params.savedQueryId);
    return parsed.toString();
  }

  parsed.set(params.query, serializeExploration(state));
  if (state.savedQueryId) parsed.set(params.savedQueryId, state.savedQueryId);
  else parsed.delete(params.savedQueryId);

  return parsed.toString();
}
