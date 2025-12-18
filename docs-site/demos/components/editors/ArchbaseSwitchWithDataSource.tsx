import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseSwitch } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

interface Usuario {
  id: string;
  nome: string;
  ativo: boolean;
  notificacoes: boolean;
  modoEscuro: boolean;
}

export function ArchbaseSwitchWithDataSource() {
  const [initialized, setInitialized] = useState(false);

  const { dataSource, current, edit, save, cancel, isBrowsing, isEditing } = useArchbaseDataSourceV2<Usuario>({
    initialData: [{
      id: '1',
      nome: 'Joao Silva',
      ativo: true,
      notificacoes: false,
      modoEscuro: true
    }],
    name: 'dsUsuarioSwitch',
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

      <ArchbaseSwitch
        dataSource={dataSource}
        dataField="ativo"
        label="Usuario ativo"
        onLabel="SIM"
        offLabel="NAO"
      />

      <ArchbaseSwitch
        dataSource={dataSource}
        dataField="notificacoes"
        label="Receber notificacoes"
      />

      <ArchbaseSwitch
        dataSource={dataSource}
        dataField="modoEscuro"
        label="Modo escuro"
        onLabel="ON"
        offLabel="OFF"
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
