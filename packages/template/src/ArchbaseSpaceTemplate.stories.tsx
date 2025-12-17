import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ArchbaseSpaceTemplate } from './ArchbaseSpaceTemplate';
import { Button, Text } from '@mantine/core';

const meta: Meta<typeof ArchbaseSpaceTemplate> = {
  title: 'Templates/ArchbaseSpaceTemplate',
  component: ArchbaseSpaceTemplate,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Template de página com filtros, toolbar e grid/conteúdo.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ArchbaseSpaceTemplate>;

export const Basic: Story = {
  render: () => {
    return (
      <div style={{ height: 400 }}>
        <ArchbaseSpaceTemplate
          title="Clientes"
          headerRight={<Button variant="outline">Novo</Button>}
        >
          <Text p="md">Conteúdo do template</Text>
        </ArchbaseSpaceTemplate>
      </div>
    );
  }
};

export const WithHeaderAndFooter: Story = {
  render: () => {
    return (
      <div style={{ height: 500 }}>
        <ArchbaseSpaceTemplate
          title="Pedidos"
          headerLeft={<Text>Filtros</Text>}
          headerRight={<Button variant="filled">Adicionar</Button>}
          footerLeft={<Text size="sm">Total: 10 registros</Text>}
          footerRight={<Button variant="light">Exportar</Button>}
        >
          <Text p="md">Listagem de pedidos...</Text>
        </ArchbaseSpaceTemplate>
      </div>
    );
  }
};
