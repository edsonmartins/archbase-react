import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseRichTextEdit } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

interface Artigo {
  id: string;
  titulo: string;
  conteudo: string;
}

const artigoData: Artigo = {
  id: '1',
  titulo: 'Meu Artigo',
  conteudo: '<h1>Artigo Inicial</h1><p>Conteúdo do artigo...</p>',
};

export function ArchbaseRichTextEditWithDataSource() {
  const [initialized, setInitialized] = useState(false);

  const { dataSource } = useArchbaseDataSource<Artigo, string>({
    initialData: [artigoData],
    name: 'dsArtigoRichText',
  });

  const currentRecord = dataSource.getCurrentRecord();
  const isBrowsing = dataSource.isBrowsing();
  const isEditing = dataSource.isEditing();

  const edit = () => dataSource.edit();
  const save = () => dataSource.save();
  const cancel = () => dataSource.cancel();

  useEffect(() => {
    if (!initialized && dataSource && isBrowsing) {
      try {
        edit();
        setInitialized(true);
      } catch (e) {
        // Ignorar
      }
    }
  }, [initialized, dataSource, isBrowsing, edit]);

  return (
    <Stack gap="md" p="md">
      <Group>
        <Button size="xs" onClick={edit} disabled={isEditing} color="blue">
          Editar
        </Button>
        <Button size="xs" onClick={() => save()} disabled={isBrowsing} color="green">
          Salvar
        </Button>
        <Button size="xs" onClick={cancel} disabled={isBrowsing} color="red">
          Cancelar
        </Button>
      </Group>

      <ArchbaseRichTextEdit
        dataSource={dataSource}
        dataField="conteudo"
        label="Conteúdo do Artigo"
        height="300px"
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Registro atual ({isBrowsing ? 'Navegando' : 'Editando'}):
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify(currentRecord, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
