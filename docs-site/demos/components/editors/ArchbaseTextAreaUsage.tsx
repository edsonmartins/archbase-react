import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseTextArea } from '@archbase/components';

export function ArchbaseTextAreaUsage() {
  const [value, setValue] = useState<string>('');

  return (
    <Stack gap="md" p="md">
      <ArchbaseTextArea
        label="Descrição"
        placeholder="Digite uma descrição detalhada..."
        onChangeValue={(event, newValue) => setValue(newValue)}
        autosize
        minRows={3}
        maxRows={6}
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Valor atual:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify({ value }, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
