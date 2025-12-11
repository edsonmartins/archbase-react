/**
 * ArchbaseSSRProvider — provider SSR-safe com hydration id e hooks de mídia seguros.
 * @status stable
 */
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { isServer, canUseDOM } from '../utils/ArchbaseSSRUtils';

interface SSRContextValue {
  isSSR: boolean;
  isHydrated: boolean;
  serverData?: any;
}

const SSRContext = createContext<SSRContextValue>({
  isSSR: isServer,
  isHydrated: false
});

interface ArchbaseSSRProviderProps {
  children: ReactNode;
  serverData?: any;
  /** Custom hydration detection logic */
  onHydrated?: () => void;
  /** Fallback content during hydration */
  fallback?: ReactNode;
}

/**
 * Provider for SSR-aware Archbase components
 * Handles hydration state and provides SSR context
 */
export function ArchbaseSSRProvider({
  children,
  serverData,
  onHydrated,
  fallback
}: ArchbaseSSRProviderProps) {
  const [isHydrated, setIsHydrated] = useState(!isServer);

  useEffect(() => {
    if (!isHydrated && canUseDOM()) {
      setIsHydrated(true);
      onHydrated?.();
    }
  }, [isHydrated, onHydrated]);

  const contextValue: SSRContextValue = {
    isSSR: isServer,
    isHydrated,
    serverData
  };

  // Show fallback during hydration if provided
  if (!isHydrated && fallback) {
    return (
      <SSRContext.Provider value={contextValue}>
        {fallback}
      </SSRContext.Provider>
    );
  }

  return (
    <SSRContext.Provider value={contextValue}>
      {children}
    </SSRContext.Provider>
  );
}

/**
 * Hook to access SSR context
 */
export function useArchbaseSSR() {
  const context = useContext(SSRContext);
  if (!context) {
    throw new Error('useArchbaseSSR must be used within ArchbaseSSRProvider');
  }
  return context;
}

/**
 * Hook for hydration-safe state
 * Returns a default value during SSR and switches to actual value after hydration
 */
export function useHydrationSafeState<T>(
  ssrValue: T,
  clientValue: T | (() => T)
): T {
  const { isHydrated } = useArchbaseSSR();
  const [value, setValue] = useState<T>(ssrValue);

  useEffect(() => {
    if (isHydrated) {
      const newValue = typeof clientValue === 'function' 
        ? (clientValue as () => T)() 
        : clientValue;
      setValue(newValue);
    }
  }, [isHydrated, clientValue]);

  return value;
}

/**
 * Component that only renders on client side after hydration
 */
interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const { isHydrated } = useArchbaseSSR();
  
  if (!isHydrated) {
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
}

/**
 * Component that only renders on server side
 */
interface ServerOnlyProps {
  children: ReactNode;
}

export function ServerOnly({ children }: ServerOnlyProps) {
  const { isSSR } = useArchbaseSSR();
  
  if (!isSSR) {
    return null;
  }
  
  return <>{children}</>;
}

/**
 * Hook for SSR-safe effects that only run on client
 */
export function useClientEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
): void {
  const { isHydrated } = useArchbaseSSR();

  useEffect(() => {
    if (isHydrated) {
      return effect();
    }
  }, [isHydrated, ...(deps || [])]);
}

/**
 * Hook for media queries that work with SSR
 */
export function useSSRSafeMediaQuery(
  query: string,
  defaultValue = false
): boolean {
  const [matches, setMatches] = useState(defaultValue);
  const { isHydrated } = useArchbaseSSR();

  useEffect(() => {
    if (!isHydrated || !canUseDOM()) return;

    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query, isHydrated]);

  return matches;
}
