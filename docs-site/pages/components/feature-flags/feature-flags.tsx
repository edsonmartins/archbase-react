import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_FEATURE_FLAGS_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import ArchbaseFeatureFlagsDocs from '../../../content/components/feature-flags/archbase-feature-flags.mdx';

export default function FeatureFlagsPage() {
  return (
    <Shell currentPath="/components/feature-flags/feature-flags">
      <PageHeader data={ARCHBASE_FEATURE_FLAGS_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={['ArchbaseFeatureFlagsProvider', 'useArchbaseFeatureFlag', 'useArchbaseVariant']}
        componentsStyles={[]}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseFeatureFlagsDocs />
      </DocsTabs>
    </Shell>
  );
}
