import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import {
  INFOGRAPHIC_RENDERER_DATA,
} from '../../../data/components-data';
import docgen from '../../../docgen.json';
import InfographicRendererDocs from '../../../content/components/graphics/infographic-renderer.mdx';

export default function InfographicPage() {
  return (
    <Shell currentPath="/components/graphics/infographic">
      <PageHeader data={INFOGRAPHIC_RENDERER_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={['InfographicRenderer']}
        componentsStyles={['InfographicRenderer']}
      >
        <InfographicRendererDocs />
      </DocsTabs>
    </Shell>
  );
}
