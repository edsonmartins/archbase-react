import React, { ReactNode } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { Box, useMantineTheme, useComputedColorScheme } from '@mantine/core';

export interface ArchbaseSplitPaneProps {
  children: ReactNode;
  /**
   * Direção do split
   * @default 'row'
   */
  direction?: 'row' | 'column';
  /**
   * Tamanho do separador em pixels
   * @default 4
   */
  splitterSize?: number | string;
  /**
   * Cor do separador
   */
  splitterColor?: string;
  /**
   * Cor do separador em hover
   */
  splitterHoverColor?: string;
  /**
   * Raio da barra divisória
   */
  splitterRadius?: number | string;
  /**
   * Exibe knob na barra divisória
   */
  withKnob?: boolean;
  /**
   * Opacidade da barra divisória
   */
  opacity?: number | string;
  /**
   * Estilo adicional do container
   */
  style?: React.CSSProperties;
  /**
   * ClassName adicional
   */
  className?: string;
  /**
   * Chave para persistir layout no localStorage
   */
  autoSaveId?: string;
}

export interface ArchbaseSplitPanePaneProps {
  children: ReactNode;
  /**
   * Tamanho mínimo do painel em porcentagem
   */
  minSize?: number | string;
  /**
   * Tamanho máximo do painel em porcentagem
   */
  maxSize?: number | string;
  /**
   * Tamanho padrão do painel em porcentagem
   */
  defaultSize?: number | string;
  /**
   * Permitir colapsar o painel
   */
  collapsible?: boolean;
  /**
   * Estilo adicional do painel
   */
  style?: React.CSSProperties;
  /**
   * ClassName adicional
   */
  className?: string;
}

export interface ArchbaseSplitPaneResizerProps {
  /**
   * Estilo adicional do resizer
   */
  style?: React.CSSProperties;
  /**
   * ClassName adicional
   */
  className?: string;
}

/**
 * Componente ArchbaseSplitPane
 *
 * Layout redimensionável com painéis divisórios baseado em react-resizable-panels.
 * Ideal para master-detail views, painéis laterais, editores com preview, etc.
 *
 * @example
 * ```tsx
 * <ArchbaseSplitPane direction="row">
 *   <ArchbaseSplitPanePane defaultSize={30}>
 *     <FilterPanel />
 *   </ArchbaseSplitPanePane>
 *   <ArchbaseSplitPaneResizer />
 *   <ArchbaseSplitPanePane defaultSize={70}>
 *     <ArchbaseDataGrid />
 *   </ArchbaseSplitPanePane>
 * </ArchbaseSplitPane>
 * ```
 */
export const ArchbaseSplitPane = ({
  children,
  direction = 'row',
  splitterSize,
  splitterColor,
  splitterHoverColor,
  style,
  className,
  autoSaveId,
}: ArchbaseSplitPaneProps) => {
  const panelDirection = direction === 'row' ? 'horizontal' : 'vertical';

  return (
    <PanelGroup
      direction={panelDirection}
      autoSaveId={autoSaveId}
      style={{ height: '100%', ...style }}
      className={className}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        // Inject splitter props into Resizer children
        if ((child.type as any) === ArchbaseSplitPaneResizer) {
          return React.cloneElement(child as React.ReactElement<any>, {
            _splitterSize: splitterSize,
            _splitterColor: splitterColor,
            _splitterHoverColor: splitterHoverColor,
            _direction: panelDirection,
          });
        }
        return child;
      })}
    </PanelGroup>
  );
};

/**
 * Componente ArchbaseSplitPanePane
 *
 * Representa um painel individual dentro do ArchbaseSplitPane.
 */
export const ArchbaseSplitPanePane = ({
  children,
  minSize,
  maxSize,
  defaultSize,
  collapsible = false,
  style,
  className,
}: ArchbaseSplitPanePaneProps) => {
  const toNumber = (val: number | string | undefined): number | undefined => {
    if (val === undefined) return undefined;
    return typeof val === 'string' ? parseFloat(val) : val;
  };

  return (
    <Panel
      defaultSize={toNumber(defaultSize)}
      minSize={toNumber(minSize)}
      maxSize={toNumber(maxSize)}
      collapsible={collapsible}
      style={style}
      className={className}
    >
      {children}
    </Panel>
  );
};

/**
 * Componente ArchbaseSplitPaneResizer
 *
 * Barra divisória arrastável entre painéis.
 */
export const ArchbaseSplitPaneResizer = ({
  style,
  className,
  ...props
}: ArchbaseSplitPaneResizerProps & Record<string, any>) => {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme();
  const isDark = colorScheme === 'dark';

  const size = props._splitterSize ?? 4;
  const color = props._splitterColor ?? (isDark ? theme.colors.dark[4] : theme.colors.gray[3]);
  const hoverColor = props._splitterHoverColor ?? theme.colors.blue[5];
  const direction = props._direction ?? 'horizontal';
  const isHorizontal = direction === 'horizontal';

  return (
    <PanelResizeHandle
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: color,
        transition: 'background-color 150ms ease',
        ...(isHorizontal
          ? { width: Number(size), cursor: 'col-resize' }
          : { height: Number(size), cursor: 'row-resize' }),
        ...style,
      }}
      onDragging={() => {}}
    >
      <Box
        style={{
          ...(isHorizontal
            ? { width: 2, height: 20, borderRadius: 1 }
            : { width: 20, height: 2, borderRadius: 1 }),
          backgroundColor: isDark ? theme.colors.dark[2] : theme.colors.gray[5],
        }}
      />
    </PanelResizeHandle>
  );
};
