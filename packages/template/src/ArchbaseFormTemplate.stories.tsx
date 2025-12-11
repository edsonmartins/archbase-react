import { Meta, StoryObj } from '@storybook/react';
import React, { useMemo } from 'react';
import { ArchbaseFormTemplate } from './ArchbaseFormTemplate';
import { ArchbaseDataSource } from '@archbase/data';
import { ArchbaseEdit } from '@archbase/components';

const starterRecords = [
  { id: 1, name: 'Felipe', email: 'felipe@example.com' }
];

const createDataSource = () =>
  new ArchbaseDataSource('form-story', {
    records: starterRecords,
    grandTotalRecords: starterRecords.length,
    currentPage: 1,
    totalPages: 1,
    pageSize: starterRecords.length
  });

const meta: Meta<typeof ArchbaseFormTemplate> = {
  title: 'Templates/ArchbaseFormTemplate',
  component: ArchbaseFormTemplate,
  tags: ['autodocs']
};

export default meta;

type Story = StoryObj<typeof ArchbaseFormTemplate>;

export const Basic: Story = {
  render: (args) => {
    const dataSource = useMemo(() => createDataSource(), []);
    return (
      <div style={{ width: '100%', maxWidth: 600 }}>
        <ArchbaseFormTemplate
          {...args}
          title="Cadastro rápido"
          dataSource={dataSource}
          renderForm={() => (
            <>
              <ArchbaseEdit dataSource={dataSource} dataField="name" label="Nome" />
              <ArchbaseEdit dataSource={dataSource} dataField="email" label="Email" />
            </>
          )}
          onSave={(entity) => alert(`Saved ${entity?.name ?? 'registro'}`)}
        />
      </div>
    );
  }
};
