import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseTagInput } from '@archbase/components';

export function ArchbaseTagInputUsage() {
  const [value, setValue] = useState<string[]>(['React', 'TypeScript']);

  return (
    <Stack gap="md" p="md">
      <ArchbaseTagInput
        label="Tags"
        placeholder="Digite e pressione Enter..."
        value={value}
        onChangeValue={(newValue) => setValue(newValue)}
      />

      {value.length > 0 && (
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
