import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseDatePickerEdit } from '@archbase/components';

export function ArchbaseDatePickerEditUsage() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <Stack gap="md" p="md">
      <ArchbaseDatePickerEdit
        label="Data de Nascimento"
        placeholder="Selecione a data..."
        onChange={(date) => setValue(date)}
        dateFormat="DD/MM/YYYY"
        clearable
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Valor selecionado:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify({ value: value?.toISOString() }, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
