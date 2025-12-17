import type { Meta, StoryObj } from '@storybook/react';
import { Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { ArchbaseDataSource, useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseChipGroup } from './ArchbaseChipGroup';

// Tipos de dados para o exemplo
interface Produto {
  id: number;
  descricao: string;
  preco: number;
}

interface ItemPedido {
  produto: Produto;
  quantidade: number;
  total: number;
}

interface Pedido {
  id: number;
  numero: string;
  itens: ItemPedido[];
  vlTotal: number;
  status: number;
}

// Enum para status
enum PedidoStatus {
  Pendente = 0,
  Aprovado = 1,
  Enviado = 2,
  Entregue = 3,
  Cancelado = 4,
}

// Dados de exemplo
const produtosData: Produto[] = [
  { id: 1, descricao: 'Notebook Dell', preco: 3500 },
  { id: 2, descricao: 'Monitor LG 27"', preco: 1200 },
  { id: 3, descricao: 'Teclado Mecânico', preco: 350 },
  { id: 4, descricao: 'Mouse Gamer', preco: 180 },
  { id: 5, descricao: 'Headset', preco: 250 },
];

const pedidoData: Pedido[] = [
  {
    id: 1,
    numero: 'PED-001',
    itens: [],
    vlTotal: 0,
    status: PedidoStatus.Pendente,
  },
];

const getProdutosFromIds = (produtoIds: string[] | string) => {
  if (produtoIds === null || produtoIds === undefined) {
    return [];
  }

  const ids = Array.isArray(produtoIds) ? produtoIds : [produtoIds];
  return produtosData
    .filter((produto) => ids.includes(produto.id.toString()))
    .map((produto) => ({
      produto: produto,
      quantidade: 1,
      total: produto.preco,
    }));
};

const getIdFromProduto = (item: ItemPedido) => {
  return item.produto.id;
};

const getValueFromProduto = (produto: Produto) => {
  return produto.id;
};

const getLabelFromProduto = (produto: Produto) => {
  return produto.descricao;
};

const updateTotalValue = (dataSource: ArchbaseDataSource<Pedido, number>, produtos: ItemPedido[]) => {
  const total = produtos.reduce((acumulado, item) => {
    return acumulado + item.total;
  }, 0);
  dataSource?.setFieldValue('vlTotal', total);
};

const ArchbaseChipGroupExample = () => {
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
              <Text fw={500}>Chip Group Edit (Múltipla Seleção)</Text>
            </Group>
          </Card.Section>
          <ArchbaseChipGroup<Pedido, number, Produto>
            initialOptions={produtosData}
            dataSource={dataSource}
            dataField="itens"
            convertFromValue={getProdutosFromIds}
            getOptionLabel={getLabelFromProduto}
            getOptionValue={getValueFromProduto}
            convertToValue={getIdFromProduto}
            onSelectValue={() => updateTotalValue(dataSource!, dataSource?.getFieldValue('itens'))}
            multiple={true}
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
          <ScrollArea style={{ height: 500 }}>
            <ArchbaseObjectInspector data={dataSource} />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const enumToOptionsArray = (enumObject: any) => {
  return Object.keys(enumObject)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      label: key,
      value: enumObject[key],
    }));
};

const statusArray = enumToOptionsArray(PedidoStatus);

const ArchbaseChipGroupSingleExample = () => {
  const { dataSource, isBrowsing, isEmpty, edit } = useArchbaseDataSourceV2<Pedido>({
    initialData: pedidoData,
    name: 'dsPedidosSingle',
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
              <Text fw={500}>Chip Group Edit (Seleção Única)</Text>
            </Group>
          </Card.Section>
          <ArchbaseChipGroup<Pedido, number, any>
            initialOptions={statusArray}
            dataSource={dataSource}
            dataField="status"
            convertFromValue={(selected) => Number(selected)}
            multiple={false}
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

const ArchbaseChipGroupControlledExample = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const options = [
    { label: 'React', value: 'react' },
    { label: 'Vue', value: 'vue' },
    { label: 'Angular', value: 'angular' },
    { label: 'Svelte', value: 'svelte' },
  ];

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Chip Group Controlado</Text>
            </Group>
          </Card.Section>
          <ArchbaseChipGroup<any, any, any>
            initialOptions={options}
            value={selectedValues}
            onSelectValue={(values) => setSelectedValues(values)}
            multiple={true}
          />
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Valores Selecionados</Text>
            </Group>
          </Card.Section>
          <ArchbaseObjectInspector data={selectedValues} />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseChipGroup> = {
  title: 'Editores/Chip Group',
  component: ArchbaseChipGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseChipGroup é um componente de grupo de chips selecionáveis com suporte a DataSource.

## Características
- Integração com DataSource
- Suporte a seleção múltipla ou única
- Conversão de valores customizada
- Modo controlado e não-controlado
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseChipGroup>;

export const MultiplaSelecao: Story = {
  name: 'Múltipla Seleção',
  render: () => <ArchbaseChipGroupExample />,
};

export const SelecaoUnica: Story = {
  name: 'Seleção Única',
  render: () => <ArchbaseChipGroupSingleExample />,
};

export const Controlado: Story = {
  name: 'Controlado (sem DataSource)',
  render: () => <ArchbaseChipGroupControlledExample />,
};
