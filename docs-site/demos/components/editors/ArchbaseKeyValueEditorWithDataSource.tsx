import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseKeyValueEditor, ArchbaseEdit } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

interface Configuracao {
  id: string;
  nome: string;
  parametros: string; // Formato: chave,valor;chave,valor
}

const initialData: Configuracao[] = [{
  id: '1',
  nome: 'Configuracao Producao',
  parametros: 'DATABASE_URL,postgresql://localhost:5432/app;REDIS_URL,redis://localhost:6379;LOG_LEVEL,info'
}];

export function ArchbaseKeyValueEditorWithDataSource() {
  const [initialized, setInitialized] = useState(false);

  const { dataSource } = useArchbaseDataSource<Configuracao, string>({
    initialData,
    name: 'dsConfigKV',
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
  }, [initialized, dataSource, isBrowsing]);

  const handleChangeKeyValue = (value: string) => {
    dataSource.setFieldValue('parametros', value);
  };

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

      <ArchbaseEdit
        dataSource={dataSource}
        dataField="nome"
        label="Nome da Configuracao"
      />

      <ArchbaseKeyValueEditor
        label="Parametros"
        initialValue={currentRecord?.parametros || ''}
        keyLabel="Chave"
        valueLabel="Valor"
        onChangeKeyValue={handleChangeKeyValue}
        readOnly={isBrowsing}
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
