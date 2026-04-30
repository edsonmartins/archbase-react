import React from 'react';
import dynamic from 'next/dynamic';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_DATE_PICKER_DATA, ARCHBASE_TIME_EDIT_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';

const ArchbaseDatePickerDocs = dynamic(() => import('../../../content/components/editors/archbase-datepicker.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

const ArchbaseTimeEditDocs = dynamic(() => import('../../../content/components/editors/archbase-time-edit.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

export default function DateTimePage() {
  return (
    <Shell currentPath="/components/editors/date-time">
      <PageHeader data={ARCHBASE_DATE_PICKER_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={['ArchbaseDatePickerEdit', 'ArchbaseTimeEdit']}
        componentsStyles={['ArchbaseDatePickerEdit', 'ArchbaseTimeEdit']}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseDatePickerDocs />
        <ArchbaseTimeEditDocs />
      </DocsTabs>
    </Shell>
  );
}
