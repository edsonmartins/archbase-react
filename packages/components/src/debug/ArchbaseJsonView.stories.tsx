import type { Meta, StoryObj } from '@storybook/react';
import { Card, Grid, Group, Text } from '@mantine/core';
import React from 'react';
import { ArchbaseJsonView } from './jsonview';

// Dados de exemplo
const dadosSimples = {
  nome: 'João Silva',
  email: 'joao@email.com',
  idade: 30,
  ativo: true,
};

const dadosComplexos = {
  id: 1,
  usuario: {
    nome: 'João Silva',
    email: 'joao@email.com',
    perfil: {
      cargo: 'Desenvolvedor',
      departamento: 'TI',
      salario: 5000.0,
    },
  },
  pedidos: [
    { id: 1, numero: 'PED-001', total: 150.0, status: 'PENDENTE' },
    { id: 2, numero: 'PED-002', total: 250.0, status: 'ENTREGUE' },
  ],
  metadados: {
    criadoEm: '2024-01-15T10:30:00Z',
    atualizadoEm: '2024-01-20T14:45:00Z',
    versao: '1.0.0',
  },
};

const ArchbaseJsonViewExample = () => {
  return (
    <Grid>
      <Grid.Col offset={1} span={5}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Json View Simples</Text>
            </Group>
          </Card.Section>
          <ArchbaseJsonView data={dadosSimples} />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const ArchbaseJsonViewComplexExample = () => {
  return (
    <Grid>
      <Grid.Col offset={1} span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Json View Complexo</Text>
            </Group>
          </Card.Section>
          <ArchbaseJsonView data={dadosComplexos} />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const ArchbaseJsonViewExpandedExample = () => {
  return (
    <Grid>
      <Grid.Col offset={1} span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Json View Expandido</Text>
            </Group>
          </Card.Section>
          <ArchbaseJsonView
            data={dadosComplexos}
            shouldInitiallyExpand={(level) => level < 3}
          />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseJsonView> = {
  title: 'Depuração/Json View',
  component: ArchbaseJsonView,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseJsonView é um componente para visualizar dados JSON de forma formatada.

## Características
- Visualização formatada de JSON
- Syntax highlighting
- Expansão/colapso de nós
- Nível de expansão inicial configurável
- Suporte a temas claro/escuro
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseJsonView>;

export const Simples: Story = {
  name: 'Dados Simples',
  render: () => <ArchbaseJsonViewExample />,
};

export const Complexo: Story = {
  name: 'Dados Complexos',
  render: () => <ArchbaseJsonViewComplexExample />,
};

export const Expandido: Story = {
  name: 'Expandido Automaticamente',
  render: () => <ArchbaseJsonViewExpandedExample />,
};
