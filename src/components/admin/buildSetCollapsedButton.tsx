import { ActionIcon, MantineTheme } from '@mantine/core';
import React from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { ArchbaseAdminLayoutContextValue } from './ArchbaseAdminLayout.context';

export function buildSetCollapsedButton(
  theme: MantineTheme,
  adminLayoutContextValue: ArchbaseAdminLayoutContextValue,
  sideBarWidth: string | number,
  sideBarCollapsedWidth: string | number,
  handleCollapseSidebar: () => void
) {
  return (
    <div
      style={{
        position: 'absolute',
        left: adminLayoutContextValue.collapsed
          ? `calc(${sideBarCollapsedWidth} - 14px)`
          : `calc(${sideBarWidth} - 14px)`,
        top: 'calc(100vh / 2)',
        zIndex: '99',
      }}
    >
      <ActionIcon
        bg={theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor][4] : theme.colors[theme.primaryColor][4]}
        color={theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor][6] : theme.colors[theme.primaryColor][6]}
        variant="filled"
        radius="xl"
        onClick={handleCollapseSidebar}
      >
        {adminLayoutContextValue.collapsed ? <IconChevronRight /> : <IconChevronLeft />}
      </ActionIcon>
    </div>
  );
}
