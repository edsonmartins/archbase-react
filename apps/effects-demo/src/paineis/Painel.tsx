import type { ReactNode } from 'react';
import { Card, Code, Group, Stack, Text, Title } from '@mantine/core';

export interface PainelProps {
  titulo: string;
  descricao: string;
  /** Defeito do original que este porte corrige. */
  correcao?: string;
  controles: ReactNode;
  children: ReactNode;
}

export function Painel({ titulo, descricao, correcao, controles, children }: PainelProps) {
  return (
    <Card withBorder padding="md">
      <Stack gap="sm">
        <div>
          <Group gap="xs" align="baseline">
            <Title order={4}>{titulo}</Title>
            <Code>{`<${titulo} />`}</Code>
          </Group>
          <Text size="sm" c="dimmed">
            {descricao}
          </Text>
          {correcao && (
            <Text size="xs" c="teal" mt={4}>
              Corrigido em relacao ao original: {correcao}
            </Text>
          )}
        </div>

        <Group align="flex-start" gap="md" wrap="nowrap">
          <Stack gap="xs" w={230} style={{ flexShrink: 0 }}>
            {controles}
          </Stack>
          <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
        </Group>
      </Stack>
    </Card>
  );
}
