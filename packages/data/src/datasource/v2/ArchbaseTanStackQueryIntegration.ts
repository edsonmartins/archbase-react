/**
 * TanStack Query Integration for ArchbaseRemoteDataSourceV2
 * 
 * This module provides integration between ArchbaseRemoteDataSourceV2 and TanStack Query
 * for advanced caching, synchronization, and offline capabilities.
 */

import { 
  useQuery, 
  useMutation, 
  useQueryClient, 
  QueryClient,
  QueryKey,
  UseQueryOptions,
  UseMutationOptions 
} from '@tanstack/react-query';
import { ArchbaseRemoteDataSourceV2 } from './ArchbaseRemoteDataSourceV2';
import { ArchbaseRemoteApiService } from '../../service/ArchbaseRemoteApiService';
import { ArchbaseQueryFilter } from '@archbase/core';

/**
 * Configuration for TanStack Query integration
 */
export interface ArchbaseTanStackQueryConfig {
  /** Cache time in milliseconds (default: 5 minutes) */
  cacheTime?: number;
  /** Stale time in milliseconds (default: 30 seconds) */
  staleTime?: number;
  /** Refetch on window focus (default: false) */
  refetchOnWindowFocus?: boolean;
  /** Refetch on reconnect (default: true) */
  refetchOnReconnect?: boolean;
  /** Retry count (default: 3) */
  retry?: number;
  /** Enable background updates (default: true) */
  refetchInterval?: number | false;
}

/**
 * Default TanStack Query configuration
 */
export const DEFAULT_TANSTACK_CONFIG: ArchbaseTanStackQueryConfig = {
  cacheTime: 5 * 60 * 1000,     // 5 minutes
  staleTime: 30 * 1000,         // 30 seconds
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  retry: 3,
  refetchInterval: false
};

/**
 * Query keys factory for consistent caching
 */
export class ArchbaseQueryKeys {
  private static base = 'archbase' as const;

  static all = [this.base] as const;
  
  static datasource = (name: string) => 
    [...this.all, 'datasource', name] as const;
    
  static records = (name: string, filter?: ArchbaseQueryFilter, page?: number) => 
    [...this.datasource(name), 'records', { filter, page }] as const;
    
  static record = (name: string, id: any) => 
    [...this.datasource(name), 'record', id] as const;
    
  static count = (name: string, filter?: ArchbaseQueryFilter) => 
    [...this.datasource(name), 'count', { filter }] as const;
}

/**
 * Enhanced RemoteDataSource with TanStack Query integration
 */
export class ArchbaseRemoteDataSourceV2WithQuery<T> extends ArchbaseRemoteDataSourceV2<T> {
  private queryClient: QueryClient;
  private queryConfig: ArchbaseTanStackQueryConfig;

  constructor(config: {
    name: string;
    service: ArchbaseRemoteApiService<T, any>;
    queryClient: QueryClient;
    pageSize?: number;
    queryConfig?: ArchbaseTanStackQueryConfig;
    onStateChange?: (prevRecords: T[], newRecords: T[]) => void;
  }) {
    super({
      name: config.name,
      service: config.service,
      pageSize: config.pageSize,
      onStateChange: config.onStateChange
    });
    
    this.queryClient = config.queryClient;
    this.queryConfig = { ...DEFAULT_TANSTACK_CONFIG, ...config.queryConfig };
  }

  /**
   * Load data with TanStack Query caching
   */
  async loadWithQuery(filter?: ArchbaseQueryFilter, page?: number): Promise<void> {
    const queryKey = ArchbaseQueryKeys.records(this.getName(), filter, page);
    
    try {
      const result = await this.queryClient.fetchQuery({
        queryKey,
        queryFn: () => {
          if (filter) {
            // Use the service's filter method
            return (this as any).getDataWithFilter(filter, page || 0);
          } else {
            // Use the service's no-filter method  
            return (this as any).getDataWithoutFilter(page || 0);
          }
        },
        staleTime: this.queryConfig.staleTime,
        gcTime: this.queryConfig.cacheTime, // Updated from cacheTime to gcTime for v5
        retry: this.queryConfig.retry
      });

      // The result should already be processed by getDataWithFilter/getDataWithoutFilter
      // which calls setRecords internally
      
    } catch (error) {
      console.error('Error loading data with TanStack Query:', error);
      throw error;
    }
  }

  /**
   * Save record with optimistic updates
   */
  async saveWithOptimisticUpdate(): Promise<T> {
    const currentRecord = this.getCurrentRecord();
    if (!currentRecord) {
      throw new Error('No current record to save');
    }

    const isInserting = this.isInserting();
    const recordId = isInserting ? null : (currentRecord as any).id;
    
    // Optimistic update
    const queryKey = ArchbaseQueryKeys.records(this.getName());
    const previousData = this.queryClient.getQueryData(queryKey);
    
    if (!isInserting) {
      // Update existing record optimistically
      this.queryClient.setQueryData(queryKey, (old: any) => {
        if (!old?.content) return old;
        return {
          ...old,
          content: old.content.map((item: T) => 
            (item as any).id === recordId ? { ...currentRecord } : item
          )
        };
      });
    }

    try {
      // Perform actual save
      const savedRecord = await super.save();
      
      // Invalidate related queries to refetch
      await this.queryClient.invalidateQueries({
        queryKey: ArchbaseQueryKeys.datasource(this.getName())
      });
      
      return savedRecord;
    } catch (error) {
      // Rollback optimistic update on error
      this.queryClient.setQueryData(queryKey, previousData);
      throw error;
    }
  }

  /**
   * Remove record with optimistic updates
   */
  async removeWithOptimisticUpdate(): Promise<T | undefined> {
    const currentRecord = this.getCurrentRecord();
    if (!currentRecord) {
      throw new Error('No current record to remove');
    }

    const recordId = (currentRecord as any).id;
    const queryKey = ArchbaseQueryKeys.records(this.getName());
    const previousData = this.queryClient.getQueryData(queryKey);
    
    // Optimistic update - remove record from cache
    this.queryClient.setQueryData(queryKey, (old: any) => {
      if (!old?.content) return old;
      return {
        ...old,
        content: old.content.filter((item: T) => (item as any).id !== recordId),
        totalElements: (old.totalElements || 0) - 1
      };
    });

    try {
      // Perform actual removal
      const removedRecord = await super.remove();
      
      // Invalidate related queries
      await this.queryClient.invalidateQueries({
        queryKey: ArchbaseQueryKeys.datasource(this.getName())
      });
      
      return removedRecord;
    } catch (error) {
      // Rollback optimistic update on error
      this.queryClient.setQueryData(queryKey, previousData);
      throw error;
    }
  }

  /**
   * Prefetch next page for better UX
   */
  async prefetchNextPage(): Promise<void> {
    // For simplicity, we'll just mark this as a no-op for now
    // In a real implementation, you'd need access to current page state
    console.log('prefetchNextPage called - implementation pending');
  }

  /**
   * Invalidate all cache for this datasource
   */
  async invalidateCache(): Promise<void> {
    await this.queryClient.invalidateQueries({
      queryKey: ArchbaseQueryKeys.datasource(this.getName())
    });
  }

  /**
   * Get cached data without triggering a request
   */
  getCachedData(filter?: ArchbaseQueryFilter, page?: number): T[] | undefined {
    const queryKey = ArchbaseQueryKeys.records(this.getName(), filter, page);
    const data = this.queryClient.getQueryData(queryKey) as any;
    return data?.content;
  }

  /**
   * Check if data is stale and needs refresh
   */
  isDataStale(filter?: ArchbaseQueryFilter, page?: number): boolean {
    const queryKey = ArchbaseQueryKeys.records(this.getName(), filter, page);
    const query = this.queryClient.getQueryState(queryKey);
    // Check if query exists and is stale
    return query ? (Date.now() - query.dataUpdatedAt) > (this.queryConfig.staleTime || 30000) : true;
  }
}

/**
 * Result type for useArchbaseRemoteDataSourceWithQuery hook
 */
export interface UseArchbaseRemoteDataSourceWithQueryResult<T> {
  dataSource: ArchbaseRemoteDataSourceV2WithQuery<T>;
  // Query states
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isRefetching: boolean;
  // Data
  records: T[];
  currentRecord: T | undefined;
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  // Actions
  refetch: () => Promise<any>;
  save: () => Promise<T>;
  remove: () => Promise<T | undefined>;
  invalidateCache: () => Promise<void>;
  prefetchNextPage: () => Promise<void>;
  // Mutation states
  isSaving: boolean;
  isRemoving: boolean;
  saveError: Error | null;
  removeError: Error | null;
}

/**
 * React Hook for RemoteDataSource with TanStack Query
 */
export function useArchbaseRemoteDataSourceWithQuery<T>(config: {
  name: string;
  service: ArchbaseRemoteApiService<T, any>;
  pageSize?: number;
  queryConfig?: ArchbaseTanStackQueryConfig;
  filter?: ArchbaseQueryFilter;
  enabled?: boolean;
}): UseArchbaseRemoteDataSourceWithQueryResult<T> {
  const queryClient = useQueryClient();
  const queryConfig = { ...DEFAULT_TANSTACK_CONFIG, ...config.queryConfig };
  
  // Create datasource instance
  const dataSource = new ArchbaseRemoteDataSourceV2WithQuery<T>({
    name: config.name,
    service: config.service,
    queryClient,
    pageSize: config.pageSize,
    queryConfig
  });

  // Main data query
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isRefetching
  } = useQuery({
    queryKey: ArchbaseQueryKeys.records(config.name, config.filter),
    queryFn: async () => {
      // Use the dataSource's own loading methods
      if (config.filter) {
        return await (dataSource as any).getDataWithFilter(config.filter, 0);
      } else {
        return await (dataSource as any).getDataWithoutFilter(0);
      }
    },
    staleTime: queryConfig.staleTime,
    gcTime: queryConfig.cacheTime,
    refetchOnWindowFocus: queryConfig.refetchOnWindowFocus,
    refetchOnReconnect: queryConfig.refetchOnReconnect,
    retry: queryConfig.retry,
    enabled: config.enabled !== false
  });

  // Data is already loaded into dataSource by the getDataWith* methods

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: () => dataSource.saveWithOptimisticUpdate(),
    onSuccess: () => {
      // Additional success handling if needed
    },
    onError: (error) => {
      console.error('Save failed:', error);
    }
  });

  // Remove mutation
  const removeMutation = useMutation({
    mutationFn: () => dataSource.removeWithOptimisticUpdate(),
    onSuccess: () => {
      // Additional success handling if needed
    },
    onError: (error) => {
      console.error('Remove failed:', error);
    }
  });

  const result: UseArchbaseRemoteDataSourceWithQueryResult<T> = {
    dataSource,
    
    // Query states
    isLoading,
    isError,
    error: error as Error | null,
    isRefetching,
    
    // Data
    records: (data?.content || []) as T[],
    currentRecord: dataSource.getCurrentRecord(),
    totalRecords: data?.totalElements || 0,
    currentPage: data?.number || 0,
    totalPages: data?.totalPages || 1,
    
    // Actions
    refetch: refetch as () => Promise<any>,
    save: saveMutation.mutateAsync as () => Promise<T>,
    remove: removeMutation.mutateAsync as () => Promise<T | undefined>,
    invalidateCache: () => dataSource.invalidateCache(),
    prefetchNextPage: () => dataSource.prefetchNextPage(),
    
    // Mutation states
    isSaving: saveMutation.isPending,
    isRemoving: removeMutation.isPending,
    saveError: saveMutation.error as Error | null,
    removeError: removeMutation.error as Error | null
  };
  
  return result;
}

/**
 * Hook for real-time data synchronization
 */
export function useArchbaseRealTimeSync<T>(
  dataSourceName: string,
  options?: {
    interval?: number;
    enabled?: boolean;
  }
) {
  const queryClient = useQueryClient();
  const { interval = 30000, enabled = true } = options || {};

  React.useEffect(() => {
    if (!enabled) return;

    const intervalId = setInterval(() => {
      // Invalidate queries that might be stale
      queryClient.invalidateQueries({
        queryKey: ArchbaseQueryKeys.datasource(dataSourceName),
        refetchType: 'none' // Only mark as stale, don't refetch immediately
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [queryClient, dataSourceName, interval, enabled]);
}

// Re-export React for hooks
import React from 'react';