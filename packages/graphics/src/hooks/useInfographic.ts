/**
 * Custom hook for managing @antv/infographic instances
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Infographic } from '@antv/infographic';
import type {
  ArchbaseInfographicProps,
  InfographicThemeConfig,
} from '../types';

export interface UseInfographicOptions extends Omit<ArchbaseInfographicProps, 'container'> {}

export interface UseInfographicReturn {
  /** The infographic instance */
  infographic: Infographic | null;
  /** Whether the infographic is currently loading */
  isLoading: boolean;
  /** The last error that occurred */
  error: Error | null;
  /** Render a new specification */
  render: (specification: string) => void;
  /** Destroy the infographic instance */
  destroy: () => void;
  /** Update the theme */
  updateTheme: (theme: string) => void;
}

/**
 * Hook for managing an @antv/infographic instance
 *
 * @param options - Configuration options for the infographic
 * @returns Object containing the infographic instance and control methods
 *
 * @example
 * ```tsx
 * const { infographic, render, isLoading } = useInfographic({
 *   width: '100%',
 *   height: '100%',
 *   editable: true,
 *   onReady: (instance) => console.log('Ready!', instance),
 * });
 *
 * useEffect(() => {
 *   if (infographic) {
 *     render('infographic list-row-simple-horizontal-arrow\ndata\n  items:\n    - label: Step 1');
 *   }
 * }, [infographic]);
 * ```
 */
export function useInfographic(options: UseInfographicOptions = {}): UseInfographicReturn {
  const {
    width = '100%',
    height = '100%',
    editable = false,
    specification,
    theme,
    onReady,
    onRenderComplete,
    onError,
  } = options;

  const [infographic, setInfographic] = useState<Infographic | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const infographicRef = useRef<Infographic | null>(null);

  /**
   * Initialize the infographic instance
   */
  const initialize = useCallback((container: HTMLElement) => {
    if (containerRef.current === container) {
      return;
    }

    containerRef.current = container;
    setIsLoading(true);
    setError(null);

    try {
      // Dynamically import Infographic to avoid SSR issues
      import('@antv/infographic').then(({ Infographic: InfographicClass }) => {
        const instance = new InfographicClass({
          container,
          width,
          height,
          editable,
        });

        infographicRef.current = instance;
        setInfographic(instance);
        setIsLoading(false);

        onReady?.(instance);

        // Render initial specification if provided
        if (specification) {
          instance.render(specification);
          onRenderComplete?.();
        }
      });
    } catch (err) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj);
      setIsLoading(false);
      onError?.(errorObj);
    }
  }, [width, height, editable, specification, onReady, onRenderComplete, onError]);

  /**
   * Render a new specification
   */
  const render = useCallback((spec: string) => {
    if (infographicRef.current) {
      try {
        infographicRef.current.render(spec);
        onRenderComplete?.();
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        onError?.(errorObj);
      }
    }
  }, [onRenderComplete, onError]);

  /**
   * Destroy the infographic instance
   */
  const destroy = useCallback(() => {
    if (infographicRef.current) {
      try {
        infographicRef.current.destroy();
      } catch (err) {
        // Ignore destroy errors
      }
      infographicRef.current = null;
      setInfographic(null);
    }
    containerRef.current = null;
  }, []);

  /**
   * Update the theme
   */
  const updateTheme = useCallback((newTheme: string) => {
    if (infographicRef.current) {
      try {
        // Note: @antv/infographic theme API may vary
        // This is a placeholder for theme updates
        // infographicRef.current.setTheme(newTheme);
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        onError?.(errorObj);
      }
    }
  }, [onError]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      destroy();
    };
  }, [destroy]);

  return {
    infographic,
    isLoading,
    error,
    render,
    destroy,
    updateTheme,
  };
}

/**
 * Hook that provides a ref callback for container initialization
 */
export function useInfographicContainer(options: UseInfographicOptions = {}) {
  const { infographic, isLoading, error, render, destroy, updateTheme } = useInfographic(options);
  const containerRef = useCallback((container: HTMLElement | null) => {
    if (container) {
      import('@antv/infographic').then(({ Infographic: InfographicClass }) => {
        const instance = new InfographicClass({
          container,
          width: options.width || '100%',
          height: options.height || '100%',
          editable: options.editable || false,
        });

        if (options.specification) {
          instance.render(options.specification);
        }

        options.onReady?.(instance);
      });
    }
  }, [options]);

  return {
    containerRef,
    infographic,
    isLoading,
    error,
    render,
    destroy,
    updateTheme,
  };
}
