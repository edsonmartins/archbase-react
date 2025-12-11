/**
 * ArchbaseLocalStorageViewer — visualizador/gerenciador de localStorage para desenvolvimento.
 * @status stable
 */
import React, { useState, useEffect } from 'react';

interface StorageItem {
  key: string;
  value: string;
  size: number;
  type: 'string' | 'object' | 'array' | 'number' | 'boolean';
}

interface ArchbaseLocalStorageViewerProps {
  prefix?: string;
  onItemClick?: (key: string, value: any) => void;
  showSize?: boolean;
}

/**
 * Component to view and manage localStorage in development
 */
export const ArchbaseLocalStorageViewer: React.FC<ArchbaseLocalStorageViewerProps> = ({
  prefix = '',
  onItemClick,
  showSize = true
}) => {
  const [items, setItems] = useState<StorageItem[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const loadItems = () => {
    const storageItems: StorageItem[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (!prefix || key.startsWith(prefix))) {
        const value = localStorage.getItem(key) || '';
        let type: StorageItem['type'] = 'string';
        
        try {
          const parsed = JSON.parse(value);
          if (Array.isArray(parsed)) {
            type = 'array';
          } else if (typeof parsed === 'object' && parsed !== null) {
            type = 'object';
          } else if (typeof parsed === 'number') {
            type = 'number';
          } else if (typeof parsed === 'boolean') {
            type = 'boolean';
          }
        } catch {
          // Keep as string
        }

        storageItems.push({
          key,
          value,
          size: new Blob([value]).size,
          type
        });
      }
    }

    storageItems.sort((a, b) => a.key.localeCompare(b.key));
    setItems(storageItems);
  };

  useEffect(() => {
    loadItems();

    // Listen for storage changes
    const handleStorageChange = () => loadItems();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [prefix]);

  const handleDelete = (key: string) => {
    if (window.confirm(`Delete localStorage item "${key}"?`)) {
      localStorage.removeItem(key);
      loadItems();
    }
  };

  const handleClear = () => {
    if (window.confirm('Clear all localStorage items? This cannot be undone.')) {
      if (prefix) {
        // Clear only items with prefix
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      } else {
        localStorage.clear();
      }
      loadItems();
    }
  };

  const handleExport = () => {
    const data: Record<string, any> = {};
    items.forEach(item => {
      try {
        data[item.key] = JSON.parse(item.value);
      } catch {
        data[item.key] = item.value;
      }
    });

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `localStorage_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredItems = items.filter(item => 
    item.key.toLowerCase().includes(filter.toLowerCase()) ||
    item.value.toLowerCase().includes(filter.toLowerCase())
  );

  const totalSize = items.reduce((sum, item) => sum + item.size, 0);

  const typeColors = {
    string: '#4CAF50',
    object: '#2196F3',
    array: '#FF9800',
    number: '#9C27B0',
    boolean: '#F44336'
  };

  return (
    <div style={{
      fontFamily: 'monospace',
      fontSize: '12px',
      backgroundColor: '#1e1e1e',
      color: '#d4d4d4',
      padding: '10px',
      borderRadius: '8px',
      maxHeight: '600px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ marginBottom: '10px' }}>
        <h3 style={{ margin: '0 0 10px 0' }}>
          📦 LocalStorage Viewer
          {showSize && (
            <span style={{ fontSize: '10px', color: '#888', marginLeft: '10px' }}>
              Total: {(totalSize / 1024).toFixed(2)} KB
            </span>
          )}
        </h3>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
          <input
            type="text"
            placeholder="Filter keys or values..."
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
            onClick={handleExport}
            style={{
              padding: '5px 10px',
              backgroundColor: '#0e639c',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Export
          </button>
          <button
            onClick={handleClear}
            style={{
              padding: '5px 10px',
              backgroundColor: '#a1260d',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Clear {prefix ? 'Prefix' : 'All'}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
            No items found
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #3e3e3e' }}>
                <th style={{ textAlign: 'left', padding: '5px' }}>Key</th>
                <th style={{ textAlign: 'left', padding: '5px', width: '60px' }}>Type</th>
                {showSize && <th style={{ textAlign: 'right', padding: '5px', width: '80px' }}>Size</th>}
                <th style={{ width: '60px' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map(item => (
                <React.Fragment key={item.key}>
                  <tr
                    style={{
                      borderBottom: '1px solid #2d2d2d',
                      cursor: 'pointer',
                      backgroundColor: selectedItem === item.key ? '#2d2d2d' : 'transparent'
                    }}
                    onClick={() => {
                      setSelectedItem(selectedItem === item.key ? null : item.key);
                      if (onItemClick) {
                        try {
                          onItemClick(item.key, JSON.parse(item.value));
                        } catch {
                          onItemClick(item.key, item.value);
                        }
                      }
                    }}
                  >
                    <td style={{ padding: '5px', wordBreak: 'break-all' }}>{item.key}</td>
                    <td style={{ padding: '5px' }}>
                      <span style={{ color: typeColors[item.type], fontSize: '10px' }}>
                        {item.type}
                      </span>
                    </td>
                    {showSize && (
                      <td style={{ padding: '5px', textAlign: 'right', color: '#888' }}>
                        {(item.size / 1024).toFixed(2)} KB
                      </td>
                    )}
                    <td style={{ padding: '5px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.key);
                        }}
                        style={{
                          padding: '2px 6px',
                          backgroundColor: '#a1260d',
                          border: 'none',
                          borderRadius: '3px',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '10px'
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {selectedItem === item.key && (
                    <tr>
                      <td colSpan={showSize ? 4 : 3} style={{ padding: '10px', backgroundColor: '#252526' }}>
                        <pre style={{
                          margin: 0,
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                          maxHeight: '200px',
                          overflow: 'auto'
                        }}>
                          {(() => {
                            try {
                              return JSON.stringify(JSON.parse(item.value), null, 2);
                            } catch {
                              return item.value;
                            }
                          })()}
                        </pre>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
