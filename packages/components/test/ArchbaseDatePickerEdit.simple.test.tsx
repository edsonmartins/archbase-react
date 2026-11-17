/**
 * ArchbaseDatePickerEdit — comportamento básico.
 *
 * O componente é um input com máscara (react-imask) + Calendar do @mantine/dates num Popover. A
 * 9.8 do Mantine mexeu em teclado e foco dos pickers de datas; estes testes fixam o que o usuário
 * vê: digitar com máscara, escolher no calendário e o foco voltar ao campo.
 */

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ArchbaseDatePickerEdit } from '../src/editors/ArchbaseDatePickerEdit';
import React from 'react';
import { MantineProvider } from '@mantine/core';

// Sem o MantineProvider os componentes lançam ao montar ("MantineProvider was not found").
const wrapper = ({ children }: { children: React.ReactNode }) => <MantineProvider>{children}</MantineProvider>;

/** Botões de dia do calendário aberto (vazio quando o dropdown está fechado). */
const diasDoCalendario = () => Array.from(document.querySelectorAll<HTMLButtonElement>('table button'));

describe('ArchbaseDatePickerEdit Simple Tests', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('🔍 Basic Rendering', () => {
    test('should render with default props', () => {
      render(<ArchbaseDatePickerEdit />, { wrapper });

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    test('should accept string value', () => {
      render(<ArchbaseDatePickerEdit value="15/05/1990" />, { wrapper });

      expect(screen.getByRole('textbox')).toHaveValue('15/05/1990');
    });

    test('should accept Date value', () => {
      // Construtor local: `new Date('1990-05-15')` é meia-noite UTC, que no fuso de Brasília cai no dia 14.
      render(<ArchbaseDatePickerEdit value={new Date(1990, 4, 15)} />, { wrapper });

      expect(screen.getByRole('textbox')).toHaveValue('15/05/1990');
    });

    test('should call onChangeValue when value changes', async () => {
      const onChangeValue = vi.fn();
      render(<ArchbaseDatePickerEdit onChangeValue={onChangeValue} />, { wrapper });

      const input = screen.getByRole('textbox');
      // O foco abre o calendário de forma assíncrona e isso reposiciona o cursor do react-imask. Se
      // a digitação começa antes, os dígitos caem fora de ordem (ex.: `05/19/90__`) — depende de
      // timing, não da versão do Mantine. Por isso: foca, espera o calendário, então digita.
      await user.click(input);
      await waitFor(() => expect(diasDoCalendario().length).toBeGreaterThan(0));
      await user.type(input, '15051990', { skipClick: true, initialSelectionStart: 0, initialSelectionEnd: 0 });

      expect(input).toHaveValue('15/05/1990');
      expect(onChangeValue).toHaveBeenLastCalledWith('15/05/1990', expect.any(Object));
    });

    test('should call onFocusEnter when input gains focus', async () => {
      const onFocusEnter = vi.fn();
      render(<ArchbaseDatePickerEdit onFocusEnter={onFocusEnter} />, { wrapper });

      await user.click(screen.getByRole('textbox'));

      expect(onFocusEnter).toHaveBeenCalled();
    });

    test('should respect disabled prop', () => {
      render(<ArchbaseDatePickerEdit disabled />, { wrapper });

      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    test('should respect readOnly prop', () => {
      render(<ArchbaseDatePickerEdit readOnly />, { wrapper });

      expect(screen.getByRole('textbox')).toHaveAttribute('readonly');
    });
  });

  describe('📅 Calendário', () => {
    test('escolher um dia preenche o campo, fecha o calendário e devolve o foco ao input', async () => {
      const onChangeValue = vi.fn();
      // Sem `value`: controlado, o campo voltaria ao valor da prop e esconderia a escolha.
      render(<ArchbaseDatePickerEdit onChangeValue={onChangeValue} />, { wrapper });

      const input = screen.getByRole('textbox');
      await user.click(input);
      await waitFor(() => expect(diasDoCalendario().length).toBeGreaterThan(0));

      const dia20 = diasDoCalendario().find((b) => b.textContent === '20' && !b.hasAttribute('data-outside'))!;
      await user.click(dia20);

      await waitFor(() => expect(diasDoCalendario()).toHaveLength(0));
      expect(onChangeValue).toHaveBeenLastCalledWith(expect.stringMatching(/^20\/\d{2}\/\d{4}$/), expect.anything());
      expect(input).toHaveValue(onChangeValue.mock.lastCall![0]);
      expect(document.activeElement).toBe(input);
    });
  });
});
