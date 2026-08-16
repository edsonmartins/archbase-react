import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { ArchbaseMagnifyDock } from '../src/navigation/ArchbaseMagnifyDock';
import { ArchbaseGlowingCard, ArchbaseGlowingCards } from '../src/display/ArchbaseGlowingCards';

function Wrapper({ children }: { children: ReactNode }) {
  return <MantineProvider>{children}</MantineProvider>;
}

const ITENS = [
  { id: 'inicio', icon: <span>🏠</span>, label: 'Inicio' },
  { id: 'busca', icon: <span>🔍</span>, label: 'Buscar', badge: 3 },
  { id: 'perfil', icon: <span>👤</span>, label: 'Perfil', disabled: true },
];

describe('ArchbaseMagnifyDock', () => {
  it('aciona pelo teclado', async () => {
    const user = userEvent.setup();
    const aoClicar = vi.fn();
    render(
      <ArchbaseMagnifyDock items={[{ ...ITENS[0]!, onClick: aoClicar }]} />,
      { wrapper: Wrapper },
    );

    const botao = screen.getByRole('button', { name: 'Inicio' });
    botao.focus();
    await user.keyboard('{Enter}');

    // O original era um div com role="button" e tabIndex=0, mas sem tratador
    // de teclado: recebia foco e nao fazia nada com Enter ou Espaco.
    expect(aoClicar).toHaveBeenCalledTimes(1);

    await user.keyboard(' ');
    expect(aoClicar).toHaveBeenCalledTimes(2);
  });

  it('da nome acessivel a item que so tem icone', () => {
    render(<ArchbaseMagnifyDock items={ITENS} />, { wrapper: Wrapper });

    // Sem isto o leitor de tela anuncia apenas "botao".
    expect(screen.getByRole('button', { name: 'Inicio' })).toBeDefined();
    expect(screen.getByRole('button', { name: 'Buscar' })).toBeDefined();
  });

  it('nao promete menu que nao existe', () => {
    render(<ArchbaseMagnifyDock items={ITENS} />, { wrapper: Wrapper });

    // O original marcava aria-haspopup="true" em todos os itens.
    for (const botao of screen.getAllByRole('button')) {
      expect(botao.getAttribute('aria-haspopup')).toBeNull();
    }
  });

  it('expoe a barra como toolbar', () => {
    render(<ArchbaseMagnifyDock items={ITENS} aria-label="Atalhos do sistema" />, {
      wrapper: Wrapper,
    });
    const barra = screen.getByRole('toolbar', { name: 'Atalhos do sistema' });

    expect(barra.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('respeita item desabilitado', async () => {
    const user = userEvent.setup();
    const aoClicar = vi.fn();
    render(
      <ArchbaseMagnifyDock items={[{ ...ITENS[2]!, onClick: aoClicar }]} />,
      { wrapper: Wrapper },
    );

    const botao = screen.getByRole('button', { name: 'Perfil' });
    expect(botao.hasAttribute('disabled')).toBe(true);

    await user.click(botao);
    expect(aoClicar).not.toHaveBeenCalled();
  });

  it('nao duplica a fala do contador', () => {
    render(<ArchbaseMagnifyDock items={ITENS} />, { wrapper: Wrapper });
    const busca = screen.getByRole('button', { name: 'Buscar' });

    // O numero e decorativo: quem quiser anuncia-lo poe no proprio rotulo.
    expect(busca.textContent).toContain('3');
    expect(busca.getAttribute('aria-label')).toBe('Buscar');
  });
});

describe('ArchbaseGlowingCards', () => {
  it('cartao sem acao fica fora da ordem de foco', () => {
    render(
      <ArchbaseGlowingCards>
        <ArchbaseGlowingCard>decorativo</ArchbaseGlowingCard>
      </ArchbaseGlowingCards>,
      { wrapper: Wrapper },
    );

    expect(screen.queryByRole('button')).toBeNull();
    expect(screen.getByText('decorativo')).toBeDefined();
  });

  it('cartao clicavel e alcancavel por teclado', async () => {
    const user = userEvent.setup();
    const aoClicar = vi.fn();
    render(
      <ArchbaseGlowingCards>
        <ArchbaseGlowingCard onClick={aoClicar}>Plano Pro</ArchbaseGlowingCard>
      </ArchbaseGlowingCards>,
      { wrapper: Wrapper },
    );

    const cartao = screen.getByRole('button', { name: /Plano Pro/ });
    expect(cartao.getAttribute('tabindex')).toBe('0');

    cartao.focus();
    await user.keyboard('{Enter}');
    expect(aoClicar).toHaveBeenCalledTimes(1);

    await user.keyboard(' ');
    expect(aoClicar).toHaveBeenCalledTimes(2);
  });

  it('funciona fora do grupo, apenas sem brilho', () => {
    // As custom properties nao existem; o cartao nao pode quebrar por isso.
    expect(() =>
      render(<ArchbaseGlowingCard>solto</ArchbaseGlowingCard>, { wrapper: Wrapper }),
    ).not.toThrow();
    expect(screen.getByText('solto')).toBeDefined();
  });

  it('mantem a camada de brilho fora da arvore de acessibilidade', () => {
    const { container } = render(
      <ArchbaseGlowingCards>
        <ArchbaseGlowingCard>conteudo</ArchbaseGlowingCard>
      </ArchbaseGlowingCards>,
      { wrapper: Wrapper },
    );

    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });

  it('aceita colunas fixas', () => {
    render(
      <ArchbaseGlowingCards columns={3}>
        <ArchbaseGlowingCard>conteudo do cartao</ArchbaseGlowingCard>
      </ArchbaseGlowingCards>,
      { wrapper: Wrapper },
    );

    // O grid e o ancestral do cartao. `container.firstElementChild` pegava o
    // <style> que o MantineProvider injeta antes dos filhos.
    const cartao = screen.getByText('conteudo do cartao').closest('[style*="grid"]');
    expect((cartao as HTMLElement).style.gridTemplateColumns).toContain('repeat(3');
  });
});
