// Simplified context for core package (no external dependencies)
export * from './ArchbaseSimpleAppContext';

// Full context exports (restored for components package)
export { ArchbaseAppContext, ArchbaseAppProvider, useArchbaseAppContext } from './ArchbaseAppContext';
export type { ArchbaseAppContextValues, ArchbaseLanguage } from './ArchbaseAppContext';
export { ArchbaseGlobalProvider, initArchbaseTranslation } from './ArchbaseGlobalProvider';
export type { ArchbaseThemeOverride } from './ArchbaseGlobalProvider';
