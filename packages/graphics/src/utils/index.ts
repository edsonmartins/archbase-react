/**
 * Utility functions for the @archbase/graphics package
 */

import type { InfographicDataItem, InfographicTemplate } from '../types';

/**
 * Generate a basic infographic specification
 *
 * @param template - The template name to use
 * @param data - The data items to include
 * @returns The infographic specification string
 */
export function generateInfographicSpec(
  template: InfographicTemplate,
  data: InfographicDataItem[]
): string {
  const dataItems = data
    .map((item) => {
      const props = Object.entries(item)
        .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
        .join('\n      ');
      return `    - ${props}`;
    })
    .join('\n');

  return `infographic ${template}
data
  items:
${dataItems}`;
}

/**
 * Common infographic templates
 */
export const INFGRAPHIC_TEMPLATES = {
  /** Horizontal arrow list */
  LIST_ARROW_HORIZONTAL: 'list-row-simple-horizontal-arrow',
  /** Horizontal line list */
  LIST_LINE_HORIZONTAL: 'list-row-simple-horizontal-line',
  /** Vertical arrow list */
  LIST_ARROW_VERTICAL: 'list-row-simple-vertical-arrow',
  /** Vertical timeline */
  TIMELINE_VERTICAL: 'timeline-simple-vertical',
  /** Simple card */
  CARD_SIMPLE: 'card-simple',
  /** Mind map */
  MINDMAP_SIMPLE: 'mindmap-simple',
  /** Flowchart */
  FLOWCHART_SIMPLE: 'flowchart-simple',
} as const;

/**
 * Create a step-by-step process infographic
 *
 * @param steps - Array of step objects with label and description
 * @returns The infographic specification
 */
export function createProcessInfographic(steps: Array<{ label: string; desc: string }>): string {
  return generateInfographicSpec(INFGRAPHIC_TEMPLATES.LIST_ARROW_HORIZONTAL, steps);
}

/**
 * Create a timeline infographic
 *
 * @param events - Array of event objects
 * @returns The infographic specification
 */
export function createTimelineInfographic(
  events: Array<{ label: string; desc?: string; date?: string }>
): string {
  return generateInfographicSpec(INFGRAPHIC_TEMPLATES.TIMELINE_VERTICAL, events);
}

/**
 * Parse an infographic specification and extract the template name
 *
 * @param spec - The infographic specification
 * @returns The template name or null if not found
 */
export function extractTemplate(spec: string): string | null {
  const match = spec.match(/infographic\s+([^\s\n]+)/);
  return match ? match[1] : null;
}

/**
 * Validate if a specification string is properly formatted
 *
 * @param spec - The specification to validate
 * @returns True if valid, false otherwise
 */
export function isValidSpecification(spec: string): boolean {
  return /infographic\s+[^\s\n]+/.test(spec);
}

/**
 * Merge data into a template specification
 *
 * @param template - The base template specification
 * @param data - The data to merge
 * @returns The merged specification
 */
export function mergeDataIntoTemplate(template: string, data: Record<string, any>): string {
  let result = template;

  for (const [key, value] of Object.entries(data)) {
    const placeholder = `{{${key}}}`;
    result = result.replace(new RegExp(placeholder, 'g'), String(value));
  }

  return result;
}

/**
 * Create a card infographic for displaying key metrics
 *
 * @param title - Card title
 * @param value - Main value to display
 * @param description - Optional description
 * @returns The infographic specification
 */
export function createMetricCard(
  title: string,
  value: string | number,
  description?: string
): string {
  const data: InfographicDataItem = {
    label: title,
    value: String(value),
  };

  if (description) {
    data.desc = description;
  }

  return generateInfographicSpec(INFGRAPHIC_TEMPLATES.CARD_SIMPLE, [data]);
}
