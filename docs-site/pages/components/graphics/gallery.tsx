import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import {
  INFOGRAPHIC_RENDERER_DATA,
} from '../../../data/components-data';
import docgen from '../../../docgen.json';
import GalleryDocs from '../../../content/components/graphics/gallery.mdx';

export default function GalleryPage() {
  return (
    <Shell currentPath="/components/graphics/gallery">
      <PageHeader data={INFOGRAPHIC_RENDERER_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={['InfographicRenderer']}
        componentsStyles={['InfographicRenderer']}
      >
        <GalleryDocs />
      </DocsTabs>
    </Shell>
  );
}
