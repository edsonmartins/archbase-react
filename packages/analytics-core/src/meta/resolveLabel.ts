import type { AnalyticsMember } from './types';

/** Idioma base de um locale BCP 47: `pt-BR` -> `pt`. */
export function baseLanguage(locale: string): string {
  const separator = locale.indexOf('-');
  return separator === -1 ? locale : locale.slice(0, separator);
}

/**
 * Busca case-insensitive, conforme regra 3 do contrato de metadados: as chaves
 * de locale seguem BCP 47 e a comparacao ignora caixa.
 */
function lookup(dictionary: Record<string, string> | undefined, locale: string): string | undefined {
  if (!dictionary) return undefined;

  const direct = dictionary[locale];
  if (direct !== undefined) return direct;

  const wanted = locale.toLowerCase();
  for (const key of Object.keys(dictionary)) {
    if (key.toLowerCase() === wanted) return dictionary[key];
  }
  return undefined;
}

/**
 * Cadeia de resolucao de rotulo. RFC de metadados, secao 6.5:
 *
 *   meta.i18n[locale exato] -> meta.i18n[idioma base] ->
 *   meta.i18n[locale default] -> title -> name
 *
 * Ausencia de traducao nunca e erro. Chegar ao ultimo degrau sinaliza modelo
 * incompleto, mas ainda assim produz rotulo utilizavel.
 */
export function resolveLabel(
  member: AnalyticsMember,
  locale: string,
  defaultLocale: string,
): string {
  return (
    lookup(member.i18n, locale) ??
    lookup(member.i18n, baseLanguage(locale)) ??
    lookup(member.i18n, defaultLocale) ??
    member.title ??
    member.name
  );
}

/**
 * Mesma cadeia para a descricao, sem o degrau final: descricao ausente e
 * ausencia legitima, nao modelo incompleto.
 */
export function resolveDescription(
  member: AnalyticsMember,
  locale: string,
  defaultLocale: string,
): string | undefined {
  return (
    lookup(member.i18nDescription, locale) ??
    lookup(member.i18nDescription, baseLanguage(locale)) ??
    lookup(member.i18nDescription, defaultLocale) ??
    member.description
  );
}
