import { describe, expect, it } from 'vitest';
import { createPtBrFormatter } from '../src/reference/formatterPtBR';
import type { FormatContext } from '../src/ports/types';

const formatter = createPtBrFormatter();

function context(overrides: Partial<FormatContext>): FormatContext {
  return { format: 'text', memberName: 'x', locale: 'pt-BR', ...overrides };
}

/** Espacos de largura nao quebravel variam entre versoes do ICU. */
const normalize = (value: string) => value.replace(/\s/g, ' ');

describe('formatador de referencia pt-BR', () => {
  it('converte unidade minima na porta, e so nela', () => {
    const saida = formatter.format(1250000, context({ format: 'currency_cents' }));
    expect(normalize(saida)).toBe('R$ 12.500,00');
  });

  it('formata inteiro sem casas decimais', () => {
    expect(formatter.format(42000, context({ format: 'integer' }))).toBe('42.000');
  });

  it('respeita a precisao declarada no metadado', () => {
    expect(formatter.format(1.23456, context({ format: 'decimal', precision: 3 }))).toBe('1,235');
  });

  it('usa precisao 2 quando o metadado nao declara', () => {
    expect(formatter.format(1.5, context({ format: 'decimal' }))).toBe('1,50');
  });

  it('multiplica a fracao por 100 no percentual', () => {
    expect(formatter.format(0.25, context({ format: 'percent' }))).toBe('25,0%');
  });

  it('aceita numero emitido como string', () => {
    expect(normalize(formatter.format('1250000', context({ format: 'currency_cents' })))).toBe(
      'R$ 12.500,00',
    );
  });

  it('devolve marcador para ausencia, sem quebrar a celula', () => {
    expect(formatter.format(null, context({ format: 'currency_cents' }))).toBe('—');
    expect(formatter.format(undefined, context({ format: 'integer' }))).toBe('—');
  });

  it('preserva texto ilegivel como data em vez de descartar', () => {
    expect(formatter.format('sem data', context({ format: 'date' }))).toBe('sem data');
  });

  it('ordena texto respeitando acentuacao do locale', () => {
    const nomes = ['Zebra', 'Ácido', 'Acre'];
    const ordenado = [...nomes].sort((a, b) => formatter.compare(a, b, context({ format: 'text' })));

    // Comparacao de string crua colocaria "Ácido" depois de "Zebra".
    expect(ordenado).toEqual(['Ácido', 'Acre', 'Zebra']);
    expect([...nomes].sort()).not.toEqual(ordenado);
  });

  it('ordena valor monetario pelo bruto, nao pelo texto formatado', () => {
    const valores = [100000, 900, 5000];
    const ordenado = [...valores].sort((a, b) =>
      formatter.compare(a, b, context({ format: 'currency_cents' })),
    );

    // Ordenado como texto, "R$ 1.000,00" viria antes de "R$ 9,00".
    expect(ordenado).toEqual([900, 5000, 100000]);
  });

  it('ordena data cronologicamente, nao lexicograficamente', () => {
    const datas = ['2026-01-10T00:00:00.000', '2025-12-31T00:00:00.000'];
    const ordenado = [...datas].sort((a, b) =>
      formatter.compare(a, b, context({ format: 'datetime' })),
    );

    expect(ordenado[0]).toContain('2025-12-31');
  });

  it('cai para colacao quando a data e ilegivel, em vez de perder a ordem', () => {
    expect(() =>
      formatter.compare('nao e data', 'tambem nao', context({ format: 'date' })),
    ).not.toThrow();
  });

  it('ordena ausencia sempre por ultimo', () => {
    const ctx = context({ format: 'integer' });
    expect(formatter.compare(null, 5, ctx)).toBeGreaterThan(0);
    expect(formatter.compare(5, null, ctx)).toBeLessThan(0);
    expect(formatter.compare(null, undefined, ctx)).toBe(0);
  });
});
