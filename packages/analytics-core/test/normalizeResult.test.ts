import { describe, expect, it } from 'vitest';
import type { LoadResponse } from '../src/client/AnalyticsClient';
import { normalizeMeta } from '../src/meta/normalizeMeta';
import { bucketOffset, fillValueFor, normalizeResult } from '../src/result/normalizeResult';
import { FAKE_META } from './fixtures/fakeModel';
import {
  LOAD_COMPARACAO,
  LOAD_COMPARACAO_ESPARSA,
  LOAD_COMPARACAO_GRANULAR,
  LOAD_SIMPLES,
} from './fixtures/loadResponse';

const meta = normalizeMeta(FAKE_META);

function response(fixture: { results: unknown[] }, truncated = false): LoadResponse {
  return {
    resultSets: fixture.results as LoadResponse['resultSets'],
    truncated,
    rowLimit: truncated ? 50000 : undefined,
  };
}

const QUERY_SIMPLES = {
  measures: ['pedidos.receita_cents', 'pedidos.itens_total'],
  dimensions: ['pedidos.canal'],
};

describe('normalizacao de resultado', () => {
  it('converte numeros emitidos como string', () => {
    const result = normalizeResult(response(LOAD_SIMPLES), meta, QUERY_SIMPLES);
    expect(result.rows[0]?.['pedidos.receita_cents']).toBe(1250000);
    expect(result.rows[0]?.['pedidos.itens_total']).toBe(42);
  });

  it('mantem valor monetario em unidade minima inteira, sem dividir', () => {
    const result = normalizeResult(response(LOAD_SIMPLES), meta, QUERY_SIMPLES);
    expect(result.rows[0]?.['pedidos.receita_cents']).toBe(1250000);
  });

  it('ordena colunas com dimensoes antes de measures', () => {
    const result = normalizeResult(response(LOAD_SIMPLES), meta, QUERY_SIMPLES);
    expect(result.columns.map((column) => column.member)).toEqual([
      'pedidos.canal',
      'pedidos.receita_cents',
      'pedidos.itens_total',
    ]);
  });

  it('propaga truncamento e teto de linhas', () => {
    const result = normalizeResult(response(LOAD_SIMPLES, true), meta, QUERY_SIMPLES);
    expect(result.truncated).toBe(true);
    expect(result.rowLimit).toBe(50000);
  });

  it('nao calcula variacao quando ha um unico periodo', () => {
    const result = normalizeResult(response(LOAD_SIMPLES), meta, QUERY_SIMPLES);
    expect(result.periods).toHaveLength(1);
    expect(result.deltas).toEqual([]);
  });
});

describe('comparacao por multiplos intervalos', () => {
  const query = {
    measures: ['pedidos.receita_cents'],
    dimensions: ['pedidos.canal'],
    timeDimensions: [
      {
        dimension: 'pedidos.criado_em',
        dateRange: ['2026-07-01', '2026-07-31'] as [string, string],
        compareDateRange: [['2026-06-01', '2026-06-30'] as [string, string]],
      },
    ],
  };

  const result = normalizeResult(response(LOAD_COMPARACAO), meta, query);

  const deltaFor = (rowKey: string) =>
    result.deltas.find((delta) => delta.rowKey === JSON.stringify([rowKey]));

  it('expoe um periodo por conjunto retornado', () => {
    expect(result.periods).toHaveLength(2);
    expect(result.periods[0]?.label).toBe('2026-07-01 - 2026-07-31');
    expect(result.periods[1]?.label).toBe('2026-06-01 - 2026-06-30');
  });

  it('calcula a variacao absoluta sobre inteiros', () => {
    const delta = deltaFor('Loja');
    expect(delta?.absolute).toBe(250000);
    expect(Number.isInteger(delta?.absolute)).toBe(true);
  });

  it('mantem a razao como fracao sem arredondar', () => {
    expect(deltaFor('Loja')?.ratio).toBe(0.25);
    // -50000 / 850000 permanece com toda a precisao ate a formatacao.
    expect(deltaFor('Online')?.ratio).toBeCloseTo(-0.058823529, 9);
  });

  it('devolve razao nula sobre base zero, nunca infinito', () => {
    const delta = deltaFor('Parceiro');
    expect(delta?.absolute).toBe(100000);
    expect(delta?.ratio).toBeNull();
    expect(Number.isFinite(delta?.ratio as number)).toBe(false);
  });

  it('pareia linhas pela dimensao nao temporal', () => {
    expect(deltaFor('Loja')?.current).toBe(1250000);
    expect(deltaFor('Loja')?.previous).toBe(1000000);
  });
});

describe('preenchimento de buckets antes do pareamento', () => {
  const query = {
    measures: ['pedidos.receita_cents'],
    timeDimensions: [
      {
        dimension: 'pedidos.criado_em',
        granularity: 'day' as const,
        dateRange: ['2026-07-01', '2026-07-04'] as [string, string],
      },
    ],
  };

  const result = normalizeResult(response(LOAD_COMPARACAO_ESPARSA), meta, query);
  const at = (ordinal: number) => result.deltas.find((delta) => delta.ordinal === ordinal);

  it('alinha por posicao relativa ao inicio, nao por posicao no array', () => {
    // Dia 1 contra dia 1: os dois periodos tem dado.
    expect(at(0)?.current).toBe(100);
    expect(at(0)?.previous).toBe(10);

    // Dia 4 contra dia 4. Alinhado por posicao no array, julho-04 (indice 2)
    // parearia com junho-03, que nem existe.
    expect(at(3)?.current).toBe(400);
    expect(at(3)?.previous).toBe(40);
  });

  it('preenche com zero o bucket ausente de measure aditiva', () => {
    // Julho nao tem dia 2; junho tem.
    expect(at(1)?.current).toBe(0);
    expect(at(1)?.previous).toBe(20);
    expect(at(1)?.absolute).toBe(-20);
  });

  it('preenche dos dois lados: buraco em posicao diferente no outro periodo', () => {
    // Junho nao tem dia 3; julho tem.
    expect(at(2)?.current).toBe(300);
    expect(at(2)?.previous).toBe(0);
    expect(at(2)?.ratio).toBeNull();
  });

  it('pareia a cauda do intervalo mais longo com nulo, sem descartar', () => {
    // Junho tem um quinto dia que julho nao tem.
    expect(at(4)?.previous).toBe(50);
    expect(at(4)?.current).toBe(0);
  });

  it('nao desloca as posicoes seguintes por causa do buraco', () => {
    const ordinais = result.deltas.map((delta) => delta.ordinal).sort((a, b) => a - b);
    expect(ordinais).toEqual([0, 1, 2, 3, 4]);
  });
});

describe('valor de preenchimento por tipo de agregacao', () => {
  it('aditivo vale zero', () => {
    expect(fillValueFor(meta.byName.get('pedidos.receita_cents'))).toBe(0);
  });

  it('media vale nulo: a media de nada nao e zero', () => {
    expect(fillValueFor(meta.byName.get('pedidos.peso_medio'))).toBeNull();
  });

  it('sem aggType declarado, o formato decide', () => {
    expect(fillValueFor(meta.byName.get('pedidos.itens_total'))).toBe(0);
    expect(fillValueFor(meta.byName.get('pedidos.margem_ratio'))).toBeNull();
  });
});

describe('deslocamento de bucket', () => {
  it('conta dias a partir do inicio do intervalo', () => {
    expect(bucketOffset('2026-07-01T00:00:00.000', '2026-07-01', 'day')).toBe(0);
    expect(bucketOffset('2026-07-04T00:00:00.000', '2026-07-01', 'day')).toBe(3);
  });

  it('nao se desloca por falta de indicador de fuso no instante', () => {
    // A camada semantica emite sem `Z`; o dateRange chega como data pura.
    // Interpretados ingenuamente, divergem um dia inteiro em fuso negativo.
    expect(bucketOffset('2026-07-02T00:00:00.000', '2026-07-01', 'day')).toBe(1);
  });

  it('conta meses, trimestres e anos por calendario', () => {
    expect(bucketOffset('2027-01-01', '2026-11-01', 'month')).toBe(2);
    expect(bucketOffset('2027-01-01', '2026-01-01', 'quarter')).toBe(4);
    expect(bucketOffset('2027-01-01', '2026-01-01', 'year')).toBe(1);
  });

  it('devolve nulo diante de data ilegivel, em vez de NaN', () => {
    expect(bucketOffset('nao e data', '2026-07-01', 'day')).toBeNull();
  });
});

describe('comparacao com granularidade', () => {
  it('alinha por posicao ordinal, ja que as datas diferem por definicao', () => {
    const query = {
      measures: ['pedidos.receita_cents'],
      dimensions: ['pedidos.canal'],
      timeDimensions: [
        {
          dimension: 'pedidos.criado_em',
          granularity: 'day' as const,
          dateRange: ['2026-07-01', '2026-07-02'] as [string, string],
        },
      ],
    };
    const result = normalizeResult(response(LOAD_COMPARACAO_GRANULAR), meta, query);

    const ordered = result.deltas.sort((a, b) => a.ordinal - b.ordinal);
    expect(ordered[0]?.absolute).toBe(100000);
    expect(ordered[1]?.absolute).toBe(250000);
  });

  it('reconhece a chave sufixada por granularidade como dimensao temporal', () => {
    const query = { measures: ['pedidos.receita_cents'], dimensions: ['pedidos.canal'] };
    const result = normalizeResult(response(LOAD_COMPARACAO_GRANULAR), meta, query);
    const column = result.columns.find((item) => item.member === 'pedidos.criado_em.day');

    expect(column?.granularity).toBe('day');
    expect(column?.kind).toBe('timeDimension');
  });
});
