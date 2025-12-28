import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseOperatingHoursEditor } from '@archbase/components';

export function ArchbaseOperationHoursEditorUsage() {
  const [value, setValue] = useState<string>('');

  return (
    <Stack gap="md" p="md">
      <ArchbaseOperatingHoursEditor
        label="Horário de Funcionamento"
        initialValue={value}
        onChange={setValue}
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Valor formatado:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {value || '(vazio)'}
        </Code>
      </Card>

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Formato da string:
        </Text>
        <Text size="xs" c="dimmed">
          dias|horarioInicio-horarioFim;...
        </Text>
        <Text size="xs" c="dimmed" mt="xs">
          Exemplo: MONDAY,TUESDAY|09:00-18:00;SATURDAY,SUNDAY|10:00-14:00
        </Text>
      </Card>
    </Stack>
  );
}
