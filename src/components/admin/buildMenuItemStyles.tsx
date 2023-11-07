import type { MenuItemStyles } from 'react-pro-sidebar'
import { menuClasses } from 'react-pro-sidebar'
import { createThemedStyles } from './createThemedStyles'
import { MantineTheme } from '@mantine/core'

export const buildMenuItemStyles = (
  theme: MantineTheme,
  collapsed: boolean,
  menuIconWidth: number,
  sidebarCollapsedWidth: number,
  hasMultipleGroups: boolean,
): MenuItemStyles => {
  const themes = createThemedStyles(theme)
  const buttonPadding = hasMultipleGroups ? {} : {padding: collapsed ? `0 ${(sidebarCollapsedWidth - menuIconWidth) / 2}px` : '0 20px'}
  const submenuContentPaddingLeft = hasMultipleGroups || collapsed ? {} : {paddingLeft: '20px'}
  const subMenuIconDisplay = hasMultipleGroups ? {} : {display: 'none'}
  return {
    root: {
      fontSize: '14px',
      fontWeight: 400,
      background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      color: theme.white,
    },
    icon: {
      background:
        theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor][8] : theme.colors[theme.primaryColor][0],
      color: theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor][0] : theme.colors[theme.primaryColor][7],
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme.colorScheme].menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: '#b6b7b9',
      ...subMenuIconDisplay
    },
    subMenuContent: () => ({
      width: '280px',
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors[theme.primaryColor][0],
      ...submenuContentPaddingLeft
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme.colorScheme].menu.disabled.color,
      },
      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors[theme.primaryColor][6] : theme.colors[theme.primaryColor][6],
        color: theme.white,
      },
      [`&.${menuClasses.active}`]: {
        backgroundColor: 'red',
      },
      ...buttonPadding
    },

    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
      '&:hover': {
        color: theme.white,
      },
    }),
  }
}
