import React, { useRef, useState, useEffect, ReactNode } from 'react';
import { ArchbaseScreenClass, useArchbaseScreenClass } from '../../utils';
import { getConfiguration } from '../../config';


export const NO_PROVIDER_FLAG = 'NO_PROVIDER_FLAG';

export const ArchbaseScreenClassContext = React.createContext<string>(NO_PROVIDER_FLAG);

export interface ArchbaseScreenClassProviderProps {
  children: ReactNode;
  useOwnWidth?: boolean;
  fallbackScreenClass?: undefined | ArchbaseScreenClass;
}

export const ArchbaseScreenClassProvider: React.FC<ArchbaseScreenClassProviderProps> = ({
  useOwnWidth = false,
  children,
  fallbackScreenClass,
}: ArchbaseScreenClassProviderProps) => {
  const screenClassRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const detectedScreenClass = useArchbaseScreenClass(screenClassRef, fallbackScreenClass);
  const { defaultScreenClass } = getConfiguration();

  const screenClass = mounted ? detectedScreenClass : fallbackScreenClass || defaultScreenClass;

  useEffect(() => setMounted(true), []);

  return (
    <ArchbaseScreenClassContext.Provider value={screenClass}>
      {useOwnWidth ? <div ref={useOwnWidth ? screenClassRef : null}>{children}</div> : <>{children}</>}
    </ArchbaseScreenClassContext.Provider>
  );
};


