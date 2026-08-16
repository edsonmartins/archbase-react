import type { LoadResponse } from '../client/AnalyticsClient';
import type { AnalyticsQuery, DateRange, Granularity } from '../exploration/types';
import { GRANULARITIES } from '../exploration/types';
import type {
  AnalyticsMember,
  AnalyticsMeta,
  NormalizedResult,
  ResultCell,
  ResultColumn,
  ResultDelta,
  ResultPeriod,
  ResultRow,
} from '../meta/types';
import type { MetaFormat } from '../ports/types';

const NUMERIC_FORMATS: readonly MetaFormat[] = [
  'currency_cents',
  'integer',
  'decimal',
  'percent',
];

function isNumeric(format: MetaFormat): boolean {
  return NUMERIC_FORMATS.includes(format);
}

/**
 * Coercao do valor cru. A camada semantica emite numeros como string; converter
 * aqui evita que cada componente refaca o mesmo palpite.
 *
 * Nenhuma transformacao de unidade ocorre: `currency_cents` permanece inteiro em
 * unidade minima ate a porta `formatter`.
 */
function coerce(value: unknown, format: MetaFormat): ResultCell {
  if (value === null || value === undefined) return null;
  if (!isNumeric(format)) {
    return typeof value === 'boolean' ? value : String(value);
  }
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isNaN(numeric) ? null : numeric;
}

interface ResolvedKey {
  member: AnalyticsMember | undefined;
  granularity?: Granularity;
}

/**
 * Resolve a chave de coluna ao membro do modelo.
 *
 * Dimensao temporal com granularidade chega sufixada (`cubo.membro.day`); o
 * sufixo e removido para reencontrar o membro, preservando a granularidade.
 */
function resolveKey(key: string, meta: AnalyticsMeta): ResolvedKey {
  const direct = meta.byName.get(key);
  if (direct) return { member: direct };

  const lastDot = key.lastIndexOf('.');
  if (lastDot === -1) return { member: undefined };

  const suffix = key.slice(lastDot + 1);
  if (!(GRANULARITIES as readonly string[]).includes(suffix)) return { member: undefined };

  return {
    member: meta.byName.get(key.slice(0, lastDot)),
    granularity: suffix as Granularity,
  };
}

function collectKeys(rowsByPeriod: Array<Array<Record<string, unknown>>>): string[] {
  const keys: string[] = [];
  const seen = new Set<string>();
  for (const rows of rowsByPeriod) {
    for (const row of rows) {
      for (const key of Object.keys(row)) {
        if (!seen.has(key)) {
          seen.add(key);
          keys.push(key);
        }
      }
    }
  }
  return keys;
}

/** Dimensoes primeiro, depois tempo, depois measures — ordem util para tabela. */
function orderKeys(keys: string[], query: AnalyticsQuery, meta: AnalyticsMeta): string[] {
  const rank = (key: string): number => {
    const { member, granularity } = resolveKey(key, meta);
    if (!member) return 3;
    if (member.kind === 'measure') return 2;
    if (member.kind === 'timeDimension' || granularity !== undefined) return 1;
    return 0;
  };

  const queryOrder = [
    ...(query.dimensions ?? []),
    ...(query.timeDimensions ?? []).map((timeDimension) => timeDimension.dimension),
    ...(query.measures ?? []),
  ];
  const positionOf = (key: string): number => {
    const { member } = resolveKey(key, meta);
    const index = queryOrder.indexOf(member?.name ?? key);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  };

  return [...keys].sort((a, b) => rank(a) - rank(b) || positionOf(a) - positionOf(b));
}

function periodLabel(dateRange: DateRange | undefined, index: number): string {
  if (dateRange === undefined) return index === 0 ? 'Periodo atual' : `Periodo ${index + 1}`;
  return Array.isArray(dateRange) ? `${dateRange[0]} - ${dateRange[1]}` : dateRange;
}

/**
 * Chave de linha para pareamento entre periodos: as dimensoes nao temporais.
 *
 * A dimensao temporal e excluida de proposito — ela e justamente o que difere
 * entre os periodos comparados.
 */
function rowKeyOf(row: ResultRow, keyColumns: string[]): string {
  return JSON.stringify(keyColumns.map((column) => row[column] ?? null));
}

/**
 * Converte um instante para UTC.
 *
 * A camada semantica emite `2026-07-01T00:00:00.000` sem indicador de fuso,
 * enquanto o `dateRange` chega como `2026-07-01`. Interpretados ingenuamente,
 * um vira hora local e o outro UTC, e a diferenca desloca os buckets em um dia
 * inteiro em fusos negativos.
 */
function toUtcMillis(value: string): number {
  const hasZone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(value);
  const iso = value.length === 10 ? `${value}T00:00:00.000Z` : hasZone ? value : `${value}Z`;
  return Date.parse(iso);
}

const MILLIS = { second: 1000, minute: 60000, hour: 3600000, day: 86400000, week: 604800000 };

/**
 * Posicao do bucket em relacao ao inicio do intervalo, na granularidade dada.
 *
 * E a posicao **relativa ao inicio**, nao a posicao no array retornado: bucket
 * ausente por falta de movimento nao pode deslocar os seguintes.
 */
export function bucketOffset(
  value: string,
  origin: string,
  granularity: Granularity,
): number | null {
  const point = toUtcMillis(value);
  const start = toUtcMillis(origin);
  if (Number.isNaN(point) || Number.isNaN(start)) return null;

  switch (granularity) {
    case 'second':
    case 'minute':
    case 'hour':
    case 'day':
    case 'week':
      return Math.floor((point - start) / MILLIS[granularity]);

    case 'month':
    case 'quarter':
    case 'year': {
      const from = new Date(start);
      const to = new Date(point);
      const months =
        (to.getUTCFullYear() - from.getUTCFullYear()) * 12 +
        (to.getUTCMonth() - from.getUTCMonth());
      if (granularity === 'month') return months;
      if (granularity === 'quarter') return Math.floor(months / 3);
      return to.getUTCFullYear() - from.getUTCFullYear();
    }
  }
}

/**
 * Valor de um bucket sem dado.
 *
 * Aditivo vale zero — nao houve movimento; media, minimo e maximo valem nulo —
 * a media de nada nao e zero. Sem `aggType` declarado, o formato decide.
 */
export function fillValueFor(member: AnalyticsMember | undefined): number | null {
  const additive = ['sum', 'count', 'countdistinct', 'countdistinctapprox', 'runningtotal'];
  const aggType = member?.aggType?.toLowerCase();

  if (aggType !== undefined) return additive.includes(aggType) ? 0 : null;
  return member?.format === 'currency_cents' || member?.format === 'integer' ? 0 : null;
}

/**
 * Variacao entre o periodo principal e cada periodo de comparacao.
 *
 * Linhas sao pareadas pela chave de dimensoes nao temporais e, dentro da chave,
 * pela posicao ordinal — o que faz o caso com granularidade alinhar dia a dia
 * sem depender de datas iguais, que por definicao nao sao.
 *
 * `absolute` e subtracao direta: sobre measure em unidade minima inteira o
 * resultado permanece inteiro. `ratio` fica como fracao sem arredondamento, que
 * ocorre so na formatacao. Base zero devolve `null`, nunca infinito.
 */
interface DeltaContext {
  rowsByPeriod: ResultRow[][];
  periods: ResultPeriod[];
  measureColumns: string[];
  keyColumns: string[];
  /** Coluna temporal com granularidade, quando a consulta tem buckets. */
  timeColumn?: string;
  granularity?: Granularity;
  fillValues: Map<string, number | null>;
}

/**
 * Indexa as linhas de um periodo por chave de dimensao e posicao de bucket.
 *
 * Com granularidade, a posicao vem do deslocamento em relacao ao inicio do
 * intervalo daquele periodo. Sem granularidade — ou sem inicio conhecido — cai
 * para a posicao no array, que e o unico alinhamento disponivel.
 */
function indexPeriod(
  rows: ResultRow[],
  context: DeltaContext,
  periodIndex: number,
): Map<string, Map<number, ResultRow>> {
  const { keyColumns, timeColumn, granularity } = context;
  const dateRange = context.periods[periodIndex]?.dateRange;
  const origin = Array.isArray(dateRange) ? dateRange[0] : undefined;

  const indexed = new Map<string, Map<number, ResultRow>>();
  const ordinalByKey = new Map<string, number>();

  for (const row of rows) {
    const key = rowKeyOf(row, keyColumns);
    let buckets = indexed.get(key);
    if (!buckets) {
      buckets = new Map<number, ResultRow>();
      indexed.set(key, buckets);
    }

    let position: number | null = null;
    if (timeColumn && granularity && origin) {
      const cell = row[timeColumn];
      if (typeof cell === 'string') position = bucketOffset(cell, origin, granularity);
    }

    if (position === null) {
      position = ordinalByKey.get(key) ?? 0;
      ordinalByKey.set(key, position + 1);
    }

    buckets.set(position, row);
  }

  return indexed;
}

/**
 * Variacao entre o periodo principal e cada periodo de comparacao.
 *
 * Linhas sao pareadas pela chave de dimensoes nao temporais e, dentro da chave,
 * pela posicao do bucket relativa ao inicio de cada intervalo — nunca pela
 * posicao no array retornado. Resultado esparso e o motivo: um periodo com 30
 * buckets e outro com 28, por falta de movimento, parearia janeiro-3 com
 * fevereiro-1 e produziria um numero plausivel e errado.
 *
 * Buckets ausentes sao preenchidos antes do pareamento — zero ou nulo conforme
 * a agregacao da measure — e a cauda de intervalos de tamanhos diferentes pareia
 * com nulo em vez de ser descartada.
 *
 * `absolute` e subtracao direta: sobre measure em unidade minima inteira o
 * resultado permanece inteiro. `ratio` fica como fracao sem arredondamento, que
 * ocorre so na formatacao. Base zero devolve `null`, nunca infinito.
 */
function computeDeltas(context: DeltaContext): ResultDelta[] {
  const { rowsByPeriod, measureColumns, fillValues } = context;
  const primary = rowsByPeriod[0];
  if (!primary || rowsByPeriod.length < 2) return [];

  const primaryIndex = indexPeriod(primary, context, 0);
  const deltas: ResultDelta[] = [];

  const valueAt = (row: ResultRow | undefined, member: string): number | null => {
    if (!row) return fillValues.get(member) ?? null;
    const cell = row[member];
    return typeof cell === 'number' ? cell : null;
  };

  for (let periodIndex = 1; periodIndex < rowsByPeriod.length; periodIndex += 1) {
    const comparison = rowsByPeriod[periodIndex];
    if (!comparison) continue;
    const comparisonIndex = indexPeriod(comparison, context, periodIndex);

    // Uniao das chaves: linha que so existe no periodo de comparacao nao e
    // descartada, aparece com o periodo atual vazio.
    const keys = new Set([...primaryIndex.keys(), ...comparisonIndex.keys()]);

    for (const rowKey of keys) {
      const currentBuckets = primaryIndex.get(rowKey) ?? new Map<number, ResultRow>();
      const previousBuckets = comparisonIndex.get(rowKey) ?? new Map<number, ResultRow>();

      // Uniao das posicoes: a cauda do intervalo mais longo pareia com nulo e
      // nao desloca as posicoes anteriores.
      const positions = [
        ...new Set([...currentBuckets.keys(), ...previousBuckets.keys()]),
      ].sort((a, b) => a - b);

      for (const ordinal of positions) {
        const currentRow = currentBuckets.get(ordinal);
        const previousRow = previousBuckets.get(ordinal);

        for (const member of measureColumns) {
          const current = valueAt(currentRow, member);
          const previous = valueAt(previousRow, member);

          const absolute = current !== null && previous !== null ? current - previous : null;
          const ratio =
            absolute !== null && previous !== null && previous !== 0 ? absolute / previous : null;

          deltas.push({ member, periodIndex, rowKey, ordinal, current, previous, absolute, ratio });
        }
      }
    }
  }

  return deltas;
}

export function normalizeResult(
  response: LoadResponse,
  meta: AnalyticsMeta,
  query: AnalyticsQuery,
): NormalizedResult {
  const rawByPeriod = response.resultSets.map((resultSet) => resultSet.data ?? []);
  const keys = orderKeys(collectKeys(rawByPeriod), query, meta);

  const columns: ResultColumn[] = keys.map((key) => {
    const { member, granularity } = resolveKey(key, meta);
    return {
      member: key,
      title: member?.title ?? key,
      kind: member?.kind ?? 'dimension',
      format: member?.format ?? 'text',
      precision: member?.precision,
      granularity,
      aggType: member?.aggType,
    };
  });

  const formatByColumn = new Map(columns.map((column) => [column.member, column.format]));

  const rowsByPeriod: ResultRow[][] = rawByPeriod.map((rows) =>
    rows.map((row) => {
      const normalized: ResultRow = {};
      for (const key of keys) {
        normalized[key] = coerce(row[key], formatByColumn.get(key) ?? 'text');
      }
      return normalized;
    }),
  );

  const periods: ResultPeriod[] = response.resultSets.map((resultSet, index) => {
    const dateRange = resultSet.query?.timeDimensions?.[0]?.dateRange;
    return { index, dateRange, label: periodLabel(dateRange, index) };
  });

  const measureColumns = columns
    .filter((column) => column.kind === 'measure')
    .map((column) => column.member);
  const keyColumns = columns
    .filter((column) => column.kind !== 'measure' && column.granularity === undefined)
    .filter((column) => column.kind !== 'timeDimension')
    .map((column) => column.member);

  const timeColumn = columns.find((column) => column.granularity !== undefined);
  const fillValues = new Map(
    measureColumns.map((member) => [member, fillValueFor(meta.byName.get(member))]),
  );

  return {
    columns,
    rows: rowsByPeriod[0] ?? [],
    periods,
    rowsByPeriod,
    deltas: computeDeltas({
      rowsByPeriod,
      periods,
      measureColumns,
      keyColumns,
      timeColumn: timeColumn?.member,
      granularity: timeColumn?.granularity,
      fillValues,
    }),
    truncated: response.truncated,
    rowLimit: response.rowLimit,
    query,
  };
}
