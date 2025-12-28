import React from 'react';
import { Stack, Text } from '@mantine/core';
import { ArchbaseMaskEdit, MaskPattern } from '@archbase/components';

export function ArchbaseMaskEditPatterns() {
  return (
    <Stack gap="md" p="md">
      <Text size="sm" fw={500}>Padrões de Máscara Predefinidos:</Text>

      <ArchbaseMaskEdit
        label="CPF"
        mask={MaskPattern.CPF}
        placeholder="000.000.000-00"
      />

      <ArchbaseMaskEdit
        label="CNPJ"
        mask={MaskPattern.CNPJ}
        placeholder="00.000.000/0000-00"
      />

      <ArchbaseMaskEdit
        label="CEP"
        mask={MaskPattern.CEP}
        placeholder="00.000-000"
      />

      <ArchbaseMaskEdit
        label="Telefone"
        mask={MaskPattern.PHONE}
        placeholder="(00) 00000-0000"
      />

      <ArchbaseMaskEdit
        label="Placa de Veículo"
        mask={MaskPattern.PLACA}
        placeholder="AAA-0X00"
      />

      <Text size="sm" fw={500} mt="md">Máscara Customizada:</Text>

      <ArchbaseMaskEdit
        label="Código do Produto"
        mask="AAA-0000-AA"
        placeholder="XXX-0000-XX"
      />
    </Stack>
  );
}
