import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_SPREADSHEET_IMPORT_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import ArchbaseSpreadsheetImportDocs from '../../../content/components/editors/archbase-spreadsheet-import.mdx';

export default function SpreadsheetImportPage() {
  return (
    <Shell currentPath="/components/editors/spreadsheet-import">
      <PageHeader data={ARCHBASE_SPREADSHEET_IMPORT_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={['ArchbaseSpreadsheetImport']}
        componentsStyles={['ArchbaseSpreadsheetImport']}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseSpreadsheetImportDocs />
      </DocsTabs>
    </Shell>
  );
}
