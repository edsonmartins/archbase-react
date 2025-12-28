import React from 'react';
import { Stack, Text } from '@mantine/core';
import { ArchbaseKeyValueEditor } from '@archbase/components';

export function ArchbaseKeyValueEditorStates() {
  return (
    <Stack gap="md" p="md">
      <Text size="sm" fw={500}>Estados:</Text>

      <ArchbaseKeyValueEditor
        label="Normal"
        initialValue=""
        keyLabel="Chave"
        valueLabel="Valor"
        onChangeKeyValue={(value) => console.log('Changed:', value)}
      />

      <ArchbaseKeyValueEditor
        label="Com valores iniciais"
        initialValue="nome,Joao;idade,30"
        keyLabel="Propriedade"
        valueLabel="Valor"
        onChangeKeyValue={(value) => console.log('Changed:', value)}
      />

      <ArchbaseKeyValueEditor
        label="Somente leitura"
        initialValue="chave1,valor1;chave2,valor2"
        readOnly
        onChangeKeyValue={(value) => console.log('Changed:', value)}
      />

      <ArchbaseKeyValueEditor
        label="Com erro"
        initialValue=""
        error="Campo obrigatorio"
        onChangeKeyValue={(value) => console.log('Changed:', value)}
      />

      <ArchbaseKeyValueEditor
        label="Layout vertical"
        initialValue=""
        layout="vertical"
        onChangeKeyValue={(value) => console.log('Changed:', value)}
      />
    </Stack>
  );
}
