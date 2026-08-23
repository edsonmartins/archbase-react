import { useEffect, useState } from 'react';
import { Button, Group, Select, TextInput } from '@mantine/core';
import type { SavedQueryRecord, SavedQueryStore } from '@archbase/analytics-core';

export interface SavedQueryBarProps {
  store: SavedQueryStore;
  currentId?: string;
  /**
   * Abre uma consulta salva. Omitida, o seletor de abertura nao e exibido — a
   * barra fica so de gravacao, que e uso legitimo quando a abertura acontece
   * por outro caminho (deep link, menu proprio do hospedeiro).
   */
  onOpen?: (record: SavedQueryRecord) => void;
  onSave: (name: string) => Promise<void> | void;
  /** Falso enquanto a consulta nao tem o que salvar. */
  canSave: boolean;
  labels?: { save?: string; namePlaceholder?: string; openPlaceholder?: string };
}

export function SavedQueryBar({
  store,
  currentId,
  onOpen,
  onSave,
  canSave,
  labels,
}: SavedQueryBarProps) {
  const [records, setRecords] = useState<SavedQueryRecord[]>([]);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    // Falha ao listar deixa a barra vazia, nao derruba o explorador: consultar
    // continua possivel sem o acervo salvo.
    store
      .list()
      .then((list) => mounted && setRecords(list))
      .catch(() => mounted && setRecords([]));
    return () => {
      mounted = false;
    };
  }, [store, currentId]);

  const salvar = async () => {
    if (!canSave || name.trim() === '') return;
    setSaving(true);
    try {
      await onSave(name.trim());
      setRecords(await store.list());
      setName('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Group gap="xs" wrap="nowrap">
      {/* Sem `onOpen` o seletor nao aparece: oferecer um controle que nao leva
          a lugar nenhum e pior que nao oferecer. */}
      {onOpen && (
        <Select
          size="xs"
          w={220}
          searchable
          clearable
          placeholder={labels?.openPlaceholder ?? 'Abrir consulta salva'}
          value={currentId ?? null}
          data={records.map((record) => ({ value: record.id, label: record.meta.name }))}
          onChange={(value) => {
            const record = records.find((item) => item.id === value);
            if (record) onOpen(record);
          }}
        />
      )}

      <TextInput
        size="xs"
        w={200}
        placeholder={labels?.namePlaceholder ?? 'Nome da consulta'}
        value={name}
        onChange={(event) => setName(event.currentTarget.value)}
        onKeyDown={(event) => event.key === 'Enter' && void salvar()}
      />

      <Button
        size="xs"
        variant="light"
        loading={saving}
        disabled={!canSave || name.trim() === ''}
        onClick={() => void salvar()}
      >
        {labels?.save ?? 'Salvar'}
      </Button>
    </Group>
  );
}
