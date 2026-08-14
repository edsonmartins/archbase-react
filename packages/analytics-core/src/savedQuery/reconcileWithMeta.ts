import type { AnalyticsQuery } from '../exploration/types';
import type { AnalyticsMeta } from '../meta/types';

export interface ReconcileResult {
  query: AnalyticsQuery;
  /**
   * Quantidade de membros distintos removidos.
   *
   * Deliberadamente quantitativo: identificar o que foi removido revelaria a
   * existencia de dados restritos ao leitor, que e o vazamento de metadado que
   * o ADR de arquitetura, secao 2.6, proibe.
   */
  removedCount: number;
  /** Verdadeiro quando nada sobrou de consultavel. */
  allRemoved: boolean;
  degraded: boolean;
}

export function reconcileWithMeta(query: AnalyticsQuery, meta: AnalyticsMeta): ReconcileResult {
  const removed = new Set<string>();
  const available = (member: string): boolean => {
    if (meta.byName.has(member)) return true;
    removed.add(member);
    return false;
  };

  const measures = (query.measures ?? []).filter(available);
  const dimensions = (query.dimensions ?? []).filter(available);
  const filters = (query.filters ?? []).filter((filter) => available(filter.member));
  const timeDimensions = (query.timeDimensions ?? []).filter((timeDimension) =>
    available(timeDimension.dimension),
  );

  // A ordenacao referencia membros da consulta: o que saiu da consulta nao pode
  // permanecer ordenando-a.
  const survivors = new Set<string>([
    ...measures,
    ...dimensions,
    ...timeDimensions.map((timeDimension) => timeDimension.dimension),
  ]);
  const order = (query.order ?? []).filter(([member]) => {
    if (survivors.has(member)) return true;
    // Chave com granularidade (`cubo.membro.day`) referencia a dimensao base.
    const lastDot = member.lastIndexOf('.');
    return lastDot !== -1 && survivors.has(member.slice(0, lastDot));
  });

  const reconciled: AnalyticsQuery = { ...query, measures, dimensions, filters, timeDimensions, order };
  const empty = measures.length === 0 && dimensions.length === 0 && timeDimensions.length === 0;

  return {
    query: reconciled,
    removedCount: removed.size,
    allRemoved: removed.size > 0 && empty,
    degraded: removed.size > 0,
  };
}
