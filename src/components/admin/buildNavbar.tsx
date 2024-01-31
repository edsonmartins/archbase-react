import { MantineTheme, px, ScrollArea } from '@mantine/core';
import React, { ReactElement, ReactNode } from 'react';
import type { MenuItemStyles } from 'react-pro-sidebar';
import { Sidebar, sidebarClasses, Menu as SidebarMenu } from 'react-pro-sidebar';

export function buildNavbar(
	sidebarRef: React.Ref<HTMLHtmlElement>,
	colorScheme: 'dark' | 'light',
	theme: MantineTheme,
	collapsed: boolean,
	sidebarWidth: string | number,
	sidebarCollapsedWidth: string | number,
	menuItemStyles: MenuItemStyles,
	links: ReactNode,
	isHidden: boolean,
	menuHeight: string | number,
	sideBarHeaderContent?: ReactNode | undefined,
	sideBarFooterContent?: ReactNode | undefined,
): ReactElement {
	return (
		<Sidebar
			ref={sidebarRef}
			rootStyles={{
				[`.${sidebarClasses.container}`]: {
					position: 'absolute',
					background: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
					overflowX: 'hidden',
					overflowY: 'hidden',
					left: 0,
					right: 0,
					top: isHidden ? 0 : 'var(--app-shell-header-offset, 0px)',
					height: 'calc(100vh - 500px)',
				},
			}}
			collapsed={collapsed}
			width={`${px(sidebarWidth)}px`}
			collapsedWidth={`${px(sidebarCollapsedWidth)}px`}
		>
			{sideBarHeaderContent}
			<ScrollArea style={{ overflowY: 'auto', overflowX: 'hidden', height: menuHeight }}>
				<SidebarMenu menuItemStyles={menuItemStyles} closeOnClick={true}>
					{links}
				</SidebarMenu>
			</ScrollArea>
			{sideBarFooterContent}
		</Sidebar>
	);
}
