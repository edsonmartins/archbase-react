// Anel 0 — contexto e portas
export { AnalyticsProvider, type AnalyticsProviderProps } from './provider/AnalyticsProvider';
export {
  AnalyticsContext,
  useAnalyticsContext,
  type AnalyticsConfig,
  type AnalyticsContextValue,
  type DeepLinkParams,
} from './provider/AnalyticsContext';
export { missingPorts, requireChartRenderer, validatePorts } from './provider/validatePorts';

export type {
  AnalyticsErrorCode,
  AnalyticsEvent,
  AnalyticsPorts,
  ChartRenderProps,
  ChartRenderer,
  FormatContext,
  MemberLabeler,
  MetaFormat,
  SavedQueryRecord,
  SavedQueryScope,
  SavedQueryStore,
  SavedQueryV1,
  ValueFormatter,
  VizType,
} from './ports/types';
export {
  DEFAULT_DECIMAL_PRECISION,
  DEFAULT_META_FORMAT,
  DEFAULT_VIZ,
  META_FORMATS,
  REQUIRED_PORTS,
  VIZ_TYPES,
  isVizAvailable,
} from './ports/types';

// Transporte
export { AnalyticsClient, type LoadResponse, type RawResultSet } from './client/AnalyticsClient';
export { AnalyticsError, isAnalyticsError, toAnalyticsError } from './client/errors';

// Anel 1 — metadados
export { useAnalyticsMeta, clearMetaCache, type UseAnalyticsMetaResult } from './meta/useAnalyticsMeta';
export {
  useMemberValues,
  type UseMemberValuesOptions,
  type UseMemberValuesResult,
} from './meta/useMemberValues';
export { normalizeMeta, resolveDefaultViz, resolveFormat } from './meta/normalizeMeta';
export { baseLanguage, resolveDescription, resolveLabel } from './meta/resolveLabel';
export { createDefaultLabeler } from './meta/defaultLabeler';
export type {
  AnalyticsMember,
  AnalyticsMeta,
  MemberKind,
  NormalizedResult,
  RawMetaResponse,
  ResultCell,
  ResultColumn,
  ResultDelta,
  ResultPeriod,
  ResultRow,
} from './meta/types';

// Anel 1 — exploracao
export {
  deriveDefaultViz,
  isRunnable,
  useExploration,
  type UseExplorationOptions,
  type UseExplorationResult,
} from './exploration/useExploration';
export {
  EMPTY_EXPLORATION,
  explorationReducer,
  type ExplorationAction,
} from './exploration/explorationReducer';
export {
  GRANULARITIES,
  type AnalyticsQuery,
  type DateRange,
  type ExplorationState,
  type FilterOperator,
  type Granularity,
  type PivotConfig,
  type QueryFilter,
  type QueryTimeDimension,
  type SeriesConfig,
  type SortDirection,
  type VizState,
} from './exploration/types';

// Anel 1 — resultado, consulta salva e deep link
export { bucketOffset, fillValueFor, normalizeResult } from './result/normalizeResult';
export { reconcileWithMeta, type ReconcileResult } from './savedQuery/reconcileWithMeta';
export {
  CURRENT_SAVED_QUERY_VERSION,
  migrateSavedQuery,
} from './savedQuery/migrateSavedQuery';
export {
  DEEP_LINK_VERSION,
  deserializeExploration,
  readDeepLink,
  serializeExploration,
  writeDeepLink,
  type DeepLinkRead,
} from './deeplink/deepLink';

// Strings da biblioteca
export { DEFAULT_STRINGS, interpolate, type AnalyticsStrings } from './strings';

// Portas de referencia — exemplo e teste, nao producao
export { createPtBrFormatter, ptBrFormatter, type FormatterOptions } from './reference/formatterPtBR';
export { createInMemorySavedQueryStore } from './reference/inMemorySavedQueryStore';
