import { DEFAULT_VIZ, VIZ_TYPES, type SavedQueryScope, type SavedQueryV1, type VizType } from '../ports/types';
import type { AnalyticsQuery } from '../exploration/types';

export const CURRENT_SAVED_QUERY_VERSION = 1;

const SCOPES: readonly SavedQueryScope[] = ['private', 'team', 'org'];

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
}

function asStringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const items = value.filter((item): item is string => typeof item === 'string');
  return items.length > 0 ? items : undefined;
}

function toViz(value: unknown): VizType {
  return typeof value === 'string' && (VIZ_TYPES as readonly string[]).includes(value)
    ? (value as VizType)
    : DEFAULT_VIZ;
}

function toScope(value: unknown): SavedQueryScope {
  return typeof value === 'string' && (SCOPES as readonly string[]).includes(value)
    ? (value as SavedQueryScope)
    : 'private';
}

/**
 * Consulta pre-versionada (v0): payload gravado antes de `schemaVersion`
 * existir. Consumidor 1 nao chegou a produzir nenhuma, mas a funcao de migracao
 * so tem valor se existir desde a primeira release — retrofit de migracao e
 * exatamente o que invalida o acervo do usuario.
 */
function migrateV0(input: Record<string, unknown>): SavedQueryV1 {
  const rawQuery = asRecord(input.query ?? input);
  const query: AnalyticsQuery = {
    measures: asStringArray(rawQuery.measures) ?? [],
    dimensions: asStringArray(rawQuery.dimensions) ?? [],
    filters: Array.isArray(rawQuery.filters) ? (rawQuery.filters as AnalyticsQuery['filters']) : [],
    timeDimensions: Array.isArray(rawQuery.timeDimensions)
      ? (rawQuery.timeDimensions as AnalyticsQuery['timeDimensions'])
      : [],
    order: Array.isArray(rawQuery.order) ? (rawQuery.order as AnalyticsQuery['order']) : [],
    limit: typeof rawQuery.limit === 'number' ? rawQuery.limit : undefined,
    offset: typeof rawQuery.offset === 'number' ? rawQuery.offset : undefined,
    timezone: typeof rawQuery.timezone === 'string' ? rawQuery.timezone : undefined,
  };

  const rawViz = asRecord(input.viz);
  const rawMeta = asRecord(input.meta);

  return {
    schemaVersion: 1,
    query,
    viz: { type: toViz(rawViz.type ?? input.chartType) },
    meta: {
      name: typeof rawMeta.name === 'string' ? rawMeta.name : String(input.name ?? ''),
      ownerId: typeof rawMeta.ownerId === 'string' ? rawMeta.ownerId : String(input.ownerId ?? ''),
      scope: toScope(rawMeta.scope ?? input.scope),
    },
    // Estado de UI e opaco: preserva-se intacto entre gravar e abrir (a migracao
    // reconstroi o registro, entao sem isto o layout do workspace se perderia).
    ...(input.ui !== undefined ? { ui: asRecord(input.ui) } : {}),
  };
}

/**
 * Migra o artefato persistido para o esquema corrente.
 *
 * A consulta salva e o principal ativo criado pelo usuario final e sobrevive a
 * varias versoes da biblioteca; por isso a migracao e transparente e nunca
 * descarta o registro. ADR de arquitetura, secao 2.4.
 */
export function migrateSavedQuery(input: unknown): SavedQueryV1 {
  const record = asRecord(input);
  const version = record.schemaVersion;

  if (version === CURRENT_SAVED_QUERY_VERSION) {
    // Normaliza mesmo na versao corrente: registro gravado por cliente antigo
    // pode ter chegado sem `viz` ou sem `scope`.
    return migrateV0(record);
  }

  if (typeof version === 'number' && version > CURRENT_SAVED_QUERY_VERSION) {
    throw new Error(
      `[archbase-analytics] Consulta salva na versao ${version}, superior a ${CURRENT_SAVED_QUERY_VERSION} ` +
        'suportada por esta versao da biblioteca. Atualize @archbase/analytics-core.',
    );
  }

  return migrateV0(record);
}
