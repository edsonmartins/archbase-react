import React from 'react';
import dynamic from 'next/dynamic';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_COMPOSITE_FILTERS_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';

const ArchbaseCompositeFiltersDocs = dynamic(() => import('../../../content/components/filters/archbase-composite-filters.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

export default function CompositeFiltersPage() {
  return (
    <Shell currentPath="/components/filters/composite-filters">
      <PageHeader data={ARCHBASE_COMPOSITE_FILTERS_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={['ArchbaseCompositeFilters']}
        componentsStyles={['ArchbaseCompositeFilters']}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseCompositeFiltersDocs />
      </DocsTabs>
    </Shell>
  );
}
