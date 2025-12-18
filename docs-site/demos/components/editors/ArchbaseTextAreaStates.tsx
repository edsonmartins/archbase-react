import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseTextArea } from '@archbase/components';

export function ArchbaseTextAreaStates() {
  return (
    <Stack gap="md" p="md">
      {/* Normal */}
      <ArchbaseTextArea
        label="Campo normal"
        placeholder="Digite algo..."
        minRows={2}
      />

      {/* Obrigatório */}
      <ArchbaseTextArea
        label="Campo obrigatório"
        placeholder="Este campo é obrigatório..."
        required
        minRows={2}
      />

      {/* Desabilitado */}
      <ArchbaseTextArea
        label="Campo desabilitado"
        disabled
        minRows={2}
      />

      {/* Somente leitura */}
      <ArchbaseTextArea
        label="Somente leitura"
        readOnly
        minRows={2}
      />

      {/* Com erro */}
      <ArchbaseTextArea
        label="Com erro"
        error="Este campo contém um erro de validação"
        minRows={2}
      />

      {/* Com descrição */}
      <ArchbaseTextArea
        label="Com descrição"
        description="Use este campo para adicionar uma descrição detalhada"
        placeholder="Digite aqui..."
        minRows={2}
      />

      {/* Autosize */}
      <ArchbaseTextArea
        label="Autosize (cresce automaticamente)"
        description="O campo expande conforme você digita, até maxRows"
        placeholder="Digite várias linhas para ver o autosize em ação..."
        autosize
        minRows={2}
        maxRows={6}
      />
    </Stack>
  );
}
