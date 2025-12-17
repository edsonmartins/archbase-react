import type { Meta, StoryObj } from '@storybook/react';
import { Box, Card, Grid, Group, ScrollArea, Space, Text } from '@mantine/core';
import React, { useState } from 'react';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseTreeSelect } from './ArchbaseTreeSelect';

// Dados de exemplo para a árvore
const treeData = [
  {
    id: '1',
    text: 'Brasil',
    type: 'COUNTRY',
    children: [
      {
        id: '1.1',
        text: 'São Paulo',
        type: 'STATE',
        children: [
          { id: '1.1.1', text: 'São Paulo (Capital)', type: 'SELECTABLE' },
          { id: '1.1.2', text: 'Campinas', type: 'SELECTABLE' },
          { id: '1.1.3', text: 'Santos', type: 'SELECTABLE' },
        ],
      },
      {
        id: '1.2',
        text: 'Rio de Janeiro',
        type: 'STATE',
        children: [
          { id: '1.2.1', text: 'Rio de Janeiro (Capital)', type: 'SELECTABLE' },
          { id: '1.2.2', text: 'Niterói', type: 'SELECTABLE' },
        ],
      },
      {
        id: '1.3',
        text: 'Minas Gerais',
        type: 'STATE',
        children: [
          { id: '1.3.1', text: 'Belo Horizonte', type: 'SELECTABLE' },
          { id: '1.3.2', text: 'Uberlândia', type: 'SELECTABLE' },
        ],
      },
    ],
  },
  {
    id: '2',
    text: 'Argentina',
    type: 'COUNTRY',
    children: [
      {
        id: '2.1',
        text: 'Buenos Aires',
        type: 'STATE',
        children: [
          { id: '2.1.1', text: 'Buenos Aires (Capital)', type: 'SELECTABLE' },
          { id: '2.1.2', text: 'La Plata', type: 'SELECTABLE' },
        ],
      },
    ],
  },
];

const ArchbaseTreeSelectExample = () => {
  const [value, setValue] = useState('');
  const [selectedNode, setSelectedNode] = useState<any>({});

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Tree Select Component</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 300 }}>
            <ArchbaseTreeSelect
              id="treeSelect"
              label="Selecionado"
              selectable={false}
              dataSource={treeData}
              withBorder={true}
              width="270px"
              widthTreeView="540px"
              heightTreeView="300px"
              value={value}
              height="calc(100% - 40px)"
              allowNodeSelectType={['SELECTABLE']}
              onConfirm={(node: any) => {
                setValue(node.text);
                setSelectedNode(node);
              }}
            />
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Nó selecionado</Text>
            </Group>
          </Card.Section>
          <ScrollArea h={300}>
            <Space h={20} />
            <ArchbaseObjectInspector data={selectedNode} expandLevel={10} />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const ArchbaseTreeSelectMultiSelectExample = () => {
  const [values, setValues] = useState<string[]>([]);
  const [selectedNodes, setSelectedNodes] = useState<any[]>([]);

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Tree Select Multi-seleção</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 300 }}>
            <ArchbaseTreeSelect
              id="treeSelectMulti"
              label="Cidades selecionadas"
              selectable={true}
              dataSource={treeData}
              withBorder={true}
              width="300px"
              widthTreeView="540px"
              heightTreeView="300px"
              value={values.join(', ')}
              height="calc(100% - 40px)"
              allowNodeSelectType={['SELECTABLE']}
              onConfirm={(nodes: any) => {
                if (Array.isArray(nodes)) {
                  setValues(nodes.map((n: any) => n.text));
                  setSelectedNodes(nodes);
                }
              }}
            />
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Nós selecionados</Text>
            </Group>
          </Card.Section>
          <ScrollArea h={300}>
            <Space h={20} />
            <ArchbaseObjectInspector data={selectedNodes} expandLevel={10} />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseTreeSelect> = {
  title: 'Editores/TreeSelect',
  component: ArchbaseTreeSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseTreeSelect é um componente de seleção hierárquica em árvore.

## Características
- Visualização em árvore
- Filtragem por tipo de nó
- Seleção única ou múltipla
- Expansão/colapso de nós
- Pesquisa na árvore
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseTreeSelect>;

export const ExemploBasico: Story = {
  name: 'Exemplo Básico',
  render: () => <ArchbaseTreeSelectExample />,
};

export const MultiSelecao: Story = {
  name: 'Multi-seleção',
  render: () => <ArchbaseTreeSelectMultiSelectExample />,
};
