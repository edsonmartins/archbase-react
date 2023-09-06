import * as React from 'react'
import { useArchbaseResizeObserver } from './useArchbaseResizeObserver'
import useArchbasePassiveLayoutEffect from './useArchbasePassiveLayoutEffect'


/**
 * A React hook for measuring the size of HTML elements including when they change
 *
 * @param target A React ref created by `useRef()` or an HTML element
 * @param options Configures the initial width and initial height of the hook's state
 */
export const useArchbaseSize = <T extends HTMLElement>(
  target: React.RefObject<T> | T | null,
  options?: UseSizeOptions
): [number, number] => {
  const [size, setSize] = React.useState<[number, number]>(() => {
    const targetEl = target && 'current' in target ? target.current : target
    // @ts-ignore
    return targetEl ? [targetEl.offsetWidth, targetEl.offsetHeight]
      : [options?.initialWidth ?? 0, options?.initialHeight ?? 0]
  })

  useArchbasePassiveLayoutEffect(() => {
    const targetEl = target && 'current' in target ? target.current : target
    // @ts-ignore
    if (!targetEl) return  setSize([targetEl.offsetWidth, targetEl.offsetHeight])
  }, [target])

  // Where the magic happens
  useArchbaseResizeObserver(target, (entry) => {
    const target = entry.target as HTMLElement
    setSize([target.offsetWidth, target.offsetHeight])
  })

  return size
}

export interface UseSizeOptions {
  // The initial width to set into state.
  // This is useful for SSR environments.
  initialWidth: number
  // The initial height to set into state.
  // This is useful for SSR environments.
  initialHeight: number
}

