import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

interface DebugInfo {
  id: string;
  timestamp: number;
  type: 'render' | 'state' | 'props' | 'api' | 'performance';
  component?: string;
  message: string;
  data?: any;
  duration?: number;
}

interface ArchbaseDebugPanelProps {
  enabled?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxEntries?: number;
}

/**
 * Debug panel component for development
 */
export const ArchbaseDebugPanel: React.FC<ArchbaseDebugPanelProps> = ({
  enabled = process.env.NODE_ENV === 'development',
  position = 'bottom-right',
  maxEntries = 100
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [entries, setEntries] = useState<DebugInfo[]>([]);
  const [filter, setFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    if (!enabled) return;

    const handleDebugEvent = (event: CustomEvent<DebugInfo>) => {
      setEntries(prev => {
        const newEntries = [event.detail, ...prev];
        return newEntries.slice(0, maxEntries);
      });
    };

    window.addEventListener('archbase-debug', handleDebugEvent as any);
    return () => {
      window.removeEventListener('archbase-debug', handleDebugEvent as any);
    };
  }, [enabled, maxEntries]);

  if (!enabled) return null;

  const filteredEntries = entries.filter(entry => {
    const matchesText = filter === '' || 
      entry.message.toLowerCase().includes(filter.toLowerCase()) ||
      entry.component?.toLowerCase().includes(filter.toLowerCase());
    const matchesType = typeFilter === 'all' || entry.type === typeFilter;
    return matchesText && matchesType;
  });

  const positionStyles = {
    'top-right': { top: 20, right: 20 },
    'top-left': { top: 20, left: 20 },
    'bottom-right': { bottom: 20, right: 20 },
    'bottom-left': { bottom: 20, left: 20 }
  };

  const panelContent = (
    <div
      style={{
        position: 'fixed',
        ...positionStyles[position],
        width: isOpen ? '400px' : '50px',
        height: isOpen ? '500px' : '50px',
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: '1px solid #333',
        borderRadius: '8px',
        color: 'white',
        fontFamily: 'monospace',
        fontSize: '12px',
        zIndex: 999999,
        transition: 'all 0.3s ease',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          padding: '10px',
          borderBottom: isOpen ? '1px solid #333' : 'none',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{isOpen ? '🐛 Debug Panel' : '🐛'}</span>
        {isOpen && <span>{filteredEntries.length} entries</span>}
      </div>

      {isOpen && (
        <>
          <div style={{ padding: '10px', borderBottom: '1px solid #333' }}>
            <input
              type="text"
              placeholder="Filter..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '5px',
                backgroundColor: '#222',
                border: '1px solid #444',
                borderRadius: '4px',
                color: 'white',
                marginBottom: '5px'
              }}
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '5px',
                backgroundColor: '#222',
                border: '1px solid #444',
                borderRadius: '4px',
                color: 'white'
              }}
            >
              <option value="all">All Types</option>
              <option value="render">Render</option>
              <option value="state">State</option>
              <option value="props">Props</option>
              <option value="api">API</option>
              <option value="performance">Performance</option>
            </select>
          </div>

          <div
            style={{
              height: 'calc(100% - 120px)',
              overflowY: 'auto',
              padding: '10px'
            }}
          >
            {filteredEntries.map((entry) => (
              <div
                key={entry.id}
                style={{
                  marginBottom: '10px',
                  padding: '8px',
                  backgroundColor: '#111',
                  borderRadius: '4px',
                  border: '1px solid #222'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ color: getTypeColor(entry.type) }}>
                    [{entry.type.toUpperCase()}]
                  </span>
                  <span style={{ color: '#666' }}>
                    {new Date(entry.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                {entry.component && (
                  <div style={{ color: '#888', fontSize: '11px', marginBottom: '3px' }}>
                    {entry.component}
                  </div>
                )}
                <div>{entry.message}</div>
                {entry.duration && (
                  <div style={{ color: '#FFD700', fontSize: '11px', marginTop: '3px' }}>
                    Duration: {entry.duration}ms
                  </div>
                )}
                {entry.data && (
                  <details style={{ marginTop: '5px' }}>
                    <summary style={{ cursor: 'pointer', color: '#888' }}>Data</summary>
                    <pre style={{ fontSize: '10px', overflow: 'auto' }}>
                      {JSON.stringify(entry.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return ReactDOM.createPortal(panelContent, document.body);
};

function getTypeColor(type: string): string {
  const colors = {
    render: '#4CAF50',
    state: '#2196F3',
    props: '#FF9800',
    api: '#9C27B0',
    performance: '#F44336'
  };
  return colors[type as keyof typeof colors] || '#888';
}

/**
 * Helper function to emit debug events
 */
export function emitDebugInfo(info: Omit<DebugInfo, 'id' | 'timestamp'>): void {
  if (process.env.NODE_ENV !== 'development') return;

  const debugInfo: DebugInfo = {
    ...info,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now()
  };

  window.dispatchEvent(new CustomEvent('archbase-debug', { detail: debugInfo }));
}
