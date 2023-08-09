import { useState, useEffect, RefObject } from 'react';
import { getConfiguration } from './config';

export type ArchbaseScreenClass = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

const getViewPort = (source: RefObject<HTMLElement> | null): number => {
  if (source && source.current && source.current.clientWidth) {
    console.log(source.current.clientWidth)
    return source.current.clientWidth;
  }
  return window.innerWidth;
};

export const screenClasses: ArchbaseScreenClass[] = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl'];

export const useArchbaseScreenClass = (source: RefObject<HTMLElement> | null, fallbackScreenClass?: ArchbaseScreenClass): ArchbaseScreenClass => {
  const getScreenClass = (): ArchbaseScreenClass => {
    const { breakpoints, defaultScreenClass, maxScreenClass } = getConfiguration();

    let newScreenClass: ArchbaseScreenClass = defaultScreenClass;

    const viewport = getViewPort(source);
    if (viewport) {
      newScreenClass = 'xs';
      if (breakpoints[0] && viewport >= breakpoints[0]) newScreenClass = 'sm';
      if (breakpoints[1] && viewport >= breakpoints[1]) newScreenClass = 'md';
      if (breakpoints[2] && viewport >= breakpoints[2]) newScreenClass = 'lg';
      if (breakpoints[3] && viewport >= breakpoints[3]) newScreenClass = 'xl';
      if (breakpoints[4] && viewport >= breakpoints[4]) newScreenClass = 'xxl';
      if (breakpoints[5] && viewport >= breakpoints[5]) newScreenClass = 'xxxl';
    } else if (fallbackScreenClass) {
      newScreenClass = fallbackScreenClass;
    }

    const newScreenClassIndex = screenClasses.indexOf(newScreenClass);
    const maxScreenClassIndex = screenClasses.indexOf(maxScreenClass);
    if (maxScreenClassIndex >= 0 && newScreenClassIndex > maxScreenClassIndex) {
      newScreenClass = screenClasses[maxScreenClassIndex];
    }

    return newScreenClass;
  };

  const [screenClass, setScreenClass] = useState<ArchbaseScreenClass>(() => getScreenClass());

  useEffect(() => {
    const handleWindowResized = (): void => setScreenClass(getScreenClass());

    window.addEventListener('resize', handleWindowResized, false);

    return () => {
      window.removeEventListener('resize', handleWindowResized, false);
    };
  }, []);

  return screenClass;
};
