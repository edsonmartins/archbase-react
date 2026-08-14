import { describe, expect, it, vi } from 'vitest';
import { normalizeMeta } from '../src/meta/normalizeMeta';
import { FAKE_META } from './fixtures/fakeModel';

const meta = normalizeMeta(FAKE_META);

function member(name: string) {
  const found = meta.byName.get(name);
  if (!found) throw new Error(`fixture sem membro ${name}`);
  return found;
}

describe('normalizacao da introspeccao', () => {
  it('classifica measures, dimensoes e dimensao temporal', () => {
    expect(meta.measures.map((item) => item.name)).toContain('pedidos.receita_cents');
    expect(meta.dimensions.map((item) => item.name)).toContain('pedidos.canal');
    expect(meta.timeDimensions.map((item) => item.name)).toEqual(['pedidos.criado_em']);
  });

  it('resolve o vocabulario fechado de formato', () => {
    expect(member('pedidos.receita_cents').format).toBe('currency_cents');
    expect(member('pedidos.itens_total').format).toBe('integer');
    expect(member('pedidos.margem_ratio').format).toBe('percent');
    expect(member('pedidos.peso_medio').format).toBe('decimal');
  });

  it('trata ausencia de meta como text', () => {
    expect(member('pedidos.sem_metadado').format).toBe('text');
    expect(member('pedidos.sem_metadado').defaultViz).toBeUndefined();
  });

  it('degrada formato desconhecido para text com aviso, sem lancar', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const normalized = normalizeMeta(FAKE_META);
    expect(normalized.byName.get('pedidos.formato_estranho')?.format).toBe('text');
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('preserva precision, group e default_viz', () => {
    expect(member('pedidos.peso_medio').precision).toBe(3);
    expect(member('pedidos.receita_cents').group).toBe('Financeiro');
    expect(member('pedidos.receita_cents').defaultViz).toBe('bar');
  });

  it('nao inventa title: o degrau final da cadeia precisa continuar existindo', () => {
    expect(member('pedidos.sem_titulo').title).toBeUndefined();
  });

  it('deriva o cubo a partir da chave semantica', () => {
    expect(member('pedidos.canal').cube).toBe('pedidos');
  });
});
