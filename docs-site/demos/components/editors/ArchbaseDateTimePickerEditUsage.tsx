import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseDateTimePickerEdit } from '@archbase/components';

export function ArchbaseDateTimePickerEditUsage() {
  const [value, setValue] = useState<Date | null>(null);

  return (
    <Stack gap="md" p="md">
      <ArchbaseDateTimePickerEdit
        label="Data e Hora"
        placeholder="Selecione data e hora..."
        value={value}
        onChangeValue={(newValue) => setValue(newValue)}
        clearable
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Valor atual:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify({ value: value?.toISOString() || null }, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
