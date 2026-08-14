import { describe, expect, it } from 'vitest';
import { normalizeMeta } from '../src/meta/normalizeMeta';
import { resolveDescription, resolveLabel } from '../src/meta/resolveLabel';
import { FAKE_META } from './fixtures/fakeModel';

const meta = normalizeMeta(FAKE_META);

function member(name: string) {
  const found = meta.byName.get(name);
  if (!found) throw new Error(`fixture sem membro ${name}`);
  return found;
}

describe('cadeia de resolucao de rotulo', () => {
  it('usa o locale exato quando existe', () => {
    expect(resolveLabel(member('pedidos.receita_cents'), 'en', 'pt-BR')).toBe('Revenue');
  });

  it('cai para o idioma base quando o locale exato falta', () => {
    // O modelo declara `en`, nao `en-GB`.
    expect(resolveLabel(member('pedidos.receita_cents'), 'en-GB', 'pt-BR')).toBe('Revenue');
  });

  it('cai para o locale default quando idioma e base faltam', () => {
    expect(resolveLabel(member('pedidos.itens_total'), 'de', 'pt-BR')).toBe('Itens');
  });

  it('cai para title quando nao ha traducao alguma no locale pedido', () => {
    // Cenario da especificacao: locale `es` sem entrada em meta.i18n.
    expect(resolveLabel(member('pedidos.regiao'), 'es', 'es')).toBe('Regiao');
  });

  it('cai para name como ultimo recurso, sinalizando modelo incompleto', () => {
    expect(resolveLabel(member('pedidos.sem_titulo'), 'pt-BR', 'pt-BR')).toBe('pedidos.sem_titulo');
  });

  it('compara chaves de locale ignorando caixa', () => {
    expect(resolveLabel(member('pedidos.receita_cents'), 'PT-br', 'en')).toBe('Receita');
  });

  it('nunca lanca por ausencia de traducao', () => {
    expect(() => resolveLabel(member('pedidos.sem_metadado'), 'ja-JP', 'ko')).not.toThrow();
  });

  it('resolve descricao pela mesma cadeia', () => {
    expect(resolveDescription(member('pedidos.receita_cents'), 'en', 'pt-BR')).toBe(
      'Sum of order value, in cents',
    );
    expect(resolveDescription(member('pedidos.itens_total'), 'pt-BR', 'pt-BR')).toBeUndefined();
  });
});
