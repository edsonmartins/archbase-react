import React from 'react';
import { Stack, Text, SimpleGrid } from '@mantine/core';
import { ArchbaseEdit } from '@archbase/components';

export function ArchbaseEditStates() {
  return (
    <Stack gap="md" p="md">
      <SimpleGrid cols={2} spacing="md">
        <div>
          <Text size="sm" fw={500} mb={4}>Normal</Text>
          <ArchbaseEdit
            label="Campo normal"
            placeholder="Digite algo..."
          />
        </div>

        <div>
          <Text size="sm" fw={500} mb={4}>Obrigatório</Text>
          <ArchbaseEdit
            label="Campo obrigatório"
            placeholder="Este campo é obrigatório..."
            required
          />
        </div>

        <div>
          <Text size="sm" fw={500} mb={4}>Desabilitado</Text>
          <ArchbaseEdit
            label="Campo desabilitado"
            value="Valor fixo"
            disabled
          />
        </div>

        <div>
          <Text size="sm" fw={500} mb={4}>Somente leitura</Text>
          <ArchbaseEdit
            label="Campo somente leitura"
            value="Não editável"
            readOnly
          />
        </div>

        <div>
          <Text size="sm" fw={500} mb={4}>Com erro</Text>
          <ArchbaseEdit
            label="Campo com erro"
            placeholder="Digite algo..."
            error="Este campo contém um erro"
          />
        </div>

        <div>
          <Text size="sm" fw={500} mb={4}>Com descrição</Text>
          <ArchbaseEdit
            label="Campo com descrição"
            placeholder="Digite algo..."
            description="Dica útil sobre o campo"
          />
        </div>
      </SimpleGrid>
    </Stack>
  );
}
