// Anel 2 — componentes controlados, sem estado proprio de consulta
export { MemberPalette, type MemberPaletteProps } from './components/MemberPalette';
export { QueryCanvas, type QueryCanvasProps } from './components/QueryCanvas';
export { FilterBuilder, type FilterBuilderProps } from './components/FilterBuilder';
export {
  TimeDimensionControl,
  type TimeDimensionControlProps,
} from './components/TimeDimensionControl';
export { ResultTable, type ResultTableProps } from './components/ResultTable';
export { ResultChart, type ResultChartProps } from './components/ResultChart';
export { SavedQueryBar, type SavedQueryBarProps } from './components/SavedQueryBar';
export {
  DegradedNotice,
  EmptyState,
  ErrorState,
  LoadingState,
  NoResultsState,
  TruncatedNotice,
} from './components/States';
export { useVirtualRows, type VirtualRows, type VirtualRowsOptions } from './components/useVirtualRows';

// Anel 3 — composicoes
export {
  AnalyticsExplorer,
  type AnalyticsExplorerProps,
} from './compositions/AnalyticsExplorer';
export { AnalyticsWidget, type AnalyticsWidgetProps } from './compositions/AnalyticsWidget';
