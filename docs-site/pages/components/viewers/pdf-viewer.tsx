import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_PDF_VIEWER_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import ArchbasePDFViewerDocs from '../../../content/components/viewers/archbase-pdf-viewer.mdx';

export default function PDFViewerPage() {
  return (
    <Shell currentPath="/components/viewers/pdf-viewer">
      <PageHeader data={ARCHBASE_PDF_VIEWER_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={['ArchbasePDFViewer']}
        componentsStyles={['ArchbasePDFViewer']}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbasePDFViewerDocs />
      </DocsTabs>
    </Shell>
  );
}
