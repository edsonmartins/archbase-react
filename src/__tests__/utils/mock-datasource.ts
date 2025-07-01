import { ArchbaseDataSource, ArchbaseDataSourceConfig } from '../../components/datasource/ArchbaseDataSource';
import { ArchbaseRemoteDataSource, ArchbaseRemoteDataSourceConfig } from '../../components/datasource/ArchbaseRemoteDataSource';
import { ArchbaseRemoteApiService } from '../../components/datasource/ArchbaseRemoteApiService';
import { DataSourceEvent, DataSourceEventNames } from '../../components/datasource/ArchbaseDataSourceEvent';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';

// Mock DataSource para testes unitários
export function createMockDataSource<T, ID>(
  initialData: T[] = [],
  config: Partial<ArchbaseDataSourceConfig<T, ID>> = {}
): ArchbaseDataSource<T, ID> {
  const mockDataSource = new ArchbaseDataSource({
    records: initialData,
    name: config.name || 'test-datasource',
    ...config
  });
  
  // Adicionar métodos de teste para debugging
  (mockDataSource as any).__test__ = {
    getEvents: () => (mockDataSource as any).__events__ || [],
    clearEvents: () => (mockDataSource as any).__events__ = [],
    simulate: (event: DataSourceEvent<T>) => {
      mockDataSource.emit(event);
    },
    getListenerCount: () => (mockDataSource as any).__listeners__?.length || 0,
    getState: () => ({
      currentIndex: mockDataSource.getCurrentRecordIndex(),
      totalRecords: mockDataSource.getTotalRecords(),
      state: mockDataSource.getState(),
      hasErrors: mockDataSource.hasErrors()
    })
  };
  
  return mockDataSource;
}

// Mock RemoteDataSource para testes de integração
export function createMockRemoteDataSource<T, ID>(
  initialData: T[] = [],
  config: Partial<ArchbaseRemoteDataSourceConfig<T, ID>> = {}
): ArchbaseRemoteDataSource<T, ID> {
  const mockService = createMockService(initialData);
  
  const mockRemoteDataSource = new ArchbaseRemoteDataSource({
    service: mockService,
    records: initialData,
    name: config.name || 'test-remote-datasource',
    pageSize: config.pageSize || 50,
    currentPage: config.currentPage || 0,
    ...config
  });

  // Adicionar métodos de teste
  (mockRemoteDataSource as any).__test__ = {
    getService: () => mockService,
    getCallHistory: () => ({
      findAll: mockService.findAll.mock.calls,
      save: mockService.save.mock.calls,
      remove: mockService.remove.mock.calls
    }),
    resetCallHistory: () => {
      jest.clearAllMocks();
    }
  };
  
  return mockRemoteDataSource;
}

// Mock Service com implementação completa
export function createMockService<T, ID>(data: T[]): jest.Mocked<ArchbaseRemoteApiService<T, ID>> {
  return {
    findAll: jest.fn().mockResolvedValue({ 
      content: data, 
      totalElements: data.length,
      totalPages: Math.ceil(data.length / 50),
      number: 0,
      size: data.length,
      first: true,
      last: true,
      numberOfElements: data.length
    }),
    
    findAllWithSort: jest.fn().mockImplementation((page, size, sort) => {
      const startIndex = page * size;
      const endIndex = Math.min(startIndex + size, data.length);
      let sortedData = [...data];
      
      // Simular ordenação básica
      if (sort && sort.length > 0) {
        const [field, direction] = sort[0].split(':');
        sortedData.sort((a, b) => {
          const aVal = (a as any)[field];
          const bVal = (b as any)[field];
          const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return direction === 'DESC' ? -result : result;
        });
      }
      
      return Promise.resolve({ 
        content: sortedData.slice(startIndex, endIndex), 
        totalElements: data.length,
        totalPages: Math.ceil(data.length / size),
        number: page,
        size: size,
        first: page === 0,
        last: endIndex >= data.length,
        numberOfElements: endIndex - startIndex
      });
    }),
    
    findAllWithFilter: jest.fn().mockImplementation((filter, page, size) => {
      const filteredData = data.filter(item => {
        const itemStr = JSON.stringify(item).toLowerCase();
        return itemStr.includes(filter.toLowerCase());
      });
      
      const startIndex = page * size;
      const endIndex = Math.min(startIndex + size, filteredData.length);
      
      return Promise.resolve({ 
        content: filteredData.slice(startIndex, endIndex), 
        totalElements: filteredData.length,
        totalPages: Math.ceil(filteredData.length / size),
        number: page,
        size: size,
        first: page === 0,
        last: endIndex >= filteredData.length,
        numberOfElements: endIndex - startIndex
      });
    }),
    
    findAllWithFilterAndSort: jest.fn().mockImplementation((filter, page, size, sort) => {
      // Aplicar filtro primeiro
      let filteredData = data;
      if (filter) {
        filteredData = data.filter(item => {
          const itemStr = JSON.stringify(item).toLowerCase();
          return itemStr.includes(filter.toLowerCase());
        });
      }
      
      // Aplicar ordenação
      if (sort && sort.length > 0) {
        const [field, direction] = sort[0].split(':');
        filteredData.sort((a, b) => {
          const aVal = (a as any)[field];
          const bVal = (b as any)[field];
          const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return direction === 'DESC' ? -result : result;
        });
      }
      
      const startIndex = page * size;
      const endIndex = Math.min(startIndex + size, filteredData.length);
      
      return Promise.resolve({ 
        content: filteredData.slice(startIndex, endIndex), 
        totalElements: filteredData.length,
        totalPages: Math.ceil(filteredData.length / size),
        number: page,
        size: size,
        first: page === 0,
        last: endIndex >= filteredData.length,
        numberOfElements: endIndex - startIndex
      });
    }),
    
    findOne: jest.fn().mockImplementation((id) => {
      const item = data.find(item => (item as any).id === id);
      return Promise.resolve(item);
    }),
    
    save: jest.fn().mockImplementation((record) => {
      // Simular save - se tem ID, é update; senão, é insert
      const hasId = (record as any).id !== undefined && (record as any).id !== null;
      
      if (hasId) {
        // Update - retorna o mesmo record
        return Promise.resolve(record);
      } else {
        // Insert - adiciona ID
        const newRecord = { ...record, id: Math.floor(Math.random() * 10000) };
        return Promise.resolve(newRecord);
      }
    }),
    
    remove: jest.fn().mockResolvedValue(undefined),
    
    removeMultiple: jest.fn().mockResolvedValue(undefined)
  };
}

// Helpers utilitários para testes
export const DataSourceTestUtils = {
  // Aguardar por um evento específico
  waitForEvent: async <T>(
    dataSource: ArchbaseDataSource<T, any>,
    eventType: string,
    timeout = 1000
  ): Promise<DataSourceEvent<T>> => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Timeout waiting for event: ${eventType}`)), timeout);
      
      const listener = (event: DataSourceEvent<T>) => {
        if (event.type === eventType) {
          clearTimeout(timer);
          dataSource.removeListener(listener);
          resolve(event);
        }
      };
      
      dataSource.addListener(listener);
    });
  },
  
  // Aguardar mudança em campo específico
  waitForFieldChange: async <T>(
    dataSource: ArchbaseDataSource<T, any>,
    fieldName: string,
    timeout = 1000
  ) => {
    return DataSourceTestUtils.waitForEvent(dataSource, DataSourceEventNames.fieldChanged, timeout);
  },
  
  // Simular entrada do usuário
  simulateUserInput: async (element: HTMLElement, value: string) => {
    const user = userEvent.setup();
    await user.clear(element);
    await user.type(element, value);
  },
  
  // Simular clique
  simulateUserClick: async (element: HTMLElement) => {
    const user = userEvent.setup();
    await user.click(element);
  },
  
  // Verificar estado do DataSource
  expectDataSourceState: (dataSource: ArchbaseDataSource<any, any>, expectedState: {
    currentIndex?: number;
    totalRecords?: number;
    state?: string;
    hasErrors?: boolean;
    currentRecord?: any;
  }) => {
    if (expectedState.currentIndex !== undefined) {
      expect(dataSource.getCurrentRecordIndex()).toBe(expectedState.currentIndex);
    }
    if (expectedState.totalRecords !== undefined) {
      expect(dataSource.getTotalRecords()).toBe(expectedState.totalRecords);
    }
    if (expectedState.state !== undefined) {
      expect(dataSource.getState()).toBe(expectedState.state);
    }
    if (expectedState.hasErrors !== undefined) {
      expect(dataSource.hasErrors()).toBe(expectedState.hasErrors);
    }
    if (expectedState.currentRecord !== undefined) {
      expect(dataSource.getCurrentRecord()).toEqual(expectedState.currentRecord);
    }
  },
  
  // Aguardar atualização assíncrona
  waitForAsyncUpdate: async (callback: () => void, timeout = 1000) => {
    await waitFor(callback, { timeout });
  },
  
  // Simular delay de rede
  simulateNetworkDelay: (ms: number = 100) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  
  // Simular erro de rede
  simulateNetworkError: (message: string = 'Network Error') => {
    throw new Error(message);
  },
  
  // Criar mock de paginação
  createMockPage: <T>(content: T[], page = 0, size = 50) => ({
    content,
    totalElements: content.length,
    totalPages: Math.ceil(content.length / size),
    number: page,
    size,
    first: page === 0,
    last: (page + 1) * size >= content.length,
    numberOfElements: content.length
  }),
  
  // Verificar se listener foi removido corretamente
  expectListenerRemoved: (dataSource: ArchbaseDataSource<any, any>, listener: any) => {
    const listenerCount = (dataSource as any).__test__?.getListenerCount() || 0;
    dataSource.setFieldValue('testField', 'testValue');
    expect(listener).not.toHaveBeenCalled();
  },
  
  // Verificar performance
  measurePerformance: async <T>(operation: () => T): Promise<{ result: T; duration: number }> => {
    const start = performance.now();
    const result = await operation();
    const end = performance.now();
    return { result, duration: end - start };
  }
};