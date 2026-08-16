import { act, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ArchbaseMagicLoader } from '../src/loaders/ArchbaseMagicLoader';
import { IntersectionObserverMock, definirMovimentoReduzido } from './setup';

/** Dimensoes que o `getBoundingClientRect` do setup devolve. */
const LARGURA = 400;
const ALTURA = 300;

/**
 * O loader nao aparecia no navegador do usuario. Estes testes dirigem os
 * quadros a mao e verificam onde o componente manda desenhar — o que o
 * ambiente automatizado nao mostra, porque aba oculta suspende
 * `requestAnimationFrame` e nenhum efeito chega a pintar.
 */
function capturarDesenho() {
  const arcos: Array<{ x: number; y: number; r: number }> = [];
  const original = HTMLCanvasElement.prototype.getContext;

  HTMLCanvasElement.prototype.getContext = function (tipo: string) {
    if (tipo !== '2d') return null;
    return {
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      arc: vi.fn((x: number, y: number, r: number) => arcos.push({ x, y, r })),
      fill: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      setTransform: vi.fn(),
      globalCompositeOperation: '',
      fillStyle: '',
      strokeStyle: '',
      globalAlpha: 1,
    } as unknown as CanvasRenderingContext2D;
  } as typeof HTMLCanvasElement.prototype.getContext;

  return {
    arcos,
    restaurar: () => {
      HTMLCanvasElement.prototype.getContext = original;
    },
  };
}

describe('ArchbaseMagicLoader — desenho', () => {
  // Sem zerar, o caso seguinte emite no observer do caso anterior — ja
  // desmontado — e o laco do componente novo nunca comeca.
  beforeEach(() => {
    IntersectionObserverMock.instancias.length = 0;
    definirMovimentoReduzido(false);
  });

  it('desenha dentro da area do canvas', () => {
    definirMovimentoReduzido(false);
    const captura = capturarDesenho();

    const pendentes: FrameRequestCallback[] = [];
    const raf = vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
      pendentes.push(cb);
      return pendentes.length;
    });

    render(<ArchbaseMagicLoader size={200} particleCount={3} />);
    act(() => {
      IntersectionObserverMock.instancias.at(-1)?.emitir(true);
    });

    for (let i = 0; i < 30; i += 1) {
      const fila = pendentes.splice(0, pendentes.length);
      act(() => {
        for (const cb of fila) cb(i * 16);
      });
    }

    raf.mockRestore();
    captura.restaurar();

    const { arcos } = captura;
    expect(arcos.length).toBeGreaterThan(0);

    // O centro de emissao acompanha o tamanho MEDIDO do container, nao a prop
    // `size` — foi o que meu primeiro diagnostico confundiu, comparando com
    // 200x200 quando o container media 400x300.
    const dentro = arcos.filter(
      (a) => a.x >= 0 && a.x <= LARGURA && a.y >= 0 && a.y <= ALTURA,
    );
    expect(dentro.length).toBe(arcos.length);

    // Raio util: particula de raio sub-pixel nao produz sinal visivel.
    expect(arcos.filter((a) => a.r >= 1).length).toBeGreaterThan(0);
  });

  it('ja tem particulas no primeiro quadro, sem esperar dezenas deles', () => {
    definirMovimentoReduzido(false);
    const captura = capturarDesenho();

    const pendentes: FrameRequestCallback[] = [];
    const raf = vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
      pendentes.push(cb);
      return pendentes.length;
    });

    render(<ArchbaseMagicLoader size={200} particleCount={1} />);
    act(() => {
      IntersectionObserverMock.instancias.at(-1)?.emitir(true);
    });

    // Um unico quadro.
    const fila = pendentes.splice(0, pendentes.length);
    act(() => {
      for (const cb of fila) cb(16);
    });

    raf.mockRestore();
    captura.restaurar();

    // Indicador de carregamento que so fica visivel depois de meio segundo
    // falha justamente no instante em que precisa comunicar.
    expect(captura.arcos.length).toBeGreaterThan(5);
  });

  it('posiciona o canvas como os demais efeitos do pacote', () => {
    definirMovimentoReduzido(false);
    render(<ArchbaseMagicLoader />);

    const canvas = document.querySelector('[role="status"] canvas');
    expect(canvas?.getAttribute('style')).toContain('position: absolute');
  });
});
