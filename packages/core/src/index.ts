export * from './context';
export * from './exceptions';
export * from './helper';
export * from './hooks';
export * from './ioc';
export * from './json';
export * from './rsql/ast';
export * from './rsql/builder';
export * from './rsql/emitter';
export * from './rsql/parser';
export * from './utils';
export * from './types';
export * from './types/filter';
export * from './errorboundary';
export * from "./utils/masker";
// Export validator but avoid conflicts
export { ArchbaseValidator } from './validator/ArchbaseValidator';
export type { ValidationError, ValidatorOptions } from './validator';
export * from './validator';
export * from './locales';
export * from './fallback/ArchbaseSafeMigrationWrapper'

// Temporary export for migration compatibility
export function detectDataSourceVersion(dataSource: any): string {
  return dataSource?.version || 'v1';
}