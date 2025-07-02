import { DataSourceOptions } from '../../components/datasource/ArchbaseDataSource';

export interface TestData {
  id: number;
  nome: string;
  nascimento: string;
  contrato: string;
}

export const mockTestData: TestData[] = [
  { id: 1, nome: 'João Silva', nascimento: '15/05/1990', contrato: '01/01/2023' },
  { id: 2, nome: 'Maria Santos', nascimento: '20/12/1985', contrato: '15/02/2023' },
  { id: 3, nome: 'Pedro Costa', nascimento: '10/08/1992', contrato: '01/03/2023' },
];

export const createTestDataSourceOptions = (): DataSourceOptions<TestData> => ({
  records: mockTestData,
  grandTotalRecords: mockTestData.length,
  currentPage: 0,
  totalPages: 1,
  pageSize: 10,
});