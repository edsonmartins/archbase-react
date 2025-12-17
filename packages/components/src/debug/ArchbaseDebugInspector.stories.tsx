import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ArchbaseDebugInspector } from './objectinspector/ArchbaseDebugInspector';

// Dados de exemplo
const pessoaData = {
  id: 1,
  nome: 'João Silva',
  email: 'joao@email.com',
  idade: 30,
  endereco: {
    rua: 'Rua das Flores, 123',
    cidade: 'São Paulo',
    estado: 'SP',
  },
};

const pedidoData = {
  id: 1,
  numero: 'PED-001',
  data: new Date(),
  total: 150.0,
  status: 'PENDENTE',
  itens: [
    { produtoId: 1, quantidade: 2, valor: 50.0 },
    { produtoId: 2, quantidade: 1, valor: 50.0 },
  ],
};

const produtoData = {
  id: 1,
  nome: 'Notebook Dell',
  preco: 3500.0,
  categoria: 'Eletrônicos',
  ativo: true,
};

const ArchbaseDebugInspectorExample = () => {
  return (
    <ArchbaseDebugInspector
      debugObjectInspectorHotKey="ctrl+shift+D"
      title="Debug Inspector"
      icon="⚛"
      visible={true}
      objectsToInspect={[
        { name: 'Pessoa', object: pessoaData },
        { name: 'Pedido', object: pedidoData },
        { name: 'Produto', object: produtoData },
      ]}
    />
  );
};

const meta: Meta<typeof ArchbaseDebugInspector> = {
  title: 'Depuração/Debug Inspector',
  component: ArchbaseDebugInspector,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseDebugInspector é um componente de depuração para inspecionar múltiplos objetos.

## Características
- Visualização de múltiplos objetos
- Hotkey configurável para abrir/fechar
- Expansão de níveis de objeto
- Interface com abas para cada objeto
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseDebugInspector>;

export const ExemploBasico: Story = {
  name: 'Exemplo Básico',
  render: () => <ArchbaseDebugInspectorExample />,
};
