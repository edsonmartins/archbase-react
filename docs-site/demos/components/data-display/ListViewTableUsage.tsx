import React from 'react';
import { ArchbaseListViewTable } from '@archbase/components';

interface FileSystemItem {
  id: string;
  name: string;
  size: number;
  type: 'file' | 'folder';
  modified: string;
}

export function ListViewTableUsage() {
  const data: FileSystemItem[] = [
    { id: '1', name: 'Documents', size: 0, type: 'folder', modified: '2025-01-15' },
    { id: '2', name: 'report.pdf', size: 2456000, type: 'file', modified: '2025-01-14' },
    { id: '3', name: 'presentation.pptx', size: 5120000, type: 'file', modified: '2025-01-13' },
    { id: '4', name: 'Downloads', size: 0, type: 'folder', modified: '2025-01-12' },
    { id: '5', name: 'image.png', size: 1024000, type: 'file', modified: '2025-01-11' },
  ];

  const columns = [
    { key: 'name' as const, title: 'Nome', width: 300 },
    { key: 'size' as const, title: 'Tamanho', width: 100, textAlign: 'right' as const },
    { key: 'type' as const, title: 'Tipo', width: 100 },
    { key: 'modified' as const, title: 'Modificado', width: 120 },
  ];

  return (
    <div style={{ height: 400 }}>
      <ArchbaseListViewTable
        data={data}
        columns={columns}
        rowKey="id"
        height={400}
      />
    </div>
  );
}
