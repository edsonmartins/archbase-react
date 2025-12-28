import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseJsonEdit } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

interface Configuracao {
  id: string;
  nome: string;
  config: string;
}

const configPadrao = JSON.stringify({
  tema: "light",
  idioma: "pt-BR",
  notificacoes: {
    email: true,
    push: false
  },
  limites: {
    maxItens: 100,
    timeout: 30000
  }
}, null, 2);

export function ArchbaseJsonEditWithDataSource() {
  const [initialized, setInitialized] = useState(false);

  const { dataSource } = useArchbaseDataSource<Configuracao, string>({
    initialData: [{
      id: '1',
      nome: 'Configuracao Principal',
      config: configPadrao
    }],
    name: 'dsConfigJson',
  });
  const currentRecord = dataSource.getCurrentRecord();
  const isBrowsing = dataSource.isBrowsing();
  const isEditing = dataSource.isEditing();

  const edit = () => dataSource.edit();
  const save = () => dataSource.save();
  const cancel = () => dataSource.cancel();


  // Inicializa em modo de edição após o mount
  useEffect(() => {
    if (!initialized && dataSource && isBrowsing) {
      try {
        edit();
        setInitialized(true);
      } catch (e) {
        // Ignorar se não conseguir editar no primeiro render
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

      <ArchbaseJsonEdit
        dataSource={dataSource}
        dataField="config"
        label="Configuracao JSON"
        placeholder="Digite o JSON de configuracao..."
        autosize
        minRows={6}
        maxRows={15}
        disabledBase64Convertion
        required
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
