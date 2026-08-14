import { DEFAULT_VIZ, type VizType } from '../ports/types';
import type {
  AnalyticsQuery,
  DateRange,
  ExplorationState,
  Granularity,
  PivotConfig,
  QueryFilter,
  SeriesConfig,
  SortDirection,
} from './types';

export type ExplorationAction =
  | { type: 'toggleMeasure'; member: string }
  | { type: 'toggleDimension'; member: string }
  | { type: 'setMeasures'; members: string[] }
  | { type: 'setDimensions'; members: string[] }
  | { type: 'addFilter'; filter: QueryFilter }
  | { type: 'updateFilter'; index: number; filter: QueryFilter }
  | { type: 'removeFilter'; index: number }
  | { type: 'setTimeDimension'; dimension: string | null; granularity?: Granularity; dateRange?: DateRange }
  | { type: 'setCompareDateRanges'; ranges: DateRange[] }
  | { type: 'setViz'; viz: VizType }
  | { type: 'setPivot'; pivot: PivotConfig | undefined }
  | { type: 'setSeries'; series: SeriesConfig | undefined }
  | { type: 'setOrder'; order: Array<[string, SortDirection]> }
  | { type: 'setLimit'; limit: number | undefined }
  | { type: 'replace'; state: ExplorationState }
  | { type: 'reset' };

export const EMPTY_EXPLORATION: ExplorationState = {
  query: { measures: [], dimensions: [], filters: [], timeDimensions: [], order: [] },
  viz: { type: DEFAULT_VIZ },
  vizAuto: true,
};

function toggle(list: string[] | undefined, member: string): string[] {
  const current = list ?? [];
  return current.includes(member)
    ? current.filter((item) => item !== member)
    : [...current, member];
}

function withQuery(state: ExplorationState, query: Partial<AnalyticsQuery>): ExplorationState {
  return { ...state, query: { ...state.query, ...query } };
}

export function explorationReducer(
  state: ExplorationState,
  action: ExplorationAction,
): ExplorationState {
  switch (action.type) {
    case 'toggleMeasure':
      return withQuery(state, { measures: toggle(state.query.measures, action.member) });

    case 'toggleDimension':
      return withQuery(state, { dimensions: toggle(state.query.dimensions, action.member) });

    case 'setMeasures':
      return withQuery(state, { measures: action.members });

    case 'setDimensions':
      return withQuery(state, { dimensions: action.members });

    case 'addFilter':
      return withQuery(state, { filters: [...(state.query.filters ?? []), action.filter] });

    case 'updateFilter':
      return withQuery(state, {
        filters: (state.query.filters ?? []).map((filter, index) =>
          index === action.index ? action.filter : filter,
        ),
      });

    case 'removeFilter':
      return withQuery(state, {
        filters: (state.query.filters ?? []).filter((_, index) => index !== action.index),
      });

    case 'setTimeDimension': {
      if (action.dimension === null) {
        return withQuery(state, { timeDimensions: [] });
      }
      const existing = state.query.timeDimensions?.[0];
      return withQuery(state, {
        timeDimensions: [
          {
            dimension: action.dimension,
            granularity: action.granularity ?? existing?.granularity,
            dateRange: action.dateRange ?? existing?.dateRange,
            // Trocar a dimensao temporal invalida os intervalos de comparacao:
            // eles pertencem a dimensao anterior.
            compareDateRange:
              existing && existing.dimension === action.dimension
                ? existing.compareDateRange
                : undefined,
          },
        ],
      });
    }

    case 'setCompareDateRanges': {
      const existing = state.query.timeDimensions?.[0];
      // Comparacao so existe sobre dimensao temporal: sem ela, nada a fazer.
      if (!existing) return state;
      return withQuery(state, {
        timeDimensions: [
          {
            ...existing,
            compareDateRange: action.ranges.length > 0 ? action.ranges : undefined,
          },
          ...(state.query.timeDimensions ?? []).slice(1),
        ],
      });
    }

    case 'setViz':
      // Escolha manual desliga a derivacao automatica: a partir daqui o
      // metadado de visualizacao default nao sobrepoe o usuario.
      return { ...state, viz: { ...state.viz, type: action.viz }, vizAuto: false };

    case 'setPivot':
      return { ...state, viz: { ...state.viz, pivot: action.pivot } };

    case 'setSeries':
      return { ...state, viz: { ...state.viz, series: action.series } };

    case 'setOrder':
      return withQuery(state, { order: action.order });

    case 'setLimit':
      return withQuery(state, { limit: action.limit });

    case 'replace':
      return action.state;

    case 'reset':
      return EMPTY_EXPLORATION;
  }
}
