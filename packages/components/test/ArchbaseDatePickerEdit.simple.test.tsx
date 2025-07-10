/**
 * Simple ArchbaseDatePickerEdit Tests
 * 
 * Testes básicos para verificar se a interface funciona corretamente
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArchbaseDatePickerEdit } from '../src/editors/ArchbaseDatePickerEdit';
import React from 'react';

describe('ArchbaseDatePickerEdit Simple Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('🔍 Basic Rendering', () => {
    test('should render with default props', () => {
      render(<ArchbaseDatePickerEdit />);
      
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
    });

    test('should accept string value', () => {
      const initialValue = '15/05/1990';
      render(<ArchbaseDatePickerEdit value={initialValue} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue(initialValue);
    });

    test('should accept Date value', () => {
      const dateValue = new Date('1990-05-15');
      render(<ArchbaseDatePickerEdit value={dateValue} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveValue('15/05/1990');
    });

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
  });
});