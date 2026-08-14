import { describe, expect, it } from 'vitest';
import { normalizeMeta } from '../src/meta/normalizeMeta';
import { reconcileWithMeta } from '../src/savedQuery/reconcileWithMeta';
import { FAKE_META, FAKE_META_RESTRITA } from './fixtures/fakeModel';

const metaAmpla = normalizeMeta(FAKE_META);
const metaRestrita = normalizeMeta(FAKE_META_RESTRITA);

const CONSULTA_COMPARTILHADA = {
  measures: ['pedidos.receita_cents', 'pedidos.itens_total'],
  dimensions: ['pedidos.canal', 'pedidos.regiao'],
  filters: [{ member: 'pedidos.regiao', operator: 'equals' as const, values: ['Sul'] }],
  timeDimensions: [{ dimension: 'pedidos.criado_em', granularity: 'month' as const }],
  order: [['pedidos.receita_cents', 'desc'] as [string, 'desc']],
};

describe('degradacao de consulta salva', () => {
  it('nao altera consulta cujos membros seguem disponiveis', () => {
    const resultado = reconcileWithMeta(CONSULTA_COMPARTILHADA, metaAmpla);
    expect(resultado.degraded).toBe(false);
    expect(resultado.removedCount).toBe(0);
    expect(resultado.query.measures).toHaveLength(2);
  });

  it('remove os membros indisponiveis e preserva o restante', () => {
    const resultado = reconcileWithMeta(CONSULTA_COMPARTILHADA, metaRestrita);

    expect(resultado.query.measures).toEqual(['pedidos.itens_total']);
    expect(resultado.query.dimensions).toEqual(['pedidos.canal']);
    expect(resultado.allRemoved).toBe(false);
  });

  it('conta os membros removidos sem identifica-los', () => {
    const resultado = reconcileWithMeta(CONSULTA_COMPARTILHADA, metaRestrita);

    // receita_cents, regiao e criado_em sairam.
    expect(resultado.removedCount).toBe(3);
    // A superficie publica nao pode expor quais membros sairam: revelar isso
    // seria vazamento de metadado.
    expect(Object.keys(resultado)).toEqual(['query', 'removedCount', 'allRemoved', 'degraded']);
    expect(JSON.stringify(resultado.removedCount)).not.toContain('receita');
  });

  it('descarta filtro cujo membro saiu', () => {
    const resultado = reconcileWithMeta(CONSULTA_COMPARTILHADA, metaRestrita);
    expect(resultado.query.filters).toEqual([]);
  });

  it('descarta ordenacao que referencia membro removido', () => {
    const resultado = reconcileWithMeta(CONSULTA_COMPARTILHADA, metaRestrita);
    expect(resultado.query.order).toEqual([]);
  });

  it('preserva ordenacao por chave sufixada por granularidade', () => {
    const resultado = reconcileWithMeta(
      {
        measures: ['pedidos.itens_total'],
        timeDimensions: [{ dimension: 'pedidos.criado_em', granularity: 'day' as const }],
        order: [['pedidos.criado_em.day', 'asc'] as [string, 'asc']],
      },
      metaAmpla,
    );
    expect(resultado.query.order).toHaveLength(1);
  });

  it('sinaliza quando nenhum membro sobrou, sem erro tecnico', () => {
    const resultado = reconcileWithMeta(
      { measures: ['pedidos.receita_cents'], dimensions: ['pedidos.regiao'] },
      metaRestrita,
    );

    expect(resultado.allRemoved).toBe(true);
    expect(resultado.removedCount).toBe(2);
    expect(resultado.query.measures).toEqual([]);
  });

  it('consulta vazia nao e degradacao', () => {
    const resultado = reconcileWithMeta({}, metaRestrita);
    expect(resultado.degraded).toBe(false);
    expect(resultado.allRemoved).toBe(false);
  });
});
