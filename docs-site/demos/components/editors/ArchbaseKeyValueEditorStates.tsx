import React from 'react';
import { Stack } from '@mantine/core';
import { ArchbaseKeyValueEditor } from '@archbase/components';

export function ArchbaseKeyValueEditorStates() {
  return (
    <Stack gap="md" p="md">
      {/* Normal */}
      <ArchbaseKeyValueEditor
        label="Normal"
        value={{}}
        onChange={() => {}}
        keyPlaceholder="Chave"
        valuePlaceholder="Valor"
      />

      {/* Com valores */}
      <ArchbaseKeyValueEditor
        label="Com valores"
        value={{
          chave1: 'valor1',
          chave2: 'valor2'
        }}
        onChange={() => {}}
      />

      {/* Obrigatorio */}
      <ArchbaseKeyValueEditor
        label="Obrigatorio"
        value={{}}
        onChange={() => {}}
        required
      />

      {/* Desabilitado */}
      <ArchbaseKeyValueEditor
        label="Desabilitado"
        value={{
          API_KEY: 'secret123'
        }}
        onChange={() => {}}
        disabled
      />

      {/* Somente leitura */}
      <ArchbaseKeyValueEditor
        label="Somente leitura"
        value={{
          DATABASE: 'production'
        }}
        onChange={() => {}}
        readOnly
      />
    </Stack>
  );
}
