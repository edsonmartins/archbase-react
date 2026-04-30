import React, { forwardRef, useCallback, ReactNode } from 'react';
import {
  Drawer,
  DrawerProps,
  Menu,
  Button,
  Stack,
  Group,
  Text,
  Divider,
  Box,
  MantineColor,
  MantineSize,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

export interface ArchbaseActionSheetItem {
  /** Chave única */
  key: string;
  /** Tipo do item */
  type?: 'item' | 'divider';
  /** Label do item */
  label?: string;
  /** Descrição */
  description?: string;
  /** Ícone */
  icon?: ReactNode;
  /** Cor */
  color?: MantineColor;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Callback ao clicar */
  onClick?: () => void;
}

export interface ArchbaseActionSheetProps {
  /** Itens do action sheet */
  items: ArchbaseActionSheetItem[];
  /** Se está aberto */
  opened: boolean;
  /** Callback ao fechar */
  onClose: () => void;
  /** Título */
  title?: string;
  /** Descrição */
  description?: string;
  /** Label do botão cancelar */
  cancelLabel?: string;
  /** Se deve mostrar botão cancelar */
  showCancel?: boolean;
  /** Breakpoint para mudar de drawer para menu */
  breakpoint?: string;
  /** Posição do menu no desktop */
  menuPosition?: 'bottom' | 'top' | 'left' | 'right';
  /** Elemento alvo do menu (desktop) */
  target?: ReactNode;
  /** Tamanho */
  size?: MantineSize;
  /** Raio das bordas do drawer */
  radius?: MantineSize;
  /** Se deve ter overlay */
  withOverlay?: boolean;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseActionSheet = forwardRef<HTMLDivElement, ArchbaseActionSheetProps>(
  (
    {
      items,
      opened,
      onClose,
      title,
      description,
      cancelLabel = 'Cancelar',
      showCancel = true,
      breakpoint = '48em',
      menuPosition = 'bottom',
      target,
      size = 'md',
      radius = 'lg',
      withOverlay = true,
      className,
      style,
    },
    ref
  ) => {
    const isMobile = useMediaQuery(`(max-width: ${breakpoint})`);

    const handleItemClick = useCallback(
      (item: ArchbaseActionSheetItem) => {
        if (item.disabled) return;
        item.onClick?.();
        onClose();
      },
      [onClose]
    );

    const renderItem = (item: ArchbaseActionSheetItem) => {
      if (item.type === 'divider') {
        return <Divider key={item.key} my="xs" />;
      }

      return (
        <Button
          key={item.key}
          variant="subtle"
          color={item.color || 'dark'}
          size={size}
          fullWidth
          justify="flex-start"
          leftSection={item.icon}
          disabled={item.disabled}
          onClick={() => handleItemClick(item)}
          styles={{
            root: {
              height: 'auto',
              padding: '12px 16px',
            },
            inner: {
              justifyContent: 'flex-start',
            },
          }}
        >
          <Stack gap={0} align="flex-start">
            <Text size={size} fw={500}>
              {item.label}
            </Text>
            {item.description && (
              <Text size="xs" c="dimmed">
                {item.description}
              </Text>
            )}
          </Stack>
        </Button>
      );
    };

    // Mobile: Drawer from bottom
    if (isMobile) {
      return (
        <Drawer
          ref={ref}
          opened={opened}
          onClose={onClose}
          position="bottom"
          size="auto"
          withOverlay={withOverlay}
          radius={radius}
          title={title}
          className={className}
          style={style}
          styles={{
            content: {
              paddingBottom: 'env(safe-area-inset-bottom, 16px)',
            },
            header: {
              paddingBottom: title ? 8 : 0,
            },
          }}
        >
          <Stack gap={0}>
            {description && (
              <Text size="sm" c="dimmed" mb="md">
                {description}
              </Text>
            )}

            {items.map(renderItem)}

            {showCancel && (
              <>
                <Divider my="sm" />
                <Button
                  variant="subtle"
                  color="gray"
                  size={size}
                  fullWidth
                  onClick={onClose}
                >
                  {cancelLabel}
                </Button>
              </>
            )}
          </Stack>
        </Drawer>
      );
    }

    // Desktop: Menu dropdown
    return (
      <Menu
        opened={opened}
        onClose={onClose}
        position={menuPosition}
        shadow="md"
        width={280}
      >
        <Menu.Target>{target || <Box />}</Menu.Target>
        <Menu.Dropdown ref={ref} className={className} style={style}>
          {title && <Menu.Label>{title}</Menu.Label>}
          {description && (
            <Text size="xs" c="dimmed" px="sm" pb="xs">
              {description}
            </Text>
          )}

          {items.map((item) => {
            if (item.type === 'divider') {
              return <Menu.Divider key={item.key} />;
            }

            return (
              <Menu.Item
                key={item.key}
                leftSection={item.icon}
                color={item.color}
                disabled={item.disabled}
                onClick={() => handleItemClick(item)}
              >
                <Stack gap={0}>
                  <Text size="sm">{item.label}</Text>
                  {item.description && (
                    <Text size="xs" c="dimmed">
                      {item.description}
                    </Text>
                  )}
                </Stack>
              </Menu.Item>
            );
          })}

          {showCancel && (
            <>
              <Menu.Divider />
              <Menu.Item color="gray" onClick={onClose}>
                {cancelLabel}
              </Menu.Item>
            </>
          )}
        </Menu.Dropdown>
      </Menu>
    );
  }
);

ArchbaseActionSheet.displayName = 'ArchbaseActionSheet';

// ================== Hook para uso programático ==================

export interface UseArchbaseActionSheetOptions {
  items: ArchbaseActionSheetItem[];
  title?: string;
  description?: string;
  cancelLabel?: string;
  showCancel?: boolean;
}

export interface UseArchbaseActionSheetReturn {
  opened: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  ActionSheet: React.FC<{ target?: ReactNode }>;
}

export function useArchbaseActionSheet(
  options: UseArchbaseActionSheetOptions
): UseArchbaseActionSheetReturn {
  const [opened, setOpened] = React.useState(false);

  const open = useCallback(() => setOpened(true), []);
  const close = useCallback(() => setOpened(false), []);
  const toggle = useCallback(() => setOpened((prev) => !prev), []);

  const ActionSheetComponent: React.FC<{ target?: ReactNode }> = useCallback(
    ({ target }) => (
      <ArchbaseActionSheet
        items={options.items}
        opened={opened}
        onClose={close}
        title={options.title}
        description={options.description}
        cancelLabel={options.cancelLabel}
        showCancel={options.showCancel}
        target={target}
      />
    ),
    [close, opened, options]
  );

  return {
    opened,
    open,
    close,
    toggle,
    ActionSheet: ActionSheetComponent,
  };
}
