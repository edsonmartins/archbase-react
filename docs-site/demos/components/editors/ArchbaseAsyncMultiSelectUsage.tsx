import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseAsyncMultiSelect, OptionsResult } from '@archbase/components';

interface Tag {
  id: string;
  nome: string;
}

const mockTags: Tag[] = [
  { id: '1', nome: 'React' },
  { id: '2', nome: 'Vue' },
  { id: '3', nome: 'Angular' },
  { id: '4', nome: 'Svelte' },
  { id: '5', nome: 'Next.js' },
  { id: '6', nome: 'Nuxt' },
  { id: '7', nome: 'React Native' },
  { id: '8', nome: 'Electron' },
];

const searchTags = async (page: number, query: string): Promise<OptionsResult<Tag>> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const filtered = mockTags.filter(t =>
    t.nome.toLowerCase().includes(query.toLowerCase())
  );

  const pageSize = 5;
  const start = page * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  return {
    options: paged,
    page,
    totalPages: Math.ceil(filtered.length / pageSize),
  };
};

export function ArchbaseAsyncMultiSelectUsage() {
  const [values, setValues] = useState<Tag[]>([]);

  return (
    <Stack gap="md" p="md">
      <ArchbaseAsyncMultiSelect<any, any, Tag>
        label="Tecnologias"
        placeholder="Digite para buscar tecnologias..."
        getOptions={searchTags}
        getOptionLabel={(tag) => tag.nome}
        getOptionValue={(tag) => tag.id}
        onChangeValues={(selected) => setValues(selected)}
        minCharsToSearch={1}
        debounceTime={300}
        clearable
        searchable
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Valores selecionados:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify(values, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
