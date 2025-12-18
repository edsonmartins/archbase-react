import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseKeyValueEditor } from '@archbase/components';

export function ArchbaseKeyValueEditorUsage() {
  const [values, setValues] = useState<Record<string, string>>({
    API_URL: 'https://api.example.com',
    API_KEY: 'abc123',
    DEBUG: 'true'
  });

  return (
    <Stack gap="md" p="md">
      <ArchbaseKeyValueEditor
        label="Variaveis de Ambiente"
        value={values}
        onChange={setValues}
        keyPlaceholder="Nome da variavel"
        valuePlaceholder="Valor"
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Valores:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify(values, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
