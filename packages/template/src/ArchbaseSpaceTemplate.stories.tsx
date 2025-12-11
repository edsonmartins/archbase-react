import { Meta, StoryObj } from '@storybook/react';
import React, { useMemo } from 'react';
import { ArchbaseSpaceTemplate } from './ArchbaseSpaceTemplate';
import { ArchbaseDataSource } from '@archbase/data';
import { ArchbaseSimpleFilter } from './hooks';
import { ArchbaseDataGrid } from '../components'; // ensure alias works

const records = [
  { id: 1, name: 'Cliente A', status: 'Ativo' },
  { id: 2, name: 'Cliente B', status: 'Inativo' }
];

const createDataSource = () =>
  new ArchbaseDataSource('space-template', {
    records,
    grandTotalRecords: records.length,
    currentPage: 1,
    totalPages: 1,
    pageSize: records.length
  });

const meta: Meta<typeof ArchbaseSpaceTemplate> = {
  title: 'Templates/ArchbaseSpaceTemplate',
  component: ArchbaseSpaceTemplate,
  tags: ['autodocs']
};

export default meta;

export const Basic: StoryObj<typeof ArchbaseSpaceTemplate> = {
  render: () => {
    const dataSource = useMemo(() => createDataSource(), []);
    return (
      <div style={{ padding: 16 }}>
        <ArchbaseSpaceTemplate
          title="Clientes"
          dataSource={dataSource}
          filterComponent={<ArchbaseSimpleFilter fields={['name']} onChange={() => {}} />}
          content={<ArchbaseDataGrid dataSource={dataSource} columns={[{ id: 'name', dataField: 'name', title: 'Nome' }, { id: 'status', dataField: 'status', title: 'Status' }]} />}
        />
      </div>
    );
  }
};
