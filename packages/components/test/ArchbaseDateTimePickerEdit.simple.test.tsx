/**
 * ArchbaseDateTimePickerEdit — comportamento básico.
 *
 * Diferente do ArchbaseDatePickerEdit, este envolve o DateTimePicker do @mantine/dates, que
 * renderiza um BOTÃO (abre um dialog com calendário + hora), não um campo de texto digitável.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArchbaseDateTimePickerEdit } from '../src/editors/ArchbaseDateTimePickerEdit';
import React from 'react';
import { MantineProvider } from '@mantine/core';

// Sem o MantineProvider os componentes lançam ao montar ("MantineProvider was not found").
const wrapper = ({ children }: { children: React.ReactNode }) => <MantineProvider>{children}</MantineProvider>;

const gatilho = () => screen.getByRole('button', { expanded: false });

describe('ArchbaseDateTimePickerEdit V1/V2 Migration Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('🔍 Basic Rendering', () => {
    test('should render with default props', () => {
      render(<ArchbaseDateTimePickerEdit />, { wrapper });

      expect(gatilho()).toHaveAttribute('aria-haspopup', 'dialog');
    });

    test('should accept Date value', () => {
      render(<ArchbaseDateTimePickerEdit value={new Date(1990, 4, 15, 10, 30)} />, { wrapper });

      expect(gatilho()).toHaveTextContent('15/05/1990 10:30');
    });

    test('abre o dropdown ao clicar', async () => {
      render(<ArchbaseDateTimePickerEdit value={new Date(1990, 4, 15, 10, 30)} />, { wrapper });

      await user.click(gatilho());

      await waitFor(() => expect(screen.getByRole('button', { expanded: true })).toBeInTheDocument());
    });

    test('should respect disabled prop', () => {
      render(<ArchbaseDateTimePickerEdit disabled />, { wrapper });

      expect(gatilho()).toBeDisabled();
    });

    // Obs.: em readOnly o DateTimePicker do Mantine ainda abre o dropdown ao clicar (igual na 9.7.2);
    // o que o readOnly garante é que o valor não muda.
    test('should respect readOnly prop', () => {
      render(<ArchbaseDateTimePickerEdit readOnly value={new Date(1990, 4, 15, 10, 30)} />, { wrapper });

      expect(gatilho()).toHaveAttribute('data-read-only', 'true');
    });
  });
});
