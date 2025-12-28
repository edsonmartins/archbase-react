/**
 * ArchbaseVisTimeline - Timeline Component (vis-timeline wrapper)
 *
 * Timeline visual avançada baseada em vis-timeline
 * Suporta grupos, ranges, zoom, pan, e muito mais.
 */

// Main component
export { ArchbaseVisTimeline } from './ArchbaseVisTimeline';

// Types
export type {
  ArchbaseVisTimelineProps,
  TimelineItem,
  TimelineGroup,
  TimelineItemType,
  TimelineEvents,
  TimelineOptions,
  TimelineZoomOptions,
  TimelineMoveOptions,
  TimelineOrientation,
  TimelineLayout,
  TimelineDateFormatOptions,
} from './ArchbaseVisTimeline.types';

// Utils
export {
  DEFAULT_TIMELINE_OPTIONS,
  mergeTimelineOptions,
  normalizeTimelineItems,
  normalizeTimelineGroups,
  normalizeDate,
  normalizeRange,
  formatTimelineDate,
  formatDuration,
} from './utils/timelineOptions';
