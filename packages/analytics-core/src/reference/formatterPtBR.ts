import { DEFAULT_DECIMAL_PRECISION, type FormatContext, type ValueFormatter } from '../ports/types';

/**
 * Formatador de referencia para pt-BR.
 *
 * Este arquivo e a **unica** fronteira onde a conversao de unidade minima
 * acontece, e acontece porque isto e a implementacao de uma porta, nao logica de
 * biblioteca: o invariante proibe divisao no nucleo justamente para que ela
 * fique concentrada aqui, visivel e substituivel.
 *
 * Implementacao de referencia — material de exemplo e de teste. A de producao
 * pertence ao produto consumidor.
 */

const CENTS_PER_UNIT = 100;

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  const numeric = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

export interface FormatterOptions {
  currency?: string;
  fallback?: string;
}

export function createPtBrFormatter(options: FormatterOptions = {}): ValueFormatter {
  const currency = options.currency ?? 'BRL';
  const fallback = options.fallback ?? '—';
  const collators = new Map<string, Intl.Collator>();

  const collatorFor = (locale: string): Intl.Collator => {
    const existing = collators.get(locale);
    if (existing) return existing;
    // `sensitivity: base` faz "Ácido" e "Acido" compararem juntos, que e o
    // comportamento esperado de ordenacao alfabetica em portugues.
    const created = new Intl.Collator(locale, { sensitivity: 'base', numeric: true });
    collators.set(locale, created);
    return created;
  };

  const format = (value: unknown, context: FormatContext): string => {
    const { locale, format: kind } = context;

    switch (kind) {
      case 'currency_cents': {
        const cents = toNumber(value);
        if (cents === null) return fallback;
        return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(
          cents / CENTS_PER_UNIT,
        );
      }

      case 'integer': {
        const numeric = toNumber(value);
        if (numeric === null) return fallback;
        return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(numeric);
      }

      case 'decimal': {
        const numeric = toNumber(value);
        if (numeric === null) return fallback;
        const digits = context.precision ?? DEFAULT_DECIMAL_PRECISION;
        return new Intl.NumberFormat(locale, {
          minimumFractionDigits: digits,
          maximumFractionDigits: digits,
        }).format(numeric);
      }

      case 'percent': {
        // O valor chega como fracao 0-1; `style: percent` ja multiplica por 100.
        const numeric = toNumber(value);
        if (numeric === null) return fallback;
        return new Intl.NumberFormat(locale, {
          style: 'percent',
          minimumFractionDigits: context.precision ?? 1,
          maximumFractionDigits: context.precision ?? 1,
        }).format(numeric);
      }

      case 'date':
      case 'datetime': {
        if (value === null || value === undefined || value === '') return fallback;
        const date = new Date(String(value));
        if (Number.isNaN(date.getTime())) return String(value);
        return new Intl.DateTimeFormat(
          locale,
          kind === 'date'
            ? { dateStyle: 'short' }
            : { dateStyle: 'short', timeStyle: 'short' },
        ).format(date);
      }

      case 'text':
        return value === null || value === undefined ? fallback : String(value);
    }
  };

  /**
   * Ordena sobre o valor bruto. A estrategia sai do formato do membro:
   * numerica, cronologica ou colacao sensivel a locale.
   *
   * Ausencia ordena sempre por ultimo, independentemente da direcao: linha sem
   * valor no topo da tabela nao informa nada.
   */
  const compare = (a: unknown, b: unknown, context: FormatContext): number => {
    const empty = (value: unknown) => value === null || value === undefined || value === '';
    if (empty(a) && empty(b)) return 0;
    if (empty(a)) return 1;
    if (empty(b)) return -1;

    switch (context.format) {
      case 'currency_cents':
      case 'integer':
      case 'decimal':
      case 'percent': {
        const left = toNumber(a);
        const right = toNumber(b);
        if (left === null && right === null) return 0;
        if (left === null) return 1;
        if (right === null) return -1;
        return left - right;
      }

      case 'date':
      case 'datetime': {
        const left = new Date(String(a)).getTime();
        const right = new Date(String(b)).getTime();
        // Data ilegivel cai para colacao: melhor uma ordem estavel que nenhuma.
        if (Number.isNaN(left) || Number.isNaN(right)) {
          return collatorFor(context.locale).compare(String(a), String(b));
        }
        return left - right;
      }

      case 'text':
        return collatorFor(context.locale).compare(String(a), String(b));
    }
  };

  return { format, compare };
}

export const ptBrFormatter: ValueFormatter = createPtBrFormatter();
