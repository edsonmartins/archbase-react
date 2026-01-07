/**
 * @archbase/graphics
 *
 * Graphics and infographic components for Archbase React v3
 * powered by @antv/infographic
 */

// Import styles
import './styles.scss';

// Export components
export { InfographicRenderer } from './components/InfographicRenderer';
export type { InfographicRendererRef } from './components/InfographicRenderer';

// Export hooks
export { useInfographic, useInfographicContainer } from './hooks/useInfographic';
export type { UseInfographicOptions, UseInfographicReturn } from './hooks/useInfographic';

// Export types
export type {
  ArchbaseInfographicProps,
  InfographicRendererProps,
  InfographicDataItem,
  InfographicTemplate,
  InfographicThemeConfig,
} from './types';

// Export utilities
export {
  generateInfographicSpec,
  createProcessInfographic,
  createTimelineInfographic,
  createMetricCard,
  extractTemplate,
  isValidSpecification,
  mergeDataIntoTemplate,
  INFGRAPHIC_TEMPLATES,
} from './utils';

// Re-export @antv/infographic for direct access
export { Infographic } from '@antv/infographic';
export type { InfographicOptions } from '@antv/infographic';
