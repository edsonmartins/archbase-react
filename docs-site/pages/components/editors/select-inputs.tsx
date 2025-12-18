import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_SELECT_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import ArchbaseSelectDocs from '../../../content/components/editors/archbase-select.mdx';

export default function SelectInputsPage() {
  return (
    <Shell currentPath="/components/editors/select-inputs">
      <PageHeader data={ARCHBASE_SELECT_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={['ArchbaseSelect']}
        componentsStyles={['ArchbaseSelect']}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseSelectDocs />
      </DocsTabs>
    </Shell>
  );
}
