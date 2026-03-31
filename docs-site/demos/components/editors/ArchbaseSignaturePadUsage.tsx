import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseSignaturePad } from '@archbase/components';

export function ArchbaseSignaturePadUsage() {
  const [value, setValue] = useState<string>('');

  return (
    <Stack gap="md" p="md">
      <ArchbaseSignaturePad
        label="Assinatura"
        value={value}
        onChangeValue={(newValue) => setValue(newValue)}
        width={500}
        height={200}
        penColor="black"
        showClearButton
      />

      {value && (
        <Card withBorder p="sm" radius="md">
          <Text size="sm" fw={500} mb="xs">Assinatura capturada (base64):</Text>
          <Code block style={{ fontSize: 12 }}>
            {value.substring(0, 80)}...
          </Code>
        </Card>
      )}
    </Stack>
  );
}
