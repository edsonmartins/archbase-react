import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseCheckbox } from '@archbase/components';

export function ArchbaseCheckboxStates() {
  return (
    <Stack gap="md" p="md">
      {/* Normal */}
      <ArchbaseCheckbox
        label="Checkbox normal"
      />

      {/* Marcado */}
      <ArchbaseCheckbox
        label="Checkbox marcado"
        isChecked
      />

      {/* Obrigatorio */}
      <ArchbaseCheckbox
        label="Checkbox obrigatorio"
        required
      />

      {/* Desabilitado */}
      <ArchbaseCheckbox
        label="Checkbox desabilitado"
        disabled
      />

      {/* Com erro */}
      <ArchbaseCheckbox
        label="Checkbox com erro"
        error="Voce deve aceitar os termos"
      />

      {/* Com descricao */}
      <ArchbaseCheckbox
        label="Com descricao"
        description="Marque para concordar com os termos"
      />

      {/* Com valores customizados */}
      <ArchbaseCheckbox
        label="Valores customizados (S/N)"
        trueValue="S"
        falseValue="N"
      />
    </Stack>
  );
}
