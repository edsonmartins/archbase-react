import { describe, expect, it } from 'vitest';
import { migrateSavedQuery } from '../src/savedQuery/migrateSavedQuery';
import { createInMemorySavedQueryStore } from '../src/reference/inMemorySavedQueryStore';

describe('migracao de consulta salva', () => {
  it('migra payload pre-versionado de forma transparente', () => {
    const legado = {
      name: 'Receita por canal',
      ownerId: 'u-1',
      chartType: 'bar',
      query: {
        measures: ['pedidos.receita_cents'],
        dimensions: ['pedidos.canal'],
      },
    };

    const migrada = migrateSavedQuery(legado);

    expect(migrada.schemaVersion).toBe(1);
    expect(migrada.query.measures).toEqual(['pedidos.receita_cents']);
    expect(migrada.query.dimensions).toEqual(['pedidos.canal']);
    expect(migrada.viz.type).toBe('bar');
    expect(migrada.meta).toEqual({ name: 'Receita por canal', ownerId: 'u-1', scope: 'private' });
  });

  it('preserva o conteudo ao migrar registro ja na versao corrente', () => {
    const atual = {
      schemaVersion: 1 as const,
      query: { measures: ['pedidos.itens_total'], dimensions: [], filters: [], timeDimensions: [], order: [] },
      viz: { type: 'line' as const },
      meta: { name: 'Itens', ownerId: 'u-2', scope: 'team' as const },
    };

    expect(migrateSavedQuery(atual)).toEqual(atual);
  });

  it('adota escopo privado quando o payload nao declara', () => {
    expect(migrateSavedQuery({ query: {} }).meta.scope).toBe('private');
  });

  it('adota tabela quando a visualizacao gravada nao pertence ao vocabulario', () => {
    expect(migrateSavedQuery({ viz: { type: 'sankey' }, query: {} }).viz.type).toBe('table');
  });

  it('recusa versao superior a suportada, em vez de adivinhar', () => {
    expect(() => migrateSavedQuery({ schemaVersion: 99, query: {} })).toThrow(/99/);
  });
});

describe('store de referencia', () => {
  it('grava, le e remove', async () => {
    const store = createInMemorySavedQueryStore();
    const salva = await store.save({
      schemaVersion: 1,
      query: { measures: ['pedidos.itens_total'] },
      viz: { type: 'table' },
      meta: { name: 'Itens', ownerId: 'u-1', scope: 'private' },
    });

    expect(await store.get(salva.id)).toEqual(salva);
    await store.remove(salva.id);
    expect(await store.get(salva.id)).toBeNull();
  });

  it('filtra por escopo', async () => {
    const store = createInMemorySavedQueryStore();
    await store.save({
      schemaVersion: 1,
      query: {},
      viz: { type: 'table' },
      meta: { name: 'a', ownerId: 'u', scope: 'private' },
    });
    await store.save({
      schemaVersion: 1,
      query: {},
      viz: { type: 'table' },
      meta: { name: 'b', ownerId: 'u', scope: 'org' },
    });

    expect(await store.list('org')).toHaveLength(1);
    expect(await store.list()).toHaveLength(2);
  });

  it('preserva createdAt ao atualizar registro existente', async () => {
    const store = createInMemorySavedQueryStore();
    const primeira = await store.save({
      schemaVersion: 1,
      query: {},
      viz: { type: 'table' },
      meta: { name: 'a', ownerId: 'u', scope: 'private' },
    });

    const segunda = await store.save({
      id: primeira.id,
      schemaVersion: 1,
      query: {},
      viz: { type: 'bar' },
      meta: { name: 'a', ownerId: 'u', scope: 'private' },
    });

    expect(segunda.id).toBe(primeira.id);
    expect(segunda.createdAt).toBe(primeira.createdAt);
    expect(segunda.viz.type).toBe('bar');
  });
});
