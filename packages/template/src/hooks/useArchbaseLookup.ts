/**
 * Hook para integração de lookup com editores
 * Gerencia estado de abertura do modal e seleção de itens
 * @status stable
 */
import { useState, useCallback, useMemo } from 'react';

/**
 * Opções para configurar o hook useArchbaseLookup
 */
export interface UseArchbaseLookupOptions<T> {
	/**
	 * Callback executado quando um item é selecionado (modo single)
	 * Chamado antes de fechar o modal
	 */
	onSelect?: (item: T) => void;

	/**
	 * Callback executado quando múltiplos itens são selecionados (modo multiple)
	 * Chamado antes de fechar o modal
	 */
	onSelectMultiple?: (items: T[]) => void;

	/**
	 * Item inicial selecionado (para pré-selecionar um valor)
	 */
	initialValue?: T | null;

	/**
	 * Itens iniciais selecionados (para modo múltipla seleção)
	 */
	initialValues?: T[];

	/**
	 * Modo de seleção: 'single' ou 'multiple'
	 * Default: 'single'
	 */
	selectionMode?: 'single' | 'multiple';

	/**
	 * Se true, fecha o modal automaticamente após seleção
	 * Default: true
	 */
	autoClose?: boolean;

	/**
	 * Callback executado quando o modal é aberto
	 */
	onOpen?: () => void;

	/**
	 * Callback executado quando o modal é fechado
	 */
	onClose?: () => void;
}

/**
 * Props para passar diretamente ao ArchbaseLookupDataTemplate
 * Facilita a integração via spread: {...lookup.lookupProps}
 */
export interface LookupTemplateProps<T> {
	opened: boolean;
	onClose: () => void;
	onSelect: (item: T) => void;
	onSelectMultiple: (items: T[]) => void;
	selectionMode: 'single' | 'multiple';
	initialSelectedItems?: T[];
}

/**
 * Retorno do hook useArchbaseLookup
 */
export interface UseArchbaseLookupReturn<T> {
	// === Estado ===

	/** Indica se o modal está aberto */
	opened: boolean;

	/** Item selecionado (modo single) */
	selectedItem: T | null;

	/** Itens selecionados (modo multiple) */
	selectedItems: T[];

	// === Ações ===

	/** Abre o modal de lookup */
	open: () => void;

	/** Fecha o modal de lookup */
	close: () => void;

	/** Limpa a seleção atual */
	clear: () => void;

	/** Define um item selecionado programaticamente */
	setSelectedItem: (item: T | null) => void;

	/** Define múltiplos itens selecionados programaticamente */
	setSelectedItems: (items: T[]) => void;

	// === Handlers para o modal ===

	/** Handler para seleção única (usado internamente pelo modal) */
	handleSelect: (item: T) => void;

	/** Handler para seleção múltipla (usado internamente pelo modal) */
	handleSelectMultiple: (items: T[]) => void;

	/** Handler para fechar o modal (usado internamente pelo modal) */
	handleClose: () => void;

	// === Props para ArchbaseLookupDataTemplate ===

	/**
	 * Props para passar diretamente ao ArchbaseLookupDataTemplate
	 * Uso: <ArchbaseLookupDataTemplate {...lookup.lookupProps} ... />
	 */
	lookupProps: LookupTemplateProps<T>;
}

/**
 * Hook para gerenciar estado de lookup e integrar com editores
 *
 * @example Uso básico com seleção única
 * ```tsx
 * function MeuFormulario() {
 *   const lookup = useArchbaseLookup<VeiculoDto>({
 *     onSelect: (veiculo) => {
 *       dataSource.setFieldValue('veiculo', veiculo)
 *     }
 *   })
 *
 *   return (
 *     <>
 *       <ArchbaseLookupEdit
 *         onActionSearchExecute={lookup.open}
 *         // ...
 *       />
 *       <ArchbaseLookupDataTemplate
 *         {...lookup.lookupProps}
 *         title="Selecionar Veículo"
 *         // ...
 *       />
 *     </>
 *   )
 * }
 * ```
 *
 * @example Uso com seleção múltipla
 * ```tsx
 * const lookup = useArchbaseLookup<ProdutoDto>({
 *   selectionMode: 'multiple',
 *   onSelectMultiple: (produtos) => {
 *     setProdutosSelecionados(produtos)
 *   }
 * })
 * ```
 */
export function useArchbaseLookup<T>(
	options?: UseArchbaseLookupOptions<T>
): UseArchbaseLookupReturn<T> {
	const {
		onSelect,
		onSelectMultiple,
		initialValue = null,
		initialValues = [],
		selectionMode = 'single',
		autoClose = true,
		onOpen,
		onClose: onCloseCallback,
	} = options || {};

	// Estado
	const [opened, setOpened] = useState(false);
	const [selectedItem, setSelectedItem] = useState<T | null>(initialValue);
	const [selectedItems, setSelectedItems] = useState<T[]>(initialValues);

	// Abrir modal
	const open = useCallback(() => {
		setOpened(true);
		onOpen?.();
	}, [onOpen]);

	// Fechar modal
	const close = useCallback(() => {
		setOpened(false);
		onCloseCallback?.();
	}, [onCloseCallback]);

	// Limpar seleção
	const clear = useCallback(() => {
		setSelectedItem(null);
		setSelectedItems([]);
	}, []);

	// Handler para seleção única
	const handleSelect = useCallback(
		(item: T) => {
			setSelectedItem(item);
			setSelectedItems([item]);
			onSelect?.(item);

			if (autoClose) {
				setOpened(false);
				onCloseCallback?.();
			}
		},
		[onSelect, autoClose, onCloseCallback]
	);

	// Handler para seleção múltipla
	const handleSelectMultiple = useCallback(
		(items: T[]) => {
			setSelectedItems(items);
			setSelectedItem(items.length > 0 ? items[0] : null);
			onSelectMultiple?.(items);

			if (autoClose) {
				setOpened(false);
				onCloseCallback?.();
			}
		},
		[onSelectMultiple, autoClose, onCloseCallback]
	);

	// Handler para fechar modal
	const handleClose = useCallback(() => {
		setOpened(false);
		onCloseCallback?.();
	}, [onCloseCallback]);

	// Props para passar ao ArchbaseLookupDataTemplate
	const lookupProps = useMemo<LookupTemplateProps<T>>(
		() => ({
			opened,
			onClose: handleClose,
			onSelect: handleSelect,
			onSelectMultiple: handleSelectMultiple,
			selectionMode,
			initialSelectedItems:
				selectionMode === 'multiple' ? selectedItems : selectedItem ? [selectedItem] : undefined,
		}),
		[opened, handleClose, handleSelect, handleSelectMultiple, selectionMode, selectedItem, selectedItems]
	);

	return {
		// Estado
		opened,
		selectedItem,
		selectedItems,

		// Ações
		open,
		close,
		clear,
		setSelectedItem,
		setSelectedItems,

		// Handlers
		handleSelect,
		handleSelectMultiple,
		handleClose,

		// Props para template
		lookupProps,
	};
}
