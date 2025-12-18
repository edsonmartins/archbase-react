import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseTimeEdit } from '@archbase/components';

export function ArchbaseTimeEditUsage() {
  const [value, setValue] = useState<string>('');

  return (
    <Stack gap="md" p="md">
      <ArchbaseTimeEdit
        label="Horario"
        placeholder="Selecione o horario..."
        value={value}
        onChangeValue={(newValue) => setValue(newValue || '')}
        clearable
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
