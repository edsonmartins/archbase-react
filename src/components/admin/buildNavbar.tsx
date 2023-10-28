import { MantineTheme, px } from '@mantine/core'
import React, { ReactElement, ReactNode } from 'react'
import type { MenuItemStyles } from 'react-pro-sidebar'
import { Menu as SidebarMenu, Sidebar, sidebarClasses } from 'react-pro-sidebar'

export function buildNavbar(
  sidebarRef: React.Ref<HTMLHtmlElement>,
  theme: MantineTheme,
  collapsed: boolean,
  sidebarWidth: string | number,
  sidebarCollapsedWidth: string | number,
  menuItemStyles: MenuItemStyles,
  links: ReactNode,
  isHidden: boolean,
  menuHeight: string | number,
  sideBarFooterHeight?: string | number,
  sideBarFooterContent?: ReactNode,
): ReactElement {
  return (
    <Sidebar
      ref={sidebarRef}
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          position: 'absolute',
          background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          overflowX: 'hidden',
          overflowY: 'hidden',
          left: 0,
          right: 0,
          top: isHidden ? 0 : 'var(--mantine-header-height, 0rem)',
          height: 'calc(100vh - var(--mantine-header-height, 0rem) - var(--mantine-footer-height, 0rem))',
          paddingTop: '10px',
          paddingBottom: '20px',
        },
        [`.${sidebarClasses.root}`]: {
          borderColor: 'red',
        },
      }}
      collapsed={collapsed}
      width={`${px(sidebarWidth)}px`}
      collapsedWidth={`${px(sidebarCollapsedWidth)}px`}
    >
      <div style={{ overflowY: 'auto', overflowX: 'hidden', height: menuHeight }}>
        <SidebarMenu menuItemStyles={menuItemStyles} closeOnClick={true}>
          {links}
        </SidebarMenu>
      </div>
      {sideBarFooterContent ?? sideBarFooterContent}
    </Sidebar>
  )
}