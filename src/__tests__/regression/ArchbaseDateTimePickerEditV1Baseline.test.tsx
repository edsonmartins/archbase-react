/**
 * ArchbaseDateTimePickerEdit V1 Baseline Tests
 * 
 * Estes testes capturam o comportamento EXATO da versão V1 atual.
 * TODOS os testes devem passar após migração V1/V2.
 * 
 * ⚠️ CRITICAL: Se qualquer teste falhar após migração, 
 *    a migração deve ser REVERTIDA imediatamente.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArchbaseDateTimePickerEdit } from '../../components/editors/ArchbaseDateTimePickerEdit';
import { ArchbaseDataSource } from '../../components/datasource/ArchbaseDataSource';
import React from 'react';

// Mock data para testes
interface TestData {
  id: number;
  nome: string;
  nascimento: Date;
  ultimoLogin: string; // ISO string
  criadoEm: Date;
}

const mockData: TestData[] = [
  { 
    id: 1, 
    nome: 'João Silva', 
    nascimento: new Date('1990-05-15T14:30:00'), 
    ultimoLogin: '2023-12-01T10:15:30.000Z',
    criadoEm: new Date('2023-01-01T09:00:00')
  },
  { 
    id: 2, 
    nome: 'Maria Santos', 
    nascimento: new Date('1985-12-20T16:45:00'), 
    ultimoLogin: '2023-12-02T14:22:15.000Z',
    criadoEm: new Date('2023-02-15T11:30:00')
  },
  { 
    id: 3, 
    nome: 'Pedro Costa', 
    nascimento: new Date('1992-08-10T08:20:00'), 
    ultimoLogin: '2023-12-03T16:45:00.000Z',
    criadoEm: new Date('2023-03-01T15:15:00')
  },
];

describe('ArchbaseDateTimePickerEdit V1 Baseline', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let dataSource: ArchbaseDataSource<TestData, number>;

  beforeEach(() => {
    user = userEvent.setup();
    dataSource = new ArchbaseDataSource('testDataSource', {
      records: mockData,
      grandTotalRecords: mockData.length,
      currentPage: 0,
      totalPages: 1,
      pageSize: 10,
    });
    dataSource.open();
    dataSource.first();
  });

  afterEach(() => {
    dataSource.close();
  });

  describe('🔍 Basic Initialization', () => {
    test('should render with default props', () => {
      render(<ArchbaseDateTimePickerEdit />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'datetime-local');
    });

    test('should accept initial value as Date object', () => {
      const dateValue = new Date('2023-06-15T14:30:00');
      render(<ArchbaseDateTimePickerEdit value={dateValue} />);
      
      const input = screen.getByRole('textbox');
      // Datetime-local input espera formato YYYY-MM-DDTHH:mm
      expect(input).toHaveValue('2023-06-15T14:30');
    });

    test('should accept initial value as ISO string', () => {
      const isoValue = '2023-06-15T14:30:00.000Z';
      render(<ArchbaseDateTimePickerEdit value={isoValue} />);
      
      const input = screen.getByRole('textbox');
      // Deve converter ISO para datetime-local format (considerando timezone)
      expect(input.value).toMatch(/2023-06-15T\d{2}:\d{2}/);
    });

    test('should handle null/undefined values', () => {
      render(<ArchbaseDateTimePickerEdit value={null} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('');
    });
  });

  describe('🔗 DataSource Integration (CRITICAL)', () => {
    test('should bind to dataSource Date field correctly', () => {
      render(
        <ArchbaseDateTimePickerEdit 
          dataSource={dataSource} 
          dataField="nascimento" 
        />
      );
      
      const input = screen.getByRole('textbox');
      // Deve mostrar data/hora do primeiro registro
      expect(input).toHaveValue('1990-05-15T14:30');
    });

    test('should bind to dataSource ISO string field correctly', () => {
      render(
        <ArchbaseDateTimePickerEdit 
          dataSource={dataSource} 
          dataField="ultimoLogin" 
        />
      );
      
      const input = screen.getByRole('textbox');
      // Deve converter ISO string para datetime-local format
      expect(input.value).toMatch(/2023-12-01T\d{2}:\d{2}/);
    });

    test('should update when dataSource record changes', async () => {
      render(
        <ArchbaseDateTimePickerEdit 
          dataSource={dataSource} 
          dataField="nascimento" 
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('1990-05-15T14:30');
      
      // Mover para próximo registro
      dataSource.next();
      
      await waitFor(() => {
        expect(input).toHaveValue('1985-12-20T16:45');
      });
    });

    test('should update dataSource when value changes', async () => {
      const onChangeValue = jest.fn();
      render(
        <ArchbaseDateTimePickerEdit 
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
      await user.type(input, '2000-01-01T12:00');
      
      // Verificar se DataSource foi atualizado
      const fieldValue = dataSource.getFieldValue('nascimento');
      expect(fieldValue).toBeInstanceOf(Date);
      expect(fieldValue.toISOString()).toContain('2000-01-01T12:00');
      
      expect(onChangeValue).toHaveBeenCalledWith(
        expect.any(Date),
        expect.any(Object)
      );
    });

    test('should be readOnly when dataSource is browsing', () => {
      render(
        <ArchbaseDateTimePickerEdit 
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
        <ArchbaseDateTimePickerEdit 
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
        <ArchbaseDateTimePickerEdit 
          dataSource={dataSource} 
          dataField="nascimento" 
        />
      );
      
      // Simular erro no DataSource
      const errorMessage = 'Data/hora inválida';
      dataSource.setFieldError('nascimento', [errorMessage]);
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe('⏰ DateTime Conversion (CRITICAL)', () => {
    test('should convert string input to Date object for dataSource', async () => {
      render(
        <ArchbaseDateTimePickerEdit 
          dataSource={dataSource} 
          dataField="nascimento"
        />
      );
      
      dataSource.edit();
      
      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, '2023-12-25T18:30');
      
      // DataSource deve receber Date object
      const fieldValue = dataSource.getFieldValue('nascimento');
      expect(fieldValue).toBeInstanceOf(Date);
      expect(fieldValue.getFullYear()).toBe(2023);
      expect(fieldValue.getMonth()).toBe(11); // December = 11
      expect(fieldValue.getDate()).toBe(25);
      expect(fieldValue.getHours()).toBe(18);
      expect(fieldValue.getMinutes()).toBe(30);
    });

    test('should handle timezone conversion correctly', () => {
      const utcDate = new Date('2023-06-15T14:30:00.000Z');
      render(<ArchbaseDateTimePickerEdit value={utcDate} />);
      
      const input = screen.getByRole('textbox');
      // Deve converter para timezone local
      expect(input.value).toMatch(/2023-06-15T\d{2}:\d{2}/);
    });

    test('should preserve seconds when converting to ISO', async () => {
      const onChangeValue = jest.fn();
      render(<ArchbaseDateTimePickerEdit onChangeValue={onChangeValue} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, '2023-06-15T14:30');
      
      expect(onChangeValue).toHaveBeenCalledWith(
        expect.objectContaining({
          toISOString: expect.any(Function)
        }),
        expect.any(Object)
      );
      
      // Data deve ter segundos zerados (comportamento padrão datetime-local)
      const [call] = onChangeValue.mock.calls;
      const dateValue = call[0];
      expect(dateValue.getSeconds()).toBe(0);
    });

    test('should handle invalid datetime strings gracefully', async () => {
      const onChangeValue = jest.fn();
      render(<ArchbaseDateTimePickerEdit onChangeValue={onChangeValue} />);
      
      const input = screen.getByRole('textbox');
      
      // Tentar digitar data inválida
      await user.clear(input);
      await user.type(input, '2023-13-35T25:70'); // Invalid date/time
      
      // Deve chamar callback mesmo com valor inválido
      expect(onChangeValue).toHaveBeenCalled();
    });
  });

  describe('⏰ Time Precision Handling', () => {
    test('should handle seconds precision when showSeconds is enabled', () => {
      const dateWithSeconds = new Date('2023-06-15T14:30:45');
      render(
        <ArchbaseDateTimePickerEdit 
          value={dateWithSeconds} 
          showSeconds
        />
      );
      
      const input = screen.getByRole('textbox');
      // Com segundos habilitados, deve mostrar formato completo
      expect(input).toHaveValue('2023-06-15T14:30:45');
      expect(input).toHaveAttribute('step', '1');
    });

    test('should default to minute precision when showSeconds is disabled', () => {
      const dateWithSeconds = new Date('2023-06-15T14:30:45');
      render(
        <ArchbaseDateTimePickerEdit 
          value={dateWithSeconds} 
          showSeconds={false}
        />
      );
      
      const input = screen.getByRole('textbox');
      // Sem segundos, deve truncar
      expect(input).toHaveValue('2023-06-15T14:30');
    });
  });

  describe('⚡ Event Handling (Critical Callbacks)', () => {
    test('should call onChangeValue when value changes', async () => {
      const onChangeValue = jest.fn();
      render(<ArchbaseDateTimePickerEdit onChangeValue={onChangeValue} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, '2023-06-15T14:30');
      
      expect(onChangeValue).toHaveBeenCalledWith(
        expect.any(Date),
        expect.any(Object)
      );
    });

    test('should call onFocusEnter when input gains focus', async () => {
      const onFocusEnter = jest.fn();
      render(<ArchbaseDateTimePickerEdit onFocusEnter={onFocusEnter} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      
      expect(onFocusEnter).toHaveBeenCalled();
    });

    test('should call onFocusExit when input loses focus', async () => {
      const onFocusExit = jest.fn();
      render(
        <div>
          <ArchbaseDateTimePickerEdit onFocusExit={onFocusExit} />
          <button>Other element</button>
        </div>
      );
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      expect(onFocusExit).toHaveBeenCalled();
    });

    test('should call callback with proper Date object', async () => {
      const onChangeValue = jest.fn();
      render(<ArchbaseDateTimePickerEdit onChangeValue={onChangeValue} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, '2023-06-15T14:30');
      
      const [call] = onChangeValue.mock.calls;
      const dateArg = call[0];
      
      expect(dateArg).toBeInstanceOf(Date);
      expect(dateArg.getFullYear()).toBe(2023);
      expect(dateArg.getMonth()).toBe(5); // June = 5
      expect(dateArg.getDate()).toBe(15);
      expect(dateArg.getHours()).toBe(14);
      expect(dateArg.getMinutes()).toBe(30);
    });
  });

  describe('🎛️ Props and Configuration', () => {
    test('should respect disabled prop', () => {
      render(<ArchbaseDateTimePickerEdit disabled />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });

    test('should respect readOnly prop', () => {
      render(<ArchbaseDateTimePickerEdit readOnly />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
    });

    test('should respect required prop', () => {
      render(<ArchbaseDateTimePickerEdit required />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('required');
    });

    test('should apply custom placeholder', () => {
      const placeholder = 'Selecione data e hora';
      render(<ArchbaseDateTimePickerEdit placeholder={placeholder} />);
      
      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toBeInTheDocument();
    });

    test('should apply custom width', () => {
      render(<ArchbaseDateTimePickerEdit width={300} />);
      
      const container = screen.getByRole('textbox').closest('div');
      expect(container).toHaveStyle({ width: '300px' });
    });

    test('should apply custom style', () => {
      const customStyle = { backgroundColor: 'lightgreen' };
      render(<ArchbaseDateTimePickerEdit style={customStyle} />);
      
      const container = screen.getByRole('textbox').closest('div');
      expect(container).toHaveStyle(customStyle);
    });

    test('should handle min and max constraints', () => {
      const minDate = new Date('2023-01-01T00:00:00');
      const maxDate = new Date('2023-12-31T23:59:59');
      
      render(
        <ArchbaseDateTimePickerEdit 
          minDate={minDate}
          maxDate={maxDate}
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('min', '2023-01-01T00:00');
      expect(input).toHaveAttribute('max', '2023-12-31T23:59');
    });
  });

  describe('🔧 Edge Cases and Error Handling', () => {
    test('should handle null/undefined values gracefully', () => {
      expect(() => {
        render(<ArchbaseDateTimePickerEdit value={null as any} />);
      }).not.toThrow();
      
      expect(() => {
        render(<ArchbaseDateTimePickerEdit value={undefined} />);
      }).not.toThrow();
    });

    test('should handle invalid Date objects', () => {
      const invalidDate = new Date('invalid');
      expect(() => {
        render(<ArchbaseDateTimePickerEdit value={invalidDate} />);
      }).not.toThrow();
    });

    test('should handle component unmount gracefully', () => {
      const { unmount } = render(<ArchbaseDateTimePickerEdit />);
      
      expect(() => {
        unmount();
      }).not.toThrow();
    });

    test('should handle dataSource unmount gracefully', () => {
      const { unmount } = render(
        <ArchbaseDateTimePickerEdit 
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

    test('should handle empty string input', async () => {
      const onChangeValue = jest.fn();
      render(<ArchbaseDateTimePickerEdit onChangeValue={onChangeValue} />);
      
      const input = screen.getByRole('textbox');
      await user.clear(input);
      
      // Clear deve gerar um valor null ou undefined
      expect(onChangeValue).toHaveBeenCalledWith(
        null,
        expect.any(Object)
      );
    });
  });

  describe('♿ Accessibility (a11y)', () => {
    test('should have proper input type', () => {
      render(<ArchbaseDateTimePickerEdit />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'datetime-local');
    });

    test('should support keyboard navigation', async () => {
      render(<ArchbaseDateTimePickerEdit />);
      
      const input = screen.getByRole('textbox');
      
      // Focar com Tab
      await user.tab();
      expect(input).toHaveFocus();
      
      // Digitar deve funcionar
      await user.keyboard('2023-06-15T14:30');
      expect(input).toHaveValue('2023-06-15T14:30');
    });

    test('should announce errors to screen readers', async () => {
      render(
        <ArchbaseDateTimePickerEdit 
          dataSource={dataSource} 
          dataField="nascimento" 
        />
      );
      
      // Simular erro
      const errorMessage = 'Data/hora obrigatória';
      dataSource.setFieldError('nascimento', [errorMessage]);
      
      await waitFor(() => {
        const errorElement = screen.getByText(errorMessage);
        expect(errorElement).toBeInTheDocument();
        expect(errorElement).toHaveAttribute('role', 'alert');
      });
    });

    test('should have proper labels and descriptions', () => {
      render(
        <ArchbaseDateTimePickerEdit 
          label="Data de Nascimento"
          description="Selecione sua data e hora de nascimento"
        />
      );
      
      expect(screen.getByText('Data de Nascimento')).toBeInTheDocument();
      expect(screen.getByText(/selecione sua data/i)).toBeInTheDocument();
    });
  });

  describe('🌍 Browser Compatibility', () => {
    test('should work with different datetime-local implementations', () => {
      // Teste que o componente funciona mesmo se o browser
      // tiver implementações ligeiramente diferentes de datetime-local
      render(<ArchbaseDateTimePickerEdit value={new Date('2023-06-15T14:30:00')} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input.value).toMatch(/2023-06-15T14:30/);
    });

    test('should handle timezone differences gracefully', () => {
      // Teste que funciona em diferentes timezones
      const utcDate = new Date('2023-06-15T14:30:00.000Z');
      render(<ArchbaseDateTimePickerEdit value={utcDate} />);
      
      const input = screen.getByRole('textbox');
      // Deve mostrar datetime em timezone local
      expect(input.value).toMatch(/2023-06-15T\d{2}:\d{2}/);
    });
  });

  describe('🔄 Value Synchronization (Critical)', () => {
    test('should maintain consistency between display and internal value', async () => {
      const onChangeValue = jest.fn();
      render(<ArchbaseDateTimePickerEdit onChangeValue={onChangeValue} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, '2023-06-15T14:30');
      
      // Display value
      expect(input).toHaveValue('2023-06-15T14:30');
      
      // Internal value (callback)
      const [call] = onChangeValue.mock.calls;
      const internalDate = call[0];
      
      expect(internalDate.getFullYear()).toBe(2023);
      expect(internalDate.getMonth()).toBe(5); // June
      expect(internalDate.getDate()).toBe(15);
      expect(internalDate.getHours()).toBe(14);
      expect(internalDate.getMinutes()).toBe(30);
    });

    test('should sync properly with dataSource field types', () => {
      // Teste com campo Date
      render(
        <ArchbaseDateTimePickerEdit 
          dataSource={dataSource} 
          dataField="nascimento" 
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('1990-05-15T14:30');
      
      // Mover para field de string ISO
      const { rerender } = render(
        <ArchbaseDateTimePickerEdit 
          dataSource={dataSource} 
          dataField="ultimoLogin" 
        />
      );
      
      expect(input.value).toMatch(/2023-12-01T\d{2}:\d{2}/);
    });
  });
});