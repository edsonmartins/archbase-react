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
          checked={false}
        />

        {/* Selecionado */}
        <ArchbaseChip
          label="Selecionado"
          checked={true}
        />

        {/* Desabilitado */}
        <ArchbaseChip
          label="Desabilitado"
          checked={false}
          disabled
        />

        {/* Desabilitado selecionado */}
        <ArchbaseChip
          label="Desabilitado selecionado"
          checked={true}
          disabled
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

      <Text size="sm" fw={500}>Cores:</Text>

      <Group>
        <ArchbaseChip label="Blue" color="blue" checked />
        <ArchbaseChip label="Green" color="green" checked />
        <ArchbaseChip label="Red" color="red" checked />
        <ArchbaseChip label="Orange" color="orange" checked />
        <ArchbaseChip label="Violet" color="violet" checked />
      </Group>
    </Stack>
  );
}
