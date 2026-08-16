import type { ReactNode } from 'react';
import type {
  AnalyticsMember,
  AnalyticsMeta,
  NormalizedResult,
  ResultColumn,
  ResultRow,
} from '../meta/types';
import type { AnalyticsQuery, PivotConfig, SeriesConfig } from '../exploration/types';

/**
 * Vocabulario de metadados. RFC de contratos de transporte e portas, secao 2.
 */
export type MetaFormat =
  | 'currency_cents'
  | 'integer'
  | 'decimal'
  | 'percent'
  | 'date'
  | 'datetime'
  | 'text';

export type VizType = 'table' | 'bar' | 'line' | 'area' | 'pie' | 'number';

export const META_FORMATS: readonly MetaFormat[] = [
  'currency_cents',
  'integer',
  'decimal',
  'percent',
  'date',
  'datetime',
  'text',
];

export const VIZ_TYPES: readonly VizType[] = ['table', 'bar', 'line', 'area', 'pie', 'number'];

/** RFC secao 2.1: ausencia equivale a `text`. */
export const DEFAULT_META_FORMAT: MetaFormat = 'text';

/** RFC secao 2.3: ausencia resolve para `table`. */
export const DEFAULT_VIZ: VizType = 'table';

/** RFC secao 2.1: `decimal` com `meta.precision` opcional, default 2. */
export const DEFAULT_DECIMAL_PRECISION = 2;

/**
 * Codigos de falha. RFC secao 3.3.
 * `NETWORK` e interno da biblioteca, para falha antes da resposta.
 */
export type AnalyticsErrorCode =
  | 'QUERY_TIMEOUT'
  | 'CONCURRENCY_LIMIT'
  | 'FORBIDDEN_MEMBER'
  | 'UPSTREAM_ERROR'
  | 'NETWORK';

export type SavedQueryScope = 'private' | 'team' | 'org';

export interface SavedQueryV1 {
  schemaVersion: 1;
  query: AnalyticsQuery;
  viz: { type: VizType; pivot?: PivotConfig; series?: SeriesConfig };
  meta: { name: string; ownerId: string; scope: SavedQueryScope };
  /**
   * Estado de UI opcional, opaco para o nucleo: persistido e devolvido tal e
   * qual, sem interpretacao. Usado pelo workspace dockview para gravar o layout
   * dos paineis junto da consulta (chave `workspaceLayout`).
   */
  ui?: Record<string, unknown>;
}

export interface SavedQueryRecord extends SavedQueryV1 {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavedQueryStore {
  list(scope?: SavedQueryScope): Promise<SavedQueryRecord[]>;
  get(id: string): Promise<SavedQueryRecord | null>;
  save(input: SavedQueryV1 & { id?: string }): Promise<SavedQueryRecord>;
  remove(id: string): Promise<void>;
}

export interface AnalyticsEvent {
  type: 'query_executed' | 'query_failed' | 'saved_query_opened';
  members: string[];
  origin: 'explorer' | 'widget';
  durationMs: number;
  rowCount?: number;
  truncated?: boolean;
  savedQueryId?: string;
  errorCode?: AnalyticsErrorCode;
}

/**
 * Contexto de formatacao entregue a porta.
 *
 * A biblioteca nunca transforma o valor: `currency_cents` chega como inteiro em
 * unidade minima e `percent` como fracao 0-1, cabendo a porta multiplicar por
 * 100. RFC secao 2.1.
 */
export interface FormatContext {
  format: MetaFormat;
  precision?: number;
  memberName: string;
  locale: string;
}

export interface ValueFormatter {
  format(value: unknown, context: FormatContext): string;
  /**
   * Ordenacao sobre o valor **bruto**, nunca sobre o texto formatado: ordenar
   * `R$ 1.000,00` como string o colocaria antes de `R$ 9,00`.
   *
   * O `format` do contexto decide a estrategia — numerica, cronologica ou
   * `Intl.Collator` com o locale do contexto. O locale vem do proprio contexto
   * de proposito: como parametro solto permitiria chamada inconsistente com o
   * formato. Pertence a porta por decisao do RFC de metadados, secao 6.7.
   */
  compare(a: unknown, b: unknown, context: FormatContext): number;
}

export interface MemberLabeler {
  label(member: AnalyticsMember, locale: string): string;
  /**
   * Opcional: o host que so quer trocar rotulo nao deve ser obrigado a
   * implementar descricao. Metodo ausente e retorno `undefined` significam a
   * mesma coisa.
   */
  description?(member: AnalyticsMember, locale: string): string | undefined;
}

export interface ChartRenderProps {
  viz: VizType;
  result: NormalizedResult;
  formatter: ValueFormatter;
  locale: string;
}

export interface ChartRenderer {
  /**
   * Interrogacao de capacidade. Sem ela, um renderizador que nao implementa
   * `pie` ainda teria `pie` oferecido no seletor e herdado de
   * `meta.default_viz`, e a falha so apareceria no render.
   */
  supports(viz: VizType): boolean;
  render(props: ChartRenderProps): ReactNode;
}

/**
 * `table` e `number` sao renderizados pela propria biblioteca e nao dependem do
 * renderizador injetado; os demais exigem suporte declarado.
 */
export function isVizAvailable(viz: VizType, chartRenderer?: ChartRenderer): boolean {
  if (viz === 'table' || viz === 'number') return true;
  return chartRenderer?.supports(viz) ?? false;
}

export interface TableRenderProps {
  result: NormalizedResult;
  meta: AnalyticsMeta;
  formatter: ValueFormatter;
  labeler: MemberLabeler;
  locale: string;
  /**
   * Altura sugerida pela composicao. O renderizador pode honrar (tabela
   * virtualizada de altura fixa) ou ignorar (grade que preenche o container).
   */
  height?: number;
  /**
   * Esquema de cores do hospedeiro. Quando ausente, o renderizador pode inferir
   * (ex.: `prefers-color-scheme`); quando presente, deve segui-lo — e o que faz
   * a grade acompanhar o toggle de tema claro/escuro do host.
   */
  colorScheme?: 'light' | 'dark';
  onDrill?: (row: ResultRow, column: ResultColumn) => void;
}

/**
 * Renderizador de tabela injetavel. Diferente do `ChartRenderer`, nao ha
 * `supports`: existe uma unica visualizacao de tabela; ausencia do port faz a
 * biblioteca usar a tabela Mantine embutida. Este e o ponto de extensao para
 * grades ricas de BI (VTable etc.) sem trazer o peso delas ao pacote base.
 */
export interface TableRenderer {
  render(props: TableRenderProps): ReactNode;
}

export interface AnalyticsPorts {
  tokenProvider: () => Promise<string>;
  savedQueryStore: SavedQueryStore;
  formatter: ValueFormatter;
  labeler?: MemberLabeler;
  chartRenderer?: ChartRenderer;
  tableRenderer?: TableRenderer;
  telemetry?: (event: AnalyticsEvent) => void;
}

/**
 * RFC secao 4: obrigatorias na montagem. `chartRenderer` e validada no uso,
 * porque consumo headless do nucleo e caso legitimo; `labeler` e `telemetry`
 * sao opcionais.
 */
export const REQUIRED_PORTS = ['tokenProvider', 'savedQueryStore', 'formatter'] as const;

export type RequiredPortName = (typeof REQUIRED_PORTS)[number];
