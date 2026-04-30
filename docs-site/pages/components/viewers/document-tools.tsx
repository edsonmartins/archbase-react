import React from 'react';
import dynamic from 'next/dynamic';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_DOC_VIEWER_DATA, ARCHBASE_PDF_BUILDER_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import { Divider, Space } from '@mantine/core';

const ArchbaseDocViewerDocs = dynamic(() => import('../../../content/components/viewers/archbase-doc-viewer.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

const ArchbasePdfBuilderDocs = dynamic(() => import('../../../content/components/viewers/archbase-pdf-builder.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

export default function DocumentToolsPage() {
  return (
    <Shell currentPath="/components/viewers/document-tools">
      <PageHeader data={ARCHBASE_DOC_VIEWER_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={['ArchbaseDocViewer', 'ArchbasePdfBuilder']}
        componentsStyles={['ArchbaseDocViewer', 'ArchbasePdfBuilder']}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseDocViewerDocs />
        <Space h="xl" />
        <Divider my="xl" />
        <PageHeader data={ARCHBASE_PDF_BUILDER_DATA} />
        <ArchbasePdfBuilderDocs />
      </DocsTabs>
    </Shell>
  );
}
