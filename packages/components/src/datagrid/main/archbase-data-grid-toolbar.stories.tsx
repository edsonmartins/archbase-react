import { Meta, StoryObj } from '@storybook/react';
import React, { useMemo } from 'react';
import { ArchbaseDataGrid } from './archbase-data-grid';
import { ArchbaseDataSource } from '@archbase/data';
import { renderText } from './archbase-data-grid-formatters';
import { ArchbaseActionButtons } from '@archbase/components';

const records = [
  { id: 1, name: 'Ana Silva', status: 'Ativo', role: 'Admin' },
  { id: 2, name: 'Bruno Costa', status: 'Inativo', role: 'Editor' },
  { id: 3, name: 'Carla Dias', status: 'Ativo', role: 'Viewer' }
];

const columns = [
  { id: 'name', dataField: 'name', title: 'Nome', render: renderText, align: 'left' as const },
  { id: 'status', dataField: 'status', title: 'Status', render: renderText, align: 'center' as const },
  { id: 'role', dataField: 'role', title: 'Perfil', render: renderText, align: 'center' as const }
];

const createDataSource = () =>
  new ArchbaseDataSource('toolbar-story', {
    records,
    grandTotalRecords: records.length,
    currentPage: 1,
    totalPages: 1,
    pageSize: records.length
  });

const meta: Meta<typeof ArchbaseDataGrid> = {
  title: 'Components/DataGrid/ArchbaseDataGrid Toolbar',
  component: ArchbaseDataGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Exemplo de DataGrid com toolbar avançada (ações, exportação, refresh) e panel de detalhes.'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ArchbaseDataGrid>;

export const WithToolbar: Story = {
  render: (args) => {
    const dataSource = useMemo(() => createDataSource(), []);
    return (
      <div style={{ height: 520 }}>
        <ArchbaseDataGrid
          {...args}
          dataSource={dataSource}
          columns={columns}
          idField="id"
          enableTopToolbarActions
          renderToolbarActions={() => (
            <ArchbaseActionButtons
              options={[
                { id: 'new', label: 'Novo registro', variant: 'outline' },
                { id: 'export', label: 'Exportar', variant: 'light' }
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
  }
};
