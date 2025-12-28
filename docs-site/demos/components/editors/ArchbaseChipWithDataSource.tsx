import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseChip } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

interface Configuracao {
  id: string;
  notificacoesAtivas: boolean;
  modoEscuro: boolean;
  autoSave: boolean;
}

export function ArchbaseChipWithDataSource() {
  const [initialized, setInitialized] = useState(false);

  const { dataSource } = useArchbaseDataSource<Configuracao, string>({
    initialData: [{
      id: '1',
      notificacoesAtivas: true,
      modoEscuro: false,
      autoSave: true
    }],
    name: 'dsConfigChip',
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

      <Group>
        <ArchbaseChip
          dataSource={dataSource}
          dataField="notificacoesAtivas"
          label="Notificacoes"
        />

        <ArchbaseChip
          dataSource={dataSource}
          dataField="modoEscuro"
          label="Modo Escuro"
        />

        <ArchbaseChip
          dataSource={dataSource}
          dataField="autoSave"
          label="Auto Save"
        />
      </Group>

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
