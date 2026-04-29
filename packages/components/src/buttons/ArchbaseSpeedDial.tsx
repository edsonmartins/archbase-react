import React, { forwardRef, useCallback, useState, ReactNode } from 'react';
import {
  ActionIcon,
  Box,
  Tooltip,
  MantineColor,
  MantineSize,
  MantineRadius,
  Transition,
  Text,
} from '@mantine/core';
import { IconPlus, IconX } from '@tabler/icons-react';

export interface ArchbaseSpeedDialAction {
  /** ID único da ação */
  id: string;
  /** Ícone da ação */
  icon: ReactNode;
  /** Label da ação (tooltip) */
  label: string;
  /** Callback ao clicar */
  onClick: () => void;
  /** Cor da ação */
  color?: MantineColor;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Se deve mostrar label junto ao botão */
  showLabel?: boolean;
}

export interface ArchbaseSpeedDialProps {
  /** Ações do speed dial */
  actions: ArchbaseSpeedDialAction[];
  /** Ícone quando fechado */
  icon?: ReactNode;
  /** Ícone quando aberto */
  openIcon?: ReactNode;
  /** Cor do botão principal */
  color?: MantineColor;
  /** Tamanho dos botões */
  size?: MantineSize;
  /** Raio das bordas */
  radius?: MantineRadius;
  /** Direção de expansão */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Se está aberto (controlado) */
  opened?: boolean;
  /** Callback ao abrir/fechar */
  onOpenChange?: (opened: boolean) => void;
  /** Se deve fechar ao clicar em uma ação */
  closeOnActionClick?: boolean;
  /** Posição no layout */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Se está fixo na tela */
  fixed?: boolean;
  /** Espaçamento da borda quando fixo */
  offset?: number;
  /** Espaçamento entre ações */
  gap?: number;
  /** Variante do botão */
  variant?: 'filled' | 'light' | 'outline' | 'subtle' | 'default';
  /** Se deve mostrar backdrop */
  withBackdrop?: boolean;
  /** Callback ao clicar no backdrop */
  onBackdropClick?: () => void;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseSpeedDial = forwardRef<HTMLDivElement, ArchbaseSpeedDialProps>(
  (
    {
      actions,
      icon,
      openIcon,
      color = 'blue',
      size = 'lg',
      radius = 'xl',
      direction = 'up',
      opened: controlledOpened,
      onOpenChange,
      closeOnActionClick = true,
      position = 'bottom-right',
      fixed = true,
      offset = 24,
      gap = 12,
      variant = 'filled',
      withBackdrop = false,
      onBackdropClick,
      className,
      style,
    },
    ref
  ) => {
    const [internalOpened, setInternalOpened] = useState(false);

    const isOpened = controlledOpened !== undefined ? controlledOpened : internalOpened;

    const handleToggle = useCallback(() => {
      const newValue = !isOpened;
      if (controlledOpened === undefined) {
        setInternalOpened(newValue);
      }
      onOpenChange?.(newValue);
    }, [controlledOpened, isOpened, onOpenChange]);

    const handleClose = useCallback(() => {
      if (controlledOpened === undefined) {
        setInternalOpened(false);
      }
      onOpenChange?.(false);
    }, [controlledOpened, onOpenChange]);

    const handleActionClick = useCallback(
      (action: ArchbaseSpeedDialAction) => {
        if (action.disabled) return;
        action.onClick();
        if (closeOnActionClick) {
          handleClose();
        }
      },
      [closeOnActionClick, handleClose]
    );

    const handleBackdropClick = useCallback(() => {
      handleClose();
      onBackdropClick?.();
    }, [handleClose, onBackdropClick]);

    // Calcula a posição do container
    const positionStyles = fixed
      ? {
          position: 'fixed' as const,
          ...(position.includes('top') ? { top: offset } : { bottom: offset }),
          ...(position.includes('left') ? { left: offset } : { right: offset }),
        }
      : {};

    // Calcula a direção de expansão
    const getActionPosition = (index: number): React.CSSProperties => {
      const distance = (index + 1) * (getSizeValue(size) + gap);

      switch (direction) {
        case 'up':
          return { bottom: distance, left: 0 };
        case 'down':
          return { top: distance, left: 0 };
        case 'left':
          return { right: distance, top: 0 };
        case 'right':
          return { left: distance, top: 0 };
        default:
          return { bottom: distance, left: 0 };
      }
    };

    // Tamanho numérico baseado no MantineSize
    const getSizeValue = (s: MantineSize): number => {
      const sizes: Record<MantineSize, number> = {
        xs: 30,
        sm: 36,
        md: 42,
        lg: 50,
        xl: 60,
      };
      return sizes[s] || 42;
    };

    // Tamanho do action (um pouco menor)
    const actionSize = size === 'xl' ? 'lg' : size === 'lg' ? 'md' : size === 'md' ? 'sm' : 'xs';

    const DefaultIcon = isOpened ? IconX : IconPlus;
    const displayIcon = isOpened ? (openIcon || <IconX />) : (icon || <IconPlus />);

    return (
      <>
        {/* Backdrop */}
        {withBackdrop && (
          <Transition mounted={isOpened} transition="fade" duration={200}>
            {(styles) => (
              <Box
                onClick={handleBackdropClick}
                style={{
                  ...styles,
                  position: 'fixed',
                  inset: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                  zIndex: 999,
                }}
              />
            )}
          </Transition>
        )}

        {/* Speed Dial Container */}
        <Box
          ref={ref}
          className={className}
          style={{
            ...positionStyles,
            ...style,
            zIndex: 1000,
          }}
        >
          {/* Actions */}
          <Box style={{ position: 'relative' }}>
            {actions.map((action, index) => (
              <Transition
                key={action.id}
                mounted={isOpened}
                transition="pop"
                duration={200}
                timingFunction="ease"
              >
                {(styles) => (
                  <Box
                    style={{
                      ...styles,
                      position: 'absolute',
                      ...getActionPosition(index),
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      flexDirection: direction === 'left' ? 'row-reverse' : 'row',
                      transitionDelay: `${index * 50}ms`,
                    }}
                  >
                    {action.showLabel && (
                      <Text
                        size="sm"
                        style={{
                          whiteSpace: 'nowrap',
                          backgroundColor: 'var(--mantine-color-dark-7)',
                          color: 'white',
                          padding: '4px 8px',
                          borderRadius: 4,
                        }}
                      >
                        {action.label}
                      </Text>
                    )}
                    <Tooltip label={action.label} position={direction === 'right' ? 'right' : 'left'}>
                      <ActionIcon
                        size={actionSize}
                        radius={radius}
                        variant={variant}
                        color={action.color || color}
                        disabled={action.disabled}
                        onClick={() => handleActionClick(action)}
                      >
                        {action.icon}
                      </ActionIcon>
                    </Tooltip>
                  </Box>
                )}
              </Transition>
            ))}

            {/* Main Button */}
            <ActionIcon
              size={size}
              radius={radius}
              variant={variant}
              color={color}
              onClick={handleToggle}
              style={{
                transition: 'transform 0.2s ease',
                transform: isOpened ? 'rotate(45deg)' : 'rotate(0deg)',
              }}
            >
              {displayIcon}
            </ActionIcon>
          </Box>
        </Box>
      </>
    );
  }
);

ArchbaseSpeedDial.displayName = 'ArchbaseSpeedDial';
