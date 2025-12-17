import type { Meta, StoryObj } from '@storybook/react';
import { Card, Grid, Group, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbasePasswordEdit } from './ArchbasePasswordEdit';

// Tipo de dados para o exemplo
interface Pessoa {
  id: number;
  nome: string;
  email: string;
  senha: string;
}

// Dados de exemplo
const pessoasData: Pessoa[] = [
  { id: 1, nome: 'João Silva', email: 'joao@email.com', senha: '' },
];

const ArchbasePasswordEditExample = () => {
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
              <Text fw={500}>Password Edit Component</Text>
            </Group>
          </Card.Section>
          <ArchbasePasswordEdit label="Senha" dataSource={dataSource} dataField="senha" />
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>DataSource dsPessoas</Text>
            </Group>
          </Card.Section>
          <ArchbaseObjectInspector data={dataSource} />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const ArchbasePasswordEditControlledExample = () => {
  const [password, setPassword] = useState('');

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Password Edit Controlado</Text>
            </Group>
          </Card.Section>
          <ArchbasePasswordEdit
            label="Senha"
            value={password}
            onChangeValue={(value) => setPassword(value)}
          />
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Valor</Text>
            </Group>
          </Card.Section>
          <Text p="md" size="sm">
            Tamanho da senha: {password.length} caracteres
          </Text>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbasePasswordEdit> = {
  title: 'Editores/Password Edit',
  component: ArchbasePasswordEdit,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbasePasswordEdit é um componente de edição de senha com suporte a DataSource.

## Características
- Integração com DataSource
- Ocultação automática do texto
- Botão para mostrar/ocultar senha
- Modo controlado e não-controlado
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbasePasswordEdit>;

export const ComDataSource: Story = {
  name: 'Com DataSource',
  render: () => <ArchbasePasswordEditExample />,
};

export const Controlado: Story = {
  name: 'Controlado (sem DataSource)',
  render: () => <ArchbasePasswordEditControlledExample />,
};
