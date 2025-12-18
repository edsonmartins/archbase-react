import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseTimeEdit } from '@archbase/components';

export function ArchbaseTimeEditStates() {
  return (
    <Stack gap="md" p="md">
      {/* Normal */}
      <ArchbaseTimeEdit
        label="Campo normal"
        placeholder="Selecione o horario..."
        clearable
      />

      {/* Com valor */}
      <ArchbaseTimeEdit
        label="Com valor"
        value="14:30"
      />

      {/* Obrigatorio */}
      <ArchbaseTimeEdit
        label="Campo obrigatorio"
        required
      />

      {/* Desabilitado */}
      <ArchbaseTimeEdit
        label="Campo desabilitado"
        value="09:00"
        disabled
      />

      {/* Somente leitura */}
      <ArchbaseTimeEdit
        label="Somente leitura"
        value="18:45"
        readOnly
      />

      {/* Com erro */}
      <ArchbaseTimeEdit
        label="Com erro"
        error="Horario invalido"
      />
    </Stack>
  );
}
