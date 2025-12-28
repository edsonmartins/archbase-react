import React, { useMemo } from 'react';
import { ArchbaseDockLayout } from './ArchbaseDockLayout';
import type {
  ArchbaseDockLayoutPresetProps,
  DockPanelComponent,
  DockLayoutPreset,
} from './ArchbaseDockLayout.types';

/**
 * Preset de layouts para casos de uso comuns
 */
export function ArchbaseDockLayoutPreset({
  preset,
  components: userComponents = {},
  onPanelClose,
  onPanelOpen,
  style,
  className,
  height,
}: ArchbaseDockLayoutPresetProps) {
  // Obter layout e componentes baseados no preset
  const { layout, components } = useMemo(() => {
    return getPresetConfig(preset, userComponents);
  }, [preset, userComponents]);

  return (
    <ArchbaseDockLayout
      components={components}
      defaultLayout={layout}
      onPanelClose={onPanelClose}
      onPanelOpen={onPanelOpen}
      style={style}
      className={className}
      height={height}
    />
  );
}

/**
 * Configurações de preset
 */
function getPresetConfig(
  preset: DockLayoutPreset,
  userComponents: Record<string, DockPanelComponent>
): {
  layout: any;
  components: Record<string, DockPanelComponent>;
} {
  const components: Record<string, DockPanelComponent> = {
    ...getDefaultComponents(),
    ...userComponents,
  };

  let layout: any;

  switch (preset) {
    case 'dashboard':
      layout = getDashboardLayout(components);
      break;
    case 'ide':
      layout = getIdeLayout(components);
      break;
    case 'explorer':
      layout = getExplorerLayout(components);
      break;
    case 'analytics':
      layout = getAnalyticsLayout(components);
      break;
    default:
      layout = getDashboardLayout(components);
  }

  return { layout, components };
}

/**
 * Componentes padrão para presets
 */
function getDefaultComponents(): Record<string, DockPanelComponent> {
  return {
    // Dashboard
    overview: {
      id: 'overview',
      title: 'Overview',
      component: () => <div style={{ padding: 16 }}>Overview Panel</div>,
    },
    charts: {
      id: 'charts',
      title: 'Charts',
      component: () => <div style={{ padding: 16 }}>Charts Panel</div>,
    },
    details: {
      id: 'details',
      title: 'Details',
      component: () => <div style={{ padding: 16 }}>Details Panel</div>,
    },
    recent: {
      id: 'recent',
      title: 'Recent Activity',
      component: () => <div style={{ padding: 16 }}>Recent Activity</div>,
    },

    // IDE
    explorer: {
      id: 'explorer',
      title: 'Explorer',
      component: () => <div style={{ padding: 16 }}>File Explorer</div>,
    },
    search: {
      id: 'search',
      title: 'Search',
      component: () => <div style={{ padding: 16 }}>Search Panel</div>,
    },
    editor: {
      id: 'editor',
      title: 'Editor',
      component: () => <div style={{ padding: 16 }}>Code Editor</div>,
    },
    terminal: {
      id: 'terminal',
      title: 'Terminal',
      component: () => <div style={{ padding: 16 }}>Terminal</div>,
    },
    output: {
      id: 'output',
      title: 'Output',
      component: () => <div style={{ padding: 16 }}>Output</div>,
    },
    problems: {
      id: 'problems',
      title: 'Problems',
      component: () => <div style={{ padding: 16 }}>Problems Panel</div>,
    },

    // Analytics
    metrics: {
      id: 'metrics',
      title: 'Metrics',
      component: () => <div style={{ padding: 16 }}>Metrics Dashboard</div>,
    },
    reports: {
      id: 'reports',
      title: 'Reports',
      component: () => <div style={{ padding: 16 }}>Reports Panel</div>,
    },
    data: {
      id: 'data',
      title: 'Data Source',
      component: () => <div style={{ padding: 16 }}>Data Configuration</div>,
    },
    filters: {
      id: 'filters',
      title: 'Filters',
      component: () => <div style={{ padding: 16 }}>Filter Panel</div>,
    },
  };
}

/**
 * Layout de Dashboard corporativo
 */
function getDashboardLayout(components: Record<string, DockPanelComponent>) {
  return {
    root: {
      type: 'branch',
      data: [
        {
          type: 'leaf',
          size: 250,
          data: [
            {
              id: components.overview.id,
              title: components.overview.title,
              component: components.overview.id,
            },
          ],
        },
        {
          type: 'branch',
          size: 0.7,
          data: [
            {
              type: 'leaf',
              size: 0.6,
              data: [
                {
                  id: components.charts.id,
                  title: components.charts.title,
                  component: components.charts.id,
                },
              ],
            },
            {
              type: 'leaf',
              size: 0.4,
              data: [
                {
                  id: components.details.id,
                  title: components.details.title,
                  component: components.details.id,
                },
              ],
            },
          ],
        },
        {
          type: 'leaf',
          size: 250,
          data: [
            {
              id: components.recent.id,
              title: components.recent.title,
              component: components.recent.id,
            },
          ],
        },
      ],
    },
  };
}

/**
 * Layout estilo IDE (VS Code)
 */
function getIdeLayout(components: Record<string, DockPanelComponent>) {
  return {
    root: {
      type: 'branch',
      data: [
        {
          type: 'leaf',
          size: 250,
          data: [
            {
              id: components.explorer.id,
              title: components.explorer.title,
              component: components.explorer.id,
            },
          ],
        },
        {
          type: 'branch',
          size: 0.7,
          data: [
            {
              type: 'leaf',
              size: 0.7,
              data: [
                {
                  id: components.editor.id,
                  title: components.editor.title,
                  component: components.editor.id,
                },
              ],
            },
            {
              type: 'branch',
              size: 0.3,
              data: [
                {
                  type: 'leaf',
                  size: 0.5,
                  data: [
                    {
                      id: components.terminal.id,
                      title: components.terminal.title,
                      component: components.terminal.id,
                    },
                  ],
                },
                {
                  type: 'leaf',
                  size: 0.5,
                  data: [
                    {
                      id: components.output.id,
                      title: components.output.title,
                      component: components.output.id,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'leaf',
          size: 250,
          data: [
            {
              id: components.search.id,
              title: components.search.title,
              component: components.search.id,
            },
            {
              id: components.problems.id,
              title: components.problems.title,
              component: components.problems.id,
            },
          ],
        },
      ],
    },
  };
}

/**
 * Layout estilo Explorador de Arquivos
 */
function getExplorerLayout(components: Record<string, DockPanelComponent>) {
  return {
    root: {
      type: 'branch',
      data: [
        {
          type: 'leaf',
          size: 300,
          data: [
            {
              id: components.explorer.id,
              title: components.explorer.title,
              component: components.explorer.id,
            },
          ],
        },
        {
          type: 'leaf',
          size: 0.7,
          data: [
            {
              id: components.details.id,
              title: components.details.title,
              component: components.details.id,
            },
          ],
        },
      ],
    },
  };
}

/**
 * Layout estilo Dashboard de Analytics
 */
function getAnalyticsLayout(components: Record<string, DockPanelComponent>) {
  return {
    root: {
      type: 'branch',
      data: [
        {
          type: 'leaf',
          size: 250,
          data: [
            {
              id: components.filters.id,
              title: components.filters.title,
              component: components.filters.id,
            },
            {
              id: components.data.id,
              title: components.data.title,
              component: components.data.id,
            },
          ],
        },
        {
          type: 'branch',
          size: 0.75,
          data: [
            {
              type: 'leaf',
              size: 0.6,
              data: [
                {
                  id: components.metrics.id,
                  title: components.metrics.title,
                  component: components.metrics.id,
                },
              ],
            },
            {
              type: 'leaf',
              size: 0.4,
              data: [
                {
                  id: components.reports.id,
                  title: components.reports.title,
                  component: components.reports.id,
                },
              ],
            },
          ],
        },
      ],
    },
  };
}
