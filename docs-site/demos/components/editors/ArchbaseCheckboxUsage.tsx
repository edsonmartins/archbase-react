import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseCheckbox } from '@archbase/components';

export function ArchbaseCheckboxUsage() {
  const [value, setValue] = useState<boolean>(false);

  return (
    <Stack gap="md" p="md">
      <ArchbaseCheckbox
        label="Aceito os termos de uso"
        isChecked={value}
        onChangeValue={(newValue) => setValue(newValue)}
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Valor atual:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {JSON.stringify({ checked: value }, null, 2)}
        </Code>
      </Card>
    </Stack>
  );
}
