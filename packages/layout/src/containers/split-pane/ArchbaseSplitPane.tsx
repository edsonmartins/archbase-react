import React, { ReactNode } from 'react';
import { Split } from '@gfazioli/mantine-split-pane';

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
}

export interface ArchbaseSplitPanePaneProps {
  children: ReactNode;
  /**
   * Tamanho mínimo do painel em pixels
   */
  minSize?: number | string;
  /**
   * Tamanho máximo do painel em pixels
   */
  maxSize?: number | string;
  /**
   * Tamanho padrão do painel em pixels ou porcentagem
   */
  defaultSize?: number | string;
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
 * Wrapper sobre @gfazioli/mantine-split-pane para criar layouts redimensionáveis
 * com painéis divisórios. Ideal para master-detail views, painéis laterais,
 * editores com preview, etc.
 *
 * @example
 * ```tsx
 * <ArchbaseSplitPane direction="row">
 *   <ArchbaseSplitPanePane>
 *     <FilterPanel />
 *   </ArchbaseSplitPanePane>
 *   <ArchbaseSplitPaneResizer />
 *   <ArchbaseSplitPanePane>
 *     <ArchbaseDataGrid />
 *   </ArchbaseSplitPanePane>
 * </ArchbaseSplitPane>
 * ```
 */
export const ArchbaseSplitPane = ({
  children,
  direction = 'row',
  splitterSize = 4,
  splitterColor,
  splitterHoverColor,
  splitterRadius,
  withKnob = false,
  opacity,
  style,
  className,
}: ArchbaseSplitPaneProps) => {
  // Create a context provider for Split that passes orientation to resizers
  const orientation = direction === 'row' ? 'horizontal' : 'vertical';

  return (
    <Split
      orientation={orientation}
      size={splitterSize}
      color={splitterColor}
      hoverColor={splitterHoverColor}
      radius={splitterRadius}
      withKnob={withKnob}
      opacity={opacity}
      style={style}
      className={className}
    >
      {children}
    </Split>
  );
};

/**
 * Componente ArchbaseSplitPanePane
 *
 * Representa um painel individual dentro do ArchbaseSplitPane.
 * Deve ser usado como filho direto de ArchbaseSplitPane.
 *
 * @example
 * ```tsx
 * <ArchbaseSplitPanePane minSize={200} maxSize={600}>
 *   <Content />
 * </ArchbaseSplitPanePane>
 * ```
 */
export const ArchbaseSplitPanePane = ({
  children,
  minSize,
  maxSize,
  defaultSize,
  style,
  className,
}: ArchbaseSplitPanePaneProps) => {
  return (
    <Split.Pane
      initialWidth={defaultSize}
      initialHeight={defaultSize}
      minWidth={minSize}
      minHeight={minSize}
      maxWidth={maxSize}
      maxHeight={maxSize}
      style={style}
      className={className}
    >
      {children}
    </Split.Pane>
  );
};

/**
 * Componente ArchbaseSplitPaneResizer
 *
 * Barra divisória arrastável entre painéis.
 * Deve ser usado entre ArchbaseSplitPanePane components.
 *
 * @example
 * ```tsx
 * <ArchbaseSplitPanePane>...</ArchbaseSplitPanePane>
 * <ArchbaseSplitPaneResizer />
 * <ArchbaseSplitPanePane>...</ArchbaseSplitPanePane>
 * ```
 */
export const ArchbaseSplitPaneResizer = ({
  style,
  className,
}: ArchbaseSplitPaneResizerProps) => {
  return (
    <Split.Resizer style={style} className={className} />
  );
};
