import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseImageEdit, ArchbaseEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

interface Produto {
  id: string;
  nome: string;
  foto: string;
}

export function ArchbaseImageEditWithDataSource() {
  const [initialized, setInitialized] = useState(false);

  const { dataSource, current, edit, save, cancel, isBrowsing, isEditing } = useArchbaseDataSourceV2<Produto>({
    initialData: [{
      id: '1',
      nome: 'Notebook',
      foto: ''
    }],
    name: 'dsProdutoImagem',
  });

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

      <ArchbaseEdit
        dataSource={dataSource}
        dataField="nome"
        label="Nome do Produto"
      />

      <ArchbaseImageEdit
        dataSource={dataSource}
        dataField="foto"
        label="Foto do Produto"
        width={200}
        height={200}
        allowClear
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Registro atual ({isBrowsing ? 'Navegando' : 'Editando'}):
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify({
            ...current,
            foto: current?.foto ? `${current.foto.substring(0, 50)}...` : ''
          }, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
