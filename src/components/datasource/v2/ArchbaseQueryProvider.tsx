/**
 * ArchbaseQueryProvider - TanStack Query Provider for Archbase React
 * 
 * This provider sets up TanStack Query with optimized defaults for Archbase DataSources
 */

import React, { ReactNode } from 'react';
import { 
  QueryClient, 
  QueryClientProvider, 
  QueryCache,
  MutationCache,
  useQueryClient
} from '@tanstack/react-query';
// Import opcional - instale @tanstack/react-query-devtools para usar
let ReactQueryDevtools: any;
try {
  const devtools = require('@tanstack/react-query-devtools');
  ReactQueryDevtools = devtools.ReactQueryDevtools;
} catch {
  // DevTools não instaladas - renderiza null
  ReactQueryDevtools = () => null;
}

/**
 * Configuration for ArchbaseQueryProvider
 */
export interface ArchbaseQueryProviderConfig {
  /** Enable React Query DevTools (default: true in development) */
  enableDevTools?: boolean;
  /** Custom QueryClient instance */
  queryClient?: QueryClient;
  /** Default stale time for all queries (default: 30 seconds) */
  defaultStaleTime?: number;
  /** Default cache time for all queries (default: 5 minutes) */
  defaultCacheTime?: number;
  /** Default retry count (default: 3) */
  defaultRetry?: number;
  /** Enable background refetch on window focus (default: false) */
  refetchOnWindowFocus?: boolean;
  /** Enable background refetch on reconnect (default: true) */
  refetchOnReconnect?: boolean;
  /** Global error handler */
  onError?: (error: unknown) => void;
  /** Global success handler for mutations */
  onMutationSuccess?: (data: unknown) => void;
}

/**
 * Default configuration optimized for Archbase applications
 */
const DEFAULT_CONFIG: Required<Omit<ArchbaseQueryProviderConfig, 'queryClient' | 'onError' | 'onMutationSuccess'>> = {
  enableDevTools: process.env.NODE_ENV === 'development',
  defaultStaleTime: 30 * 1000,      // 30 seconds
  defaultCacheTime: 5 * 60 * 1000,  // 5 minutes
  defaultRetry: 3,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true
};

/**
 * Create optimized QueryClient for Archbase applications
 */
export function createArchbaseQueryClient(config: ArchbaseQueryProviderConfig = {}): QueryClient {
  const mergedConfig = { ...DEFAULT_CONFIG, ...config };

  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Global error handling
        console.error('Query Error:', error, 'Query:', query.queryKey);
        config.onError?.(error);
      }
    }),
    
    mutationCache: new MutationCache({
      onError: (error, _variables, _context, mutation) => {
        // Global mutation error handling
        console.error('Mutation Error:', error, 'Mutation:', mutation);
        config.onError?.(error);
      },
      onSuccess: (data, _variables, _context, mutation) => {
        // Global mutation success handling
        console.log('Mutation Success:', mutation);
        config.onMutationSuccess?.(data);
      }
    }),

    defaultOptions: {
      queries: {
        staleTime: mergedConfig.defaultStaleTime,
        gcTime: mergedConfig.defaultCacheTime, // Updated from cacheTime to gcTime for v5
        retry: mergedConfig.defaultRetry,
        refetchOnWindowFocus: mergedConfig.refetchOnWindowFocus,
        refetchOnReconnect: mergedConfig.refetchOnReconnect,
        
        // Network-first strategy for better UX
        networkMode: 'online',
        
        // Retry configuration
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      
      mutations: {
        // Optimistic updates by default
        networkMode: 'online',
        retry: 1, // Mutations usually shouldn't retry as much as queries
        
        // Mutation retry delay
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
      }
    }
  });
}

/**
 * ArchbaseQueryProvider Component
 */
export interface ArchbaseQueryProviderProps extends ArchbaseQueryProviderConfig {
  children: ReactNode;
}

export function ArchbaseQueryProvider({
  children,
  queryClient,
  enableDevTools,
  ...config
}: ArchbaseQueryProviderProps) {
  // Create QueryClient if not provided
  const client = React.useMemo(() => {
    return queryClient || createArchbaseQueryClient(config);
  }, [queryClient, config]);

  const showDevTools = enableDevTools ?? DEFAULT_CONFIG.enableDevTools;

  return (
    <QueryClientProvider client={client}>
      {children}
      {showDevTools && (
        <ReactQueryDevtools 
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}

/**
 * Hook to access the QueryClient
 */
export function useArchbaseQueryClient(): QueryClient {
  return useQueryClient();
}

/**
 * Hook for global query states
 */
export function useArchbaseQueryStates() {
  const queryClient = useArchbaseQueryClient();
  
  // Get all query states
  const queryCache = queryClient.getQueryCache();
  const queries = queryCache.getAll();
  
  const stats = React.useMemo(() => {
    const loading = queries.filter(q => q.state.status === 'pending').length;
    const error = queries.filter(q => q.state.status === 'error').length;
    const success = queries.filter(q => q.state.status === 'success').length;
    const stale = queries.filter(q => q.isStale()).length;
    
    return {
      total: queries.length,
      loading,
      error,
      success,
      stale,
      fresh: success - stale
    };
  }, [queries]);

  return {
    stats,
    queries,
    
    // Actions
    invalidateAll: () => queryClient.invalidateQueries(),
    clearAll: () => queryClient.clear(),
    refetchAll: () => queryClient.refetchQueries(),
    
    // Utilities
    isOnline: queryClient.isMutating() === 0 && queryClient.isFetching() === 0
  };
}

/**
 * Higher-order component for providing QueryClient
 */
export function withArchbaseQuery<P extends object>(
  Component: React.ComponentType<P>,
  config?: ArchbaseQueryProviderConfig
) {
  const WrappedComponent = (props: P) => {
    return (
      <ArchbaseQueryProvider {...config}>
        <Component {...props} />
      </ArchbaseQueryProvider>
    );
  };
  
  WrappedComponent.displayName = `withArchbaseQuery(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * DevTools component for debugging query state
 */
export function ArchbaseQueryDebugger() {
  const { stats, queries } = useArchbaseQueryStates();
  
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 10, 
        left: 10, 
        background: 'rgba(0,0,0,0.8)', 
        color: 'white', 
        padding: '8px 12px', 
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace',
        zIndex: 9999
      }}
    >
      <div>📊 Query Stats:</div>
      <div>Total: {stats.total}</div>
      <div>Loading: {stats.loading}</div>
      <div>Error: {stats.error}</div>
      <div>Fresh: {stats.fresh}</div>
      <div>Stale: {stats.stale}</div>
    </div>
  );
}

/**
 * Offline indicator component
 */
export function ArchbaseOfflineIndicator() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        background: '#ff6b6b', 
        color: 'white', 
        padding: '8px', 
        textAlign: 'center',
        fontSize: '14px',
        zIndex: 10000
      }}
    >
      🔴 Você está offline. Algumas funcionalidades podem estar limitadas.
    </div>
  );
}

export default ArchbaseQueryProvider;