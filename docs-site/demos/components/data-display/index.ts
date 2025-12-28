import type { MantineDemo } from '@mantinex/demo';
import { ListViewTableUsage } from './ListViewTableUsage';
import { ListViewTableCustomRender } from './ListViewTableCustomRender';

// Uso Básico
const usageCode = `
import { ArchbaseListViewTable } from '@archbase/components';

interface FileSystemItem {
  id: string;
  name: string;
  size: number;
  type: 'file' | 'folder';
  modified: string;
}

function Demo() {
  const data: FileSystemItem[] = [
    { id: '1', name: 'Documents', size: 0, type: 'folder', modified: '2025-01-15' },
    { id: '2', name: 'report.pdf', size: 2456000, type: 'file', modified: '2025-01-14' },
  ];

  const columns = [
    { key: 'name' as const, title: 'Nome', width: 300 },
    { key: 'size' as const, title: 'Tamanho', width: 100 },
  ];

  return (
    <ArchbaseListViewTable
      data={data}
      columns={columns}
      rowKey="id"
      height={400}
    />
  );
}
`;

export const usage: MantineDemo = {
  type: 'code',
  component: ListViewTableUsage,
  code: usageCode,
};

// Render Customizado
const customRenderCode = `
import { ArchbaseListViewTable } from '@archbase/components';
import { Badge } from '@mantine/core';

function Demo() {
  const columns = [
    {
      key: 'name' as const,
      title: 'Produto',
      renderCell: (record: Product) => (
        <strong>{record.name}</strong>
      ),
    },
    {
      key: 'stock' as const,
      title: 'Estoque',
      renderCell: (record: Product) => (
        <Badge color={record.stock < 10 ? 'red' : 'green'}>
          {record.stock}
        </Badge>
      ),
    },
  ];

  return <ArchbaseListViewTable data={data} columns={columns} />;
}
`;

export const customRender: MantineDemo = {
  type: 'code',
  component: ListViewTableCustomRender,
  code: customRenderCode,
};
