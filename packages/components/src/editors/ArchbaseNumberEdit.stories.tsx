import type { Meta, StoryObj } from '@storybook/react';
import { Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import React, { useRef, useState, useEffect } from 'react';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseNumberEdit } from './ArchbaseNumberEdit';

// Tipo de dados para o exemplo
interface Pessoa {
  id: number;
  nome: string;
  altura: number;
  peso: number;
  salario: number;
}

// Dados de exemplo
const pessoasData: Pessoa[] = [
  { id: 1, nome: 'João Silva', altura: 1.75, peso: 80.5, salario: 5000.0 },
];

const ArchbaseNumberEditExample = () => {
  const inputRef = useRef<HTMLInputElement>(null);
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
              <Text fw={500}>Number Edit Component</Text>
            </Group>
          </Card.Section>
          <ArchbaseNumberEdit<Pessoa, number>
            width={200}
            innerRef={inputRef}
            label="Altura"
            dataSource={dataSource}
            dataField="altura"
            precision={2}
          />
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

const ArchbaseNumberEditMultipleExample = () => {
  const { dataSource, isBrowsing, isEmpty, edit } = useArchbaseDataSourceV2<Pessoa>({
    initialData: pessoasData,
    name: 'dsPessoasMultiple',
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
              <Text fw={500}>Vários Number Edits</Text>
            </Group>
          </Card.Section>
          <ArchbaseNumberEdit<Pessoa, number>
            width={200}
            label="Altura (m)"
            dataSource={dataSource}
            dataField="altura"
            precision={2}
            min={0}
            max={3}
          />
          <ArchbaseNumberEdit<Pessoa, number>
            width={200}
            label="Peso (kg)"
            dataSource={dataSource}
            dataField="peso"
            precision={1}
            min={0}
            max={500}
          />
          <ArchbaseNumberEdit<Pessoa, number>
            width={200}
            label="Salário (R$)"
            dataSource={dataSource}
            dataField="salario"
            precision={2}
            min={0}
          />
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

const ArchbaseNumberEditControlledExample = () => {
  const [value, setValue] = useState(100.5);

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Number Edit Controlado</Text>
            </Group>
          </Card.Section>
          <ArchbaseNumberEdit<any, any>
            width={200}
            label="Valor"
            value={value}
            onChangeValue={(newValue) => setValue(newValue)}
            precision={2}
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
          <Text p="md">{value}</Text>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseNumberEdit> = {
  title: 'Editores/Number Edit',
  component: ArchbaseNumberEdit,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseNumberEdit é um componente de edição de números com suporte a DataSource.

## Características
- Integração com DataSource
- Precisão decimal configurável
- Valores mínimo e máximo
- Formatação numérica
- Modo controlado e não-controlado
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseNumberEdit>;

export const ExemploBasico: Story = {
  name: 'Exemplo Básico',
  render: () => <ArchbaseNumberEditExample />,
};

export const MultiplosNumeros: Story = {
  name: 'Múltiplos Numbers',
  render: () => <ArchbaseNumberEditMultipleExample />,
};

export const Controlado: Story = {
  name: 'Controlado (sem DataSource)',
  render: () => <ArchbaseNumberEditControlledExample />,
};
