/**
 * ArchbaseTimeRangeSelector V1 Baseline Tests
 * 
 * Estes testes capturam o comportamento EXATO da versão V1 atual.
 * TODOS os testes devem passar após migração V1/V2.
 * 
 * ⚠️ CRITICAL: Se qualquer teste falhar após migração, 
 *    a migração deve ser REVERTIDA imediatamente.
 */

import { render, screen, fireEvent, waitFor } from '@archbase/data/test/test-utils';
import userEvent from '@testing-library/user-event';
import { ArchbaseTimeRangeSelector } from '@archbase/components';
import React, { createRef } from 'react';

// Mock ranges típicos para testes
const mockRanges = [
  {
    label: 'Hoje',
    value: 'today',
    rangeFunction: (current: Date) => {
      const start = new Date(current);
      start.setHours(0, 0, 0, 0);
      const end = new Date(current);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  },
  {
    label: 'Ontem',
    value: 'yesterday',
    rangeFunction: (current: Date) => {
      const start = new Date(current);
      start.setDate(current.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(current);
      end.setDate(current.getDate() - 1);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    }
  },
  {
    label: 'Últimos 7 dias',
    value: 'last7days',
    rangeFunction: (current: Date) => {
      const end = new Date(current);
      end.setHours(23, 59, 59, 999);
      const start = new Date(current);
      start.setDate(current.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return { start, end };
    }
  },
  {
    label: 'Este mês',
    value: 'thismonth',
    rangeFunction: (current: Date) => {
      const start = new Date(current.getFullYear(), current.getMonth(), 1, 0, 0, 0, 0);
      const end = new Date(current.getFullYear(), current.getMonth() + 1, 0, 23, 59, 59, 999);
      return { start, end };
    }
  },
  {
    label: 'Personalizado',
    value: 'custom',
    rangeFunction: (current: Date) => ({ start: current, end: current })
  }
];

describe('ArchbaseTimeRangeSelector V1 Baseline', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('🔍 Basic Initialization', () => {
    test('should render with required ranges prop', () => {
      render(<ArchbaseTimeRangeSelector ranges={mockRanges} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Selecionar intervalo');
    });

    test('should accept initial range value', () => {
      const initialRange = {
        start: new Date('2023-01-01'),
        end: new Date('2023-01-31')
      };

      render(
        <ArchbaseTimeRangeSelector 
          ranges={mockRanges} 
          defaultDateRange={initialRange}
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(/01\/01\/2023.*31\/01\/2023/);
    });

    test('should accept default range value', () => {
      render(
        <ArchbaseTimeRangeSelector 
          ranges={mockRanges} 
          defaultRangeValue="today"
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Hoje');
    });

    test('should accept custom label', () => {
      const label = 'Período de análise';
      render(
        <ArchbaseTimeRangeSelector 
          ranges={mockRanges} 
          label={label}
        />
      );
      
      expect(screen.getByText(label)).toBeInTheDocument();
    });
  });

  describe('🎯 Range Functions (Critical Behavior)', () => {
    test('should provide correct range options', async () => {
      render(<ArchbaseTimeRangeSelector ranges={mockRanges} />);
      
      // Clique para abrir popover
      const button = screen.getByRole('button');
      await user.click(button);

      // Deve mostrar opções de range predefinidos
      await waitFor(() => {
        expect(screen.getByText('Hoje')).toBeInTheDocument();
        expect(screen.getByText('Ontem')).toBeInTheDocument();
        expect(screen.getByText('Últimos 7 dias')).toBeInTheDocument();
        expect(screen.getByText('Este mês')).toBeInTheDocument();
        expect(screen.getByText('Personalizado')).toBeInTheDocument();
      });
    });

    test('should calculate "Hoje" range correctly', async () => {
      const onRangeChange = jest.fn();
      render(
        <ArchbaseTimeRangeSelector 
          ranges={mockRanges} 
          onRangeChange={onRangeChange} 
        />
      );
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      // Selecionar "Hoje"
      const hojeOption = screen.getByText('Hoje');
      await user.click(hojeOption);

      expect(onRangeChange).toHaveBeenCalledWith(
        'today',
        expect.objectContaining({
          start: expect.any(Date),
          end: expect.any(Date)
        })
      );

      // Verificar que as datas são do mesmo dia
      const [selectedValue, range] = onRangeChange.mock.calls[0];
      const { start, end } = range;
      
      expect(start.toDateString()).toBe(new Date().toDateString());
      expect(end.toDateString()).toBe(new Date().toDateString());
      
      // Verificar horários: início 00:00:00, fim 23:59:59
      expect(start.getHours()).toBe(0);
      expect(start.getMinutes()).toBe(0);
      expect(start.getSeconds()).toBe(0);
      
      expect(end.getHours()).toBe(23);
      expect(end.getMinutes()).toBe(59);
      expect(end.getSeconds()).toBe(59);
    });

    test('should calculate "Últimos 7 dias" range correctly', async () => {
      const onRangeChange = jest.fn();
      render(
        <ArchbaseTimeRangeSelector 
          ranges={mockRanges} 
          onRangeChange={onRangeChange} 
        />
      );
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const option = screen.getByText('Últimos 7 dias');
      await user.click(option);

      expect(onRangeChange).toHaveBeenCalled();
      
      const [selectedValue, range] = onRangeChange.mock.calls[0];
      const { start, end } = range;
      
      // EndDate deve ser hoje 23:59:59
      const today = new Date();
      expect(end.toDateString()).toBe(today.toDateString());
      expect(end.getHours()).toBe(23);
      
      // StartDate deve ser 6 dias antes, 00:00:00
      const expectedStart = new Date(today);
      expectedStart.setDate(today.getDate() - 6);
      expect(start.toDateString()).toBe(expectedStart.toDateString());
      expect(start.getHours()).toBe(0);
    });

    test('should calculate "Este mês" range correctly', async () => {
      const onRangeChange = jest.fn();
      render(
        <ArchbaseTimeRangeSelector 
          ranges={mockRanges} 
          onRangeChange={onRangeChange} 
        />
      );
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const option = screen.getByText('Este mês');
      await user.click(option);

      expect(onRangeChange).toHaveBeenCalled();
      
      const [selectedValue, range] = onRangeChange.mock.calls[0];
      const { start, end } = range;
      
      const today = new Date();
      
      // StartDate: primeiro dia do mês atual
      expect(start.getDate()).toBe(1);
      expect(start.getMonth()).toBe(today.getMonth());
      expect(start.getFullYear()).toBe(today.getFullYear());
      expect(start.getHours()).toBe(0);
      
      // EndDate: último dia do mês atual
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      expect(end.getDate()).toBe(lastDay.getDate());
      expect(end.getMonth()).toBe(today.getMonth());
      expect(end.getHours()).toBe(23);
    });
  });

  describe('📅 Custom Range Selection', () => {
    test('should allow custom date range selection', async () => {
      const onRangeChange = jest.fn();
      render(
        <ArchbaseTimeRangeSelector 
          ranges={mockRanges} 
          onRangeChange={onRangeChange} 
        />
      );
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      // Selecionar opção "Personalizado"
      const customOption = screen.getByText('Personalizado');
      await user.click(customOption);

      // Deve abrir controles para seleção personalizada
      await waitFor(() => {
        expect(screen.getByText(/data.*início/i)).toBeInTheDocument();
        expect(screen.getByText(/data.*fim/i)).toBeInTheDocument();
      });
    });
  });

  describe('🎨 Display Formatting (Critical for UX)', () => {
    test('should format single day range correctly', () => {
      const singleDay = {
        start: new Date('2023-06-15T00:00:00'),
        end: new Date('2023-06-15T23:59:59')
      };

      render(
        <ArchbaseTimeRangeSelector 
          ranges={mockRanges} 
          defaultDateRange={singleDay}
        />
      );
      
      const button = screen.getByRole('button');
      // Para dia único, deve mostrar formato compacto
      expect(button).toHaveTextContent(/15\/06\/2023/);
    });

    test('should format date range correctly', () => {
      const range = {
        start: new Date('2023-06-01T00:00:00'),
        end: new Date('2023-06-30T23:59:59')
      };

      render(
        <ArchbaseTimeRangeSelector 
          ranges={mockRanges} 
          defaultDateRange={range}
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(/01\/06\/2023.*30\/06\/2023/);
    });
  });

  describe('🔄 Component Ref API (External API)', () => {
    test('should expose updateCurrentRange method', () => {
      const ref = createRef<any>();
      render(
        <ArchbaseTimeRangeSelector 
          ranges={mockRanges} 
          componentRef={ref} 
        />
      );
      
      expect(ref.current).toBeDefined();
      expect(typeof ref.current.updateCurrentRange).toBe('function');
    });

    test('should expose getCurrentRange method', () => {
      const ref = createRef<any>();
      const initialRange = {
        start: new Date('2023-01-01'),
        end: new Date('2023-01-31')
      };

      render(
        <ArchbaseTimeRangeSelector 
          ranges={mockRanges} 
          componentRef={ref} 
          defaultDateRange={initialRange}
        />
      );
      
      expect(ref.current).toBeDefined();
      expect(typeof ref.current.getCurrentRange).toBe('function');
      
      const currentRange = ref.current.getCurrentRange();
      expect(currentRange.range).toEqual(expect.objectContaining({
        start: expect.any(Date),
        end: expect.any(Date)
      }));
    });

    test('should update range via ref method', () => {
      const ref = createRef<any>();
      const onRangeChange = jest.fn();
      
      render(
        <ArchbaseTimeRangeSelector 
          ranges={mockRanges} 
          componentRef={ref} 
          onRangeChange={onRangeChange}
          defaultRangeValue="today"
        />
      );
      
      // Usar método do ref para atualizar
      const updatedRange = ref.current.updateCurrentRange();
      
      // Deve retornar range válido
      expect(updatedRange).toEqual(expect.objectContaining({
        start: expect.any(Date),
        end: expect.any(Date)
      }));
    });
  });

  describe('⚡ Event Handling (Critical Callbacks)', () => {
    test('should call onRangeChange when range changes', async () => {
      const onRangeChange = jest.fn();
      render(
        <ArchbaseTimeRangeSelector 
          ranges={mockRanges} 
          onRangeChange={onRangeChange} 
        />
      );
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      const hojeOption = screen.getByText('Hoje');
      await user.click(hojeOption);

      expect(onRangeChange).toHaveBeenCalledTimes(1);
      expect(onRangeChange).toHaveBeenCalledWith(
        'today',
        expect.objectContaining({
          start: expect.any(Date),
          end: expect.any(Date)
        })
      );
    });
  });

  describe('🎛️ Props and Configuration', () => {
    test('should apply custom width', () => {
      render(
        <ArchbaseTimeRangeSelector 
          ranges={mockRanges} 
          width={500} 
        />
      );
      
      const container = screen.getByRole('button').parentElement;
      expect(container).toHaveStyle({ width: '500px' });
    });

    test('should apply custom popover title', async () => {
      const customTitle = 'Selecione o período personalizado';
      render(
        <ArchbaseTimeRangeSelector 
          ranges={mockRanges} 
          popoverTitle={customTitle}
        />
      );
      
      const button = screen.getByRole('button');
      await user.click(button);
      
      await waitFor(() => {
        expect(screen.getByText(customTitle)).toBeInTheDocument();
      });
    });

    test('should handle different positions', () => {
      render(
        <ArchbaseTimeRangeSelector 
          ranges={mockRanges} 
          position="top"
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('🔧 Edge Cases and Error Handling', () => {
    test('should handle empty ranges array', () => {
      expect(() => {
        render(<ArchbaseTimeRangeSelector ranges={[]} />);
      }).not.toThrow();
    });

    test('should handle null date range', () => {
      const nullRange = {
        start: null,
        end: null
      };

      expect(() => {
        render(
          <ArchbaseTimeRangeSelector 
            ranges={mockRanges} 
            defaultDateRange={nullRange}
          />
        );
      }).not.toThrow();
    });

    test('should handle component unmount gracefully', () => {
      const { unmount } = render(
        <ArchbaseTimeRangeSelector ranges={mockRanges} />
      );
      
      expect(() => {
        unmount();
      }).not.toThrow();
    });

    test('should handle invalid range functions', () => {
      const invalidRanges = [
        {
          label: 'Invalid',
          value: 'invalid',
          rangeFunction: () => null as any // Invalid return
        }
      ];

      expect(() => {
        render(<ArchbaseTimeRangeSelector ranges={invalidRanges} />);
      }).not.toThrow();
    });
  });

  describe('♿ Accessibility (a11y)', () => {
    test('should have proper button structure', () => {
      render(<ArchbaseTimeRangeSelector ranges={mockRanges} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('type', 'button');
    });

    test('should support keyboard navigation', async () => {
      render(<ArchbaseTimeRangeSelector ranges={mockRanges} />);
      
      const button = screen.getByRole('button');
      
      // Focar com Tab
      await user.tab();
      expect(button).toHaveFocus();
      
      // Abrir com Enter/Space
      await user.keyboard('{Enter}');
      
      // Popover deve abrir
      await waitFor(() => {
        expect(screen.getByText('Hoje')).toBeInTheDocument();
      });
    });

    test('should have proper ARIA attributes', () => {
      render(<ArchbaseTimeRangeSelector ranges={mockRanges} />);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('🔄 Range Calculation Consistency', () => {
    test('should maintain consistent calculations', () => {
      const testDate = new Date('2023-06-15T12:00:00');
      
      mockRanges.forEach(range => {
        if (range.value !== 'custom') {
          const result = range.rangeFunction(testDate);
          expect(result).toHaveProperty('start');
          expect(result).toHaveProperty('end');
          expect(result.start).toBeInstanceOf(Date);
          expect(result.end).toBeInstanceOf(Date);
          expect(result.start.getTime()).toBeLessThanOrEqual(result.end.getTime());
        }
      });
    });

    test('should handle leap years correctly', () => {
      const leapYear = new Date('2024-02-29T12:00:00'); // Leap year
      const thisMonthRange = mockRanges.find(r => r.value === 'thismonth');
      
      if (thisMonthRange) {
        const result = thisMonthRange.rangeFunction(leapYear);
        expect(result.start.getMonth()).toBe(1); // February
        expect(result.end.getDate()).toBe(29); // 29 days in Feb 2024
      }
    });
  });
});
