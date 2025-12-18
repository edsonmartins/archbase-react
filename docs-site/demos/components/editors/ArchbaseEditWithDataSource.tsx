import React, { useMemo } from 'react';
import { Stack, Text, Code, Card, Button, Group } from '@mantine/core';
import { ArchbaseEdit } from '@archbase/components';
import { useArchbaseDataSourceV2 } from '@archbase/data';

interface Person {
  id: string;
  nome: string;
  email: string;
  cidade: string;
}

const initialData: Person[] = [
  { id: '1', nome: 'João Silva', email: 'joao@email.com', cidade: 'São Paulo' },
  { id: '2', nome: 'Maria Santos', email: 'maria@email.com', cidade: 'Rio de Janeiro' },
  { id: '3', nome: 'Pedro Oliveira', email: 'pedro@email.com', cidade: 'Belo Horizonte' },
];

export function ArchbaseEditWithDataSource() {
  const { dataSource, current, edit, save, cancel, next, prior, isBrowsing, isEditing } = useArchbaseDataSourceV2<Person>({
    initialData,
    name: 'dsPessoas',
  });

  const currentRecord = current;

  return (
    <Stack gap="md" p="md">
      <Group>
        <Button size="xs" onClick={prior} disabled={isEditing}>
          Anterior
        </Button>
        <Button size="xs" onClick={next} disabled={isEditing}>
          Próximo
        </Button>
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
        label="Nome"
        placeholder="Digite o nome..."
      />

      <ArchbaseEdit
        dataSource={dataSource}
        dataField="email"
        label="E-mail"
        placeholder="Digite o e-mail..."
      />

      <ArchbaseEdit
        dataSource={dataSource}
        dataField="cidade"
        label="Cidade"
        placeholder="Digite a cidade..."
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
