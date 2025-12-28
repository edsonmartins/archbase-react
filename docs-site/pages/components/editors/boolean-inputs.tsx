import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_CHECKBOX_DATA, ARCHBASE_CHIP_DATA, ARCHBASE_CHIP_GROUP_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import ArchbaseCheckboxDocs from '../../../content/components/editors/archbase-checkbox.mdx';
import ArchbaseChipDocs from '../../../content/components/editors/archbase-chip.mdx';
import ArchbaseChipGroupDocs from '../../../content/components/editors/archbase-chip-group.mdx';

export default function BooleanInputsPage() {
  return (
    <Shell currentPath="/components/editors/boolean-inputs">
      <PageHeader data={ARCHBASE_CHECKBOX_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={['ArchbaseCheckbox', 'ArchbaseSwitch', 'ArchbaseChip', 'ArchbaseChipGroup']}
        componentsStyles={['ArchbaseCheckbox', 'ArchbaseSwitch', 'ArchbaseChip', 'ArchbaseChipGroup']}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseCheckboxDocs />
        <ArchbaseChipDocs />
        <ArchbaseChipGroupDocs />
      </DocsTabs>
    </Shell>
  );
}
