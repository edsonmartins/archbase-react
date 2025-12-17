import type { Meta, StoryObj } from '@storybook/react';
import { Card, Grid, Group, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseRadioGroup } from './ArchbaseRadioGroup';

// Enum para status
enum PedidoStatus {
  Pendente = 0,
  Aprovado = 1,
  Enviado = 2,
  Entregue = 3,
  Cancelado = 4,
}

// Tipo de dados para o exemplo
interface Pedido {
  id: number;
  numero: string;
  status: number;
  total: number;
}

// Dados de exemplo
const pedidoData: Pedido[] = [
  { id: 1, numero: 'PED-001', status: PedidoStatus.Pendente, total: 150.0 },
];

const enumToOptionsArray = (enumObject: any) => {
  return Object.keys(enumObject)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: key,
      value: enumObject[key].toString(),
    }));
};

const statusArray = enumToOptionsArray(PedidoStatus);

const ArchbaseRadioGroupExample = () => {
  const { dataSource, isBrowsing, isEmpty, edit } = useArchbaseDataSourceV2<Pedido>({
    initialData: pedidoData,
    name: 'dsPedidos',
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
              <Text fw={500}>RadioGroup Component</Text>
            </Group>
          </Card.Section>
          <ArchbaseRadioGroup<Pedido, number, any>
            label="Status"
            initialOptions={statusArray}
            dataSource={dataSource}
            dataField="status"
            convertFromString={(selected) => Number(selected)}
          />
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>DataSource dsPedidos</Text>
            </Group>
          </Card.Section>
          <ArchbaseObjectInspector data={dataSource} />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const ArchbaseRadioGroupControlledExample = () => {
  const [selected, setSelected] = useState('option1');

  const options = [
    { label: 'Opção 1', value: 'option1' },
    { label: 'Opção 2', value: 'option2' },
    { label: 'Opção 3', value: 'option3' },
  ];

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>RadioGroup Controlado</Text>
            </Group>
          </Card.Section>
          <ArchbaseRadioGroup<any, any, any>
            label="Escolha uma opção"
            initialOptions={options}
            value={selected}
            onSelectValue={(value) => setSelected(value)}
          />
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Valor Selecionado</Text>
            </Group>
          </Card.Section>
          <Text p="md">{selected}</Text>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseRadioGroup> = {
  title: 'Editores/RadioGroup',
  component: ArchbaseRadioGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseRadioGroup é um componente de seleção única com radio buttons.

## Características
- Integração com DataSource
- Suporte a enum/opções customizadas
- Conversão de valores
- Modo controlado e não-controlado
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseRadioGroup>;

export const ComDataSource: Story = {
  name: 'Com DataSource',
  render: () => <ArchbaseRadioGroupExample />,
};

export const Controlado: Story = {
  name: 'Controlado (sem DataSource)',
  render: () => <ArchbaseRadioGroupControlledExample />,
};
