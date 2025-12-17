import type { Meta, StoryObj } from '@storybook/react';
import { Box, Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseAsyncSelect, OptionsResult } from './ArchbaseAsyncSelect';

// Tipos de dados para o exemplo
interface Pessoa {
  id: number;
  nome: string;
  email: string;
  idade: number;
}

interface Pedido {
  id: number;
  numero: string;
  cliente: Pessoa | null;
  total: number;
}

// Dados de exemplo
const pessoasData: Pessoa[] = [
  { id: 1, nome: 'João Silva', email: 'joao@email.com', idade: 30 },
  { id: 2, nome: 'Maria Santos', email: 'maria@email.com', idade: 25 },
  { id: 3, nome: 'Pedro Oliveira', email: 'pedro@email.com', idade: 35 },
  { id: 4, nome: 'Ana Costa', email: 'ana@email.com', idade: 28 },
  { id: 5, nome: 'Carlos Ferreira', email: 'carlos@email.com', idade: 40 },
  { id: 6, nome: 'Lucia Lima', email: 'lucia@email.com', idade: 32 },
  { id: 7, nome: 'Roberto Souza', email: 'roberto@email.com', idade: 45 },
  { id: 8, nome: 'Fernanda Martins', email: 'fernanda@email.com', idade: 27 },
  { id: 9, nome: 'Paulo Rodrigues', email: 'paulo@email.com', idade: 38 },
  { id: 10, nome: 'Camila Alves', email: 'camila@email.com', idade: 29 },
];

const pedidosData: Pedido[] = [
  { id: 1, numero: 'PED-001', cliente: null, total: 150.0 },
  { id: 2, numero: 'PED-002', cliente: null, total: 250.0 },
  { id: 3, numero: 'PED-003', cliente: null, total: 350.0 },
];

const PAGE_SIZE = 5;

const ArchbaseAsyncSelectExample = () => {
  const { dataSource, isBrowsing, isEmpty, edit } = useArchbaseDataSourceV2<Pedido>({
    name: 'dsPedidos',
    initialData: pedidosData,
  });

  useEffect(() => {
    if (isBrowsing && !isEmpty) {
      edit();
    }
  }, [isBrowsing, isEmpty, edit]);

  // Simula uma busca assíncrona com paginação
  const loadRemotePessoas = async (page: number, value: string): Promise<OptionsResult<Pessoa>> => {
    return new Promise<OptionsResult<Pessoa>>((resolve) => {
      // Simula delay de rede
      setTimeout(() => {
        const filtered = pessoasData.filter((p) =>
          p.nome.toLowerCase().includes((value || '').toLowerCase())
        );
        const start = page * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const paginatedData = filtered.slice(start, end);
        const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

        resolve({
          options: paginatedData,
          page: page,
          totalPages: totalPages,
        });
      }, 500);
    });
  };

  return (
    <Grid>
      <Grid.Col offset={1} span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>AsyncSelect Component</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 100 }}>
            <ArchbaseAsyncSelect<Pedido, number, Pessoa>
              label="Cliente"
              dataSource={dataSource}
              dataField="cliente"
              getOptionLabel={(option: Pessoa) => option && option.nome}
              getOptionValue={(option: Pessoa) => option}
              getOptions={loadRemotePessoas}
              minCharsToSearch={0}
              placeholder="Selecione um cliente..."
            />
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

const ArchbaseAsyncSelectSimpleExample = () => {
  const [selectedPessoa, setSelectedPessoa] = useState<Pessoa | null>(null);

  const loadRemotePessoas = async (page: number, value: string): Promise<OptionsResult<Pessoa>> => {
    return new Promise<OptionsResult<Pessoa>>((resolve) => {
      setTimeout(() => {
        const filtered = pessoasData.filter((p) =>
          p.nome.toLowerCase().includes((value || '').toLowerCase())
        );
        const start = page * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        const paginatedData = filtered.slice(start, end);
        const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

        resolve({
          options: paginatedData,
          page: page,
          totalPages: totalPages,
        });
      }, 300);
    });
  };

  return (
    <Grid>
      <Grid.Col offset={1} span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>AsyncSelect sem DataSource</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 100 }}>
            <ArchbaseAsyncSelect<any, any, Pessoa>
              label="Pessoa"
              value={selectedPessoa}
              getOptionLabel={(option: Pessoa) => option && option.nome}
              getOptionValue={(option: Pessoa) => option}
              getOptions={loadRemotePessoas}
              minCharsToSearch={0}
              placeholder="Digite para buscar..."
              onSelectValue={(value) => setSelectedPessoa(value)}
              clearable
            />
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Valor Selecionado</Text>
            </Group>
          </Card.Section>
          <ScrollArea style={{ height: 200 }}>
            <ArchbaseObjectInspector data={selectedPessoa} />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseAsyncSelect> = {
  title: 'Editores/AsyncSelect',
  component: ArchbaseAsyncSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseAsyncSelect é um componente de seleção assíncrona que carrega opções sob demanda.

## Características
- Carregamento assíncrono de opções
- Suporte a paginação infinita
- Integração com DataSource
- Debounce na pesquisa
- Customização de labels e valores
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseAsyncSelect>;

export const ComDataSource: Story = {
  name: 'Com DataSource',
  render: () => <ArchbaseAsyncSelectExample />,
};

export const SemDataSource: Story = {
  name: 'Sem DataSource (Controlado)',
  render: () => <ArchbaseAsyncSelectSimpleExample />,
};
