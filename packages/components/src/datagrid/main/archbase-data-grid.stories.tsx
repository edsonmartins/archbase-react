import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ArchbaseDataGrid from './archbase-data-grid';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { renderText } from './archbase-data-grid-formatters';

interface Pessoa {
  id: number;
  name: string;
  status: string;
}

const records: Pessoa[] = [
  { id: 1, name: 'Ana Silva', status: 'Ativo' },
  { id: 2, name: 'Bruno Costa', status: 'Inativo' },
  { id: 3, name: 'Carlos Souza', status: 'Ativo' },
  { id: 4, name: 'Diana Lima', status: 'Pendente' },
];

const columns = [
  { id: 'name', dataField: 'name', title: 'Nome', render: renderText },
  { id: 'status', dataField: 'status', title: 'Status', render: renderText },
];

const ArchbaseDataGridExample = () => {
  const { dataSource } = useArchbaseDataSourceV2<Pessoa>({
    initialData: records,
    name: 'storybook-people',
  });

  return (
    <div style={{ height: 400 }}>
      <ArchbaseDataGrid dataSource={dataSource} columns={columns} idField="id" />
    </div>
  );
};

const meta: Meta<typeof ArchbaseDataGrid> = {
  title: 'Listas e Tabelas/DataGrid',
  component: ArchbaseDataGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseDataGrid é um componente de tabela de dados avançado.

## Características
- Integração com DataSource V2
- Colunas customizáveis
- Formatadores de renderização
- Seleção de linhas
- Ordenação e filtros
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ArchbaseDataGrid>;

export const Default: Story = {
  name: 'Exemplo Padrão',
  render: () => <ArchbaseDataGridExample />,
};
