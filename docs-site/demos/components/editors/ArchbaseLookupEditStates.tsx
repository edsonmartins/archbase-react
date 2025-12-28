import React from 'react';
import { Stack, Text } from '@mantine/core';
import { ArchbaseLookupEdit } from '@archbase/components';

// Simulando função de lookup
const mockLookup = async (value: any) => {
  return { id: '1', nome: value || 'Valor encontrado' };
};

export function ArchbaseLookupEditStates() {
  return (
    <Stack gap="md" p="md">
      <Text size="sm" fw={500}>Estados:</Text>

      <ArchbaseLookupEdit
        label="Campo normal"
        placeholder="Clique no icone para buscar..."
        onActionSearchExecute={() => alert('Abrir busca')}
        tooltipIconSearch="Buscar"
        lookupValueDelegator={mockLookup}
      />

      <ArchbaseLookupEdit
        label="Campo obrigatorio"
        required
        onActionSearchExecute={() => alert('Abrir busca')}
        lookupValueDelegator={mockLookup}
      />

      <ArchbaseLookupEdit
        label="Campo desabilitado"
        disabled
        onActionSearchExecute={() => {}}
        lookupValueDelegator={mockLookup}
      />

      <ArchbaseLookupEdit
        label="Somente leitura"
        readOnly
        onActionSearchExecute={() => {}}
        lookupValueDelegator={mockLookup}
      />

      <ArchbaseLookupEdit
        label="Com erro"
        error="Selecione um cliente"
        onActionSearchExecute={() => alert('Abrir busca')}
        lookupValueDelegator={mockLookup}
      />
    </Stack>
  );
}
