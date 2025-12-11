import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ArchbaseAdminMainLayout } from './ArchbaseAdminMainLayout';
import { ArchbaseAdminLayoutHeader } from './ArchbaseAdminLayoutHeader';
import { ArchbaseAdminLayoutFooter } from './ArchbaseAdminLayoutFooter';
import { ArchbaseSpaceTemplate } from '@archbase/template';
import { ArchbaseDataSource } from '@archbase/data';

const records = [{ id: 1, name: 'Portal' }, { id: 2, name: 'Financeiro' }];

const dataSource = new ArchbaseDataSource('admin-navigation', {
  records,
  grandTotalRecords: records.length,
  currentPage: 1,
  totalPages: 1,
  pageSize: records.length
});

const meta: Meta<typeof ArchbaseAdminMainLayout> = {
  title: 'Layout/Admin/ArchbaseAdminMainLayout',
  component: ArchbaseAdminMainLayout,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Layout administrativo com header, navegação lateral e conteúdo principal (ex: templates ou data grids).'
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof ArchbaseAdminMainLayout>;

export const BasicLayout: Story = {
  render: () => (
    <ArchbaseAdminMainLayout
      header={<ArchbaseAdminLayoutHeader />}
      footer={<ArchbaseAdminLayoutFooter />}
      navigation={[]}
    >
      <ArchbaseSpaceTemplate title="Painel rápido" dataSource={dataSource} />
    </ArchbaseAdminMainLayout>
  )
};
