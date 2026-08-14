import {
  DEFAULT_META_FORMAT,
  META_FORMATS,
  VIZ_TYPES,
  type MetaFormat,
  type VizType,
} from '../ports/types';
import type {
  AnalyticsMember,
  AnalyticsMeta,
  MemberKind,
  RawMetaMember,
  RawMetaResponse,
} from './types';

function warnInDev(message: string): void {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[archbase-analytics] ${message}`);
  }
}

/**
 * RFC de contratos, secao 2.1: ausencia equivale a `text`; valor desconhecido e
 * tratado como `text`, com aviso em desenvolvimento — nunca lanca.
 *
 * Lancar aqui deixaria a interface inteira refem de um typo no data model.
 */
export function resolveFormat(raw: unknown, memberName: string): MetaFormat {
  if (raw === undefined || raw === null) return DEFAULT_META_FORMAT;
  if (typeof raw === 'string' && (META_FORMATS as readonly string[]).includes(raw)) {
    return raw as MetaFormat;
  }
  warnInDev(
    `Formato desconhecido em ${memberName}: ${String(raw)}. Tratado como ${DEFAULT_META_FORMAT}.`,
  );
  return DEFAULT_META_FORMAT;
}

/**
 * Visualizacao default declarada. Diferente do formato, a ausencia devolve
 * `undefined` em vez do default: quem decide o default e a exploracao inteira,
 * nao o membro isolado.
 */
export function resolveDefaultViz(raw: unknown, memberName: string): VizType | undefined {
  if (raw === undefined || raw === null) return undefined;
  if (typeof raw === 'string' && (VIZ_TYPES as readonly string[]).includes(raw)) {
    return raw as VizType;
  }
  warnInDev(`Visualizacao default desconhecida em ${memberName}: ${String(raw)}. Ignorada.`);
  return undefined;
}

function cubeOf(memberName: string): string {
  const separator = memberName.indexOf('.');
  return separator === -1 ? memberName : memberName.slice(0, separator);
}

function toMember(raw: RawMetaMember, kind: MemberKind): AnalyticsMember {
  const meta = raw.meta ?? {};
  const isTime = kind === 'dimension' && raw.type === 'time';

  return {
    name: raw.name,
    cube: cubeOf(raw.name),
    kind: isTime ? 'timeDimension' : kind,
    title: raw.title,
    format: resolveFormat(meta.format, raw.name),
    precision: typeof meta.precision === 'number' ? meta.precision : undefined,
    // RFC secao 2.2: string plana de um nivel. Folders nativos sao ignorados
    // nesta versao — dois mecanismos de agrupamento concorrentes seriam
    // complexidade sem demanda.
    group: typeof meta.group === 'string' ? meta.group : undefined,
    defaultViz: resolveDefaultViz(meta.default_viz, raw.name),
    i18n: meta.i18n,
    i18nDescription: meta.i18n_description,
    description: raw.description,
    rawType: raw.type,
    aggType: raw.aggType,
  };
}

/**
 * Converte a introspeccao crua em indice consultavel.
 *
 * O que nao consta aqui nao existe para a biblioteca: nenhuma regra local
 * decide visibilidade de membro. Autorizacao pertence a camada semantica.
 */
export function normalizeMeta(raw: RawMetaResponse): AnalyticsMeta {
  const members: AnalyticsMember[] = [];

  // Introspeccao ausente ou malformada devolve modelo vazio: a interface fica
  // sem membros a oferecer, que e degradacao legitima, nao excecao.
  for (const cube of raw?.cubes ?? []) {
    for (const measure of cube.measures ?? []) {
      members.push(toMember(measure, 'measure'));
    }
    for (const dimension of cube.dimensions ?? []) {
      members.push(toMember(dimension, 'dimension'));
    }
    for (const segment of cube.segments ?? []) {
      members.push(toMember(segment, 'segment'));
    }
  }

  const byName = new Map<string, AnalyticsMember>();
  for (const member of members) {
    byName.set(member.name, member);
  }

  return {
    members,
    byName,
    measures: members.filter((member) => member.kind === 'measure'),
    dimensions: members.filter((member) => member.kind === 'dimension'),
    timeDimensions: members.filter((member) => member.kind === 'timeDimension'),
  };
}
