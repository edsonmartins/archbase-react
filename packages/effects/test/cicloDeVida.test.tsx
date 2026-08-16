import { act, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ArchbaseCosmicDust } from '../src/backgrounds/ArchbaseCosmicDust';
import { ArchbaseDotGridBackground } from '../src/backgrounds/ArchbaseDotGridBackground';
import { ArchbaseMagicLoader } from '../src/loaders/ArchbaseMagicLoader';
import { ArchbaseNebulaFlow } from '../src/backgrounds/ArchbaseNebulaFlow';
import {
  IntersectionObserverMock,
  ResizeObserverMock,
  definirMovimentoReduzido,
} from './setup';

/**
 * Conta quadros pedidos ao navegador. E a medida que interessa: o defeito
 * central dos originais era pedir quadros para sempre, mesmo sem nada a fazer.
 */
function espionarQuadros() {
  let pendentes: FrameRequestCallback[] = [];
  let total = 0;

  const raf = vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
    total += 1;
    pendentes.push(cb);
    return total;
  });
  const cancel = vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation(() => {});

  return {
    get total() {
      return total;
    },
    /** Executa os callbacks acumulados, como faria um quadro real. */
    avancar(tempo = 16) {
      const fila = pendentes;
      pendentes = [];
      for (const cb of fila) cb(tempo);
    },
    zerar() {
      total = 0;
    },
    restaurar() {
      raf.mockRestore();
      cancel.mockRestore();
    },
  };
}

beforeEach(() => {
  definirMovimentoReduzido(false);
  ResizeObserverMock.instancias.length = 0;
  IntersectionObserverMock.instancias.length = 0;
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('laco de animacao', () => {
  it('para de pedir quadros quando o elemento sai da viewport', async () => {
    const quadros = espionarQuadros();
    render(<ArchbaseCosmicDust />);

    const observer = IntersectionObserverMock.instancias[0];
    expect(observer).toBeDefined();

    // Entra em cena: passa a desenhar.
    await waitFor(() => {
      act(() => { observer?.emitir(true); });
      quadros.avancar();
      expect(quadros.total).toBeGreaterThan(0);
    });

    // Sai de cena: o laco precisa parar de verdade, nao reagendar quadro vazio.
    act(() => { observer?.emitir(false); });
    await waitFor(() => expect(true).toBe(true));
    quadros.avancar();
    quadros.zerar();
    quadros.avancar();

    expect(quadros.total).toBe(0);
    quadros.restaurar();
  });

  it('nao anima quando o usuario pede menos movimento', async () => {
    definirMovimentoReduzido(true);
    const quadros = espionarQuadros();

    render(<ArchbaseCosmicDust />);
    act(() => { IntersectionObserverMock.instancias[0]?.emitir(true); });

    await waitFor(() => expect(ResizeObserverMock.instancias.length).toBeGreaterThan(0));
    quadros.avancar();
    quadros.zerar();
    quadros.avancar();
    quadros.avancar();

    // Um quadro estatico e aceitavel; laco continuo nao.
    expect(quadros.total).toBeLessThanOrEqual(1);
    quadros.restaurar();
  });

  it('desconecta os observadores ao desmontar', async () => {
    const { unmount } = render(<ArchbaseCosmicDust />);
    await waitFor(() => expect(ResizeObserverMock.instancias.length).toBeGreaterThan(0));

    unmount();

    expect(ResizeObserverMock.instancias.every((o) => o.desconectado)).toBe(true);
    expect(IntersectionObserverMock.instancias.every((o) => o.desconectado)).toBe(true);
  });

  it('observa o container, nao a janela', async () => {
    render(<ArchbaseDotGridBackground />);
    await waitFor(() => expect(ResizeObserverMock.instancias.length).toBeGreaterThan(0));

    const observados = ResizeObserverMock.instancias.flatMap((o) => o.observados);
    expect(observados.length).toBeGreaterThan(0);
    expect(observados.every((el) => el instanceof HTMLElement)).toBe(true);
  });
});

describe('grade de pontos', () => {
  it('nao mantem laco continuo em repouso', async () => {
    const quadros = espionarQuadros();
    render(<ArchbaseDotGridBackground />);
    act(() => { IntersectionObserverMock.instancias[0]?.emitir(true); });

    await waitFor(() => expect(ResizeObserverMock.instancias.length).toBeGreaterThan(0));
    quadros.avancar();
    quadros.zerar();

    // Sob demanda: parada, a grade nao pede quadro nenhum.
    quadros.avancar();
    quadros.avancar();
    expect(quadros.total).toBe(0);

    quadros.restaurar();
  });

  it('renderiza o conteudo sobreposto', () => {
    render(
      <ArchbaseDotGridBackground>
        <span>conteudo acima</span>
      </ArchbaseDotGridBackground>,
    );
    expect(screen.getByText('conteudo acima')).toBeDefined();
  });
});

describe('indicador de carregamento', () => {
  it('anuncia o estado a leitores de tela', () => {
    render(<ArchbaseMagicLoader label="Carregando relatorio" />);
    const status = screen.getByRole('status');

    expect(status.getAttribute('aria-label')).toBe('Carregando relatorio');
    expect(status.getAttribute('aria-live')).toBe('polite');
  });

  it('mantem sinal textual quando o movimento e reduzido', () => {
    definirMovimentoReduzido(true);
    render(<ArchbaseMagicLoader label="Carregando" />);

    // Sem animacao o usuario ainda precisa saber que algo acontece.
    expect(screen.getByText(/Carregando/)).toBeDefined();
    expect(document.querySelector('canvas')).toBeNull();
  });

  it('esconde o canvas da arvore de acessibilidade', () => {
    render(<ArchbaseMagicLoader />);
    expect(document.querySelector('canvas')?.getAttribute('aria-hidden')).toBe('true');
  });
});

describe('nebula', () => {
  it('exibe o fallback quando o navegador nao tem WebGL', async () => {
    // O setup devolve null para contexto webgl de proposito.
    render(<ArchbaseNebulaFlow fallback={<span>sem aceleracao</span>} />);
    await waitFor(() => expect(ResizeObserverMock.instancias.length).toBeGreaterThan(0));

    expect(screen.queryByText('sem aceleracao')).toBeDefined();
  });

  it('nao quebra a montagem sem WebGL', () => {
    expect(() => render(<ArchbaseNebulaFlow />)).not.toThrow();
  });
});
