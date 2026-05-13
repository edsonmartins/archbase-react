import React from 'react';
import dynamic from 'next/dynamic';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import {
  ARCHBASE_TAG_INPUT_DATA,
  ARCHBASE_MULTI_EMAIL_DATA,
  ARCHBASE_SIGNATURE_PAD_DATA,
  ARCHBASE_MENTION_INPUT_DATA,
  ARCHBASE_DUAL_LISTBOX_DATA,
} from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';

const ArchbaseTagInputDocs = dynamic(() => import('../../../content/components/editors/archbase-tag-input.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

const ArchbaseMultiEmailDocs = dynamic(() => import('../../../content/components/editors/archbase-multi-email.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

const ArchbaseSignaturePadDocs = dynamic(() => import('../../../content/components/editors/archbase-signature-pad.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

const ArchbaseMentionInputDocs = dynamic(() => import('../../../content/components/editors/archbase-mention-input.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

const ArchbaseDualListboxDocs = dynamic(() => import('../../../content/components/editors/archbase-dual-listbox.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

export default function NewEditorsPage() {
  return (
    <Shell currentPath="/components/editors/new-editors">
      <PageHeader data={ARCHBASE_TAG_INPUT_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={[
          'ArchbaseTagInput',
          'ArchbaseMultiEmail',
          'ArchbaseSignaturePad',
          'ArchbaseMentionInput',
          'ArchbaseDualListbox',
        ]}
        componentsStyles={[
          'ArchbaseTagInput',
          'ArchbaseMultiEmail',
          'ArchbaseSignaturePad',
          'ArchbaseMentionInput',
          'ArchbaseDualListbox',
        ]}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseTagInputDocs />
        <ArchbaseMultiEmailDocs />
        <ArchbaseSignaturePadDocs />
        <ArchbaseMentionInputDocs />
        <ArchbaseDualListboxDocs />
      </DocsTabs>
    </Shell>
  );
}
