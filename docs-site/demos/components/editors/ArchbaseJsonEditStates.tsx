import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseJsonEdit } from '@archbase/components';

const sampleJson = `{
  "nome": "Exemplo",
  "valor": 123
}`;

export function ArchbaseJsonEditStates() {
  return (
    <Stack gap="md" p="md">
      {/* Normal */}
      <ArchbaseJsonEdit
        label="Campo normal"
        placeholder='{"chave": "valor"}'
        autosize
        minRows={3}
      />

      {/* Obrigatório */}
      <ArchbaseJsonEdit
        label="Campo obrigatório"
        placeholder="JSON obrigatório..."
        required
        autosize
        minRows={3}
      />

      {/* Desabilitado */}
      <ArchbaseJsonEdit
        label="Campo desabilitado"
        disabled
        autosize
        minRows={3}
      />

      {/* Somente leitura */}
      <ArchbaseJsonEdit
        label="Somente leitura"
        readOnly
        autosize
        minRows={3}
      />

      {/* Com erro */}
      <ArchbaseJsonEdit
        label="Com erro"
        error="JSON inválido - verifique a sintaxe"
        autosize
        minRows={3}
      />

      {/* Com descrição */}
      <ArchbaseJsonEdit
        label="Com descrição"
        description="O JSON será formatado automaticamente ao sair do campo"
        placeholder='{"propriedade": "valor"}'
        autosize
        minRows={3}
        maxRows={8}
      />

      {/* Com limite de caracteres */}
      <ArchbaseJsonEdit
        label="Com limite de caracteres"
        description="Máximo de 500 caracteres"
        maxLength={500}
        autosize
        minRows={3}
      />
    </Stack>
  );
}
