import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseAsyncSelect, OptionsResult } from '@archbase/components';

interface Cidade {
  id: string;
  nome: string;
  estado: string;
}

// Simula uma API de busca
const mockCidades: Cidade[] = [
  { id: '1', nome: 'Sao Paulo', estado: 'SP' },
  { id: '2', nome: 'Santos', estado: 'SP' },
  { id: '3', nome: 'Campinas', estado: 'SP' },
  { id: '4', nome: 'Rio de Janeiro', estado: 'RJ' },
  { id: '5', nome: 'Niteroi', estado: 'RJ' },
  { id: '6', nome: 'Belo Horizonte', estado: 'MG' },
  { id: '7', nome: 'Uberlandia', estado: 'MG' },
  { id: '8', nome: 'Porto Alegre', estado: 'RS' },
  { id: '9', nome: 'Curitiba', estado: 'PR' },
  { id: '10', nome: 'Salvador', estado: 'BA' },
];

const searchCidades = async (page: number, query: string): Promise<OptionsResult<Cidade>> => {
  // Simula delay de API
  await new Promise(resolve => setTimeout(resolve, 500));

  const filtered = mockCidades.filter(c =>
    c.nome.toLowerCase().includes(query.toLowerCase())
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

export function ArchbaseAsyncSelectUsage() {
  const [value, setValue] = useState<Cidade | null>(null);

  return (
    <Stack gap="md" p="md">
      <ArchbaseAsyncSelect<any, any, Cidade>
        label="Cidade"
        placeholder="Digite para buscar cidades..."
        getOptions={searchCidades}
        getOptionLabel={(cidade) => `${cidade.nome} - ${cidade.estado}`}
        getOptionValue={(cidade) => cidade.id}
        onSelectValue={(cidade) => setValue(cidade)}
        minCharsToSearch={2}
        debounceTime={300}
        clearable
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Valor selecionado:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify(value, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
