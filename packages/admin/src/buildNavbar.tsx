import { px, ScrollArea } from '@mantine/core';
import React, { ReactElement, ReactNode } from 'react';
import type { MenuItemStyles } from 'react-pro-sidebar';
import { Sidebar, sidebarClasses, Menu as SidebarMenu } from 'react-pro-sidebar';

export function buildNavbar(
	sidebarRef: React.Ref<HTMLHtmlElement>,
	collapsed: boolean,
	sidebarWidth: string | number,
	sidebarCollapsedWidth: string | number,
	menuItemStyles: MenuItemStyles,
	links: ReactNode,
	isHidden: boolean,
	menuHeight: string | number,
	sideBarHeaderContent?: ReactNode | undefined,
	sideBarFooterContent?: ReactNode | undefined,
	sidebarBackgroundColor?: string
): ReactElement {
	return (
		<Sidebar
			ref={sidebarRef}
			rootStyles={{
				[`.${sidebarClasses.container}`]: {
					position: 'absolute',
					background: sidebarBackgroundColor,
					overflowX: 'hidden',
					overflowY: 'hidden',
					left: 0,
					right: 0,
					height: isHidden ? "calc(100vh - 28px)" : `${px(menuHeight)}px`,
				},
			}}
			collapsed={collapsed}
			width={`${px(sidebarWidth)}px`}
			collapsedWidth={`${px(sidebarCollapsedWidth)}px`}
		>
			{sideBarHeaderContent && <>{sideBarHeaderContent}</>}
			<ScrollArea style={{ overflowY: 'auto', overflowX: 'hidden', height: menuHeight }}>
				<SidebarMenu rootStyles={{background: sidebarBackgroundColor}} menuItemStyles={menuItemStyles} closeOnClick={true}>
					{links && <>{links}</>}
				</SidebarMenu>
			</ScrollArea>
			{sideBarFooterContent && <>{sideBarFooterContent}</>}
		</Sidebar>
	);
}
