import type { TimelineOptions, TimelineOrientation, TimelineLayout } from '../ArchbaseVisTimeline.types';

/**
 * Opções padrão para a timeline
 */
export const DEFAULT_TIMELINE_OPTIONS: Partial<TimelineOptions> = {
  height: '100%',
  width: '100%',
  minHeight: 200,
  orientation: 'bottom',
  autoResize: true,
  showCurrentTime: true,
  showTooltips: true,
  // @ts-ignore
  zoomable: true,
  // @ts-ignore
  moveable: true,
  selectable: true,
  multiselect: true,
  editable: false,
  stack: true,
  locale: 'pt-BR',
  format: {
    minorLabels: {
      millisecond: 'SSS',
      second: 's',
      minute: 'HH:mm',
      hour: 'HH:mm',
      weekday: 'ddd D',
      day: 'D',
      month: 'MMM',
      year: 'YYYY',
    },
    majorLabels: {
      millisecond: 'HH:mm:ss',
      second: 'D MMMM HH:mm',
      minute: 'ddd D MMMM',
      hour: 'ddd D MMMM',
      weekday: 'MMMM YYYY',
      day: 'MMMM YYYY',
      month: 'YYYY',
      year: '',
    },
  },
};

/**
 * Opções por orientação
 */
export const ORIENTATION_OPTIONS: Record<TimelineOrientation, Partial<TimelineOptions>> = {
  bottom: { orientation: 'bottom' },
  top: { orientation: 'top' },
  none: { orientation: 'none' },
  both: { orientation: 'both' },
};

/**
 * Opções por layout
 */
export const LAYOUT_OPTIONS: Record<TimelineLayout, Partial<TimelineOptions>> = {
  box: { layout: 'box' },
  list: { layout: 'list' },
};

/**
 * Merge opções customizadas com padrão
 */
export function mergeTimelineOptions(
  custom?: Partial<TimelineOptions>
): TimelineOptions {
  return {
    ...DEFAULT_TIMELINE_OPTIONS,
    ...custom,
    format: {
      ...DEFAULT_TIMELINE_OPTIONS.format,
      ...(custom?.format || {}),
    },
  };
}

/**
 * Converte itens para formato vis-timeline
 */
export function normalizeTimelineItems<T extends Record<string, any>>(
  items: T[]
): Array<T & { start: Date; end?: Date; content: string; type?: string }> {
  return items.map((item) => ({
    ...item,
    start: normalizeDate(item.start),
    end: item.end ? normalizeDate(item.end) : undefined,
    content: typeof item.content === 'string' ? item.content : String(item.content),
  }));
}

/**
 * Converte grupos para formato vis-timeline
 */
export function normalizeTimelineGroups<T extends Record<string, any>>(
  groups: T[]
): Array<T & { content: string }> {
  return groups.map((group) => ({
    ...group,
    content: typeof group.content === 'string' ? group.content : String(group.content),
  }));
}

/**
 * Normaliza data para objeto Date
 */
export function normalizeDate(date: Date | string | number): Date {
  if (date instanceof Date) {
    return date;
  }
  if (typeof date === 'string') {
    return new Date(date);
  }
  if (typeof date === 'number') {
    return new Date(date);
  }
  return new Date();
}

/**
 * Converte range para array de datas
 */
export function normalizeRange(
  range?: [Date | string | number, Date | string | number]
): [Date, Date] | undefined {
  if (!range) return undefined;
  return [normalizeDate(range[0]), normalizeDate(range[1])];
}

/**
 * Gera opções de cores para timeline
 */
export function generateColorOptions(
  itemColor?: string,
  groupColor?: string,
  backgroundColor?: string
): Partial<TimelineOptions> {
  const options: any = {};

  if (backgroundColor) {
    // @ts-ignore
    options.backgroundColor = backgroundColor;
  }

  if (itemColor) {
    // @ts-ignore
    options.locale = {
      current: 'Agora',
    };
  }

  return options;
}

/**
 * Mapeia tipos de itens para tipos vis-timeline
 */
export const ITEM_TYPE_MAP = {
  box: 'box',
  point: 'point',
  range: 'range',
  background: 'background',
} as const;

/**
 * Calcula margem apropriada baseado no tipo de item
 */
export function calculateItemMargin(type: string = 'box'): { horizontal: number; vertical: number } {
  const margins: Record<string, { horizontal: number; vertical: number }> = {
    background: { horizontal: 0, vertical: 0 },
    box: { horizontal: 10, vertical: 5 },
    point: { horizontal: 10, vertical: 5 },
    range: { horizontal: 10, vertical: 5 },
  };

  return margins[type] || margins.box;
}

/**
 * Formata data para exibição
 */
export function formatTimelineDate(date: Date, format: 'short' | 'long' = 'short'): string {
  const options: Intl.DateTimeFormatOptions =
    format === 'short'
      ? { day: '2-digit', month: '2-digit', year: 'numeric' }
      : { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };

  return date.toLocaleDateString('pt-BR', options);
}

/**
 * Calcula duração entre duas datas em formato legível
 */
export function formatDuration(start: Date, end: Date): string {
  const diffMs = end.getTime() - start.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) {
    return `${diffSecs}s`;
  } else if (diffMins < 60) {
    return `${diffMins}m`;
  } else if (diffHours < 24) {
    return `${diffHours}h`;
  } else {
    return `${diffDays}d`;
  }
}
