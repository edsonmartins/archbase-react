import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Box, Input, useMantineTheme, useComputedColorScheme } from '@mantine/core';
import {
  useArchbaseDataSourceListener,
  type DataSourceEvent,
  DataSourceEventNames,
  type IArchbaseDataSourceBase,
} from '@archbase/data';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ArchbaseResourceTimelineViewMode = 'day' | 'week' | 'month' | 'quarter';

export interface ArchbaseResourceTimelineProps<TResource, TEvent, ID = any> {
  /** DataSource for resources (groups/rows). */
  resourceDataSource?: IArchbaseDataSourceBase<TResource>;
  /** Field that holds the resource id. */
  resourceIdField?: string;
  /** Field that holds the resource display label. */
  resourceLabelField?: string;
  /** DataSource for events (items). */
  eventDataSource?: IArchbaseDataSourceBase<TEvent>;
  /** Field that holds the event start date. */
  eventStartField?: string;
  /** Field that holds the event end date. */
  eventEndField?: string;
  /** Field that links the event to a resource. */
  eventResourceIdField?: string;
  /** Field that holds the event display label. */
  eventLabelField?: string;
  /** Optional field that holds a CSS color for the event. */
  eventColorField?: string;
  /** Standalone resource array (used when no resourceDataSource). */
  resources?: TResource[];
  /** Standalone event array (used when no eventDataSource). */
  events?: TEvent[];
  /** Visible range start. */
  startDate?: Date;
  /** Visible range end. */
  endDate?: Date;
  /** Zoom / time-axis granularity preset. */
  viewMode?: ArchbaseResourceTimelineViewMode;
  /** Allow drag & resize of events. */
  editable?: boolean;
  /** Fired when the user clicks an event. */
  onEventClick?: (event: TEvent) => void;
  /** Fired after an event is moved (drag). */
  onEventMove?: (event: TEvent, newStart: Date, newEnd: Date, newResourceId: any) => void;
  /** Fired after an event is resized. */
  onEventResize?: (event: TEvent, newStart: Date, newEnd: Date) => void;
  /** Fired when the user clicks on an empty slot. */
  onSlotClick?: (resourceId: any, date: Date) => void;
  /** Fired when a new event range is selected via drag on an empty area. */
  onCreateEvent?: (resourceId: any, start: Date, end: Date) => void;
  /** Input.Wrapper label. */
  label?: string;
  /** Input.Wrapper description. */
  description?: string;
  /** Height of the timeline container. */
  height?: string | number;
  /** Custom inline style for the outer wrapper. */
  style?: React.CSSProperties;
  /** Custom CSS class for the outer wrapper. */
  className?: string;
  /** Width of the outer wrapper. */
  width?: string | number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Safely read a nested field like "a.b.c" from an object. */
function getField(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  return path.split('.').reduce((cur, key) => cur?.[key], obj);
}

/** Build vis-timeline options for a given viewMode. */
function buildViewModeOptions(viewMode: ArchbaseResourceTimelineViewMode | undefined) {
  switch (viewMode) {
    case 'day':
      return {
        timeAxis: { scale: 'hour', step: 1 },
        zoomMin: 1000 * 60 * 60, // 1 hour
        zoomMax: 1000 * 60 * 60 * 24 * 3, // 3 days
      };
    case 'week':
      return {
        timeAxis: { scale: 'day', step: 1 },
        zoomMin: 1000 * 60 * 60 * 24, // 1 day
        zoomMax: 1000 * 60 * 60 * 24 * 14, // 14 days
      };
    case 'month':
      return {
        timeAxis: { scale: 'day', step: 1 },
        zoomMin: 1000 * 60 * 60 * 24 * 7, // 7 days
        zoomMax: 1000 * 60 * 60 * 24 * 62, // ~2 months
      };
    case 'quarter':
      return {
        timeAxis: { scale: 'week', step: 1 },
        zoomMin: 1000 * 60 * 60 * 24 * 30, // 1 month
        zoomMax: 1000 * 60 * 60 * 24 * 180, // ~6 months
      };
    default:
      return {};
  }
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

function ArchbaseResourceTimeline<TResource, TEvent, ID = any>({
  resourceDataSource,
  resourceIdField = 'id',
  resourceLabelField = 'name',
  eventDataSource,
  eventStartField = 'startDate',
  eventEndField = 'endDate',
  eventResourceIdField = 'resourceId',
  eventLabelField = 'title',
  eventColorField,
  resources: resourcesProp,
  events: eventsProp,
  startDate,
  endDate,
  viewMode,
  editable = false,
  onEventClick,
  onEventMove,
  onEventResize,
  onSlotClick,
  onCreateEvent,
  label,
  description,
  height = '400px',
  style,
  className,
  width,
}: ArchbaseResourceTimelineProps<TResource, TEvent, ID>) {
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');
  const isDark = colorScheme === 'dark';

  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<any>(null);
  const dataSetRef = useRef<{ items: any; groups: any }>({ items: null, groups: null });

  // Keep latest callbacks in refs so vis-timeline handlers always see the
  // current version without needing to re-register event listeners.
  const callbackRefs = useRef({
    onEventClick,
    onEventMove,
    onEventResize,
    onSlotClick,
    onCreateEvent,
  });
  useEffect(() => {
    callbackRefs.current = { onEventClick, onEventMove, onEventResize, onSlotClick, onCreateEvent };
  });

  // ------------------------------------------------------------------
  // Derive resources & events arrays
  // ------------------------------------------------------------------

  const [resourceUpdateKey, setResourceUpdateKey] = useState(0);
  const [eventUpdateKey, setEventUpdateKey] = useState(0);

  const rawResources = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    resourceUpdateKey; // trigger re-compute
    if (resourceDataSource) {
      return resourceDataSource.browseRecords();
    }
    return resourcesProp ?? [];
  }, [resourceDataSource, resourcesProp, resourceUpdateKey]);

  const rawEvents = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    eventUpdateKey; // trigger re-compute
    if (eventDataSource) {
      return eventDataSource.browseRecords();
    }
    return eventsProp ?? [];
  }, [eventDataSource, eventsProp, eventUpdateKey]);

  // ------------------------------------------------------------------
  // Convert to vis-timeline format
  // ------------------------------------------------------------------

  const groups = useMemo(() => {
    return rawResources.map((r: any) => ({
      id: getField(r, resourceIdField),
      content: String(getField(r, resourceLabelField) ?? ''),
    }));
  }, [rawResources, resourceIdField, resourceLabelField]);

  const items = useMemo(() => {
    return rawEvents.map((e: any, idx: number) => {
      const color = eventColorField ? getField(e, eventColorField) : undefined;
      const itemStyle = color
        ? `background-color: ${color}; border-color: ${color};`
        : undefined;
      return {
        id: getField(e, 'id') ?? idx,
        group: getField(e, eventResourceIdField),
        start: new Date(getField(e, eventStartField)),
        end: getField(e, eventEndField) ? new Date(getField(e, eventEndField)) : undefined,
        content: String(getField(e, eventLabelField) ?? ''),
        style: itemStyle,
        type: getField(e, eventEndField) ? 'range' : 'point',
        _source: e,
      };
    });
  }, [rawEvents, eventResourceIdField, eventStartField, eventEndField, eventLabelField, eventColorField]);

  // ------------------------------------------------------------------
  // DataSource listeners
  // ------------------------------------------------------------------

  const resourceDSListener = useCallback((_event: DataSourceEvent<TResource>) => {
    setResourceUpdateKey((k) => k + 1);
  }, []);

  const eventDSListener = useCallback((_event: DataSourceEvent<TEvent>) => {
    setEventUpdateKey((k) => k + 1);
  }, []);

  useArchbaseDataSourceListener({ dataSource: resourceDataSource, listener: resourceDSListener });
  useArchbaseDataSourceListener({ dataSource: eventDataSource, listener: eventDSListener });

  // ------------------------------------------------------------------
  // Dark-mode colours
  // ------------------------------------------------------------------

  const darkCss = useMemo(() => {
    if (!isDark) return '';
    const bg = theme.colors.dark[7];
    const fg = theme.colors.dark[0];
    const border = theme.colors.dark[4];
    return `
      .vis-timeline { background: ${bg}; border-color: ${border}; color: ${fg}; }
      .vis-timeline .vis-panel.vis-bottom,
      .vis-timeline .vis-panel.vis-left,
      .vis-timeline .vis-panel.vis-right,
      .vis-timeline .vis-panel.vis-top,
      .vis-timeline .vis-panel.vis-center { border-color: ${border}; }
      .vis-timeline .vis-time-axis .vis-text { color: ${fg}; }
      .vis-timeline .vis-labelset .vis-label { color: ${fg}; background: ${bg}; border-color: ${border}; }
      .vis-timeline .vis-foreground .vis-group { border-color: ${border}; }
      .vis-timeline .vis-item { color: ${fg}; border-color: ${border}; }
      .vis-timeline .vis-item.vis-selected { border-color: ${theme.colors[theme.primaryColor][5]}; }
      .vis-timeline .vis-current-time { background-color: ${theme.colors.red[5]}; }
    `;
  }, [isDark, theme]);

  // ------------------------------------------------------------------
  // Create & manage vis-timeline instance
  // ------------------------------------------------------------------

  useEffect(() => {
    if (!containerRef.current) return;
    let mounted = true;

    const init = async () => {
      try {
        // @ts-ignore dynamic import
        const visModule = await import('vis-timeline');
        const { Timeline } = visModule;
        // @ts-ignore DataSet may be in different places
        const DataSet = (visModule as any).DataSet ?? visModule.default?.DataSet;

        if (!mounted || !containerRef.current) return;

        const groupsDS = new DataSet(groups);
        const itemsDS = new DataSet(items);
        dataSetRef.current = { items: itemsDS, groups: groupsDS };

        const viewOpts = buildViewModeOptions(viewMode);

        const options: Record<string, any> = {
          ...viewOpts,
          height: typeof height === 'number' ? `${height}px` : height,
          editable: editable
            ? { add: false, updateTime: true, updateGroup: true, remove: false }
            : false,
          selectable: true,
          showCurrentTime: true,
          orientation: { axis: 'top' },
          groupOrder: 'id',
          snap: null,
          ...(startDate ? { start: startDate } : {}),
          ...(endDate ? { end: endDate } : {}),
        };

        const tl = new Timeline(containerRef.current, itemsDS, groupsDS, options);
        timelineRef.current = tl;

        // --- Events ---

        tl.on('select', (props: any) => {
          const selectedIds: any[] = props.items ?? [];
          if (selectedIds.length > 0) {
            const selectedId = selectedIds[0];
            const itemData = itemsDS.get(selectedId) as any;
            if (itemData?._source) {
              callbackRefs.current.onEventClick?.(itemData._source);
              // Sync eventDataSource
              if (eventDataSource) {
                try {
                  eventDataSource.gotoRecordByData(itemData._source);
                } catch {
                  // ignore navigation errors
                }
              }
            }
          }
        });

        tl.on('click', (props: any) => {
          if (!props.item && props.group != null && props.time) {
            callbackRefs.current.onSlotClick?.(props.group, new Date(props.time));
          }
        });

        if (editable) {
          // onMoving fires during drag, onMove fires on drop
          (tl as any).on('move', (itemData: any, callback: (item: any | null) => void) => {
            // Accept the move
            callback(itemData);
            if (itemData._source) {
              callbackRefs.current.onEventMove?.(
                itemData._source,
                new Date(itemData.start),
                new Date(itemData.end),
                itemData.group,
              );
            }
          });
        }

        // rangeselect for creating new events
        tl.on('rangechanged' as any, () => {
          // no-op, just prevent warnings
        });

        // We use the "select" + Shift or a double-click on empty space for create
        tl.on('doubleClick', (props: any) => {
          if (!props.item && props.group != null && props.time) {
            const start = new Date(props.time);
            const end = new Date(start.getTime() + 1000 * 60 * 60); // +1 hour default
            callbackRefs.current.onCreateEvent?.(props.group, start, end);
          }
        });
      } catch (err) {
        console.error('[ArchbaseResourceTimeline] Failed to load vis-timeline:', err);
      }
    };

    init();

    return () => {
      mounted = false;
      if (timelineRef.current) {
        timelineRef.current.destroy();
        timelineRef.current = null;
      }
      dataSetRef.current = { items: null, groups: null };
    };
    // Re-create when structural props change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editable, viewMode]);

  // ------------------------------------------------------------------
  // Sync items & groups into existing DataSets
  // ------------------------------------------------------------------

  useEffect(() => {
    const ds = dataSetRef.current.items;
    if (!ds) return;
    ds.clear();
    ds.add(items);
  }, [items]);

  useEffect(() => {
    const ds = dataSetRef.current.groups;
    if (!ds) return;
    ds.clear();
    ds.add(groups);
  }, [groups]);

  // Sync visible window
  useEffect(() => {
    if (timelineRef.current && startDate && endDate) {
      timelineRef.current.setWindow(startDate, endDate);
    }
  }, [startDate, endDate]);

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  const content = (
    <Box style={{ position: 'relative', ...style }} className={className} w={width}>
      {isDark && <style>{darkCss}</style>}
      <Box
        ref={containerRef}
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          width: '100%',
        }}
      />
    </Box>
  );

  if (label || description) {
    return (
      <Input.Wrapper label={label} description={description}>
        {content}
      </Input.Wrapper>
    );
  }

  return content;
}

ArchbaseResourceTimeline.displayName = 'ArchbaseResourceTimeline';

export { ArchbaseResourceTimeline };
