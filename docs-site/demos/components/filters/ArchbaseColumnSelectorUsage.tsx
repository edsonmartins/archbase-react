import React, { useState } from 'react';
import { Stack, Text, Code, Paper } from '@mantine/core';
import { ArchbaseColumnSelector } from '@archbase/components';
import type { ArchbaseColumnItem } from '@archbase/components';

const initialColumns: ArchbaseColumnItem[] = [
  { field: 'nome', label: 'Nome', visible: true },
  { field: 'email', label: 'E-mail', visible: true },
  { field: 'telefone', label: 'Telefone', visible: false },
  { field: 'cidade', label: 'Cidade', visible: true },
  { field: 'status', label: 'Status', visible: true },
];

export function ArchbaseColumnSelectorUsage() {
  const [columns, setColumns] = useState(initialColumns);

  return (
    <Stack gap="md" p="md">
      <ArchbaseColumnSelector
        columns={columns}
        onChange={(updated) => {
          setColumns(updated);
        }}
        label="Configurar Colunas"
        description="Selecione e reordene as colunas visiveis"
        showSearch
        showSelectAll
        width={350}
      />

      <Paper withBorder p="md" radius="md">
        <Text size="sm" fw={500} c="dimmed" mb="xs">
          Configuracao atual:
        </Text>
        <Code block style={{ fontSize: 11, maxHeight: 200, overflow: 'auto' }}>
          {JSON.stringify(columns, null, 2)}
        </Code>
      </Paper>
    </Stack>
  );
}
