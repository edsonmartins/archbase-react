import type { SavedQueryRecord, SavedQueryStore, SavedQueryV1 } from '../ports/types';
import { migrateSavedQuery } from '../savedQuery/migrateSavedQuery';

/**
 * Store de referencia, em memoria. Material de exemplo e de teste — a
 * persistencia de producao pertence ao produto consumidor.
 */
export function createInMemorySavedQueryStore(
  seed: SavedQueryRecord[] = [],
): SavedQueryStore & { reset: () => void } {
  let records = new Map<string, SavedQueryRecord>(seed.map((record) => [record.id, record]));
  let sequence = seed.length;

  const nextId = (): string => {
    sequence += 1;
    return `sq-${sequence}`;
  };

  return {
    async list(scope) {
      const all = [...records.values()];
      return scope === undefined ? all : all.filter((record) => record.meta.scope === scope);
    },

    async get(id) {
      return records.get(id) ?? null;
    },

    async save(input: SavedQueryV1 & { id?: string }) {
      const now = new Date().toISOString();
      const migrated = migrateSavedQuery(input);
      const existing = input.id ? records.get(input.id) : undefined;

      const record: SavedQueryRecord = {
        ...migrated,
        id: existing?.id ?? input.id ?? nextId(),
        createdAt: existing?.createdAt ?? now,
        updatedAt: now,
      };

      records.set(record.id, record);
      return record;
    },

    async remove(id) {
      records.delete(id);
    },

    reset() {
      records = new Map();
      sequence = 0;
    },
  };
}
