import type { Meta, StoryObj } from '@storybook/react';
import { Box, Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseJsonEdit } from './ArchbaseJsonEdit';

// Tipo de dados para o exemplo
interface Pessoa {
  id: number;
  nome: string;
  email: string;
  codigoJson: string;
}

// Dados de exemplo
const pessoasData: Pessoa[] = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao@email.com',
    codigoJson: JSON.stringify({ key: 'value', nested: { a: 1, b: 2 } }, null, 2),
  },
];

const ArchbaseJsonEditExample = () => {
  const { dataSource, isBrowsing, isEmpty, edit } = useArchbaseDataSourceV2<Pessoa>({
    initialData: pessoasData,
    name: 'dsPessoas',
  });

  useEffect(() => {
    if (isBrowsing && !isEmpty) {
      edit();
    }
  }, [isBrowsing, isEmpty, edit]);

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Json Edit Component</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 300 }}>
            <ArchbaseJsonEdit<Pessoa, number>
              maxRows={100}
              maxLength={1000}
              label="Json"
              dataSource={dataSource}
              dataField="codigoJson"
            />
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>DataSource dsPessoas</Text>
            </Group>
          </Card.Section>
          <ScrollArea style={{ height: 500 }}>
            <ArchbaseObjectInspector data={dataSource} />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const ArchbaseJsonEditControlledExample = () => {
  const [jsonValue, setJsonValue] = useState(
    JSON.stringify({ name: 'Test', items: [1, 2, 3] }, null, 2)
  );

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Json Edit Controlado</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 300 }}>
            <ArchbaseJsonEdit<any, any>
              maxRows={100}
              maxLength={1000}
              label="Json"
              value={jsonValue}
              onChangeValue={(value) => setJsonValue(value)}
            />
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Valor</Text>
            </Group>
          </Card.Section>
          <ScrollArea style={{ height: 300 }}>
            <Text size="xs" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
              {jsonValue}
            </Text>
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseJsonEdit> = {
  title: 'Editores/Json Edit',
  component: ArchbaseJsonEdit,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseJsonEdit é um componente de edição de JSON com suporte a DataSource.

## Características
- Integração com DataSource
- Syntax highlighting para JSON
- Validação de JSON
- Modo controlado e não-controlado
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseJsonEdit>;

export const ComDataSource: Story = {
  name: 'Com DataSource',
  render: () => <ArchbaseJsonEditExample />,
};

export const Controlado: Story = {
  name: 'Controlado (sem DataSource)',
  render: () => <ArchbaseJsonEditControlledExample />,
};
