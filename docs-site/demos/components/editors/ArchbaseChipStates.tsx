import React from 'react';
import { Stack, Text, Group } from '@mantine/core';
import { ArchbaseChip } from '@archbase/components';

export function ArchbaseChipStates() {
  return (
    <Stack gap="md" p="md">
      <Text size="sm" fw={500}>Estados:</Text>

      <Group>
        {/* Normal */}
        <ArchbaseChip
          label="Normal"
          isChecked={false}
        />

        {/* Selecionado */}
        <ArchbaseChip
          label="Selecionado"
          isChecked={true}
        />
      </Group>

      <Text size="sm" fw={500}>Tamanhos:</Text>

      <Group>
        <ArchbaseChip label="Extra small" size="xs" />
        <ArchbaseChip label="Small" size="sm" />
        <ArchbaseChip label="Medium" size="md" />
        <ArchbaseChip label="Large" size="lg" />
        <ArchbaseChip label="Extra large" size="xl" />
      </Group>
    </Stack>
  );
}
