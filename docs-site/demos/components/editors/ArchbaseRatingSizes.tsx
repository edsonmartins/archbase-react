import React from 'react';
import { Stack, Text } from '@mantine/core';
import { ArchbaseRating } from '@archbase/components';

export function ArchbaseRatingSizes() {
  return (
    <Stack gap="md" p="md">
      <Text size="sm" fw={500}>Tamanhos disponíveis:</Text>

      <ArchbaseRating
        label="Extra pequeno (xs)"
        value={3}
        size="xs"
      />

      <ArchbaseRating
        label="Pequeno (sm)"
        value={3}
        size="sm"
      />

      <ArchbaseRating
        label="Médio (md)"
        value={3}
        size="md"
      />

      <ArchbaseRating
        label="Grande (lg)"
        value={3}
        size="lg"
      />

      <ArchbaseRating
        label="Extra grande (xl)"
        value={3}
        size="xl"
      />
    </Stack>
  );
}
