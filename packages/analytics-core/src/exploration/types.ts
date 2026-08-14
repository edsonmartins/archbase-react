import type { VizType } from '../ports/types';

export type Granularity =
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year';

export const GRANULARITIES: readonly Granularity[] = [
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'quarter',
  'year',
];

export type FilterOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'startsWith'
  | 'endsWith'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'set'
  | 'notSet'
  | 'inDateRange'
  | 'beforeDate'
  | 'afterDate';

/**
 * Filtro de membro. A v0.1 emite apenas filtros planos: a composicao logica
 * aninhada da camada semantica existe no protocolo, mas nao e oferecida pela
 * interface, e por isso nao e modelada aqui — `reconcileWithMeta` depende de
 * poder inspecionar todo membro referenciado sem recursao.
 */
export interface QueryFilter {
  member: string;
  operator: FilterOperator;
  values?: string[];
}

/** Intervalo absoluto `[inicio, fim]` ou expressao relativa (`last 30 days`). */
export type DateRange = string | [string, string];

export interface QueryTimeDimension {
  dimension: string;
  granularity?: Granularity;
  dateRange?: DateRange;
  /**
   * Intervalos de comparacao. A mesma measure retorna para todos os periodos em
   * uma unica consulta — comparacao e propriedade da consulta, nao do modelo.
   * RFC de contratos, secao 6.
   */
  compareDateRange?: DateRange[];
}

export type SortDirection = 'asc' | 'desc';

export interface AnalyticsQuery {
  measures?: string[];
  dimensions?: string[];
  filters?: QueryFilter[];
  timeDimensions?: QueryTimeDimension[];
  order?: Array<[string, SortDirection]>;
  limit?: number;
  offset?: number;
  timezone?: string;
}

export interface PivotConfig {
  x?: string[];
  y?: string[];
}

export interface SeriesConfig {
  hidden?: string[];
}

export interface VizState {
  type: VizType;
  pivot?: PivotConfig;
  series?: SeriesConfig;
}

/**
 * Estado unico de exploracao. Serve simultaneamente ao deep link e a consulta
 * salva: uma unica fonte elimina a divergencia entre o que a URL carrega e o
 * que o registro persistido guarda.
 */
export interface ExplorationState {
  query: AnalyticsQuery;
  viz: VizState;
  /** Presente quando o estado foi aberto a partir de um registro persistido. */
  savedQueryId?: string;
  /** Marca que o usuario ainda nao alterou a visualizacao manualmente. */
  vizAuto: boolean;
}
