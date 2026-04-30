import React, { forwardRef, ReactNode } from 'react';
import {
  Box,
  Group,
  ActionIcon,
  Text,
  Menu,
  Burger,
  MantineColor,
  MantineSize,
} from '@mantine/core';
import { useMediaQuery, useDisclosure } from '@mantine/hooks';
import { IconDotsVertical } from '@tabler/icons-react';

export interface ArchbaseAppBarAction {
  /** Chave única */
  key: string;
  /** Ícone */
  icon: ReactNode;
  /** Label (para menu mobile) */
  label: string;
  /** Callback ao clicar */
  onClick: () => void;
  /** Cor */
  color?: MantineColor;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Se deve esconder no mobile */
  hideOnMobile?: boolean;
  /** Se deve mostrar sempre (não ir para menu) */
  alwaysVisible?: boolean;
}

export interface ArchbaseAppBarProps {
  /** Seção esquerda (logo, back button, menu) */
  leftSection?: ReactNode;
  /** Seção central (título, busca) */
  centerSection?: ReactNode;
  /** Seção direita (ações, avatar) */
  rightSection?: ReactNode;
  /** Ações (alternativa ao rightSection) */
  actions?: ArchbaseAppBarAction[];
  /** Título */
  title?: string;
  /** Subtítulo */
  subtitle?: string;
  /** Altura */
  height?: number;
  /** Cor de fundo */
  backgroundColor?: string;
  /** Cor do texto */
  textColor?: MantineColor;
  /** Se deve ter sombra */
  withShadow?: boolean;
  /** Se deve ter borda inferior */
  withBorder?: boolean;
  /** Se está fixo no topo */
  fixed?: boolean;
  /** Z-index quando fixo */
  zIndex?: number;
  /** Breakpoint para modo mobile */
  mobileBreakpoint?: string;
  /** Callback do burger (para abrir drawer) */
  onBurgerClick?: () => void;
  /** Se o burger está aberto */
  burgerOpened?: boolean;
  /** Padding horizontal */
  px?: MantineSize | number;
  /** Tamanho das ações */
  actionSize?: MantineSize;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseAppBar = forwardRef<HTMLElement, ArchbaseAppBarProps>(
  (
    {
      leftSection,
      centerSection,
      rightSection,
      actions,
      title,
      subtitle,
      height = 60,
      backgroundColor = 'var(--mantine-color-body)',
      textColor,
      withShadow = true,
      withBorder = true,
      fixed = true,
      zIndex = 100,
      mobileBreakpoint = '48em',
      onBurgerClick,
      burgerOpened = false,
      px = 'md',
      actionSize = 'md',
      className,
      style,
    },
    ref
  ) => {
    const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint})`);
    const [menuOpened, { toggle: toggleMenu, close: closeMenu }] = useDisclosure(false);

    // Filtra ações visíveis
    const visibleActions = actions?.filter((action) => {
      if (isMobile && action.hideOnMobile) return false;
      if (isMobile && !action.alwaysVisible) return false;
      return true;
    }) || [];

    // Ações que vão para o menu no mobile
    const menuActions = actions?.filter((action) => {
      if (!isMobile) return false;
      if (action.hideOnMobile) return false;
      if (action.alwaysVisible) return false;
      return true;
    }) || [];

    const renderActions = () => {
      if (rightSection) return rightSection;
      if (!actions || actions.length === 0) return null;

      return (
        <Group gap="xs">
          {/* Ações visíveis */}
          {visibleActions.map((action) => (
            <ActionIcon
              key={action.key}
              variant="subtle"
              color={action.color || 'gray'}
              size={actionSize}
              onClick={action.onClick}
              disabled={action.disabled}
            >
              {action.icon}
            </ActionIcon>
          ))}

          {/* Menu para ações extras no mobile */}
          {menuActions.length > 0 && (
            <Menu opened={menuOpened} onClose={closeMenu} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray" size={actionSize} onClick={toggleMenu}>
                  <IconDotsVertical size={20} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                {menuActions.map((action) => (
                  <Menu.Item
                    key={action.key}
                    leftSection={action.icon}
                    color={action.color}
                    disabled={action.disabled}
                    onClick={() => {
                      action.onClick();
                      closeMenu();
                    }}
                  >
                    {action.label}
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      );
    };

    return (
      <Box
        ref={ref}
        component="header"
        className={className}
        style={{
          ...style,
          position: fixed ? 'fixed' : 'relative',
          top: 0,
          left: 0,
          right: 0,
          height,
          backgroundColor,
          borderBottom: withBorder ? '1px solid var(--mantine-color-gray-3)' : undefined,
          boxShadow: withShadow ? '0 2px 4px rgba(0, 0, 0, 0.1)' : undefined,
          zIndex: fixed ? zIndex : undefined,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: typeof px === 'number' ? px : `var(--mantine-spacing-${px})`,
          paddingRight: typeof px === 'number' ? px : `var(--mantine-spacing-${px})`,
        }}
      >
        {/* Left Section */}
        <Group gap="sm" style={{ minWidth: 0 }}>
          {/* Burger for mobile menu */}
          {onBurgerClick && isMobile && (
            <Burger opened={burgerOpened} onClick={onBurgerClick} size="sm" />
          )}
          {leftSection}
        </Group>

        {/* Center Section */}
        <Box style={{ flex: 1, minWidth: 0, marginLeft: 16, marginRight: 16 }}>
          {centerSection || (
            <>
              {title && (
                <Text
                  size="md"
                  fw={600}
                  c={textColor}
                  truncate
                  style={{ lineHeight: 1.2 }}
                >
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text size="xs" c="dimmed" truncate>
                  {subtitle}
                </Text>
              )}
            </>
          )}
        </Box>

        {/* Right Section */}
        {renderActions()}
      </Box>
    );
  }
);

ArchbaseAppBar.displayName = 'ArchbaseAppBar';
