import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_DOCK_LAYOUT_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import ArchbaseDockLayoutDocs from '../../../content/components/layout/archbase-dock-layout.mdx';

export default function DockLayoutPage() {
  return (
    <Shell currentPath="/components/layout/dock-layout">
      <PageHeader data={ARCHBASE_DOCK_LAYOUT_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={['ArchbaseDockLayout', 'ArchbaseDockLayoutPreset']}
        componentsStyles={['ArchbaseDockLayout']}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseDockLayoutDocs />
      </DocsTabs>
    </Shell>
  );
}
