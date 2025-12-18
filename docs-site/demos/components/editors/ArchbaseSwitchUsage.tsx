import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseSwitch } from '@archbase/components';

export function ArchbaseSwitchUsage() {
  const [value, setValue] = useState<boolean>(false);

  return (
    <Stack gap="md" p="md">
      <ArchbaseSwitch
        label="Modo escuro"
        isChecked={value}
        onChangeValue={(newValue) => setValue(newValue)}
        onLabel="ON"
        offLabel="OFF"
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Valor atual:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify({ ativo: value }, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
