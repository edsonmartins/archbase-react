import type { ReactNode } from 'react';

/**
 * Tipos de dados suportados pelos filtros, alinhado com FieldDataType do ArchbaseDataGrid
 */
export type ArchbaseFieldDataType =
  | 'text'
  | 'integer'
  | 'float'
  | 'currency'
  | 'boolean'
  | 'date'
  | 'datetime'
  | 'time'
  | 'enum'
  | 'image'
  | 'uuid';

/**
 * Operadores de filtro suportados
 */
export type ArchbaseFilterOperator =
  // String
  | 'contains'
  | 'starts_with'
  | 'ends_with'
  | '='
  | '!='
  // Numérico
  | '>'
  | '<'
  | '>='
  | '<='
  // Nulo
  | 'is_null'
  | 'is_not_null'
  // Intervalo
  | 'between'
  // Data
  | 'date_before'
  | 'date_after'
  | 'date_between'
  // Múltiplos valores
  | 'in'
  | 'not_in';

/**
 * Valor de filtro (union type para todos os tipos possíveis)
 */
export type FilterValue =
  | string
  | number
  | boolean
  | Date
  | [Date | null, Date | null] // date_range
  | string[]; // multi_select / in

/**
 * Opção para select/enum
 */
export interface FilterOption {
  value: string;
  label: string;
}

/**
 * Definição de um campo filtrável
 */
export interface ArchbaseFilterDefinition {
  key: string; // Nome do campo
  label: string; // Label exibido
  type: ArchbaseFieldDataType;
  operators?: ArchbaseFilterOperator[]; // Operadores disponíveis (se omitido, usa padrão do tipo)
  defaultOperator?: ArchbaseFilterOperator;
  placeholder?: string;
  icon?: ReactNode;
  // Para select/enum
  options?: FilterOption[];
  // Para números
  min?: number;
  max?: number;
  step?: number;
  // Para currency
  currencySymbol?: string;
  // Desabilitar campo
  disabled?: boolean;
}

/**
 * Filtro ativo
 */
export interface ArchbaseActiveFilter {
  id: string;
  key: string;
  label: string;
  type: ArchbaseFieldDataType;
  operator: ArchbaseFilterOperator;
  value: FilterValue;
  displayValue: string; // Valor formatado para exibição na UI
  icon?: ReactNode;
}

/**
 * Preset salvo de filtros
 */
export interface SavedFilterPreset {
  id: string;
  name: string;
  filters: ArchbaseActiveFilter[];
  createdAt: number;
  isFavorite?: boolean;
}

/**
 * Entrada de histórico de filtros
 */
export interface FilterHistoryEntry {
  filters: ArchbaseActiveFilter[];
  timestamp: number;
  rsql?: string; // RSQL gerado para os filtros
}

/**
 * Quick filter preset
 */
export interface QuickFilterPreset {
  id: string;
  name: string;
  description?: string;
  icon?: ReactNode;
  filters: Omit<ArchbaseActiveFilter, 'id'>[];
  isDefault?: boolean;
}

/**
 * Formatos de saída do filtro
 */
export type RSQLOutput = 'controlled' | 'uncontrolled';

/**
 * Variantes visuais do componente
 */
export type FilterVariant = 'default' | 'compact' | 'minimal' | 'bordered';

/**
 * Step do input de filtro
 */
export type InputStep = 'field' | 'operator' | 'value';

/**
 * Estado do input de filtro
 */
export interface FilterInputState {
  step: InputStep;
  selectedField: ArchbaseFilterDefinition | null;
  selectedOperator: ArchbaseFilterOperator | null;
  inputValue: string;
  isFocused: boolean;
}

/**
 * Config de dropdowns customizados
 */
export interface FilterDropdownConfig {
  field?: React.ComponentType<any>;
  operator?: React.ComponentType<any>;
  value?: React.ComponentType<any>;
}

/**
 * Props do componente principal
 */
export interface ArchbaseCompositeFiltersProps {
  // Configuração dos campos
  filters: ArchbaseFilterDefinition[];

  // Estado controlado
  value?: ArchbaseActiveFilter[];
  onChange?: (filters: ArchbaseActiveFilter[], rsql?: string) => void;

  // RSQL output
  rsqlOutput?: RSQLOutput;
  onRSQLChange?: (rsql: string | undefined) => void;

  // Configurações de UI
  placeholder?: string;
  maxFilters?: number;
  variant?: FilterVariant;

  // Recursos
  enablePresets?: boolean;
  enableHistory?: boolean;
  enableQuickFilters?: boolean;
  quickFilters?: QuickFilterPreset[];

  // Storage
  storageKeyPrefix?: string;

  // Customização
  customRenderPill?: (filter: ArchbaseActiveFilter, onRemove: () => void) => ReactNode;
  customDropdowns?: Partial<FilterDropdownConfig>;
  styles?: ArchbaseCompositeFiltersStyles;
  classNames?: ArchbaseCompositeFiltersClassNames;

  // Eventos
  onFilterAdd?: (filter: ArchbaseActiveFilter) => void;
  onFilterRemove?: (filterId: string) => void;
  onFiltersCleared?: () => void;
}

/**
 * Estilos do componente
 */
export interface ArchbaseCompositeFiltersStyles {
  root?: React.CSSProperties;
  container?: React.CSSProperties;
  inputWrapper?: React.CSSProperties;
  input?: React.CSSProperties;
  pillsContainer?: React.CSSProperties;
  pill?: React.CSSProperties;
  rsqlOutput?: React.CSSProperties;
  actionsButton?: React.CSSProperties;
  clearButton?: React.CSSProperties;
}

/**
 * Class names do componente
 */
export interface ArchbaseCompositeFiltersClassNames {
  root?: string;
  container?: string;
  inputWrapper?: string;
  input?: string;
  pillsContainer?: string;
  pill?: string;
  rsqlOutput?: string;
  actionsButton?: string;
}

/**
 * Hook de filtros - opções
 */
export interface UseArchbaseFiltersOptions {
  initialFilters?: ArchbaseActiveFilter[];
  onFiltersChange?: (filters: ArchbaseActiveFilter[], rsql?: string) => void;
}

/**
 * Hook de filtros - retorno
 */
export interface UseArchbaseFiltersReturn {
  // Estado
  activeFilters: ArchbaseActiveFilter[];
  rsqlQuery: string | undefined;

  // Ações
  addFilter: (filter: Omit<ArchbaseActiveFilter, 'id'>) => void;
  removeFilter: (id: string) => void;
  clearFilters: () => void;
  updateFilter: (id: string, updates: Partial<ArchbaseActiveFilter>) => void;
  setFilters: (filters: ArchbaseActiveFilter[]) => void;

  // Conversores
  toRSQL: () => string | undefined;
  toApiFormat: () => ApiFilterFormat[];

  // Queries
  filtersCount: number;
  hasFilter: (key: string) => boolean;
  getFilter: (key: string) => ArchbaseActiveFilter | undefined;
}

/**
 * Format de API (semelhante ao mantine-composite-filters)
 */
export interface ApiFilterFormat {
  field: string;
  operator: ArchbaseFilterOperator;
  value: FilterValue;
}

/**
 * Hook de presets - opções
 */
export interface UseArchbaseFilterPresetsOptions {
  storageKey?: string;
  onLoad?: (filters: ArchbaseActiveFilter[]) => void;
}

/**
 * Hook de presets - retorno
 */
export interface UseArchbaseFilterPresetsReturn {
  presets: SavedFilterPreset[];
  sortedPresets: SavedFilterPreset[];
  savePreset: (filters: ArchbaseActiveFilter[], name?: string) => SavedFilterPreset | null;
  loadPreset: (preset: SavedFilterPreset) => void;
  deletePreset: (presetId: string) => void;
  updatePreset: (presetId: string, updates: Partial<Omit<SavedFilterPreset, 'id'>>) => void;
  toggleFavorite: (presetId: string) => void;
  hasPresets: boolean;
}

/**
 * Hook de histórico - opções
 */
export interface UseArchbaseFilterHistoryOptions {
  storageKey?: string;
  maxHistory?: number;
  enabled?: boolean;
}

/**
 * Hook de histórico - retorno
 */
export interface UseArchbaseFilterHistoryReturn {
  history: FilterHistoryEntry[];
  recentHistory: FilterHistoryEntry[];
  clearHistory: () => void;
  removeHistoryItem: (timestamp: number) => void;
  loadFromHistory: (timestamp: number) => void;
  hasHistory: boolean;
}

/**
 * Props do FilterPill
 */
export interface FilterPillProps {
  filter: ArchbaseActiveFilter;
  onRemove: () => void;
  onOperatorClick?: () => void;
  onValueClick?: () => void;
  isHighlighted?: boolean;
  compact?: boolean;
  styles?: ArchbaseCompositeFiltersStyles['pill'];
}

/**
 * Props do dropdown de campo
 */
export interface FieldDropdownProps {
  fields: ArchbaseFilterDefinition[];
  onSelect: (field: ArchbaseFilterDefinition) => void;
  inputValue: string;
}

/**
 * Props do dropdown de operador
 */
export interface OperatorDropdownProps {
  field: ArchbaseFilterDefinition;
  onSelect: (operator: ArchbaseFilterOperator) => void;
}

/**
 * Props do dropdown de valor
 */
export interface ValueDropdownProps {
  field: ArchbaseFilterDefinition;
  operator: ArchbaseFilterOperator;
  options: FilterOption[];
  onSelect: (value: string) => void;
  inputValue: string;
}

/**
 * Props dos painéis (History, Presets, QuickFilters)
 */
export interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface FilterHistoryPanelProps extends FilterPanelProps {
  history: FilterHistoryEntry[];
  onLoad: (entry: FilterHistoryEntry) => void;
  onClear: () => void;
  onRemove: (timestamp: number) => void;
}

export interface FilterPresetsPanelProps extends FilterPanelProps {
  presets: SavedFilterPreset[];
  onLoad: (preset: SavedFilterPreset) => void;
  onSave: (name?: string) => void;
  onDelete: (presetId: string) => void;
  onToggleFavorite: (presetId: string) => void;
}

export interface QuickFiltersPanelProps extends FilterPanelProps {
  quickFilters: QuickFilterPreset[];
  onApply: (preset: QuickFilterPreset) => void;
}

/**
 * Hook de quick filters - retorno
 */
export interface UseArchbaseQuickFiltersReturn {
  quickFilters: QuickFilterPreset[];
  applyQuickFilter: (presetId: string) => void;
  addQuickFilter: (preset: QuickFilterPreset) => void;
  removeQuickFilter: (presetId: string) => void;
}
