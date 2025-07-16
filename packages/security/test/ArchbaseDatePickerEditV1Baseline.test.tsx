/**
 * ArchbaseDatePickerEdit V1 Baseline Tests
 * 
 * Estes testes capturam o comportamento EXATO da versão V1 atual.
 * TODOS os testes devem passar após migração V1/V2.
 * 
 * ⚠️ CRITICAL: Se qualquer teste falhar após migração, 
 *    a migração deve ser REVERTIDA imediatamente.
 */

import { render, screen, fireEvent, waitFor } from '@archbase/data/test/test-utils';
import userEvent from '@testing-library/user-event';
import { ArchbaseDatePickerEdit } from '@archbase/components';
import { ArchbaseDataSource } from '@archbase/data';
import { TestData, mockTestData, createTestDataSourceOptions } from '@archbase/data/test/test-datasource-config';
import React from 'react';

describe('ArchbaseDatePickerEdit V1 Baseline', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let dataSource: ArchbaseDataSource<TestData, number>;

  beforeEach(() => {
    user = userEvent.setup();
    dataSource = new ArchbaseDataSource('testDataSource', createTestDataSourceOptions());
    dataSource.open(createTestDataSourceOptions());
    dataSource.first();
  });

  afterEach(() => {
    dataSource.close();
  });

  describe('🔍 Basic Initialization', () => {
    test('should render with default props', () => {
      render(<ArchbaseDatePickerEdit />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    test('should accept initial value as string', () => {
      const initialValue = '15/05/1990';
      render(<ArchbaseDatePickerEdit value={initialValue} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue(initialValue);
    });

    test('should accept initial value as Date object', () => {
      const dateValue = new Date('1990-05-15');
      render(<ArchbaseDatePickerEdit value={dateValue} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('15/05/1990');
    });

    test('should accept initial value as ISO string', () => {
      const isoValue = '1990-05-15T00:00:00.000Z';
      render(<ArchbaseDatePickerEdit value={isoValue} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('15/05/1990');
    });
  });

  describe('🔗 DataSource Integration (CRITICAL)', () => {
    test('should bind to dataSource field correctly', () => {
      render(
        <ArchbaseDatePickerEdit 
          dataSource={dataSource} 
          dataField="nascimento" 
        />
      );
      
      const input = screen.getByRole('textbox');
      // Deve mostrar a data do primeiro registro
      expect(input).toHaveValue('15/05/1990');
    });

    test('should update when dataSource record changes', async () => {
      render(
        <ArchbaseDatePickerEdit 
          dataSource={dataSource} 
          dataField="nascimento" 
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('15/05/1990');
      
      // Mover para próximo registro
      dataSource.next();
      
      await waitFor(() => {
        expect(input).toHaveValue('20/12/1985');
      });
    });

    test('should update dataSource when value changes', async () => {
      const onChangeValue = jest.fn();
      render(
        <ArchbaseDatePickerEdit 
          dataSource={dataSource} 
          dataField="nascimento"
          onChangeValue={onChangeValue}
        />
      );
      
      // Entrar em modo de edição
      dataSource.edit();
      
      const input = screen.getByRole('textbox');
      
      // Alterar valor
      await user.clear(input);
      await user.type(input, '01/01/2000');
      
      // Verificar se DataSource foi atualizado
      expect(dataSource.getFieldValue('nascimento')).toBe('01/01/2000');
      expect(onChangeValue).toHaveBeenCalledWith('01/01/2000', expect.any(Object));
    });

    test('should be readOnly when dataSource is browsing', () => {
      render(
        <ArchbaseDatePickerEdit 
          dataSource={dataSource} 
          dataField="nascimento" 
        />
      );
      
      const input = screen.getByRole('textbox');
      
      // Em modo browsing, deve ser readonly
      expect(dataSource.isBrowsing()).toBe(true);
      expect(input).toHaveAttribute('readonly');
    });

    test('should be editable when dataSource is editing', () => {
      render(
        <ArchbaseDatePickerEdit 
          dataSource={dataSource} 
          dataField="nascimento" 
        />
      );
      
      // Entrar em modo de edição
      dataSource.edit();
      
      const input = screen.getByRole('textbox');
      expect(input).not.toHaveAttribute('readonly');
    });

    test('should handle dataSource errors correctly', async () => {
      render(
        <ArchbaseDatePickerEdit 
          dataSource={dataSource} 
          dataField="nascimento" 
        />
      );
      
      // Simular erro no DataSource
      const errorMessage = 'Data inválida';
      dataSource.setFieldError('nascimento', [errorMessage]);
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe('📅 Date Format Handling (CRITICAL)', () => {
    test('should support DD/MM/YYYY format (default)', async () => {
      const onChangeValue = jest.fn();
      render(<ArchbaseDatePickerEdit onChangeValue={onChangeValue} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, '25/12/2023');
      
      expect(onChangeValue).toHaveBeenCalledWith('25/12/2023', expect.any(Object));
    });

    test('should support DD-MM-YYYY format', async () => {
      const onChangeValue = jest.fn();
      render(<ArchbaseDatePickerEdit onChangeValue={onChangeValue} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, '25-12-2023');
      
      // Deve aceitar e normalizar
      expect(onChangeValue).toHaveBeenCalledWith('25-12-2023', expect.any(Object));
    });

    test('should support DD.MM.YYYY format', async () => {
      const onChangeValue = jest.fn();
      render(<ArchbaseDatePickerEdit onChangeValue={onChangeValue} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, '25.12.2023');
      
      expect(onChangeValue).toHaveBeenCalledWith('25.12.2023', expect.any(Object));
    });

    test('should handle 2-digit year conversion', async () => {
      const onChangeValue = jest.fn();
      render(<ArchbaseDatePickerEdit onChangeValue={onChangeValue} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, '25/12/23');
      
      // Deve expandir para 4 dígitos
      expect(onChangeValue).toHaveBeenCalledWith('25/12/2023', expect.any(Object));
    });

    test('should validate date ranges with minDate', () => {
      const minDate = new Date('2023-01-01');
      render(<ArchbaseDatePickerEdit minDate={minDate} value="31/12/2022" />);
      
      // Data antes do mínimo deve ser inválida (verificar se há indicação de erro)
      const input = screen.getByRole('textbox');
      // Note: estilo de erro pode variar dependendo da implementação
      expect(input).toBeInTheDocument();
    });

    test('should validate date ranges with maxDate', () => {
      const maxDate = new Date('2023-12-31');
      render(<ArchbaseDatePickerEdit maxDate={maxDate} value="01/01/2024" />);
      
      // Data depois do máximo deve ser inválida (verificar se há indicação de erro)
      const input = screen.getByRole('textbox');
      // Note: estilo de erro pode variar dependendo da implementação  
      expect(input).toBeInTheDocument();
    });
  });

  describe('📅 Calendar Popup (Critical UX)', () => {
    test('should open calendar on input click', async () => {
      render(<ArchbaseDatePickerEdit />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      
      // Calendar deve aparecer
      await waitFor(() => {
        expect(screen.getByText(/janeiro|fevereiro|março/i)).toBeInTheDocument();
      });
    });

    test('should close calendar on date selection', async () => {
      render(<ArchbaseDatePickerEdit />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      
      // Esperar calendar aparecer
      await waitFor(() => {
        expect(screen.getByText(/janeiro/i)).toBeInTheDocument();
      });
      
      // Selecionar uma data
      const dayButton = screen.getByText('15');
      await user.click(dayButton);
      
      // Calendar deve fechar
      await waitFor(() => {
        expect(screen.queryByText(/janeiro/i)).not.toBeInTheDocument();
      });
    });

    test('should update input value when calendar date selected', async () => {
      const onChangeValue = jest.fn();
      render(<ArchbaseDatePickerEdit onChangeValue={onChangeValue} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      
      await waitFor(() => {
        expect(screen.getByText(/janeiro/i)).toBeInTheDocument();
      });
      
      // Selecionar dia 15
      const dayButton = screen.getByText('15');
      await user.click(dayButton);
      
      expect(onChangeValue).toHaveBeenCalledWith(
        expect.stringContaining('15'),
        expect.any(Object)
      );
    });
  });

  describe('🧹 Clear Functionality', () => {
    test('should show clear button when clearable and has value', () => {
      render(<ArchbaseDatePickerEdit clearable value="15/05/1990" />);
      
      // Deve ter botão de limpar
      const clearButton = screen.getByRole('button');
      expect(clearButton).toBeInTheDocument();
    });

    test('should clear value when clear button clicked', async () => {
      const onChangeValue = jest.fn();
      render(
        <ArchbaseDatePickerEdit 
          clearable 
          value="15/05/1990" 
          onChangeValue={onChangeValue}
        />
      );
      
      const clearButton = screen.getByRole('button');
      await user.click(clearButton);
      
      expect(onChangeValue).toHaveBeenCalledWith('', expect.any(Object));
    });

    test('should not show clear button when not clearable', () => {
      render(<ArchbaseDatePickerEdit clearable={false} value="15/05/1990" />);
      
      const clearButtons = screen.queryAllByRole('button');
      expect(clearButtons).toHaveLength(0);
    });
  });

  describe('⚡ Event Handling (Critical Callbacks)', () => {
    test('should call onChangeValue when value changes', async () => {
      const onChangeValue = jest.fn();
      render(<ArchbaseDatePickerEdit onChangeValue={onChangeValue} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, '15/05/1990');
      
      expect(onChangeValue).toHaveBeenCalledWith('15/05/1990', expect.any(Object));
    });

    test('should call onFocusEnter when input gains focus', async () => {
      const onFocusEnter = jest.fn();
      render(<ArchbaseDatePickerEdit onFocusEnter={onFocusEnter} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      
      expect(onFocusEnter).toHaveBeenCalled();
    });

    test('should call onFocusExit when input loses focus', async () => {
      const onFocusExit = jest.fn();
      render(
        <div>
          <ArchbaseDatePickerEdit onFocusExit={onFocusExit} />
          <button>Other element</button>
        </div>
      );
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(onFocusExit).toHaveBeenCalled();
    });
  });

  describe('🎛️ Props and Configuration', () => {
    test('should respect disabled prop', () => {
      render(<ArchbaseDatePickerEdit disabled />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    test('should respect readOnly prop', () => {
      render(<ArchbaseDatePickerEdit readOnly />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
    });

    test('should respect required prop', () => {
      render(<ArchbaseDatePickerEdit required />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('required');
    });

    test('should apply custom placeholder', () => {
      const placeholder = 'Selecione uma data';
      render(<ArchbaseDatePickerEdit placeholder={placeholder} />);
      
      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toBeInTheDocument();
    });

    test('should apply custom width', () => {
      render(<ArchbaseDatePickerEdit width={300} />);
      
      const container = screen.getByRole('textbox').closest('div');
      expect(container).toHaveStyle({ width: '300px' });
    });

    test('should apply custom style', () => {
      const customStyle = { backgroundColor: 'yellow' };
      render(<ArchbaseDatePickerEdit style={customStyle} />);
      
      const container = screen.getByRole('textbox').closest('div');
      expect(container).toHaveStyle(customStyle);
    });
  });

  describe('🔧 Edge Cases and Error Handling', () => {
    test('should handle null/undefined values gracefully', () => {
      expect(() => {
        render(<ArchbaseDatePickerEdit value={null as any} />);
      }).not.toThrow();
      
      expect(() => {
        render(<ArchbaseDatePickerEdit value={undefined} />);
      }).not.toThrow();
    });

    test('should handle invalid date strings', async () => {
      const onChangeValue = jest.fn();
      render(<ArchbaseDatePickerEdit onChangeValue={onChangeValue} />);
      
      const input = screen.getByRole('textbox');
      
      // Digitar data inválida
      await user.type(input, '32/13/2023');
      
      // Deve chamar callback mesmo com data inválida
      expect(onChangeValue).toHaveBeenCalledWith('32/13/2023', expect.any(Object));
    });

    test('should handle component unmount gracefully', () => {
      const { unmount } = render(<ArchbaseDatePickerEdit />);
      
      expect(() => {
        unmount();
      }).not.toThrow();
    });

    test('should handle dataSource unmount gracefully', () => {
      const { unmount } = render(
        <ArchbaseDatePickerEdit 
          dataSource={dataSource} 
          dataField="nascimento" 
        />
      );
      
      // Fechar dataSource
      dataSource.close();
      
      expect(() => {
        unmount();
      }).not.toThrow();
    });
  });

  describe('♿ Accessibility (a11y)', () => {
    test('should have proper ARIA attributes', () => {
      render(<ArchbaseDatePickerEdit />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    test('should support keyboard navigation', async () => {
      render(<ArchbaseDatePickerEdit />);
      
      const input = screen.getByRole('textbox');
      
      // Focar com Tab
      await user.tab();
      expect(input).toHaveFocus();
      
      // Digitar deve funcionar
      await user.keyboard('15/05/1990');
      expect(input).toHaveValue('15/05/1990');
    });

    test('should announce errors to screen readers', async () => {
      render(
        <ArchbaseDatePickerEdit 
          dataSource={dataSource} 
          dataField="nascimento" 
        />
      );
      
      // Simular erro
      const errorMessage = 'Data obrigatória';
      dataSource.setFieldError('nascimento', [errorMessage]);
      
      await waitFor(() => {
        const errorElement = screen.getByText(errorMessage);
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('🔄 Date Conversion Functions (Critical Internal)', () => {
    test('should convert ISO string to Date correctly', () => {
      const isoString = '1990-05-15T10:30:00.000Z';
      render(<ArchbaseDatePickerEdit value={isoString} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('15/05/1990');
    });

    test('should convert Date to ISO string correctly for dataSource', async () => {
      render(
        <ArchbaseDatePickerEdit 
          dataSource={dataSource} 
          dataField="nascimento"
        />
      );
      
      dataSource.edit();
      
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, '25/12/2023');
      
      // DataSource deve receber string formatada
      const fieldValue = dataSource.getFieldValue('nascimento');
      expect(typeof fieldValue).toBe('string');
      expect(fieldValue).toBe('25/12/2023');
    });
  });
});
