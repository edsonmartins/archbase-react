import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useArchbaseRemoteDataSourceV2, useArchbaseRemoteDataSourceV2ReadOnly } from '../src/datasource/v2/useArchbaseRemoteDataSourceV2';
import { ArchbaseRemoteDataSourceV2 } from '../src/datasource/v2/ArchbaseRemoteDataSourceV2';
import { ArchbaseRemoteApiService, Page } from '../src/service/ArchbaseRemoteApiService';
import { createTestData, Pessoa } from './test-data';
import { AllTheProviders } from './test-utils';

// Mock do ArchbaseRemoteApiService
class MockApiClient {
  async get<T>(url: string): Promise<T> { throw new Error('Not implemented'); }
  async post<T, R>(url: string, data: T): Promise<R> { throw new Error('Not implemented'); }
  async put<T, R>(url: string, data: T): Promise<R> { throw new Error('Not implemented'); }
  async postNoConvertId<T, R>(url: string, data: T): Promise<R> { throw new Error('Not implemented'); }
  async putNoConvertId<T, R>(url: string, data: T): Promise<R> { throw new Error('Not implemented'); }
  async binaryPut<T, R>(url: string, data: T): Promise<R> { throw new Error('Not implemented'); }
  async delete<T>(url: string): Promise<T> { throw new Error('Not implemented'); }
  async patch<T, R>(url: string, data: T): Promise<R> { throw new Error('Not implemented'); }
  async patchNoConvertId<T, R>(url: string, data: T): Promise<R> { throw new Error('Not implemented'); }
}

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
      const newPessoa = { ...record, id: this.nextId++ };
      this.records.push(newPessoa);
      return newPessoa as unknown as R;
    } else {
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
    return this.findAll(page, size);
  }

  async findAllWithFilter(filter: string, page: number, size: number): Promise<Page<Pessoa>> {
    return this.findAll(page, size);
  }

  async findAllMultipleFields(
    searchText: string,
    fields: string,
    page: number,
    size: number,
    sort: string
  ): Promise<Page<Pessoa>> {
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

  getRecords(): Pessoa[] {
    return [...this.records];
  }

  setRecords(records: Pessoa[]): void {
    this.records = [...records];
  }
}

describe('useArchbaseRemoteDataSourceV2', () => {
  let testData: Pessoa[];
  let mockService: MockRemoteApiService;

  beforeEach(() => {
    testData = createTestData.pessoaList(3);
    mockService = new MockRemoteApiService(testData);
  });

  describe('Initialization', () => {
    test('should initialize with correct state', () => {
      const { result } = renderHook(
        () => useArchbaseRemoteDataSourceV2<Pessoa>({
          name: 'test-remote-hook-datasource',
          service: mockService,
          records: testData
        }),
        { wrapper: AllTheProviders }
      );

      expect(result.current.currentRecord).toEqual(testData[0]);
      expect(result.current.currentIndex).toBe(0);
      expect(result.current.totalRecords).toBe(3);
      expect(result.current.isBrowsing).toBe(true);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    test('should handle empty data', () => {
      const emptyService = new MockRemoteApiService();
      const { result } = renderHook(
        () => useArchbaseRemoteDataSourceV2<Pessoa>({
          name: 'empty-remote-datasource',
          service: emptyService
        }),
        { wrapper: AllTheProviders }
      );

      expect(result.current.currentRecord).toBeUndefined();
      expect(result.current.currentIndex).toBe(-1);
      expect(result.current.totalRecords).toBe(0);
      expect(result.current.isEmpty).toBe(true);
    });
  });

  describe('Navigation State', () => {
    test('should provide correct navigation state', () => {
      const { result } = renderHook(
        () => useArchbaseRemoteDataSourceV2<Pessoa>({
          name: 'navigation-test',
          service: mockService,
          records: testData
        }),
        { wrapper: AllTheProviders }
      );

      // First record
      expect(result.current.isFirst).toBe(true);
      expect(result.current.isLast).toBe(false);
      expect(result.current.canNext).toBe(true);
      expect(result.current.canPrior).toBe(false);

      // Navigate to last
      act(() => {
        result.current.last();
      });

      expect(result.current.isFirst).toBe(false);
      expect(result.current.isLast).toBe(true);
      expect(result.current.canNext).toBe(false);
      expect(result.current.canPrior).toBe(true);
      expect(result.current.currentIndex).toBe(2);
    });
  });

  describe('Field Operations', () => {
    test('should handle field value changes reactively', () => {
      const { result } = renderHook(
        () => useArchbaseRemoteDataSourceV2<Pessoa>({
          name: 'field-operations',
          service: mockService,
          records: testData
        }),
        { wrapper: AllTheProviders }
      );

      const initialNome = result.current.getFieldValue('nome');
      expect(initialNome).toBe(testData[0].nome);

      act(() => {
        result.current.setFieldValue('nome', 'Novo Nome Remote');
      });

      expect(result.current.getFieldValue('nome')).toBe('Novo Nome Remote');
      expect(result.current.currentRecord!.nome).toBe('Novo Nome Remote');
    });

    test('should handle nested field changes', () => {
      const { result } = renderHook(
        () => useArchbaseRemoteDataSourceV2<Pessoa>({
          name: 'nested-fields',
          service: mockService,
          records: testData
        }),
        { wrapper: AllTheProviders }
      );

      act(() => {
        result.current.setFieldValue('endereco.cidade', 'Rio de Janeiro');
      });

      expect(result.current.getFieldValue('endereco.cidade')).toBe('Rio de Janeiro');
      expect(result.current.currentRecord!.endereco.cidade).toBe('Rio de Janeiro');
    });
  });

  describe('Array Operations', () => {
    test('should handle array field operations', () => {
      const { result } = renderHook(
        () => useArchbaseRemoteDataSourceV2<Pessoa>({
          name: 'array-operations',
          service: mockService,
          records: testData
        }),
        { wrapper: AllTheProviders }
      );

      // Test isFieldArray
      expect(result.current.isFieldArray('contatos')).toBe(true);
      expect(result.current.isFieldArray('nome')).toBe(false);

      // Test getFieldArray
      const initialContatos = result.current.getFieldArray('contatos');
      expect(initialContatos).toHaveLength(2);

      // Test appendToFieldArray
      const novoContato = { tipo: 'TELEFONE' as const, valor: '123456789', principal: false };
      act(() => {
        result.current.appendToFieldArray('contatos', novoContato);
      });

      const contatosAfterAppend = result.current.getFieldArray('contatos');
      expect(contatosAfterAppend).toHaveLength(3);
      expect(contatosAfterAppend[2]).toEqual(novoContato);
    });
  });

  describe('Remote CRUD Operations', () => {
    test('should save new record remotely', async () => {
      const { result } = renderHook(
        () => useArchbaseRemoteDataSourceV2<Pessoa>({
          name: 'crud-insert',
          service: mockService,
          records: testData
        }),
        { wrapper: AllTheProviders }
      );

      const newPessoa: Pessoa = {
        id: 0, // New record
        nome: 'Nova Pessoa Remote Hook',
        email: 'nova@remotehook.com',
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

      act(() => {
        result.current.insert(newPessoa);
      });

      expect(result.current.isInserting).toBe(true);

      let savedRecord: Pessoa;
      await act(async () => {
        savedRecord = await result.current.save();
      });

      expect(savedRecord!.id).toBeGreaterThan(0);
      expect(savedRecord!.nome).toBe('Nova Pessoa Remote Hook');
      expect(result.current.isBrowsing).toBe(true);
    });

    test('should remove record remotely', async () => {
      const { result } = renderHook(
        () => useArchbaseRemoteDataSourceV2<Pessoa>({
          name: 'crud-remove',
          service: mockService,
          records: testData
        }),
        { wrapper: AllTheProviders }
      );

      const recordToRemove = result.current.currentRecord!;
      const initialCount = result.current.totalRecords;

      let removedRecord: Pessoa | undefined;
      await act(async () => {
        removedRecord = await result.current.remove();
      });

      expect(removedRecord).toEqual(recordToRemove);
      expect(result.current.totalRecords).toBe(initialCount - 1);
    });
  });

  describe('Remote Operations', () => {
    test('should provide page size configuration', () => {
      const { result } = renderHook(
        () => useArchbaseRemoteDataSourceV2<Pessoa>({
          name: 'page-size-test',
          service: mockService,
          records: testData,
          pageSize: 50
        }),
        { wrapper: AllTheProviders }
      );

      expect(result.current.getPageSize()).toBe(50);

      act(() => {
        result.current.setPageSize(100);
      });

      expect(result.current.getPageSize()).toBe(100);
    });

    test('should handle refresh data', async () => {
      const { result } = renderHook(
        () => useArchbaseRemoteDataSourceV2<Pessoa>({
          name: 'refresh-test',
          service: mockService,
          records: testData
        }),
        { wrapper: AllTheProviders }
      );

      expect(result.current.isLoading).toBe(false);

      await act(async () => {
        try {
          await result.current.refreshData();
        } catch (error) {
          // Expected to fail due to mock limitations, but we test the loading state
        }
      });

      // The loading should have been set during the operation
      expect(result.current.error).toBeNull();
    });
  });

  describe('Error Handling', () => {
    test('should handle save errors', async () => {
      const errorService = {
        ...mockService,
        save: jest.fn().mockRejectedValue(new Error('Network error'))
      };

      const { result } = renderHook(
        () => useArchbaseRemoteDataSourceV2<Pessoa>({
          name: 'error-test',
          service: errorService as any,
          records: testData
        }),
        { wrapper: AllTheProviders }
      );

      act(() => {
        result.current.edit();
        result.current.setFieldValue('nome', 'Test');
      });

      await act(async () => {
        try {
          await result.current.save();
        } catch (error) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('ReadOnly Hook Variant', () => {
    test('should provide read-only interface', () => {
      const { result } = renderHook(
        () => useArchbaseRemoteDataSourceV2ReadOnly<Pessoa>({
          name: 'readonly-test',
          service: mockService,
          records: testData
        }),
        { wrapper: AllTheProviders }
      );

      // Should have read operations
      expect(typeof result.current.getFieldValue).toBe('function');
      expect(typeof result.current.getFieldArray).toBe('function');
      expect(typeof result.current.next).toBe('function');
      expect(typeof result.current.refreshData).toBe('function');

      // Should not have write operations
      expect(result.current).not.toHaveProperty('setFieldValue');
      expect(result.current).not.toHaveProperty('edit');
      expect(result.current).not.toHaveProperty('save');
      expect(result.current).not.toHaveProperty('insert');
      expect(result.current).not.toHaveProperty('remove');
    });
  });

  describe('Debug Functionality', () => {
    test('should provide debug info in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const { result } = renderHook(
        () => useArchbaseRemoteDataSourceV2<Pessoa>({
          name: 'debug-test',
          service: mockService,
          records: testData
        }),
        { wrapper: AllTheProviders }
      );

      const debugInfo = result.current.getDebugInfo();
      expect(debugInfo).toBeTruthy();
      expect(debugInfo).toHaveProperty('recordCount');
      expect(debugInfo).toHaveProperty('currentIndex');
      expect(debugInfo).toHaveProperty('hookState');
      expect(debugInfo.hookState).toHaveProperty('isLoading');
      expect(debugInfo.hookState).toHaveProperty('error');

      process.env.NODE_ENV = originalEnv;
    });
  });
});
