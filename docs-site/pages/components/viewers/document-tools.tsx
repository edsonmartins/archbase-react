import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_DOC_VIEWER_DATA, ARCHBASE_PDF_BUILDER_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import ArchbaseDocViewerDocs from '../../../content/components/viewers/archbase-doc-viewer.mdx';
import ArchbasePdfBuilderDocs from '../../../content/components/viewers/archbase-pdf-builder.mdx';
import { Divider, Title, Space } from '@mantine/core';

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
