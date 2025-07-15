import { useEffect, useState, useRef } from 'react';
import { useArchbaseSSR } from '../providers/ArchbaseSSRProvider';
import { ArchbaseSSRDataSource } from '../datasource/ArchbaseSSRDataSource';
import { isServer } from '../utils/ArchbaseSSRUtils';

interface UseArchbaseSSRDataSourceOptions<T, ID> {
  /** Initial records for SSR */
  initialRecords?: T[];
  /** Server data key in SSR context */
  serverDataKey?: string;
  /** Auto-hydrate from server data */
  autoHydrate?: boolean;
  /** Fallback records if server data fails */
  fallbackRecords?: T[];
  /** Custom serialization/deserialization */
  serializer?: {
    serialize: (data: any) => string;
    deserialize: (data: string) => any;
  };
}

/**
 * SSR-compatible hook for DataSource management
 */
export function useArchbaseSSRDataSource<T extends Record<string, any>, ID>(
  name: string,
  options: UseArchbaseSSRDataSourceOptions<T, ID> = {}
) {
  const {
    initialRecords = [],
    serverDataKey,
    autoHydrate = true,
    fallbackRecords = [],
    serializer
  } = options;

  const { isHydrated, serverData } = useArchbaseSSR();
  const [dataSource] = useState(() => {
    // Create DataSource with initial data
    const ds = new ArchbaseSSRDataSource<T, ID>(name);
    
    if (isServer && initialRecords.length > 0) {
      (ds as any).setRecords(initialRecords);
    }
    
    return ds;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasHydratedRef = useRef(false);

  // Hydrate from server data
  useEffect(() => {
    if (!isHydrated || hasHydratedRef.current || !autoHydrate) return;

    hasHydratedRef.current = true;

    try {
      setIsLoading(true);
      setError(null);

      let dataToHydrate: any = null;

      // Get data from server context
      if (serverData) {
        if (serverDataKey) {
          dataToHydrate = serverData[serverDataKey];
        } else {
          dataToHydrate = serverData;
        }
      }

      // Try to deserialize if it's a string
      if (typeof dataToHydrate === 'string') {
        if (serializer?.deserialize) {
          dataToHydrate = serializer.deserialize(dataToHydrate);
        } else {
          dataSource.deserializeState(dataToHydrate);
          return;
        }
      }

      // Set records from hydrated data
      if (dataToHydrate && Array.isArray(dataToHydrate.records)) {
        (dataSource as any).setRecords(dataToHydrate.records);
        
        if (typeof dataToHydrate.currentIndex === 'number') {
          dataSource.gotoRecord(dataToHydrate.currentIndex);
        }
      } else if (fallbackRecords.length > 0) {
        (dataSource as any).setRecords(fallbackRecords);
      }

    } catch (err) {
      console.error('Failed to hydrate DataSource:', err);
      setError(err instanceof Error ? err : new Error('Hydration failed'));
      
      // Use fallback data on error
      if (fallbackRecords.length > 0) {
        (dataSource as any).setRecords(fallbackRecords);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isHydrated, serverData, serverDataKey, autoHydrate, fallbackRecords, dataSource, serializer]);

  /**
   * Serialize current DataSource state for client navigation
   */
  const serializeState = () => {
    if (serializer?.serialize) {
      return serializer.serialize(dataSource.createSnapshot());
    }
    return dataSource.serializeState();
  };

  /**
   * Restore DataSource from serialized state
   */
  const deserializeState = (serializedState: string) => {
    try {
      if (serializer?.deserialize) {
        const data = serializer.deserialize(serializedState);
        dataSource.restoreFromSnapshot(data);
      } else {
        dataSource.deserializeState(serializedState);
      }
    } catch (err) {
      console.error('Failed to deserialize DataSource state:', err);
      setError(err instanceof Error ? err : new Error('Deserialization failed'));
    }
  };

  /**
   * Get minimal state for performance-critical scenarios
   */
  const getMinimalState = () => {
    return {
      recordCount: dataSource.getRecordCount(),
      currentIndex: dataSource.getRecordIndex(),
      hasData: dataSource.hasData(),
      isActive: dataSource.isActive()
    };
  };

  /**
   * Refresh data source (useful for client-side navigation)
   */
  const refresh = async (newRecords?: T[]) => {
    setIsLoading(true);
    setError(null);

    try {
      if (newRecords) {
        (dataSource as any).setRecords(newRecords);
      } else {
        // Trigger any refresh logic
        dataSource.refreshData();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Refresh failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    dataSource,
    isLoading,
    error,
    isHydrated,
    serializeState,
    deserializeState,
    getMinimalState,
    refresh,
    // Convenience getters
    records: dataSource.getRecords(),
    currentRecord: dataSource.getCurrentRecord(),
    recordCount: dataSource.getRecordCount(),
    hasData: dataSource.hasData()
  };
}

/**
 * Hook for managing multiple DataSources with SSR
 */
export function useArchbaseSSRDataSources<T extends Record<string, any>, ID>(
  dataSources: Array<{
    name: string;
    options?: UseArchbaseSSRDataSourceOptions<T, ID>;
  }>
) {
  const { isHydrated } = useArchbaseSSR();
  const [sources] = useState(() => {
    return dataSources.map(({ name, options }) => ({
      name,
      ...useArchbaseSSRDataSource<T, ID>(name, options)
    }));
  });

  /**
   * Get DataSource by name
   */
  const getDataSource = (name: string) => {
    return sources.find(source => source.name === name);
  };

  /**
   * Serialize all DataSources
   */
  const serializeAll = () => {
    return sources.reduce((acc, source) => {
      acc[source.name] = source.serializeState();
      return acc;
    }, {} as Record<string, string>);
  };

  /**
   * Check if any DataSource is loading
   */
  const isAnyLoading = sources.some(source => source.isLoading);

  /**
   * Get all errors from DataSources
   */
  const errors = sources
    .filter(source => source.error)
    .map(source => ({ name: source.name, error: source.error }));

  return {
    sources,
    getDataSource,
    serializeAll,
    isAnyLoading,
    errors,
    isHydrated
  };
}