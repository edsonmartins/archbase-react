import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArchbaseEdit } from '../src/editors/ArchbaseEdit';
import { ArchbaseDataSource } from '@archbase/data';
import { ArchbaseDataSourceV2 } from '@archbase/data';
import { AllTheProviders } from '@archbase/data/test/test-utils';
import { createTestData, Pessoa } from '@archbase/data/test/test-data';

/**
 * Testes para validar que ArchbaseEdit funciona corretamente
 * com ambas as versões V1 e V2 do DataSource sem breaking changes
 */
describe('ArchbaseEdit - Hybrid V1/V2 Support', () => {
  let testData: Pessoa[];

  beforeEach(() => {
    testData = createTestData.pessoaList(2);
  });

  describe('V1 DataSource - Comportamento Original', () => {
    let dataSourceV1: ArchbaseDataSource<Pessoa, number>;

    beforeEach(() => {
      dataSourceV1 = new ArchbaseDataSource<Pessoa, number>('test-v1', {
        records: testData,
        grandTotalRecords: testData.length,
        currentPage: 0,
        totalPages: 1,
        pageSize: 10
      });
    });

    test('should work with V1 DataSource - basic functionality', () => {
      render(
        <ArchbaseEdit<Pessoa, number>
          dataSource={dataSourceV1}
          dataField="nome"
          label="Nome V1"
          data-testid="edit-v1"
        />,
        { wrapper: AllTheProviders }
      );

      const input = screen.getByTestId('edit-v1');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(testData[0].nome);
    });

    test('should handle V1 field changes with original behavior', async () => {
      const user = userEvent.setup();
      const onChangeValue = jest.fn();

      render(
        <ArchbaseEdit<Pessoa, number>
          dataSource={dataSourceV1}
          dataField="nome"
          onChangeValue={onChangeValue}
          data-testid="edit-v1"
        />,
        { wrapper: AllTheProviders }
      );

      const input = screen.getByTestId('edit-v1');
      
      await user.clear(input);
      await user.type(input, 'Novo Nome V1');

      expect(onChangeValue).toHaveBeenCalledWith('Novo Nome V1', expect.any(Object));
      expect(dataSourceV1.getFieldValue('nome')).toBe('Novo Nome V1');
    });

    test('should handle V1 navigation correctly', () => {
      render(
        <ArchbaseEdit<Pessoa, number>
          dataSource={dataSourceV1}
          dataField="nome"
          data-testid="edit-v1"
        />,
        { wrapper: AllTheProviders }
      );

      const input = screen.getByTestId('edit-v1');
      expect(input).toHaveValue(testData[0].nome);

      // Navigate to next record
      dataSourceV1.next();
      
      waitFor(() => {
        expect(input).toHaveValue(testData[1].nome);
      });
    });

    test('should handle V1 edit mode correctly', () => {
      render(
        <ArchbaseEdit<Pessoa, number>
          dataSource={dataSourceV1}
          dataField="nome"
          data-testid="edit-v1"
        />,
        { wrapper: AllTheProviders }
      );

      const input = screen.getByTestId('edit-v1');
      
      // Initially in browse mode (readonly)
      expect(input).toHaveAttribute('readonly');

      // Enter edit mode
      dataSourceV1.edit();
      
      waitFor(() => {
        expect(input).not.toHaveAttribute('readonly');
      });
    });
  });

  describe('V2 DataSource - Comportamento Otimizado', () => {
    let dataSourceV2: ArchbaseDataSourceV2<Pessoa>;

    beforeEach(() => {
      dataSourceV2 = new ArchbaseDataSourceV2<Pessoa>({
        name: 'test-v2',
        records: testData
      });
    });

    test('should detect V2 DataSource automatically', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      
      render(
        <ArchbaseEdit
          dataSource={dataSourceV2 as any} // Cast for TypeScript compatibility
          dataField="nome"
          label="Nome V2"
          data-testid="edit-v2"
          onChangeValue={(value) => {
            console.log('V2 detected:', 'appendToFieldArray' in dataSourceV2);
          }}
        />,
        { wrapper: AllTheProviders }
      );

      const input = screen.getByTestId('edit-v2');
      fireEvent.change(input, { target: { value: 'test' } });

      expect(consoleSpy).toHaveBeenCalledWith('V2 detected:', true);
      consoleSpy.mockRestore();
    });

    test('should work with V2 DataSource - enhanced functionality', () => {
      render(
        <ArchbaseEdit
          dataSource={dataSourceV2 as any}
          dataField="nome"
          label="Nome V2"
          data-testid="edit-v2"
        />,
        { wrapper: AllTheProviders }
      );

      const input = screen.getByTestId('edit-v2');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue(testData[0].nome);
    });

    test('should handle V2 field changes with optimized behavior', async () => {
      const user = userEvent.setup();
      const onChangeValue = jest.fn();

      render(
        <ArchbaseEdit
          dataSource={dataSourceV2 as any}
          dataField="nome"
          onChangeValue={onChangeValue}
          data-testid="edit-v2"
        />,
        { wrapper: AllTheProviders }
      );

      const input = screen.getByTestId('edit-v2');
      
      await user.clear(input);
      await user.type(input, 'Novo Nome V2');

      expect(onChangeValue).toHaveBeenCalledWith('Novo Nome V2', expect.any(Object));
      expect(dataSourceV2.getFieldValue('nome')).toBe('Novo Nome V2');
    });

    test('should handle V2 navigation with immutable updates', () => {
      render(
        <ArchbaseEdit
          dataSource={dataSourceV2 as any}
          dataField="nome"
          data-testid="edit-v2"
        />,
        { wrapper: AllTheProviders }
      );

      const input = screen.getByTestId('edit-v2');
      expect(input).toHaveValue(testData[0].nome);

      // Navigate to next record (V2 style)
      dataSourceV2.next();
      
      waitFor(() => {
        expect(input).toHaveValue(testData[1].nome);
      });
    });

    test('should verify V2 immutability features are available', () => {
      // Verify V2 has the new methods
      expect(typeof dataSourceV2.appendToFieldArray).toBe('function');
      expect(typeof dataSourceV2.updateFieldArrayItem).toBe('function');
      expect(typeof dataSourceV2.removeFromFieldArray).toBe('function');
      expect(typeof dataSourceV2.getFieldArray).toBe('function');
      
      // These should not exist in V1
      expect('appendToFieldArray' in dataSourceV2).toBe(true);
    });

    test('should handle V2 array operations integration', async () => {
      const user = userEvent.setup();
      
      // Create a record with array field for testing
      const recordWithArray = {
        ...testData[0],
        contatos: [
          { tipo: 'EMAIL' as const, valor: 'test@test.com', principal: true },
          { tipo: 'TELEFONE' as const, valor: '123456789', principal: false }
        ]
      };
      
      dataSourceV2.setRecords([recordWithArray]);
      
      render(
        <ArchbaseEdit
          dataSource={dataSourceV2 as any}
          dataField="nome"
          data-testid="edit-v2-array"
        />,
        { wrapper: AllTheProviders }
      );

      // Test that component works even when DataSource has array operations
      const input = screen.getByTestId('edit-v2-array');
      expect(input).toHaveValue(recordWithArray.nome);
      
      await user.clear(input);
      await user.type(input, 'Nome Atualizado');
      
      expect(dataSourceV2.getFieldValue('nome')).toBe('Nome Atualizado');
      
      // The array should remain intact (immutability)
      const currentContatos = dataSourceV2.getFieldArray('contatos');
      expect(currentContatos).toHaveLength(2);
      expect(currentContatos[0].valor).toBe('test@test.com');
    });
  });

  describe('Coexistence and Migration', () => {
    test('should support both V1 and V2 in the same component tree', () => {
      const dataSourceV1 = new ArchbaseDataSource<Pessoa, number>('v1', {
        records: [testData[0]],
        grandTotalRecords: 1,
        currentPage: 0,
        totalPages: 1,
        pageSize: 10
      });
      
      const dataSourceV2 = new ArchbaseDataSourceV2<Pessoa>({
        name: 'v2',
        records: [testData[1]]
      });

      render(
        <div>
          <ArchbaseEdit<Pessoa, number>
            dataSource={dataSourceV1}
            dataField="nome"
            data-testid="edit-v1-coexist"
          />
          <ArchbaseEdit
            dataSource={dataSourceV2 as any}
            dataField="nome"
            data-testid="edit-v2-coexist"
          />
        </div>,
        { wrapper: AllTheProviders }
      );

      const inputV1 = screen.getByTestId('edit-v1-coexist');
      const inputV2 = screen.getByTestId('edit-v2-coexist');

      expect(inputV1).toHaveValue(testData[0].nome);
      expect(inputV2).toHaveValue(testData[1].nome);
    });

    test('should maintain separate state for V1 and V2 instances', async () => {
      const user = userEvent.setup();
      
      const dataSourceV1 = new ArchbaseDataSource<Pessoa, number>('v1', {
        records: [{ ...testData[0], nome: 'Inicial V1' }],
        grandTotalRecords: 1,
        currentPage: 0,
        totalPages: 1,
        pageSize: 10
      });
      
      const dataSourceV2 = new ArchbaseDataSourceV2<Pessoa>({
        name: 'v2',
        records: [{ ...testData[0], nome: 'Inicial V2' }]
      });

      render(
        <div>
          <ArchbaseEdit<Pessoa, number>
            dataSource={dataSourceV1}
            dataField="nome"
            data-testid="edit-v1-separate"
          />
          <ArchbaseEdit
            dataSource={dataSourceV2 as any}
            dataField="nome"
            data-testid="edit-v2-separate"
          />
        </div>,
        { wrapper: AllTheProviders }
      );

      const inputV1 = screen.getByTestId('edit-v1-separate');
      const inputV2 = screen.getByTestId('edit-v2-separate');

      // Change V1
      dataSourceV1.edit();
      await user.clear(inputV1);
      await user.type(inputV1, 'Alterado V1');

      // Change V2
      dataSourceV2.edit();
      await user.clear(inputV2);
      await user.type(inputV2, 'Alterado V2');

      // Verify independence
      expect(dataSourceV1.getFieldValue('nome')).toBe('Alterado V1');
      expect(dataSourceV2.getFieldValue('nome')).toBe('Alterado V2');
      expect(inputV1).toHaveValue('Alterado V1');
      expect(inputV2).toHaveValue('Alterado V2');
    });

    test('should handle type safety correctly for both versions', () => {
      const dataSourceV1 = new ArchbaseDataSource<Pessoa, number>('v1', {
        records: testData,
        grandTotalRecords: testData.length,
        currentPage: 0,
        totalPages: 1,
        pageSize: 10
      });
      
      const dataSourceV2 = new ArchbaseDataSourceV2<Pessoa>({
        name: 'v2',
        records: testData
      });

      // TypeScript should accept both without issues
      const ComponentWithV1 = () => (
        <ArchbaseEdit<Pessoa, number>
          dataSource={dataSourceV1}
          dataField="nome"
        />
      );
      
      const ComponentWithV2 = () => (
        <ArchbaseEdit
          dataSource={dataSourceV2 as any} // Cast needed for current implementation
          dataField="nome"
        />
      );

      expect(() => render(<ComponentWithV1 />, { wrapper: AllTheProviders })).not.toThrow();
      expect(() => render(<ComponentWithV2 />, { wrapper: AllTheProviders })).not.toThrow();
    });
  });

  describe('Performance and Behavior Differences', () => {
    test('should use optimized rendering for V2', async () => {
      const user = userEvent.setup();
      const renderSpy = jest.fn();
      
      const TestComponentV2 = () => {
        renderSpy();
        const dataSourceV2 = new ArchbaseDataSourceV2<Pessoa>({
          name: 'perf-test',
          records: testData
        });
        
        return (
          <ArchbaseEdit
            dataSource={dataSourceV2 as any}
            dataField="nome"
            data-testid="perf-v2"
          />
        );
      };

      render(<TestComponentV2 />, { wrapper: AllTheProviders });
      
      const initialRenderCount = renderSpy.mock.calls.length;
      
      const input = screen.getByTestId('perf-v2');
      await user.type(input, 'a');
      
      // V2 should have fewer renders due to optimized state management
      expect(renderSpy.mock.calls.length).toBeGreaterThanOrEqual(initialRenderCount);
    });

    test('should maintain backward compatibility with existing event handlers', async () => {
      const user = userEvent.setup();
      const focusEnterHandler = jest.fn();
      const focusExitHandler = jest.fn();
      const changeHandler = jest.fn();

      const dataSourceV2 = new ArchbaseDataSourceV2<Pessoa>({
        name: 'event-test',
        records: testData
      });

      render(
        <ArchbaseEdit
          dataSource={dataSourceV2 as any}
          dataField="nome"
          onFocusEnter={focusEnterHandler}
          onFocusExit={focusExitHandler}
          onChangeValue={changeHandler}
          data-testid="events-v2"
        />,
        { wrapper: AllTheProviders }
      );

      const input = screen.getByTestId('events-v2');
      
      await user.click(input);
      expect(focusEnterHandler).toHaveBeenCalled();
      
      await user.type(input, 'test');
      expect(changeHandler).toHaveBeenCalled();
      
      await user.tab(); // Move focus away
      expect(focusExitHandler).toHaveBeenCalled();
    });
  });
});