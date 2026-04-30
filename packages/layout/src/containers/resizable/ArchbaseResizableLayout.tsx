import React, { CSSProperties, ReactNode } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

/* ------------------------------------------------------------------ */
/*  Tipos                                                              */
/* ------------------------------------------------------------------ */

export interface ArchbaseResizablePanelDef {
  /** Identificador único do painel */
  id: string;
  /** Conteúdo do painel */
  children: ReactNode;
  /** Tamanho padrão do painel em porcentagem */
  defaultSize?: number;
  /** Tamanho mínimo do painel em porcentagem (default 10) */
  minSize?: number;
  /** Tamanho máximo do painel em porcentagem */
  maxSize?: number;
  /** Permite colapsar o painel (default false) */
  collapsible?: boolean;
  /** Tamanho colapsado em porcentagem (default 0) */
  collapsedSize?: number;
  /** Ordem de renderização */
  order?: number;
}

export interface ArchbaseResizableLayoutProps {
  /** Direção do layout (default 'horizontal') */
  direction?: 'horizontal' | 'vertical';
  /** Definições dos painéis */
  panels: ArchbaseResizablePanelDef[];
  /** Callback quando o layout muda */
  onLayout?: (sizes: number[]) => void;
  /** Identificador para salvar o layout no localStorage */
  autoSaveId?: string;
  /** Tamanho da alça de redimensionamento em pixels (default 4) */
  handleSize?: number;
  /** ClassName adicional para a alça */
  handleClassName?: string;
  /** Exibe indicador de grip na alça (default true) */
  showHandleGrip?: boolean;
  /** Estilo do container */
  style?: CSSProperties;
  /** ClassName do container */
  className?: string;
  /** Altura do container */
  height?: string | number;
  /** Largura do container */
  width?: string | number;
}

/* ------------------------------------------------------------------ */
/*  Sub-componentes exportáveis                                        */
/* ------------------------------------------------------------------ */

export interface ArchbaseResizablePanelProps {
  children: ReactNode;
  /** Identificador único */
  id?: string;
  /** Tamanho padrão em porcentagem */
  defaultSize?: number;
  /** Tamanho mínimo em porcentagem */
  minSize?: number;
  /** Tamanho máximo em porcentagem */
  maxSize?: number;
  /** Permite colapsar */
  collapsible?: boolean;
  /** Tamanho colapsado */
  collapsedSize?: number;
  /** Ordem de renderização */
  order?: number;
  /** Estilo do painel */
  style?: CSSProperties;
  /** ClassName do painel */
  className?: string;
}

/**
 * Wrapper sobre Panel do react-resizable-panels.
 * Pode ser usado de forma standalone (fora do ArchbaseResizableLayout)
 * quando se deseja montar o layout manualmente.
 */
export const ArchbaseResizablePanel = ({
  children,
  id,
  defaultSize,
  minSize = 10,
  maxSize,
  collapsible = false,
  collapsedSize = 0,
  order,
  style,
  className,
}: ArchbaseResizablePanelProps) => {
  return (
    <Panel
      id={id}
      defaultSize={defaultSize}
      minSize={minSize}
      maxSize={maxSize}
      collapsible={collapsible}
      collapsedSize={collapsedSize}
      order={order}
      style={style}
      className={className}
    >
      {children}
    </Panel>
  );
};

ArchbaseResizablePanel.displayName = 'ArchbaseResizablePanel';

/* ------------------------------------------------------------------ */

export interface ArchbaseResizableHandleProps {
  /** Direção do handle – define a orientação do grip */
  direction?: 'horizontal' | 'vertical';
  /** Tamanho do handle em pixels (default 4) */
  size?: number;
  /** ClassName adicional */
  className?: string;
  /** Exibe indicador de grip (default true) */
  showGrip?: boolean;
}

/**
 * Wrapper sobre PanelResizeHandle do react-resizable-panels.
 * Pode ser usado de forma standalone quando se deseja montar o layout manualmente.
 */
export const ArchbaseResizableHandle = ({
  direction = 'horizontal',
  size = 4,
  className,
  showGrip = true,
}: ArchbaseResizableHandleProps) => {
  const isVertical = direction === 'vertical';

  const handleStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background-color 150ms ease',
    ...(isVertical
      ? { height: `${size}px`, width: '100%', cursor: 'row-resize' }
      : { width: `${size}px`, height: '100%', cursor: 'col-resize' }),
  };

  const gripStyle: CSSProperties = {
    display: 'flex',
    gap: '2px',
    flexDirection: isVertical ? 'row' : 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const dotStyle: CSSProperties = {
    width: 3,
    height: 3,
    borderRadius: '50%',
    backgroundColor: 'var(--archbase-resizable-grip-color, #adb5bd)',
    transition: 'background-color 150ms ease',
  };

  return (
    <PanelResizeHandle
      className={className}
      style={handleStyle}
    >
      {showGrip && (
        <span style={gripStyle} aria-hidden>
          <span style={dotStyle} />
          <span style={dotStyle} />
          <span style={dotStyle} />
        </span>
      )}
    </PanelResizeHandle>
  );
};

ArchbaseResizableHandle.displayName = 'ArchbaseResizableHandle';

/* ------------------------------------------------------------------ */
/*  Componente principal                                               */
/* ------------------------------------------------------------------ */

/**
 * ArchbaseResizableLayout
 *
 * Wrapper declarativo sobre react-resizable-panels.
 * Recebe um array de `panels` e renderiza o PanelGroup com handles entre eles.
 *
 * @example
 * ```tsx
 * <ArchbaseResizableLayout
 *   direction="horizontal"
 *   autoSaveId="main-layout"
 *   panels={[
 *     { id: 'sidebar', children: <Sidebar />, defaultSize: 25, minSize: 15, collapsible: true },
 *     { id: 'content', children: <Content />, defaultSize: 75 },
 *   ]}
 * />
 * ```
 */
export const ArchbaseResizableLayout = ({
  direction = 'horizontal',
  panels,
  onLayout,
  autoSaveId,
  handleSize = 4,
  handleClassName,
  showHandleGrip = true,
  style,
  className,
  height,
  width,
}: ArchbaseResizableLayoutProps) => {
  const containerStyle: CSSProperties = {
    height: height ?? '100%',
    width: width ?? '100%',
    ...style,
  };

  return (
    <PanelGroup
      direction={direction}
      onLayout={onLayout}
      autoSaveId={autoSaveId}
      style={containerStyle}
      className={className}
    >
      {panels.map((panel, index) => (
        <React.Fragment key={panel.id}>
          <Panel
            id={panel.id}
            defaultSize={panel.defaultSize}
            minSize={panel.minSize ?? 10}
            maxSize={panel.maxSize}
            collapsible={panel.collapsible ?? false}
            collapsedSize={panel.collapsedSize ?? 0}
            order={panel.order}
          >
            {panel.children}
          </Panel>

          {index < panels.length - 1 && (
            <ArchbaseResizableHandle
              direction={direction}
              size={handleSize}
              className={handleClassName}
              showGrip={showHandleGrip}
            />
          )}
        </React.Fragment>
      ))}
    </PanelGroup>
  );
};

ArchbaseResizableLayout.displayName = 'ArchbaseResizableLayout';
