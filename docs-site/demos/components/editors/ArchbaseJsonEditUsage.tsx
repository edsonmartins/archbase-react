import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseJsonEdit } from '@archbase/components';

const initialJson = `{
  "nome": "Produto",
  "preco": 99.90,
  "ativo": true
}`;

export function ArchbaseJsonEditUsage() {
  const [value, setValue] = useState<string>(initialJson);

  return (
    <Stack gap="md" p="md">
      <ArchbaseJsonEdit
        label="Configuracao JSON"
        placeholder="Digite o JSON..."
        onChangeValue={(newValue) => setValue(newValue)}
        autosize
        minRows={4}
        maxRows={10}
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Valor atual:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {value}
        </Code>
      </Card>
    </Stack>
  );
}
