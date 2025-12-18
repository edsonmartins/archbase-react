import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseMaskEdit, MaskPattern } from '@archbase/components';

export function ArchbaseMaskEditUsage() {
  const [cpf, setCpf] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  return (
    <Stack gap="md" p="md">
      <ArchbaseMaskEdit
        label="CPF"
        mask={MaskPattern.CPF}
        placeholder="Digite o CPF..."
        onChangeValue={(value) => setCpf(value)}
      />

      <ArchbaseMaskEdit
        label="Telefone"
        mask={MaskPattern.PHONE}
        placeholder="Digite o telefone..."
        onChangeValue={(value) => setPhone(value)}
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Valores atuais:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify({ cpf, phone }, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
