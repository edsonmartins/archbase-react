import type { Meta, StoryObj } from '@storybook/react';
import { Box, Card, Grid, Group, Text } from '@mantine/core';
import React, { useState } from 'react';
import { ArchbaseCronExpressionEditor } from './ArchbaseCronExpressionEditor';
import { ArchbaseObjectInspector } from '../debug';

const ArchbaseCronExpressionEditorExample = () => {
  const [cronValue, setCronValue] = useState('');

  return (
    <Grid>
      <Grid.Col offset={1} span={7}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Cron Expression Editor Component</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 500 }}>
            <ArchbaseCronExpressionEditor
              label="Cron Expression"
              initialValue={cronValue}
              onChange={(value) => setCronValue(value)}
            />
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col span={3}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Valor da Expressão</Text>
            </Group>
          </Card.Section>
          <Box p="md">
            <Text size="sm" fw={500}>Expressão Cron:</Text>
            <Text size="sm" c="dimmed">{cronValue || '(vazio)'}</Text>
          </Box>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const ArchbaseCronExpressionEditorWithInitialValueExample = () => {
  const [cronValue, setCronValue] = useState('0 0 12 * * ?');

  return (
    <Grid>
      <Grid.Col offset={1} span={7}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Cron com Valor Inicial (Meio-dia diário)</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 500 }}>
            <ArchbaseCronExpressionEditor
              label="Cron Expression"
              initialValue={cronValue}
              onChange={(value) => setCronValue(value)}
            />
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col span={3}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Valor da Expressão</Text>
            </Group>
          </Card.Section>
          <Box p="md">
            <Text size="sm" fw={500}>Expressão Cron:</Text>
            <Text size="sm" c="dimmed">{cronValue || '(vazio)'}</Text>
          </Box>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseCronExpressionEditor> = {
  title: 'Editores/CronExpressionEditor',
  component: ArchbaseCronExpressionEditor,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseCronExpressionEditor é um componente visual para criar e editar expressões Cron.

## Características
- Interface visual para criar expressões Cron
- Suporte a todos os campos de uma expressão Cron
- Preview da expressão gerada
- Validação de expressões
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseCronExpressionEditor>;

export const ExemploBasico: Story = {
  name: 'Exemplo Básico',
  render: () => <ArchbaseCronExpressionEditorExample />,
};

export const ComValorInicial: Story = {
  name: 'Com Valor Inicial',
  render: () => <ArchbaseCronExpressionEditorWithInitialValueExample />,
};
