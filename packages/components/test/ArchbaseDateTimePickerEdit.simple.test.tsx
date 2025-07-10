/**
 * Simple ArchbaseDateTimePickerEdit Tests
 * 
 * Testes básicos para verificar se a migração V1/V2 funciona corretamente
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArchbaseDateTimePickerEdit } from '../src/editors/ArchbaseDateTimePickerEdit';
import React from 'react';

describe('ArchbaseDateTimePickerEdit V1/V2 Migration Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('🔍 Basic Rendering', () => {
    test('should render with default props', () => {
      render(<ArchbaseDateTimePickerEdit />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    test('should accept Date value', () => {
      const dateValue = new Date('1990-05-15T10:30:00');
      render(<ArchbaseDateTimePickerEdit value={dateValue} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    test('should call onChangeValue when value changes', async () => {
      const onChangeValue = jest.fn();
      render(<ArchbaseDateTimePickerEdit onChangeValue={onChangeValue} />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, '15/05/1990 10:30');
      
      expect(onChangeValue).toHaveBeenCalled();
    });

    test('should call onFocusEnter when input gains focus', async () => {
      const onFocusEnter = jest.fn();
      render(<ArchbaseDateTimePickerEdit onFocusEnter={onFocusEnter} />);
      
      const input = screen.getByRole('textbox');
      await user.click(input);
      
      expect(onFocusEnter).toHaveBeenCalled();
    });

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
  });
});