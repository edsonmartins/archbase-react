import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseSelect } from '@archbase/components';

interface Estado {
  sigla: string;
  nome: string;
}

const estados: Estado[] = [
  { sigla: 'SP', nome: 'Sao Paulo' },
  { sigla: 'RJ', nome: 'Rio de Janeiro' },
  { sigla: 'MG', nome: 'Minas Gerais' },
  { sigla: 'RS', nome: 'Rio Grande do Sul' },
  { sigla: 'BA', nome: 'Bahia' },
  { sigla: 'PR', nome: 'Parana' },
  { sigla: 'SC', nome: 'Santa Catarina' },
];

export function ArchbaseSelectUsage() {
  const [value, setValue] = useState<Estado | null>(null);

  return (
    <Stack gap="md" p="md">
      <ArchbaseSelect<any, any, Estado>
        label="Estado"
        placeholder="Selecione um estado..."
        initialOptions={estados}
        getOptionLabel={(estado) => estado.nome}
        getOptionValue={(estado) => estado.sigla}
        onSelectValue={(estado) => setValue(estado)}
        searchable
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
