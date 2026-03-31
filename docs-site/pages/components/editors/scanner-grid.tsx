import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_BARCODE_SCANNER_DATA, ARCHBASE_LIGHT_GRID_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import ArchbaseBarcodeScannerDocs from '../../../content/components/editors/archbase-barcode-scanner.mdx';
import ArchbaseLightGridDocs from '../../../content/components/editors/archbase-light-grid.mdx';
import { Divider, Space } from '@mantine/core';

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
