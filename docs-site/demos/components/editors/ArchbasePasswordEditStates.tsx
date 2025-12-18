import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbasePasswordEdit } from '@archbase/components';

export function ArchbasePasswordEditStates() {
  return (
    <Stack gap="md" p="md">
      {/* Normal */}
      <ArchbasePasswordEdit
        label="Campo normal"
        placeholder="Digite sua senha..."
      />

      {/* Obrigatório */}
      <ArchbasePasswordEdit
        label="Campo obrigatório"
        placeholder="Senha obrigatória..."
        required
      />

      {/* Desabilitado */}
      <ArchbasePasswordEdit
        label="Campo desabilitado"
        value="senhadesabilitada"
        disabled
      />

      {/* Somente leitura */}
      <ArchbasePasswordEdit
        label="Somente leitura"
        value="senhaprotegida"
        readOnly
      />

      {/* Com erro */}
      <ArchbasePasswordEdit
        label="Com erro"
        error="A senha deve ter pelo menos 8 caracteres"
      />

      {/* Com descrição */}
      <ArchbasePasswordEdit
        label="Com descrição"
        description="A senha deve conter letras, números e caracteres especiais"
        placeholder="Digite uma senha forte..."
      />
    </Stack>
  );
}
