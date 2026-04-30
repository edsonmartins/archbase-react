import React from 'react';
import dynamic from 'next/dynamic';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_BARCODE_SCANNER_DATA, ARCHBASE_LIGHT_GRID_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import { Divider, Space } from '@mantine/core';

const ArchbaseBarcodeScannerDocs = dynamic(() => import('../../../content/components/editors/archbase-barcode-scanner.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

const ArchbaseLightGridDocs = dynamic(() => import('../../../content/components/editors/archbase-light-grid.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

export default function ScannerGridPage() {
  return (
    <Shell currentPath="/components/editors/scanner-grid">
      <PageHeader data={ARCHBASE_BARCODE_SCANNER_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={['ArchbaseBarcodeScanner', 'ArchbaseLightGrid']}
        componentsStyles={['ArchbaseBarcodeScanner', 'ArchbaseLightGrid']}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseBarcodeScannerDocs />
        <Space h="xl" />
        <Divider my="xl" />
        <PageHeader data={ARCHBASE_LIGHT_GRID_DATA} />
        <ArchbaseLightGridDocs />
      </DocsTabs>
    </Shell>
  );
}
