// Componente principal
export { ArchbaseCompositeFilters } from './ArchbaseCompositeFilters';

// Componentes
export { FilterPill } from './components/FilterPill';

// Hooks
export {
  useArchbaseFilters,
  useArchbaseFiltersControlled,
} from './hooks/useArchbaseFilters';
export { useArchbaseFilterPresets } from './hooks/useArchbaseFilterPresets';
export { useArchbaseFilterHistory } from './hooks/useArchbaseFilterHistory';
export { useArchbaseQuickFilters } from './hooks/useArchbaseQuickFilters';

// Utilitários
export {
  convertToRSQL,
  convertToApiFormatList,
  getDisplayValue,
  getOperatorsForType,
  getDefaultOperatorForType,
  validateFilterValue,
  generateFilterId,
} from './ArchbaseCompositeFilters.utils';

// Tipos
export type {
  ArchbaseFieldDataType,
  ArchbaseFilterOperator,
  ArchbaseFilterDefinition,
  ArchbaseActiveFilter,
  ArchbaseCompositeFiltersProps,
  SavedFilterPreset,
  FilterHistoryEntry,
  QuickFilterPreset,
  FilterValue,
  FilterOption,
  RSQLOutput,
  FilterVariant,
  InputStep,
  ApiFilterFormat,
  UseArchbaseFiltersOptions,
  UseArchbaseFiltersReturn,
  UseArchbaseFilterPresetsOptions,
  UseArchbaseFilterPresetsReturn,
  UseArchbaseFilterHistoryOptions,
  UseArchbaseFilterHistoryReturn,
  FilterPillProps,
  FieldDropdownProps,
  OperatorDropdownProps,
  ValueDropdownProps,
  ArchbaseCompositeFiltersStyles,
  ArchbaseCompositeFiltersClassNames,
} from './ArchbaseCompositeFilters.types';
