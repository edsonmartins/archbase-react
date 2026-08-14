import { useCallback, useRef } from 'react';
import { useAnalyticsContext } from '../provider/AnalyticsContext';

/** Teto de sugestoes. Lista longa nao ajuda a escolher e custa consulta. */
const LIMITE_PADRAO = 200;

export interface UseMemberValuesOptions {
  limit?: number;
}

export interface UseMemberValuesResult {
  suggest: (member: string) => Promise<string[]>;
  invalidate: (member?: string) => void;
}

/**
 * Valores distintos de um membro, para sugestao em filtro.
 *
 * E uma consulta como qualquer outra — passa pelo mesmo backend, com o mesmo
 * token e a mesma autorizacao. Valor que o usuario nao pode ver nao volta, e a
 * sugestao herda a restricao sem que exista regra local para isso.
 */
export function useMemberValues(options: UseMemberValuesOptions = {}): UseMemberValuesResult {
  const { client } = useAnalyticsContext();
  const limit = options.limit ?? LIMITE_PADRAO;

  // Cache por membro dentro do ciclo de vida do componente: reabrir o mesmo
  // filtro nao deve refazer a consulta.
  const cache = useRef(new Map<string, Promise<string[]>>());

  const suggest = useCallback(
    (member: string): Promise<string[]> => {
      const cached = cache.current.get(member);
      if (cached) return cached;

      const promise = client
        .load({ dimensions: [member], limit })
        .then((response) => {
          const rows = response.resultSets[0]?.data ?? [];
          const values = new Set<string>();
          for (const row of rows) {
            const value = row[member];
            if (value !== null && value !== undefined) values.add(String(value));
          }
          return [...values];
        })
        .catch(() => {
          // Falha de sugestao nao bloqueia o filtro: o campo continua aceitando
          // digitacao livre. Descarta do cache para permitir nova tentativa.
          cache.current.delete(member);
          return [];
        });

      cache.current.set(member, promise);
      return promise;
    },
    [client, limit],
  );

  const invalidate = useCallback((member?: string) => {
    if (member === undefined) cache.current.clear();
    else cache.current.delete(member);
  }, []);

  return { suggest, invalidate };
}
