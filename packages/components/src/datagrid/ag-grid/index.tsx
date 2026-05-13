/**
 * AG Grid Implementation Exports
 *
 * Export all AG Grid related components, types, and utilities.
 */

// Main component
export { default as ArchbaseDataGridAG } from './archbase-data-grid-ag';

// Types
export type {
  ArchbaseDataGridAGProps,
  ArchbaseDataGridAGRef,
  ArchbaseDataGridAGColumnProps,
  FieldDataType,
  CellClickEvent,
  GridToolBarActionsProps,
  GridColumnsProps,
  ExtendedColDef,
} from './archbase-data-grid-ag-types';

export {
  ArchbaseDataGridAGColumn,
  Columns as AGColumns,
  GridToolBarActions as AGGridToolBarActions,
  defaultColumnProps as defaultAGColumnProps,
} from './archbase-data-grid-ag-types';

// Theme
export {
  createArchbaseAgGridTheme,
  getAgGridMantineCssVars,
} from './ag-grid-mantine-theme';

// Locale
export { AG_GRID_LOCALE_PTBR } from './ag-grid-locale-ptbr';

// Utilities
export {
  safeGetRowId as agSafeGetRowId,
  isDataSourceV2 as agIsDataSourceV2,
  getRecordsFromDataSource as agGetRecordsFromDataSource,
  getDataSourceOptions as agGetDataSourceOptions,
  getCurrentPageFromDataSource as agGetCurrentPageFromDataSource,
  buildFilterExpression as agBuildFilterExpression,
  buildGlobalFilterExpression as agBuildGlobalFilterExpression,
  convertSortModelToDataSource as agConvertSortModelToDataSource,
  getInitialSortModel as agGetInitialSortModel,
  convertActiveFiltersToAgGridModel,
  convertColumnsToFilterDefinitions as agConvertColumnsToFilterDefinitions,
  getAgGridFilterType,
  getAlignmentClass,
  getDefaultAlignment,
  hexToRgb as agHexToRgb,
  MAX_PAGE_SIZE as AG_MAX_PAGE_SIZE,
} from './archbase-data-grid-ag-utils';

// Formatters/Cell Renderers
export {
  TextCellRenderer,
  IntegerCellRenderer,
  FloatCellRenderer,
  CurrencyCellRenderer,
  PercentCellRenderer,
  BooleanCellRenderer,
  DateCellRenderer,
  DateTimeCellRenderer,
  TimeCellRenderer,
  EnumCellRenderer,
  UUIDCellRenderer,
  ImageCellRenderer,
  getCellRendererByDataType,
  getAlignmentByDataType as agGetAlignmentByDataType,
  createValueFormatter,
} from './archbase-data-grid-ag-formatters';
