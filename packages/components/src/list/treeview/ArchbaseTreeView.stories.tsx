import type { Meta, StoryObj } from '@storybook/react';
import { Card, Grid, Group, Text } from '@mantine/core';
import React from 'react';
import { ArchbaseTreeView } from './ArchbaseTreeView';

// Dados de exemplo para a árvore
const treeData = [
  {
    id: '1',
    label: 'Raiz 1',
    children: [
      {
        id: '1.1',
        label: 'Item 1.1',
        children: [
          { id: '1.1.1', label: 'Item 1.1.1' },
          { id: '1.1.2', label: 'Item 1.1.2' },
        ],
      },
      { id: '1.2', label: 'Item 1.2' },
    ],
  },
  {
    id: '2',
    label: 'Raiz 2',
    children: [
      { id: '2.1', label: 'Item 2.1' },
      { id: '2.2', label: 'Item 2.2' },
    ],
  },
  {
    id: '3',
    label: 'Raiz 3',
  },
];

const ArchbaseTreeViewExample = () => {
  return (
    <Grid>
      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>TreeView</Text>
            </Group>
          </Card.Section>
          <ArchbaseTreeView
            data={treeData}
            onSelectNode={(node) => console.log('Selecionado:', node)}
          />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseTreeView> = {
  title: 'Listas e Tabelas/TreeView',
  component: ArchbaseTreeView,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseTreeView é um componente de visualização em árvore hierárquica.

## Características
- Estrutura de dados hierárquica
- Expansão/colapso de nós
- Seleção de nós
- Customização de ícones
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseTreeView>;

export const ExemploSimples: Story = {
  name: 'Exemplo Simples',
  render: () => <ArchbaseTreeViewExample />,
};
