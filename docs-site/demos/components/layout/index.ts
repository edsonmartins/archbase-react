import type { MantineDemo } from '@mantinex/demo';
import { SplitPaneUsage } from './SplitPaneUsage';
import { SplitPaneSizes } from './SplitPaneSizes';
import { SplitPaneVertical } from './SplitPaneVertical';
import { ArchbaseDockLayoutUsage } from './ArchbaseDockLayoutUsage';
import { ArchbaseDockLayoutPresetDemo } from './ArchbaseDockLayoutPreset';

// Uso Básico
const usageCode = `
import { ArchbaseSplitPane, ArchbaseSplitPanePane, ArchbaseSplitPaneResizer } from '@archbase/layout';
import { Card, Text } from '@mantine/core';

function Demo() {
  return (
    <div style={{ height: 400 }}>
      <ArchbaseSplitPane>
        <ArchbaseSplitPanePane>
          <Card h="100%">
            <Text>Painel Lateral</Text>
          </Card>
        </ArchbaseSplitPanePane>
        <ArchbaseSplitPaneResizer />
        <ArchbaseSplitPanePane>
          <Card h="100%">
            <Text>Área Principal</Text>
          </Card>
        </ArchbaseSplitPanePane>
      </ArchbaseSplitPane>
    </div>
  );
}
`;

export const usage: MantineDemo = {
  type: 'code',
  component: SplitPaneUsage,
  code: usageCode,
};

// Tamanhos e Limites
const sizesCode = `
import { ArchbaseSplitPane, ArchbaseSplitPanePane, ArchbaseSplitPaneResizer } from '@archbase/layout';

function Demo() {
  return (
    <ArchbaseSplitPane>
      <ArchbaseSplitPanePane defaultSize="20%" minSize={150} maxSize={400}>
        {/* Painel 1 */}
      </ArchbaseSplitPanePane>
      <ArchbaseSplitPaneResizer />
      <ArchbaseSplitPanePane defaultSize="50%" minSize={300} maxSize={600}>
        {/* Painel 2 */}
      </ArchbaseSplitPanePane>
      <ArchbaseSplitPaneResizer />
      <ArchbaseSplitPanePane defaultSize="30%" minSize={150} maxSize={400}>
        {/* Painel 3 */}
      </ArchbaseSplitPanePane>
    </ArchbaseSplitPane>
  );
}
`;

export const sizes: MantineDemo = {
  type: 'code',
  component: SplitPaneSizes,
  code: sizesCode,
};

// Direção Vertical
const verticalCode = `
import { ArchbaseSplitPane, ArchbaseSplitPanePane, ArchbaseSplitPaneResizer } from '@archbase/layout';

function Demo() {
  return (
    <ArchbaseSplitPane direction="column">
      <ArchbaseSplitPanePane defaultSize="50%" minSize={150}>
        {/* Painel Superior */}
      </ArchbaseSplitPanePane>
      <ArchbaseSplitPaneResizer />
      <ArchbaseSplitPanePane defaultSize="50%" minSize={150}>
        {/* Painel Inferior */}
      </ArchbaseSplitPanePane>
    </ArchbaseSplitPane>
  );
}
`;

export const vertical: MantineDemo = {
  type: 'code',
  component: SplitPaneVertical,
  code: verticalCode,
};

// Dock Layout - Uso Básico
const dockLayoutUsageCode = `
import { ArchbaseDockLayout } from '@archbase/layout';
import type { DockPanelComponent } from '@archbase/layout';

function Demo() {
  const components: Record<string, DockPanelComponent> = {
    overview: {
      id: 'overview',
      title: 'Overview',
      component: () => (
        <div style={{ padding: 20, height: '100%' }}>
          <h3>Overview</h3>
          <p>Welcome to the Dashboard!</p>
        </div>
      ),
    },
    charts: {
      id: 'charts',
      title: 'Charts',
      component: () => (
        <div style={{ padding: 20, height: '100%' }}>
          <h3>Charts</h3>
          <p>Visualizations will appear here.</p>
        </div>
      ),
    },
    details: {
      id: 'details',
      title: 'Details',
      component: () => (
        <div style={{ padding: 20, height: '100%' }}>
          <h3>Details</h3>
          <p>Selected item details.</p>
        </div>
      ),
    },
    recent: {
      id: 'recent',
      title: 'Recent Activity',
      component: () => (
        <div style={{ padding: 20, height: '100%' }}>
          <h3>Recent Activity</h3>
          <ul>
            <li>User logged in</li>
            <li>New report created</li>
          </ul>
        </div>
      ),
    },
  };

  return (
    <ArchbaseDockLayout
      components={components}
      preset="dashboard"
      height={600}
    />
  );
}
`;

export const dockLayoutUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseDockLayoutUsage,
  code: dockLayoutUsageCode,
};

// Dock Layout - Presets
const dockLayoutPresetCode = `
import { ArchbaseDockLayoutPreset } from '@archbase/layout';
import type { DockPanelComponent } from '@archbase/layout';

function Demo() {
  const [preset, setPreset] = React.useState<'dashboard' | 'ide' | 'analytics'>('dashboard');

  const components: Record<string, DockPanelComponent> = {
    overview: {
      id: 'overview',
      title: 'Overview',
      component: () => <div style={{ padding: 20 }}>Overview Panel</div>,
    },
    charts: {
      id: 'charts',
      title: 'Charts',
      component: () => <div style={{ padding: 20 }}>Charts Panel</div>,
    },
    details: {
      id: 'details',
      title: 'Details',
      component: () => <div style={{ padding: 20 }}>Details Panel</div>,
    },
    // ... mais componentes
  };

  return (
    <>
      <div style={{ marginBottom: 20, display: 'flex', gap: 10 }}>
        <button onClick={() => setPreset('dashboard')}>Dashboard</button>
        <button onClick={() => setPreset('ide')}>IDE</button>
        <button onClick={() => setPreset('analytics')}>Analytics</button>
      </div>

      <ArchbaseDockLayoutPreset
        preset={preset}
        components={components}
        height={600}
      />
    </>
  );
}
`;

export const dockLayoutPreset: MantineDemo = {
  type: 'code',
  component: ArchbaseDockLayoutPresetDemo,
  code: dockLayoutPresetCode,
};

// --- Mosaic Layout ---

import { ArchbaseMosaicLayoutUsage } from './ArchbaseMosaicLayoutUsage';

const mosaicLayoutUsageCode = `
import React from 'react';
import { Box, Paper, Text } from '@mantine/core';
import { ArchbaseMosaicLayout } from '@archbase/layout';

function Demo() {
  const panels = {
    a: { id: 'a', title: 'Painel A', component: <Paper p="md" h="100%"><Text>Conteúdo A</Text></Paper>, closable: true },
    b: { id: 'b', title: 'Painel B', component: <Paper p="md" h="100%"><Text>Conteúdo B</Text></Paper>, closable: true },
    c: { id: 'c', title: 'Painel C', component: <Paper p="md" h="100%"><Text>Conteúdo C</Text></Paper>, closable: true },
  };

  return (
    <Box h={400}>
      <ArchbaseMosaicLayout
        panels={panels}
        initialLayout={{
          direction: 'row',
          first: 'a',
          second: { direction: 'column', first: 'b', second: 'c' },
        }}
        height="100%"
      />
    </Box>
  );
}
`;

export const mosaicLayoutUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseMosaicLayoutUsage,
  code: mosaicLayoutUsageCode,
};

// --- Resizable Layout ---

import { ArchbaseResizableLayoutUsage } from './ArchbaseResizableLayoutUsage';

const resizableLayoutUsageCode = `
import React from 'react';
import { Box, Paper, Text } from '@mantine/core';
import { ArchbaseResizableLayout } from '@archbase/layout';

function Demo() {
  return (
    <Box h={300}>
      <ArchbaseResizableLayout
        direction="horizontal"
        panels={[
          { id: 'left', children: <Paper p="md" h="100%"><Text>Esquerda</Text></Paper>, defaultSize: 30 },
          { id: 'center', children: <Paper p="md" h="100%"><Text>Centro</Text></Paper>, defaultSize: 40 },
          { id: 'right', children: <Paper p="md" h="100%"><Text>Direita</Text></Paper>, defaultSize: 30 },
        ]}
        height="100%"
      />
    </Box>
  );
}
`;

export const resizableLayoutUsage: MantineDemo = {
  type: 'code',
  component: ArchbaseResizableLayoutUsage,
  code: resizableLayoutUsageCode,
};
