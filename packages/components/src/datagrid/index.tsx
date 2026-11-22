/**
 * DataGrid Exports
 *
 * `ArchbaseDataGrid` é a implementação sobre a beautiful-grid (./bgrid).
 * `ArchbaseDataGridAG` continua disponível sobre o AG Grid, com o mesmo contrato
 * de props/ref — os tipos públicos (ArchbaseDataGridProps, ArchbaseDataGridRef,
 * ArchbaseDataGridColumn, Columns, ...) são compartilhados pelas duas.
 * Utilitários auxiliares da implementação antiga ainda são exportados para compatibilidade.
 */

// ============================================================
// Tipos, colunas e utilitários compartilhados + ArchbaseDataGridAG
// ============================================================
export * from './ag-grid';

// ============================================================
// beautiful-grid Implementation (PRINCIPAL)
// ============================================================
export {
  ArchbaseDataGridBGrid,
  ArchbaseDataGridBGrid as ArchbaseDataGrid,
  BGRID_LOCALE_PTBR,
} from './bgrid';

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
