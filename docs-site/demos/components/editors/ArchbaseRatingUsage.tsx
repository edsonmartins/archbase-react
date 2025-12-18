import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseRating } from '@archbase/components';

export function ArchbaseRatingUsage() {
  const [value, setValue] = useState<number>(0);

  return (
    <Stack gap="md" p="md">
      <ArchbaseRating
        label="Avaliacao"
        value={value}
        onChangeValue={(newValue) => setValue(newValue || 0)}
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
