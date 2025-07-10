import { useEffect, useRef, useState } from 'react';
import { emitDebugInfo } from '../debug/ArchbaseDebugPanel';

interface DataSourceDebugOptions {
  /** Enable automatic operation logging */
  logOperations?: boolean;
  /** Enable state change monitoring */
  monitorState?: boolean;
  /** Enable performance tracking */
  trackPerformance?: boolean;
  /** Maximum number of operations to keep in history */
  maxHistory?: number;
}

interface DataSourceOperation {
  id: string;
  timestamp: number;
  operation: string;
  args?: any[];
  duration?: number;
  result?: any;
  error?: any;
}

/**
 * Hook for debugging DataSource operations and state
 */
export function useArchbaseDataSourceDebug<T, ID>(
  dataSource: any,
  name: string,
  options: DataSourceDebugOptions = {}
) {
  const {
    logOperations = true,
    monitorState = true,
    trackPerformance = true,
    maxHistory = 100
  } = options;

  const [operations, setOperations] = useState<DataSourceOperation[]>([]);
  const [currentState, setCurrentState] = useState<any>(null);
  const operationsRef = useRef<DataSourceOperation[]>([]);
  const originalMethodsRef = useRef<Map<string, Function>>(new Map());

  const addOperation = (operation: Omit<DataSourceOperation, 'id' | 'timestamp'>) => {
    const newOperation: DataSourceOperation = {
      ...operation,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };

    operationsRef.current = [newOperation, ...operationsRef.current].slice(0, maxHistory);
    setOperations([...operationsRef.current]);

    if (logOperations) {
      emitDebugInfo({
        type: 'state',
        message: `DataSource ${name}: ${operation.operation}`,
        data: {
          operation: operation.operation,
          args: operation.args,
          duration: operation.duration,
          result: operation.result,
          error: operation.error
        }
      });
    }
  };

  const updateState = () => {
    if (!monitorState || !dataSource) return;

    try {
      const state = {
        recordCount: dataSource.getRecordCount?.(),
        currentRecord: dataSource.getCurrentRecord?.(),
        recNo: dataSource.getRecNo?.(),
        state: dataSource.getState?.(),
        isActive: dataSource.isActive?.(),
        isBrowsing: dataSource.isBrowsing?.(),
        isEditing: dataSource.isEditing?.(),
        isInserting: dataSource.isInserting?.(),
        hasChanges: dataSource.hasChanges?.(),
        version: dataSource._isArchbaseDataSourceV2 ? 'v2' : 
                 dataSource._isArchbaseDataSource ? 'v1' : 'unknown'
      };

      setCurrentState(state);
    } catch (error) {
      console.warn('Failed to update DataSource state:', error);
    }
  };

  // Setup monitoring
  useEffect(() => {
    if (!dataSource) return;

    const unsubscribes: Array<() => void> = [];

    // Monitor state changes
    if (monitorState && typeof dataSource.addListener === 'function') {
      const stateListener = () => {
        updateState();
        addOperation({
          operation: 'stateChanged',
          args: []
        });
      };

      dataSource.addListener(stateListener);
      unsubscribes.push(() => {
        if (typeof dataSource.removeListener === 'function') {
          dataSource.removeListener(stateListener);
        }
      });

      // Initial state
      updateState();
    }

    // Intercept operations
    if (logOperations || trackPerformance) {
      const methodsToIntercept = [
        'post', 'edit', 'delete', 'cancel', 'append', 'insert', 'remove',
        'first', 'last', 'next', 'prior', 'gotoRecNo', 'locate',
        'applyFilter', 'clearFilter', 'sort', 'refresh'
      ];

      methodsToIntercept.forEach(methodName => {
        if (typeof dataSource[methodName] === 'function') {
          const originalMethod = dataSource[methodName];
          originalMethodsRef.current.set(methodName, originalMethod);

          dataSource[methodName] = function(...args: any[]) {
            const startTime = trackPerformance ? performance.now() : 0;
            let result: any;
            let error: any;

            try {
              result = originalMethod.apply(this, args);
              
              // Handle async results
              if (result && typeof result.then === 'function') {
                result.then((asyncResult: any) => {
                  const duration = trackPerformance ? performance.now() - startTime : undefined;
                  addOperation({
                    operation: methodName,
                    args,
                    duration,
                    result: asyncResult
                  });
                }).catch((asyncError: any) => {
                  const duration = trackPerformance ? performance.now() - startTime : undefined;
                  addOperation({
                    operation: methodName,
                    args,
                    duration,
                    error: asyncError
                  });
                });
              } else {
                const duration = trackPerformance ? performance.now() - startTime : undefined;
                addOperation({
                  operation: methodName,
                  args,
                  duration,
                  result
                });
              }
            } catch (syncError) {
              error = syncError;
              const duration = trackPerformance ? performance.now() - startTime : undefined;
              addOperation({
                operation: methodName,
                args,
                duration,
                error
              });
              throw syncError;
            }

            return result;
          };
        }
      });

      // Cleanup function to restore original methods
      unsubscribes.push(() => {
        if (dataSource) {
          originalMethodsRef.current.forEach((originalMethod, methodName) => {
            if (dataSource[methodName]) {
              dataSource[methodName] = originalMethod;
            }
          });
        }
        originalMethodsRef.current.clear();
      });
    }

    return () => {
      unsubscribes.forEach(fn => fn());
    };
  }, [dataSource, name, logOperations, monitorState, trackPerformance, maxHistory]);

  const getPerformanceStats = () => {
    const opsByMethod = operations.reduce((acc, op) => {
      if (!acc[op.operation]) {
        acc[op.operation] = [];
      }
      if (op.duration !== undefined) {
        acc[op.operation]!.push(op.duration);
      }
      return acc;
    }, {} as Record<string, number[]>);

    return Object.entries(opsByMethod).map(([method, durations]) => {
      const avg = durations.reduce((sum, d) => sum + d, 0) / durations.length;
      const min = Math.min(...durations);
      const max = Math.max(...durations);
      
      return {
        method,
        count: durations.length,
        avgDuration: avg,
        minDuration: min,
        maxDuration: max,
        totalDuration: durations.reduce((sum, d) => sum + d, 0)
      };
    });
  };

  const getOperationHistory = (methodName?: string) => {
    if (!methodName) return operations;
    return operations.filter(op => op.operation === methodName);
  };

  const clearHistory = () => {
    operationsRef.current = [];
    setOperations([]);
  };

  const exportDebugData = () => {
    return {
      dataSourceName: name,
      currentState,
      operations: operations,
      performanceStats: getPerformanceStats(),
      exportedAt: new Date().toISOString()
    };
  };

  return {
    operations,
    currentState,
    performanceStats: getPerformanceStats(),
    getOperationHistory,
    clearHistory,
    exportDebugData
  };
}

/**
 * Hook to register multiple DataSources for debugging
 */
export function useArchbaseDataSourceRegistry() {
  const [dataSources, setDataSources] = useState<Array<{
    name: string;
    dataSource: any;
    debugHook: ReturnType<typeof useArchbaseDataSourceDebug>;
  }>>([]);

  const registerDataSource = (name: string, dataSource: any, options?: DataSourceDebugOptions) => {
    setDataSources(prev => {
      const existing = prev.find(ds => ds.name === name);
      if (existing) {
        return prev.map(ds => 
          ds.name === name 
            ? { ...ds, dataSource }
            : ds
        );
      }
      
      return [...prev, {
        name,
        dataSource,
        debugHook: {} as any // Will be populated by the hook
      }];
    });
  };

  const unregisterDataSource = (name: string) => {
    setDataSources(prev => prev.filter(ds => ds.name !== name));
  };

  const getDataSource = (name: string) => {
    return dataSources.find(ds => ds.name === name);
  };

  const getAllDataSources = () => {
    return dataSources;
  };

  const exportAllDebugData = () => {
    return {
      dataSources: dataSources.map(ds => ({
        name: ds.name,
        debugData: ds.debugHook
      })),
      exportedAt: new Date().toISOString()
    };
  };

  return {
    dataSources,
    registerDataSource,
    unregisterDataSource,
    getDataSource,
    getAllDataSources,
    exportAllDebugData
  };
}