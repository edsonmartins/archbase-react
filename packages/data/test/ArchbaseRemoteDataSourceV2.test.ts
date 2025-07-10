import { ArchbaseRemoteDataSourceV2 } from '../src/datasource/v2/ArchbaseRemoteDataSourceV2';
import { DataSourceEventNames } from '../src/datasource/ArchbaseDataSource';
import { createTestData, Pessoa } from './test-data';
import { ArchbaseRemoteApiService, Page, ArchbaseRemoteApiClient } from '../src/service/ArchbaseRemoteApiService';

// Mock do ArchbaseRemoteApiClient
class MockApiClient implements ArchbaseRemoteApiClient {
  async get<T>(url: string): Promise<T> {
    throw new Error('Not implemented in mock');
  }
  async post<T, R>(url: string, data: T): Promise<R> {
    throw new Error('Not implemented in mock');
  }
  async put<T, R>(url: string, data: T): Promise<R> {
    throw new Error('Not implemented in mock');
  }
  async postNoConvertId<T, R>(url: string, data: T): Promise<R> {
    throw new Error('Not implemented in mock');
  }
  async putNoConvertId<T, R>(url: string, data: T): Promise<R> {
    throw new Error('Not implemented in mock');
  }
  async binaryPut<T, R>(url: string, data: T): Promise<R> {
    throw new Error('Not implemented in mock');
  }
  async delete<T>(url: string): Promise<T> {
    throw new Error('Not implemented in mock');
  }
  async patch<T, R>(url: string, data: T): Promise<R> {
    throw new Error('Not implemented in mock');
  }
  async patchNoConvertId<T, R>(url: string, data: T): Promise<R> {
    throw new Error('Not implemented in mock');
  }
}

// Mock do ArchbaseRemoteApiService
class MockRemoteApiService extends ArchbaseRemoteApiService<Pessoa, number> {
  private records: Pessoa[] = [];
  private nextId = 100;

  constructor(initialData?: Pessoa[]) {
    super(new MockApiClient());
    if (initialData) {
      this.records = [...initialData];
    }
  }

  protected getEndpoint(): string {
    return '/api/pessoas';
  }

  protected configureHeaders(): Record<string, string> {
    return {};
  }

  getId(record: Pessoa): number {
    return record.id;
  }

  isNewRecord(entity: Pessoa): boolean {
    return !entity.id || entity.id === 0;
  }

  async save<R>(record: Pessoa): Promise<R> {
    if (this.isNewRecord(record)) {
      // Create new
      const newPessoa = { ...record, id: this.nextId++ };
      this.records.push(newPessoa);
      return newPessoa as unknown as R;
    } else {
      // Update existing
      const index = this.records.findIndex(r => r.id === record.id);
      if (index >= 0) {
        this.records[index] = { ...record };
        return this.records[index] as unknown as R;
      }
      throw new Error('Record not found');
    }
  }

  async delete<T>(id: number): Promise<void> {
    const index = this.records.findIndex(r => r.id === id);
    if (index >= 0) {
      this.records.splice(index, 1);
    }
  }

  async findAll(page: number, size: number): Promise<Page<Pessoa>> {
    const start = page * size;
    const end = start + size;
    return {
      content: this.records.slice(start, end),
      totalElements: this.records.length,
      totalPages: Math.ceil(this.records.length / size),
      size,
      number: page,
      last: end >= this.records.length,
      first: page === 0,
      empty: this.records.length === 0,
      numberOfElements: Math.min(size, this.records.length - start),
      sort: { sorted: false, unsorted: true, empty: true }
    };
  }

  async findAllWithSort(page: number, size: number, sort: string[]): Promise<Page<Pessoa>> {
    // Simplified sorting - just return same as findAll for tests
    return this.findAll(page, size);
  }

  async findAllWithFilter(filter: string, page: number, size: number): Promise<Page<Pessoa>> {
    // Simplified filtering - just return same as findAll for tests
    return this.findAll(page, size);
  }

  async findAllMultipleFields(
    searchText: string,
    fields: string,
    page: number,
    size: number,
    sort: string
  ): Promise<Page<Pessoa>> {
    // Simplified search - filter by name containing searchText
    const filtered = this.records.filter(r => 
      r.nome.toLowerCase().includes(searchText.toLowerCase())
    );
    
    const start = page * size;
    const end = start + size;
    
    return {
      content: filtered.slice(start, end),
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      size,
      number: page,
      last: end >= filtered.length,
      first: page === 0,
      empty: filtered.length === 0,
      numberOfElements: Math.min(size, filtered.length - start),
      sort: { sorted: false, unsorted: true, empty: true }
    };
  }

  // Mock method to get internal records for testing
  getRecords(): Pessoa[] {
    return [...this.records];
  }

  // Mock method to set records for testing
  setRecords(records: Pessoa[]): void {
    this.records = [...records];
  }
}

describe('ArchbaseRemoteDataSourceV2', () => {
  let dataSource: ArchbaseRemoteDataSourceV2<Pessoa>;
  let mockService: MockRemoteApiService;
  let testData: Pessoa[];

  beforeEach(() => {
    testData = createTestData.pessoaList(3);
    mockService = new MockRemoteApiService(testData);
    dataSource = new ArchbaseRemoteDataSourceV2({
      name: 'test-remote-datasource',
      service: mockService,
      records: testData
    });
  });

  afterEach(() => {
    dataSource.close();
  });

  describe('Basic Operations', () => {
    test('should initialize correctly', () => {
      expect(dataSource.getName()).toBe('test-remote-datasource');
      expect(dataSource.getTotalRecords()).toBe(3);
      expect(dataSource.getCurrentIndex()).toBe(0);
      expect(dataSource.getCurrentRecord()).toEqual(testData[0]);
      expect(dataSource.isBrowsing()).toBe(true);
    });

    test('should handle empty initialization', () => {
      const emptyService = new MockRemoteApiService();
      const emptyDS = new ArchbaseRemoteDataSourceV2<Pessoa>({
        name: 'empty',
        service: emptyService
      });
      
      expect(emptyDS.isEmpty()).toBe(true);
      expect(emptyDS.getCurrentIndex()).toBe(-1);
      expect(emptyDS.getCurrentRecord()).toBeUndefined();
    });

    test('should initialize with service config', () => {
      const serviceDS = new ArchbaseRemoteDataSourceV2({
        name: 'service-ds',
        service: mockService,
        pageSize: 50,
        defaultSortFields: ['nome', 'email']
      });

      expect(serviceDS.getPageSize()).toBe(50);
      expect(serviceDS.getName()).toBe('service-ds');
    });
  });

  describe('Navigation', () => {
    test('should navigate between records', () => {
      // First record
      expect(dataSource.isFirst()).toBe(true);
      expect(dataSource.getCurrentRecord()!.id).toBe(1);
      
      // Next
      dataSource.next();
      expect(dataSource.getCurrentIndex()).toBe(1);
      expect(dataSource.getCurrentRecord()!.id).toBe(2);
      
      // Last
      dataSource.last();
      expect(dataSource.isLast()).toBe(true);
      expect(dataSource.getCurrentRecord()!.id).toBe(3);
      
      // Prior
      dataSource.prior();
      expect(dataSource.getCurrentIndex()).toBe(1);
      
      // First
      dataSource.first();
      expect(dataSource.isFirst()).toBe(true);
    });

    test('should emit recordChanged on navigation', () => {
      const events: any[] = [];
      dataSource.addListener(event => events.push(event));
      
      dataSource.next();
      
      expect(events).toHaveLength(1);
      expect(events[0].type).toBe(DataSourceEventNames.afterScroll);
      expect(events[0].index).toBe(1);
    });

    test('should handle goToRecord', () => {
      dataSource.goToRecord(2);
      expect(dataSource.getCurrentIndex()).toBe(2);
      expect(dataSource.getCurrentRecord()!.id).toBe(3);
    });
  });

  describe('Field Operations', () => {
    test('should update field value with immutability', () => {
      const originalRecord = dataSource.getCurrentRecord();
      const originalName = originalRecord!.nome;
      
      dataSource.setFieldValue('nome', 'Novo Nome');
      
      // Original should be unchanged
      expect(originalRecord!.nome).toBe(originalName);
      
      // Current should be updated
      expect(dataSource.getCurrentRecord()!.nome).toBe('Novo Nome');
      
      // Records should be different references
      expect(dataSource.getCurrentRecord()).not.toBe(originalRecord);
    });

    test('should handle nested fields', () => {
      dataSource.setFieldValue('endereco.cidade', 'Rio de Janeiro');
      
      expect(dataSource.getFieldValue('endereco.cidade')).toBe('Rio de Janeiro');
      expect(dataSource.getCurrentRecord()!.endereco.cidade).toBe('Rio de Janeiro');
    });

    test('should emit events on field change', () => {
      const events: any[] = [];
      dataSource.addListener(event => events.push(event));
      
      dataSource.setFieldValue('nome', 'Test');
      
      // Should emit fieldChanged and dataChanged
      expect(events).toHaveLength(2);
      expect(events[0].type).toBe(DataSourceEventNames.fieldChanged);
      expect(events[0].fieldName).toBe('nome');
      expect(events[0].newValue).toBe('Test');
      expect(events[1].type).toBe(DataSourceEventNames.dataChanged);
    });
  });

  describe('Remote CRUD Operations', () => {
    test('should save new record remotely', async () => {
      const newPessoa: Pessoa = {
        id: 0, // New record
        nome: 'Nova Pessoa Remote',
        email: 'nova@remote.com',
        idade: 25,
        ativo: true,
        dataNascimento: new Date(),
        endereco: {
          rua: 'Rua Nova',
          cidade: 'São Paulo',
          cep: '00000-000'
        },
        contatos: []
      };
      
      dataSource.insert(newPessoa);
      expect(dataSource.isInserting()).toBe(true);
      
      const savedRecord = await dataSource.save();
      
      expect(savedRecord.id).toBeGreaterThan(0); // Should have new ID
      expect(savedRecord.nome).toBe('Nova Pessoa Remote');
      expect(dataSource.isBrowsing()).toBe(true);
      
      // Verify service has the record
      const serviceRecords = mockService.getRecords();
      expect(serviceRecords.some(r => r.nome === 'Nova Pessoa Remote')).toBe(true);
    });

    test('should update existing record remotely', async () => {
      dataSource.edit();
      dataSource.setFieldValue('nome', 'Nome Editado Remote');
      
      const savedRecord = await dataSource.save();
      
      expect(savedRecord.nome).toBe('Nome Editado Remote');
      expect(savedRecord.id).toBe(testData[0].id); // Same ID
      
      // Verify service has the updated record
      const serviceRecords = mockService.getRecords();
      const updatedRecord = serviceRecords.find(r => r.id === testData[0].id);
      expect(updatedRecord!.nome).toBe('Nome Editado Remote');
    });

    test('should remove record remotely', async () => {
      const recordToRemove = dataSource.getCurrentRecord()!;
      const initialCount = dataSource.getTotalRecords();
      
      const removedRecord = await dataSource.remove();
      
      expect(removedRecord).toEqual(recordToRemove);
      expect(dataSource.getTotalRecords()).toBe(initialCount - 1);
      
      // Verify service doesn't have the record
      const serviceRecords = mockService.getRecords();
      expect(serviceRecords.some(r => r.id === recordToRemove.id)).toBe(false);
    });

    test('should handle save with validation errors', async () => {
      const validator = {
        validateEntity: jest.fn().mockReturnValue([
          { fieldName: 'nome', errorMessage: 'Nome é obrigatório' }
        ])
      };

      const dsWithValidator = new ArchbaseRemoteDataSourceV2({
        name: 'validation-test',
        service: mockService,
        records: testData,
        validator
      });

      dsWithValidator.edit();
      dsWithValidator.setFieldValue('nome', '');

      await expect(dsWithValidator.save()).rejects.toThrow();
    });

    test('should handle save errors from service', async () => {
      const errorService = {
        ...mockService,
        save: jest.fn().mockRejectedValue(new Error('Network error'))
      };

      const errorDS = new ArchbaseRemoteDataSourceV2({
        name: 'error-test',
        service: errorService as any,
        records: testData
      });

      errorDS.edit();
      errorDS.setFieldValue('nome', 'Test');

      await expect(errorDS.save()).rejects.toThrow();
    });

    test('should handle edit/cancel', () => {
      const originalName = dataSource.getCurrentRecord()!.nome;
      
      dataSource.edit();
      dataSource.setFieldValue('nome', 'Temporário');
      
      expect(dataSource.getCurrentRecord()!.nome).toBe('Temporário');
      
      dataSource.cancel();
      
      expect(dataSource.getCurrentRecord()!.nome).toBe(originalName);
      expect(dataSource.isBrowsing()).toBe(true);
    });

    test('should handle insert/cancel', () => {
      const originalCount = dataSource.getTotalRecords();
      
      dataSource.insert({ nome: 'Temp' } as Pessoa);
      expect(dataSource.getTotalRecords()).toBe(originalCount + 1);
      
      dataSource.cancel();
      
      expect(dataSource.getTotalRecords()).toBe(originalCount);
      expect(dataSource.isBrowsing()).toBe(true);
    });
  });

  describe('Array Field Operations', () => {
    test('should append to array field', () => {
      const originalContatos = dataSource.getFieldValue('contatos');
      const originalLength = originalContatos.length;
      
      const novoContato = {
        tipo: 'TELEFONE' as const,
        valor: '123456789',
        principal: false
      };
      
      dataSource.appendToFieldArray('contatos', novoContato);
      
      const newContatos = dataSource.getFieldValue('contatos');
      expect(newContatos).toHaveLength(originalLength + 1);
      expect(newContatos[newContatos.length - 1]).toEqual(novoContato);
      
      // Original should be unchanged
      expect(originalContatos).toHaveLength(originalLength);
    });

    test('should update array item', () => {
      dataSource.updateFieldArrayItem('contatos', 0, draft => {
        draft.valor = 'updated@email.com';
      });
      
      const contatos = dataSource.getFieldValue('contatos');
      expect(contatos[0].valor).toBe('updated@email.com');
    });

    test('should remove array item', () => {
      const originalLength = dataSource.getFieldValue('contatos').length;
      
      dataSource.removeFromFieldArray('contatos', 0);
      
      const contatos = dataSource.getFieldValue('contatos');
      expect(contatos).toHaveLength(originalLength - 1);
    });

    test('should insert into array', () => {
      const novoContato = {
        tipo: 'EMAIL' as const,
        valor: 'insert@test.com',
        principal: false
      };

      dataSource.insertIntoFieldArray('contatos', 1, novoContato);

      const contatos = dataSource.getFieldValue('contatos');
      expect(contatos).toHaveLength(3);
      expect(contatos[1]).toEqual(novoContato);
    });

    test('should check if field is array', () => {
      expect(dataSource.isFieldArray('contatos')).toBe(true);
      expect(dataSource.isFieldArray('nome')).toBe(false);
    });

    test('should get field array', () => {
      const contatos = dataSource.getFieldArray('contatos');
      expect(Array.isArray(contatos)).toBe(true);
      expect(contatos).toHaveLength(2);
    });
  });

  describe('Remote Filter Operations', () => {
    test('should apply remote filter with quick search', async () => {
      const mockFilter = {
        filter: {
          filterType: 'QUICK',
          quickFilterText: 'João',
          quickFilterFieldsText: ['nome']
        },
        sort: {
          quickFilterSort: ['nome']
        }
      };

      // Mock service to return filtered results
      jest.spyOn(mockService, 'findAllMultipleFields').mockResolvedValue({
        content: [testData[0]], // Only first record
        totalElements: 1,
        totalPages: 1,
        size: 20,
        number: 0,
        last: true,
        first: true,
        empty: false,
        numberOfElements: 1,
        sort: { sorted: false, unsorted: true, empty: true }
      });

      dataSource.applyRemoteFilter(mockFilter as any, 0);

      // Wait for async operation
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockService.findAllMultipleFields).toHaveBeenCalledWith(
        'João',
        'nome',
        0,
        20,
        'nome'
      );
    });

    test('should apply remote filter without filter', async () => {
      jest.spyOn(mockService, 'findAll').mockResolvedValue({
        content: testData,
        totalElements: 3,
        totalPages: 1,
        size: 20,
        number: 0,
        last: true,
        first: true,
        empty: false,
        numberOfElements: 3,
        sort: { sorted: false, unsorted: true, empty: true }
      });

      dataSource.applyRemoteFilter({} as any, 0);

      // Wait for async operation
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockService.findAll).toHaveBeenCalledWith(0, 20);
    });
  });

  describe('Event Management and Callbacks', () => {
    test('should call onStateChange callback', () => {
      const onStateChange = jest.fn();
      
      const ds = new ArchbaseRemoteDataSourceV2({
        name: 'test',
        service: mockService,
        records: testData,
        onStateChange
      });
      
      ds.setFieldValue('nome', 'Test');
      
      expect(onStateChange).toHaveBeenCalledTimes(1);
      expect(onStateChange).toHaveBeenCalledWith(
        expect.any(Array), // prevRecords
        expect.any(Array)  // newRecords
      );
    });

    test('should call onError callback', () => {
      const onError = jest.fn();
      
      const ds = new ArchbaseRemoteDataSourceV2({
        name: 'test',
        service: mockService,
        records: testData,
        onError
      });
      
      // Force an error by trying to edit non-existent record
      ds.goToRecord(999);
      
      try {
        ds.edit();
      } catch (error) {
        // Expected to throw
      }
      
      expect(onError).toHaveBeenCalled();
    });

    test('should maintain listener management', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      
      dataSource.addListener(listener1);
      dataSource.addListener(listener2);
      
      dataSource.setFieldValue('nome', 'Test');
      
      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
      
      dataSource.removeListener(listener1);
      dataSource.setFieldValue('nome', 'Test2');
      
      expect(listener1).toHaveBeenCalledTimes(2); // Não deve ser chamado novamente
      expect(listener2).toHaveBeenCalledTimes(4); // Deve ser chamado novamente
    });
  });

  describe('Utility Methods', () => {
    test('should handle records management', () => {
      const newRecords = createTestData.pessoaList(5);
      
      dataSource.setRecords(newRecords);
      
      expect(dataSource.getTotalRecords()).toBe(5);
      expect(dataSource.getRecords()).toEqual(newRecords);
      expect(dataSource.getCurrentIndex()).toBe(0);
    });

    test('should handle page size configuration', () => {
      expect(dataSource.getPageSize()).toBe(20);
      
      dataSource.setPageSize(50);
      expect(dataSource.getPageSize()).toBe(50);
    });

    test('should provide debug information', () => {
      const debugInfo = dataSource.getDebugSnapshot();
      
      expect(debugInfo).toEqual({
        name: 'test-remote-datasource',
        label: 'test-remote-datasource',
        recordCount: 3,
        currentIndex: 0,
        currentRecord: testData[0],
        state: 'browse',
        listeners: 0,
        totalRecords: 3,
        pageSize: 20
      });
    });
  });

  describe('Error Handling', () => {
    test('should handle operations on inactive datasource', () => {
      dataSource.close();
      
      expect(() => dataSource.setFieldValue('nome', 'Test')).toThrow();
      expect(() => dataSource.edit()).toThrow();
    });

    test('should handle invalid array operations gracefully', () => {
      // Should not throw for invalid indices
      dataSource.removeFromFieldArray('contatos', 999);
      dataSource.updateFieldArrayItem('contatos', 999, () => {});
      
      // Should still be in valid state
      expect(dataSource.getCurrentRecord()).toBeTruthy();
      expect(dataSource.getTotalRecords()).toBe(3);
    });

    test('should handle non-array field operations', () => {
      expect(() => dataSource.getFieldArray('nome')).toThrow();
      expect(() => dataSource.appendToFieldArray('nome' as any, 'test')).toThrow();
    });
  });

  describe('Immutability Validation', () => {
    test('should never mutate original data', () => {
      // Store original values
      const originalFirstNome = testData[0].nome;
      const originalFirstCidade = testData[0].endereco.cidade;
      const originalFirstContatosLength = testData[0].contatos.length;
      
      // Multiple operations
      dataSource.setFieldValue('nome', 'Changed');
      dataSource.setFieldValue('endereco.cidade', 'Changed City');
      dataSource.appendToFieldArray('contatos', { 
        tipo: 'EMAIL' as const, 
        valor: 'new@test.com',
        principal: false 
      });
      
      dataSource.next();
      dataSource.setFieldValue('idade', 99);
      
      // Original test data should be completely unchanged
      expect(testData[0].nome).toBe(originalFirstNome);
      expect(testData[0].endereco.cidade).toBe(originalFirstCidade);
      expect(testData[0].contatos).toHaveLength(originalFirstContatosLength);
    });
  });
});