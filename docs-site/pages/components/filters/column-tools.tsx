import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_COLUMN_SELECTOR_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import ArchbaseColumnSelectorDocs from '../../../content/components/filters/archbase-column-selector.mdx';

export default function ColumnToolsPage() {
  return (
    <Shell currentPath="/components/filters/column-tools">
      <PageHeader data={ARCHBASE_COLUMN_SELECTOR_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={['ArchbaseColumnSelector']}
        componentsStyles={['ArchbaseColumnSelector']}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseColumnSelectorDocs />
      </DocsTabs>
    </Shell>
  );
}
