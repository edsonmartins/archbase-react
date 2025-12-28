import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseRating } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

interface Produto {
  id: string;
  nome: string;
  avaliacao: number;
}

export function ArchbaseRatingWithDataSource() {
  const [initialized, setInitialized] = useState(false);

  const { dataSource } = useArchbaseDataSource<Produto, string>({
    initialData: [{
      id: '1',
      nome: 'Smartphone XYZ',
      avaliacao: 4
    }],
    name: 'dsProdutoRating',
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

      <ArchbaseRating
        dataSource={dataSource}
        dataField="avaliacao"
        label="Avaliacao do Produto"
        count={5}
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
