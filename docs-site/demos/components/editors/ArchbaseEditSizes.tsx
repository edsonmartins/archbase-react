import React from 'react';
import { Stack, Text } from '@mantine/core';
import { ArchbaseEdit } from '@archbase/components';

export function ArchbaseEditSizes() {
  return (
    <Stack gap="md" p="md">
      <div>
        <Text size="sm" fw={500} mb={4}>Extra Small (xs)</Text>
        <ArchbaseEdit
          size="xs"
          placeholder="Tamanho xs..."
        />
      </div>

      <div>
        <Text size="sm" fw={500} mb={4}>Small (sm)</Text>
        <ArchbaseEdit
          size="sm"
          placeholder="Tamanho sm..."
        />
      </div>

      <div>
        <Text size="sm" fw={500} mb={4}>Medium (md) - Padrão</Text>
        <ArchbaseEdit
          size="md"
          placeholder="Tamanho md..."
        />
      </div>

      <div>
        <Text size="sm" fw={500} mb={4}>Large (lg)</Text>
        <ArchbaseEdit
          size="lg"
          placeholder="Tamanho lg..."
        />
      </div>

      <div>
        <Text size="sm" fw={500} mb={4}>Extra Large (xl)</Text>
        <ArchbaseEdit
          size="xl"
          placeholder="Tamanho xl..."
        />
      </div>
    </Stack>
  );
}
