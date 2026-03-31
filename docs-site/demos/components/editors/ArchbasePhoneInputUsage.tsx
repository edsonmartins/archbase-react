import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbasePhoneInput } from '@archbase/components';

export function ArchbasePhoneInputUsage() {
  const [value, setValue] = useState<string>('');

  return (
    <Stack gap="md" p="md">
      <ArchbasePhoneInput
        label="Telefone"
        placeholder="Digite o telefone..."
        value={value}
        onChangeValue={(newValue) => setValue(newValue)}
        defaultCountry="BR"
        international
      />

      {value && (
        <Card withBorder p="sm" radius="md">
          <Text size="sm" fw={500} mb="xs">Valor atual:</Text>
          <Code block style={{ fontSize: 12 }}>
            {JSON.stringify({ value }, null, 2)}
          </Code>
        </Card>
      )}
    </Stack>
  );
}
