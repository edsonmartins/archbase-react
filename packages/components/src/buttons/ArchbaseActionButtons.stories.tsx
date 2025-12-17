import type { Meta, StoryObj } from '@storybook/react';
import { Box } from '@mantine/core';
import React from 'react';
import { ArchbaseActionButtons } from './ArchbaseActionButtons';

// Dados de demonstração de ações
const actionsDemo = [
  {
    id: 'action1',
    label: 'Novo',
    color: 'blue',
    icon: null,
    executeAction: () => alert('Novo clicado'),
  },
  {
    id: 'action2',
    label: 'Editar',
    color: 'green',
    icon: null,
    executeAction: () => alert('Editar clicado'),
  },
  {
    id: 'action3',
    label: 'Excluir',
    color: 'red',
    icon: null,
    executeAction: () => alert('Excluir clicado'),
  },
  {
    id: 'action4',
    label: 'Salvar',
    color: 'teal',
    icon: null,
    executeAction: () => alert('Salvar clicado'),
  },
  {
    id: 'action5',
    label: 'Cancelar',
    color: 'gray',
    icon: null,
    executeAction: () => alert('Cancelar clicado'),
  },
];

const ArchbaseActionButtonsExample = () => {
  return (
    <Box maw={1600}>
      <ArchbaseActionButtons
        actions={actionsDemo}
        options={{
          largerBreakPoint: '600px',
          smallerBreakPoint: '400px',
          largerSpacing: '1rem',
          smallerSpacing: '1rem',
          largerButtonVariant: 'filled',
          smallerButtonVariant: 'filled',
          menuItemVariant: 'filled',
          menuButtonVariant: 'filled',
          menuButtonColor: 'blue.5',
          menuDropdownPosition: 'bottom',
          menuItemApplyActionColor: true,
          menuPosition: 'right',
        }}
      />
    </Box>
  );
};

const ArchbaseActionButtonsOutlineExample = () => {
  return (
    <Box maw={1600}>
      <ArchbaseActionButtons
        actions={actionsDemo}
        options={{
          largerBreakPoint: '600px',
          smallerBreakPoint: '400px',
          largerSpacing: '0.5rem',
          smallerSpacing: '0.5rem',
          largerButtonVariant: 'outline',
          smallerButtonVariant: 'outline',
          menuItemVariant: 'outline',
          menuButtonVariant: 'outline',
          menuButtonColor: 'blue',
          menuDropdownPosition: 'bottom',
          menuItemApplyActionColor: true,
          menuPosition: 'right',
        }}
      />
    </Box>
  );
};

const meta: Meta<typeof ArchbaseActionButtons> = {
  title: 'Botões/ActionButtons',
  component: ArchbaseActionButtons,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseActionButtons é um componente de barra de ações responsiva.

## Características
- Botões responsivos que se adaptam ao tamanho da tela
- Menu dropdown para telas menores
- Variantes configuráveis (filled, outline, etc.)
- Espaçamento customizável
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseActionButtons>;

export const ExemploSimples: Story = {
  name: 'Exemplo Simples',
  render: () => <ArchbaseActionButtonsExample />,
};

export const ExemploOutline: Story = {
  name: 'Variante Outline',
  render: () => <ArchbaseActionButtonsOutlineExample />,
};
