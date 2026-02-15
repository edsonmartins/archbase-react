import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useUncontrolled } from '@mantine/hooks';
import { ArchbaseNavigationItem } from '../../types';
import { SidebarContextValue, SidebarProviderProps, SidebarVariant } from '../types';

const SidebarContext = createContext<SidebarContextValue | null>(null);

/**
 * Hook para acessar o contexto do Sidebar
 */
export function useSidebar(): SidebarContextValue {
	const context = useContext(SidebarContext);
	if (!context) {
		throw new Error('useSidebar must be used within a SidebarProvider');
	}
	return context;
}

/**
 * Hook opcional que não lança erro se usado fora do provider
 */
export function useSidebarOptional(): SidebarContextValue | null {
	return useContext(SidebarContext);
}

/**
 * Provider do contexto do Sidebar
 */
export function SidebarProvider({
	children,
	navigationData,
	variant = 'standard',
	defaultCollapsed = false,
	collapsed: controlledCollapsed,
	onCollapsedChange,
	defaultActiveGroup = '',
	activeGroup: controlledActiveGroup,
	onActiveGroupChange,
	showKeyboardShortcuts = false,
	highlightActiveItem = true,
	onMenuItemClick,
}: SidebarProviderProps) {
	const location = useLocation();
	const navigate = useNavigate();

	// Estado de colapso (controlado ou não controlado)
	const [collapsed, setCollapsed] = useUncontrolled({
		value: controlledCollapsed,
		defaultValue: defaultCollapsed,
		finalValue: false,
		onChange: onCollapsedChange,
	});

	// Estado do grupo ativo (controlado ou não controlado)
	const [activeGroup, setActiveGroup] = useUncontrolled({
		value: controlledActiveGroup,
		defaultValue: defaultActiveGroup,
		finalValue: '',
		onChange: onActiveGroupChange,
	});

	// Estado de busca
	const [searchQuery, setSearchQuery] = useState('');

	// Estado dos grupos expandidos
	const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
		// Inicializar com grupos que têm items com initiallyOpened = true
		const initialExpanded = new Set<string>();
		navigationData.forEach((item, index) => {
			if (item.initiallyOpened && item.links && item.links.length > 0) {
				initialExpanded.add(`group-${index}`);
			}
		});
		return initialExpanded;
	});

	// Caminho ativo atual
	const activeItemPath = location.pathname;

	// Toggle do estado de colapso
	const toggleCollapsed = useCallback(() => {
		setCollapsed(!collapsed);
	}, [collapsed, setCollapsed]);

	// Funções para manipular grupos expandidos
	const toggleGroup = useCallback((groupId: string) => {
		setExpandedGroups((prev) => {
			const next = new Set(prev);
			if (next.has(groupId)) {
				next.delete(groupId);
			} else {
				next.add(groupId);
			}
			return next;
		});
	}, []);

	const expandGroup = useCallback((groupId: string) => {
		setExpandedGroups((prev) => {
			const next = new Set(prev);
			next.add(groupId);
			return next;
		});
	}, []);

	const collapseGroup = useCallback((groupId: string) => {
		setExpandedGroups((prev) => {
			const next = new Set(prev);
			next.delete(groupId);
			return next;
		});
	}, []);

	// Filtrar items pela busca
	const filteredItems = useMemo(() => {
		if (!searchQuery.trim()) {
			return navigationData;
		}

		const normalizedQuery = searchQuery.toLowerCase().trim();

		const filterItems = (items: ArchbaseNavigationItem[]): ArchbaseNavigationItem[] => {
			return items.reduce<ArchbaseNavigationItem[]>((acc, item) => {
				const labelMatches = item.label.toLowerCase().includes(normalizedQuery);
				const filteredLinks = item.links ? filterItems(item.links) : [];

				if (labelMatches || filteredLinks.length > 0) {
					acc.push({
						...item,
						links: filteredLinks.length > 0 ? filteredLinks : item.links,
						// Expandir automaticamente quando há match em subitens
						initiallyOpened: filteredLinks.length > 0 || labelMatches,
					});
				}

				return acc;
			}, []);
		};

		return filterItems(navigationData);
	}, [navigationData, searchQuery]);

	// Navegar para um item
	const navigateToItem = useCallback(
		(item: ArchbaseNavigationItem) => {
			// Chamar callback externo se fornecido
			if (onMenuItemClick) {
				onMenuItemClick(item);
			}

			// Navegar se o item tiver link
			if (item.link) {
				if (item.routeParams) {
					navigate(item.link, { state: item.routeParams });
				} else {
					navigate(item.link);
				}
			}

			// Seguir redirect se houver
			if (item.redirect) {
				navigate(item.redirect);
			}
		},
		[navigate, onMenuItemClick],
	);

	// Valor do contexto
	const contextValue = useMemo<SidebarContextValue>(
		() => ({
			collapsed,
			setCollapsed,
			toggleCollapsed,
			activeGroup,
			setActiveGroup,
			activeItemPath,
			navigateToItem,
			searchQuery,
			setSearchQuery,
			filteredItems,
			expandedGroups,
			toggleGroup,
			expandGroup,
			collapseGroup,
			variant,
			showKeyboardShortcuts,
			highlightActiveItem,
		}),
		[
			collapsed,
			setCollapsed,
			toggleCollapsed,
			activeGroup,
			setActiveGroup,
			activeItemPath,
			navigateToItem,
			searchQuery,
			filteredItems,
			expandedGroups,
			toggleGroup,
			expandGroup,
			collapseGroup,
			variant,
			showKeyboardShortcuts,
			highlightActiveItem,
		],
	);

	return <SidebarContext.Provider value={contextValue}>{children}</SidebarContext.Provider>;
}

export { SidebarContext };
