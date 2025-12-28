import React from 'react';
import { ArchbaseDockLayout } from '@archbase/layout';
import type { DockPanelComponent } from '@archbase/layout';

// Components personalizados para o demo
const OverviewPanel: React.FC = () => (
  <div style={{ padding: 20, height: '100%' }}>
    <h3>Overview</h3>
    <p>Welcome to the Dashboard! This layout uses dockview for flexible panel management.</p>
  </div>
);

const ChartsPanel: React.FC = () => (
  <div style={{ padding: 20, height: '100%' }}>
    <h3>Charts</h3>
    <p>Visualizations and charts will be displayed here.</p>
  </div>
);

const DetailsPanel: React.FC = () => (
  <div style={{ padding: 20, height: '100%' }}>
    <h3>Details</h3>
    <p>Selected item details will appear here.</p>
  </div>
);

const RecentPanel: React.FC = () => (
  <div style={{ padding: 20, height: '100%' }}>
    <h3>Recent Activity</h3>
    <ul>
      <li>User logged in</li>
      <li>New report created</li>
      <li>Data exported</li>
    </ul>
  </div>
);

export function ArchbaseDockLayoutUsage() {
  // Definir componentes do dock
  const components: Record<string, DockPanelComponent> = {
    overview: {
      id: 'overview',
      title: 'Overview',
      component: OverviewPanel,
    },
    charts: {
      id: 'charts',
      title: 'Charts',
      component: ChartsPanel,
    },
    details: {
      id: 'details',
      title: 'Details',
      component: DetailsPanel,
    },
    recent: {
      id: 'recent',
      title: 'Recent Activity',
      component: RecentPanel,
    },
  };

  return (
    <ArchbaseDockLayout
      components={components}
      height={600}
    />
  );
}
