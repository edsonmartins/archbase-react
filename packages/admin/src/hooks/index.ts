// =============================================================================
// API PUBLICA - HOOKS RECOMENDADOS PARA USO EXTERNO
// =============================================================================

// Store de admin (deprecated - usar useTabRegistryStore)
export * from './useArchbaseAdminStore';

// Substituto do useState - persiste entre trocas de tab
export { useArchbaseState, useArchbaseStateNamed } from './useArchbaseState';

// DataGrid - paginacao, ordenacao, filtros, selecao, colunas
export { useArchbaseGridState } from './useArchbaseGridState';
export type { ArchbaseGridPersistedState } from './useArchbaseGridState';

// Tree/Arvore - nos expandidos e selecionados
export { useArchbaseTreeState, useArchbaseAccordionState } from './useArchbaseTreeState';
export type { ArchbaseTreePersistedState } from './useArchbaseTreeState';

// Hooks utilitarios
export {
  useArchbaseScrollRestore,   // Persistir scroll automaticamente
  useArchbaseTabActive,       // Detectar quando tab fica ativa
  useArchbaseDrawerState,     // Estado de drawer/modal com dados
} from './useArchbasePersistedState';
