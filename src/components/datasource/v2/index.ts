// DataSource V2 com Immer para imutabilidade garantida
export { ArchbaseDataSourceV2 } from './ArchbaseDataSourceV2';
export type { ArchbaseDataSourceV2Config } from './ArchbaseDataSourceV2';

// Remote DataSource V2 com Immer e suporte a operações remotas
export { ArchbaseRemoteDataSourceV2 } from './ArchbaseRemoteDataSourceV2';
export type { ArchbaseRemoteDataSourceV2Config } from './ArchbaseRemoteDataSourceV2';

// Hook para usar DataSource V2 de forma reativa
export { 
  useArchbaseDataSourceV2, 
  useArchbaseDataSourceV2ReadOnly, 
  useArchbaseDataSourceV2Editor 
} from './useArchbaseDataSourceV2';
export type { UseArchbaseDataSourceV2Return } from './useArchbaseDataSourceV2';

// Hook para usar RemoteDataSource V2 de forma reativa
export { 
  useArchbaseRemoteDataSourceV2, 
  useArchbaseRemoteDataSourceV2ReadOnly, 
  useArchbaseRemoteDataSourceV2Editor 
} from './useArchbaseRemoteDataSourceV2';
export type { UseArchbaseRemoteDataSourceV2Return } from './useArchbaseRemoteDataSourceV2';

// Preparação para integração com TanStack Query
export type {
  ArchbaseTanStackQueryConfig,
  ArchbaseQueryOperations,
  ArchbaseQueryState,
  ArchbaseQueryHookReturn
} from './ArchbaseQueryIntegration';

export {
  ArchbaseQueryUtils,
  ARCHBASE_QUERY_DEFAULTS
} from './ArchbaseQueryIntegration';

// Re-export dos tipos necessários da versão V1 para compatibilidade
export type {
  ArchbaseDataSourceConfig,
  DataSourceOptions,
  FilterFn,
  IDataSourceValidator,
  DataSourceEvent,
  DataSourceEventNames
} from '../ArchbaseDataSource';