import { describe, expect, it, vi } from 'vitest';
import {
  deserializeExploration,
  readDeepLink,
  serializeExploration,
  writeDeepLink,
} from '../src/deeplink/deepLink';
import type { ExplorationState } from '../src/exploration/types';

const PARAMS = { query: 'aq', savedQueryId: 'aqid' };

const ESTADO: ExplorationState = {
  query: {
    measures: ['pedidos.receita_cents'],
    dimensions: ['pedidos.canal'],
    filters: [{ member: 'pedidos.regiao', operator: 'equals', values: ['Sul'] }],
    timeDimensions: [
      {
        dimension: 'pedidos.criado_em',
        granularity: 'month',
        dateRange: ['2026-01-01', '2026-07-31'],
        compareDateRange: [['2025-01-01', '2025-07-31']],
      },
    ],
  },
  viz: { type: 'bar' },
  vizAuto: false,
};

describe('deep link', () => {
  it('faz ida e volta preservando a consulta', () => {
    const restaurado = deserializeExploration(serializeExploration(ESTADO));
    expect(restaurado?.query).toEqual(ESTADO.query);
    expect(restaurado?.viz.type).toBe('bar');
  });

  it('carrega prefixo de versao', () => {
    expect(serializeExploration(ESTADO).startsWith('1.')).toBe(true);
  });

  it('sobrevive a acentuacao e caracteres fora de latin-1', () => {
    const comAcento: ExplorationState = {
      ...ESTADO,
      query: {
        filters: [{ member: 'pedidos.regiao', operator: 'equals', values: ['São Paulo · 東京'] }],
      },
    };
    const restaurado = deserializeExploration(serializeExploration(comAcento));
    expect(restaurado?.query.filters?.[0]?.values).toEqual(['São Paulo · 東京']);
  });

  it('descarta payload sem prefixo, com aviso e sem erro', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(deserializeExploration('eyJxdWVyeSI6e319')).toBeNull();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('descarta payload de versao desconhecida', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(deserializeExploration('9.eyJxdWVyeSI6e319')).toBeNull();
    warn.mockRestore();
  });

  it('descarta payload ilegivel sem lancar', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => deserializeExploration('1.$$$nao-e-base64$$$')).not.toThrow();
    expect(deserializeExploration('1.$$$nao-e-base64$$$')).toBeNull();
    warn.mockRestore();
  });

  it('trata ausencia de parametro como ausencia, nao como falha', () => {
    expect(deserializeExploration(null)).toBeNull();
    expect(deserializeExploration(undefined)).toBeNull();
    expect(deserializeExploration('')).toBeNull();
  });

  it('le os parametros configurados da query string', () => {
    const search = `?aq=${serializeExploration(ESTADO)}&aqid=sq-7`;
    const leitura = readDeepLink(search, PARAMS);

    expect(leitura.state?.query.measures).toEqual(['pedidos.receita_cents']);
    expect(leitura.savedQueryId).toBe('sq-7');
  });

  it('respeita nomes de parametro customizados do hospedeiro', () => {
    const custom = { query: 'exploracao', savedQueryId: 'consulta' };
    const search = writeDeepLink('', custom, { ...ESTADO, savedQueryId: 'sq-1' });

    expect(search).toContain('exploracao=');
    expect(readDeepLink(`?${search}`, custom).savedQueryId).toBe('sq-1');
  });

  it('preserva parametros alheios ao escrever', () => {
    const search = writeDeepLink('?tab=relatorios', PARAMS, ESTADO);
    expect(new URLSearchParams(search).get('tab')).toBe('relatorios');
  });

  it('limpa os parametros ao receber estado nulo', () => {
    const comEstado = writeDeepLink('?tab=x', PARAMS, ESTADO);
    const limpo = writeDeepLink(`?${comEstado}`, PARAMS, null);

    expect(new URLSearchParams(limpo).get('aq')).toBeNull();
    expect(new URLSearchParams(limpo).get('tab')).toBe('x');
  });
});
