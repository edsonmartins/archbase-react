import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import {
  ARCHBASE_KEY_VALUE_EDITOR_DATA,
  ARCHBASE_LOOKUP_EDIT_DATA,
  ARCHBASE_RATING_DATA,
  ARCHBASE_JSON_EDIT_DATA,
  ARCHBASE_OPERATION_HOURS_EDITOR_DATA,
  ARCHBASE_CRON_EXPRESSION_EDIT_DATA,
} from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import ArchbaseKeyValueEditorDocs from '../../../content/components/editors/archbase-key-value-editor.mdx';
import ArchbaseLookupEditDocs from '../../../content/components/editors/archbase-lookup-edit.mdx';
import ArchbaseRatingDocs from '../../../content/components/editors/archbase-rating.mdx';
import ArchbaseJsonEditDocs from '../../../content/components/editors/archbase-json-edit.mdx';
import ArchbaseOperationHoursEditorDocs from '../../../content/components/editors/archbase-operation-hours-editor.mdx';
import ArchbaseCronExpressionEditDocs from '../../../content/components/editors/archbase-cron-expression-edit.mdx';

export default function SpecializedPage() {
  return (
    <Shell currentPath="/components/editors/specialized">
      <PageHeader data={ARCHBASE_KEY_VALUE_EDITOR_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={[
          'ArchbaseKeyValueEditor',
          'ArchbaseLookupEdit',
          'ArchbaseRating',
          'ArchbaseJsonEdit',
          'ArchbaseOperationHoursEditor',
          'ArchbaseCronExpressionEdit',
        ]}
        componentsStyles={[
          'ArchbaseKeyValueEditor',
          'ArchbaseLookupEdit',
          'ArchbaseRating',
          'ArchbaseJsonEdit',
          'ArchbaseOperationHoursEditor',
          'ArchbaseCronExpressionEdit',
        ]}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseKeyValueEditorDocs />
        <ArchbaseLookupEditDocs />
        <ArchbaseRatingDocs />
        <ArchbaseJsonEditDocs />
        <ArchbaseOperationHoursEditorDocs />
        <ArchbaseCronExpressionEditDocs />
      </DocsTabs>
    </Shell>
  );
}
