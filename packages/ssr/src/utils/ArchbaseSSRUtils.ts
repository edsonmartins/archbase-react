import serialize from 'serialize-javascript';

/**
 * Utility functions for Server-Side Rendering with Archbase React
 */

/**
 * Check if code is running on server side
 */
export const isServer = typeof window === 'undefined';

/**
 * Check if code is running on client side
 */
export const isClient = !isServer;

/**
 * Safe check for browser APIs
 */
export const canUseDOM = (): boolean => {
  return !!(
    typeof window !== 'undefined' &&
    window.document &&
    window.document.createElement
  );
};

/**
 * Safely access localStorage with SSR compatibility
 */
export const safeLocalStorage = {
  getItem(key: string): string | null {
    if (!canUseDOM()) return null;
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem(key: string, value: string): void {
    if (!canUseDOM()) return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // Silently fail on server or when localStorage is disabled
    }
  },

  removeItem(key: string): void {
    if (!canUseDOM()) return;
    try {
      localStorage.removeItem(key);
    } catch {
      // Silently fail on server or when localStorage is disabled
    }
  }
};

/**
 * Safely access sessionStorage with SSR compatibility
 */
export const safeSessionStorage = {
  getItem(key: string): string | null {
    if (!canUseDOM()) return null;
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },

  setItem(key: string, value: string): void {
    if (!canUseDOM()) return;
    try {
      sessionStorage.setItem(key, value);
    } catch {
      // Silently fail on server or when sessionStorage is disabled
    }
  },

  removeItem(key: string): void {
    if (!canUseDOM()) return;
    try {
      sessionStorage.removeItem(key);
    } catch {
      // Silently fail on server or when sessionStorage is disabled
    }
  }
};

/**
 * Serialize data for SSR with circular reference handling
 */
export function serializeForSSR<T>(data: T): string {
  try {
    return serialize(data, {
      isJSON: true,
      unsafe: false // Security: don't serialize functions
    });
  } catch (error) {
    console.warn('Failed to serialize data for SSR:', error);
    return 'null';
  }
}

/**
 * Deserialize SSR data safely
 */
export function deserializeFromSSR<T>(serializedData: string): T | null {
  try {
    // Use eval in a controlled way (serialize-javascript output is safe)
    return eval(`(${serializedData})`);
  } catch (error) {
    console.warn('Failed to deserialize SSR data:', error);
    return null;
  }
}

/**
 * Create a unique ID that's consistent between server and client
 */
let idCounter = 0;
export function createSSRId(prefix = 'archbase'): string {
  return `${prefix}-${++idCounter}`;
}

/**
 * Reset ID counter (useful for testing)
 */
export function resetSSRIdCounter(): void {
  idCounter = 0;
}

/**
 * Safely get window object
 */
export function getWindow(): Window | undefined {
  return canUseDOM() ? window : undefined;
}

/**
 * Safely get document object
 */
export function getDocument(): Document | undefined {
  return canUseDOM() ? document : undefined;
}

/**
 * Check if a feature is available in the current environment
 */
export function hasFeature(feature: string): boolean {
  if (!canUseDOM()) return false;
  
  const features: Record<string, () => boolean> = {
    localStorage: () => 'localStorage' in window,
    sessionStorage: () => 'sessionStorage' in window,
    indexedDB: () => 'indexedDB' in window,
    serviceWorker: () => 'serviceWorker' in navigator,
    geolocation: () => 'geolocation' in navigator,
    webRTC: () => 'RTCPeerConnection' in window,
    websockets: () => 'WebSocket' in window,
    fetch: () => 'fetch' in window,
    intersectionObserver: () => 'IntersectionObserver' in window,
    mutationObserver: () => 'MutationObserver' in window,
    resizeObserver: () => 'ResizeObserver' in window
  };

  const featureCheck = features[feature];
  return featureCheck ? featureCheck() : false;
}

/**
 * Wrap a value that might not be available during SSR
 */
export function withSSRFallback<T>(
  getValue: () => T,
  fallback: T
): T {
  if (!canUseDOM()) return fallback;
  
  try {
    return getValue();
  } catch {
    return fallback;
  }
}

/**
 * Execute a function only on the client side
 */
export function clientOnly<T>(fn: () => T): T | undefined {
  return canUseDOM() ? fn() : undefined;
}

/**
 * Execute a function only on the server side
 */
export function serverOnly<T>(fn: () => T): T | undefined {
  return isServer ? fn() : undefined;
}

/**
 * Create a value that's different between server and client
 * Useful for hydration-safe random values
 */
export function createHydrationSafeValue<T>(
  serverValue: T,
  clientValue: () => T
): T {
  if (isServer) return serverValue;
  return clientValue();
}

/**
 * Media query hook that works with SSR
 */
export interface MediaQueryResult {
  matches: boolean;
  media: string;
}

export function getMediaQuery(query: string): MediaQueryResult {
  if (!canUseDOM()) {
    return { matches: false, media: query };
  }
  
  try {
    const mediaQuery = window.matchMedia(query);
    return {
      matches: mediaQuery.matches,
      media: mediaQuery.media
    };
  } catch {
    return { matches: false, media: query };
  }
}