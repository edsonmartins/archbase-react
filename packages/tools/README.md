# @archbase/tools

Developer tools and utilities for debugging, performance monitoring, and development workflows.

## Installation

```bash
npm install @archbase/tools
# or
yarn add @archbase/tools
# or
pnpm add @archbase/tools
```

## Features

### 🐛 Debug Utilities

#### ArchbaseConsoleLogger
Enhanced console logger with colors, grouping, and structured output.

```typescript
import { logger } from '@archbase/tools';

// Basic logging
logger.info('User logged in', { userId: 123 });
logger.warn('Deprecated API usage');
logger.error('Authentication failed');

// Grouped logging
logger.group('API Request');
logger.info('Sending request to /api/users');
logger.success('Request completed');
logger.groupEnd();

// Performance timing
logger.time('data-fetch');
// ... some async operation
logger.timeEnd('data-fetch');
```

#### ArchbaseDebugPanel
Real-time debug panel for monitoring application events.

```typescript
import { ArchbaseDebugPanel, emitDebugInfo } from '@archbase/tools';

// Add to your app
function App() {
  return (
    <div>
      <YourAppContent />
      <ArchbaseDebugPanel 
        enabled={process.env.NODE_ENV === 'development'}
        position="bottom-right"
        maxEntries={100}
      />
    </div>
  );
}

// Emit debug events
emitDebugInfo({
  type: 'api',
  message: 'User data fetched',
  data: userData
});
```

### ⚡ Performance Utilities

#### ArchbasePerformanceMonitor
Track and analyze performance metrics with statistics.

```typescript
import { performanceMonitor } from '@archbase/tools';

// Start/end measurements
performanceMonitor.start('api-call');
await fetchUserData();
const duration = performanceMonitor.end('api-call');

// Get statistics
const stats = performanceMonitor.getStats('api-call');
console.log(stats); // { count, total, average, min, max, median }

// Generate report
performanceMonitor.report();
```

#### useArchbaseRenderTracker
React hook to track component render performance.

```typescript
import { useArchbaseRenderTracker } from '@archbase/tools';

function MyComponent(props) {
  const renderInfo = useArchbaseRenderTracker('MyComponent', props);
  
  // renderInfo contains:
  // - componentName
  // - renderCount
  // - lastRenderTime
  // - averageRenderTime
  
  return <div>Component content</div>;
}
```

#### useArchbaseWhyDidYouRender
Debug hook to track why components re-render.

```typescript
import { useArchbaseWhyDidYouRender } from '@archbase/tools';

function MyComponent(props) {
  useArchbaseWhyDidYouRender('MyComponent', props);
  
  // Will log to debug panel when props change
  return <div>Component content</div>;
}
```

### 🛠️ Development Utilities

#### ArchbaseLocalStorageViewer
Component to view and manage localStorage in development.

```typescript
import { ArchbaseLocalStorageViewer } from '@archbase/tools';

function DevTools() {
  return (
    <div style={{ height: '400px' }}>
      <ArchbaseLocalStorageViewer
        prefix="myapp_" // Filter by prefix
        showSize={true}
        onItemClick={(key, value) => console.log(key, value)}
      />
    </div>
  );
}
```

#### ArchbaseNetworkMonitor
Monitor and debug network requests.

```typescript
import { ArchbaseNetworkMonitor } from '@archbase/tools';

function DevTools() {
  return (
    <div style={{ height: '500px' }}>
      <ArchbaseNetworkMonitor
        filterUrls={['/api/']} // Only monitor API calls
        excludeUrls={['/analytics']} // Exclude analytics
        maxRequests={50}
      />
    </div>
  );
}
```

#### ArchbaseStateInspector
Inspect and compare application state over time.

```typescript
import { ArchbaseStateInspector } from '@archbase/tools';

// Define your stores
const stores = [
  {
    name: 'User Store',
    type: 'zustand' as const,
    getState: () => userStore.getState(),
    subscribe: (listener) => userStore.subscribe(listener)
  },
  {
    name: 'App Store',
    type: 'redux' as const,
    getState: () => store.getState(),
    subscribe: (listener) => store.subscribe(listener)
  }
];

function DevTools() {
  return (
    <div style={{ height: '600px' }}>
      <ArchbaseStateInspector
        stores={stores}
        maxSnapshots={50}
      />
    </div>
  );
}
```

#### ArchbaseErrorBoundary
Enhanced error boundary with debugging features.

```typescript
import { ArchbaseErrorBoundary } from '@archbase/tools';

function App() {
  return (
    <ArchbaseErrorBoundary
      showStack={process.env.NODE_ENV === 'development'}
      logToConsole={true}
      onError={(error, errorInfo) => {
        // Custom error handling
        console.error('App error:', error);
      }}
      fallback={(error, errorInfo) => (
        <div>Custom error UI</div>
      )}
    >
      <YourAppContent />
    </ArchbaseErrorBoundary>
  );
}
```

#### ArchbaseMemoryLeakDetector
Detect potential memory leaks during development.

#### ArchbaseDataSourceInspector
Advanced DataSource inspector with real-time monitoring, inspired by ArchbasePanelTemplate debug functionality.

```typescript
import { ArchbaseDataSourceInspector, useArchbaseDataSourceDebug } from '@archbase/tools';

// Define your DataSources to monitor
const dataSources = [
  {
    name: 'Users DataSource',
    dataSource: userDataSource
  },
  {
    name: 'Products DataSource', 
    dataSource: productDataSource
  }
];

function DevTools() {
  return (
    <ArchbaseDataSourceInspector
      dataSources={dataSources}
      autoDiscover={true} // Auto-discover DataSources in development
      hotkey="ctrl+shift+D"
      visible={false}
      position="top-right"
      maxOperations={100}
    />
  );
}

// Or use the debug hook for individual DataSources
function MyComponent() {
  const userDataSource = useArchbaseDataSource(/*...*/);
  
  // Enable debug monitoring
  const debugInfo = useArchbaseDataSourceDebug(
    userDataSource, 
    'UserDataSource',
    {
      logOperations: true,
      monitorState: true,
      trackPerformance: true,
      maxHistory: 50
    }
  );

  // Access debug information
  console.log('Current state:', debugInfo.currentState);
  console.log('Operations:', debugInfo.operations);
  console.log('Performance:', debugInfo.performanceStats);

  return <div>Your component</div>;
}
```

#### useArchbaseDataSourceDebug Hook
Monitor individual DataSource instances with detailed debugging.

```typescript
import { useArchbaseDataSourceDebug } from '@archbase/tools';

const debugInfo = useArchbaseDataSourceDebug(dataSource, 'MyDataSource', {
  logOperations: true,      // Log all operations
  monitorState: true,       // Monitor state changes
  trackPerformance: true,   // Track operation performance
  maxHistory: 100          // Keep last 100 operations
});

// Available debug information:
// - debugInfo.operations: Array of all operations
// - debugInfo.currentState: Current DataSource state
// - debugInfo.performanceStats: Performance statistics
// - debugInfo.getOperationHistory(methodName): Filter operations
// - debugInfo.clearHistory(): Clear operation history
// - debugInfo.exportDebugData(): Export all debug data
```

```typescript
import { memoryLeakDetector } from '@archbase/tools';

// Start monitoring
memoryLeakDetector.startMonitoring(5000); // Check every 5 seconds

// Get statistics
const stats = memoryLeakDetector.getMemoryStats();
console.log('Memory usage:', stats.current);
console.log('Peak usage:', stats.peak);
console.log('Growth:', stats.growth + '%');
console.log('Suspicions:', stats.suspicions);

// Force garbage collection (Chrome DevTools only)
memoryLeakDetector.forceGarbageCollection();

// Export data for analysis
const data = memoryLeakDetector.exportData();
console.log(data);

// Stop monitoring
memoryLeakDetector.stopMonitoring();
```

## Complete Development Setup

Here's a complete example of setting up all development tools:

```typescript
import React from 'react';
import {
  ArchbaseDebugPanel,
  ArchbaseErrorBoundary,
  ArchbaseLocalStorageViewer,
  ArchbaseNetworkMonitor,
  ArchbaseStateInspector,
  ArchbaseDataSourceInspector,
  memoryLeakDetector,
  logger
} from '@archbase/tools';

// Start memory monitoring in development
if (process.env.NODE_ENV === 'development') {
  memoryLeakDetector.startMonitoring(10000);
}

function DevToolsPanel() {
  const [activeTab, setActiveTab] = React.useState('localStorage');

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0, 
      height: '300px',
      zIndex: 9999 
    }}>
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        <button onClick={() => setActiveTab('localStorage')}>LocalStorage</button>
        <button onClick={() => setActiveTab('network')}>Network</button>
        <button onClick={() => setActiveTab('state')}>State</button>
        <button onClick={() => setActiveTab('datasource')}>DataSource</button>
      </div>
      
      <div style={{ height: 'calc(100% - 40px)' }}>
        {activeTab === 'localStorage' && <ArchbaseLocalStorageViewer />}
        {activeTab === 'network' && <ArchbaseNetworkMonitor />}
        {activeTab === 'state' && <ArchbaseStateInspector stores={yourStores} />}
        {activeTab === 'datasource' && <ArchbaseDataSourceInspector autoDiscover={true} />}
      </div>
    </div>
  );
}

export function App() {
  return (
    <ArchbaseErrorBoundary>
      <div>
        <YourAppContent />
        
        {/* Debug panel */}
        <ArchbaseDebugPanel />
        
        {/* Development tools panel */}
        {process.env.NODE_ENV === 'development' && <DevToolsPanel />}
      </div>
    </ArchbaseErrorBoundary>
  );
}
```

## TypeScript Support

All tools are written in TypeScript and include full type definitions.

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support (except memory monitoring)
- Safari: Full support (except memory monitoring)

## Performance Impact

These tools are designed for development use only. They should be disabled in production:

```typescript
const isDev = process.env.NODE_ENV === 'development';

// Only include dev tools in development builds
{isDev && <ArchbaseDebugPanel />}
```

## Contributing

This package is part of the Archbase React ecosystem. See the main repository for contribution guidelines.

## License

MIT License