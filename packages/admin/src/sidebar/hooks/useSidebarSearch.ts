import { useState, useMemo, useCallback } from 'react';
import { ArchbaseNavigationItem } from '../../types';

export interface UseSidebarSearchOptions {
	navigationData: ArchbaseNavigationItem[];
	onSearch?: (query: string, results: ArchbaseNavigationItem[]) => void;
}

export interface UseSidebarSearchReturn {
	/** Query de busca atual */
	query: string;
	/** Definir query de busca */
	setQuery: (value: string) => void;
	/** Limpar busca */
	clearSearch: () => void;
	/** Items filtrados */
	filteredItems: ArchbaseNavigationItem[];
	/** Se há resultados */
	hasResults: boolean;
	/** Se a busca está ativa (query não vazia) */
	isSearching: boolean;
	/** Total de items encontrados (incluindo aninhados) */
	totalResults: number;
}

/**
 * Hook para gerenciar a busca no sidebar
 * Filtra items de navegação com suporte a aninhamento
 */
export function useSidebarSearch({
	navigationData,
	onSearch,
}: UseSidebarSearchOptions): UseSidebarSearchReturn {
	const [query, setQueryState] = useState('');

	// Contar total de items (recursivo)
	const countItems = useCallback((items: ArchbaseNavigationItem[]): number => {
		return items.reduce((count, item) => {
			let total = 1;
			if (item.links) {
				total += countItems(item.links);
			}
			return count + total;
		}, 0);
	}, []);

	// Filtrar items pela busca
	const filteredItems = useMemo(() => {
		if (!query.trim()) {
			return navigationData;
		}

		const normalizedQuery = query.toLowerCase().trim();

		const filterItems = (items: ArchbaseNavigationItem[]): ArchbaseNavigationItem[] => {
			return items.reduce<ArchbaseNavigationItem[]>((acc, item) => {
				// Verificar se item não está visível no sidebar
				if (!item.showInSidebar) {
					return acc;
				}

				// Verificar se label corresponde
				const labelMatches = item.label.toLowerCase().includes(normalizedQuery);

				// Filtrar links recursivamente
				const filteredLinks = item.links ? filterItems(item.links) : [];

				// Incluir se label corresponde ou se tem filhos correspondentes
				if (labelMatches || filteredLinks.length > 0) {
					acc.push({
						...item,
						links: filteredLinks.length > 0 ? filteredLinks : item.links,
						// Expandir automaticamente grupos com match
						initiallyOpened: true,
					});
				}

				return acc;
			}, []);
		};

		return filterItems(navigationData);
	}, [navigationData, query]);

	// Total de resultados
	const totalResults = useMemo(() => {
		if (!query.trim()) {
			return countItems(navigationData);
		}
		return countItems(filteredItems);
	}, [query, navigationData, filteredItems, countItems]);

	// Definir query e chamar callback
	const setQuery = useCallback(
		(value: string) => {
			setQueryState(value);
			if (onSearch) {
				// Calcular filteredItems para o callback
				const normalizedQuery = value.toLowerCase().trim();
				if (!normalizedQuery) {
					onSearch(value, navigationData);
				} else {
					const filterItems = (items: ArchbaseNavigationItem[]): ArchbaseNavigationItem[] => {
						return items.reduce<ArchbaseNavigationItem[]>((acc, item) => {
							if (!item.showInSidebar) return acc;
							const labelMatches = item.label.toLowerCase().includes(normalizedQuery);
							const filteredLinks = item.links ? filterItems(item.links) : [];
							if (labelMatches || filteredLinks.length > 0) {
								acc.push({
									...item,
									links: filteredLinks.length > 0 ? filteredLinks : item.links,
									initiallyOpened: true,
								});
							}
							return acc;
						}, []);
					};
					onSearch(value, filterItems(navigationData));
				}
			}
		},
		[navigationData, onSearch],
	);

	// Limpar busca
	const clearSearch = useCallback(() => {
		setQuery('');
	}, [setQuery]);

	return {
		query,
		setQuery,
		clearSearch,
		filteredItems,
		hasResults: filteredItems.length > 0,
		isSearching: query.trim().length > 0,
		totalResults,
	};
}
