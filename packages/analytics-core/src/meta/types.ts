import type { MetaFormat, VizType } from '../ports/types';
import type { AnalyticsQuery, DateRange, Granularity } from '../exploration/types';

export type MemberKind = 'measure' | 'dimension' | 'timeDimension' | 'segment';

/**
 * Objeto `meta` livre de um membro, conforme publicado pelo data model.
 * As chaves conhecidas sao contrato; as demais sao preservadas e ignoradas.
 */
export interface RawMemberMeta {
  i18n?: Record<string, string>;
  i18n_description?: Record<string, string>;
  format?: string;
  group?: string;
  default_viz?: string;
  precision?: number;
  [key: string]: unknown;
}

/** Membro cru, como chega da introspeccao da camada semantica. */
export interface RawMetaMember {
  name: string;
  title?: string;
  shortTitle?: string;
  description?: string;
  type?: string;
  /** Tipo de agregacao declarado no modelo (`sum`, `count`, `avg`, ...). */
  aggType?: string;
  meta?: RawMemberMeta;
}

export interface RawMetaCube {
  name: string;
  title?: string;
  type?: string;
  measures?: RawMetaMember[];
  dimensions?: RawMetaMember[];
  segments?: RawMetaMember[];
}

export interface RawMetaResponse {
  cubes?: RawMetaCube[];
}

/**
 * Membro normalizado. `format` e `defaultViz` ja estao resolvidos ao
 * vocabulario fechado do RFC; valor desconhecido degrada para o default e
 * registra aviso em desenvolvimento, nunca lanca.
 */
export interface AnalyticsMember {
  /** Chave semantica, imutavel e independente de locale. */
  name: string;
  cube: string;
  kind: MemberKind;
  /**
   * Opcional de proposito: o ultimo degrau da cadeia de rotulos e o proprio
   * `name`, e pre-preencher `title` aqui apagaria esse degrau. Modelo bem
   * formado sempre traz `title`; a ausencia sinaliza modelo incompleto.
   */
  title?: string;
  format: MetaFormat;
  precision?: number;
  group?: string;
  defaultViz?: VizType;
  i18n?: Record<string, string>;
  i18nDescription?: Record<string, string>;
  description?: string;
  /** Tipo cru declarado no modelo, preservado para controles temporais. */
  rawType?: string;
  /**
   * Tipo de agregacao, quando declarado. Decide se um bucket temporal sem dado
   * vale zero (aditivo) ou nulo (media, minimo, maximo).
   */
  aggType?: string;
}

export interface AnalyticsMeta {
  members: AnalyticsMember[];
  byName: Map<string, AnalyticsMember>;
  measures: AnalyticsMember[];
  dimensions: AnalyticsMember[];
  timeDimensions: AnalyticsMember[];
}

export interface ResultPeriod {
  /** Indice de ordem: 0 e o periodo principal. */
  index: number;
  dateRange?: DateRange;
  label: string;
}

export interface ResultColumn {
  member: string;
  title: string;
  kind: MemberKind;
  format: MetaFormat;
  precision?: number;
  granularity?: Granularity;
  /**
   * Tipo de agregacao declarado no metadado (`avg`, `sum`, ...). Propagado do
   * membro para que quem agrega no cliente (KPI, grafico) some medidas aditivas
   * mas faca media das nao-aditivas (ex.: ticket medio) — sem re-consultar meta.
   */
  aggType?: string;
}

export type ResultCell = string | number | boolean | null;

export type ResultRow = Record<string, ResultCell>;

/**
 * Variacao entre o periodo principal e um periodo de comparacao.
 *
 * `absolute` e subtracao sobre inteiros quando a measure esta em unidade
 * minima; `ratio` permanece como fracao sem arredondamento, para que o
 * arredondamento ocorra apenas na formatacao. `ratio` e nulo quando a base e
 * zero — variacao percentual sobre zero nao esta definida.
 */
export interface ResultDelta {
  member: string;
  periodIndex: number;
  /** Chave das dimensoes nao temporais que identifica a linha comparada. */
  rowKey: string;
  /** Posicao dentro da chave, usada quando ha granularidade temporal. */
  ordinal: number;
  current: number | null;
  previous: number | null;
  absolute: number | null;
  ratio: number | null;
}

export interface NormalizedResult {
  columns: ResultColumn[];
  rows: ResultRow[];
  /** Um conjunto de linhas por periodo. `periods[0]` e o principal. */
  periods: ResultPeriod[];
  rowsByPeriod: ResultRow[][];
  deltas: ResultDelta[];
  truncated: boolean;
  rowLimit?: number;
  query: AnalyticsQuery;
}
