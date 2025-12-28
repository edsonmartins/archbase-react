import React from 'react';
import { ArchbaseDockLayoutPreset } from '@archbase/layout';
import type { DockPanelComponent } from '@archbase/layout';

// Componentes reutilizáveis para os presets
const PanelFactory = {
  Overview: () => (
    <div style={{ padding: 20 }}>
      <h3>Overview</h3>
      <p>Overview panel content</p>
    </div>
  ),
  Charts: () => (
    <div style={{ padding: 20 }}>
      <h3>Charts</h3>
      <p>Charts and visualizations</p>
    </div>
  ),
  Details: () => (
    <div style={{ padding: 20 }}>
      <h3>Details</h3>
      <p>Item details</p>
    </div>
  ),
  Recent: () => (
    <div style={{ padding: 20 }}>
      <h3>Recent Activity</h3>
      <p>Recent activities list</p>
    </div>
  ),
  Explorer: () => (
    <div style={{ padding: 20 }}>
      <h3>File Explorer</h3>
      <ul>
        <li>📁 src/</li>
        <li>📁 components/</li>
        <li>📁 utils/</li>
      </ul>
    </div>
  ),
  Search: () => (
    <div style={{ padding: 20 }}>
      <h3>Search</h3>
      <input type="text" placeholder="Search..." style={{ width: '100%' }} />
    </div>
  ),
  Editor: () => (
    <div style={{ padding: 20 }}>
      <h3>Editor</h3>
      <p>Code editor panel</p>
    </div>
  ),
  Terminal: () => (
    <div style={{ padding: 20 }}>
      <h3>Terminal</h3>
      <p>Terminal output</p>
    </div>
  ),
  Output: () => (
    <div style={{ padding: 20 }}>
      <h3>Output</h3>
      <p>Build output</p>
    </div>
  ),
  Problems: () => (
    <div style={{ padding: 20 }}>
      <h3>Problems</h3>
      <p>No problems</p>
    </div>
  ),
  Metrics: () => (
    <div style={{ padding: 20 }}>
      <h3>Metrics</h3>
      <p>Key performance indicators</p>
    </div>
  ),
  Reports: () => (
    <div style={{ padding: 20 }}>
      <h3>Reports</h3>
      <p>Generated reports</p>
    </div>
  ),
  Data: () => (
    <div style={{ padding: 20 }}>
      <h3>Data Sources</h3>
      <p>Data configuration</p>
    </div>
  ),
  Filters: () => (
    <div style={{ padding: 20 }}>
      <h3>Filters</h3>
      <p>Filter options</p>
    </div>
  ),
};

export function ArchbaseDockLayoutPresetDemo() {
  const [currentPreset, setCurrentPreset] = React.useState<'dashboard' | 'ide' | 'analytics'>('dashboard');

  // Componentes para cada preset
  const components: Record<string, DockPanelComponent> = {
    overview: {
      id: 'overview',
      title: 'Overview',
      component: PanelFactory.Overview,
    },
    charts: {
      id: 'charts',
      title: 'Charts',
      component: PanelFactory.Charts,
    },
    details: {
      id: 'details',
      title: 'Details',
      component: PanelFactory.Details,
    },
    recent: {
      id: 'recent',
      title: 'Recent Activity',
      component: PanelFactory.Recent,
    },
    explorer: {
      id: 'explorer',
      title: 'Explorer',
      component: PanelFactory.Explorer,
    },
    search: {
      id: 'search',
      title: 'Search',
      component: PanelFactory.Search,
    },
    editor: {
      id: 'editor',
      title: 'Editor',
      component: PanelFactory.Editor,
    },
    terminal: {
      id: 'terminal',
      title: 'Terminal',
      component: PanelFactory.Terminal,
    },
    output: {
      id: 'output',
      title: 'Output',
      component: PanelFactory.Output,
    },
    problems: {
      id: 'problems',
      title: 'Problems',
      component: PanelFactory.Problems,
    },
    metrics: {
      id: 'metrics',
      title: 'Metrics',
      component: PanelFactory.Metrics,
    },
    reports: {
      id: 'reports',
      title: 'Reports',
      component: PanelFactory.Reports,
    },
    data: {
      id: 'data',
      title: 'Data Sources',
      component: PanelFactory.Data,
    },
    filters: {
      id: 'filters',
      title: 'Filters',
      component: PanelFactory.Filters,
    },
  };

  return (
    <div>
      <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
        <button
          onClick={() => setCurrentPreset('dashboard')}
          style={{
            padding: '8px 16px',
            background: currentPreset === 'dashboard' ? '#4CAF50' : '#e0e0e0',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentPreset('ide')}
          style={{
            padding: '8px 16px',
            background: currentPreset === 'ide' ? '#4CAF50' : '#e0e0e0',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          IDE
        </button>
        <button
          onClick={() => setCurrentPreset('analytics')}
          style={{
            padding: '8px 16px',
            background: currentPreset === 'analytics' ? '#4CAF50' : '#e0e0e0',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Analytics
        </button>
      </div>

      <ArchbaseDockLayoutPreset
        preset={currentPreset}
        components={components}
        height={600}
      />
    </div>
  );
}
