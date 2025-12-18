import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseRadioGroup } from '@archbase/components';

interface Opcao {
  value: string;
  label: string;
}

const opcoes: Opcao[] = [
  { value: 'pequeno', label: 'Pequeno' },
  { value: 'medio', label: 'Medio' },
  { value: 'grande', label: 'Grande' },
];

export function ArchbaseRadioGroupUsage() {
  const [value, setValue] = useState<string>('');

  return (
    <Stack gap="md" p="md">
      <ArchbaseRadioGroup<any, any, Opcao>
        label="Tamanho"
        description="Selecione o tamanho desejado"
        initialOptions={opcoes}
        getOptionLabel={(o) => o.label}
        getOptionValue={(o) => o.value}
        onSelectValue={(v) => setValue(v)}
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Valor selecionado:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify({ value }, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
