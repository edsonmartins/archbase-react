import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { ArchbaseNavigationItem } from '../../types';

export interface UseSidebarNavigationOptions {
	navigationData: ArchbaseNavigationItem[];
	onMenuItemClick?: (item: ArchbaseNavigationItem) => void;
}

export interface UseSidebarNavigationReturn {
	/** Item atualmente ativo baseado na rota */
	activeItem: ArchbaseNavigationItem | null;
	/** Caminho da rota atual */
	currentPath: string;
	/** Navegar para um item */
	navigateToItem: (item: ArchbaseNavigationItem) => void;
	/** Verificar se um item está ativo */
	isItemActive: (item: ArchbaseNavigationItem) => boolean;
	/** Verificar se um item ou algum de seus filhos está ativo */
	isItemOrChildActive: (item: ArchbaseNavigationItem) => boolean;
	/** Encontrar o caminho de breadcrumb até o item ativo */
	activeBreadcrumb: ArchbaseNavigationItem[];
}

/**
 * Hook para gerenciar a navegação do sidebar
 * Integra com React Router para detectar rota ativa
 */
export function useSidebarNavigation({
	navigationData,
	onMenuItemClick,
}: UseSidebarNavigationOptions): UseSidebarNavigationReturn {
	const location = useLocation();
	const navigate = useNavigate();
	const currentPath = location.pathname;

	// Encontrar item ativo baseado na rota atual
	const findActiveItem = useCallback(
		(items: ArchbaseNavigationItem[]): ArchbaseNavigationItem | null => {
			for (const item of items) {
				if (item.link === currentPath) {
					return item;
				}
				if (item.links) {
					const found = findActiveItem(item.links);
					if (found) return found;
				}
			}
			return null;
		},
		[currentPath],
	);

	const activeItem = useMemo(() => findActiveItem(navigationData), [findActiveItem, navigationData]);

	// Verificar se um item específico está ativo
	const isItemActive = useCallback(
		(item: ArchbaseNavigationItem): boolean => {
			return item.link === currentPath;
		},
		[currentPath],
	);

	// Verificar se um item ou algum de seus filhos está ativo
	const isItemOrChildActive = useCallback(
		(item: ArchbaseNavigationItem): boolean => {
			if (item.link === currentPath) {
				return true;
			}
			if (item.links) {
				return item.links.some((child) => isItemOrChildActive(child));
			}
			return false;
		},
		[currentPath],
	);

	// Encontrar breadcrumb até o item ativo
	const activeBreadcrumb = useMemo(() => {
		const breadcrumb: ArchbaseNavigationItem[] = [];

		const findPath = (items: ArchbaseNavigationItem[], path: ArchbaseNavigationItem[]): boolean => {
			for (const item of items) {
				const newPath = [...path, item];
				if (item.link === currentPath) {
					breadcrumb.push(...newPath);
					return true;
				}
				if (item.links && findPath(item.links, newPath)) {
					return true;
				}
			}
			return false;
		};

		findPath(navigationData, []);
		return breadcrumb;
	}, [navigationData, currentPath]);

	// Navegar para um item
	const navigateToItem = useCallback(
		(item: ArchbaseNavigationItem) => {
			// Verificar se item está desabilitado
			const isDisabled = typeof item.disabled === 'function' ? item.disabled() : item.disabled;
			if (isDisabled) {
				return;
			}

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

	return {
		activeItem,
		currentPath,
		navigateToItem,
		isItemActive,
		isItemOrChildActive,
		activeBreadcrumb,
	};
}
