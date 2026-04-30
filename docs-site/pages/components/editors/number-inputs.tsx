import React from 'react';
import dynamic from 'next/dynamic';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_NUMBER_EDIT_DATA, ARCHBASE_LOOKUP_NUMBER_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';

const ArchbaseNumberEditDocs = dynamic(() => import('../../../content/components/editors/archbase-number-edit.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

const ArchbaseLookupNumberDocs = dynamic(() => import('../../../content/components/editors/archbase-lookup-number.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

export default function NumberInputsPage() {
  return (
    <Shell currentPath="/components/editors/number-inputs">
      <PageHeader data={ARCHBASE_NUMBER_EDIT_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={['ArchbaseNumberEdit', 'ArchbaseLookupNumber']}
        componentsStyles={['ArchbaseNumberEdit', 'ArchbaseLookupNumber']}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseNumberEditDocs />
        <ArchbaseLookupNumberDocs />
      </DocsTabs>
    </Shell>
  );
}
