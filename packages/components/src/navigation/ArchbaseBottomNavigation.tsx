import React, { forwardRef, useCallback, useState, ReactNode } from 'react';
import {
  Box,
  Text,
  Badge,
  MantineColor,
  MantineSize,
} from '@mantine/core';

export interface ArchbaseBottomNavigationItem {
  /** Chave única */
  key: string;
  /** Label do item */
  label: string;
  /** Ícone */
  icon: ReactNode;
  /** Ícone quando ativo */
  activeIcon?: ReactNode;
  /** Badge */
  badge?: number | string;
  /** Cor do badge */
  badgeColor?: MantineColor;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Link (navegação) */
  href?: string;
  /** Callback ao clicar */
  onClick?: () => void;
}

export interface ArchbaseBottomNavigationProps {
  /** Itens da navegação */
  items: ArchbaseBottomNavigationItem[];
  /** Item ativo (controlado) */
  value?: string;
  /** Item ativo padrão */
  defaultValue?: string;
  /** Callback ao mudar */
  onChange?: (value: string) => void;
  /** Altura da barra */
  height?: number;
  /** Cor de destaque */
  activeColor?: MantineColor;
  /** Cor inativa */
  inactiveColor?: MantineColor;
  /** Tamanho do ícone */
  iconSize?: number;
  /** Tamanho do texto */
  labelSize?: MantineSize;
  /** Se deve mostrar labels */
  showLabels?: boolean;
  /** Se deve mostrar labels apenas no ativo */
  showActiveLabel?: boolean;
  /** Se deve ter sombra */
  withShadow?: boolean;
  /** Se deve ter borda superior */
  withBorder?: boolean;
  /** Cor de fundo */
  backgroundColor?: string;
  /** Se está fixo na parte inferior */
  fixed?: boolean;
  /** Z-index quando fixo */
  zIndex?: number;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseBottomNavigation = forwardRef<HTMLDivElement, ArchbaseBottomNavigationProps>(
  (
    {
      items,
      value: controlledValue,
      defaultValue,
      onChange,
      height = 64,
      activeColor = 'blue',
      inactiveColor = 'gray',
      iconSize = 24,
      labelSize = 'xs',
      showLabels = true,
      showActiveLabel = false,
      withShadow = true,
      withBorder = true,
      backgroundColor = 'var(--mantine-color-body)',
      fixed = true,
      zIndex = 100,
      className,
      style,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = useState(defaultValue || items[0]?.key);

    const currentValue = controlledValue !== undefined ? controlledValue : internalValue;

    const handleItemClick = useCallback(
      (item: ArchbaseBottomNavigationItem) => {
        if (item.disabled) return;

        if (controlledValue === undefined) {
          setInternalValue(item.key);
        }
        onChange?.(item.key);
        item.onClick?.();
      },
      [controlledValue, onChange]
    );

    return (
      <Box
        ref={ref}
        className={className}
        style={{
          ...style,
          position: fixed ? 'fixed' : 'relative',
          bottom: 0,
          left: 0,
          right: 0,
          height,
          backgroundColor,
          borderTop: withBorder ? '1px solid var(--mantine-color-gray-3)' : undefined,
          boxShadow: withShadow ? '0 -2px 10px rgba(0, 0, 0, 0.1)' : undefined,
          zIndex: fixed ? zIndex : undefined,
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        {items.map((item) => {
          const isActive = currentValue === item.key;
          const shouldShowLabel = showLabels || (showActiveLabel && isActive);
          const color = isActive ? activeColor : inactiveColor;
          const icon = isActive && item.activeIcon ? item.activeIcon : item.icon;

          const content = (
            <Box
              key={item.key}
              onClick={() => handleItemClick(item)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                cursor: item.disabled ? 'not-allowed' : 'pointer',
                opacity: item.disabled ? 0.5 : 1,
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              {/* Badge */}
              {item.badge !== undefined && (
                <Badge
                  color={item.badgeColor || 'red'}
                  size="xs"
                  variant="filled"
                  style={{
                    position: 'absolute',
                    top: 4,
                    right: '50%',
                    transform: 'translateX(calc(50% + 12px))',
                    minWidth: 18,
                    height: 18,
                    padding: '0 4px',
                  }}
                >
                  {typeof item.badge === 'number' && item.badge > 99 ? '99+' : item.badge}
                </Badge>
              )}

              {/* Icon */}
              <Box
                style={{
                  color: `var(--mantine-color-${color}-6)`,
                  transition: 'transform 0.2s ease, color 0.2s ease',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {React.isValidElement(icon) ? React.cloneElement(icon, { size: iconSize } as Record<string, unknown>) : icon}
              </Box>

              {/* Label */}
              {shouldShowLabel && (
                <Text
                  size={labelSize}
                  c={`${color}.6`}
                  mt={2}
                  fw={isActive ? 600 : 400}
                  style={{
                    transition: 'color 0.2s ease',
                  }}
                >
                  {item.label}
                </Text>
              )}

              {/* Active indicator */}
              {isActive && (
                <Box
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 32,
                    height: 3,
                    backgroundColor: `var(--mantine-color-${activeColor}-6)`,
                    borderRadius: '0 0 4px 4px',
                  }}
                />
              )}
            </Box>
          );

          // Se tem href, renderiza como link
          if (item.href) {
            return (
              <Box
                key={item.key}
                component="a"
                href={item.href}
                style={{
                  flex: 1,
                  textDecoration: 'none',
                }}
              >
                {content}
              </Box>
            );
          }

          return content;
        })}
      </Box>
    );
  }
);

ArchbaseBottomNavigation.displayName = 'ArchbaseBottomNavigation';
