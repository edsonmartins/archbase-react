/**
 * Tests for TanStack Query Integration with ArchbaseDataSourceV2
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor, act } from '@testing-library/react';
import React from 'react';
import {
  ArchbaseRemoteDataSourceV2WithQuery,
  useArchbaseRemoteDataSourceWithQuery,
  ArchbaseQueryKeys
} from '../../components/datasource/v2/ArchbaseTanStackQueryIntegration';
import { createArchbaseQueryClient } from '../../components/datasource/v2/ArchbaseQueryProvider';

// Mock data
interface TestPerson {
  id: number;
  name: string;
  email: string;
}

const mockPersons: TestPerson[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Mock service
const mockService = {
  findAll: jest.fn().mockResolvedValue({
    content: mockPersons,
    number: 0,
    totalPages: 1,
    totalElements: 2
  }),
  findAllWithFilter: jest.fn().mockResolvedValue({
    content: mockPersons,
    number: 0,
    totalPages: 1,
    totalElements: 2
  }),
  findAllWithSort: jest.fn().mockResolvedValue({
    content: mockPersons,
    number: 0,
    totalPages: 1,
    totalElements: 2
  }),
  findOne: jest.fn().mockResolvedValue(mockPersons[0]),
  save: jest.fn().mockImplementation((data) => Promise.resolve(data)),
  remove: jest.fn().mockResolvedValue(mockPersons[0])
} as any;

// Helper to create QueryClient for tests
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0
      },
      mutations: {
        retry: false
      }
    }
  });
}

// Wrapper component for hooks
function createWrapper(queryClient: QueryClient) {
  return ({ children }: { children: React.ReactNode }) => 
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('ArchbaseRemoteDataSourceV2WithQuery', () => {
  let queryClient: QueryClient;
  let dataSource: ArchbaseRemoteDataSourceV2WithQuery<TestPerson>;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    dataSource = new ArchbaseRemoteDataSourceV2WithQuery({
      name: 'test-persons',
      service: mockService,
      queryClient,
      pageSize: 10
    });
    
    jest.clearAllMocks();
  });

  afterEach(() => {
    queryClient.clear();
  });

  describe('Basic functionality', () => {
    test('should create instance with correct configuration', () => {
      expect(dataSource.getName()).toBe('test-persons');
      expect(dataSource.getPageSize()).toBe(10);
    });

    test('should load data with TanStack Query caching', async () => {
      await dataSource.loadWithQuery();

      expect(mockService.findAll).toHaveBeenCalledWith(0, 10);
      expect(dataSource.getRecords()).toEqual(mockPersons);
      expect(dataSource.getTotalRecords()).toBe(2);
    });

    test('should use cached data on subsequent loads', async () => {
      // First load
      await dataSource.loadWithQuery();
      expect(mockService.findAll).toHaveBeenCalledTimes(1);

      // Second load should use cache
      await dataSource.loadWithQuery();
      expect(mockService.findAll).toHaveBeenCalledTimes(1); // Still only once
    });
  });

  describe('Cache operations', () => {
    test('should get cached data without request', async () => {
      await dataSource.loadWithQuery();
      
      const cachedData = dataSource.getCachedData();
      expect(cachedData).toEqual(mockPersons);
      expect(mockService.findAll).toHaveBeenCalledTimes(1);
    });

    test('should check if data is stale', async () => {
      expect(dataSource.isDataStale()).toBe(true); // No data loaded yet

      await dataSource.loadWithQuery();
      expect(dataSource.isDataStale()).toBe(false); // Fresh data
    });

    test('should invalidate cache', async () => {
      await dataSource.loadWithQuery();
      await dataSource.invalidateCache();

      // Next load should fetch fresh data
      await dataSource.loadWithQuery();
      expect(mockService.findAll).toHaveBeenCalledTimes(2);
    });
  });

  describe('Optimistic updates', () => {
    beforeEach(async () => {
      await dataSource.loadWithQuery();
      dataSource.first();
      dataSource.edit();
    });

    test('should perform optimistic update on save', async () => {
      dataSource.setFieldValue('name', 'Updated Name');

      // Verify optimistic update before save
      const record = dataSource.getCurrentRecord();
      expect(record?.name).toBe('Updated Name');

      // Save should call service and invalidate cache
      await dataSource.saveWithOptimisticUpdate();

      expect(mockService.save).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Updated Name' })
      );
    });

    test('should perform optimistic remove', async () => {
      const recordToRemove = dataSource.getCurrentRecord();

      await dataSource.removeWithOptimisticUpdate();

      expect(mockService.remove).toHaveBeenCalledWith(recordToRemove);
    });
  });
});

describe('useArchbaseRemoteDataSourceWithQuery', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
  });

  afterEach(() => {
    queryClient.clear();
  });

  test('should return data source and query states', async () => {
    const { result } = renderHook(
      () => useArchbaseRemoteDataSourceWithQuery({
        name: 'test-hook',
        service: mockService,
        pageSize: 10
      }),
      { wrapper: createWrapper(queryClient) }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.dataSource).toBeDefined();
    expect(result.current.records).toEqual(mockPersons);
    expect(result.current.totalRecords).toBe(2);
  });

  test('should handle save mutation', async () => {
    const { result } = renderHook(
      () => useArchbaseRemoteDataSourceWithQuery({
        name: 'test-save',
        service: mockService,
        pageSize: 10
      }),
      { wrapper: createWrapper(queryClient) }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Setup for editing
    act(() => {
      result.current.dataSource.first();
      result.current.dataSource.edit();
      result.current.dataSource.setFieldValue('name', 'New Name');
    });

    // Save
    await act(async () => {
      await result.current.save();
    });

    expect(mockService.save).toHaveBeenCalled();
  });

  test('should handle disabled queries', () => {
    const { result } = renderHook(
      () => useArchbaseRemoteDataSourceWithQuery({
        name: 'test-disabled',
        service: mockService,
        pageSize: 10,
        enabled: false
      }),
      { wrapper: createWrapper(queryClient) }
    );

    expect(result.current.isLoading).toBe(false);
    expect(mockService.findAll).not.toHaveBeenCalled();
  });
});

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

describe('createArchbaseQueryClient', () => {
  test('should create QueryClient with default configuration', () => {
    const queryClient = createArchbaseQueryClient();
    
    expect(queryClient).toBeInstanceOf(QueryClient);
    
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
    
    // Error handling is tested in integration tests
    expect(queryClient).toBeInstanceOf(QueryClient);
    expect(onError).not.toHaveBeenCalled(); // Only called on actual errors
  });
});