import type { Meta, StoryObj } from '@storybook/react';
import { Card, Grid, Group, Text } from '@mantine/core';
import React from 'react';
import { ArchbaseObjectInspector } from './objectinspector/ArchbaseObjectInspector';

// Dados de exemplo
const pessoaData = {
  id: 1,
  nome: 'João Silva',
  email: 'joao@email.com',
  idade: 30,
  ativo: true,
  dataNascimento: new Date('1990-05-15'),
  endereco: {
    rua: 'Rua das Flores, 123',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01234-567',
  },
  contatos: [
    { tipo: 'EMAIL', valor: 'joao@email.com', principal: true },
    { tipo: 'TELEFONE', valor: '(11) 99999-9999', principal: false },
  ],
};

const objetoComplexo = {
  dados: {
    usuario: pessoaData,
    config: {
      tema: 'dark',
      idioma: 'pt-BR',
      notificacoes: {
        email: true,
        push: false,
        sms: true,
      },
    },
    metadados: {
      versao: '1.0.0',
      ultimaAtualizacao: new Date(),
      tags: ['importante', 'ativo', 'premium'],
    },
  },
  estatisticas: {
    acessos: 1500,
    conversoes: 120,
    taxa: 0.08,
  },
};

const ArchbaseObjectInspectorExample = () => {
  return (
    <Grid>
      <Grid.Col offset={1} span={5}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Object Inspector</Text>
            </Group>
          </Card.Section>
          <ArchbaseObjectInspector data={pessoaData} />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const ArchbaseObjectInspectorExpandedExample = () => {
  return (
    <Grid>
      <Grid.Col offset={1} span={5}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Object Inspector Expandido</Text>
            </Group>
          </Card.Section>
          <ArchbaseObjectInspector data={objetoComplexo} expandLevel={3} />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const ArchbaseObjectInspectorArrayExample = () => {
  const arrayData = [pessoaData, { ...pessoaData, id: 2, nome: 'Maria Santos' }];

  return (
    <Grid>
      <Grid.Col offset={1} span={5}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Object Inspector com Array</Text>
            </Group>
          </Card.Section>
          <ArchbaseObjectInspector data={arrayData} />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseObjectInspector> = {
  title: 'Depuração/Object Inspector',
  component: ArchbaseObjectInspector,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseObjectInspector é um componente para visualizar objetos JavaScript de forma hierárquica.

## Características
- Visualização em árvore de objetos
- Expansão/colapso de nós
- Nível de expansão inicial configurável
- Suporte a arrays e objetos aninhados
- Tipos de dados destacados
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseObjectInspector>;

export const ExemploBasico: Story = {
  name: 'Exemplo Básico',
  render: () => <ArchbaseObjectInspectorExample />,
};

export const ObjetoExpandido: Story = {
  name: 'Objeto Complexo Expandido',
  render: () => <ArchbaseObjectInspectorExpandedExample />,
};

export const ComArray: Story = {
  name: 'Com Array',
  render: () => <ArchbaseObjectInspectorArrayExample />,
};
