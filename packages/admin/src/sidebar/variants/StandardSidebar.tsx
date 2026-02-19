import React, { useMemo } from 'react';
import {
	Box,
	ScrollArea,
	Stack,
	TextInput,
	Divider,
	Transition,
	useMantineTheme,
	useMantineColorScheme,
	px,
} from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { ArchbaseNavigationItem } from '../../types';
import { ArchbaseMantineSidebarProps } from '../types';
import { SidebarProvider, useSidebar } from '../context';
import { SidebarItem } from '../components/SidebarItem';
import { SidebarGroup } from '../components/SidebarGroup';
import {
	SidebarMenuSkeleton,
	SidebarErrorMessage,
} from '../components/SidebarSkeleton';
import { useSidebarSearch } from '../hooks/useSidebarSearch';
import { useSidebarNavigation } from '../hooks/useSidebarNavigation';
import { useSidebarKeyboard } from '../hooks/useSidebarKeyboard';

interface StandardSidebarContentProps extends Omit<ArchbaseMantineSidebarProps, 'variant'> {}

/**
 * Conteúdo interno do StandardSidebar (dentro do Provider)
 */
function StandardSidebarContent({
	navigationData,
	width = 280,
	collapsedWidth = 60,
	height = '100%',
	showSearch = false,
	searchPlaceholder = 'Buscar...',
	onSearch,
	header,
	footer,
	footerHeight,
	isLoading = false,
	loadingError,
	loadingComponent,
	errorComponent,
	skeletonItemCount = 8,
	backgroundDarkColor,
	backgroundLightColor,
	textDarkColor,
	textLightColor,
	iconDarkColor,
	iconLightColor,
	activeColor,
	withBorder = true,
	withShadow = false,
	highlightActiveItem = true,
	onMenuItemClick,
}: StandardSidebarContentProps) {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();
	const { collapsed, toggleCollapsed } = useSidebar();

	// Cores baseadas no tema
	const backgroundColor = colorScheme === 'dark'
		? (backgroundDarkColor ?? theme.colors.dark[7])
		: (backgroundLightColor ?? theme.white);

	const textColor = colorScheme === 'dark'
		? (textDarkColor ?? theme.colors.gray[3])
		: (textLightColor ?? theme.colors.gray[7]);

	const iconColor = colorScheme === 'dark'
		? (iconDarkColor ?? theme.colors[theme.primaryColor][4])
		: (iconLightColor ?? theme.colors[theme.primaryColor][6]);

	// Cor de hover dos items - usa activeColor ou deriva do primaryColor
	const itemHoverColor = activeColor
		? theme.colors[activeColor]?.[6] ?? theme.colors[theme.primaryColor][6]
		: theme.colors[theme.primaryColor][6];

	// Hook de busca
	const {
		query: searchQuery,
		setQuery: setSearchQuery,
		filteredItems,
		isSearching,
		clearSearch,
	} = useSidebarSearch({
		navigationData,
		onSearch,
	});

	// Hook de navegação
	const { navigateToItem, isItemActive, isItemOrChildActive } = useSidebarNavigation({
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

	// Largura atual baseada no estado de colapso
	const currentWidth = collapsed ? collapsedWidth : width;

	// Agrupar items por categoria/grupo
	const groupedItems = useMemo(() => {
		const groups = new Map<string, ArchbaseNavigationItem[]>();
		const ungrouped: ArchbaseNavigationItem[] = [];

		filteredItems.forEach((item) => {
			if (!item.showInSidebar) return;
			const isDisabled = typeof item.disabled === 'function' ? item.disabled() : item.disabled;
			if (isDisabled && item.hideDisabledItem) return;

			if (item.category) {
				const existing = groups.get(item.category) || [];
				existing.push(item);
				groups.set(item.category, existing);
			} else {
				ungrouped.push(item);
			}
		});

		return { groups, ungrouped };
	}, [filteredItems]);

	// Renderizar conteúdo do menu
	const renderMenuContent = () => {
		// Erro de carregamento
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
					collapsed={collapsed}
					backgroundColor={backgroundColor}
					showGroups={!collapsed}
				/>
			);
		}

		// Items sem grupo
		const renderUngroupedItems = () => {
			return groupedItems.ungrouped.map((item, index) => (
				<SidebarItem
					key={`item-${index}`}
					item={item}
					collapsed={collapsed}
					active={highlightActiveItem && isItemActive(item)}
					onClick={navigateToItem}
					textColor={textColor}
					iconColor={iconColor}
					hoverColor={itemHoverColor}
				/>
			));
		};

		// Items agrupados
		const renderGroupedItems = () => {
			const entries = Array.from(groupedItems.groups.entries());
			return entries.map(([category, items], groupIndex) => (
				<SidebarGroup
					key={`group-${groupIndex}`}
					label={category}
					groupId={`group-${groupIndex}`}
					defaultExpanded={true}
				>
					{items.map((item, itemIndex) => (
						<SidebarItem
							key={`group-${groupIndex}-item-${itemIndex}`}
							item={item}
							collapsed={collapsed}
							active={highlightActiveItem && isItemActive(item)}
							onClick={navigateToItem}
							textColor={textColor}
							iconColor={iconColor}
						/>
					))}
				</SidebarGroup>
			));
		};

		// Se colapsado, não mostrar grupos
		if (collapsed) {
			return (
				<Stack gap={2}>
					{groupedItems.ungrouped.map((item, index) => (
						<SidebarItem
							key={`item-${index}`}
							item={item}
							collapsed={true}
							active={highlightActiveItem && isItemActive(item)}
							onClick={navigateToItem}
							textColor={textColor}
							iconColor={iconColor}
						/>
					))}
					{Array.from(groupedItems.groups.values()).flat().map((item, index) => (
						<SidebarItem
							key={`grouped-item-${index}`}
							item={item}
							collapsed={true}
							active={highlightActiveItem && isItemActive(item)}
							onClick={navigateToItem}
							textColor={textColor}
							iconColor={iconColor}
						/>
					))}
				</Stack>
			);
		}

		// Conteúdo normal
		return (
			<Stack gap="xs">
				{groupedItems.ungrouped.length > 0 && (
					<Stack gap={2}>
						{renderUngroupedItems()}
					</Stack>
				)}
				{groupedItems.groups.size > 0 && groupedItems.ungrouped.length > 0 && (
					<Divider my="xs" />
				)}
				{renderGroupedItems()}
			</Stack>
		);
	};

	return (
		<Transition
			mounted={true}
			transition="slide-right"
			duration={200}
			timingFunction="ease"
		>
			{(styles) => (
				<Box
					style={{
						...styles,
						width: px(currentWidth),
						height: typeof height === 'number' ? px(height) : height,
						minHeight: typeof height === 'number' ? px(height) : height,
						backgroundColor,
						display: 'flex',
						flexDirection: 'column',
						overflow: 'hidden',
						transition: 'width 200ms ease',
						borderRight: withBorder ? `1px solid ${colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}` : undefined,
						boxShadow: withShadow ? theme.shadows.sm : undefined,
					}}
				>
					{/* Header */}
					{header && (
						<Box style={{ flexShrink: 0 }}>
							{header}
						</Box>
					)}

					{/* Search */}
					{showSearch && !collapsed && (
						<Box p="sm" style={{ flexShrink: 0 }}>
							<TextInput
								placeholder={searchPlaceholder}
								leftSection={<IconSearch size={16} />}
								rightSection={
									isSearching ? (
										<IconX
											size={16}
											style={{ cursor: 'pointer' }}
											onClick={clearSearch}
										/>
									) : null
								}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.currentTarget.value)}
								size="sm"
							/>
						</Box>
					)}

					{/* Menu Content - ScrollArea ocupa todo espaço disponível */}
					<ScrollArea
						style={{ flex: 1 }}
						scrollbarSize={6}
						type="hover"
						offsetScrollbars
					>
						<Box p="xs">
							{renderMenuContent()}
						</Box>
					</ScrollArea>

					{/* Footer - sempre fixo na parte inferior */}
					{footer && (
						<Box
							style={{
								flexShrink: 0,
								height: footerHeight,
								backgroundColor,
								borderTop: withBorder ? `1px solid ${colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]}` : undefined,
							}}
						>
							{footer}
						</Box>
					)}
				</Box>
			)}
		</Transition>
	);
}

/**
 * StandardSidebar - Variante padrão do sidebar
 *
 * Características:
 * - Menu com seções accordion
 * - Suporte a nested menus (até 2+ níveis)
 * - Header/Footer customizáveis
 * - Search integrado
 * - Collapse/expand com transição suave
 */
export function StandardSidebar(props: Omit<ArchbaseMantineSidebarProps, 'variant'>) {
	const {
		navigationData,
		collapsed,
		defaultCollapsed,
		onCollapsedChange,
		showKeyboardShortcuts,
		highlightActiveItem,
		onMenuItemClick,
	} = props;

	return (
		<SidebarProvider
			navigationData={navigationData}
			variant="standard"
			collapsed={collapsed}
			defaultCollapsed={defaultCollapsed}
			onCollapsedChange={onCollapsedChange}
			showKeyboardShortcuts={showKeyboardShortcuts}
			highlightActiveItem={highlightActiveItem}
			onMenuItemClick={onMenuItemClick}
		>
			<StandardSidebarContent {...props} />
		</SidebarProvider>
	);
}
