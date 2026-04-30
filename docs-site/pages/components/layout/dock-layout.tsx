import React from 'react';
import dynamic from 'next/dynamic';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_DOCK_LAYOUT_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';

const ArchbaseDockLayoutDocs = dynamic(() => import('../../../content/components/layout/archbase-dock-layout.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

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
