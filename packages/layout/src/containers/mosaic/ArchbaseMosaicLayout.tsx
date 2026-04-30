import React, { CSSProperties, ReactNode, useCallback } from 'react';
import {
  Mosaic,
  MosaicWindow,
  MosaicNode,
  MosaicDirection,
} from 'react-mosaic-component';
import 'react-mosaic-component/react-mosaic-component.css';
import { useMantineColorScheme } from '@mantine/core';

export interface ArchbaseMosaicPanelDef {
  /** Unique identifier for the panel */
  id: string;
  /** Title displayed in the panel header */
  title: string;
  /** Optional icon displayed alongside the title */
  icon?: ReactNode;
  /** The content to render inside the panel */
  component: ReactNode | (() => ReactNode);
  /** Whether the panel can be closed. Defaults to true */
  closable?: boolean;
  /** Custom toolbar controls for the panel window */
  toolbarControls?: ReactNode[];
}

export interface ArchbaseMosaicLayoutProps {
  /** Map of panel definitions keyed by panel id */
  panels: Record<string, ArchbaseMosaicPanelDef>;
  /** The initial mosaic tree layout structure */
  initialLayout: MosaicNode<string>;
  /** Callback fired when the layout changes */
  onChange?: (layout: MosaicNode<string> | null) => void;
  /** Callback fired when a panel is closed */
  onPanelClose?: (panelId: string) => void;
  /** View shown when no panels are open */
  zeroStateView?: ReactNode;
  /** Resize configuration */
  resize?: { minimumPaneSizePercentage?: number };
  /** Custom inline style */
  style?: CSSProperties;
  /** Custom CSS class name */
  className?: string;
  /** Height of the mosaic container */
  height?: string | number;
  /** Width of the mosaic container */
  width?: string | number;
}

const ArchbaseMosaicLayout: React.FC<ArchbaseMosaicLayoutProps> = ({
  panels,
  initialLayout,
  onChange,
  onPanelClose,
  zeroStateView,
  resize = { minimumPaneSizePercentage: 10 },
  style,
  className,
  height,
  width,
}) => {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const renderTile = useCallback(
    (id: string, path: any[]) => {
      const panel = panels[id];
      if (!panel) {
        return <div>Panel not found: {id}</div>;
      }

      const closable = panel.closable !== false;

      const titleElement = (
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {panel.icon && <span style={{ display: 'inline-flex' }}>{panel.icon}</span>}
          <span>{panel.title}</span>
        </span>
      );

      const toolbarControls: ReactNode[] = [];
      if (panel.toolbarControls) {
        toolbarControls.push(...panel.toolbarControls);
      }
      if (closable) {
        toolbarControls.push(
          <button
            key="close"
            onClick={() => onPanelClose?.(id)}
            title="Close"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 16,
              lineHeight: 1,
              padding: '0 4px',
              color: 'inherit',
            }}
          >
            ×
          </button>,
        );
      }

      const content =
        typeof panel.component === 'function' ? panel.component() : panel.component;

      return (
        <MosaicWindow<string>
          path={path as any}
          title={titleElement as unknown as string}
          toolbarControls={toolbarControls.length > 0 ? toolbarControls : undefined}
        >
          {content}
        </MosaicWindow>
      );
    },
    [panels, onPanelClose],
  );

  const containerStyle: CSSProperties = {
    position: 'relative',
    height: height ?? '100%',
    width: width ?? '100%',
    ...style,
  };

  return (
    <div style={containerStyle} className={className}>
      <Mosaic<string>
        renderTile={renderTile}
        value={initialLayout}
        onChange={(newLayout) => onChange?.(newLayout ?? null)}
        zeroStateView={zeroStateView || undefined}
        resize={resize}
        className={isDark ? 'mosaic-blueprint-theme bp4-dark' : 'mosaic-blueprint-theme'}
      />
    </div>
  );
};

ArchbaseMosaicLayout.displayName = 'ArchbaseMosaicLayout';

export { ArchbaseMosaicLayout };
export type { MosaicNode, MosaicDirection };
