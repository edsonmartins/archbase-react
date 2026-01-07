/**
 * Types for the @archbase/graphics package
 */

import type { Infographic as AntVInfographic } from '@antv/infographic';

/**
 * Configuration options for the ArchbaseInfographic component
 */
export interface ArchbaseInfographicProps {
  /** CSS selector or DOM element for the container */
  container?: string | HTMLElement;
  /** Width of the infographic container */
  width?: string | number;
  /** Height of the infographic container */
  height?: string | number;
  /** Whether the infographic is editable */
  editable?: boolean;
  /** The infographic specification in DSL format */
  specification?: string;
  /** Theme to apply to the infographic */
  theme?: string;
  /** Additional CSS class name */
  className?: string;
  /** Callback when the infographic is ready */
  onReady?: (infographic: AntVInfographic) => void;
  /** Callback when rendering completes */
  onRenderComplete?: () => void;
  /** Callback when an error occurs */
  onError?: (error: Error) => void;
}

/**
 * Props for the InfographicRenderer component
 */
export interface InfographicRendererProps extends Omit<ArchbaseInfographicProps, 'container'> {
  /** Initial specification to render */
  initialSpecification?: string;
  /** Whether to enable streaming mode for AI-generated content */
  enableStreaming?: boolean;
}

/**
 * Data item types supported by the infographic DSL
 */
export type InfographicDataItem = {
  label?: string;
  desc?: string;
  value?: string | number;
  [key: string]: any;
};

/**
 * Template types available in @antv/infographic
 */
export type InfographicTemplate =
  | 'list-row-simple-horizontal-arrow'
  | 'list-row-simple-horizontal-line'
  | 'list-row-simple-vertical-arrow'
  | 'timeline-simple-vertical'
  | 'card-simple'
  | 'mindmap-simple'
  | 'flowchart-simple'
  | string;

/**
 * Configuration for infographic themes
 */
export interface InfographicThemeConfig {
  /** Primary color */
  primaryColor?: string;
  /** Secondary color */
  secondaryColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Text color */
  textColor?: string;
  /** Font family */
  fontFamily?: string;
  /** Border radius */
  borderRadius?: number;
}
