import { AppShell, Drawer, px, useMantineTheme } from '@mantine/core';
import React, { ReactNode, useCallback, useContext, useEffect, useMemo } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'usehooks-ts';
import { ArchbaseUser } from '../auth/ArchbaseUser';
import { useArchbaseVisible } from '../hooks/useArchbaseVisible';
import {
	ArchbaseAdminLayoutContext,
	ArchbaseAdminLayoutContextValue,
	ArchbaseAdminLayoutProvider,
} from './ArchbaseAdminLayout.context';
import { ArchbaseAdvancedSidebar } from './ArchbaseAdvancedSidebar';
import { buildSetCollapsedButton } from './buildSetCollapsedButton';
import { ArchbaseCompany, ArchbaseNavigationItem, ArchbaseOwner } from './types';

export interface ArchbaseAdminMainLayoutProps {
	navigationData: ArchbaseNavigationItem[];
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
}

function ArchbaseAdminMainLayoutContainer({
	navigationData,
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
}: ArchbaseAdminMainLayoutProps) {
	const theme = useMantineTheme();
	const adminLayoutContextValue = useContext<ArchbaseAdminLayoutContextValue>(ArchbaseAdminLayoutContext);
	const navigate = useNavigate();
	const [sidebarRef, sidebarVisible] = useArchbaseVisible<HTMLHtmlElement, boolean>();
	const isHidden = useMediaQuery(`(max-width: ${sideBarHiddenBreakPoint ?? theme.breakpoints.md})`);

	const onMenuItemClick = (item: ArchbaseNavigationItem) => {
		if (item.link) {
			navigate(item.link);
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
			headerHeight = px(sideBarHeaderHeight);
		}
		if (sideBarFooterHeight) {
			footerHeight = px(sideBarFooterHeight);
		}
		return `calc(100vh - var(--mantine-header-height, 0rem) - var(--mantine-footer-height, 0rem) - ${
			headerHeight + footerHeight
		}px)`;
	};

	const routes = useMemo(() => {
		return navigationData.map((item, index) =>
			item.links ? (
				item.links.map((item2, indexSub) => (
					<Route path={item2.link} key={`${item2.link}_${indexSub}`} element={item2.component} />
				))
			) : (
				<Route key={`${item.link}_${index}`} path={item.link} element={item.component} />
			),
		);
	}, [navigationData, adminLayoutContextValue.collapsed]);

	const handleCollapseSidebar = useCallback(() => {
		adminLayoutContextValue.setCollapsed(!adminLayoutContextValue.collapsed);
		if (onCollapsedSideBar) {
			onCollapsedSideBar(!adminLayoutContextValue.collapsed);
		}
	}, [adminLayoutContextValue.setCollapsed, adminLayoutContextValue.collapsed]);

	const handleHiddenSidebar = useCallback(() => {
		adminLayoutContextValue.setHidden(!adminLayoutContextValue.hidden);
		if (onHiddenSidebar) {
			onHiddenSidebar(!adminLayoutContextValue.hidden);
		}
	}, [adminLayoutContextValue.setHidden, adminLayoutContextValue.hidden]);

	useEffect(() => {
		if (adminLayoutContextValue.hidden && !isHidden) {
			handleHiddenSidebar();
		}
	}, [adminLayoutContextValue.hidden, isHidden, handleHiddenSidebar]);

	useEffect(() => {
		if (adminLayoutContextValue.collapsed && isHidden) {
			handleCollapseSidebar();
		}
	}, [adminLayoutContextValue.collapsed, isHidden, handleCollapseSidebar]);

	return (
		<AppShell
			styles={{
				main: {
					background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
					paddingTop: 'calc(var(--mantine-header-height, 0px) + 0.5rem)',
					paddingBottom: 'calc(var(--mantine-footer-height, 0px) + 0.5rem)',
					paddingLeft: 'calc(var(--mantine-navbar-width, 0px) + 0.5rem)',
					paddingRight: 'calc(var(--mantine-aside-width, 0px) + 0.5rem)',
				},
				body: {
					overflow: 'hidden',
				},
			}}
			navbar={
				!isHidden ? (
					<ArchbaseAdvancedSidebar
						navigationData={navigationData}
						sidebarHeight={getSideBarHeight()}
						sidebarGroupWidth={sideBarCollapsedWidth}
						sidebarCollapsedWidth={sideBarCollapsedWidth}
						selectedGroupColor="#132441"
						groupColor="white"
						backgroundGroupColor="#132441"
						groupLabelDarkColor="white"
						groupLabelLightColor="white"
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
						margin="calc(var(--mantine-header-height, 0rem) - 1px) 0 0 0"
						defaultGroupIcon={sidebarDefaultGroupIcon}
						selectedGroupName={sidebarSelectedGroupName}
					/>
				) : undefined
			}
			footer={footer}
			header={header}
		>
			{!isHidden &&
				buildSetCollapsedButton(
					theme,
					adminLayoutContextValue,
					sideBarWidth,
					sideBarCollapsedWidth,
					handleCollapseSidebar,
				)}
			<div
				style={{
					height: 'calc(100vh - var(--mantine-header-height, 0rem) - var(--mantine-footer-height, 0rem) - 1rem)',
					width: `calc(100vw - ${
						isHidden ? '0rem' : adminLayoutContextValue.collapsed ? sideBarCollapsedWidth : sideBarWidth
					} - 1rem)`,
					border: `1px solid ${
						theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors[theme.primaryColor][1]
					}`,
					borderRadius: '6px',
					overflow: 'none',
				}}
			>
				{children}
				<div style={{ width: '100%', height: 'calc(100% - 48px)' }}>
					<Routes>{routes}</Routes>
				</div>
			</div>
			<Drawer
				opened={adminLayoutContextValue.hidden || false}
				onClose={handleHiddenSidebar}
				size={sideBarWidth}
				padding={0}
			>
				<ArchbaseAdvancedSidebar
					navigationData={navigationData}
					sidebarWidth={sideBarWidth}
					sidebarHeight="calc(100vh - 26px)"
					sidebarCollapsedWidth={sideBarCollapsedWidth}
					sidebarGroupWidth={sideBarCollapsedWidth}
					selectedGroupColor="#132441"
					groupColor="white"
					backgroundGroupColor="#132441"
					groupLabelDarkColor="white"
					groupLabelLightColor="white"
					showGroupLabels={false}
					collapsed={adminLayoutContextValue.collapsed}
					isHidden={isHidden}
					onMenuItemClick={onMenuItemClick}
					onClickActionIcon={onClickActionIcon}
					theme={theme}
					sidebarRef={sidebarRef}
					defaultGroupIcon={sidebarDefaultGroupIcon}
					selectedGroupName={sidebarSelectedGroupName}
				/>
			</Drawer>
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
}: ArchbaseAdminMainLayoutProps) {
	return (
		<ArchbaseAdminLayoutProvider
			navigationData={navigationData}
			navigationRootLink={navigationRootLink}
			user={user}
			owner={owner}
			company={company}
		>
			<ArchbaseAdminMainLayoutContainer
				navigationRootLink={navigationRootLink}
				navigationData={navigationData}
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
				onCollapsedSideBar={onCollapsedSideBar}
				onHiddenSidebar={onHiddenSidebar}
				sidebarDefaultGroupIcon={sidebarDefaultGroupIcon}
				sidebarSelectedGroupName={sidebarSelectedGroupName}
			>
				{children}
			</ArchbaseAdminMainLayoutContainer>
		</ArchbaseAdminLayoutProvider>
	);
}
