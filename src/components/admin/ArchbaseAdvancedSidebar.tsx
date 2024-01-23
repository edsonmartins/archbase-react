import { ActionIcon, Flex, MantineTheme, Paper, px, ScrollArea, Stack, Text, Tooltip } from '@mantine/core';
import { useColorScheme, useForceUpdate } from '@mantine/hooks';
import { IconDots } from '@tabler/icons-react';
import { useArchbaseAppContext } from 'components/core';
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Sidebar, sidebarClasses, Menu as SidebarMenu } from 'react-pro-sidebar';
import { buildMenuItem } from './buildMenuItem';
import { buildMenuItemStyles } from './buildMenuItemStyles';
import { buildNavbar } from './buildNavbar';
import { ArchbaseNavigationItem } from './types';

export interface ArchbaseAdvancedSidebarProps {
	navigationData: ArchbaseNavigationItem[];
	sidebarWidth?: string | number;
	sidebarHeight?: string | number;
	sidebarCollapsedWidth?: string | number;
	sidebarGroupWidth?: string | number;
	onMenuItemClick?: (item: ArchbaseNavigationItem) => void;
	onClickActionIcon?: (previousActiveGroupName: string, currentActiveGroupName: string) => void;
	selectedGroupColor?: string;
	groupColor?: string;
	groupLabelDarkColor?: string;
	groupLabelLightColor?: string;
	backgroundGroupColor?: string;
	isHidden?: boolean;
	sideBarFooterHeight?: string | number | undefined;
	sideBarFooterContent?: ReactNode | undefined;
	collapsed?: boolean;
	withBorder?: boolean;
	showGroupLabels?: boolean;
	margin?: string;
	theme: MantineTheme;
	sidebarRef?: React.Ref<HTMLHtmlElement> | undefined;
	defaultGroupIcon?: ReactNode;
	selectedGroupName?: string;
	sideBarHeaderContent?: ReactNode | undefined;
}

type GroupItemSidebar = {
	name: string;
	indexOrder: number;
	component: ReactNode;
	links?: ReactNode[] | undefined;
};

export function ArchbaseAdvancedSidebar({
	navigationData,
	sidebarGroupWidth = '80px',
	sidebarWidth = '360px',
	sidebarHeight = `calc(100vh - var(--mantine-header-height, 0rem) - var(--mantine-footer-height, 0rem))`,
	sidebarCollapsedWidth,
	selectedGroupColor,
	groupColor,
	backgroundGroupColor,
	isHidden = false,
	sideBarFooterHeight,
	sideBarFooterContent,
	groupLabelDarkColor,
	groupLabelLightColor,
	collapsed,
	onMenuItemClick,
	onClickActionIcon,
	withBorder = false,
	showGroupLabels = true,
	margin,
	theme,
	sidebarRef,
	defaultGroupIcon,
	selectedGroupName,
	sideBarHeaderContent,
}: ArchbaseAdvancedSidebarProps) {
	const [activeGroupName, setActiveGroupName] = useState<string>('');
	const appContext = useArchbaseAppContext();
	const forceUpdate = useForceUpdate();
	const colorScheme = useColorScheme();
	const color = selectedGroupColor
		? selectedGroupColor
		: colorScheme === 'dark'
		? theme.colors[theme.primaryColor][8]
		: theme.colors[theme.primaryColor][0];

	const groups = useMemo(() => {
		const result: Set<GroupItemSidebar> = new Set();
		navigationData.forEach((item) => {
			if (item.showInSidebar) {
				let found = false;
				if (!item.group) {
					item.group = {
						icon: defaultGroupIcon ? defaultGroupIcon : <IconDots size="2.2rem" color="#63B1FB" stroke={1} />,
						label: 'Default',
						name: 'Default',
						hint: 'Default',
						indexOrder: 0,
					};
				}
				result.forEach((it) => {
					if (it.name === item.group.name) {
						found = true;
					}
				});
				if (!found) {
					result.add({
						name: item.group.name,
						indexOrder: item.group.indexOrder,
						component: (
							<Tooltip
								key={item.group.name}
								content={item.group.hint}
								label={item.group.label}
								disabled={showGroupLabels}
							>
								<Stack
									gap={'2px'}
									style={{
										alignItems: 'center',
										alignContent: 'center',
										justifyContent: 'center',
										textAlign: 'center',
									}}
								>
									<ActionIcon
										size="48px"
										variant={item.group.name === activeGroupName ? 'filled' : backgroundGroupColor ? 'subtle' : 'light'}
										color={item.group.name === activeGroupName ? color : groupColor}
										onClick={() => {
											setActiveGroupName((prev) => {
												if (onClickActionIcon) {
													onClickActionIcon(prev, item.group.name);
												}

												if (item.group.name === prev && !isHidden) {
													return '';
												}

												return item.group.name;
											});
										}}
									>
										{item.group.icon}
									</ActionIcon>
									{showGroupLabels ? (
										<Text
											size="xs"
											c={
												colorScheme === 'dark'
													? groupLabelDarkColor
														? groupLabelDarkColor
														: theme.colors[theme.primaryColor][2]
													: groupLabelLightColor
													? groupLabelLightColor
													: theme.colors[theme.primaryColor][2]
											}
										>
											{item.group.label}
										</Text>
									) : (
										false
									)}
								</Stack>
							</Tooltip>
						),
					});
				}
			}
		});
		result.forEach((group) => {
			group.links = navigationData
				.filter((itm) => itm.showInSidebar === true && itm.group && itm.group.name === group.name)
				.map((item, index) => buildMenuItem(theme, collapsed, onMenuItemClick, item, index));
		});

		const grps = [...result].sort((a, b) => a.indexOrder - b.indexOrder);

		return grps;
	}, [navigationData, activeGroupName, colorScheme, collapsed, appContext.selectedCompany]);

	const menuItemStyles = buildMenuItemStyles(
		colorScheme,
		theme,
		collapsed,
		35,
		Number(px(sidebarCollapsedWidth)),
		groups.length > 1,
	);

	const sidebarWidthCalculated =
		collapsed || activeGroupName === '' ? '0px' : `calc(${sidebarWidth} - ${sidebarGroupWidth})`;

	const calcBackgroundGroupColor = backgroundGroupColor
		? backgroundGroupColor
		: colorScheme === 'dark'
		? theme.colors[theme.primaryColor][6]
		: theme.colors[theme.primaryColor][7];

	const setDefaultActiveGroupName = useCallback(() => {
		if (selectedGroupName && groups.map((group) => group.name).includes(selectedGroupName)) {
			setActiveGroupName(selectedGroupName);
		} else {
			if (groups.length > 1) {
				setActiveGroupName('Default');
			}
		}
	}, []);

	useEffect(() => {
		setDefaultActiveGroupName();
	}, []);

	useEffect(() => {
		if (!collapsed) {
			if (activeGroupName === '') {
				setDefaultActiveGroupName();
			}
		} else {
			setActiveGroupName('');
		}
	}, [collapsed]);

	return (
		<>
			{groups.length == 1 ? (
				buildNavbar(
					sidebarRef,
					colorScheme,
					theme,
					collapsed,
					sidebarWidth,
					sidebarCollapsedWidth,
					menuItemStyles,
					navigationData.map((item, index) => buildMenuItem(theme, collapsed, onMenuItemClick, item, index)),
					isHidden,
					sidebarHeight,
					sideBarHeaderContent,
					sideBarFooterContent,
				)
			) : (
				<Flex direction="column" w={collapsed ? sidebarCollapsedWidth : sidebarWidth}>
					<div style={{ height: 'auto', width: '100%', margin }}>{sideBarHeaderContent}</div>
					<Paper
						withBorder={withBorder}
						style={{
							display: 'flex',
							height: sidebarHeight,
							width: sidebarWidth,
						}}
					>
						{groups.length === 0 ? (
							false
						) : (
							<Stack
								gap="4px"
								style={{
									height: sidebarHeight,
									width: sidebarGroupWidth,
									padding: '4px',
									backgroundColor: calcBackgroundGroupColor,
								}}
							>
								{groups.map((item) => item.component)}
							</Stack>
						)}
						{activeGroupName !== '' ? (
							<Sidebar
								ref={sidebarRef}
								rootStyles={{
									[`.${sidebarClasses.container}`]: {
										background: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
										overflowX: 'hidden',
										overflowY: 'hidden',
										left: 0,
										height: `${px(sidebarHeight)}px`,
									},
								}}
								collapsed={collapsed}
								width={`${px(sidebarWidthCalculated)}px`}
								collapsedWidth="0px"
							>
								<ScrollArea
									style={{
										overflowY: 'auto',
										overflowX: 'hidden',
										height: '100%',
										width: sidebarWidthCalculated,
									}}
								>
									<SidebarMenu menuItemStyles={menuItemStyles} closeOnClick={true}>
										{groups.map((item) => {
											if (item.name === activeGroupName) {
												return item.links;
											}
										})}
									</SidebarMenu>
								</ScrollArea>
							</Sidebar>
						) : (
							false
						)}
					</Paper>
					<div style={{ height: 'auto', width: '100%' }}>{sideBarFooterContent}</div>
				</Flex>
			)}
		</>
	);
}
