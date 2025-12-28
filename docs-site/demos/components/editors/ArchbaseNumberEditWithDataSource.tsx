import React, { useState, useEffect } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseNumberEdit } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

interface Produto {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
}

export function ArchbaseNumberEditWithDataSource() {
  const [initialized, setInitialized] = useState(false);

  const { dataSource } = useArchbaseDataSource<Produto, string>({
    initialData: [{
      id: '1',
      nome: 'Notebook',
      preco: 2599.90,
      quantidade: 5
    }],
    name: 'dsProdutoNumber',
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

      <ArchbaseNumberEdit
        dataSource={dataSource}
        dataField="preco"
        label="Preco"
        precision={2}
        decimalSeparator=","
        thousandSeparator="."
        prefix="R$ "
        clearable
      />

      <ArchbaseNumberEdit
        dataSource={dataSource}
        dataField="quantidade"
        label="Quantidade"
        integer
        minValue={0}
        maxValue={1000}
        suffix=" un"
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
