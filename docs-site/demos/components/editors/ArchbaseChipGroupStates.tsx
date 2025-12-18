import React from 'react';
import { Stack, Text } from '@mantine/core';
import { ArchbaseChipGroup } from '@archbase/components';

const opcoes = [
  { value: 'opcao1', label: 'Opcao 1' },
  { value: 'opcao2', label: 'Opcao 2' },
  { value: 'opcao3', label: 'Opcao 3' },
];

export function ArchbaseChipGroupStates() {
  return (
    <Stack gap="md" p="md">
      <Text size="sm" fw={500}>Selecao unica:</Text>
      <ArchbaseChipGroup
        label="Selecione uma opcao"
        initialOptions={opcoes}
        getOptionLabel={(opt) => opt.label}
        getOptionValue={(opt) => opt.value}
      />

      <Text size="sm" fw={500}>Selecao multipla:</Text>
      <ArchbaseChipGroup
        label="Selecione varias opcoes"
        initialOptions={opcoes}
        getOptionLabel={(opt) => opt.label}
        getOptionValue={(opt) => opt.value}
        multiple
      />

      <Text size="sm" fw={500}>Com valores pre-selecionados:</Text>
      <ArchbaseChipGroup
        label="Valores iniciais"
        initialOptions={opcoes}
        getOptionLabel={(opt) => opt.label}
        getOptionValue={(opt) => opt.value}
        value={['opcao1', 'opcao2']}
        multiple
      />

      <Text size="sm" fw={500}>Desabilitado:</Text>
      <ArchbaseChipGroup
        label="Grupo desabilitado"
        initialOptions={opcoes}
        getOptionLabel={(opt) => opt.label}
        getOptionValue={(opt) => opt.value}
        disabled
      />

      <Text size="sm" fw={500}>Obrigatorio:</Text>
      <ArchbaseChipGroup
        label="Campo obrigatorio"
        initialOptions={opcoes}
        getOptionLabel={(opt) => opt.label}
        getOptionValue={(opt) => opt.value}
        required
      />
    </Stack>
  );
}
