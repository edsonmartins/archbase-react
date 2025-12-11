/**
 * ArchbaseStateInspector — inspetor de estado com histórico para debug.
 * @status stable
 */
import React, { useState, useEffect } from 'react';
import { emitDebugInfo } from '../debug/ArchbaseDebugPanel';

interface StateSnapshot {
  id: string;
  timestamp: number;
  name: string;
  state: any;
  type: 'redux' | 'zustand' | 'context' | 'custom';
}

interface ArchbaseStateInspectorProps {
  stores?: Array<{
    name: string;
    type: 'redux' | 'zustand' | 'context' | 'custom';
    getState: () => any;
    subscribe?: (listener: () => void) => () => void;
  }>;
  maxSnapshots?: number;
}

/**
 * State inspector for debugging application state
 */
export const ArchbaseStateInspector: React.FC<ArchbaseStateInspectorProps> = ({
  stores = [],
  maxSnapshots = 50
}) => {
  const [snapshots, setSnapshots] = useState<StateSnapshot[]>([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [autoCapture, setAutoCapture] = useState(true);
  const [compareMode, setCompareMode] = useState(false);
  const [compareSnapshots, setCompareSnapshots] = useState<[string | null, string | null]>([null, null]);

  useEffect(() => {
    if (!autoCapture) return;

    const unsubscribes: Array<() => void> = [];

    stores.forEach(store => {
      if (store.subscribe) {
        const unsubscribe = store.subscribe(() => {
          const snapshot: StateSnapshot = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            name: store.name,
            state: store.getState(),
            type: store.type
          };

          setSnapshots(prev => [snapshot, ...prev].slice(0, maxSnapshots));

          emitDebugInfo({
            type: 'state',
            message: `State updated: ${store.name}`,
            data: snapshot.state
          });
        });
        unsubscribes.push(unsubscribe);
      }
    });

    return () => {
      unsubscribes.forEach(fn => fn());
    };
  }, [stores, autoCapture, maxSnapshots]);

  const captureSnapshot = () => {
    stores.forEach(store => {
      const snapshot: StateSnapshot = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
        name: store.name,
        state: store.getState(),
        type: store.type
      };
      setSnapshots(prev => [snapshot, ...prev].slice(0, maxSnapshots));
    });
  };

  const exportSnapshots = () => {
    const data = snapshots.map(s => ({
      ...s,
      timestampFormatted: new Date(s.timestamp).toISOString()
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `state_snapshots_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSnapshots = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setSnapshots(data);
      } catch (error) {
        console.error('Failed to import snapshots:', error);
      }
    };
    reader.readAsText(file);
  };

  const clearSnapshots = () => {
    if (window.confirm('Clear all snapshots?')) {
      setSnapshots([]);
      setSelectedSnapshot(null);
      setCompareSnapshots([null, null]);
    }
  };

  const filteredSnapshots = snapshots.filter(s =>
    filter === '' ||
    s.name.toLowerCase().includes(filter.toLowerCase()) ||
    JSON.stringify(s.state).toLowerCase().includes(filter.toLowerCase())
  );

  const getStateDiff = (state1: any, state2: any, path = ''): any => {
    const diff: any = {};
    
    // Check for additions and modifications
    Object.keys(state2).forEach(key => {
      const newPath = path ? `${path}.${key}` : key;
      if (!(key in state1)) {
        diff[newPath] = { type: 'added', value: state2[key] };
      } else if (typeof state2[key] === 'object' && state2[key] !== null && typeof state1[key] === 'object' && state1[key] !== null) {
        const nestedDiff = getStateDiff(state1[key], state2[key], newPath);
        Object.assign(diff, nestedDiff);
      } else if (state1[key] !== state2[key]) {
        diff[newPath] = { type: 'modified', from: state1[key], to: state2[key] };
      }
    });
    
    // Check for deletions
    Object.keys(state1).forEach(key => {
      const newPath = path ? `${path}.${key}` : key;
      if (!(key in state2)) {
        diff[newPath] = { type: 'deleted', value: state1[key] };
      }
    });
    
    return diff;
  };

  const typeColors = {
    redux: '#764ABC',
    zustand: '#FF6B6B',
    context: '#61DAFB',
    custom: '#4CAF50'
  };

  return (
    <div style={{
      fontFamily: 'monospace',
      fontSize: '12px',
      backgroundColor: '#1e1e1e',
      color: '#d4d4d4',
      borderRadius: '8px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      <div style={{ padding: '10px', borderBottom: '1px solid #3e3e3e' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>
          🔍 State Inspector
          <span style={{ fontSize: '10px', color: '#888', marginLeft: '10px' }}>
            {filteredSnapshots.length} snapshots
          </span>
        </h3>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Filter snapshots..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              flex: 1,
              padding: '5px',
              backgroundColor: '#2d2d2d',
              border: '1px solid #3e3e3e',
              borderRadius: '4px',
              color: '#d4d4d4'
            }}
          />
          <button
            onClick={() => setAutoCapture(!autoCapture)}
            style={{
              padding: '5px 10px',
              backgroundColor: autoCapture ? '#4CAF50' : '#666',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            {autoCapture ? 'Auto' : 'Manual'}
          </button>
          <button
            onClick={() => setCompareMode(!compareMode)}
            style={{
              padding: '5px 10px',
              backgroundColor: compareMode ? '#2196F3' : '#666',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Compare
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={captureSnapshot}
            style={{
              flex: 1,
              padding: '5px',
              backgroundColor: '#0e639c',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Capture
          </button>
          <button
            onClick={exportSnapshots}
            style={{
              flex: 1,
              padding: '5px',
              backgroundColor: '#16825d',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Export
          </button>
          <label style={{
            flex: 1,
            padding: '5px',
            backgroundColor: '#f48771',
            border: 'none',
            borderRadius: '4px',
            color: 'white',
            cursor: 'pointer',
            textAlign: 'center'
          }}>
            Import
            <input
              type="file"
              accept=".json"
              onChange={importSnapshots}
              style={{ display: 'none' }}
            />
          </label>
          <button
            onClick={clearSnapshots}
            style={{
              flex: 1,
              padding: '5px',
              backgroundColor: '#a1260d',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: '300px', borderRight: '1px solid #3e3e3e', overflow: 'auto' }}>
          {filteredSnapshots.map((snapshot, index) => (
            <div
              key={snapshot.id}
              style={{
                padding: '8px',
                borderBottom: '1px solid #2d2d2d',
                cursor: 'pointer',
                backgroundColor: 
                  compareMode && compareSnapshots[0] === snapshot.id ? '#2d2d2d' :
                  compareMode && compareSnapshots[1] === snapshot.id ? '#2d2d2d' :
                  selectedSnapshot === snapshot.id ? '#2d2d2d' : 'transparent'
              }}
              onClick={() => {
                if (compareMode) {
                  setCompareSnapshots(prev => {
                    if (!prev[0]) return [snapshot.id, null];
                    if (!prev[1] && prev[0] !== snapshot.id) return [prev[0], snapshot.id];
                    return [snapshot.id, null];
                  });
                } else {
                  setSelectedSnapshot(snapshot.id);
                }
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  color: typeColors[snapshot.type],
                  fontWeight: 'bold'
                }}>
                  {snapshot.name}
                </span>
                <span style={{ fontSize: '10px', color: '#888' }}>
                  #{index + 1}
                </span>
              </div>
              <div style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>
                {new Date(snapshot.timestamp).toLocaleTimeString()}
              </div>
              {compareMode && (compareSnapshots[0] === snapshot.id || compareSnapshots[1] === snapshot.id) && (
                <div style={{ fontSize: '10px', color: '#2196F3', marginTop: '2px' }}>
                  {compareSnapshots[0] === snapshot.id ? 'Compare A' : 'Compare B'}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: '10px' }}>
          {compareMode && compareSnapshots[0] && compareSnapshots[1] ? (
            <div>
              <h4 style={{ margin: '0 0 10px 0' }}>State Diff</h4>
              {(() => {
                const snapshot1 = snapshots.find(s => s.id === compareSnapshots[0]);
                const snapshot2 = snapshots.find(s => s.id === compareSnapshots[1]);
                if (!snapshot1 || !snapshot2) return null;
                
                const diff = getStateDiff(snapshot1.state, snapshot2.state);
                
                return (
                  <pre style={{
                    fontSize: '11px',
                    backgroundColor: '#252526',
                    padding: '10px',
                    borderRadius: '4px',
                    overflow: 'auto'
                  }}>
                    {Object.entries(diff).map(([path, change]: [string, any]) => (
                      <div key={path} style={{ marginBottom: '5px' }}>
                        <span style={{ color: '#888' }}>{path}: </span>
                        {change.type === 'added' && (
                          <span style={{ color: '#4CAF50' }}>
                            + {JSON.stringify(change.value)}
                          </span>
                        )}
                        {change.type === 'deleted' && (
                          <span style={{ color: '#F44336' }}>
                            - {JSON.stringify(change.value)}
                          </span>
                        )}
                        {change.type === 'modified' && (
                          <span>
                            <span style={{ color: '#F44336' }}>- {JSON.stringify(change.from)}</span>
                            {' → '}
                            <span style={{ color: '#4CAF50' }}>+ {JSON.stringify(change.to)}</span>
                          </span>
                        )}
                      </div>
                    ))}
                  </pre>
                );
              })()}
            </div>
          ) : selectedSnapshot ? (
            <div>
              <h4 style={{ margin: '0 0 10px 0' }}>State Details</h4>
              <pre style={{
                fontSize: '11px',
                backgroundColor: '#252526',
                padding: '10px',
                borderRadius: '4px',
                overflow: 'auto'
              }}>
                {JSON.stringify(
                  snapshots.find(s => s.id === selectedSnapshot)?.state,
                  null,
                  2
                )}
              </pre>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>
              {compareMode ? 'Select two snapshots to compare' : 'Select a snapshot to view details'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
