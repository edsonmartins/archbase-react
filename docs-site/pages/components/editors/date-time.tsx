import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_DATE_PICKER_DATA, ARCHBASE_TIME_EDIT_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import ArchbaseDatePickerDocs from '../../../content/components/editors/archbase-datepicker.mdx';
import ArchbaseTimeEditDocs from '../../../content/components/editors/archbase-time-edit.mdx';

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
