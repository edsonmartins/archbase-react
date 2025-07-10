// @archbase/tools - Development Tools and Utilities

// Debug utilities
export { ArchbaseConsoleLogger, logger } from './debug/ArchbaseConsoleLogger';
export { ArchbaseDebugPanel, emitDebugInfo } from './debug/ArchbaseDebugPanel';

// Performance utilities
export { ArchbasePerformanceMonitor, performanceMonitor } from './performance/ArchbasePerformanceMonitor';
export { useArchbaseRenderTracker, useArchbaseWhyDidYouRender } from './performance/useArchbaseRenderTracker';

// Development utilities
export { ArchbaseLocalStorageViewer } from './dev-utils/ArchbaseLocalStorageViewer';
export { ArchbaseNetworkMonitor } from './dev-utils/ArchbaseNetworkMonitor';
export { ArchbaseStateInspector } from './dev-utils/ArchbaseStateInspector';
export { ArchbaseErrorBoundary } from './dev-utils/ArchbaseErrorBoundary';
export { ArchbaseMemoryLeakDetector, memoryLeakDetector } from './dev-utils/ArchbaseMemoryLeakDetector';
export { ArchbaseDataSourceInspector } from './dev-utils/ArchbaseDataSourceInspector';
export { useArchbaseDataSourceDebug, useArchbaseDataSourceRegistry } from './dev-utils/useArchbaseDataSourceDebug';

export const ArchbaseToolsVersion = '3.0.0';