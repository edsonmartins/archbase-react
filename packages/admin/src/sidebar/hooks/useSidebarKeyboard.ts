import { useMemo, useCallback } from 'react';
import { useHotkeys } from '@mantine/hooks';
import { ArchbaseNavigationItem } from '../../types';
import { ExtendedNavigationItem } from '../types';

export interface UseSidebarKeyboardOptions {
	navigationData: ArchbaseNavigationItem[];
	navigateToItem: (item: ArchbaseNavigationItem) => void;
	onToggleSidebar?: () => void;
	enabled?: boolean;
}

export interface UseSidebarKeyboardReturn {
	/** Mapa de atalhos registrados */
	shortcuts: Map<string, ArchbaseNavigationItem>;
	/** Verificar se um item tem atalho */
	hasShortcut: (item: ArchbaseNavigationItem) => boolean;
	/** Obter atalho de um item */
	getShortcut: (item: ArchbaseNavigationItem) => string | undefined;
}

/**
 * Converte um atalho no formato do usuário para o formato do Mantine
 * Ex: "Ctrl+Shift+H" -> "mod+shift+h"
 */
function normalizeShortcut(shortcut: string): string {
	return shortcut
		.toLowerCase()
		.replace('ctrl+', 'mod+')
		.replace('cmd+', 'mod+')
		.replace('control+', 'mod+');
}

/**
 * Hook para gerenciar atalhos de teclado do sidebar
 * Registra hotkeys globais para navegação rápida
 */
export function useSidebarKeyboard({
	navigationData,
	navigateToItem,
	onToggleSidebar,
	enabled = true,
}: UseSidebarKeyboardOptions): UseSidebarKeyboardReturn {
	// Coletar todos os atalhos definidos nos items
	const shortcuts = useMemo(() => {
		const map = new Map<string, ArchbaseNavigationItem>();

		const collectShortcuts = (items: ArchbaseNavigationItem[]) => {
			items.forEach((item) => {
				const extendedItem = item as ExtendedNavigationItem;
				if (extendedItem.shortcut) {
					map.set(extendedItem.shortcut, item);
				}
				if (item.links) {
					collectShortcuts(item.links);
				}
			});
		};

		collectShortcuts(navigationData);
		return map;
	}, [navigationData]);

	// Verificar se um item tem atalho
	const hasShortcut = useCallback(
		(item: ArchbaseNavigationItem): boolean => {
			const extendedItem = item as ExtendedNavigationItem;
			return !!extendedItem.shortcut;
		},
		[],
	);

	// Obter atalho de um item
	const getShortcut = useCallback(
		(item: ArchbaseNavigationItem): string | undefined => {
			const extendedItem = item as ExtendedNavigationItem;
			return extendedItem.shortcut;
		},
		[],
	);

	// Criar handlers para hotkeys
	const hotkeyHandlers = useMemo(() => {
		if (!enabled) return [];

		const handlers: Array<[string, () => void]> = [];

		// Adicionar atalho para toggle do sidebar
		if (onToggleSidebar) {
			handlers.push(['mod+b', onToggleSidebar]);
		}

		// Adicionar atalhos dos items
		shortcuts.forEach((item, shortcut) => {
			const normalizedShortcut = normalizeShortcut(shortcut);
			handlers.push([
				normalizedShortcut,
				() => {
					// Verificar se item não está desabilitado
					const isDisabled = typeof item.disabled === 'function' ? item.disabled() : item.disabled;
					if (!isDisabled) {
						navigateToItem(item);
					}
				},
			]);
		});

		return handlers;
	}, [enabled, shortcuts, navigateToItem, onToggleSidebar]);

	// Registrar hotkeys
	useHotkeys(hotkeyHandlers);

	return {
		shortcuts,
		hasShortcut,
		getShortcut,
	};
}
