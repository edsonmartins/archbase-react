import React from 'react';
import dynamic from 'next/dynamic';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_NOTIFICATION_CENTER_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';

const ArchbaseNotificationCenterDocs = dynamic(() => import('../../../content/components/feedback/archbase-notification-center.mdx'), {
  ssr: false,
  loading: () => <div style={{ padding: '1rem' }}>Carregando...</div>
});

export default function NotificationCenterPage() {
  return (
    <Shell currentPath="/components/feedback/notification-center">
      <PageHeader data={ARCHBASE_NOTIFICATION_CENTER_DATA} />
      <DocsTabs
        docgen={docgen}
        componentsProps={['ArchbaseNotificationCenter']}
        componentsStyles={['ArchbaseNotificationCenter']}
        stylesApiData={STYLES_API_DATA}
      >
        <ArchbaseNotificationCenterDocs />
      </DocsTabs>
    </Shell>
  );
}
