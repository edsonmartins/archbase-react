import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MantineProvider } from '@mantine/core';
import { describe, expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { ArchbaseSlideToConfirm } from '../src/buttons/ArchbaseSlideToConfirm';
import { ArchbaseReorderList } from '../src/list/ArchbaseReorderList';

function Wrapper({ children }: { children: ReactNode }) {
  return <MantineProvider>{children}</MantineProvider>;
}

describe('ArchbaseSlideToConfirm', () => {
  it('confirma pelo teclado', async () => {
    const user = userEvent.setup();
    const confirmar = vi.fn();
    render(<ArchbaseSlideToConfirm onConfirm={confirmar} />, { wrapper: Wrapper });

    const slider = screen.getByRole('slider');
    slider.focus();
    await user.keyboard('{Enter}');

    // O original era um div arrastavel: nao havia como confirmar sem ponteiro,
    // num controle cuja unica funcao e confirmar.
    await waitFor(() => expect(confirmar).toHaveBeenCalledTimes(1));
  });

  it('confirma com End, o extremo do curso', async () => {
    const user = userEvent.setup();
    const confirmar = vi.fn();
    render(<ArchbaseSlideToConfirm onConfirm={confirmar} />, { wrapper: Wrapper });

    screen.getByRole('slider').focus();
    await user.keyboard('{End}');

    await waitFor(() => expect(confirmar).toHaveBeenCalled());
  });

  it('expoe semantica de slider a leitores de tela', () => {
    render(<ArchbaseSlideToConfirm onConfirm={vi.fn()} label="Excluir registro" />, {
      wrapper: Wrapper,
    });
    const slider = screen.getByRole('slider');

    expect(slider.getAttribute('aria-label')).toBe('Excluir registro');
    expect(slider.getAttribute('aria-valuemin')).toBe('0');
    expect(slider.getAttribute('aria-valuemax')).toBe('100');
    expect(slider.getAttribute('aria-valuenow')).toBe('0');
  });

  it('anuncia a conclusao', async () => {
    const user = userEvent.setup();
    render(<ArchbaseSlideToConfirm onConfirm={vi.fn()} successLabel="Excluido" />, {
      wrapper: Wrapper,
    });

    screen.getByRole('slider').focus();
    await user.keyboard('{Enter}');

    await waitFor(() =>
      expect(screen.getByRole('slider').getAttribute('aria-valuenow')).toBe('100'),
    );
  });

  it('nao confirma quando desabilitado', async () => {
    const user = userEvent.setup();
    const confirmar = vi.fn();
    render(<ArchbaseSlideToConfirm onConfirm={confirmar} disabled />, { wrapper: Wrapper });

    const slider = screen.getByRole('slider');
    expect(slider.getAttribute('tabindex')).toBe('-1');
    expect(slider.getAttribute('aria-disabled')).toBe('true');

    slider.focus();
    await user.keyboard('{Enter}');
    expect(confirmar).not.toHaveBeenCalled();
  });

  it('avisa a falha em vez de engoli-la', async () => {
    const user = userEvent.setup();
    const erro = new Error('backend recusou');
    const aoFalhar = vi.fn();

    render(
      <ArchbaseSlideToConfirm
        onConfirm={() => Promise.reject(erro)}
        onError={aoFalhar}
      />,
      { wrapper: Wrapper },
    );

    screen.getByRole('slider').focus();
    await user.keyboard('{Enter}');

    // O original voltava ao inicio silenciosamente: quem confirmou ficava sem
    // saber se a acao aconteceu.
    await waitFor(() => expect(aoFalhar).toHaveBeenCalledWith(erro));
  });

  it('nao dispara duas vezes com dois Enter seguidos', async () => {
    const user = userEvent.setup();
    const confirmar = vi.fn(() => new Promise<void>((r) => setTimeout(r, 50)));
    render(<ArchbaseSlideToConfirm onConfirm={confirmar} />, { wrapper: Wrapper });

    screen.getByRole('slider').focus();
    await user.keyboard('{Enter}');
    await user.keyboard('{Enter}');

    await waitFor(() => expect(confirmar).toHaveBeenCalledTimes(1));
  });
});

interface Tarefa {
  id: string;
  nome: string;
}

function ListaControlada({
  inicial,
  onReorder,
}: {
  inicial: Tarefa[];
  onReorder?: (itens: Tarefa[]) => void;
}) {
  const [itens, setItens] = useState(inicial);
  return (
    <ArchbaseReorderList
      items={itens}
      getItemId={(t) => t.id}
      getItemLabel={(t) => t.nome}
      onReorder={(proximos) => {
        setItens(proximos);
        onReorder?.(proximos);
      }}
    />
  );
}

const TAREFAS: Tarefa[] = [
  { id: 'a', nome: 'Primeira' },
  { id: 'b', nome: 'Segunda' },
  { id: 'c', nome: 'Terceira' },
];

describe('ArchbaseReorderList', () => {
  it('reordena pelo teclado', async () => {
    const user = userEvent.setup();
    const aoReordenar = vi.fn();
    render(<ListaControlada inicial={TAREFAS} onReorder={aoReordenar} />, { wrapper: Wrapper });

    const segundo = screen.getByText('Segunda').closest('li');
    segundo?.focus();
    await user.keyboard('{Alt>}{ArrowUp}{/Alt}');

    // Arrastar e, por natureza, inacessivel: sem equivalente por teclado a
    // funcionalidade nao existe para parte dos usuarios.
    await waitFor(() =>
      expect(aoReordenar).toHaveBeenCalledWith([
        { id: 'b', nome: 'Segunda' },
        { id: 'a', nome: 'Primeira' },
        { id: 'c', nome: 'Terceira' },
      ]),
    );
  });

  it('nao notifica na montagem', () => {
    const aoReordenar = vi.fn();
    render(<ListaControlada inicial={TAREFAS} onReorder={aoReordenar} />, { wrapper: Wrapper });

    // O original disparava onReorder num efeito com [list], notificando ja na
    // montagem sem ninguem ter reordenado nada.
    expect(aoReordenar).not.toHaveBeenCalled();
  });

  it('nao move alem dos limites', async () => {
    const user = userEvent.setup();
    const aoReordenar = vi.fn();
    render(<ListaControlada inicial={TAREFAS} onReorder={aoReordenar} />, { wrapper: Wrapper });

    screen.getByText('Primeira').closest('li')?.focus();
    await user.keyboard('{Alt>}{ArrowUp}{/Alt}');

    expect(aoReordenar).not.toHaveBeenCalled();
  });

  it('anuncia o movimento por regiao viva', async () => {
    const user = userEvent.setup();
    render(<ListaControlada inicial={TAREFAS} />, { wrapper: Wrapper });

    screen.getByText('Segunda').closest('li')?.focus();
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}');

    await waitFor(() => {
      const status = screen.getByRole('status');
      expect(status.textContent).toContain('Segunda');
      expect(status.textContent).toContain('2');
      expect(status.textContent).toContain('3');
    });
  });

  it('descreve posicao e instrucoes em cada item', () => {
    render(<ListaControlada inicial={TAREFAS} />, { wrapper: Wrapper });
    const primeiro = screen.getByText('Primeira').closest('li');

    expect(primeiro?.getAttribute('aria-label')).toContain('1 de 3');
    expect(primeiro?.getAttribute('aria-roledescription')).toBe('Item reordenavel');
  });

  it('aceita conteudo proprio sem exigir formato de item', () => {
    render(
      <ArchbaseReorderList
        items={TAREFAS}
        getItemId={(t) => t.id}
        onReorder={vi.fn()}
        renderItem={(t) => <span>tarefa: {t.nome}</span>}
      />,
      { wrapper: Wrapper },
    );

    // O drag-order-list original fixava a forma do item em title/subtitle/date.
    expect(screen.getByText(/tarefa: Primeira/)).toBeDefined();
  });

  it('remove quando o consumidor pede', async () => {
    const user = userEvent.setup();
    const remover = vi.fn();
    render(
      <ArchbaseReorderList
        items={TAREFAS}
        getItemId={(t) => t.id}
        getItemLabel={(t) => t.nome}
        onReorder={vi.fn()}
        onRemove={remover}
      />,
      { wrapper: Wrapper },
    );

    await user.click(screen.getByRole('button', { name: /Remover: Primeira/ }));
    expect(remover).toHaveBeenCalledWith(TAREFAS[0]);
  });

  it('desabilitado nao move nem foca', async () => {
    const user = userEvent.setup();
    const aoReordenar = vi.fn();
    render(
      <ArchbaseReorderList
        items={TAREFAS}
        getItemId={(t) => t.id}
        getItemLabel={(t) => t.nome}
        onReorder={aoReordenar}
        disabled
      />,
      { wrapper: Wrapper },
    );

    const item = screen.getByText('Segunda').closest('li');
    expect(item?.getAttribute('tabindex')).toBe('-1');

    item?.focus();
    await user.keyboard('{Alt>}{ArrowUp}{/Alt}');
    expect(aoReordenar).not.toHaveBeenCalled();
  });
});
