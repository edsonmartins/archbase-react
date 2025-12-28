import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseCheckbox } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

interface Configuracao {
  id: string;
  receberNotificacoes: boolean;
  aceitarTermos: boolean;
  lembrarSenha: boolean;
}

const initialData: Configuracao[] = [{
  id: '1',
  receberNotificacoes: true,
  aceitarTermos: false,
  lembrarSenha: true
}];

export function ArchbaseCheckboxWithDataSource() {
  const [initialized, setInitialized] = useState(false);
  const [, forceUpdate] = useState({});

  const { dataSource } = useArchbaseDataSource<Configuracao, string>({
    initialData,
    name: 'dsConfigCheckbox',
  });

  const currentRecord = dataSource.getCurrentRecord();
  const isBrowsing = dataSource.isBrowsing();
  const isEditing = dataSource.isEditing();

  const edit = () => {
    dataSource.edit();
    forceUpdate({});
  };
  const save = () => {
    dataSource.save();
    forceUpdate({});
  };
  const cancel = () => {
    dataSource.cancel();
    forceUpdate({});
  };

  useEffect(() => {
    if (!initialized && dataSource && isBrowsing) {
      try {
        dataSource.edit();
        setInitialized(true);
        forceUpdate({});
      } catch (e) {
        // Ignorar
      }
    }
  }, [initialized, dataSource, isBrowsing]);

  return (
    <Stack gap="md" p="md">
      <Group>
        <Button size="xs" onClick={edit} disabled={isEditing} color="blue">
          Editar
        </Button>
        <Button size="xs" onClick={save} disabled={isBrowsing} color="green">
          Salvar
        </Button>
        <Button size="xs" onClick={cancel} disabled={isBrowsing} color="red">
          Cancelar
        </Button>
      </Group>

      <ArchbaseCheckbox
        dataSource={dataSource}
        dataField="receberNotificacoes"
        label="Receber notificacoes por email"
      />

      <ArchbaseCheckbox
        dataSource={dataSource}
        dataField="aceitarTermos"
        label="Aceito os termos de uso"
        required
      />

      <ArchbaseCheckbox
        dataSource={dataSource}
        dataField="lembrarSenha"
        label="Lembrar minha senha"
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
