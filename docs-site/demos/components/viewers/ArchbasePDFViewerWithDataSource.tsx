import React, { useState, useEffect } from 'react';
import { ArchbasePDFViewer } from '@archbase/components';
import { ArchbaseDataSource } from '@archbase/data';

interface Document {
  id: string;
  name: string;
  url: string;
}

const initialData: Document[] = [
  {
    id: '1',
    name: 'Sample Document',
    url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkeypldi-09-2010.pdf',
  },
  {
    id: '2',
    name: 'React Documentation',
    url: 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkeypldi-09-2010.pdf',
  },
];

export function ArchbasePDFViewerWithDataSource() {
  const [dataSource] = useState(() => {
    const ds = new ArchbaseDataSource<Document, string>(
      'pdf-docs',
      {
        records: initialData,
        grandTotalRecords: 2,
        currentPage: 1,
        totalPages: 1,
        pageSize: 10,
      }
    );
    return ds;
  });

  return (
    <ArchbasePDFViewer
      dataSource={dataSource}
      dataField="url"
      height={700}
      toolbar
      textLayer
    />
  );
}
