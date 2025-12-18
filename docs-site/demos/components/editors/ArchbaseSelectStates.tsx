import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseSelect } from '@archbase/components';

const opcoes = [
  { value: '1', label: 'Opcao 1' },
  { value: '2', label: 'Opcao 2' },
  { value: '3', label: 'Opcao 3' },
];

export function ArchbaseSelectStates() {
  return (
    <Stack gap="md" p="md">
      {/* Normal */}
      <ArchbaseSelect
        label="Campo normal"
        placeholder="Selecione uma opcao..."
        options={opcoes}
        getOptionLabel={(o: any) => o.label}
        getOptionValue={(o: any) => o.value}
      />

      {/* Pesquisavel */}
      <ArchbaseSelect
        label="Pesquisavel"
        placeholder="Digite para filtrar..."
        options={opcoes}
        getOptionLabel={(o: any) => o.label}
        getOptionValue={(o: any) => o.value}
        searchable
      />

      {/* Obrigatorio */}
      <ArchbaseSelect
        label="Campo obrigatorio"
        placeholder="Selecione..."
        options={opcoes}
        getOptionLabel={(o: any) => o.label}
        getOptionValue={(o: any) => o.value}
        required
      />

      {/* Desabilitado */}
      <ArchbaseSelect
        label="Campo desabilitado"
        placeholder="Desabilitado"
        options={opcoes}
        getOptionLabel={(o: any) => o.label}
        getOptionValue={(o: any) => o.value}
        disabled
      />

      {/* Somente leitura */}
      <ArchbaseSelect
        label="Somente leitura"
        placeholder="Somente leitura"
        options={opcoes}
        getOptionLabel={(o: any) => o.label}
        getOptionValue={(o: any) => o.value}
        value="1"
        readOnly
      />

      {/* Com erro */}
      <ArchbaseSelect
        label="Com erro"
        placeholder="Selecione..."
        options={opcoes}
        getOptionLabel={(o: any) => o.label}
        getOptionValue={(o: any) => o.value}
        error="Selecione uma opcao valida"
      />

      {/* Com descricao */}
      <ArchbaseSelect
        label="Com descricao"
        description="Escolha a opcao mais adequada"
        placeholder="Selecione..."
        options={opcoes}
        getOptionLabel={(o: any) => o.label}
        getOptionValue={(o: any) => o.value}
        clearable
      />
    </Stack>
  );
}
