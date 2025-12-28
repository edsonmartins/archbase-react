import React, { useState } from 'react';
import { Stack, Text, Code, Card } from '@mantine/core';
import { ArchbaseCronExpressionEdit } from '@archbase/components';

export function ArchbaseCronExpressionEditUsage() {
  const [value, setValue] = useState<string>('0 0 * * *');

  return (
    <Stack gap="md" p="md">
      <ArchbaseCronExpressionEdit
        label="Expressão Cron"
        value={value}
        onChange={setValue}
        placeholder="Digite a expressão cron..."
      />

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Expressão atual:
        </Text>
        <Code block style={{ fontSize: 12 }}>
          {value}
        </Code>
      </Card>

      <Card withBorder p="sm" radius="md">
        <Text size="sm" fw={500} mb="xs">
          Formato da expressão:
        </Text>
        <Text size="xs" c="dimmed">
          minuto hora dia-mês mês dia-semana
        </Text>
        <Text size="xs" c="dimmed" mt="xs">
          Exemplo: 0 0 * * * (meia-noite todos os dias)
        </Text>
      </Card>
    </Stack>
  );
}
