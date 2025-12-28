import React from 'react';
import { Stack, Text } from '@mantine/core';
import { ArchbaseNumberEdit } from '@archbase/components';

export function ArchbaseNumberEditFormats() {
  return (
    <Stack gap="md" p="md">
      <Text size="sm" fw={500}>Formatos de Numero:</Text>

      {/* Moeda brasileira */}
      <ArchbaseNumberEdit
        label="Moeda (R$)"
        value={1234.56}
        precision={2}
        decimalSeparator=","
        thousandSeparator="."
        prefix="R$ "
      />

      {/* Dolar */}
      <ArchbaseNumberEdit
        label="Moeda (USD)"
        value={1234.56}
        precision={2}
        decimalSeparator="."
        thousandSeparator=","
        prefix="$ "
      />

      {/* Inteiro */}
      <ArchbaseNumberEdit
        label="Inteiro"
        value={1000}
        integer
        thousandSeparator="."
      />

      {/* Percentual */}
      <ArchbaseNumberEdit
        label="Percentual"
        value={25.5}
        precision={2}
        decimalSeparator=","
        suffix=" %"
      />

      {/* Com negativos */}
      <ArchbaseNumberEdit
        label="Permite negativos"
        value={-150.00}
        precision={2}
        decimalSeparator=","
        thousandSeparator="."
        allowNegative
      />

      {/* Com limites */}
      <ArchbaseNumberEdit
        label="Com limites (0-100)"
        value={50}
        precision={0}
        minValue={0}
        maxValue={100}
      />
    </Stack>
  );
}
