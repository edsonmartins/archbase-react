import React from 'react';
import {
	Box,
	ScrollArea,
	Stack,
	ActionIcon,
	Tooltip,
	Menu,
	Divider,
	useMantineTheme,
	useMantineColorScheme,
	px,
} from '@mantine/core';
import { ArchbaseNavigationItem } from '../../types';
import { ArchbaseMantineSidebarProps } from '../types';
import { SidebarProvider, useSidebar } from '../context';
import { SidebarMenuSkeleton, SidebarErrorMessage } from '../components/SidebarSkeleton';
import { useSidebarNavigation } from '../hooks/useSidebarNavigation';
import { useSidebarKeyboard } from '../hooks/useSidebarKeyboard';
import { archbaseI18next } from '@archbase/core';

interface MinimalSidebarContentProps extends Omit<ArchbaseMantineSidebarProps, 'variant'> {}

/**
 * Componente de item minimal (apenas ícone)
 */
function MinimalSidebarItem({
	item,
	active,
	onClick,
	iconColor,
	activeColor,
}: {
	item: ArchbaseNavigationItem;
	active: boolean;
	onClick: (item: ArchbaseNavigationItem) => void;
	iconColor: string;
	activeColor: string;
}) {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();

	const isDisabled = typeof item.disabled === 'function' ? item.disabled() : item.disabled;

	if (isDisabled && item.hideDisabledItem) {
		return null;
	}

	if (!item.showInSidebar) {
		return null;
	}

	const translatedLabel = archbaseI18next.t(item.label);

	// Se tem subitems, renderizar como Menu
	if (item.links && item.links.length > 0) {
		const visibleLinks = item.links.filter((link) => {
			const linkDisabled = typeof link.disabled === 'function' ? link.disabled() : link.disabled;
			return link.showInSidebar && (!linkDisabled || !link.hideDisabledItem);
		});

		if (visibleLinks.length === 0) {
			return null;
		}

		return (
			<Menu
				position="right-start"
				withArrow
				shadow="md"
				trigger="hover"
				openDelay={100}
				closeDelay={200}
			>
				<Menu.Target>
					<Tooltip label={translatedLabel} position="right" withArrow>
						<ActionIcon
							size="xl"
							variant={active ? 'filled' : 'subtle'}
							color={active ? activeColor : undefined}
							disabled={isDisabled}
							style={{
								opacity: isDisabled ? 0.5 : 1,
							}}
						>
							<Box style={{ color: active ? 'white' : iconColor }}>
								{item.icon}
							</Box>
						</ActionIcon>
					</Tooltip>
				</Menu.Target>
				<Menu.Dropdown>
					<Menu.Label>{translatedLabel}</Menu.Label>
					{visibleLinks.map((link, index) => {
						const linkDisabled = typeof link.disabled === 'function' ? link.disabled() : link.disabled;
						return (
							<Menu.Item
								key={index}
								leftSection={link.icon}
								disabled={linkDisabled}
								onClick={() => onClick(link)}
							>
								{archbaseI18next.t(link.label)}
							</Menu.Item>
						);
					})}
				</Menu.Dropdown>
			</Menu>
		);
	}

	// Item simples
	return (
		<Tooltip label={translatedLabel} position="right" withArrow>
			<ActionIcon
				size="xl"
				variant={active ? 'filled' : 'subtle'}
				color={active ? activeColor : undefined}
				disabled={isDisabled}
				onClick={() => onClick(item)}
				style={{
					opacity: isDisabled ? 0.5 : 1,
				}}
			>
				<Box style={{ color: active ? 'white' : iconColor }}>
					{item.icon}
				</Box>
			</ActionIcon>
		</Tooltip>
	);
}

/**
 * Conteúdo interno do MinimalSidebar
 */
function MinimalSidebarContent({
	navigationData,
	width = 60,
	height = '100%',
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
	iconDarkColor,
	iconLightColor,
	activeColor,
	withBorder = true,
	withShadow = false,
	highlightActiveItem = true,
	onMenuItemClick,
}: MinimalSidebarContentProps) {
	const theme = useMantineTheme();
	const { colorScheme } = useMantineColorScheme();
	const { toggleCollapsed } = useSidebar();

	// Cores
	const backgroundColor = colorScheme === 'dark'
		? (backgroundDarkColor ?? theme.colors.dark[7])
		: (backgroundLightColor ?? theme.white);

	const iconColor = colorScheme === 'dark'
		? (iconDarkColor ?? theme.colors[theme.primaryColor][4])
		: (iconLightColor ?? theme.colors[theme.primaryColor][6]);

	const computedActiveColor = activeColor ?? theme.primaryColor;

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

	// Filtrar items visíveis
	const visibleItems = navigationData.filter((item) => {
		if (!item.showInSidebar) return false;
		const isDisabled = typeof item.disabled === 'function' ? item.disabled() : item.disabled;
		if (isDisabled && item.hideDisabledItem) return false;
		return true;
	});

	// Renderizar conteúdo
	const renderContent = () => {
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
					collapsed={true}
					backgroundColor={backgroundColor}
				/>
			);
		}

		return (
			<Stack gap="xs" align="center">
				{visibleItems.map((item, index) => (
					<MinimalSidebarItem
						key={index}
						item={item}
						active={highlightActiveItem && (isItemActive(item) || isItemOrChildActive(item))}
						onClick={navigateToItem}
						iconColor={iconColor}
						activeColor={computedActiveColor}
					/>
				))}
			</Stack>
		);
	};

	const borderColor = colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2];

	return (
		<Box
			style={{
				width: px(width),
				height: px(height),
				backgroundColor,
				display: 'flex',
				flexDirection: 'column',
				overflow: 'hidden',
				boxShadow: withShadow ? theme.shadows.sm : undefined,
				borderRight: withBorder ? `1px solid ${borderColor}` : undefined,
			}}
		>
			{/* Header */}
			{header && (
				<Box
					style={{
						flexShrink: 0,
						display: 'flex',
						justifyContent: 'center',
						padding: theme.spacing.xs,
					}}
				>
					{header}
				</Box>
			)}

			{header && <Divider />}

			{/* Menu Content */}
			<ScrollArea
				style={{ flex: 1 }}
				scrollbarSize={4}
				type="hover"
			>
				<Box p="xs">
					{renderContent()}
				</Box>
			</ScrollArea>

			{/* Footer */}
			{footer && (
				<>
					<Divider />
					<Box
						style={{
							flexShrink: 0,
							height: footerHeight,
							display: 'flex',
							justifyContent: 'center',
							padding: theme.spacing.xs,
						}}
					>
						{footer}
					</Box>
				</>
			)}
		</Box>
	);
}

/**
 * MinimalSidebar - Variante minimal/icon-only do sidebar
 *
 * Características:
 * - Exibe apenas ícones
 * - Tooltips com labels no hover
 * - Submenus em Menu flutuante (popover)
 * - Ideal para economizar espaço
 *
 * Inspiração: VSCode, Outlook Web
 */
export function MinimalSidebar(props: Omit<ArchbaseMantineSidebarProps, 'variant'>) {
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
			variant="minimal"
			collapsed={collapsed}
			defaultCollapsed={defaultCollapsed}
			onCollapsedChange={onCollapsedChange}
			showKeyboardShortcuts={showKeyboardShortcuts}
			highlightActiveItem={highlightActiveItem}
			onMenuItemClick={onMenuItemClick}
		>
			<MinimalSidebarContent {...props} />
		</SidebarProvider>
	);
}
