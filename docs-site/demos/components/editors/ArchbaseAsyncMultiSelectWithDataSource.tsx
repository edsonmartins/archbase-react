import React, { useState } from 'react';
import { Stack, Group, Button, Text, Code, Card } from '@mantine/core';
import { ArchbaseAsyncMultiSelect, OptionsResult } from '@archbase/components';
import { useArchbaseDataSource } from '@archbase/data';

interface Produto {
  id: string;
  nome: string;
  tags: string[];
}

interface Tag {
  id: string;
  nome: string;
}

const mockTags: Tag[] = [
  { id: '1', nome: 'Eletrônicos' },
  { id: '2', nome: 'Roupas' },
  { id: '3', nome: 'Alimentos' },
  { id: '4', nome: 'Livros' },
  { id: '5', nome: 'Esportes' },
];

const searchTags = async (page: number, query: string): Promise<OptionsResult<Tag>> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  const filtered = mockTags.filter(t => t.nome.toLowerCase().includes(query.toLowerCase()));
  return { options: filtered, page: 0, totalPages: 1 };
};

export function ArchbaseAsyncMultiSelectWithDataSource() {
  const produtoData: Produto = {
    id: '1',
    nome: 'Notebook Dell',
    tags: ['1', '3'],
  };

  const { dataSource } = useArchbaseDataSource<Produto, string>({
    initialData: [produtoData],
    name: 'dsProdutoAsyncMultiSelect',
  });

  const currentRecord = dataSource.getCurrentRecord();
  const isBrowsing = dataSource.isBrowsing();
  const isEditing = dataSource.isEditing();

  const edit = () => dataSource.edit();
  const save = () => dataSource.save();
  const cancel = () => dataSource.cancel();

  return (
    <Stack gap="md" p="md">
      <Group>
        <Button size="xs" onClick={edit} disabled={isEditing} color="blue">Editar</Button>
        <Button size="xs" onClick={() => save()} disabled={isBrowsing} color="green">Salvar</Button>
        <Button size="xs" onClick={cancel} disabled={isBrowsing} color="red">Cancelar</Button>
      </Group>

      <ArchbaseAsyncMultiSelect<Produto, string, Tag>
        dataSource={dataSource}
        dataField="tags"
        label="Tags"
        placeholder="Selecione as tags..."
        getOptions={searchTags}
        getOptionLabel={(tag) => tag.nome}
        getOptionValue={(tag) => tag.id}
        minCharsToSearch={0}
        searchable
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
