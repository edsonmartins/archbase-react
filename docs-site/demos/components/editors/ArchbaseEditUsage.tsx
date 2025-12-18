import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseEdit } from '@archbase/components';

export function ArchbaseEditUsage() {
  const [value, setValue] = useState<string>('');

  return (
    <Stack gap="md" p="md">
      <ArchbaseEdit
        label="Nome"
        placeholder="Digite seu nome..."
        value={value}
        onChangeValue={(newValue) => setValue(newValue)}
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
