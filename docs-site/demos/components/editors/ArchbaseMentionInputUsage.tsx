import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseMentionInput } from '@archbase/components';

export function ArchbaseMentionInputUsage() {
  const [value, setValue] = useState<string>('');

  const mentions = [
    {
      trigger: '@',
      data: [
        { id: '1', display: 'João Silva' },
        { id: '2', display: 'Maria Santos' },
        { id: '3', display: 'Pedro Oliveira' },
      ],
    },
  ];

  return (
    <Stack gap="md" p="md">
      <ArchbaseMentionInput
        label="Mensagem"
        placeholder="Use @ para mencionar..."
        value={value}
        onChangeValue={(newValue) => setValue(newValue)}
        mentions={mentions}
      />

      {value && (
        <Card withBorder p="sm" radius="md">
          <Text size="sm" fw={500} mb="xs">Valor atual:</Text>
          <Code block style={{ fontSize: 12 }}>
            {JSON.stringify({ value }, null, 2)}
          </Code>
        </Card>
      )}
    </Stack>
  );
}
