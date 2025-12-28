import { ArchbaseSpreadsheetImportUsage } from '../../../demos/components/editors/ArchbaseSpreadsheetImportUsage';
import { ArchbaseSpreadsheetImportWithDataSource } from '../../../demos/components/editors/ArchbaseSpreadsheetImportWithDataSource';
import { getImportsMetadata } from '../component-metadata';
import { Component } from '../component';

export const metadata = getImportsMetadata('ArchbaseSpreadsheetImport');

export default function Page() {
  return (
    <Component
      name="ArchbaseSpreadsheetImport"
      demos={{
        usage: { type: 'code', component: ArchbaseSpreadsheetImportUsage },
        withDataSource: { type: 'code', component: ArchbaseSpreadsheetImportWithDataSource },
      }}
    />
  );
}
