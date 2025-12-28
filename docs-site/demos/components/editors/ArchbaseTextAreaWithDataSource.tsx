import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseTextArea } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

interface Produto {
  id: string;
  nome: string;
  descricao: string;
}

export function ArchbaseTextAreaWithDataSource() {
  const [initialized, setInitialized] = useState(false);

  const { dataSource } = useArchbaseDataSource<Produto, string>({
    initialData: [{
      id: '1',
      nome: 'Produto Premium',
      descricao: 'Um produto de alta qualidade com diversas funcionalidades.\n\nCaracterísticas:\n- Durável\n- Eficiente\n- Garantia estendida'
    }],
    name: 'dsProdutoTextArea',
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

      <ArchbaseTextArea
        dataSource={dataSource}
        dataField="descricao"
        label="Descrição do Produto"
        placeholder="Digite a descrição..."
        autosize
        minRows={4}
        maxRows={10}
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
