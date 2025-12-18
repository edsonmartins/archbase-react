import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseLookupEdit } from '@archbase/components';

export function ArchbaseLookupEditStates() {
  return (
    <Stack gap="md" p="md">
      {/* Normal */}
      <ArchbaseLookupEdit
        label="Campo normal"
        placeholder="Clique no icone para buscar..."
        onActionSearchExecute={() => alert('Abrir busca')}
        tooltipIconSearch="Buscar"
      />

      {/* Com valor */}
      <ArchbaseLookupEdit
        label="Com valor selecionado"
        value="João Silva"
        readOnly
        onActionSearchExecute={() => alert('Abrir busca')}
        clearable
      />

      {/* Obrigatorio */}
      <ArchbaseLookupEdit
        label="Campo obrigatorio"
        required
        onActionSearchExecute={() => alert('Abrir busca')}
      />

      {/* Desabilitado */}
      <ArchbaseLookupEdit
        label="Campo desabilitado"
        value="Maria Santos"
        disabled
        onActionSearchExecute={() => {}}
      />

      {/* Somente leitura */}
      <ArchbaseLookupEdit
        label="Somente leitura"
        value="Pedro Oliveira"
        readOnly
        onActionSearchExecute={() => {}}
      />

      {/* Com erro */}
      <ArchbaseLookupEdit
        label="Com erro"
        error="Selecione um cliente"
        onActionSearchExecute={() => alert('Abrir busca')}
      />
    </Stack>
  );
}
