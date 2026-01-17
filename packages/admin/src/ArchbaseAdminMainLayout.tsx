/**
 * ArchbaseAdminMainLayout — layout administrativo base com header/nav/conteúdo.
 * @status stable
 */
import { AppShell, Drawer, MantineStyleProp, px, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import React, { ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts';
import { ArchbaseUser } from '@archbase/security';
import { useArchbaseVisible } from '@archbase/components';
import {
	ArchbaseAdminLayoutContext,
	ArchbaseAdminLayoutContextValue,
	ArchbaseAdminLayoutProvider,
} from './ArchbaseAdminLayout.context';
import { ArchbaseAdvancedSidebar } from './ArchbaseAdvancedSidebar';
import { ArchbaseAliveAbleRoutes, ArchbaseKeepAliveRoute, type ArchbaseKeepAliveRouteProps } from './ArchbaseAliveAbleRoutes';
import { buildSetCollapsedButton } from './buildSetCollapsedButton';
import { ArchbaseCompany, ArchbaseNavigationItem, ArchbaseOwner } from './types';
import { useArchbaseNavigateParams } from '@archbase/components';

export interface ArchbaseAdminMainLayoutSecurityOptions {
	navigationResourceDescription: string
	navigationResourceName: string
}

export interface ArchbaseCustomSidebarProps {
	width?: string | number,
	height?: string | number,
	isHidden?: boolean,
}

export interface ArchbaseAdminMainLayoutProps {
	navigationData?: ArchbaseNavigationItem[];
	user?: ArchbaseUser;
	owner?: ArchbaseOwner;
	company?: ArchbaseCompany;
	navigationRootLink: string;
	userMenuItems?: ReactNode | ReactNode[];
	children?: ReactNode;
	/** <Header /> component */
	header?: React.ReactElement;
	/** <Footer /> component */
	footer?: React.ReactElement;
	sideBarWidth?: string;
	sideBarCollapsedWidth?: string | number;
	sideBarHiddenBreakPoint?: string | number;
	sideBarFooterHeight?: string | number;
	sideBarFooterContent?: ReactNode;
	onCollapsedSideBar?: (collapsed: boolean) => void;
	onHiddenSidebar?: (hidden: boolean) => void;
	sidebarDefaultGroupIcon?: ReactNode;
	sidebarSelectedGroupName?: string;
	sideBarHeaderHeight?: string | number;
	sideBarHeaderContent?: ReactNode | undefined;
	selectedGroupColor?: string | undefined;
	groupColor?: string | undefined;
	backgroundGroupColor?: string | undefined;
	groupLabelDarkColor?: string | undefined;
	groupLabelLightColor?: string | undefined;
	headerColor?: string;
	footerHeight?: string | number | undefined;
	iconsWithBackground?: boolean;
	menuItemHeight?: string | number;
	showSideBar?: boolean;
	showHeader?: boolean;
	headerStyle?: MantineStyleProp;
	highlightActiveMenuItem?: boolean;
	enableSecurity?: boolean;
	securityOptions?: ArchbaseAdminMainLayoutSecurityOptions;
	customRenderSidebar?: (props: ArchbaseCustomSidebarProps) => ReactNode;
	onNavigationDataChange?: (navigationData: ArchbaseNavigationItem[]) => void;
	showCollapsedButton?: boolean;
	initialSidebarCollapsed?: boolean;
	sideBarBackgroundDarkColor?: string;
	sideBarBackgroundLightColor?: string;
	sideBarTextDarkColor?: string;
	sideBarTextLightColor?: string;
	sideBarIconDarkColor?: string;
	sideBarIconLightColor?: string;
	sideBarCollapsedSubmenuWidth?: string | number;
}

function ArchbaseAdminMainLayoutContainer({
	children,
	header,
	footer,
	sideBarWidth = '360px',
	sideBarCollapsedWidth = '74px',
	sideBarHiddenBreakPoint,
	sideBarFooterHeight,
	sideBarFooterContent,
	onCollapsedSideBar,
	onHiddenSidebar,
	sidebarSelectedGroupName,
	sidebarDefaultGroupIcon,
	sideBarHeaderHeight,
	sideBarHeaderContent,
	selectedGroupColor = '#132441',
	groupColor = 'white',
	backgroundGroupColor = '#132441',
	groupLabelDarkColor = 'white',
	groupLabelLightColor = 'white',
	headerColor,
	footerHeight,
	iconsWithBackground,
	menuItemHeight,
	showSideBar = true,
	showHeader = true,
	headerStyle = {},
	highlightActiveMenuItem = true,
	customRenderSidebar,
	showCollapsedButton = true,
	sideBarBackgroundDarkColor,
	sideBarBackgroundLightColor,
	sideBarTextDarkColor,
	sideBarTextLightColor,
	sideBarIconDarkColor,
	sideBarIconLightColor,
	sideBarCollapsedSubmenuWidth,
}: ArchbaseAdminMainLayoutProps) {
	const theme = useMantineTheme();
	const adminLayoutContextValue = useContext<ArchbaseAdminLayoutContextValue>(ArchbaseAdminLayoutContext);
	const { colorScheme } = useMantineColorScheme();
	const navigate = useArchbaseNavigateParams()
	const [sidebarRef, sidebarVisible] = useArchbaseVisible<HTMLHtmlElement, boolean>();

	const isHidden = useMediaQuery(
		`(max-width: ${sideBarHiddenBreakPoint ? px(sideBarHiddenBreakPoint) : theme.breakpoints.md})`,
	);

	const onMenuItemClick = (item: ArchbaseNavigationItem) => {
		if (item.link) {
			if (item.routeParams) {
				navigate(item.link, {}, item.routeParams);
			} else {
				navigate(item.link);
			}
		}
	};

	const onClickActionIcon = (previousActiveGroupName: string, currentActiveGroupName: string) => {
		if (previousActiveGroupName == currentActiveGroupName && adminLayoutContextValue.collapsed) {
			adminLayoutContextValue.setCollapsed(false);
		}
		adminLayoutContextValue.setCollapsed(previousActiveGroupName == currentActiveGroupName);
	};

	const getSideBarHeight = () => {
		let headerHeight = 0;
		let footerHeight = 0;
		if (sideBarHeaderHeight) {
			headerHeight = Number(px(sideBarHeaderHeight));
		}
		if (sideBarFooterHeight) {
			footerHeight = Number(px(sideBarFooterHeight));
		}
		return `calc(100vh - var(--app-shell-header-offset, 0px) - ${headerHeight + footerHeight}px)`;
	};

	const getSideBarDrawerHeight = () => {
		let headerHeight = 0;
		let footerHeight = 0;
		if (sideBarHeaderHeight) {
			headerHeight = Number(px(sideBarHeaderHeight));
		}
		if (sideBarFooterHeight) {
			footerHeight = Number(px(sideBarFooterHeight));
		}
		return `calc(100vh - 28px - ${headerHeight + footerHeight}px)`;
	};


	const routes = useMemo(() => {
		const routeElements: React.ReactElement[] = [];
		adminLayoutContextValue.navigationData.forEach((item, index) => {
			if (item.links) {
				item.links.forEach((item2, indexSub) => {
					if (item2.keepAlive) {
						routeElements.push(
							<ArchbaseKeepAliveRoute path={item2.link} key={`${item2.link}_${indexSub}`} component={item2.component} />
						);
					} else {
						routeElements.push(<Route path={item2.link} key={`${item2.link}_${indexSub}`} element={item2.component as any} />);
					}
				});
			} else {
				if (item.keepAlive) {
					routeElements.push(
						<ArchbaseKeepAliveRoute key={`${item.link}_${index}`} path={item.link} component={item.component} />
					);
				} else {
					routeElements.push(
						<Route key={`${item.link}_${index}`} path={item.link} element={item.component as any} />
					);
				}
			}
		});
		return routeElements;
	}, [adminLayoutContextValue.navigationData, adminLayoutContextValue.collapsed]);

	const handleCollapseSidebar = useCallback(() => {
		adminLayoutContextValue.setCollapsed(!adminLayoutContextValue.collapsed);
	}, [adminLayoutContextValue.setCollapsed, adminLayoutContextValue.collapsed]);

	const handleHiddenSidebar = useCallback(() => {
		adminLayoutContextValue.setHidden(!adminLayoutContextValue.hidden);
	}, [adminLayoutContextValue.setHidden, adminLayoutContextValue.hidden]);

	useEffect(() => {
		if (onHiddenSidebar) {
			onHiddenSidebar(adminLayoutContextValue.hidden);
		}
	}, [adminLayoutContextValue.hidden, handleHiddenSidebar]);

	useEffect(() => {
		if (onCollapsedSideBar) {
			onCollapsedSideBar(adminLayoutContextValue.collapsed);
		}
	}, [adminLayoutContextValue.collapsed, onCollapsedSideBar]);

	const currentSidebarWidth = adminLayoutContextValue.collapsed ? sideBarCollapsedWidth : sideBarWidth;
	return (
		<AppShell
			header={{ height: '60px', collapsed: !showHeader }}
			footer={{ height: footerHeight ? footerHeight : '0px' }}
			styles={{
				main: {
					background: colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
					overflow: 'hidden',
				},
			}}
		>
			<AppShell.Header
				p="xs"
				color={headerColor}
				display="flex"
				style={{
					backgroundColor: 'var(--mantine-primary-color-8)',
					alignItems: 'center',
					borderBottom: 'none',
					...headerStyle
				}}
			>
				{header}
			</AppShell.Header>
			<AppShell.Navbar>
				{!isHidden && showSideBar ? (
					customRenderSidebar ? customRenderSidebar({ width: sideBarWidth, height: getSideBarHeight(), isHidden }) :
						<ArchbaseAdvancedSidebar
							navigationData={adminLayoutContextValue.navigationData}
							sidebarHeight={getSideBarHeight()}
							sidebarGroupWidth={sideBarCollapsedWidth}
							sidebarCollapsedWidth={sideBarCollapsedWidth}
							selectedGroupColor={selectedGroupColor}
							groupColor={groupColor}
							backgroundGroupColor={backgroundGroupColor}
							groupLabelDarkColor={groupLabelDarkColor}
							groupLabelLightColor={groupLabelLightColor}
							showGroupLabels={false}
							collapsed={adminLayoutContextValue.collapsed}
							sidebarWidth={sideBarWidth}
							isHidden={isHidden}
							onMenuItemClick={onMenuItemClick}
							onClickActionIcon={onClickActionIcon}
							sideBarFooterHeight={sideBarFooterHeight}
							sideBarFooterContent={sideBarFooterContent}
							sideBarHeaderContent={sideBarHeaderContent}
							theme={theme}
							sidebarRef={sidebarRef}
							defaultGroupIcon={sidebarDefaultGroupIcon}
							selectedGroupName={sidebarSelectedGroupName}
							iconsWithBackground={iconsWithBackground}
							menuItemHeight={menuItemHeight}
							highlightActiveMenuItem={highlightActiveMenuItem}
							backgroundDarkColor={sideBarBackgroundDarkColor}
							backgroundLightColor={sideBarBackgroundLightColor}
							textDarkColor={sideBarTextDarkColor}
							textLightColor={sideBarTextLightColor}
							iconDarkColor={sideBarIconDarkColor}
							iconLightColor={sideBarIconLightColor}
							collapsedSubmenuWidth={sideBarCollapsedSubmenuWidth}
						/>
				) : undefined}
			</AppShell.Navbar>
			<AppShell.Main bg={colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0]}>
				{!isHidden && showCollapsedButton &&
					buildSetCollapsedButton(
						colorScheme,
						theme,
						adminLayoutContextValue,
						sideBarWidth,
						sideBarCollapsedWidth,
						handleCollapseSidebar
					)}
				<div
					style={{
						height: `calc(100vh - var(--app-shell-header-offset, 0px) - var(--app-shell-footer-offset, 0px) - var(--app-shell-padding) - 1rem)`,
						width: `calc(100vw - var(--app-shell-padding) - calc(${isHidden ? '0px' : currentSidebarWidth} + 1rem))`,
						marginTop: '0.5rem',
						marginLeft: `calc(${isHidden ? '0px' : currentSidebarWidth} + 0.5rem)`,
						border: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[4] : '#e4e9ef'}`,
						borderRadius: '4px',
						overflow: 'none',
					}}
				>
					{children}
					<div style={{ width: '100%', height: 'calc(100% - 48px)' }}>
						<ArchbaseAliveAbleRoutes>{...routes as any}</ArchbaseAliveAbleRoutes>
					</div>
				</div>
				{showSideBar &&
					<Drawer
						opened={adminLayoutContextValue.hidden || false}
						onClose={handleHiddenSidebar}
						size={sideBarWidth}
						padding={0}
						styles={{
							header: { minHeight: '10px' },
						}}
					>
						{
							customRenderSidebar ? customRenderSidebar({ width: sideBarWidth, height: getSideBarDrawerHeight(), isHidden }) :
								<ArchbaseAdvancedSidebar
									navigationData={adminLayoutContextValue.navigationData}
									sidebarWidth={sideBarWidth}
									sidebarHeight={getSideBarDrawerHeight()}
									sidebarCollapsedWidth={sideBarCollapsedWidth}
									sidebarGroupWidth={sideBarCollapsedWidth}
									selectedGroupColor={selectedGroupColor}
									groupColor={groupColor}
									backgroundGroupColor={backgroundGroupColor}
									groupLabelDarkColor={groupLabelDarkColor}
									groupLabelLightColor={groupLabelLightColor}
									showGroupLabels={false}
									isHidden={isHidden}
									onMenuItemClick={onMenuItemClick}
									onClickActionIcon={onClickActionIcon}
									theme={theme}
									sidebarRef={sidebarRef}
									defaultGroupIcon={sidebarDefaultGroupIcon}
									selectedGroupName={sidebarSelectedGroupName}
									iconsWithBackground={iconsWithBackground}
									menuItemHeight={menuItemHeight}
									sideBarHeaderContent={sideBarHeaderContent}
									sideBarFooterContent={sideBarFooterContent}
									sideBarFooterHeight={sideBarFooterHeight}
									highlightActiveMenuItem={highlightActiveMenuItem}
									backgroundDarkColor={sideBarBackgroundDarkColor}
									backgroundLightColor={sideBarBackgroundLightColor}
									textDarkColor={sideBarTextDarkColor}
									textLightColor={sideBarTextLightColor}
									iconDarkColor={sideBarIconDarkColor}
									iconLightColor={sideBarIconLightColor}
									collapsedSubmenuWidth={sideBarCollapsedSubmenuWidth}
								/>
						}
					</Drawer>
				}
			</AppShell.Main>
			<AppShell.Footer>
				{footer}
			</AppShell.Footer>
		</AppShell>
	);
}

export function ArchbaseAdminMainLayout({
	navigationRootLink = '/',
	navigationData,
	user,
	children,
	header,
	footer,
	owner,
	company,
	sideBarWidth,
	sideBarCollapsedWidth,
	sideBarHiddenBreakPoint,
	sideBarFooterHeight,
	sideBarFooterContent,
	onCollapsedSideBar,
	onHiddenSidebar,
	sidebarDefaultGroupIcon,
	sidebarSelectedGroupName,
	sideBarHeaderHeight,
	sideBarHeaderContent,
	selectedGroupColor = '#132441',
	groupColor = 'white',
	backgroundGroupColor = '#132441',
	groupLabelDarkColor = 'white',
	groupLabelLightColor = 'white',
	headerColor,
	footerHeight,
	iconsWithBackground,
	menuItemHeight,
	showSideBar,
	showHeader,
	headerStyle,
	highlightActiveMenuItem,
	enableSecurity = false,
	securityOptions,
	customRenderSidebar,
	onNavigationDataChange,
	showCollapsedButton,
	initialSidebarCollapsed = false,
	sideBarBackgroundDarkColor,
	sideBarBackgroundLightColor,
	sideBarTextDarkColor,
	sideBarTextLightColor,
	sideBarIconDarkColor,
	sideBarIconLightColor,
	sideBarCollapsedSubmenuWidth,
}: ArchbaseAdminMainLayoutProps) {
	return (
		<ArchbaseAdminLayoutProvider
			navigationData={navigationData}
			navigationRootLink={navigationRootLink}
			user={user}
			owner={owner}
			company={company}
			enableSecurity={enableSecurity}
			securityOptions={securityOptions}
			onNavigationDataChange={onNavigationDataChange}
			initialSidebarCollapsed={initialSidebarCollapsed}
		>
			<ArchbaseAdminMainLayoutContainer
				navigationRootLink={navigationRootLink}
				user={user}
				header={header}
				footer={footer}
				owner={owner}
				company={company}
				sideBarWidth={sideBarWidth}
				sideBarCollapsedWidth={sideBarCollapsedWidth}
				sideBarHiddenBreakPoint={sideBarHiddenBreakPoint}
				sideBarHeaderHeight={sideBarHeaderHeight}
				sideBarHeaderContent={sideBarHeaderContent}
				sideBarFooterHeight={sideBarFooterHeight}
				sideBarFooterContent={sideBarFooterContent}
				selectedGroupColor={selectedGroupColor}
				groupColor={groupColor}
				backgroundGroupColor={backgroundGroupColor}
				groupLabelDarkColor={groupLabelDarkColor}
				groupLabelLightColor={groupLabelLightColor}
				onCollapsedSideBar={onCollapsedSideBar}
				onHiddenSidebar={onHiddenSidebar}
				sidebarDefaultGroupIcon={sidebarDefaultGroupIcon}
				sidebarSelectedGroupName={sidebarSelectedGroupName}
				headerColor={headerColor}
				footerHeight={footerHeight}
				iconsWithBackground={iconsWithBackground}
				menuItemHeight={menuItemHeight}
				showSideBar={showSideBar}
				showHeader={showHeader}
				headerStyle={headerStyle}
				highlightActiveMenuItem={highlightActiveMenuItem}
				enableSecurity={enableSecurity}
				customRenderSidebar={customRenderSidebar}
				showCollapsedButton={showCollapsedButton}
				sideBarBackgroundDarkColor={sideBarBackgroundDarkColor}
				sideBarBackgroundLightColor={sideBarBackgroundLightColor}
				sideBarTextDarkColor={sideBarTextDarkColor}
				sideBarTextLightColor={sideBarTextLightColor}
				sideBarIconDarkColor={sideBarIconDarkColor}
				sideBarIconLightColor={sideBarIconLightColor}
				sideBarCollapsedSubmenuWidth={sideBarCollapsedSubmenuWidth}
			>
				{children}
			</ArchbaseAdminMainLayoutContainer>
		</ArchbaseAdminLayoutProvider>
	);
}
