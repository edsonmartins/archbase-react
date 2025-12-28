import React, { useState } from 'react';
import { Stack, Text, Code, Card, Group } from '@mantine/core';
import { ArchbaseChip } from '@archbase/components';

export function ArchbaseChipUsage() {
  const [checked, setChecked] = useState(false);

  return (
    <Stack gap="md" p="md">
      <Group>
        <ArchbaseChip
          label="Ativo"
          isChecked={checked}
          onChangeValue={(value) => setChecked(value)}
        />
      </Group>

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Estado:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify({ checked }, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
