// @archbase/data - Data management layer exports

// DataSource v1 (Original)
export * from './datasource';

// DataSource v2 (TanStack Query integration)
export * from './datasource/v2';

// React Hooks for data management
export * from './hooks';

// API Services
export * from './service';

// Types
export * from './types';

// Re-export commonly used types from core
export type { 
  IQueryFilterEntity,
  QueryFilterEntity,
  ArchbaseQueryFilter,
  ArchbaseQueryFilterDelegator,
  DelegatorCallback,
  FilterType
} from '@archbase/core';

export {
  FILTER_TYPE,
  QUICK,
  NORMAL,
  ADVANCED,
  useArchbaseBool,
  ARCHBASE_IOC_API_TYPE
} from '@archbase/core';

// Export needed API client classes for IOC configuration
export { ArchbaseAxiosRemoteApiClient } from './service/ArchbaseRemoteApiService';
export type { ArchbaseRemoteApiClient } from './service/ArchbaseRemoteApiService';