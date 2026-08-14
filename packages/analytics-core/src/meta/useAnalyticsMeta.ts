import { useCallback, useEffect, useState } from 'react';
import type { AnalyticsClient } from '../client/AnalyticsClient';
import { AnalyticsError } from '../client/errors';
import { useAnalyticsContext } from '../provider/AnalyticsContext';
import { normalizeMeta } from './normalizeMeta';
import type { AnalyticsMeta } from './types';

/*
 * Cache proprio, deliberadamente sem @tanstack/react-query.
 *
 * O react-query e a convencao do monorepo (@archbase/core, @archbase/data,
 * @archbase/ssr o utilizam) e seria a escolha natural aqui. A divergencia e
 * intencional: o ADR de arquitetura, secao 2.2, restringe o Anel 1 a uma unica
 * dependencia — o cliente da camada semantica. Acrescentar react-query ao
 * nucleo headless quebraria essa restricao e arrastaria o cliente do hospedeiro
 * para uma versao especifica da biblioteca de cache.
 *
 * Nao "corrija" para react-query sem antes revisar aquela decisao.
 */

interface CacheEntry {
  meta: AnalyticsMeta;
  fetchedAt: number;
}

const cache = new Map<string, CacheEntry>();

/**
 * Requisicoes em voo, para que varios widgets montando juntos compartilhem uma
 * unica chamada de introspeccao em vez de multiplica-la.
 */
const inflight = new Map<string, Promise<AnalyticsMeta>>();

/** Usado pelos testes e pela invalidacao explicita do hospedeiro. */
export function clearMetaCache(baseUrl?: string): void {
  if (baseUrl === undefined) {
    cache.clear();
    inflight.clear();
    return;
  }
  cache.delete(baseUrl);
  inflight.delete(baseUrl);
}

function fetchMeta(client: AnalyticsClient, baseUrl: string): Promise<AnalyticsMeta> {
  const existing = inflight.get(baseUrl);
  if (existing) return existing;

  const promise = client
    .loadMeta()
    .then((raw) => {
      const meta = normalizeMeta(raw);
      cache.set(baseUrl, { meta, fetchedAt: Date.now() });
      return meta;
    })
    .finally(() => {
      inflight.delete(baseUrl);
    });

  inflight.set(baseUrl, promise);
  return promise;
}

function readFresh(baseUrl: string, ttlMs: number): AnalyticsMeta | undefined {
  const entry = cache.get(baseUrl);
  if (!entry) return undefined;
  return Date.now() - entry.fetchedAt < ttlMs ? entry.meta : undefined;
}

export interface UseAnalyticsMetaResult {
  meta: AnalyticsMeta | undefined;
  loading: boolean;
  error: AnalyticsError | undefined;
  /** Descarta o cache e recarrega. */
  refresh: () => Promise<void>;
}

/**
 * Introspeccao do modelo, com cache por `baseUrl` e invalidacao por tempo.
 *
 * A chave e o `baseUrl` e nao a identidade do usuario: o token acompanha cada
 * requisicao e a resposta ja chega restrita ao escopo de quem perguntou. Trocar
 * de usuario dentro da mesma aplicacao exige `refresh`, e por isso a funcao e
 * exportada.
 */
export function useAnalyticsMeta(): UseAnalyticsMetaResult {
  const { client, config } = useAnalyticsContext();
  const { baseUrl, metaCacheTtlMs } = config;

  const [meta, setMeta] = useState<AnalyticsMeta | undefined>(() =>
    readFresh(baseUrl, metaCacheTtlMs),
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AnalyticsError | undefined>(undefined);

  const load = useCallback(
    async (force: boolean, alive: () => boolean) => {
      if (!force) {
        const fresh = readFresh(baseUrl, metaCacheTtlMs);
        if (fresh) {
          if (alive()) setMeta(fresh);
          return;
        }
      }

      setLoading(true);
      setError(undefined);

      try {
        const loaded = await fetchMeta(client, baseUrl);
        if (alive()) setMeta(loaded);
      } catch (cause) {
        if (alive()) {
          setError(
            cause instanceof AnalyticsError ? cause : new AnalyticsError('UPSTREAM_ERROR', { cause }),
          );
        }
      } finally {
        if (alive()) setLoading(false);
      }
    },
    [client, baseUrl, metaCacheTtlMs],
  );

  useEffect(() => {
    let mounted = true;
    void load(false, () => mounted);
    return () => {
      mounted = false;
    };
  }, [load]);

  const refresh = useCallback(async () => {
    clearMetaCache(baseUrl);
    await load(true, () => true);
  }, [baseUrl, load]);

  return { meta, loading, error, refresh };
}
