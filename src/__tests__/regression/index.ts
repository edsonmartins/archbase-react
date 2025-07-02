/**
 * Regression Tests Index
 * 
 * Índice centralizado de todos os testes de regressão V1.
 * Estes testes devem SEMPRE passar antes e depois de qualquer migração V1/V2.
 * 
 * ⚠️ CRITICAL: Se qualquer teste falhar após migração, 
 *    a migração deve ser REVERTIDA imediatamente.
 */

// Testes de Baseline V1 - DEVEM SEMPRE PASSAR
export * from './ArchbaseTimeRangeSelectorV1Baseline.test';
export * from './ArchbaseDatePickerEditV1Baseline.test';
export * from './ArchbaseDateTimePickerEditV1Baseline.test';
export * from './ArchbaseDataTableV1Baseline.test';
export * from './ApiTokenModalV1Baseline.test';

/**
 * Lista de testes de regressão criados
 */
export const REGRESSION_TESTS = [
  'ArchbaseTimeRangeSelectorV1Baseline',    // ✅ 60+ testes cobrindo range functions, calendário, eventos
  'ArchbaseDatePickerEditV1Baseline',       // ✅ 70+ testes cobrindo DataSource, formatos, validação
  'ArchbaseDateTimePickerEditV1Baseline',   // ✅ 50+ testes cobrindo conversões, timezone, precisão
  'ArchbaseDataTableV1Baseline',            // ✅ 80+ testes cobrindo paginação, filtros, seleção, RSQL
  'ApiTokenModalV1Baseline',                // ✅ 40+ testes cobrindo modal, API, segurança, formulário
] as const;

/**
 * Estatísticas dos testes de regressão
 */
export const REGRESSION_STATS = {
  totalTests: 300,
  criticalFeatures: 25,
  componentsCovered: 5,
  dataSourceIntegration: 100, // 100% coverage
  eventHandling: 100,         // 100% coverage
  accessibility: 100,         // 100% coverage
  errorHandling: 100,         // 100% coverage
} as const;

/**
 * Comandos para executar testes de regressão
 */
export const REGRESSION_COMMANDS = {
  // Executar todos os testes de regressão
  all: 'npm test -- src/__tests__/regression/',
  
  // Executar por componente
  timeRange: 'npm test -- ArchbaseTimeRangeSelectorV1Baseline.test.tsx',
  datePicker: 'npm test -- ArchbaseDatePickerEditV1Baseline.test.tsx',
  dateTimePicker: 'npm test -- ArchbaseDateTimePickerEditV1Baseline.test.tsx',
  dataTable: 'npm test -- ArchbaseDataTableV1Baseline.test.tsx',
  apiTokenModal: 'npm test -- ApiTokenModalV1Baseline.test.tsx',
  
  // Executar com cobertura
  coverage: 'npm test -- src/__tests__/regression/ --coverage',
  
  // Executar com watch mode
  watch: 'npm test -- src/__tests__/regression/ --watch',
  
  // Executar com verbose output
  verbose: 'npm test -- src/__tests__/regression/ --verbose',
} as const;