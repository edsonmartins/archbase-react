import { MantineTheme, px, ScrollArea } from '@mantine/core';
import React, { ReactElement, ReactNode } from 'react';
import type { MenuItemStyles } from 'react-pro-sidebar';
import { Sidebar, sidebarClasses, Menu as SidebarMenu } from 'react-pro-sidebar';

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
	sideBarHeaderContent?: ReactNode | undefined,
	sideBarFooterContent?: ReactNode | undefined,
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
