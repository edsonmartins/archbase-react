import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseDateTimePickerEdit } from '@archbase/components';

export function ArchbaseDateTimePickerEditStates() {
  return (
    <Stack gap="md" p="md">
      {/* Normal */}
      <ArchbaseDateTimePickerEdit
        label="Campo normal"
        placeholder="Selecione data e hora..."
        clearable
      />

      {/* Com valor */}
      <ArchbaseDateTimePickerEdit
        label="Com valor"
        value={new Date(2024, 5, 15, 14, 30)}
      />

      {/* Obrigatorio */}
      <ArchbaseDateTimePickerEdit
        label="Campo obrigatorio"
        required
      />

      {/* Desabilitado */}
      <ArchbaseDateTimePickerEdit
        label="Campo desabilitado"
        value={new Date(2024, 5, 15, 9, 0)}
        disabled
      />

      {/* Somente leitura */}
      <ArchbaseDateTimePickerEdit
        label="Somente leitura"
        value={new Date(2024, 5, 15, 18, 45)}
        readOnly
      />

      {/* Com erro */}
      <ArchbaseDateTimePickerEdit
        label="Com erro"
        error="Data e hora invalidas"
      />
    </Stack>
  );
}
