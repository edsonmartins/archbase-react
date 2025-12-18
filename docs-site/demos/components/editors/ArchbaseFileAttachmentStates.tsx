import React from 'react';
import { Stack, Text } from '@mantine/core';
import { ArchbaseFileAttachment } from '@archbase/components';

export function ArchbaseFileAttachmentStates() {
  return (
    <Stack gap="md" p="md">
      <Text size="sm" fw={500}>Estados e configuracoes:</Text>

      {/* Normal */}
      <ArchbaseFileAttachment
        label="Normal"
        accept="*"
        multiple
      />

      {/* Arquivo unico */}
      <ArchbaseFileAttachment
        label="Arquivo unico"
        accept="*"
        multiple={false}
      />

      {/* Apenas imagens */}
      <ArchbaseFileAttachment
        label="Apenas imagens"
        accept="image/*"
        multiple
        description="Aceita apenas arquivos de imagem"
      />

      {/* Apenas PDF */}
      <ArchbaseFileAttachment
        label="Apenas PDF"
        accept=".pdf"
        multiple
        description="Aceita apenas arquivos PDF"
      />

      {/* Com limite de tamanho */}
      <ArchbaseFileAttachment
        label="Limite 2MB"
        accept="*"
        maxSize={2 * 1024 * 1024}
        multiple
        description="Maximo 2MB por arquivo"
      />

      {/* Desabilitado */}
      <ArchbaseFileAttachment
        label="Desabilitado"
        accept="*"
        disabled
      />

      {/* Obrigatorio */}
      <ArchbaseFileAttachment
        label="Obrigatorio"
        accept="*"
        required
      />

      {/* Com erro */}
      <ArchbaseFileAttachment
        label="Com erro"
        accept="*"
        error="Anexe pelo menos um arquivo"
      />
    </Stack>
  );
}
