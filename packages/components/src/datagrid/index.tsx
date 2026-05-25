/**
 * DataGrid Exports
 *
 * A implementação principal agora é AG Grid.
 * Os exports principais (ArchbaseDataGrid, ArchbaseDataGridColumn, etc.) vêm do AG Grid.
 * Utilitários auxiliares da implementação antiga ainda são exportados para compatibilidade.
 */

// ============================================================
// AG Grid Implementation (PRINCIPAL)
// ============================================================
// Exporta: ArchbaseDataGrid, ArchbaseDataGridColumn, Columns,
// GridToolBarActions, ArchbaseDataGridProps, etc.
export * from './ag-grid';

// ============================================================
// Componentes auxiliares (compatibilidade)
// ============================================================
export * from './components';
export * from './hooks';
export * from './utils';
export * from './modals';
export * from './types';
export * from './export';

// ============================================================
// Utilitários da implementação antiga que não conflitam
// ============================================================
export {
  // Componentes de detail panel
  ArchbaseDetailPanel,
  ArchbaseDetailModal,
  ArchbaseDetailDrawer,
  // Componentes de popover
  ArchbaseDetailPopover,
  ArchbaseDetailHoverCard,
  // Toolbar e pagination
  ArchbaseDataGridToolbar,
  ArchbaseDataGridPagination,
  // Expand button
  ArchbaseExpandButton,
  createExpandColumn,
  // Row actions
  ArchbaseGridRowActions,
  createDataTableRowActions,
  // Formatters (prefixados para não conflitar)
  renderText,
  renderInteger,
  renderCurrency,
  renderFloat,
  renderPercent,
  renderBoolean,
  renderDate,
  renderDateTime,
  renderTime,
  renderEnum,
  renderUUID,
  getRendererByDataType,
  // Utils
  safeGetRowId,
  buildGlobalFilterExpression,
  buildFilterExpression,
  getRgbValues,
  getInitialSortModel,
} from './main';
