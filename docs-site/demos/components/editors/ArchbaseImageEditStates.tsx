import React from 'react';
import { Stack, Group } from '@mantine/core';
import { ArchbaseImageEdit } from '@archbase/components';

export function ArchbaseImageEditStates() {
  return (
    <Stack gap="md" p="md">
      <Group align="flex-start">
        {/* Normal */}
        <ArchbaseImageEdit
          label="Normal"
          width={120}
          height={120}
        />

        {/* Obrigatorio */}
        <ArchbaseImageEdit
          label="Obrigatorio"
          width={120}
          height={120}
          required
        />

        {/* Desabilitado */}
        <ArchbaseImageEdit
          label="Desabilitado"
          width={120}
          height={120}
          disabled
        />
      </Group>

      <Group align="flex-start">
        {/* Somente leitura */}
        <ArchbaseImageEdit
          label="Somente leitura"
          width={120}
          height={120}
          readOnly
        />

        {/* Com erro */}
        <ArchbaseImageEdit
          label="Com erro"
          width={120}
          height={120}
          error="Imagem obrigatoria"
        />

        {/* Tamanho maior */}
        <ArchbaseImageEdit
          label="Tamanho maior"
          width={180}
          height={180}
        />
      </Group>
    </Stack>
  );
}
