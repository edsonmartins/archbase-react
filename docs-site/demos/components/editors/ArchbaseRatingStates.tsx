import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseRating } from '@archbase/components';

export function ArchbaseRatingStates() {
  return (
    <Stack gap="md" p="md">
      {/* Normal */}
      <ArchbaseRating
        label="Campo normal"
        value={0}
        count={5}
      />

      {/* Com valor */}
      <ArchbaseRating
        label="Com valor"
        value={4}
        count={5}
      />

      {/* Com contagem customizada */}
      <ArchbaseRating
        label="10 estrelas"
        value={7}
        count={10}
      />

      {/* Meia estrela */}
      <ArchbaseRating
        label="Com fracao (permite meia estrela)"
        value={3.5}
        count={5}
        fractions={2}
      />

      {/* Desabilitado */}
      <ArchbaseRating
        label="Campo desabilitado"
        value={3}
        count={5}
        disabled
      />

      {/* Somente leitura */}
      <ArchbaseRating
        label="Somente leitura"
        value={5}
        count={5}
        readOnly
      />
    </Stack>
  );
}
