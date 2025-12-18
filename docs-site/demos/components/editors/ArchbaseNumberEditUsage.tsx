import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseNumberEdit } from '@archbase/components';

export function ArchbaseNumberEditUsage() {
  const [value, setValue] = useState<number | null>(0);

  return (
    <Stack gap="md" p="md">
      <ArchbaseNumberEdit
        label="Valor"
        placeholder="Digite o valor..."
        onChangeValue={(masked, numValue) => setValue(numValue)}
        precision={2}
        decimalSeparator=","
        thousandSeparator="."
        clearable
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Valor numerico:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify({ value }, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
