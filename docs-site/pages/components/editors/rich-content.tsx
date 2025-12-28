import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_IMAGE_EDIT_DATA, ARCHBASE_RICH_TEXT_EDIT_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import ArchbaseImageEditDocs from '../../../content/components/editors/archbase-image-edit.mdx';
import ArchbaseRichTextEditDocs from '../../../content/components/editors/archbase-rich-text-edit.mdx';

export default function RichContentPage() {
  return (
    <Shell currentPath="/components/editors/rich-content">
      <PageHeader data={ARCHBASE_IMAGE_EDIT_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={['ArchbaseImageEdit', 'ArchbaseFileAttachment', 'ArchbaseRichTextEdit']}
        componentsStyles={['ArchbaseImageEdit', 'ArchbaseFileAttachment', 'ArchbaseRichTextEdit']}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseImageEditDocs />
        <ArchbaseRichTextEditDocs />
      </DocsTabs>
    </Shell>
  );
}
