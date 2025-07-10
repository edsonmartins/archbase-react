import { useEffect, useRef } from 'react';
import { performanceMonitor } from './ArchbasePerformanceMonitor';
import { emitDebugInfo } from '../debug/ArchbaseDebugPanel';

interface RenderInfo {
  componentName: string;
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  props?: Record<string, any>;
}

/**
 * Hook to track component render performance
 */
export function useArchbaseRenderTracker(
  componentName: string,
  props?: Record<string, any>
): RenderInfo {
  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);
  const lastRenderStart = useRef<number>(0);

  useEffect(() => {
    renderCount.current++;
    const renderTime = performance.now() - lastRenderStart.current;
    
    if (lastRenderStart.current > 0) {
      renderTimes.current.push(renderTime);
      
      // Keep only last 10 render times
      if (renderTimes.current.length > 10) {
        renderTimes.current.shift();
      }

      // Track in performance monitor
      performanceMonitor.start(`${componentName}_render`);
      performanceMonitor.end(`${componentName}_render`);

      // Emit debug info
      emitDebugInfo({
        type: 'render',
        component: componentName,
        message: `Rendered in ${renderTime.toFixed(2)}ms (count: ${renderCount.current})`,
        duration: renderTime,
        data: { props, renderCount: renderCount.current }
      });
    }

    lastRenderStart.current = performance.now();
  });

  const averageRenderTime = renderTimes.current.length > 0
    ? renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length
    : 0;

  return {
    componentName,
    renderCount: renderCount.current,
    lastRenderTime: renderTimes.current[renderTimes.current.length - 1] || 0,
    averageRenderTime,
    props
  };
}

/**
 * Hook to track why a component re-rendered
 */
export function useArchbaseWhyDidYouRender(
  componentName: string,
  props: Record<string, any>
): void {
  const previousProps = useRef<Record<string, any>|null>(null);

  useEffect(() => {
    if (previousProps.current) {
      const changedProps: Record<string, { from: any; to: any }> = {};
      
      // Check which props changed
      Object.keys(props).forEach(key => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key]
          };
        }
      });

      // Check for removed props
      Object.keys(previousProps.current).forEach(key => {
        if (!(key in props)) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: undefined
          };
        }
      });

      if (Object.keys(changedProps).length > 0) {
        emitDebugInfo({
          type: 'props',
          component: componentName,
          message: `Props changed: ${Object.keys(changedProps).join(', ')}`,
          data: changedProps
        });
      }
    }

    previousProps.current = { ...props };
  }, [props, componentName]);
}