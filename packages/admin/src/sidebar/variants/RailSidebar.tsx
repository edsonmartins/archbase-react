import React, { useMemo, useCallback, useEffect } from 'react';
import {
	Box,
	ScrollArea,
	Stack,
	Flex,
	useMantineTheme,
	useMantineColorScheme,
	px,
} from '@mantine/core';
import { IconDots } from '@tabler/icons-react';
import { ArchbaseNavigationItem, ArchbaseNavigationGroup } from '../../types';
import { ArchbaseMantineSidebarProps } from '../types';
import { SidebarProvider, useSidebar } from '../context';
import { SidebarItem } from '../components/SidebarItem';
import { SidebarGroupIcon } from '../components/SidebarGroupIcon';
import {
	SidebarMenuSkeleton,
	SidebarGroupsSkeleton,
	SidebarErrorMessage,
} from '../components/SidebarSkeleton';
import { useSidebarNavigation } from '../hooks/useSidebarNavigation';
import { useSidebarKeyboard } from '../hooks/useSidebarKeyboard';

interface RailSidebarContentProps extends Omit<ArchbaseMantineSidebarProps, 'variant'> {}

/**
 * Conteúdo interno do RailSidebar
 */
function RailSidebarContent({
	navigationData,
	width = 360,
	collapsedWidth = 60,
	height = '100%',
	groupColumnWidth = 80,
	defaultGroupIcon,
	showGroupLabels = true,
	header,
	footer,
	footerHeight,
	isLoading = false,
	loadingError,
	loadingComponent,
	errorComponent,
	skeletonItemCount = 8,
	skeletonGroupCount = 3,
	backgroundDarkColor,
	backgroundLightColor,
	textDarkColor,
	textLightColor,
	iconDarkColor,
	iconLightColor,
	activeColor,
	groupBackgroundColor,
	selectedGroupColor,
	groupColor,
	groupLabelDarkColor,
	groupLabelLightColor,
	withBorder = false,
	highlightActiveItem = true,
	onMenuItemClick,
}: RailSidebarContentProps & { skeletonGroupCount?: number }) {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();
	const {
		collapsed,
		toggleCollapsed,
		activeGroup,
		setActiveGroup,
	} = useSidebar();

	// Cores do sidebar
	const backgroundColor = colorScheme === 'dark'
		? (backgroundDarkColor ?? theme.colors.dark[7])
		: (backgroundLightColor ?? theme.white);

	const textColor = colorScheme === 'dark'
		? (textDarkColor ?? theme.colors.gray[3])
		: (textLightColor ?? theme.colors.gray[7]);

	const iconColor = colorScheme === 'dark'
		? (iconDarkColor ?? theme.colors[theme.primaryColor][4])
		: (iconLightColor ?? theme.colors[theme.primaryColor][6]);

	// Cor de hover dos items - usa activeColor ou deriva do background
	const itemHoverColor = activeColor
		? theme.colors[activeColor]?.[6] ?? theme.colors[theme.primaryColor][6]
		: theme.colors[theme.primaryColor][6];

	// Cores dos grupos
	const groupBgColor = groupBackgroundColor
		? groupBackgroundColor
		: colorScheme === 'dark'
			? theme.colors[theme.primaryColor][6]
			: theme.colors[theme.primaryColor][7];

	const selectedGroupBgColor = selectedGroupColor
		? selectedGroupColor
		: colorScheme === 'dark'
			? theme.colors[theme.primaryColor][8]
			: theme.colors[theme.primaryColor][0];

	// Hook de navegação
	const { navigateToItem, isItemActive } = useSidebarNavigation({
		navigationData,
		onMenuItemClick,
	});

	// Hook de teclado
	useSidebarKeyboard({
		navigationData,
		navigateToItem,
		onToggleSidebar: toggleCollapsed,
		enabled: true,
	});

	// Extrair grupos únicos dos items
	const groups = useMemo(() => {
		const groupMap = new Map<string, {
			group: ArchbaseNavigationGroup;
			items: ArchbaseNavigationItem[];
		}>();

		navigationData.forEach((item) => {
			if (!item.showInSidebar) return;
			const isDisabled = typeof item.disabled === 'function' ? item.disabled() : item.disabled;
			if (isDisabled && item.hideDisabledItem) return;

			// Criar grupo default se não tiver grupo
			const itemGroup = item.group ?? {
				icon: defaultGroupIcon ?? <IconDots size="2.2rem" stroke={1} />,
				label: 'Default',
				name: 'Default',
				hint: 'Default',
				indexOrder: 0,
			};

			const existing = groupMap.get(itemGroup.name);
			if (existing) {
				existing.items.push(item);
			} else {
				groupMap.set(itemGroup.name, {
					group: itemGroup,
					items: [item],
				});
			}
		});

		// Ordenar por indexOrder
		return Array.from(groupMap.values()).sort((a, b) => a.group.indexOrder - b.group.indexOrder);
	}, [navigationData, defaultGroupIcon]);

	// Definir grupo ativo inicial
	useEffect(() => {
		if (!activeGroup && groups.length > 0) {
			setActiveGroup(groups[0].group.name);
		}
	}, [activeGroup, groups, setActiveGroup]);

	// Items do grupo ativo
	const activeGroupItems = useMemo(() => {
		const found = groups.find((g) => g.group.name === activeGroup);
		return found?.items ?? [];
	}, [groups, activeGroup]);

	// Handler de clique no grupo
	const handleGroupClick = useCallback((groupName: string) => {
		if (collapsed) {
			// Se colapsado, expandir e selecionar grupo
			toggleCollapsed();
			setActiveGroup(groupName);
		} else if (activeGroup === groupName) {
			// Se clicou no mesmo grupo, colapsar
			toggleCollapsed();
		} else {
			// Selecionar novo grupo
			setActiveGroup(groupName);
		}
	}, [collapsed, activeGroup, toggleCollapsed, setActiveGroup]);

	// Largura do menu (não inclui coluna de grupos)
	const menuWidth = collapsed ? 0 : Number(px(width)) - Number(px(groupColumnWidth));

	// Renderizar coluna de grupos
	const renderGroupColumn = () => {
		if (isLoading && groups.length === 0) {
			return (
				<SidebarGroupsSkeleton
					groupCount={skeletonGroupCount}
					width={groupColumnWidth}
					backgroundColor={groupBgColor}
				/>
			);
		}

		if (groups.length <= 1) {
			return null;
		}

		return (
			<Stack
				gap={4}
				p={4}
				align="center"
				style={{
					width: groupColumnWidth,
					height: '100%',
					backgroundColor: groupBgColor,
					flexShrink: 0,
				}}
			>
				{groups.map((g) => (
					<SidebarGroupIcon
						key={g.group.name}
						group={g.group}
						active={g.group.name === activeGroup}
						onClick={() => handleGroupClick(g.group.name)}
						showLabel={showGroupLabels}
						activeColor={selectedGroupBgColor}
						inactiveColor={groupColor}
					/>
				))}
			</Stack>
		);
	};

	// Renderizar conteúdo do menu
	const renderMenuContent = () => {
		// Erro
		if (loadingError) {
			if (errorComponent) return errorComponent;
			return <SidebarErrorMessage message={loadingError} backgroundColor={backgroundColor} />;
		}

		// Loading
		if (isLoading) {
			if (loadingComponent) return loadingComponent;
			return (
				<SidebarMenuSkeleton
					itemCount={skeletonItemCount}
					collapsed={false}
					backgroundColor={backgroundColor}
					showGroups={false}
				/>
			);
		}

		// Items do grupo ativo
		return (
			<Stack gap={2}>
				{activeGroupItems.map((item, index) => (
					<SidebarItem
						key={index}
						item={item}
						collapsed={false}
						active={highlightActiveItem && isItemActive(item)}
						onClick={navigateToItem}
						textColor={textColor}
						iconColor={iconColor}
						hoverColor={itemHoverColor}
					/>
				))}
			</Stack>
		);
	};

	const borderColor = colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2];

	// Se só tem um grupo, renderizar como Standard
	if (groups.length <= 1) {
		return (
			<Flex direction="column" w={collapsed ? collapsedWidth : width} h="100%" style={{ backgroundColor }}>
				{header && <Box style={{ width: '100%', flexShrink: 0 }}>{header}</Box>}
				<Box
					style={{
						flex: 1,
						width: '100%',
						backgroundColor,
						display: 'flex',
						flexDirection: 'column',
						overflow: 'hidden',
						borderRight: withBorder ? `1px solid ${borderColor}` : undefined,
					}}
				>
					<ScrollArea style={{ flex: 1 }} scrollbarSize={6} type="hover">
						<Box p="xs">
							{collapsed ? (
								<Stack gap="xs" align="center">
									{navigationData
										.filter((item) => {
											if (!item.showInSidebar) return false;
											const isDisabled = typeof item.disabled === 'function' ? item.disabled() : item.disabled;
											return !(isDisabled && item.hideDisabledItem);
										})
										.map((item, index) => (
											<SidebarItem
												key={index}
												item={item}
												collapsed={true}
												active={highlightActiveItem && isItemActive(item)}
												onClick={navigateToItem}
												textColor={textColor}
												iconColor={iconColor}
												hoverColor={itemHoverColor}
											/>
										))}
								</Stack>
							) : (
								renderMenuContent()
							)}
						</Box>
					</ScrollArea>
				</Box>
				{footer && <Box style={{ width: '100%', backgroundColor, flexShrink: 0 }}>{footer}</Box>}
			</Flex>
		);
	}

	// Layout com múltiplos grupos
	return (
		<Flex direction="column" w={collapsed ? groupColumnWidth : width} h="100%" style={{ backgroundColor }}>
			{header && <Box style={{ width: '100%', flexShrink: 0 }}>{header}</Box>}
			<Box
				style={{
					flex: 1,
					width: '100%',
					display: 'flex',
					overflow: 'hidden',
					borderRight: withBorder ? `1px solid ${borderColor}` : undefined,
				}}
			>
				{/* Coluna de grupos */}
				{renderGroupColumn()}

				{/* Menu do grupo ativo */}
				<Box
					style={{
						width: collapsed ? 0 : menuWidth,
						height: '100%',
						backgroundColor,
						overflow: 'hidden',
						transition: 'width 200ms ease',
						borderLeft: groups.length > 1 ? `1px solid ${colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}` : undefined,
					}}
				>
					{!collapsed && activeGroup && (
						<ScrollArea style={{ height: '100%' }} scrollbarSize={6} type="hover">
							<Box p="xs">
								{renderMenuContent()}
							</Box>
						</ScrollArea>
					)}
				</Box>
			</Box>
			{footer && <Box style={{ width: '100%', backgroundColor, flexShrink: 0 }}>{footer}</Box>}
		</Flex>
	);
}

/**
 * RailSidebar - Variante com coluna de grupos (Double Panel)
 *
 * Características:
 * - Coluna de ícones de grupos à esquerda
 * - Painel de menu detalhado à direita
 * - Transição suave entre grupos
 * - Suporte a múltiplos grupos de navegação
 *
 * Inspiração: Discord, Supabase, ArchbaseAdvancedSidebar atual
 */
export function RailSidebar(props: Omit<ArchbaseMantineSidebarProps, 'variant'>) {
	const {
		navigationData,
		collapsed,
		defaultCollapsed,
		onCollapsedChange,
		activeGroup,
		defaultActiveGroup,
		onActiveGroupChange,
		showKeyboardShortcuts,
		highlightActiveItem,
		onMenuItemClick,
	} = props;

	return (
		<SidebarProvider
			navigationData={navigationData}
			variant="rail"
			collapsed={collapsed}
			defaultCollapsed={defaultCollapsed}
			onCollapsedChange={onCollapsedChange}
			activeGroup={activeGroup}
			defaultActiveGroup={defaultActiveGroup}
			onActiveGroupChange={onActiveGroupChange}
			showKeyboardShortcuts={showKeyboardShortcuts}
			highlightActiveItem={highlightActiveItem}
			onMenuItemClick={onMenuItemClick}
		>
			<RailSidebarContent {...props} />
		</SidebarProvider>
	);
}
