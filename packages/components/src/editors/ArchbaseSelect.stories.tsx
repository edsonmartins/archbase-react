import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Box, Card, Flex, Grid, Group, ScrollArea, Text } from '@mantine/core';
import React, { forwardRef, useState, useEffect } from 'react';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../debug';
import { ArchbaseSelect } from './ArchbaseSelect';
import { ArchbaseSelectItem } from './ArchbaseSelectItem';

// Enum para status
enum PedidoStatus {
  PENDENTE = 0,
  FATURADO = 1,
  CANCELADO = 2,
}

// Tipos de dados para o exemplo
interface Pessoa {
  id: number;
  nome: string;
  email: string;
}

interface Pedido {
  id: number;
  numero: string;
  cliente: Pessoa | null;
  status: number;
  total: number;
}

// Dados de exemplo
const pessoasData: Pessoa[] = [
  { id: 1, nome: 'João Silva', email: 'joao@email.com' },
  { id: 2, nome: 'Maria Santos', email: 'maria@email.com' },
  { id: 3, nome: 'Pedro Oliveira', email: 'pedro@email.com' },
  { id: 4, nome: 'Ana Costa', email: 'ana@email.com' },
  { id: 5, nome: 'Carlos Ferreira', email: 'carlos@email.com' },
];

const pedidosData: Pedido[] = [
  { id: 1, numero: 'PED-001', cliente: null, status: PedidoStatus.PENDENTE, total: 150.0 },
  { id: 2, numero: 'PED-002', cliente: null, status: PedidoStatus.FATURADO, total: 250.0 },
];

// Componente customizado para renderizar item de status
interface RenderStatusPedidoSelectItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string;
  origin: PedidoStatus;
}

const RenderStatusPedidoSelectItem = forwardRef<HTMLDivElement, RenderStatusPedidoSelectItemProps>(
  ({ label, origin, ...others }: RenderStatusPedidoSelectItemProps, ref) => (
    <div ref={ref} {...others}>
      <Flex>{buildStatusBadge(origin)}</Flex>
    </div>
  )
);

const buildStatusBadge = (data?: PedidoStatus) => {
  if (data !== undefined) {
    if (data === PedidoStatus.FATURADO) {
      return (
        <Badge color="green" variant="light">
          <Text size="0.8rem">FATURADO</Text>
        </Badge>
      );
    }
    if (data === PedidoStatus.CANCELADO) {
      return (
        <Badge color="red" variant="light">
          <Text size="0.8rem">CANCELADO</Text>
        </Badge>
      );
    }
    if (data === PedidoStatus.PENDENTE) {
      return (
        <Badge color="gray" variant="light">
          <Text size="0.8rem">PENDENTE</Text>
        </Badge>
      );
    }
  }
  return null;
};

const ArchbaseSelectExample = () => {
  const { dataSource, isBrowsing, isEmpty, edit } = useArchbaseDataSourceV2<Pedido>({
    initialData: pedidosData,
    name: 'dsPedidos',
  });

  useEffect(() => {
    if (isBrowsing && !isEmpty) {
      edit();
    }
  }, [isBrowsing, isEmpty, edit]);

  return (
    <Grid>
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder maw={500}>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Select Component</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 150 }}>
            <ArchbaseSelect<Pedido, number, Pessoa>
              label="Cliente"
              dataSource={dataSource}
              dataField="cliente"
              initialOptions={pessoasData}
              getOptionLabel={(option: Pessoa) => option.nome}
              getOptionValue={(option: Pessoa) => option.nome}
              searchable={true}
            />
            <ArchbaseSelect<Pedido, number, any>
              label="Status"
              dataSource={dataSource}
              dataField="status"
              itemComponent={RenderStatusPedidoSelectItem}
              searchable={true}
              getOptionLabel={(option: any) => option.label || option}
              getOptionValue={(option: any) => option.value || option.toString()}
            >
              <ArchbaseSelectItem
                disabled={false}
                label="Pendente"
                value={PedidoStatus.PENDENTE.toString()}
                origin={PedidoStatus.PENDENTE}
              />
              <ArchbaseSelectItem
                disabled={false}
                label="Faturado"
                value={PedidoStatus.FATURADO.toString()}
                origin={PedidoStatus.FATURADO}
              />
              <ArchbaseSelectItem
                disabled={false}
                label="Cancelado"
                value={PedidoStatus.CANCELADO.toString()}
                origin={PedidoStatus.CANCELADO}
              />
            </ArchbaseSelect>
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Objeto Pedido</Text>
            </Group>
          </Card.Section>
          <ScrollArea style={{ height: 500 }}>
            <ArchbaseJsonView data={dataSource?.getCurrentRecord()!} />
          </ScrollArea>
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
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

const ArchbaseSelectControlledExample = () => {
  const [selected, setSelected] = useState<string>('');

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
              <Text fw={500}>Select Controlado</Text>
            </Group>
          </Card.Section>
          <ArchbaseSelect<any, any, any>
            label="Framework"
            initialOptions={options}
            value={selected}
            onSelectValue={(value) => setSelected(value)}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            searchable
            clearable
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
          <Text p="md">{selected || '(nenhum)'}</Text>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseSelect> = {
  title: 'Editores/Select',
  component: ArchbaseSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseSelect é um componente de seleção dropdown com suporte a DataSource.

## Características
- Integração com DataSource
- Opções customizáveis
- Componente de item customizado
- Pesquisável e limpável
- Modo controlado e não-controlado
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseSelect>;

export const ComDataSource: Story = {
  name: 'Com DataSource',
  render: () => <ArchbaseSelectExample />,
};

export const Controlado: Story = {
  name: 'Controlado (sem DataSource)',
  render: () => <ArchbaseSelectControlledExample />,
};
