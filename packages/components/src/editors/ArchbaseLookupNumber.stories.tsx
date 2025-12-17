import type { Meta, StoryObj } from '@storybook/react';
import { Box, Card, Flex, Grid, Group, ScrollArea, Text } from '@mantine/core';
import React, { useEffect } from 'react';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseEdit } from './ArchbaseEdit';
import { ArchbaseLookupNumber } from './ArchbaseLookupNumber';
import { ArchbaseNotifications } from '../notification';

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

const ArchbaseLookupNumberExample = () => {
  const { dataSource, isBrowsing, isEmpty, edit } = useArchbaseDataSourceV2<Pedido>({
    initialData: pedidosData,
    name: 'dsPedidos',
  });

  useEffect(() => {
    if (isBrowsing && !isEmpty) {
      edit();
    }
  }, [isBrowsing, isEmpty, edit]);

  // Simula busca de pessoa por ID
  const lookupValueDelegator = (value: any): Promise<Pessoa> => {
    return new Promise<Pessoa>((resolve, reject) => {
      setTimeout(() => {
        const pessoa = pessoasData.find((p) => p.id === parseInt(value));
        if (pessoa) {
          resolve(pessoa);
        } else {
          reject(`Pessoa com ID ${value} não encontrada`);
        }
      }, 300);
    });
  };

  const handleLookupError = (error: string): void => {
    ArchbaseNotifications.showError(error, 'Atenção');
  };

  const handleLookupResult = (_value: Pessoa): void => {
    // Callback quando encontrar resultado
  };

  const handleActionSearchExecute = (): void => {
    ArchbaseNotifications.showWarning('Clicou na ação de localizar.', 'Ação de Busca');
  };

  return (
    <Grid>
      <Grid.Col offset={1} span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Lookup Number Component</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 100 }}>
            <Flex justify="flex-start" align="center" direction="row" wrap="nowrap" gap="xs">
              <ArchbaseLookupNumber<Pedido, number, Pessoa>
                label="Código"
                dataSource={dataSource}
                dataField="cliente"
                lookupField="cliente.id"
                lookupValueDelegator={lookupValueDelegator}
                onLookupError={handleLookupError}
                onLookupResult={handleLookupResult}
                onActionSearchExecute={handleActionSearchExecute}
                validateOnExit={true}
                required={true}
                validateMessage="Pessoa {0} não encontrada."
                width={150}
              />
              <ArchbaseEdit label="Nome" dataSource={dataSource} dataField="cliente.nome" disabled width={300} />
            </Flex>
            <Text size="xs" c="dimmed" mt="sm">
              Digite um número (1-5) e pressione Tab para buscar
            </Text>
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

const meta: Meta<typeof ArchbaseLookupNumber> = {
  title: 'Editores/Lookup Number',
  component: ArchbaseLookupNumber,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseLookupNumber é um componente de lookup numérico que permite buscar registros por código numérico.

## Características
- Integração com DataSource
- Aceita apenas valores numéricos
- Validação ao sair do campo
- Delegador de busca customizável
- Ação de busca personalizada
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseLookupNumber>;

export const ExemploBasico: Story = {
  name: 'Exemplo Básico',
  render: () => <ArchbaseLookupNumberExample />,
};
