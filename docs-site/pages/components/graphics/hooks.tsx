import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import {
  USE_INFOGRAPHIC_DATA,
} from '../../../data/components-data';
import docgen from '../../../docgen.json';
import HooksDocs from '../../../content/components/graphics/hooks.mdx';

export default function HooksPage() {
  return (
    <Shell currentPath="/components/graphics/hooks">
      <PageHeader data={USE_INFOGRAPHIC_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={[]}
        componentsStyles={[]}
      >
        <HooksDocs />
      </DocsTabs>
    </Shell>
  );
}
