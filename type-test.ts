/**
 * Teste puro de compatibilidade de tipos - sem JSX
 */

import { ArchbaseDataSource } from './src/components/datasource/ArchbaseDataSource';
import { ArchbaseDataSourceV2 } from './src/components/datasource/v2/ArchbaseDataSourceV2';
import { ArchbaseRemoteDataSourceV2 } from './src/components/datasource/v2/ArchbaseRemoteDataSourceV2';

interface Pessoa {
  id: number;
  nome: string;
  email: string;
}

const testData: Pessoa[] = [
  { id: 1, nome: 'João', email: 'joao@test.com' }
];

// ✅ Test V1 DataSource
const dataSourceV1 = new ArchbaseDataSource<Pessoa, number>('v1', {
  records: testData,
  grandTotalRecords: testData.length,
  currentPage: 0,
  totalPages: 1,
  pageSize: 10
});

// ✅ Test V2 DataSource
const dataSourceV2 = new ArchbaseDataSourceV2<Pessoa>({
  name: 'v2',
  records: testData
});

// ✅ Test type compatibility - both should satisfy common interface
function testDataSourceCompatibility(ds: ArchbaseDataSource<Pessoa, number> | ArchbaseDataSourceV2<Pessoa>) {
  // Common interface methods that both should have
  console.log('Name:', ds.getName());
  console.log('Total:', ds.getTotalRecords());
  console.log('Current:', ds.getCurrentRecord());
  console.log('Is browsing:', ds.isBrowsing());
  console.log('Is editing:', ds.isEditing());
  console.log('Is inserting:', ds.isInserting());
  
  // Field operations
  ds.setFieldValue('nome', 'Test Name');
  const name = ds.getFieldValue('nome');
  
  // Navigation
  ds.first();
  ds.last();
  ds.next();
  ds.prior();
  
  // CRUD operations
  ds.edit();
  ds.cancel();
  
  // Event management
  const listener = (event: any) => console.log('Event:', event);
  ds.addListener(listener);
  ds.removeListener(listener);
  
  return ds;
}

// ✅ Both types should work
const resultV1 = testDataSourceCompatibility(dataSourceV1);
const resultV2 = testDataSourceCompatibility(dataSourceV2);

// ✅ Test V2 specific features
if ('appendToFieldArray' in dataSourceV2) {
  console.log('✅ V2 detected - has array operations');
  // These methods only exist in V2
  dataSourceV2.appendToFieldArray('contatos' as any, { tipo: 'EMAIL', valor: 'test@test.com' });
  dataSourceV2.updateFieldArrayItem('contatos' as any, 0, (draft) => {
    (draft as any).principal = true;
  });
}

// ✅ Test type guards
function isDataSourceV2<T>(ds: ArchbaseDataSource<T, any> | ArchbaseDataSourceV2<T>): ds is ArchbaseDataSourceV2<T> {
  return 'appendToFieldArray' in ds;
}

if (isDataSourceV2(dataSourceV2)) {
  console.log('✅ Type guard works - this is V2');
  dataSourceV2.appendToFieldArray('test' as any, 'value');
}

if (!isDataSourceV2(dataSourceV1)) {
  console.log('✅ Type guard works - this is V1');
}

console.log('🎉 All type compatibility tests passed!');