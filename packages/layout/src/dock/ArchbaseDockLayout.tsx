import React, { useMemo, useCallback, useRef, useEffect } from 'react';
import {
  DockviewReact,
  IDockviewPanelProps,
  DockviewPanelApi,
} from 'dockview-react';
import { useArchbaseTranslation } from '@archbase/core';
import type {
  ArchbaseDockLayoutProps,
  DockPanelComponent,
} from './ArchbaseDockLayout.types';

export function ArchbaseDockLayout({
  components,
  defaultLayout,
  watermark,
  hideBorders = false,
  autoHideHeaders = false,
  onLayoutChange,
  onPanelClose,
  onPanelOpen,
  style,
  className,
  height = '600px',
  disabled = false,
}: ArchbaseDockLayoutProps) {
  const { t } = useArchbaseTranslation();
  const apiRef = useRef<any>(null);

  // Criar os panels do dockview a partir dos componentes registrados
  const panels = useMemo(() => {
    const result: Record<string, React.FC<IDockviewPanelProps>> = {};

    for (const comp of Object.values(components)) {
      result[comp.id] = (props: IDockviewPanelProps) => (
        <DockPanelWrapper
          component={comp}
          api={props.api}
          onClose={() => onPanelClose?.(comp.id)}
        />
      );
    }

    return result;
  }, [components, onPanelClose]);

  // Handler para quando o dockview está pronto
  const handleReady = useCallback((event: any) => {
    apiRef.current = event.api;

    // Aplicar layout padrão se fornecido
    if (defaultLayout) {
      if (typeof defaultLayout === 'string') {
        // Se for uma string (preset), carregar do objeto de presets
        // Isso pode ser expandido no futuro
      } else {
        // Se for um objeto de layout, usar fromJSON
        try {
          event.api.fromJSON(defaultLayout);
        } catch (e) {
          console.warn('Failed to load default layout:', e);
        }
      }
    }

    // Adicionar painéis iniciais se nenhum layout foi fornecido
    if (!defaultLayout && Object.keys(components).length > 0) {
      const firstComponent = Object.values(components)[0];
      try {
        event.api.addPanel({
          id: firstComponent.id,
          component: firstComponent.id,
          title: firstComponent.title,
        });
      } catch (e) {
        console.warn('Failed to add initial panel:', e);
      }
    }
  }, [defaultLayout, components]);

  // Setup listeners on mount
  useEffect(() => {
    if (!apiRef.current) return;

    const disposables: any[] = [];

    // Listen to layout changes
    if (onLayoutChange) {
      const layoutChangeDisposable = apiRef.current.onDidLayoutChange(() => {
        onLayoutChange(apiRef.current.toJSON());
      });
      disposables.push(layoutChangeDisposable);
    }

    // Listen to panel removal
    if (onPanelClose) {
      const panelRemoveDisposable = apiRef.current.onDidRemovePanel((event: any) => {
        onPanelClose(event.panel.id);
      });
      disposables.push(panelRemoveDisposable);
    }

    // Cleanup
    return () => {
      disposables.forEach((d) => d.dispose());
    };
  }, [onLayoutChange, onPanelClose]);

  return (
    <div
      style={{
        width: '100%',
        height,
        ...style,
      }}
      className={className}
    >
      <DockviewReact
        components={panels}
        onReady={handleReady}
        hideBorders={hideBorders}
        watermarkComponent={watermark ? () => (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            opacity: 0.1,
            fontSize: '2rem',
            fontWeight: 'bold',
          }}>
            {watermark}
          </div>
        ) : undefined}
      />
    </div>
  );
}

// Wrapper interno para painéis dockados
interface DockPanelWrapperProps {
  component: DockPanelComponent;
  api?: DockviewPanelApi;
  onClose?: () => void;
}

function DockPanelWrapper({ component, api, onClose }: DockPanelWrapperProps) {
  const Component = component.component;

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <Component
        api={api}
        onClose={onClose}
        params={component.params}
      />
    </div>
  );
}
