import { Meta, StoryObj } from '@storybook/react';
import React, { useMemo } from 'react';
import { ArchbaseDataGrid } from './archbase-data-grid';
import { ArchbaseDataSource } from '@archbase/data';
import { renderText } from './archbase-data-grid-formatters';

const records = [
  { id: 1, name: 'Ana Silva', status: 'Ativo' },
  { id: 2, name: 'Bruno Costa', status: 'Inativo' }
];

const columns = [
  { id: 'name', dataField: 'name', title: 'Nome', render: renderText },
  { id: 'status', dataField: 'status', title: 'Status', render: renderText }
];

const createDataSource = () =>
  new ArchbaseDataSource('storybook-people', {
    records,
    grandTotalRecords: records.length,
    currentPage: 1,
    totalPages: 1,
    pageSize: records.length
  });

const meta: Meta<typeof ArchbaseDataGrid> = {
  title: 'Components/DataGrid/ArchbaseDataGrid',
  component: ArchbaseDataGrid,
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof ArchbaseDataGrid>;

export const Default: Story = {
  render: (args) => {
    const dataSource = useMemo(() => createDataSource(), []);
    return (
      <div style={{ height: 400 }}>
        <ArchbaseDataGrid {...args} dataSource={dataSource} columns={columns} idField="id" />
      </div>
    );
  }
};
