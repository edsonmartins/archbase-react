import { ReactNode } from 'react';
import { MantineColor, MantineTheme } from '@mantine/core';
import { ArchbaseNavigationItem, ArchbaseNavigationGroup } from '../types';

/**
 * Variantes disponíveis para o sidebar
 */
export type SidebarVariant = 'minimal' | 'standard' | 'rail';

/**
 * Modo de colapso do sidebar
 */
export type SidebarCollapsibleMode = 'icon' | 'offcanvas' | 'none';

/**
 * Extensão do ArchbaseNavigationItem para features avançadas
 */
export interface ExtendedNavigationItem extends ArchbaseNavigationItem {
	/** Badge de notificação (número ou texto) */
	badge?: string | number;
	/** Cor do badge */
	badgeColor?: MantineColor;
	/** Atalho de teclado (ex: "Ctrl+Shift+H") */
	shortcut?: string;
	/** Tooltip customizado */
	tooltip?: string;
	/** Se o item é um divisor/seção */
	isSection?: boolean;
	/** Label da seção */
	sectionLabel?: string;
}

/**
 * Props principais do componente ArchbaseMantineSidebar
 */
export interface ArchbaseMantineSidebarProps {
	// === Dados de Navegação ===
	/** Dados de navegação (compatível com API existente) */
	navigationData: ArchbaseNavigationItem[];

	// === Variante e Layout ===
	/** Variante do sidebar */
	variant?: SidebarVariant;
	/** Posição do sidebar */
	side?: 'left' | 'right';

	// === Dimensões ===
	/** Largura do sidebar expandido */
	width?: string | number;
	/** Largura do sidebar colapsado */
	collapsedWidth?: string | number;
	/** Altura do sidebar */
	height?: string | number;
	/** Largura da coluna de grupos (apenas para variante Rail) */
	groupColumnWidth?: string | number;

	// === Estado de Colapso ===
	/** Estado controlado de colapso */
	collapsed?: boolean;
	/** Estado inicial de colapso */
	defaultCollapsed?: boolean;
	/** Callback quando o estado de colapso muda */
	onCollapsedChange?: (collapsed: boolean) => void;

	// === Grupos (variante Rail) ===
	/** Grupo ativo (controlado) */
	activeGroup?: string;
	/** Grupo ativo inicial */
	defaultActiveGroup?: string;
	/** Callback quando o grupo ativo muda */
	onActiveGroupChange?: (groupName: string) => void;
	/** Ícone padrão para grupos sem ícone */
	defaultGroupIcon?: ReactNode;
	/** Mostrar labels dos grupos */
	showGroupLabels?: boolean;

	// === Callbacks ===
	/** Callback quando um item de menu é clicado */
	onMenuItemClick?: (item: ArchbaseNavigationItem) => void;

	// === Features Opcionais ===
	/** Mostrar campo de busca */
	showSearch?: boolean;
	/** Placeholder do campo de busca */
	searchPlaceholder?: string;
	/** Callback de busca */
	onSearch?: (query: string, results: ArchbaseNavigationItem[]) => void;
	/** Mostrar área de perfil do usuário */
	showUserProfile?: boolean;
	/** Conteúdo customizado do perfil */
	userProfileContent?: ReactNode;
	/** Callback ao clicar no perfil */
	onUserProfileClick?: () => void;
	/** Mostrar atalhos de teclado */
	showKeyboardShortcuts?: boolean;
	/** Destacar item ativo */
	highlightActiveItem?: boolean;
	/** Fechar sidebar ao clicar em item (mobile) */
	closeOnItemClick?: boolean;

	// === Header e Footer ===
	/** Conteúdo do header */
	header?: ReactNode;
	/** Conteúdo do footer */
	footer?: ReactNode;
	/** Altura do footer */
	footerHeight?: string | number;

	// === Loading e Error States ===
	/** Indica se está carregando */
	isLoading?: boolean;
	/** Mensagem de erro */
	loadingError?: string | null;
	/** Componente de loading customizado */
	loadingComponent?: ReactNode;
	/** Componente de erro customizado */
	errorComponent?: ReactNode;
	/** Número de itens no skeleton */
	skeletonItemCount?: number;

	// === Estilização ===
	/** Tema do Mantine */
	theme?: MantineTheme;

	// === Cores ===
	/** Cor de fundo (dark mode) */
	backgroundDarkColor?: string;
	/** Cor de fundo (light mode) */
	backgroundLightColor?: string;
	/** Cor do texto (dark mode) */
	textDarkColor?: string;
	/** Cor do texto (light mode) */
	textLightColor?: string;
	/** Cor dos ícones (dark mode) */
	iconDarkColor?: string;
	/** Cor dos ícones (light mode) */
	iconLightColor?: string;
	/** Cor do item ativo */
	activeColor?: MantineColor;
	/** Cor de hover */
	hoverColor?: MantineColor;

	// === Cores dos Grupos (Rail) ===
	/** Cor de fundo da coluna de grupos */
	groupBackgroundColor?: string;
	/** Cor do grupo selecionado */
	selectedGroupColor?: string;
	/** Cor dos grupos */
	groupColor?: string;
	/** Cor do label do grupo (dark mode) */
	groupLabelDarkColor?: string;
	/** Cor do label do grupo (light mode) */
	groupLabelLightColor?: string;

	// === Visual ===
	/** Mostrar borda */
	withBorder?: boolean;
	/** Mostrar sombra */
	withShadow?: boolean;

	// === Acessibilidade ===
	/** Aria label para o sidebar */
	ariaLabel?: string;

	// === Ref ===
	/** Ref para o elemento raiz */
	sidebarRef?: React.Ref<HTMLElement>;
}

/**
 * Valor do context interno do Sidebar
 */
export interface SidebarContextValue {
	// === Estado ===
	/** Se o sidebar está colapsado */
	collapsed: boolean;
	/** Função para alterar o estado de colapso */
	setCollapsed: (value: boolean) => void;
	/** Toggle do estado de colapso */
	toggleCollapsed: () => void;

	// === Grupos ===
	/** Nome do grupo ativo */
	activeGroup: string;
	/** Função para alterar o grupo ativo */
	setActiveGroup: (value: string) => void;

	// === Navegação ===
	/** Caminho do item ativo atual */
	activeItemPath: string;
	/** Navegar para um item */
	navigateToItem: (item: ArchbaseNavigationItem) => void;

	// === Busca ===
	/** Query de busca */
	searchQuery: string;
	/** Função para alterar a query de busca */
	setSearchQuery: (value: string) => void;
	/** Itens filtrados pela busca */
	filteredItems: ArchbaseNavigationItem[];

	// === Expansão de Grupos/Submenus ===
	/** IDs dos grupos expandidos */
	expandedGroups: Set<string>;
	/** Toggle de um grupo */
	toggleGroup: (groupId: string) => void;
	/** Expandir um grupo */
	expandGroup: (groupId: string) => void;
	/** Colapsar um grupo */
	collapseGroup: (groupId: string) => void;

	// === Configurações ===
	/** Variante atual */
	variant: SidebarVariant;
	/** Se deve mostrar atalhos de teclado */
	showKeyboardShortcuts: boolean;
	/** Se deve destacar item ativo */
	highlightActiveItem: boolean;
}

/**
 * Props do componente SidebarItem
 */
export interface SidebarItemProps {
	/** Item de navegação */
	item: ArchbaseNavigationItem;
	/** Nível de aninhamento (0 = raiz) */
	depth?: number;
	/** Se o sidebar está colapsado */
	collapsed?: boolean;
	/** Se o item está ativo */
	active?: boolean;
	/** Callback ao clicar */
	onClick?: (item: ArchbaseNavigationItem) => void;
	/** Cor do texto */
	textColor?: string;
	/** Cor do ícone */
	iconColor?: string;
	/** Cor de hover/ativo (background) */
	hoverColor?: string;
	/** Altura do item */
	itemHeight?: string | number;
}

/**
 * Props do componente SidebarGroup
 */
export interface SidebarGroupProps {
	/** Label do grupo */
	label: string;
	/** Ícone do grupo */
	icon?: ReactNode;
	/** Conteúdo do grupo (items) */
	children: ReactNode;
	/** Se o grupo inicia expandido */
	defaultExpanded?: boolean;
	/** Estado controlado de expansão */
	expanded?: boolean;
	/** Callback quando a expansão muda */
	onExpandedChange?: (expanded: boolean) => void;
	/** ID único do grupo */
	groupId?: string;
}

/**
 * Props do componente SidebarSearch
 */
export interface SidebarSearchProps {
	/** Placeholder do input */
	placeholder?: string;
	/** Valor controlado */
	value?: string;
	/** Callback de mudança */
	onChange?: (value: string) => void;
	/** Callback ao limpar */
	onClear?: () => void;
	/** Se o sidebar está colapsado */
	collapsed?: boolean;
}

/**
 * Props do componente SidebarUserProfile
 */
export interface SidebarUserProfileProps {
	/** Nome do usuário */
	name?: string;
	/** Email do usuário */
	email?: string;
	/** Avatar (URL ou componente) */
	avatar?: string | ReactNode;
	/** Callback ao clicar */
	onClick?: () => void;
	/** Se o sidebar está colapsado */
	collapsed?: boolean;
}

/**
 * Props do componente SidebarGroupIcon (Rail)
 */
export interface SidebarGroupIconProps {
	/** Dados do grupo */
	group: ArchbaseNavigationGroup;
	/** Se o grupo está ativo */
	active?: boolean;
	/** Callback ao clicar */
	onClick?: () => void;
	/** Mostrar label abaixo do ícone */
	showLabel?: boolean;
	/** Cor quando ativo */
	activeColor?: string;
	/** Cor quando inativo */
	inactiveColor?: string;
}

/**
 * Props do componente SidebarBadge
 */
export interface SidebarBadgeProps {
	/** Valor do badge */
	value: string | number;
	/** Cor do badge */
	color?: MantineColor;
	/** Tamanho do badge */
	size?: 'xs' | 'sm' | 'md';
}

/**
 * Props do provider do Sidebar
 */
export interface SidebarProviderProps {
	/** Filhos */
	children: ReactNode;
	/** Dados de navegação */
	navigationData: ArchbaseNavigationItem[];
	/** Variante do sidebar */
	variant?: SidebarVariant;
	/** Estado inicial de colapso */
	defaultCollapsed?: boolean;
	/** Estado controlado de colapso */
	collapsed?: boolean;
	/** Callback quando colapso muda */
	onCollapsedChange?: (collapsed: boolean) => void;
	/** Grupo ativo inicial */
	defaultActiveGroup?: string;
	/** Grupo ativo controlado */
	activeGroup?: string;
	/** Callback quando grupo ativo muda */
	onActiveGroupChange?: (groupName: string) => void;
	/** Mostrar atalhos de teclado */
	showKeyboardShortcuts?: boolean;
	/** Destacar item ativo */
	highlightActiveItem?: boolean;
	/** Callback ao clicar em item */
	onMenuItemClick?: (item: ArchbaseNavigationItem) => void;
}
