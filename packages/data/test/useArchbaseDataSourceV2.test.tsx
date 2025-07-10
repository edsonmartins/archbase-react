import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { useArchbaseDataSourceV2, useArchbaseDataSourceV2ReadOnly } from '../src/datasource/v2/useArchbaseDataSourceV2';
import { ArchbaseDataSourceV2 } from '../src/datasource/v2/ArchbaseDataSourceV2';
import { createTestData, Pessoa } from './test-data';
import { AllTheProviders } from './test-utils';

describe('useArchbaseDataSourceV2', () => {
  let testData: Pessoa[];

  beforeEach(() => {
    testData = createTestData.pessoaList(3);
  });

  describe('Initialization', () => {
    test('should initialize with correct state', () => {
      const { result } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'test-hook-datasource'
        }),
        { wrapper: AllTheProviders }
      );

      expect(result.current.currentRecord).toEqual(testData[0]);
      expect(result.current.currentIndex).toBe(0);
      expect(result.current.totalRecords).toBe(3);
      expect(result.current.isBrowsing).toBe(true);
      expect(result.current.isLoading).toBe(false);
    });

    test('should handle empty data', () => {
      const { result } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: [],
          name: 'empty-datasource'
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
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'navigation-test'
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

    test('should navigate correctly with methods', () => {
      const { result } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'navigation-methods'
        }),
        { wrapper: AllTheProviders }
      );

      // Test next
      act(() => {
        result.current.next();
      });
      expect(result.current.currentIndex).toBe(1);
      expect(result.current.currentRecord).toEqual(testData[1]);

      // Test prior
      act(() => {
        result.current.prior();
      });
      expect(result.current.currentIndex).toBe(0);
      expect(result.current.currentRecord).toEqual(testData[0]);

      // Test goToRecord
      act(() => {
        result.current.goToRecord(2);
      });
      expect(result.current.currentIndex).toBe(2);
      expect(result.current.currentRecord).toEqual(testData[2]);
    });
  });

  describe('Field Operations', () => {
    test('should handle field value changes reactively', () => {
      const { result } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'field-operations'
        }),
        { wrapper: AllTheProviders }
      );

      const initialNome = result.current.getFieldValue('nome');
      expect(initialNome).toBe(testData[0].nome);

      act(() => {
        result.current.setFieldValue('nome', 'Novo Nome');
      });

      expect(result.current.getFieldValue('nome')).toBe('Novo Nome');
      expect(result.current.currentRecord!.nome).toBe('Novo Nome');
      
      // Original data should remain unchanged (immutability)
      expect(testData[0].nome).not.toBe('Novo Nome');
    });

    test('should handle nested field changes', () => {
      const { result } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'nested-fields'
        }),
        { wrapper: AllTheProviders }
      );

      act(() => {
        result.current.setFieldValue('endereco.cidade', 'Rio de Janeiro');
      });

      expect(result.current.getFieldValue('endereco.cidade')).toBe('Rio de Janeiro');
      expect(result.current.currentRecord!.endereco.cidade).toBe('Rio de Janeiro');
      
      // Original nested object should remain unchanged
      expect(testData[0].endereco.cidade).toBe('São Paulo');
    });
  });

  describe('Array Operations', () => {
    test('should handle array field operations', () => {
      const { result } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'array-operations'
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

    test('should handle array item updates', () => {
      const { result } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'array-updates'
        }),
        { wrapper: AllTheProviders }
      );

      act(() => {
        result.current.updateFieldArrayItem('contatos', 0, (draft) => {
          draft.valor = 'updated@email.com';
        });
      });

      const updatedContatos = result.current.getFieldArray('contatos');
      expect(updatedContatos[0].valor).toBe('updated@email.com');
      
      // Original should remain unchanged
      expect(testData[0].contatos[0].valor).not.toBe('updated@email.com');
    });

    test('should handle array item removal', () => {
      const { result } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'array-removal'
        }),
        { wrapper: AllTheProviders }
      );

      const initialLength = result.current.getFieldArray('contatos').length;

      act(() => {
        result.current.removeFromFieldArray('contatos', 0);
      });

      const contatosAfterRemoval = result.current.getFieldArray('contatos');
      expect(contatosAfterRemoval).toHaveLength(initialLength - 1);
      
      // Original array should remain unchanged
      expect(testData[0].contatos).toHaveLength(initialLength);
    });

    test('should handle array item insertion', () => {
      const { result } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'array-insertion'
        }),
        { wrapper: AllTheProviders }
      );

      const novoContato = { tipo: 'EMAIL' as const, valor: 'insert@test.com', principal: false };

      act(() => {
        result.current.insertIntoFieldArray('contatos', 1, novoContato);
      });

      const contatosAfterInsert = result.current.getFieldArray('contatos');
      expect(contatosAfterInsert).toHaveLength(3);
      expect(contatosAfterInsert[1]).toEqual(novoContato);
      
      // Check that other items are in correct positions
      expect(contatosAfterInsert[0]).toEqual(testData[0].contatos[0]);
      expect(contatosAfterInsert[2]).toEqual(testData[0].contatos[1]);
    });
  });

  describe('CRUD Operations', () => {
    test('should handle record insertion', () => {
      const { result } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'crud-insert'
        }),
        { wrapper: AllTheProviders }
      );

      const initialCount = result.current.totalRecords;

      act(() => {
        result.current.insert({ nome: 'Nova Pessoa', id: 999 } as Pessoa);
      });

      expect(result.current.totalRecords).toBe(initialCount + 1);
      expect(result.current.isInserting).toBe(true);
      expect(result.current.currentRecord!.nome).toBe('Nova Pessoa');
      expect(result.current.currentIndex).toBe(initialCount);
    });

    test('should handle record removal', async () => {
      const { result } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'crud-remove'
        }),
        { wrapper: AllTheProviders }
      );

      const initialCount = result.current.totalRecords;
      const recordToRemove = result.current.currentRecord;

      await act(async () => {
        await result.current.remove();
      });

      expect(result.current.totalRecords).toBe(initialCount - 1);
      expect(result.current.currentRecord).not.toEqual(recordToRemove);
    });

    test('should handle edit mode', () => {
      const { result } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'crud-edit'
        }),
        { wrapper: AllTheProviders }
      );

      act(() => {
        result.current.edit();
      });

      expect(result.current.isEditing).toBe(true);
      expect(result.current.isBrowsing).toBe(false);
    });

    test('should handle save and cancel', async () => {
      const { result } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'save-cancel'
        }),
        { wrapper: AllTheProviders }
      );

      // Enter edit mode
      act(() => {
        result.current.edit();
      });

      // Make changes
      act(() => {
        result.current.setFieldValue('nome', 'Nome Editado');
      });

      // Save changes
      await act(async () => {
        await result.current.save();
      });

      expect(result.current.isBrowsing).toBe(true);
      expect(result.current.currentRecord!.nome).toBe('Nome Editado');

      // Test cancel
      act(() => {
        result.current.edit();
        result.current.setFieldValue('nome', 'Nome Temporário');
      });

      act(() => {
        result.current.cancel();
      });

      expect(result.current.isBrowsing).toBe(true);
      expect(result.current.currentRecord!.nome).toBe('Nome Editado'); // Should revert
    });
  });

  describe('Performance and Cleanup', () => {
    test('should cleanup properly on unmount', () => {
      const { result, unmount } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'cleanup-test'
        }),
        { wrapper: AllTheProviders }
      );

      const dataSource = result.current.dataSource;
      // Para V2, listeners são um Set
      const initialListenerCount = dataSource instanceof ArchbaseDataSourceV2 
        ? (dataSource as any).listeners?.size || 0
        : (dataSource as any).__listeners__?.length || 0;

      expect(initialListenerCount).toBeGreaterThan(0);

      unmount();

      // After unmount, listeners should be cleaned up
      const finalListenerCount = dataSource instanceof ArchbaseDataSourceV2
        ? (dataSource as any).listeners?.size || 0
        : (dataSource as any).__listeners__?.length || 0;
      expect(finalListenerCount).toBe(0);
    });

    test('should not recreate dataSource on re-renders', () => {
      let renderCount = 0;
      const TestComponent = () => {
        renderCount++;
        const hook = useArchbaseDataSourceV2({
          records: testData,
          name: 'stability-test'
        });
        return hook;
      };

      const { result, rerender } = renderHook(TestComponent, { wrapper: AllTheProviders });
      const firstDataSource = result.current.dataSource;

      rerender();
      const secondDataSource = result.current.dataSource;

      expect(firstDataSource).toBe(secondDataSource);
      expect(renderCount).toBe(2);
    });
  });

  describe('Debug Functionality', () => {
    test('should provide debug info in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const { result } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'debug-test'
        }),
        { wrapper: AllTheProviders }
      );

      const debugInfo = result.current.getDebugInfo();
      expect(debugInfo).toBeTruthy();
      expect(debugInfo).toHaveProperty('recordCount');
      expect(debugInfo).toHaveProperty('currentIndex');
      expect(debugInfo).toHaveProperty('hookState');

      process.env.NODE_ENV = originalEnv;
    });

    test('should not provide debug info in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const { result } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'production-test'
        }),
        { wrapper: AllTheProviders }
      );

      const debugInfo = result.current.getDebugInfo();
      expect(debugInfo).toBeNull();

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('ReadOnly Hook Variant', () => {
    test('should provide read-only interface', () => {
      const { result } = renderHook(
        () => useArchbaseDataSourceV2ReadOnly<Pessoa>({
          records: testData,
          name: 'readonly-test'
        }),
        { wrapper: AllTheProviders }
      );

      // Should have read operations
      expect(typeof result.current.getFieldValue).toBe('function');
      expect(typeof result.current.getFieldArray).toBe('function');
      expect(typeof result.current.next).toBe('function');

      // Should not have write operations
      expect(result.current).not.toHaveProperty('setFieldValue');
      expect(result.current).not.toHaveProperty('edit');
      expect(result.current).not.toHaveProperty('save');
      expect(result.current).not.toHaveProperty('insert');
      expect(result.current).not.toHaveProperty('remove');
    });
  });

  describe('Error Handling', () => {
    test('should handle errors gracefully', () => {
      const { result } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'error-test'
        }),
        { wrapper: AllTheProviders }
      );

      // Test with invalid operations that should not crash
      act(() => {
        result.current.removeFromFieldArray('contatos', 999);
        result.current.updateFieldArrayItem('nonexistent' as any, 0, () => {});
      });

      // Should still be in a valid state
      expect(result.current.currentRecord).toBeTruthy();
      expect(result.current.totalRecords).toBe(3);
    });
  });

  describe('Complex Scenarios', () => {
    test('should handle multiple operations in sequence', () => {
      const { result } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'complex-operations'
        }),
        { wrapper: AllTheProviders }
      );

      act(() => {
        // Edit record
        result.current.edit();
        result.current.setFieldValue('nome', 'Nome Complexo');
        result.current.setFieldValue('endereco.cidade', 'Nova Cidade');
        
        // Add to array
        result.current.appendToFieldArray('contatos', {
          tipo: 'TELEFONE' as const,
          valor: '999999999',
          principal: false
        });
        
        // Update array item
        result.current.updateFieldArrayItem('contatos', 0, (draft) => {
          draft.principal = true;
        });
      });

      // Verify all changes
      expect(result.current.currentRecord!.nome).toBe('Nome Complexo');
      expect(result.current.currentRecord!.endereco.cidade).toBe('Nova Cidade');
      expect(result.current.getFieldArray('contatos')).toHaveLength(3);
      expect(result.current.getFieldArray('contatos')[0].principal).toBe(true);
      expect(result.current.isEditing).toBe(true);
    });

    test('should maintain state consistency across navigation', () => {
      const { result } = renderHook(
        () => useArchbaseDataSourceV2<Pessoa>({
          records: testData,
          name: 'navigation-consistency'
        }),
        { wrapper: AllTheProviders }
      );

      // Modify first record
      act(() => {
        result.current.setFieldValue('nome', 'Primeiro Modificado');
      });

      const firstModified = result.current.currentRecord;

      // Navigate to second record
      act(() => {
        result.current.next();
        result.current.setFieldValue('nome', 'Segundo Modificado');
      });

      // Navigate back to first
      act(() => {
        result.current.prior();
      });

      // First record should still have its modifications
      expect(result.current.currentRecord!.nome).toBe('Primeiro Modificado');
      expect(result.current.currentRecord).toBe(firstModified);
    });
  });
});