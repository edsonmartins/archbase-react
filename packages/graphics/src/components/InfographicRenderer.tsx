/**
 * InfographicRenderer Component
 *
 * A React component wrapper for @antv/infographic that renders
 * infographic specifications with ease.
 */

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useInfographic } from '../hooks/useInfographic';
import type { InfographicRendererProps } from '../types';

export interface InfographicRendererRef {
  /** The underlying infographic instance */
  infographic: ReturnType<typeof useInfographic>['infographic'];
  /** Render a new specification */
  render: (specification: string) => void;
  /** Destroy the infographic */
  destroy: () => void;
}

/**
 * InfographicRenderer Component
 *
 * A React component for rendering @antv/infographic specifications.
 *
 * @example
 * ```tsx
 * <InfographicRenderer
 *   width="100%"
 *   height="500px"
 *   editable={true}
 *   specification={`
 * infographic list-row-simple-horizontal-arrow
 * data
 *   items:
 *     - label: Step 1
 *       desc: Start
 *     - label: Step 2
 *       desc: In Progress
 *   `}
 *   onRenderComplete={() => console.log('Rendered!')}
 * />
 * ```
 */
export const InfographicRenderer = forwardRef<InfographicRendererRef, InfographicRendererProps>(
  (
    {
      width = '100%',
      height = '100%',
      editable = false,
      specification,
      initialSpecification,
      theme,
      className = '',
      enableStreaming = false,
      onReady,
      onRenderComplete,
      onError,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const initSpecRef = useRef<string | undefined>(initialSpecification || specification);

    const { infographic, isLoading, error, render, destroy } = useInfographic({
      width,
      height,
      editable,
      specification: initSpecRef.current,
      theme,
      onReady,
      onRenderComplete,
      onError,
    });

    // Expose methods via ref
    useImperativeHandle(
      ref,
      () => ({
        infographic,
        render,
        destroy,
      }),
      [infographic, render, destroy]
    );

    // Initialize infographic when container is ready
    useEffect(() => {
      if (containerRef.current && !infographic) {
        import('@antv/infographic').then(({ Infographic }) => {
          const instance = new Infographic({
            container: containerRef.current!,
            width,
            height,
            editable,
          });

          const specToRender = initSpecRef.current || specification;
          if (specToRender) {
            instance.render(specToRender);
          }

          onReady?.(instance);
        });
      }
    }, [infographic, width, height, editable, specification, onReady]);

    // Update specification when it changes
    useEffect(() => {
      if (infographic && specification && specification !== initSpecRef.current) {
        initSpecRef.current = specification;
        render(specification);
      }
    }, [infographic, specification, render]);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        destroy();
      };
    }, [destroy]);

    const containerStyle: React.CSSProperties = {
      width,
      height,
      position: 'relative',
    };

    return (
      <div
        ref={containerRef}
        className={`archbase-infographic-container ${className}`.trim()}
        style={containerStyle}
        data-editable={editable}
        data-streaming={enableStreaming}
      >
        {isLoading && (
          <div className="archbase-infographic-loading">
            <div className="archbase-infographic-spinner" />
            <span>Loading infographic...</span>
          </div>
        )}
        {error && (
          <div className="archbase-infographic-error">
            <span>Error loading infographic: {error.message}</span>
          </div>
        )}
      </div>
    );
  }
);

InfographicRenderer.displayName = 'InfographicRenderer';

export default InfographicRenderer;
