import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_EDIT_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import ArchbaseEditDocs from '../../../content/components/editors/archbase-edit.mdx';

export default function TextInputsPage() {
  return (
    <Shell currentPath="/components/editors/text-inputs">
      <PageHeader data={ARCHBASE_EDIT_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={['ArchbaseEdit']}
        componentsStyles={['ArchbaseEdit']}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseEditDocs />
      </DocsTabs>
    </Shell>
  );
}
