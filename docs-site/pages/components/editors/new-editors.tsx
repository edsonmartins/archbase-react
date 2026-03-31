import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import {
  ARCHBASE_TAG_INPUT_DATA,
  ARCHBASE_PHONE_INPUT_DATA,
  ARCHBASE_MULTI_EMAIL_DATA,
  ARCHBASE_SIGNATURE_PAD_DATA,
  ARCHBASE_MENTION_INPUT_DATA,
  ARCHBASE_DUAL_LISTBOX_DATA,
} from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import ArchbaseTagInputDocs from '../../../content/components/editors/archbase-tag-input.mdx';
import ArchbasePhoneInputDocs from '../../../content/components/editors/archbase-phone-input.mdx';
import ArchbaseMultiEmailDocs from '../../../content/components/editors/archbase-multi-email.mdx';
import ArchbaseSignaturePadDocs from '../../../content/components/editors/archbase-signature-pad.mdx';
import ArchbaseMentionInputDocs from '../../../content/components/editors/archbase-mention-input.mdx';
import ArchbaseDualListboxDocs from '../../../content/components/editors/archbase-dual-listbox.mdx';

export default function NewEditorsPage() {
  return (
    <Shell currentPath="/components/editors/new-editors">
      <PageHeader data={ARCHBASE_TAG_INPUT_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={[
          'ArchbaseTagInput',
          'ArchbasePhoneInput',
          'ArchbaseMultiEmail',
          'ArchbaseSignaturePad',
          'ArchbaseMentionInput',
          'ArchbaseDualListbox',
        ]}
        componentsStyles={[
          'ArchbaseTagInput',
          'ArchbasePhoneInput',
          'ArchbaseMultiEmail',
          'ArchbaseSignaturePad',
          'ArchbaseMentionInput',
          'ArchbaseDualListbox',
        ]}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseTagInputDocs />
        <ArchbasePhoneInputDocs />
        <ArchbaseMultiEmailDocs />
        <ArchbaseSignaturePadDocs />
        <ArchbaseMentionInputDocs />
        <ArchbaseDualListboxDocs />
      </DocsTabs>
    </Shell>
  );
}
