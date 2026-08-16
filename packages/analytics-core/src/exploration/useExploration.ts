import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { AnalyticsError } from '../client/errors';
import { useAnalyticsMeta } from '../meta/useAnalyticsMeta';
import type { AnalyticsMeta, NormalizedResult } from '../meta/types';
import { useAnalyticsContext } from '../provider/AnalyticsContext';
import { DEFAULT_VIZ, VIZ_TYPES, isVizAvailable, type ChartRenderer, type VizType } from '../ports/types';
import { normalizeResult } from '../result/normalizeResult';
import { reconcileWithMeta, type ReconcileResult } from '../savedQuery/reconcileWithMeta';
import { EMPTY_EXPLORATION, explorationReducer, type ExplorationAction } from './explorationReducer';
import type { AnalyticsQuery, ExplorationState, FilterOperator, QueryFilter } from './types';

/** Membros efetivamente referenciados pela consulta, para telemetria. */
function membersOf(query: AnalyticsQuery): string[] {
  return [
    ...(query.measures ?? []),
    ...(query.dimensions ?? []),
    ...(query.timeDimensions ?? []).map((timeDimension) => timeDimension.dimension),
  ];
}

/** Consulta executavel precisa de ao menos um membro agregavel ou agrupavel. */
export function isRunnable(query: AnalyticsQuery): boolean {
  return (
    (query.measures?.length ?? 0) > 0 ||
    (query.dimensions?.length ?? 0) > 0 ||
    (query.timeDimensions?.length ?? 0) > 0
  );
}

/** Operadores que nao dependem de valor. */
const OPERADORES_SEM_VALOR: readonly FilterOperator[] = ['set', 'notSet'];

/** Um filtro so entra na carga quando esta completo: operador sem valor, ou com
 *  ao menos um valor nao-vazio. Assim uma linha de filtro recem-adicionada (ou
 *  a meio caminho) nao zera o resultado ate o usuario informar o valor. */
export function isFilterComplete(filter: QueryFilter): boolean {
  if (OPERADORES_SEM_VALOR.includes(filter.operator)) return true;
  return (filter.values ?? []).some((value) => value !== '' && value !== null && value !== undefined);
}

/** Consulta para a carga: descarta filtros incompletos, preservando o resto. */
export function queryForLoad(query: AnalyticsQuery): AnalyticsQuery {
  const filters = query.filters ?? [];
  const completos = filters.filter(isFilterComplete);
  return completos.length === filters.length ? query : { ...query, filters: completos };
}

/**
 * Visualizacao inicial derivada de `meta.default_viz` da primeira measure que a
 * declare. Permanece alteravel pelo usuario, e a primeira alteracao manual
 * desliga a derivacao.
 *
 * Visualizacao declarada que o renderizador injetado nao suporta cai para
 * `table` silenciosamente, como manda o RFC: o modelo declara uma preferencia,
 * nao uma exigencia sobre a capacidade do host.
 */
export function deriveDefaultViz(
  query: AnalyticsQuery,
  meta: AnalyticsMeta | undefined,
  chartRenderer?: ChartRenderer,
): VizType {
  if (!meta) return DEFAULT_VIZ;
  for (const member of query.measures ?? []) {
    const declared = meta.byName.get(member)?.defaultViz;
    if (declared && isVizAvailable(declared, chartRenderer)) return declared;
  }
  return DEFAULT_VIZ;
}

export interface UseExplorationOptions {
  initialState?: ExplorationState;
  origin?: 'explorer' | 'widget';
  /** Executa automaticamente a cada mudanca de consulta valida. */
  autoRun?: boolean;
}

export interface UseExplorationResult {
  state: ExplorationState;
  dispatch: (action: ExplorationAction) => void;
  meta: AnalyticsMeta | undefined;
  metaLoading: boolean;
  result: NormalizedResult | undefined;
  loading: boolean;
  error: AnalyticsError | undefined;
  runnable: boolean;
  /** Comparacao so e oferecida havendo dimensao temporal na consulta. */
  canCompare: boolean;
  viz: VizType;
  /** Visualizacoes que a interface pode oferecer, dado o renderizador injetado. */
  availableViz: VizType[];
  /** Resultado da reconciliacao contra a introspeccao corrente. */
  reconciliation: ReconcileResult | undefined;
  run: () => Promise<void>;
}

export function useExploration(options: UseExplorationOptions = {}): UseExplorationResult {
  const { origin = 'explorer', autoRun = true } = options;
  const { client, ports } = useAnalyticsContext();
  const { meta, loading: metaLoading } = useAnalyticsMeta();

  const [state, dispatch] = useReducer(
    explorationReducer,
    options.initialState ?? EMPTY_EXPLORATION,
  );
  const [result, setResult] = useState<NormalizedResult | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AnalyticsError | undefined>(undefined);

  const abortRef = useRef<AbortController | null>(null);

  // A consulta enviada e sempre a reconciliada: membro que saiu da introspeccao
  // nao pode ser reenviado, sob pena de transformar degradacao em erro 403.
  const reconciliation = useMemo(
    () => (meta ? reconcileWithMeta(state.query, meta) : undefined),
    [state.query, meta],
  );

  const effectiveQuery = reconciliation?.query ?? state.query;
  const runnable = isRunnable(effectiveQuery);

  const viz = state.vizAuto
    ? deriveDefaultViz(effectiveQuery, meta, ports.chartRenderer)
    : state.viz.type;

  /** Visualizacoes que a UI pode oferecer: as que o renderizador entrega. */
  const availableViz = useMemo(
    () => VIZ_TYPES.filter((candidate) => isVizAvailable(candidate, ports.chartRenderer)),
    [ports.chartRenderer],
  );

  const run = useCallback(async () => {
    if (!runnable) {
      setResult(undefined);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(undefined);

    const startedAt = Date.now();
    try {
      const response = await client.load(queryForLoad(effectiveQuery), controller.signal);
      if (controller.signal.aborted) return;

      const normalized = normalizeResult(response, meta ?? emptyMeta(), effectiveQuery);
      setResult(normalized);
      ports.telemetry?.({
        type: 'query_executed',
        members: membersOf(effectiveQuery),
        origin,
        durationMs: Date.now() - startedAt,
        rowCount: normalized.rows.length,
        truncated: normalized.truncated,
      });
    } catch (cause) {
      if (controller.signal.aborted) return;

      const failure =
        cause instanceof AnalyticsError ? cause : new AnalyticsError('UPSTREAM_ERROR', { cause });
      setError(failure);
      ports.telemetry?.({
        type: 'query_failed',
        members: membersOf(effectiveQuery),
        origin,
        durationMs: Date.now() - startedAt,
        errorCode: failure.code,
      });
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [client, effectiveQuery, meta, origin, ports, runnable]);

  const queryKey = JSON.stringify(effectiveQuery);
  useEffect(() => {
    if (!autoRun || !meta) return;
    void run();
    // `queryKey` e a identidade estrutural da consulta: sem ele, cada render
    // recriaria o objeto e dispararia execucao nova.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRun, meta, queryKey]);

  useEffect(() => () => abortRef.current?.abort(), []);

  return {
    state,
    dispatch,
    meta,
    metaLoading,
    result,
    loading,
    error,
    runnable,
    canCompare: (effectiveQuery.timeDimensions?.length ?? 0) > 0,
    viz,
    availableViz,
    reconciliation,
    run,
  };
}

function emptyMeta(): AnalyticsMeta {
  return { members: [], byName: new Map(), measures: [], dimensions: [], timeDimensions: [] };
}
