import React, { ReactNode } from 'react';
import { QueryClient, QueryClientProvider, dehydrate, hydrate } from '@tanstack/react-query';
import { useArchbaseSSR } from '../providers/ArchbaseSSRProvider';
import { serializeForSSR, deserializeFromSSR, isServer } from '../utils/ArchbaseSSRUtils';

interface ArchbaseTanStackProviderProps {
  children: ReactNode;
  /** Custom QueryClient instance */
  queryClient?: QueryClient;
  /** Server-side dehydrated state */
  dehydratedState?: any;
  /** Default stale time for queries */
  defaultStaleTime?: number;
  /** Default cache time for queries */
  defaultCacheTime?: number;
}

/**
 * TanStack Query provider with SSR support for Archbase
 */
export function ArchbaseTanStackProvider({
  children,
  queryClient: providedQueryClient,
  dehydratedState,
  defaultStaleTime = 1000 * 60 * 5, // 5 minutes
  defaultCacheTime = 1000 * 60 * 10, // 10 minutes
}: ArchbaseTanStackProviderProps) {
  const { isHydrated, serverData } = useArchbaseSSR();

  // Create or use provided query client
  const [queryClient] = React.useState(() => {
    if (providedQueryClient) return providedQueryClient;

    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: defaultStaleTime,
          gcTime: defaultCacheTime, // TanStack Query v5 uses gcTime instead of cacheTime
          refetchOnWindowFocus: false,
          retry: (failureCount, error: any) => {
            // Don't retry on 4xx errors
            if (error?.status >= 400 && error?.status < 500) {
              return false;
            }
            return failureCount < 3;
          }
        },
        mutations: {
          retry: 1
        }
      }
    });
  });

  // Handle SSR hydration
  React.useEffect(() => {
    if (isHydrated && (dehydratedState || serverData?.queryState)) {
      const stateToHydrate = dehydratedState || serverData.queryState;
      
      if (typeof stateToHydrate === 'string') {
        const parsedState = deserializeFromSSR(stateToHydrate);
        if (parsedState) {
          hydrate(queryClient, parsedState);
        }
      } else {
        hydrate(queryClient, stateToHydrate);
      }
    }
  }, [isHydrated, dehydratedState, serverData, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}

/**
 * Hook to create TanStack queries that work with Archbase DataSources
 */
export function useArchbaseQuery<TData = unknown, TError = Error>(
  key: string | readonly unknown[],
  fetchFn: () => Promise<TData>,
  options: {
    /** Archbase DataSource to sync with */
    dataSource?: any;
    /** Auto-update DataSource when query succeeds */
    syncWithDataSource?: boolean;
    /** Transform data before setting to DataSource */
    transformForDataSource?: (data: TData) => any[];
    /** SSR initial data */
    ssrData?: TData;
    /** Enable SSR for this query */
    ssr?: boolean;
  } & Omit<any, 'queryKey' | 'queryFn'> = {}
) {
  const {
    dataSource,
    syncWithDataSource = false,
    transformForDataSource,
    ssrData,
    ssr = true,
    ...queryOptions
  } = options;

  const { isHydrated, serverData } = useArchbaseSSR();

  // Get initial data from SSR if available
  const getInitialData = React.useCallback(() => {
    if (!ssr) return undefined;
    
    if (ssrData) return ssrData;
    
    if (serverData?.queries) {
      const queryKey = Array.isArray(key) ? key.join(':') : String(key);
      return serverData.queries[queryKey as keyof typeof serverData.queries];
    }
    
    return undefined;
  }, [ssr, ssrData, serverData, key]);

  const query = React.useMemo(() => ({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: fetchFn,
    enabled: isServer ? false : (queryOptions.enabled ?? true),
    initialData: getInitialData(),
    ...queryOptions
  }), [key, fetchFn, queryOptions, getInitialData]);

  // Mock react-query hook behavior
  const [data, setData] = React.useState(getInitialData());
  const [isLoading, setIsLoading] = React.useState(!data);
  const [error, setError] = React.useState<TError | null>(null);

  // Sync with DataSource when data changes
  React.useEffect(() => {
    if (!syncWithDataSource || !dataSource || !data) return;

    try {
      let recordsToSet = data as any;
      
      if (transformForDataSource) {
        recordsToSet = transformForDataSource(data);
      } else if (Array.isArray(data)) {
        recordsToSet = data;
      } else if (data && typeof data === 'object' && 'data' in data) {
        recordsToSet = (data as any).data;
      }

      if (Array.isArray(recordsToSet)) {
        (dataSource as any).setRecords(recordsToSet);
      }
    } catch (err) {
      console.error('Failed to sync query data with DataSource:', err);
    }
  }, [data, dataSource, syncWithDataSource, transformForDataSource]);

  return {
    data,
    isLoading,
    error,
    isSuccess: !isLoading && !error,
    isError: !!error,
    refetch: async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchFn();
        setData(result);
        return { data: result };
      } catch (err) {
        setError(err as TError);
        throw err;
      } finally {
        setIsLoading(false);
      }
    }
  };
}

/**
 * Utility to serialize QueryClient state for SSR
 */
export function serializeQueryClientState(queryClient: QueryClient): string {
  const dehydratedState = dehydrate(queryClient);
  return serializeForSSR(dehydratedState);
}

/**
 * Server-side utility to prepare query data
 */
export async function prepareServerQueries(
  queryClient: QueryClient,
  queries: Array<{
    key: string | readonly unknown[];
    fetchFn: () => Promise<unknown>;
  }>
): Promise<void> {
  if (!isServer) return;

  const promises = queries.map(async ({ key, fetchFn }) => {
    const queryKey = Array.isArray(key) ? key : [key];
    
    try {
      await queryClient.prefetchQuery({
        queryKey,
        queryFn: fetchFn,
        staleTime: Infinity // Don't refetch during SSR
      });
    } catch (error) {
      console.error(`Failed to prefetch query ${JSON.stringify(queryKey)}:`, error);
    }
  });

  await Promise.allSettled(promises);
}

/**
 * Higher-order component to provide TanStack Start integration
 */
export function withArchbaseTanStack<P extends object>(
  Component: React.ComponentType<P>,
  options: {
    queryClient?: QueryClient;
    prefetchQueries?: (props: P) => Array<{
      key: string | readonly unknown[];
      fetchFn: () => Promise<unknown>;
    }>;
  } = {}
) {
  const { queryClient, prefetchQueries } = options;

  function WrappedComponent(props: P) {
    const [defaultQueryClient] = React.useState(() => 
      queryClient || new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 10 // 10 minutes
          }
        }
      })
    );

    // Prefetch queries on server
    React.useEffect(() => {
      if (isServer && prefetchQueries) {
        const queries = prefetchQueries(props);
        prepareServerQueries(defaultQueryClient, queries);
      }
    }, [props]);

    return (
      <ArchbaseTanStackProvider queryClient={defaultQueryClient}>
        <Component {...props} />
      </ArchbaseTanStackProvider>
    );
  }

  WrappedComponent.displayName = `withArchbaseTanStack(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}
