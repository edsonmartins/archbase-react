import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseDatePickerEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

interface Pessoa {
  id: string;
  nome: string;
  dataNascimento: string;
}

export function ArchbaseDatePickerEditWithDataSource() {
  const [initialized, setInitialized] = useState(false);

  const { dataSource, current, edit, save, cancel, isBrowsing, isEditing } = useArchbaseDataSourceV2<Pessoa>({
    initialData: [{
      id: '1',
      nome: 'Maria Santos',
      dataNascimento: '15/03/1990'
    }],
    name: 'dsPessoaDate',
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

      <ArchbaseDatePickerEdit
        dataSource={dataSource}
        dataField="dataNascimento"
        label="Data de Nascimento"
        dateFormat="DD/MM/YYYY"
        clearable
        required
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
