import React from 'react';
import dynamic from 'next/dynamic';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_IMAGE_EDIT_DATA, ARCHBASE_RICH_TEXT_EDIT_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';

const ArchbaseImageEditDocs = dynamic(() => import('../../../content/components/editors/archbase-image-edit.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

const ArchbaseRichTextEditDocs = dynamic(() => import('../../../content/components/editors/archbase-rich-text-edit.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

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
