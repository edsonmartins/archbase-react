import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { ArchbaseStickyTopBar } from '../src/feedback/ArchbaseStickyTopBar';

function Wrapper({ children }: { children: ReactNode }) {
  return <MantineProvider>{children}</MantineProvider>;
}

beforeEach(() => window.localStorage.clear());

describe('ArchbaseStickyTopBar', () => {
  it('anuncia a mensagem a leitores de tela', () => {
    render(
      <ArchbaseStickyTopBar aria-label="Aviso do sistema">Manutencao no domingo</ArchbaseStickyTopBar>,
      { wrapper: Wrapper },
    );

    // O original era um div mudo: sem papel, sem rotulo, sem anuncio.
    const barra = screen.getByRole('status', { name: 'Aviso do sistema' });
    expect(barra.getAttribute('aria-live')).toBe('polite');
    expect(screen.getByText('Manutencao no domingo')).toBeDefined();
  });

  it('usa anuncio assertivo quando e alerta', () => {
    render(<ArchbaseStickyTopBar role="alert">Falha critica</ArchbaseStickyTopBar>, {
      wrapper: Wrapper,
    });
    expect(screen.getByRole('alert').getAttribute('aria-live')).toBe('assertive');
  });

  it('fecha quando dispensavel', async () => {
    const user = userEvent.setup();
    const aoFechar = vi.fn();
    render(
      <ArchbaseStickyTopBar dismissible onDismiss={aoFechar}>Aviso</ArchbaseStickyTopBar>,
      { wrapper: Wrapper },
    );

    await user.click(screen.getByRole('button', { name: 'Fechar aviso' }));
    expect(aoFechar).toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByText('Aviso')).toBeNull());
  });

  it('nao volta a aparecer para quem ja fechou, quando ha chave', async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <ArchbaseStickyTopBar dismissible dismissStorageKey="aviso-manutencao">
        Aviso persistente
      </ArchbaseStickyTopBar>,
      { wrapper: Wrapper },
    );

    await user.click(screen.getByRole('button', { name: 'Fechar aviso' }));
    unmount();

    // Mensagem que reaparece a cada navegacao ensina o usuario a ignorar o
    // lugar todo.
    render(
      <ArchbaseStickyTopBar dismissible dismissStorageKey="aviso-manutencao">
        Aviso persistente
      </ArchbaseStickyTopBar>,
      { wrapper: Wrapper },
    );
    expect(screen.queryByText('Aviso persistente')).toBeNull();
  });

  it('sem chave, a dispensa vale so para a sessao', async () => {
    const user = userEvent.setup();
    const { unmount } = render(
      <ArchbaseStickyTopBar dismissible>Aviso volatil</ArchbaseStickyTopBar>,
      { wrapper: Wrapper },
    );

    await user.click(screen.getByRole('button', { name: 'Fechar aviso' }));
    unmount();

    render(<ArchbaseStickyTopBar dismissible>Aviso volatil</ArchbaseStickyTopBar>, {
      wrapper: Wrapper,
    });
    expect(screen.getByText('Aviso volatil')).toBeDefined();
  });

  it('nao oferece botao quando nao e dispensavel', () => {
    render(<ArchbaseStickyTopBar>Aviso fixo</ArchbaseStickyTopBar>, { wrapper: Wrapper });
    expect(screen.queryByRole('button', { name: 'Fechar aviso' })).toBeNull();
  });

  it('respeita visibilidade controlada', () => {
    render(<ArchbaseStickyTopBar visible={false}>Escondido</ArchbaseStickyTopBar>, {
      wrapper: Wrapper,
    });
    expect(screen.queryByText('Escondido')).toBeNull();
  });

  it('sobrevive a armazenamento bloqueado', () => {
    const original = window.localStorage.getItem;
    window.localStorage.getItem = () => {
      throw new Error('bloqueado');
    };

    // Modo privado nao pode derrubar a barra.
    expect(() =>
      render(
        <ArchbaseStickyTopBar dismissStorageKey="x">Aviso</ArchbaseStickyTopBar>,
        { wrapper: Wrapper },
      ),
    ).not.toThrow();

    window.localStorage.getItem = original;
  });
});
