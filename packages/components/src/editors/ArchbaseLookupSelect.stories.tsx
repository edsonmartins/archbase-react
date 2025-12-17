import type { Meta, StoryObj } from '@storybook/react';
import { Box, Card, Flex, Grid, Group, ScrollArea, Text } from '@mantine/core';
import React, { useEffect } from 'react';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseEdit } from './ArchbaseEdit';
import { ArchbaseLookupSelect } from './ArchbaseLookupSelect';

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
  { id: 1, numero: 'PED-001', cliente: null, total: 150.0 },
  { id: 2, numero: 'PED-002', cliente: null, total: 250.0 },
];

const ArchbaseLookupSelectExample = () => {
  const { dataSource: dsPessoas } = useArchbaseDataSourceV2<Pessoa>({
    initialData: pessoasData,
    name: 'dsPessoas',
  });

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
      <Grid.Col offset={1} span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Lookup Select Component</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 100 }}>
            <Flex justify="flex-start" align="center" direction="row" wrap="nowrap" gap="xs">
              <ArchbaseLookupSelect<Pedido, number, Pessoa>
                label="Cliente"
                dataSource={dataSource}
                dataField="cliente"
                lookupDataSource={dsPessoas}
                lookupDataFieldText="nome"
                lookupDataFieldId="id"
                required={true}
                width={300}
                getOptionLabel={(option: Pessoa) => option.nome}
                getOptionValue={(option: Pessoa) => option}
              />
              <ArchbaseEdit label="Nome" dataSource={dataSource} dataField="cliente.nome" disabled width={300} />
            </Flex>
          </Box>
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

const meta: Meta<typeof ArchbaseLookupSelect> = {
  title: 'Editores/Lookup Select',
  component: ArchbaseLookupSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseLookupSelect é um componente de lookup baseado em Select que carrega opções de um DataSource.

## Características
- Integração com DataSource
- Carrega opções de outro DataSource de lookup
- Seleção via dropdown
- Campo de texto e ID configuráveis
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseLookupSelect>;

export const ExemploBasico: Story = {
  name: 'Exemplo Básico',
  render: () => <ArchbaseLookupSelectExample />,
};
