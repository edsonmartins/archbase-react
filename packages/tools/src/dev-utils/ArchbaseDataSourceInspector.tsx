import React, { useState, useEffect, useRef } from 'react';
import { useHotkeys } from '@mantine/hooks';
import { Accordion, Flex, Badge, Group, Text, Button, JsonInput, Select } from '@mantine/core';
import { IconDatabase, IconRefresh, IconEye, IconSettings } from '@tabler/icons-react';
import { emitDebugInfo } from '../debug/ArchbaseDebugPanel';

interface DataSourceStats {
  recordCount: number;
  currentRecordIndex: number;
  totalRecords: number;
  state: string;
  isActive: boolean;
  isBrowsing: boolean;
  isInserting: boolean;
  isEditing: boolean;
  isDeleting: boolean;
  hasChanges: boolean;
  version: 'v1' | 'v2' | 'unknown';
}

interface DataSourceOperation {
  id: string;
  timestamp: number;
  operation: string;
  details: any;
  duration?: number;
}

interface ArchbaseDataSourceInspectorProps {
  /** DataSource instances to monitor */
  dataSources?: Array<{
    name: string;
    dataSource: any; // Can be v1 or v2
  }>;
  /** Enable automatic discovery of DataSources */
  autoDiscover?: boolean;
  /** Hotkey to toggle inspector */
  hotkey?: string;
  /** Show inspector by default */
  visible?: boolean;
  /** Position of the floating window */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Maximum number of operations to track */
  maxOperations?: number;
}

/**
 * Advanced DataSource inspector with real-time monitoring
 */
export const ArchbaseDataSourceInspector: React.FC<ArchbaseDataSourceInspectorProps> = ({
  dataSources = [],
  autoDiscover = true,
  hotkey = 'ctrl+shift+D',
  visible = false,
  position = 'top-right',
  maxOperations = 50
}) => {
  const [isOpen, setIsOpen] = useState(visible);
  const [operations, setOperations] = useState<DataSourceOperation[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState<string>('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [monitoredDataSources, setMonitoredDataSources] = useState<typeof dataSources>([]);
  const operationsRef = useRef<DataSourceOperation[]>([]);

  useHotkeys([[hotkey, () => setIsOpen(!isOpen)]]);

  // Auto-discover DataSources in development
  useEffect(() => {
    if (!autoDiscover || process.env.NODE_ENV !== 'development') return;

    const discoveredDataSources: typeof dataSources = [];
    
    // Search for DataSource instances in window object
    if (typeof window !== 'undefined') {
      const searchInObject = (obj: any, path = 'window') => {
        if (!obj || typeof obj !== 'object') return;
        
        Object.keys(obj).forEach(key => {
          try {
            const value = obj[key];
            if (value && typeof value === 'object') {
              // Check if it's a DataSource (v1 or v2)
              if (value.constructor?.name?.includes('DataSource') || 
                  value._isArchbaseDataSource ||
                  (value.name && typeof value.getCurrentRecord === 'function')) {
                discoveredDataSources.push({
                  name: `${path}.${key}`,
                  dataSource: value
                });
              }
            }
          } catch (e) {
            // Ignore errors from accessing restricted properties
          }
        });
      };

      searchInObject(window);
    }

    setMonitoredDataSources([...dataSources, ...discoveredDataSources]);
  }, [dataSources, autoDiscover, refreshKey]);

  // Monitor DataSource operations
  useEffect(() => {
    const addOperation = (operation: Omit<DataSourceOperation, 'id' | 'timestamp'>) => {
      const newOperation: DataSourceOperation = {
        ...operation,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now()
      };

      operationsRef.current = [newOperation, ...operationsRef.current].slice(0, maxOperations);
      setOperations([...operationsRef.current]);

      emitDebugInfo({
        type: 'state',
        message: `DataSource ${operation.operation}`,
        data: operation.details
      });
    };

    const unsubscribes: Array<() => void> = [];

    monitoredDataSources.forEach(({ name, dataSource }) => {
      if (!dataSource) return;

      try {
        // Monitor v1/v2 DataSource events
        if (typeof dataSource.addListener === 'function') {
          const listener = () => {
            addOperation({
              operation: 'State Changed',
              details: {
                name,
                currentRecord: dataSource.getCurrentRecord?.(),
                recordCount: dataSource.getRecordCount?.(),
                state: dataSource.getState?.()
              }
            });
          };

          dataSource.addListener(listener);
          unsubscribes.push(() => dataSource.removeListener?.(listener));
        }

        // Monitor specific operations
        const originalMethods = ['post', 'edit', 'delete', 'cancel', 'append', 'insert'];
        originalMethods.forEach(method => {
          if (typeof dataSource[method] === 'function') {
            const original = dataSource[method];
            dataSource[method] = function(...args: any[]) {
              const startTime = performance.now();
              const result = original.apply(this, args);
              const duration = performance.now() - startTime;

              addOperation({
                operation: method,
                details: { name, arguments: args },
                duration
              });

              return result;
            };

            unsubscribes.push(() => {
              dataSource[method] = original;
            });
          }
        });
      } catch (error) {
        console.warn('Failed to monitor DataSource:', name, error);
      }
    });

    return () => {
      unsubscribes.forEach(fn => fn());
    };
  }, [monitoredDataSources, maxOperations]);

  const getDataSourceStats = (dataSource: any): DataSourceStats => {
    try {
      const version = dataSource._isArchbaseDataSourceV2 ? 'v2' : 
                      dataSource._isArchbaseDataSource ? 'v1' : 'unknown';

      return {
        recordCount: dataSource.getRecordCount?.() || 0,
        currentRecordIndex: dataSource.getRecordCount?.() || -1,
        totalRecords: dataSource.getRecordCount?.() || 0,
        state: dataSource.getState?.() || 'unknown',
        isActive: dataSource.isActive?.() || false,
        isBrowsing: dataSource.isBrowsing?.() || false,
        isInserting: dataSource.isInserting?.() || false,
        isEditing: dataSource.isEditing?.() || false,
        isDeleting: dataSource.isDeleting?.() || false,
        hasChanges: dataSource.hasChanges?.() || false,
        version
      };
    } catch (error) {
      return {
        recordCount: 0,
        currentRecordIndex: -1,
        totalRecords: 0,
        state: 'error',
        isActive: false,
        isBrowsing: false,
        isInserting: false,
        isEditing: false,
        isDeleting: false,
        hasChanges: false,
        version: 'unknown'
      };
    }
  };

  const getStateColor = (state: string) => {
    const colors: Record<string, string> = {
      'browsing': 'blue',
      'editing': 'orange', 
      'inserting': 'green',
      'deleting': 'red',
      'inactive': 'gray',
      'error': 'red'
    };
    return colors[state.toLowerCase()] || 'gray';
  };

  const getVersionColor = (version: string) => {
    const colors: Record<string, string> = {
      'v1': 'blue',
      'v2': 'green',
      'unknown': 'gray'
    };
    return colors[version] || 'gray';
  };

  const positionStyles = {
    'top-left': { top: 20, left: 20 },
    'top-right': { top: 20, right: 20 },
    'bottom-left': { bottom: 20, left: 20 },
    'bottom-right': { bottom: 20, right: 20 }
  };

  if (!isOpen) {
    return (
      <div
        style={{
          position: 'fixed',
          ...positionStyles[position],
          zIndex: 999999,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}
        onClick={() => setIsOpen(true)}
      >
        <IconDatabase size={16} /> DataSource Debug ({monitoredDataSources.length})
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        width: '600px',
        height: '700px',
        backgroundColor: '#1e1e1e',
        color: '#d4d4d4',
        border: '1px solid #3e3e3e',
        borderRadius: '8px',
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'monospace',
        fontSize: '12px'
      }}
    >
      {/* Header */}
      <div style={{ 
        padding: '12px', 
        borderBottom: '1px solid #3e3e3e',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Group gap="xs">
          <IconDatabase size={16} />
          <Text size="sm" fw={500}>DataSource Inspector</Text>
          <Badge size="xs" color="blue">{monitoredDataSources.length} sources</Badge>
        </Group>
        <Group gap="xs">
          <Button
            size="xs"
            variant="subtle"
            onClick={() => setRefreshKey(prev => prev + 1)}
          >
            <IconRefresh size={12} />
          </Button>
          <Button
            size="xs"
            variant="subtle"
            onClick={() => setIsOpen(false)}
          >
            ×
          </Button>
        </Group>
      </div>

      {/* DataSource Selector */}
      <div style={{ padding: '12px', borderBottom: '1px solid #3e3e3e' }}>
        <Select
          size="xs"
          placeholder="Select DataSource to inspect"
          value={selectedDataSource}
          onChange={(value: string | null) => setSelectedDataSource(value || '')}
          data={monitoredDataSources.map(ds => ({ 
            value: ds.name, 
            label: ds.name 
          }))}
        />
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Accordion multiple defaultValue={['stats', 'operations']}>
          {/* DataSource Stats */}
          <Accordion.Item value="stats">
            <Accordion.Control>
              <Group gap="xs">
                <IconEye size={14} />
                Current State
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              {selectedDataSource ? (() => {
                const dataSource = monitoredDataSources.find(ds => ds.name === selectedDataSource)?.dataSource;
                if (!dataSource) return <Text size="xs" c="dimmed">DataSource not found</Text>;
                
                const stats = getDataSourceStats(dataSource);
                return (
                  <div style={{ fontSize: '11px' }}>
                    <Group gap="xs" mb="xs">
                      <Badge size="xs" color={getVersionColor(stats.version)}>
                        {stats.version.toUpperCase()}
                      </Badge>
                      <Badge size="xs" color={getStateColor(stats.state)}>
                        {stats.state}
                      </Badge>
                      {stats.hasChanges && <Badge size="xs" color="yellow">Modified</Badge>}
                    </Group>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <div>Records: {stats.recordCount}</div>
                      <div>Current: {stats.currentRecordIndex}</div>
                      <div>Active: {stats.isActive ? 'Yes' : 'No'}</div>
                      <div>Browsing: {stats.isBrowsing ? 'Yes' : 'No'}</div>
                      <div>Editing: {stats.isEditing ? 'Yes' : 'No'}</div>
                      <div>Inserting: {stats.isInserting ? 'Yes' : 'No'}</div>
                    </div>

                    <details style={{ marginTop: '8px' }}>
                      <summary style={{ cursor: 'pointer' }}>Current Record</summary>
                      <JsonInput
                        size="xs"
                        value={JSON.stringify(dataSource.getCurrentRecord?.() || {}, null, 2)}
                        readOnly
                        autosize
                        minRows={3}
                        maxRows={10}
                        styles={{
                          input: { fontSize: '10px', fontFamily: 'monospace' }
                        }}
                      />
                    </details>
                  </div>
                );
              })() : (
                <Text size="xs" c="dimmed">Select a DataSource to view stats</Text>
              )}
            </Accordion.Panel>
          </Accordion.Item>

          {/* Recent Operations */}
          <Accordion.Item value="operations">
            <Accordion.Control>
              <Group gap="xs">
                <IconSettings size={14} />
                Recent Operations ({operations.length})
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                {operations.length === 0 ? (
                  <Text size="xs" c="dimmed">No operations recorded yet</Text>
                ) : (
                  operations.map(op => (
                    <div
                      key={op.id}
                      style={{
                        padding: '6px 8px',
                        marginBottom: '4px',
                        backgroundColor: '#2d2d2d',
                        borderRadius: '4px',
                        fontSize: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 'bold' }}>{op.operation}</span>
                        <span style={{ color: '#888' }}>
                          {new Date(op.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {op.duration && (
                        <div style={{ color: '#FFD700', fontSize: '9px' }}>
                          Duration: {op.duration.toFixed(2)}ms
                        </div>
                      )}
                      <details>
                        <summary style={{ cursor: 'pointer', fontSize: '9px', color: '#888' }}>
                          Details
                        </summary>
                        <pre style={{ 
                          fontSize: '9px', 
                          margin: '2px 0',
                          overflow: 'auto',
                          maxHeight: '80px'
                        }}>
                          {JSON.stringify(op.details, null, 2)}
                        </pre>
                      </details>
                    </div>
                  ))
                )}
              </div>
            </Accordion.Panel>
          </Accordion.Item>

          {/* All DataSources Overview */}
          <Accordion.Item value="overview">
            <Accordion.Control>
              <Group gap="xs">
                <IconDatabase size={14} />
                All DataSources ({monitoredDataSources.length})
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <div style={{ fontSize: '10px' }}>
                {monitoredDataSources.map(({ name, dataSource }) => {
                  const stats = getDataSourceStats(dataSource);
                  return (
                    <div
                      key={name}
                      style={{
                        padding: '4px 6px',
                        marginBottom: '3px',
                        backgroundColor: selectedDataSource === name ? '#2d2d2d' : 'transparent',
                        borderRadius: '3px',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedDataSource(name)}
                    >
                      <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>{name}</div>
                      <Group gap="xs">
                        <Badge size="xs" color={getVersionColor(stats.version)}>
                          {stats.version}
                        </Badge>
                        <Badge size="xs" color={getStateColor(stats.state)}>
                          {stats.state}
                        </Badge>
                        <span style={{ color: '#888' }}>
                          {stats.recordCount} records
                        </span>
                      </Group>
                    </div>
                  );
                })}
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </div>
    </div>
  );
};
