import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import ArchbaseDataGrid from './archbase-data-grid';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { renderText } from './archbase-data-grid-formatters';
import { ArchbaseActionButtons } from '../../buttons';

interface Pessoa {
  id: number;
  name: string;
  status: string;
  role: string;
}

const records: Pessoa[] = [
  { id: 1, name: 'Ana Silva', status: 'Ativo', role: 'Admin' },
  { id: 2, name: 'Bruno Costa', status: 'Inativo', role: 'Editor' },
  { id: 3, name: 'Carla Dias', status: 'Ativo', role: 'Viewer' },
];

const columns = [
  { id: 'name', dataField: 'name', title: 'Nome', render: renderText, align: 'left' as const },
  { id: 'status', dataField: 'status', title: 'Status', render: renderText, align: 'center' as const },
  { id: 'role', dataField: 'role', title: 'Perfil', render: renderText, align: 'center' as const },
];

const ArchbaseDataGridToolbarExample = () => {
  const { dataSource } = useArchbaseDataSourceV2<Pessoa>({
    initialData: records,
    name: 'toolbar-story',
  });

  return (
    <div style={{ height: 520 }}>
      <ArchbaseDataGrid
        dataSource={dataSource}
        columns={columns}
        idField="id"
        enableTopToolbarActions
        renderToolbarActions={() => (
          <ArchbaseActionButtons
            options={[
              { id: 'new', label: 'Novo registro', variant: 'outline' },
              { id: 'export', label: 'Exportar', variant: 'light' },
            ]}
            onAction={(id) => alert(`Ação selecionada: ${id}`)}
          />
        )}
        renderDetailPanel={({ row }) => (
          <div style={{ padding: '12px 24px', background: '#fff8' }}>
            <strong>Detalhes</strong>
            <p>Nome: {row?.name}</p>
            <p>Status: {row?.status}</p>
          </div>
        )}
      />
    </div>
  );
};

const meta: Meta<typeof ArchbaseDataGrid> = {
  title: 'Listas e Tabelas/DataGrid Toolbar',
  component: ArchbaseDataGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
Exemplo de DataGrid com toolbar avançada.

## Características
- Ações customizáveis na toolbar
- Painel de detalhes expansível
- Exportação de dados
- Botões de ação configuráveis
        `,
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ArchbaseDataGrid>;

export const WithToolbar: Story = {
  name: 'Com Toolbar',
  render: () => <ArchbaseDataGridToolbarExample />,
};
