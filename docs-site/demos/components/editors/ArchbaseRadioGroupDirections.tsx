import React from 'react';
import { Stack, Text, Divider } from '@mantine/core';
import { ArchbaseRadioGroup } from '@archbase/components';

const opcoes = [
  { value: '1', label: 'Opcao 1' },
  { value: '2', label: 'Opcao 2' },
  { value: '3', label: 'Opcao 3' },
];

export function ArchbaseRadioGroupDirections() {
  return (
    <Stack gap="md" p="md">
      <Text size="sm" fw={500}>Direcao Vertical (padrao):</Text>
      <ArchbaseRadioGroup
        label="Selecione uma opcao"
        initialOptions={opcoes}
        getOptionLabel={(o: any) => o.label}
        getOptionValue={(o: any) => o.value}
        direction="vertical"
      />

      <Divider my="md" />

      <Text size="sm" fw={500}>Direcao Horizontal:</Text>
      <ArchbaseRadioGroup
        label="Selecione uma opcao"
        initialOptions={opcoes}
        getOptionLabel={(o: any) => o.label}
        getOptionValue={(o: any) => o.value}
        direction="horizontal"
      />
    </Stack>
  );
}
