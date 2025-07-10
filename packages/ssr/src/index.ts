// @archbase/ssr - Server-Side Rendering utilities for Archbase React

// Core SSR utilities
export {
  isServer,
  isClient,
  canUseDOM,
  safeLocalStorage,
  safeSessionStorage,
  serializeForSSR,
  deserializeFromSSR,
  createSSRId,
  resetSSRIdCounter,
  getWindow,
  getDocument,
  hasFeature,
  withSSRFallback,
  clientOnly,
  serverOnly,
  createHydrationSafeValue,
  getMediaQuery,
  type MediaQueryResult
} from './utils/ArchbaseSSRUtils';

// SSR Provider and hooks
export {
  ArchbaseSSRProvider,
  useArchbaseSSR,
  useHydrationSafeState,
  ClientOnly,
  ServerOnly,
  useClientEffect,
  useSSRSafeMediaQuery
} from './providers/ArchbaseSSRProvider';

// SSR DataSource
export {
  ArchbaseSSRDataSource
} from './datasource/ArchbaseSSRDataSource';

// SSR DataSource hooks
export {
  useArchbaseSSRDataSource,
  useArchbaseSSRDataSources
} from './hooks/useArchbaseSSRDataSource';

// TanStack Start integration
export {
  ArchbaseTanStackProvider,
  useArchbaseQuery,
  serializeQueryClientState,
  prepareServerQueries,
  withArchbaseTanStack
} from './tanstack/ArchbaseTanStackIntegration';

// Version
export const ArchbaseSSRVersion = '3.0.0';