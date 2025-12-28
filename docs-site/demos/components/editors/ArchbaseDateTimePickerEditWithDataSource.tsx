import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseDateTimePickerEdit } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

interface Evento {
  id: string;
  titulo: string;
  dataHoraInicio: Date;
  dataHoraFim: Date;
}

export function ArchbaseDateTimePickerEditWithDataSource() {
  const [initialized, setInitialized] = useState(false);

  const { dataSource } = useArchbaseDataSource<Evento, string>({
    initialData: [{
      id: '1',
      titulo: 'Reuniao de Planejamento',
      dataHoraInicio: new Date(2024, 0, 15, 9, 0),
      dataHoraFim: new Date(2024, 0, 15, 11, 0)
    }],
    name: 'dsEventoDateTime',
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

      <ArchbaseDateTimePickerEdit
        dataSource={dataSource}
        dataField="dataHoraInicio"
        label="Data/Hora de Inicio"
        clearable
      />

      <ArchbaseDateTimePickerEdit
        dataSource={dataSource}
        dataField="dataHoraFim"
        label="Data/Hora de Fim"
        clearable
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
