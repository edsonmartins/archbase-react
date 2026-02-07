import { useArchbaseAppContext } from '@archbase/core';
import {
	ActionIcon,
	Flex,
	MantineTheme,
	Paper,
	px,
	ScrollArea,
	Stack,
	Text,
	Tooltip,
	useMantineColorScheme,
} from '@mantine/core';
import { IconDots } from '@tabler/icons-react';
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Sidebar, sidebarClasses, Menu as SidebarMenu } from 'react-pro-sidebar';
import { buildMenuItem } from './buildMenuItem';
import { buildMenuItemStyles } from './buildMenuItemStyles';
import { buildNavbar } from './buildNavbar';
import { ArchbaseNavigationItem } from './types';
import { useLocation } from 'react-router';
import { SidebarMenuSkeleton, SidebarGroupsSkeleton, SidebarErrorMessage } from './SidebarMenuSkeleton';

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
	theme: MantineTheme;
	sidebarRef?: React.Ref<HTMLHtmlElement> | undefined;
	defaultGroupIcon?: ReactNode;
	selectedGroupName?: string;
	sideBarHeaderContent?: ReactNode | undefined;
	iconsWithBackground?: boolean;
	menuItemHeight?: string | number;
	highlightActiveMenuItem?: boolean;
	backgroundDarkColor?: string;
	backgroundLightColor?: string;
	textDarkColor?: string;
	textLightColor?: string;
	iconDarkColor?: string;
	iconLightColor?: string;
	collapsedSubmenuWidth?: string | number;
	/** Indica se as permissões estão sendo carregadas (exibe skeleton na área do menu) */
	isLoading?: boolean;
	/** Mensagem de erro ao carregar permissões (exibe mensagem na área do menu) */
	loadingError?: string | null;
	/** Componente customizado para exibir durante o carregamento */
	loadingComponent?: ReactNode;
	/** Componente customizado para exibir quando ocorrer erro */
	errorComponent?: ReactNode;
	/** Número de itens no skeleton durante loading */
	skeletonItemCount?: number;
	/** Número de grupos no skeleton durante loading */
	skeletonGroupCount?: number;
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
	sidebarHeight = `calc(100vh - var(--app-shell-header-offset, 0px))`,
	sidebarCollapsedWidth = '60px',
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
	theme,
	sidebarRef,
	defaultGroupIcon,
	selectedGroupName,
	sideBarHeaderContent,
	iconsWithBackground = false,
	menuItemHeight = 40,
	highlightActiveMenuItem = true,
	backgroundDarkColor,
	backgroundLightColor,
	textDarkColor,
	textLightColor,
	iconDarkColor,
	iconLightColor,
	collapsedSubmenuWidth,
	isLoading = false,
	loadingError,
	loadingComponent,
	errorComponent,
	skeletonItemCount = 8,
	skeletonGroupCount = 3,
}: ArchbaseAdvancedSidebarProps) {
	const [activeGroupName, setActiveGroupName] = useState<string>('');
	const appContext = useArchbaseAppContext();
	const location = useLocation();
	const { colorScheme } = useMantineColorScheme();
	const sidebarBackgroundColor = colorScheme === 'dark'
		? (backgroundDarkColor ?? theme.colors.dark[7])
		: (backgroundLightColor ?? theme.white)
	const color = selectedGroupColor
		? selectedGroupColor
		: colorScheme === 'dark'
			? theme.colors[theme.primaryColor][8]
			: theme.colors[theme.primaryColor][0];

	const sidebarTextColor = colorScheme === 'dark'
		? (textDarkColor ?? "var(--mantine-color-text)")
		: (textLightColor ?? "var(--mantine-color-text)")

	const sidebarIconColor = colorScheme === 'dark'
		? (iconDarkColor ?? theme.colors[theme.primaryColor][0])
		: (iconLightColor ?? theme.colors[theme.primaryColor][7])

	const groups = useMemo(() => {
		const result: Set<GroupItemSidebar> = new Set();
		navigationData.forEach((item) => {
			if (item.showInSidebar && (!item.disabled || !item.hideDisabledItem)) {
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
			const filteredItems = navigationData
				.filter((itm) => itm.showInSidebar === true && (!itm.disabled || !itm.hideDisabledItem) && itm.group && itm.group.name === group.name);
			
			group.links = filteredItems
				.map((item, index) => buildMenuItem(theme, collapsed, onMenuItemClick, item, index, iconsWithBackground, location.pathname, highlightActiveMenuItem, sidebarTextColor, collapsedSubmenuWidth));
		});

		const grps = [...result].sort((a, b) => a.indexOrder - b.indexOrder);

		return grps;
	}, [navigationData, activeGroupName, colorScheme, collapsed, appContext.selectedCompany, highlightActiveMenuItem, location]);

	const menuItemStyles = buildMenuItemStyles(
		colorScheme,
		theme,
		collapsed,
		35,
		Number(px(sidebarCollapsedWidth)),
		groups.length > 1,
		iconsWithBackground,
		menuItemHeight,
		sidebarBackgroundColor,
		sidebarTextColor,
		sidebarIconColor,
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

	// Função para renderizar o conteúdo do menu
	const renderMenuContent = () => {
		// Se há erro de carregamento, exibe mensagem de erro
		if (loadingError) {
			if (errorComponent) {
				return errorComponent;
			}
			return (
				<SidebarErrorMessage
					message={loadingError}
					backgroundColor={sidebarBackgroundColor}
				/>
			);
		}

		// Se está carregando, exibe skeleton
		if (isLoading) {
			if (loadingComponent) {
				return loadingComponent;
			}
			return (
				<SidebarMenuSkeleton
					itemCount={skeletonItemCount}
					collapsed={collapsed}
					backgroundColor={sidebarBackgroundColor}
				/>
			);
		}

		// Conteúdo normal do menu
		if (activeGroupName !== '') {
			return (
				<Sidebar
					ref={sidebarRef}
					rootStyles={{
						[`.${sidebarClasses.container}`]: {
							background: sidebarBackgroundColor,
							overflowX: 'hidden',
							overflowY: 'hidden',
							left: 0,
							height: `${px(sidebarHeight)}px`,
						},
					}}
					style={{ borderColor: colorScheme === 'dark' ? '#000' : '#efefef' }}
					collapsed={collapsed}
					width={`${px(sidebarWidthCalculated)}`}
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
						<SidebarMenu rootStyles={{ background: sidebarBackgroundColor }} menuItemStyles={menuItemStyles} closeOnClick={true}>
							{groups.find((item) => item.name === activeGroupName)?.links || null}
						</SidebarMenu>
					</ScrollArea>
				</Sidebar>
			);
		}

		return null;
	};

	// Função para renderizar os grupos
	const renderGroups = () => {
		// Se está carregando e não há grupos, exibe skeleton de grupos
		if (isLoading && groups.length === 0) {
			return (
				<SidebarGroupsSkeleton
					groupCount={skeletonGroupCount}
					width={sidebarGroupWidth}
					height={sidebarHeight}
				/>
			);
		}

		// Grupos normais
		if (groups.length !== 0) {
			return (
				<Stack
					gap="4px"
					style={{
						height: sidebarHeight,
						width: sidebarGroupWidth,
						padding: '4px',
						backgroundColor: calcBackgroundGroupColor,
					}}
				>
					{groups.map((item) => (
						<React.Fragment key={item.name}>{item.component}</React.Fragment>
					))}
				</Stack>
			);
		}

		return null;
	};

	// Renderiza conteúdo para sidebar com um único grupo (ou loading/error)
	const renderSingleGroupContent = () => {
		// Se há erro de carregamento
		if (loadingError) {
			if (errorComponent) {
				return errorComponent;
			}
			return (
				<SidebarErrorMessage
					message={loadingError}
					backgroundColor={sidebarBackgroundColor}
				/>
			);
		}

		// Se está carregando
		if (isLoading) {
			if (loadingComponent) {
				return loadingComponent;
			}
			return (
				<SidebarMenuSkeleton
					itemCount={skeletonItemCount}
					collapsed={collapsed}
					backgroundColor={sidebarBackgroundColor}
				/>
			);
		}

		// Conteúdo normal
		return navigationData.map((item, index) =>
			buildMenuItem(theme, collapsed, onMenuItemClick, item, index, iconsWithBackground, location.pathname, highlightActiveMenuItem, sidebarTextColor, collapsedSubmenuWidth)
		);
	};

	return (
		<>
			{groups.length == 1 ? (
				(() => {
					return buildNavbar(
						sidebarRef,
						collapsed,
						sidebarWidth,
						sidebarCollapsedWidth,
						menuItemStyles,
						renderSingleGroupContent(),
						isHidden,
						sidebarHeight,
						sideBarHeaderContent,
						sideBarFooterContent,
						sidebarBackgroundColor,
					);
				})()
			) : (
				<Flex direction="column" w={collapsed ? sidebarCollapsedWidth : sidebarWidth}>
					<div style={{ height: 'auto', width: '100%' }}>{sideBarHeaderContent}</div>
					<Paper withBorder={withBorder} h={sidebarHeight} w={'100%'} display={'flex'}>
						{renderGroups()}
						{renderMenuContent()}
					</Paper>
					<div style={{ height: 'auto', width: '100%' }}>{sideBarFooterContent}</div>
				</Flex>
			)}
		</>
	);
}
