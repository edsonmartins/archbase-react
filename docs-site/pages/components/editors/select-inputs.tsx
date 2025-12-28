import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import {
  ARCHBASE_SELECT_DATA,
  ARCHBASE_ASYNC_SELECT_DATA,
  ARCHBASE_ASYNC_MULTI_SELECT_DATA,
  ARCHBASE_TREE_SELECT_DATA,
  ARCHBASE_LOOKUP_SELECT_DATA,
} from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import ArchbaseSelectDocs from '../../../content/components/editors/archbase-select.mdx';
import ArchbaseAsyncSelectDocs from '../../../content/components/editors/archbase-async-select.mdx';
import ArchbaseAsyncMultiSelectDocs from '../../../content/components/editors/archbase-async-multi-select.mdx';
import ArchbaseTreeSelectDocs from '../../../content/components/editors/archbase-tree-select.mdx';
import ArchbaseLookupSelectDocs from '../../../content/components/editors/archbase-lookup-select.mdx';
import ArchbaseRadioGroupDocs from '../../../content/components/editors/archbase-radio-group.mdx';

export default function SelectInputsPage() {
  return (
    <Shell currentPath="/components/editors/select-inputs">
      <PageHeader data={ARCHBASE_SELECT_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={[
          'ArchbaseSelect',
          'ArchbaseAsyncSelect',
          'ArchbaseAsyncMultiSelect',
          'ArchbaseTreeSelect',
          'ArchbaseLookupSelect',
          'ArchbaseRadioGroup',
        ]}
        componentsStyles={[
          'ArchbaseSelect',
          'ArchbaseAsyncSelect',
          'ArchbaseAsyncMultiSelect',
          'ArchbaseTreeSelect',
          'ArchbaseLookupSelect',
          'ArchbaseRadioGroup',
        ]}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseSelectDocs />
        <ArchbaseAsyncSelectDocs />
        <ArchbaseAsyncMultiSelectDocs />
        <ArchbaseTreeSelectDocs />
        <ArchbaseLookupSelectDocs />
        <ArchbaseRadioGroupDocs />
      </DocsTabs>
    </Shell>
  );
}
