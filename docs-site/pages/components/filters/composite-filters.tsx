import { ArchbaseCompositeFiltersUsage } from '../../../demos/components/filters/ArchbaseCompositeFiltersUsage';
import { ArchbaseCompositeFiltersWithDataSource } from '../../../demos/components/filters/ArchbaseCompositeFiltersWithDataSource';
import { getImportsMetadata } from '../component-metadata';
import { Component } from '../component';

export const metadata = getImportsMetadata('ArchbaseCompositeFilters');

export default function Page() {
  return (
    <Component
      name="ArchbaseCompositeFilters"
      demos={{
        usage: { type: 'code', component: ArchbaseCompositeFiltersUsage },
        withDataSource: { type: 'code', component: ArchbaseCompositeFiltersWithDataSource },
      }}
    />
  );
}
