import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseNumberEdit } from '@archbase/components';

export function ArchbaseNumberEditStates() {
  return (
    <Stack gap="md" p="md">
      {/* Normal */}
      <ArchbaseNumberEdit
        label="Campo normal"
        placeholder="Digite o valor..."
        precision={2}
        decimalSeparator=","
        thousandSeparator="."
        clearable
      />

      {/* Com valor */}
      <ArchbaseNumberEdit
        label="Com valor"
        value={1500.75}
        precision={2}
        decimalSeparator=","
        thousandSeparator="."
      />

      {/* Obrigatorio */}
      <ArchbaseNumberEdit
        label="Campo obrigatorio"
        precision={2}
        decimalSeparator=","
        thousandSeparator="."
        required
      />

      {/* Desabilitado */}
      <ArchbaseNumberEdit
        label="Campo desabilitado"
        value={999.99}
        precision={2}
        decimalSeparator=","
        thousandSeparator="."
        disabled
      />

      {/* Somente leitura */}
      <ArchbaseNumberEdit
        label="Somente leitura"
        value={999.99}
        precision={2}
        decimalSeparator=","
        thousandSeparator="."
        readOnly
      />

      {/* Com erro */}
      <ArchbaseNumberEdit
        label="Com erro"
        precision={2}
        decimalSeparator=","
        thousandSeparator="."
        error="Valor deve ser maior que zero"
      />
    </Stack>
  );
}
