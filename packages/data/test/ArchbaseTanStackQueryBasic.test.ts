/**
 * Basic tests for TanStack Query Integration components
 */

import {
  ArchbaseQueryKeys,
  DEFAULT_TANSTACK_CONFIG
} from '../src/datasource/v2/ArchbaseTanStackQueryIntegration';
import { createArchbaseQueryClient } from '../src/datasource/v2/ArchbaseQueryProvider';

describe('ArchbaseQueryKeys', () => {
  test('should generate consistent query keys', () => {
    const baseKey = ArchbaseQueryKeys.all;
    expect(baseKey).toEqual(['archbase']);

    const datasourceKey = ArchbaseQueryKeys.datasource('test');
    expect(datasourceKey).toEqual(['archbase', 'datasource', 'test']);

    const recordsKey = ArchbaseQueryKeys.records('test', undefined, 1);
    expect(recordsKey).toEqual(['archbase', 'datasource', 'test', 'records', { filter: undefined, page: 1 }]);

    const recordKey = ArchbaseQueryKeys.record('test', 123);
    expect(recordKey).toEqual(['archbase', 'datasource', 'test', 'record', 123]);

    const countKey = ArchbaseQueryKeys.count('test', undefined);
    expect(countKey).toEqual(['archbase', 'datasource', 'test', 'count', { filter: undefined }]);
  });
});

describe('DEFAULT_TANSTACK_CONFIG', () => {
  test('should have correct default values', () => {
    expect(DEFAULT_TANSTACK_CONFIG.cacheTime).toBe(5 * 60 * 1000); // 5 minutes
    expect(DEFAULT_TANSTACK_CONFIG.staleTime).toBe(30 * 1000); // 30 seconds
    expect(DEFAULT_TANSTACK_CONFIG.refetchOnWindowFocus).toBe(false);
    expect(DEFAULT_TANSTACK_CONFIG.refetchOnReconnect).toBe(true);
    expect(DEFAULT_TANSTACK_CONFIG.retry).toBe(3);
    expect(DEFAULT_TANSTACK_CONFIG.refetchInterval).toBe(false);
  });
});

describe('createArchbaseQueryClient', () => {
  test('should create QueryClient with default configuration', () => {
    const queryClient = createArchbaseQueryClient();
    
    expect(queryClient).toBeDefined();
    expect(queryClient.getDefaultOptions).toBeDefined();
    
    const defaultOptions = queryClient.getDefaultOptions();
    expect(defaultOptions.queries?.staleTime).toBe(30 * 1000);
    expect(defaultOptions.queries?.gcTime).toBe(5 * 60 * 1000);
    expect(defaultOptions.queries?.retry).toBe(3);
  });

  test('should create QueryClient with custom configuration', () => {
    const customConfig = {
      defaultStaleTime: 60 * 1000,
      defaultCacheTime: 10 * 60 * 1000,
      defaultRetry: 5
    };
    
    const queryClient = createArchbaseQueryClient(customConfig);
    
    const defaultOptions = queryClient.getDefaultOptions();
    expect(defaultOptions.queries?.staleTime).toBe(60 * 1000);
    expect(defaultOptions.queries?.gcTime).toBe(10 * 60 * 1000);
    expect(defaultOptions.queries?.retry).toBe(5);
  });

  test('should handle global error callback', () => {
    const onError = jest.fn();
    const queryClient = createArchbaseQueryClient({ onError });
    
    expect(queryClient).toBeDefined();
    expect(onError).not.toHaveBeenCalled(); // Only called on actual errors
  });
});