import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbasePasswordEdit } from '@archbase/components';

export function ArchbasePasswordEditUsage() {
  const [value, setValue] = useState<string>('');

  return (
    <Stack gap="md" p="md">
      <ArchbasePasswordEdit
        label="Senha"
        placeholder="Digite sua senha..."
        onChangeValue={(event, newValue) => setValue(newValue)}
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Valor atual:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify({ value: value ? '*'.repeat(value.length) : '' }, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
