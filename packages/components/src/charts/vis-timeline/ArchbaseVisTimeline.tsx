import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Box, Paper, Center, LoadingOverlay, Alert, Stack, Text, ActionIcon, Group } from '@mantine/core';
import { IconZoomIn, IconZoomOut, IconRefresh, IconAlertCircle } from '@tabler/icons-react';
import { useArchbaseTranslation } from '@archbase/core';
import type {
  ArchbaseVisTimelineProps,
  TimelineItem,
  TimelineGroup,
} from './ArchbaseVisTimeline.types';
import {
  mergeTimelineOptions,
  normalizeTimelineItems,
  normalizeTimelineGroups,
  normalizeDate,
  normalizeRange,
  formatTimelineDate,
  formatDuration,
} from './utils/timelineOptions';

/**
 * Componente wrapper para vis-timeline
 * Implementação leve usando vis-timeline diretamente
 */
export function ArchbaseVisTimeline<T extends TimelineItem = TimelineItem>({
  items = [],
  groups = [],
  options: customOptions,
  start,
  end,
  range,
  width = '100%',
  height = 500,
  minHeight = 300,
  orientation = 'bottom',
  layout = 'box',
  editable = false,
  selectable = true,
  multiselect = true,
  zoomable = true,
  moveable = true,
  showCurrentTime = true,
  showCustomTime = false,
  showMajorLabels = true,
  showMinorLabels = true,
  style,
  className,
  backgroundColor,
  itemColor,
  groupColor,
  disabled = false,
  loading,
  error,
  noData,
  onLoad,
  onError,
  on,
  ariaLabel,
  title,
  timelineRef,
}: ArchbaseVisTimelineProps<T>) {
  const { t } = useArchbaseTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentRange, setCurrentRange] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  // Merge options
  const options = useMemo(() => {
    const merged = mergeTimelineOptions({
      ...customOptions,
      height,
      width,
      minHeight,
      orientation,
      layout,
      editable,
      selectable,
      multiselect,
      showCurrentTime,
      // @ts-ignore - zoomable is valid but not in the type definition
      zoomable: typeof zoomable === 'boolean' ? zoomable : true,
      // @ts-ignore - moveable is valid but not in the type definition
      moveable: typeof moveable === 'boolean' ? moveable : true,
    } as any);

    return merged;
  }, [
    customOptions,
    height,
    width,
    minHeight,
    orientation,
    layout,
    editable,
    selectable,
    multiselect,
    showCurrentTime,
    zoomable,
    moveable,
  ]);

  // Normalize items
  const normalizedItems = useMemo(() => {
    return normalizeTimelineItems(items);
  }, [items]);

  // Normalize groups
  const normalizedGroups = useMemo(() => {
    return groups.length > 0 ? normalizeTimelineGroups(groups) : undefined;
  }, [groups]);

  // Calculate initial range
  const initialRange = useMemo(() => {
    if (range) {
      return normalizeRange(range);
    }
    if (start && end) {
      return [normalizeDate(start), normalizeDate(end)];
    }
    if (normalizedItems.length > 0) {
      const dates = normalizedItems.map((item) => item.start.getTime());
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));
      // Add padding
      minDate.setDate(minDate.getDate() - 1);
      maxDate.setDate(maxDate.getDate() + 1);
      return [minDate, maxDate];
    }
    return undefined;
  }, [range, start, end, normalizedItems]);

  // Load vis-timeline dynamically
  useEffect(() => {
    let mounted = true;

    const loadTimeline = async () => {
      if (!containerRef.current || disabled) return;

      try {
        // Try to import vis-timeline - will be bundled separately
        // @ts-ignore - Dynamic import for optional peer dependency
        const visModule = await import('vis-timeline');
        const { Timeline } = visModule;
        // @ts-ignore - DataSet might be exported differently
        const DataSet = (visModule as any).DataSet || visModule.default?.DataSet;

        if (!mounted || !containerRef.current) return;

        // Create datasets
        const itemsDataset = new DataSet(normalizedItems);
        const groupsDataset = normalizedGroups ? new DataSet(normalizedGroups) : undefined;

        // Create timeline
        const timeline = new Timeline(
          containerRef.current,
          itemsDataset,
          (groupsDataset ? { groups: groupsDataset, ...options } : options) as any,
          initialRange ? { start: initialRange[0], end: initialRange[1] } : undefined
        );

        timelineInstanceRef.current = timeline;

        // Expose timeline instance via ref
        if (timelineRef) {
          if (typeof timelineRef === 'function') {
            timelineRef(timeline);
          } else if ('current' in timelineRef) {
            (timelineRef as any).current = timeline;
          }
        }

        // Set up event listeners
        timeline.on('select', (properties: any) => {
          setSelectedItems(properties.items);
          on?.onSelect?.(properties.items);
        });

        timeline.on('rangechanged', (properties: any) => {
          setCurrentRange({
            start: new Date(properties.start),
            end: new Date(properties.end),
          });
          on?.onRangeChange?.(new Date(properties.start), new Date(properties.end));
        });

        timeline.on('click', (properties: any) => {
          if (properties.item) {
            on?.onItemClick?.(properties.item);
          } else if (properties.time) {
            on?.onCanvasClick?.(new Date(properties.time));
          }
        });

        timeline.on('doubleClick', (properties: any) => {
          if (properties.item) {
            on?.onItemDoubleClick?.(properties.item);
          } else {
            on?.onCanvasDoubleClick?.(new Date(properties.time));
          }
        });

        setIsLoaded(true);
        onLoad?.();
      } catch (e) {
        console.error('Failed to load vis-timeline:', e);
        onError?.(e instanceof Error ? e : new Error('Failed to load timeline'));
      }
    };

    loadTimeline();

    return () => {
      mounted = false;
      if (timelineInstanceRef.current) {
        timelineInstanceRef.current.destroy();
        timelineInstanceRef.current = null;
      }
    };
    // Only run on mount for stability
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update items when they change
  useEffect(() => {
    if (timelineInstanceRef.current && isLoaded) {
      const itemsDataset = timelineInstanceRef.current.itemsData;
      if (itemsDataset) {
        itemsDataset.clear();
        itemsDataset.add(normalizedItems);
      }
    }
  }, [normalizedItems, isLoaded]);

  // Update groups when they change
  useEffect(() => {
    if (timelineInstanceRef.current && isLoaded && normalizedGroups) {
      timelineInstanceRef.current.setGroups(normalizedGroups);
    }
  }, [normalizedGroups, isLoaded]);

  // Zoom controls
  const handleZoomIn = () => {
    if (timelineInstanceRef.current) {
      const range = timelineInstanceRef.current.getWindow();
      const interval = range.end.getTime() - range.start.getTime();
      const newInterval = interval * 0.7;
      timelineInstanceRef.current.setWindow(
        new Date(range.start.getTime() - (interval - newInterval) / 2),
        new Date(range.end.getTime() + (interval - newInterval) / 2)
      );
    }
  };

  const handleZoomOut = () => {
    if (timelineInstanceRef.current) {
      const range = timelineInstanceRef.current.getWindow();
      const interval = range.end.getTime() - range.start.getTime();
      const newInterval = interval * 1.3;
      timelineInstanceRef.current.setWindow(
        new Date(range.start.getTime() - (newInterval - interval) / 2),
        new Date(range.end.getTime() + (newInterval - interval) / 2)
      );
    }
  };

  const handleFit = () => {
    if (timelineInstanceRef.current) {
      timelineInstanceRef.current.fit();
    }
  };

  const handleToday = () => {
    if (timelineInstanceRef.current) {
      const now = new Date();
      timelineInstanceRef.current.moveTo(now);
    }
  };

  // Render loading state
  if (!isLoaded && loading) {
    return (
      <Paper
        withBorder
        p="xl"
        style={{ width, height, minHeight }}
        className={className}
      >
        <Center h="100%">
          <Stack align="center">
            <LoadingOverlay visible />
            {typeof loading === 'string' ? <Text>{loading}</Text> : loading}
          </Stack>
        </Center>
      </Paper>
    );
  }

  // Render error state
  if (error && typeof error !== 'boolean') {
    return (
      <Paper
        withBorder
        p="xl"
        style={{ width, height, minHeight }}
        className={className}
      >
        <Center h="100%">
          <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
            {typeof error === 'string' ? error : 'Failed to load timeline'}
          </Alert>
        </Center>
      </Paper>
    );
  }

  // Render no data state
  if (items.length === 0 && noData) {
    return (
      <Paper
        withBorder
        p="xl"
        style={{ width, height, minHeight }}
        className={className}
      >
        <Center h="100%">
          <Text c="dimmed">
            {typeof noData === 'string' ? noData : t('No items to display') as ReactNode}
          </Text>
        </Center>
      </Paper>
    );
  }

  return (
    <Paper
      withBorder
      shadow="sm"
      style={{ width, ...style }}
      className={className}
    >
      {/* Toolbar */}
      {!disabled && (
        <Group justify="flex-end" p="xs" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
          <ActionIcon size="sm" variant="subtle" onClick={handleZoomIn} title={String(t('Zoom in'))}>
            <IconZoomIn size={16} />
          </ActionIcon>
          <ActionIcon size="sm" variant="subtle" onClick={handleZoomOut} title={String(t('Zoom out'))}>
            <IconZoomOut size={16} />
          </ActionIcon>
          <ActionIcon size="sm" variant="subtle" onClick={handleFit} title={String(t('Fit to items'))}>
            <IconRefresh size={16} />
          </ActionIcon>
          <ActionIcon size="sm" variant="subtle" onClick={handleToday} title={String(t('Go to today'))}>
            <IconRefresh size={16} />
          </ActionIcon>

          {/* Current range info */}
          {currentRange && (
            <Text size="xs" c="dimmed" ml="auto">
              {formatTimelineDate(currentRange.start)} - {formatTimelineDate(currentRange.end)}
              {currentRange.end && currentRange.start && (
                <Text span ml="xs" inherit>
                  ({formatDuration(currentRange.start, currentRange.end)})
                </Text>
              )}
            </Text>
          )}

          {/* Selected items info */}
          {selectedItems.length > 0 && (
            <Text size="xs" c="blue">
              {selectedItems.length} {t('selected') as ReactNode}
            </Text>
          )}
        </Group>
      )}

      {/* Timeline container */}
      <Box
        ref={containerRef}
        style={{
          height: typeof height === 'number' ? height : undefined,
          minHeight,
          backgroundColor,
        }}
        aria-label={ariaLabel || title || 'Timeline'}
      />

      {disabled && (
        <Box
          pos="absolute"
          inset={0}
          style={{ backgroundColor: 'rgba(0,0,0,0.05)', cursor: 'not-allowed' }}
        />
      )}
    </Paper>
  );
}

ArchbaseVisTimeline.displayName = 'ArchbaseVisTimeline';
