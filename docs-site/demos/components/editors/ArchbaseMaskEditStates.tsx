import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseMaskEdit, MaskPattern } from '@archbase/components';

export function ArchbaseMaskEditStates() {
  return (
    <Stack gap="md" p="md">
      {/* Normal */}
      <ArchbaseMaskEdit
        label="Campo normal"
        mask={MaskPattern.CPF}
        placeholder="Digite o CPF..."
      />

      {/* Com valor preenchido */}
      <ArchbaseMaskEdit
        label="Com valor"
        mask={MaskPattern.CPF}
        value="12345678901"
      />

      {/* Desabilitado */}
      <ArchbaseMaskEdit
        label="Campo desabilitado"
        mask={MaskPattern.CPF}
        value="12345678901"
        disabled
      />

      {/* Somente leitura */}
      <ArchbaseMaskEdit
        label="Somente leitura"
        mask={MaskPattern.CPF}
        value="12345678901"
        readOnly
      />

      {/* Com erro */}
      <ArchbaseMaskEdit
        label="Com erro"
        mask={MaskPattern.CPF}
        error="CPF inválido"
      />

      {/* Salvando com máscara */}
      <ArchbaseMaskEdit
        label="Salva com máscara"
        mask={MaskPattern.CPF}
        saveWithMask
        description="Quando habilitado, salva o valor com a máscara aplicada"
      />
    </Stack>
  );
}
