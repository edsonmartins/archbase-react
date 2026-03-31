import React from 'react';
import { Shell } from '../../../components/Shell';
import { PageHeader } from '../../../components/PageHeader';
import { DocsTabs } from '../../../components/DocsTabs';
import { ARCHBASE_NOTIFICATION_CENTER_DATA } from '../../../data/components-data';
import docgen from '../../../docgen.json';
import { STYLES_API_DATA } from '../../../styles-api';
import ArchbaseNotificationCenterDocs from '../../../content/components/feedback/archbase-notification-center.mdx';

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
