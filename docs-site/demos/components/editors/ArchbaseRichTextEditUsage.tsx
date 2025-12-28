import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseRichTextEdit } from '@archbase/components';

export function ArchbaseRichTextEditUsage() {
  const [value, setValue] = useState('<p>Texto inicial em <strong>negrito</strong> e <em>itálico</em>.</p>');

  return (
    <Stack gap="md" p="md">
      <ArchbaseRichTextEdit
        label="Conteúdo"
        value={value}
        height="300px"
        onChangeValue={(newValue) => setValue(newValue)}
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          HTML gerado:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {value}
        </Code>
      </Card>
    </Stack>
  );
}
