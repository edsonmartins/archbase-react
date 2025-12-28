import type { CSSProperties, ReactNode } from 'react';

export type DockComponentType =
  | 'panel'
  | 'gridview'
  | 'splitview'
  | 'dockview';

export interface DockPanelComponent {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  tabComponent?: React.ComponentType<any>;
  params?: Record<string, any>;
  minimumSize?: number;
  maximumSize?: number;
  isClosable?: boolean;
}

export interface DockLayoutConfig {
  direction?: 'horizontal' | 'vertical';
  defaultSize?: number[];
  minimumSize?: number[];
  maximumSize?: number[];
  proportions?: number[];
}

export interface ArchbaseDockLayoutProps {
  // Components registrados no dock
  components: Record<string, DockPanelComponent>;

  // Layout inicial (JSON do dockview)
  defaultLayout?: string | object;

  // Configurações
  watermark?: string | ReactNode;
  hideBorders?: boolean;
  autoHideHeaders?: boolean;

  // Eventos
  onLayoutChange?: (layout: object) => void;
  onPanelClose?: (panelId: string) => void;
  onPanelOpen?: (panelId: string) => void;

  // Estilo
  style?: CSSProperties;
  className?: string;
  height?: string | number;

  // States
  disabled?: boolean;
}

export interface DockPanelProps {
  componentId: string;
  params?: Record<string, any>;
  onClose?: () => void;
  style?: CSSProperties;
  className?: string;
}

export type DockLayoutPreset =
  | 'dashboard'
  | 'ide'
  | 'explorer'
  | 'analytics'
  | 'custom';

export interface ArchbaseDockLayoutPresetProps {
  preset: DockLayoutPreset;
  components?: Record<string, DockPanelComponent>;
  onPanelClose?: (panelId: string) => void;
  onPanelOpen?: (panelId: string) => void;
  style?: CSSProperties;
  className?: string;
  height?: string | number;
}
