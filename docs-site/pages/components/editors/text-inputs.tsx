import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_EDIT_DATA, ARCHBASE_MASK_EDIT_DATA, ARCHBASE_PASSWORD_EDIT_DATA, ARCHBASE_TEXTAREA_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import ArchbaseEditDocs from '../../../content/components/editors/archbase-edit.mdx';
import ArchbaseMaskEditDocs from '../../../content/components/editors/archbase-mask-edit.mdx';
import ArchbasePasswordEditDocs from '../../../content/components/editors/archbase-password-edit.mdx';
import ArchbaseTextAreaDocs from '../../../content/components/editors/archbase-textarea.mdx';

export default function TextInputsPage() {
  return (
    <Shell currentPath="/components/editors/text-inputs">
      <PageHeader data={ARCHBASE_EDIT_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={['ArchbaseEdit', 'ArchbaseMaskEdit', 'ArchbasePasswordEdit', 'ArchbaseTextArea']}
        componentsStyles={['ArchbaseEdit', 'ArchbaseMaskEdit', 'ArchbasePasswordEdit', 'ArchbaseTextArea']}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseEditDocs />
        <ArchbaseMaskEditDocs />
        <ArchbasePasswordEditDocs />
        <ArchbaseTextAreaDocs />
      </DocsTabs>
    </Shell>
  );
}
