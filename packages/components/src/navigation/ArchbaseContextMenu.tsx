import React, { forwardRef, useCallback, useState, ReactNode, MouseEvent as ReactMouseEvent } from 'react';
import {
  Menu,
  MenuProps,
  Box,
  Text,
  Divider,
  MantineColor,
  MantineSize,
  Kbd,
} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';

export interface ArchbaseContextMenuItem {
  /** Chave única do item */
  key: string;
  /** Tipo do item */
  type?: 'item' | 'divider' | 'label';
  /** Label do item */
  label?: string;
  /** Ícone do item */
  icon?: ReactNode;
  /** Ícone à direita */
  rightSection?: ReactNode;
  /** Atalho de teclado */
  shortcut?: string;
  /** Cor do item */
  color?: MantineColor;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Callback ao clicar */
  onClick?: () => void;
  /** Subitems (submenu) */
  children?: ArchbaseContextMenuItem[];
}

export interface ArchbaseContextMenuProps {
  /** Itens do menu */
  items: ArchbaseContextMenuItem[];
  /** Elemento alvo (elemento que abre o menu ao clicar com botão direito) */
  children: ReactNode;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Tamanho do menu */
  size?: MantineSize;
  /** Largura do menu */
  width?: number | string;
  /** Se deve mostrar sombra */
  shadow?: MantineSize;
  /** Raio das bordas */
  radius?: MantineSize;
  /** Offset do menu */
  offset?: number;
  /** Classe CSS do menu */
  menuClassName?: string;
  /** Estilo do menu */
  menuStyle?: React.CSSProperties;
  /** Callback ao abrir */
  onOpen?: () => void;
  /** Callback ao fechar */
  onClose?: () => void;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

const ContextMenuItemComponent: React.FC<{
  item: ArchbaseContextMenuItem;
  onClose: () => void;
}> = ({ item, onClose }) => {
  if (item.type === 'divider') {
    return <Menu.Divider />;
  }

  if (item.type === 'label') {
    return <Menu.Label>{item.label}</Menu.Label>;
  }

  // Se tem filhos, é um submenu
  if (item.children && item.children.length > 0) {
    return (
      <Menu.Item
        disabled={item.disabled}
        color={item.color}
        leftSection={item.icon}
        rightSection={<IconChevronRight size={14} />}
      >
        <Menu trigger="hover" position="right-start" offset={5}>
          <Menu.Target>
            <Text size="sm">{item.label}</Text>
          </Menu.Target>
          <Menu.Dropdown>
            {item.children.map((child) => (
              <ContextMenuItemComponent key={child.key} item={child} onClose={onClose} />
            ))}
          </Menu.Dropdown>
        </Menu>
      </Menu.Item>
    );
  }

  return (
    <Menu.Item
      disabled={item.disabled}
      color={item.color}
      leftSection={item.icon}
      rightSection={
        item.shortcut ? (
          <Kbd size="xs">{item.shortcut}</Kbd>
        ) : (
          item.rightSection
        )
      }
      onClick={() => {
        item.onClick?.();
        onClose();
      }}
    >
      {item.label}
    </Menu.Item>
  );
};

export const ArchbaseContextMenu = forwardRef<HTMLDivElement, ArchbaseContextMenuProps>(
  (
    {
      items,
      children,
      disabled = false,
      size,
      width = 200,
      shadow = 'md',
      radius = 'sm',
      offset = 5,
      menuClassName,
      menuStyle,
      onOpen,
      onClose,
      className,
      style,
    },
    ref
  ) => {
    const [opened, setOpened] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleContextMenu = useCallback(
      (event: ReactMouseEvent) => {
        if (disabled) return;

        event.preventDefault();
        event.stopPropagation();

        setPosition({ x: event.clientX, y: event.clientY });
        setOpened(true);
        onOpen?.();
      },
      [disabled, onOpen]
    );

    const handleClose = useCallback(() => {
      setOpened(false);
      onClose?.();
    }, [onClose]);

    return (
      <>
        <Box
          ref={ref}
          className={className}
          style={style}
          onContextMenu={handleContextMenu}
        >
          {children}
        </Box>

        <Menu
          opened={opened}
          onClose={handleClose}
          position="bottom-start"
          offset={offset}
          shadow={shadow}
          radius={radius}
          width={width}
          styles={{
            dropdown: {
              position: 'fixed',
              left: position.x,
              top: position.y,
              ...menuStyle,
            },
          }}
          classNames={{ dropdown: menuClassName }}
        >
          <Menu.Target>
            <div style={{ position: 'fixed', left: position.x, top: position.y, width: 1, height: 1 }} />
          </Menu.Target>
          <Menu.Dropdown>
            {items.map((item) => (
              <ContextMenuItemComponent key={item.key} item={item} onClose={handleClose} />
            ))}
          </Menu.Dropdown>
        </Menu>
      </>
    );
  }
);

ArchbaseContextMenu.displayName = 'ArchbaseContextMenu';

// Hook para uso programático
export interface UseArchbaseContextMenuOptions {
  items: ArchbaseContextMenuItem[];
  onOpen?: () => void;
  onClose?: () => void;
}

export interface UseArchbaseContextMenuReturn {
  opened: boolean;
  position: { x: number; y: number };
  open: (event: ReactMouseEvent) => void;
  close: () => void;
  getHandlers: () => {
    onContextMenu: (event: ReactMouseEvent) => void;
  };
  Menu: React.FC<{ children?: ReactNode }>;
}

export function useArchbaseContextMenu(
  options: UseArchbaseContextMenuOptions
): UseArchbaseContextMenuReturn {
  const [opened, setOpened] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const open = useCallback(
    (event: ReactMouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setPosition({ x: event.clientX, y: event.clientY });
      setOpened(true);
      options.onOpen?.();
    },
    [options]
  );

  const close = useCallback(() => {
    setOpened(false);
    options.onClose?.();
  }, [options]);

  const getHandlers = useCallback(
    () => ({
      onContextMenu: open,
    }),
    [open]
  );

  const ContextMenuComponent: React.FC<{ children?: ReactNode }> = useCallback(
    () => (
      <Menu
        opened={opened}
        onClose={close}
        position="bottom-start"
        offset={5}
        shadow="md"
        radius="sm"
        width={200}
        styles={{
          dropdown: {
            position: 'fixed',
            left: position.x,
            top: position.y,
          },
        }}
      >
        <Menu.Target>
          <div style={{ position: 'fixed', left: position.x, top: position.y, width: 1, height: 1 }} />
        </Menu.Target>
        <Menu.Dropdown>
          {options.items.map((item) => (
            <ContextMenuItemComponent key={item.key} item={item} onClose={close} />
          ))}
        </Menu.Dropdown>
      </Menu>
    ),
    [close, opened, options.items, position.x, position.y]
  );

  return {
    opened,
    position,
    open,
    close,
    getHandlers,
    Menu: ContextMenuComponent,
  };
}
