import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseKeyValueEditor } from '@archbase/components';

export function ArchbaseKeyValueEditorUsage() {
  const [value, setValue] = useState('API_URL,https://api.example.com;API_KEY,abc123;DEBUG,true');

  return (
    <Stack gap="md" p="md">
      <ArchbaseKeyValueEditor
        label="Variaveis de Ambiente"
        initialValue={value}
        keyLabel="Nome da variavel"
        valueLabel="Valor"
        onChangeKeyValue={setValue}
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Valor (formato string):
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {value}
        </Code>
      </Card>
    </Stack>
  );
}
