import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseChipGroup } from '@archbase/components';

const categorias = [
  { value: 'eletronicos', label: 'Eletronicos' },
  { value: 'roupas', label: 'Roupas' },
  { value: 'alimentos', label: 'Alimentos' },
  { value: 'livros', label: 'Livros' },
  { value: 'esportes', label: 'Esportes' },
];

export function ArchbaseChipGroupUsage() {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <Stack gap="md" p="md">
      <ArchbaseChipGroup
        label="Categorias de Interesse"
        initialOptions={categorias}
        getOptionLabel={(opt) => opt.label}
        getOptionValue={(opt) => opt.value}
        onSelectValue={(values) => setSelectedValues(values)}
        multiple
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Valores selecionados:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify({ selectedValues }, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
