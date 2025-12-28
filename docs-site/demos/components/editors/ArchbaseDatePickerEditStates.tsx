import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseDatePickerEdit } from '@archbase/components';

export function ArchbaseDatePickerEditStates() {
  return (
    <Stack gap="md" p="md">
      {/* Normal */}
      <ArchbaseDatePickerEdit
        label="Campo normal"
        placeholder="Selecione..."
        dateFormat="DD/MM/YYYY"
        clearable
      />

      {/* Obrigatorio */}
      <ArchbaseDatePickerEdit
        label="Campo obrigatorio"
        placeholder="Selecione..."
        dateFormat="DD/MM/YYYY"
        required
      />

      {/* Desabilitado */}
      <ArchbaseDatePickerEdit
        label="Campo desabilitado"
        value={new Date()}
        dateFormat="DD/MM/YYYY"
        disabled
      />

      {/* Somente leitura */}
      <ArchbaseDatePickerEdit
        label="Somente leitura"
        value={new Date()}
        dateFormat="DD/MM/YYYY"
        readOnly
      />

      {/* Com erro */}
      <ArchbaseDatePickerEdit
        label="Com erro"
        dateFormat="DD/MM/YYYY"
        error="Data invalida"
      />

      {/* Com data minima e maxima */}
      <ArchbaseDatePickerEdit
        label="Com limites (min e max)"
        dateFormat="DD/MM/YYYY"
        minDate={new Date(2020, 0, 1)}
        maxDate={new Date(2025, 11, 31)}
        clearable
      />
    </Stack>
  );
}
