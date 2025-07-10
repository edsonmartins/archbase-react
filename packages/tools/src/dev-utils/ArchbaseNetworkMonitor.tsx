import React, { useState, useEffect } from 'react';
import { emitDebugInfo } from '../debug/ArchbaseDebugPanel';

interface NetworkRequest {
  id: string;
  method: string;
  url: string;
  status?: number;
  statusText?: string;
  duration?: number;
  size?: number;
  timestamp: number;
  requestHeaders?: Record<string, string>;
  responseHeaders?: Record<string, string>;
  requestBody?: any;
  responseBody?: any;
  error?: string;
}

interface ArchbaseNetworkMonitorProps {
  filterUrls?: string[];
  excludeUrls?: string[];
  maxRequests?: number;
}

/**
 * Network request monitor component
 */
export const ArchbaseNetworkMonitor: React.FC<ArchbaseNetworkMonitorProps> = ({
  filterUrls = [],
  excludeUrls = [],
  maxRequests = 50
}) => {
  const [requests, setRequests] = useState<NetworkRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'error'>('all');

  useEffect(() => {
    const originalFetch = window.fetch;
    const activeRequests = new Map<string, NetworkRequest>();

    // Override fetch
    window.fetch = async function(...args) {
      const [input, init] = args;
      const url = typeof input === 'string' ? input : (input as Request).url;
      const method = init?.method || 'GET';
      
      // Check filters
      if (filterUrls.length > 0 && !filterUrls.some(filter => url.includes(filter))) {
        return originalFetch.apply(this, args);
      }
      if (excludeUrls.some(exclude => url.includes(exclude))) {
        return originalFetch.apply(this, args);
      }

      const requestId = Math.random().toString(36).substr(2, 9);
      const startTime = performance.now();

      const request: NetworkRequest = {
        id: requestId,
        method,
        url,
        timestamp: Date.now(),
        requestHeaders: init?.headers as Record<string, string>,
        requestBody: init?.body
      };

      activeRequests.set(requestId, request);
      setRequests(prev => [request, ...prev].slice(0, maxRequests));

      try {
        const response = await originalFetch.apply(this, args);
        const duration = performance.now() - startTime;
        
        // Clone response to read body
        const clonedResponse = response.clone();
        let responseBody: any;
        let size = 0;

        try {
          const text = await clonedResponse.text();
          size = new Blob([text]).size;
          try {
            responseBody = JSON.parse(text);
          } catch {
            responseBody = text;
          }
        } catch {
          responseBody = 'Unable to read response body';
        }

        const updatedRequest: NetworkRequest = {
          ...request,
          status: response.status,
          statusText: response.statusText,
          duration,
          size,
          responseHeaders: Object.fromEntries(response.headers.entries()),
          responseBody
        };

        setRequests(prev => 
          prev.map(req => req.id === requestId ? updatedRequest : req)
        );

        // Emit debug info
        emitDebugInfo({
          type: 'api',
          message: `${method} ${url} - ${response.status} (${duration.toFixed(0)}ms)`,
          data: {
            request: updatedRequest,
            response: responseBody
          },
          duration
        });

        return response;
      } catch (error) {
        const duration = performance.now() - startTime;
        const updatedRequest: NetworkRequest = {
          ...request,
          duration,
          error: error instanceof Error ? error.message : 'Unknown error'
        };

        setRequests(prev => 
          prev.map(req => req.id === requestId ? updatedRequest : req)
        );

        emitDebugInfo({
          type: 'api',
          message: `${method} ${url} - ERROR`,
          data: {
            request: updatedRequest,
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        });

        throw error;
      } finally {
        activeRequests.delete(requestId);
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [filterUrls, excludeUrls, maxRequests]);

  const filteredRequests = requests.filter(req => {
    const matchesText = filter === '' || 
      req.url.toLowerCase().includes(filter.toLowerCase()) ||
      req.method.toLowerCase().includes(filter.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'success' && req.status && req.status >= 200 && req.status < 400) ||
      (statusFilter === 'error' && (req.error || (req.status && req.status >= 400)));

    return matchesText && matchesStatus;
  });

  const getStatusColor = (status?: number, error?: string) => {
    if (error) return '#F44336';
    if (!status) return '#FFA500';
    if (status >= 200 && status < 300) return '#4CAF50';
    if (status >= 300 && status < 400) return '#2196F3';
    return '#F44336';
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
          🌐 Network Monitor
          <span style={{ fontSize: '10px', color: '#888', marginLeft: '10px' }}>
            {filteredRequests.length} requests
          </span>
        </h3>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            placeholder="Filter URLs..."
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{
              padding: '5px',
              backgroundColor: '#2d2d2d',
              border: '1px solid #3e3e3e',
              borderRadius: '4px',
              color: '#d4d4d4'
            }}
          >
            <option value="all">All</option>
            <option value="success">Success</option>
            <option value="error">Error</option>
          </select>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {filteredRequests.map(req => (
          <div
            key={req.id}
            style={{
              borderBottom: '1px solid #2d2d2d',
              cursor: 'pointer',
              backgroundColor: selectedRequest === req.id ? '#2d2d2d' : 'transparent'
            }}
            onClick={() => setSelectedRequest(selectedRequest === req.id ? null : req.id)}
          >
            <div style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                color: getStatusColor(req.status, req.error),
                fontWeight: 'bold',
                minWidth: '50px'
              }}>
                {req.method}
              </span>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {req.url}
              </span>
              <span style={{ color: getStatusColor(req.status, req.error), minWidth: '40px' }}>
                {req.error ? 'ERR' : req.status || '...'}
              </span>
              {req.duration && (
                <span style={{ color: '#888', minWidth: '60px', textAlign: 'right' }}>
                  {req.duration.toFixed(0)}ms
                </span>
              )}
              {req.size && (
                <span style={{ color: '#888', minWidth: '60px', textAlign: 'right' }}>
                  {(req.size / 1024).toFixed(1)}KB
                </span>
              )}
            </div>

            {selectedRequest === req.id && (
              <div style={{ padding: '10px', backgroundColor: '#252526' }}>
                <details>
                  <summary style={{ cursor: 'pointer', marginBottom: '5px' }}>Request Headers</summary>
                  <pre style={{ fontSize: '10px', margin: '5px 0' }}>
                    {JSON.stringify(req.requestHeaders || {}, null, 2)}
                  </pre>
                </details>
                
                {req.requestBody && (
                  <details>
                    <summary style={{ cursor: 'pointer', marginBottom: '5px' }}>Request Body</summary>
                    <pre style={{ fontSize: '10px', margin: '5px 0', maxHeight: '200px', overflow: 'auto' }}>
                      {typeof req.requestBody === 'string' 
                        ? req.requestBody 
                        : JSON.stringify(req.requestBody, null, 2)}
                    </pre>
                  </details>
                )}

                {req.responseHeaders && (
                  <details>
                    <summary style={{ cursor: 'pointer', marginBottom: '5px' }}>Response Headers</summary>
                    <pre style={{ fontSize: '10px', margin: '5px 0' }}>
                      {JSON.stringify(req.responseHeaders, null, 2)}
                    </pre>
                  </details>
                )}

                {req.responseBody && (
                  <details open>
                    <summary style={{ cursor: 'pointer', marginBottom: '5px' }}>Response Body</summary>
                    <pre style={{ fontSize: '10px', margin: '5px 0', maxHeight: '300px', overflow: 'auto' }}>
                      {typeof req.responseBody === 'string' 
                        ? req.responseBody 
                        : JSON.stringify(req.responseBody, null, 2)}
                    </pre>
                  </details>
                )}

                {req.error && (
                  <div style={{ color: '#F44336', marginTop: '10px' }}>
                    Error: {req.error}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};