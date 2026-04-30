import React, { useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import {
  Box,
  Paper,
  Group,
  Text,
  ActionIcon,
  Tooltip,
  CloseButton,
  useMantineTheme,
} from '@mantine/core';
import { useElementSize, useMouse, useWindowEvent } from '@mantine/hooks';
import {
  IconMinus,
  IconSquare,
  IconMaximize,
  IconArrowsMinimize,
  IconGripVertical,
} from '@tabler/icons-react';

// =============================================================================
// Types
// =============================================================================

export interface ArchbaseFloatingPanelProps {
  /** ID único do painel */
  id?: string;
  /** Conteúdo do painel */
  children: ReactNode;
  /** Título do painel */
  title?: string;
  /** Ícone do título */
  icon?: ReactNode;
  /** Largura inicial */
  width?: number;
  /** Altura inicial */
  height?: number;
  /** Posição X inicial */
  initialX?: number;
  /** Posição Y inicial */
  initialY?: number;
  /** Se pode redimensionar */
  resizable?: boolean;
  /** Se pode minimizar */
  minimizable?: boolean;
  /** Se pode maximizar */
  maximizable?: boolean;
  /** Se pode fechar */
  closable?: boolean;
  /** Callback ao fechar */
  onClose?: () => void;
  /** Callback ao minimizar */
  onMinimize?: () => void;
  /** Callback ao maximizar */
  onMaximize?: () => void;
  /** Callback ao restaurar */
  onRestore?: () => void;
  /** Callback ao mover */
  onMove?: (x: number, y: number) => void;
  /** Callback ao redimensionar */
  onResize?: (width: number, height: number) => void;
  /** Cor do header */
  headerColor?: string;
  /** Se o painel está inicialmente visível */
  defaultVisible?: boolean;
  /** Z-index */
  zIndex?: number;
  /** Tamanho mínimo */
  minWidth?: number;
  minHeight?: number;
  /** Tamanho máximo */
  maxWidth?: number;
  maxHeight?: number;
}

export interface ArchbaseFloatingPanelState {
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  visible: boolean;
  zIndex: number;
}

// =============================================================================
// Z-Index Manager
// =============================================================================

let globalZIndex = 1000;
function getNextZIndex(): number {
  return ++globalZIndex;
}

// =============================================================================
// ArchbaseFloatingPanel Component
// =============================================================================

export function ArchbaseFloatingPanel({
  id,
  children,
  title = 'Painel',
  icon,
  width: initialWidth = 400,
  height: initialHeight = 300,
  initialX = 100,
  initialY = 100,
  resizable = true,
  minimizable = true,
  maximizable = true,
  closable = true,
  onClose,
  onMinimize,
  onMaximize,
  onRestore,
  onMove,
  onResize,
  headerColor,
  defaultVisible = true,
  zIndex: initialZIndex,
  minWidth = 200,
  minHeight = 100,
  maxWidth,
  maxHeight,
}: ArchbaseFloatingPanelProps) {
  const theme = useMantineTheme();
  const panelRef = useRef<HTMLDivElement>(null);

  // State
  const [state, setState] = useState<ArchbaseFloatingPanelState>({
    x: initialX,
    y: initialY,
    width: initialWidth,
    height: initialHeight,
    minimized: false,
    maximized: false,
    visible: defaultVisible,
    zIndex: initialZIndex || getNextZIndex(),
  });

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [savedState, setSavedState] = useState<Partial<ArchbaseFloatingPanelState>>({});

  // Drag handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.panel-controls')) return;

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - state.x,
      y: e.clientY - state.y,
    });
    setState((prev) => ({ ...prev, zIndex: getNextZIndex() }));
  }, [state.x, state.y]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = Math.max(0, e.clientY - dragOffset.y);

      setState((prev) => ({ ...prev, x: newX, y: newY }));
      onMove?.(newX, newY);
    }

    if (isResizing) {
      const rect = panelRef.current?.getBoundingClientRect();
      if (!rect) return;

      let newWidth = e.clientX - rect.left;
      let newHeight = e.clientY - rect.top;

      // Apply constraints
      newWidth = Math.max(minWidth, newWidth);
      newHeight = Math.max(minHeight, newHeight);
      if (maxWidth) newWidth = Math.min(maxWidth, newWidth);
      if (maxHeight) newHeight = Math.min(maxHeight, newHeight);

      setState((prev) => ({ ...prev, width: newWidth, height: newHeight }));
      onResize?.(newWidth, newHeight);
    }
  }, [isDragging, isResizing, dragOffset, minWidth, minHeight, maxWidth, maxHeight, onMove, onResize]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  // Attach/detach global listeners
  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  // Actions
  const handleMinimize = useCallback(() => {
    if (state.minimized) {
      setState((prev) => ({
        ...prev,
        ...savedState,
        minimized: false,
      }));
      onRestore?.();
    } else {
      setSavedState({
        height: state.height,
        y: state.y,
      });
      setState((prev) => ({
        ...prev,
        minimized: true,
        maximized: false,
      }));
      onMinimize?.();
    }
  }, [state.minimized, state.height, state.y, savedState, onMinimize, onRestore]);

  const handleMaximize = useCallback(() => {
    if (state.maximized) {
      setState((prev) => ({
        ...prev,
        ...savedState,
        maximized: false,
      }));
      onRestore?.();
    } else {
      setSavedState({
        x: state.x,
        y: state.y,
        width: state.width,
        height: state.height,
      });
      setState((prev) => ({
        ...prev,
        x: 0,
        y: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        maximized: true,
        minimized: false,
      }));
      onMaximize?.();
    }
  }, [state.maximized, state.x, state.y, state.width, state.height, savedState, onMaximize, onRestore]);

  const handleClose = useCallback(() => {
    setState((prev) => ({ ...prev, visible: false }));
    onClose?.();
  }, [onClose]);

  const handleFocus = useCallback(() => {
    setState((prev) => ({ ...prev, zIndex: getNextZIndex() }));
  }, []);

  if (!state.visible) return null;

  const effectiveHeight = state.minimized ? 40 : state.height;

  return (
    <Paper
      ref={panelRef}
      id={id}
      shadow="lg"
      radius="sm"
      onMouseDown={handleFocus}
      style={{
        position: 'fixed',
        left: state.x,
        top: state.y,
        width: state.width,
        height: effectiveHeight,
        zIndex: state.zIndex,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: isDragging || isResizing ? 'none' : 'all 0.2s ease',
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      {/* Header */}
      <Box
        onMouseDown={handleMouseDown}
        style={{
          padding: '8px 12px',
          backgroundColor: headerColor || theme.colors.blue[6],
          color: 'white',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <Group gap="xs">
          {icon}
          <Text fw={500} size="sm">
            {title}
          </Text>
        </Group>

        <Group gap={4} className="panel-controls">
          {minimizable && (
            <Tooltip label={state.minimized ? 'Restaurar' : 'Minimizar'}>
              <ActionIcon
                variant="subtle"
                color="white"
                size="sm"
                onClick={handleMinimize}
              >
                {state.minimized ? <IconArrowsMinimize size={14} /> : <IconMinus size={14} />}
              </ActionIcon>
            </Tooltip>
          )}
          {maximizable && (
            <Tooltip label={state.maximized ? 'Restaurar' : 'Maximizar'}>
              <ActionIcon
                variant="subtle"
                color="white"
                size="sm"
                onClick={handleMaximize}
              >
                {state.maximized ? <IconArrowsMinimize size={14} /> : <IconMaximize size={14} />}
              </ActionIcon>
            </Tooltip>
          )}
          {closable && (
            <CloseButton
              variant="subtle"
              color="white"
              size="sm"
              onClick={handleClose}
            />
          )}
        </Group>
      </Box>

      {/* Content */}
      {!state.minimized && (
        <Box
          style={{
            flex: 1,
            overflow: 'auto',
            padding: 12,
          }}
        >
          {children}
        </Box>
      )}

      {/* Resize handle */}
      {resizable && !state.minimized && !state.maximized && (
        <Box
          onMouseDown={(e) => {
            e.stopPropagation();
            setIsResizing(true);
            setState((prev) => ({ ...prev, zIndex: getNextZIndex() }));
          }}
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            width: 16,
            height: 16,
            cursor: 'se-resize',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <IconGripVertical
            size={12}
            style={{ transform: 'rotate(-45deg)', opacity: 0.5 }}
          />
        </Box>
      )}
    </Paper>
  );
}

// =============================================================================
// useArchbaseFloatingPanel Hook
// =============================================================================

export interface UseArchbaseFloatingPanelOptions {
  /** ID do painel */
  id?: string;
  /** Título */
  title?: string;
  /** Largura inicial */
  width?: number;
  /** Altura inicial */
  height?: number;
  /** Posição inicial */
  initialPosition?: { x: number; y: number };
}

export interface UseArchbaseFloatingPanelReturn {
  /** Se o painel está visível */
  isOpen: boolean;
  /** Abrir o painel */
  open: () => void;
  /** Fechar o painel */
  close: () => void;
  /** Toggle visibilidade */
  toggle: () => void;
  /** Props para o painel */
  panelProps: Partial<ArchbaseFloatingPanelProps>;
}

export function useArchbaseFloatingPanel(
  options: UseArchbaseFloatingPanelOptions = {}
): UseArchbaseFloatingPanelReturn {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const panelProps: Partial<ArchbaseFloatingPanelProps> = {
    id: options.id,
    title: options.title,
    width: options.width,
    height: options.height,
    initialX: options.initialPosition?.x,
    initialY: options.initialPosition?.y,
    defaultVisible: isOpen,
    onClose: close,
  };

  return {
    isOpen,
    open,
    close,
    toggle,
    panelProps,
  };
}

export default ArchbaseFloatingPanel;
