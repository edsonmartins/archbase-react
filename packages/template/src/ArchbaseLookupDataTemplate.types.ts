/**
 * Types for ArchbaseLookupDataTemplate
 * @status stable
 */
import { ReactNode } from 'react';
import type { ArchbaseDataSource } from '@archbase/data';
import type { FilterOptions, ArchbaseQueryFilterDelegator } from '@archbase/advanced';
import { ArchbaseTemplateSecurityProps } from './ArchbaseTemplateCommonTypes';

/**
 * Modo de seleção do lookup
 */
export type LookupSelectionMode = 'single' | 'multiple';

/**
 * Labels customizáveis do componente
 */
export interface LookupLabels {
	okButton?: string;
	cancelButton?: string;
	clearButton?: string;
	selectedLabel?: string;
	doubleClickHint?: string;
	noItemSelected?: string;
	itemsSelected?: string;
}

/**
 * Props principais do ArchbaseLookupDataTemplate
 */
export interface ArchbaseLookupDataTemplateProps<T extends object, ID = string>
	extends ArchbaseTemplateSecurityProps {
	// === Propriedades Obrigatórias ===

	/** Estado de abertura do modal */
	opened: boolean;

	/** Título do modal */
	title: string;

	/** Colunas do grid (children: <Columns><ArchbaseDataGridColumn /></Columns>) */
	children: ReactNode;

	/** Callback quando o modal é fechado */
	onClose: () => void;

	/** Campo usado como ID único */
	idField: keyof T;

	/** Campo principal para exibir no resumo do item selecionado */
	displayField: keyof T;

	// === Propriedades de Seleção ===

	/** Modo de seleção: 'single' (padrão) ou 'multiple' */
	selectionMode?: LookupSelectionMode;

	/** Callback quando um item é selecionado (seleção única) */
	onSelect?: (item: T) => void;

	/** Callback quando múltiplos itens são selecionados (seleção múltipla) */
	onSelectMultiple?: (items: T[]) => void;

	/** Itens pré-selecionados (para inicialização ou edição) */
	initialSelectedItems?: T[];

	/** Seleção por duplo clique (apenas single). Default: true */
	selectOnDoubleClick?: boolean;

	/** Callback antes de confirmar a seleção (retornar false cancela) */
	onBeforeConfirm?: (items: T[]) => boolean | Promise<boolean>;

	/** Callback após confirmar a seleção */
	onAfterConfirm?: (items: T[]) => void;

	// === Propriedades de DataSource ===

	/**
	 * DataSource externo (quando fornecido, o componente não cria um interno)
	 * Suporta tanto V1 quanto V2 automaticamente
	 */
	dataSource?: ArchbaseDataSource<T, ID>;

	/**
	 * Função para carregar dados (usada quando dataSource não é fornecido)
	 * @param searchValue - Valor de busca
	 * @param searchFields - Campos para busca
	 * @returns Promise com array de registros
	 */
	loadData?: (searchValue?: string, searchFields?: string) => Promise<T[]>;

	/** Campos para busca (separados por vírgula) */
	searchFields?: string;

	/** Tamanho da página para paginação. Default: 100 */
	pageSize?: number;

	// === Propriedades de Aparência ===

	/** Campo secundário para exibir no resumo (opcional) */
	displaySubField?: keyof T;

	/** Função customizada para renderizar o item selecionado */
	renderSelectedItem?: (item: T) => ReactNode;

	/** Função customizada para renderizar a lista de itens selecionados (múltipla seleção) */
	renderSelectedItems?: (items: T[]) => ReactNode;

	/** Ícone do título */
	icon?: ReactNode;

	/** Tamanho do modal. Default: '70%' */
	modalSize?: string | number;

	/** Altura do modal. Default: '600px' */
	modalHeight?: string | number;

	/** Altura do grid. Default: 400 */
	gridHeight?: number;

	/** Altura das linhas do grid. Default: 52 */
	rowHeight?: number;

	/** Cor de fundo do indicador de seleção. Default: 'blue.0' */
	selectionIndicatorColor?: string;

	/** Exibir indicador de seleção. Default: true */
	showSelectionIndicator?: boolean;

	// === Propriedades de Seleção Múltipla ===

	/** Máximo de itens selecionáveis. Default: undefined (sem limite) */
	maxSelections?: number;

	/** Exibir contador de seleção. Default: true */
	showSelectionCount?: boolean;

	/** Permitir desmarcar todos. Default: true */
	allowClearAll?: boolean;

	// === Propriedades de Filtro ===

	/** Tipo de filtro: 'none' | 'simple' | 'advanced'. Default: 'simple' */
	filterType?: 'none' | 'simple' | 'advanced';

	/** Opções do filtro avançado (quando filterType='advanced') */
	filterOptions?: FilterOptions;

	/** Delegador de persistência de filtros */
	filterPersistenceDelegator?: ArchbaseQueryFilterDelegator;

	/** Campos de filtro para o QueryBuilder */
	filterFields?: ReactNode;

	// === Propriedades de Estado ===

	/** Indicador de carregamento externo */
	isLoading?: boolean;

	/** Indicador de erro */
	isError?: boolean;

	/** Mensagem de erro */
	error?: string;

	/** Função para limpar erro */
	clearError?: () => void;

	/** Tempo para auto-fechar alerta de erro (ms). Default: 15000 */
	autoCloseAlertError?: number;

	/** Callback quando ocorre erro ao carregar dados */
	onError?: (error: any) => void;

	// === Propriedades de Customização ===

	/** Ações customizadas na toolbar */
	userActions?: ReactNode;

	/** Labels customizáveis */
	labels?: LookupLabels;

	/** Variante de estilo */
	variant?: string;
}

/**
 * Interface para os métodos expostos via ref do ArchbaseLookupDataTemplate
 */
export interface ArchbaseLookupDataTemplateRef<T = any> {
	/**
	 * Obtém os itens atualmente selecionados
	 */
	getSelectedItems: () => T[];

	/**
	 * Obtém um único item selecionado (para modo single)
	 */
	getSelectedItem: () => T | null;

	/**
	 * Limpa toda a seleção
	 */
	clearSelection: () => void;

	/**
	 * Seleciona itens programaticamente
	 */
	selectItems: (items: T[]) => void;

	/**
	 * Seleciona um único item programaticamente
	 */
	selectItem: (item: T) => void;

	/**
	 * Remove um item da seleção
	 */
	deselectItem: (item: T) => void;

	/**
	 * Atualiza/recarrega os dados do grid
	 */
	refreshData: () => void;

	/**
	 * Obtém o DataSource interno/externo
	 */
	getDataSource: () => ArchbaseDataSource<T, any> | null;

	/**
	 * Confirma a seleção (equivalente a clicar OK)
	 */
	confirmSelection: () => Promise<void>;

	/**
	 * Cancela a seleção (equivalente a clicar Cancelar)
	 */
	cancelSelection: () => void;
}
