import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseKeyValueEditor, ArchbaseEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

interface Configuracao {
  id: string;
  nome: string;
  parametros: Record<string, string>;
}

export function ArchbaseKeyValueEditorWithDataSource() {
  const [initialized, setInitialized] = useState(false);

  const { dataSource, current, edit, save, cancel, isBrowsing, isEditing } = useArchbaseDataSourceV2<Configuracao>({
    initialData: [{
      id: '1',
      nome: 'Configuracao Producao',
      parametros: {
        DATABASE_URL: 'postgresql://localhost:5432/app',
        REDIS_URL: 'redis://localhost:6379',
        LOG_LEVEL: 'info'
      }
    }],
    name: 'dsConfigKV',
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
        label="Nome da Configuracao"
      />

      <ArchbaseKeyValueEditor
        dataSource={dataSource}
        dataField="parametros"
        label="Parametros"
        keyPlaceholder="Chave"
        valuePlaceholder="Valor"
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Registro atual ({isBrowsing ? 'Navegando' : 'Editando'}):
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify(current, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
