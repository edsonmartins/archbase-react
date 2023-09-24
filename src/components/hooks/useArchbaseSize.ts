import * as React from 'react'
import { useArchbaseResizeObserver } from './useArchbaseResizeObserver'
import useArchbasePassiveLayoutEffect from './useArchbasePassiveLayoutEffect'


/**
 * Um hook React para medir o tamanho dos elementos HTML, incluindo quando eles mudam
 *
 * @param target Uma referência React criada por `useRef()` ou um elemento HTML
 * @param options Configura a largura inicial e a altura inicial do estado do gancho
 */
export const useArchbaseSize = <T extends HTMLElement>(
  target: React.RefObject<T> | T | null,
  options?: UseSizeOptions
): [number, number] => {
  const [size, setSize] = React.useState<[number, number]>(() => {
    const targetEl = target && 'current' in target ? target.current : target;
    return targetEl
      ? [(targetEl as HTMLElement).offsetWidth, (targetEl as HTMLElement).offsetHeight]
      : [options?.initialWidth ?? 0, options?.initialHeight ?? 0];
  });

  useArchbasePassiveLayoutEffect(() => {
    const targetEl = target && 'current' in target ? target.current : target;
    if (!targetEl) return;
    setSize([(targetEl as HTMLElement).offsetWidth, (targetEl as HTMLElement).offsetHeight]);
  }, [target]);

  // Onde a mágica acontece
  useArchbaseResizeObserver(target, (entry) => {
    // Use asserção de tipo para informar ao TypeScript que o destino é um HTMLElement
    const target = entry.target as HTMLElement;
    setSize([target.offsetWidth, target.offsetHeight]);
  });

  return size;
};


export interface UseSizeOptions {
  // The initial width to set into state.
  // This is useful for SSR environments.
  initialWidth: number
  // The initial height to set into state.
  // This is useful for SSR environments.
  initialHeight: number
}

