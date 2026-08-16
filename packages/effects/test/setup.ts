import { vi } from 'vitest';

/**
 * O jsdom nao tem layout, nao tem observers e nao tem canvas. Estes duplos
 * existem para que os testes verifiquem o **ciclo de vida** do laco de
 * animacao — que e o que este pacote acrescenta ao codigo original — e nao o
 * desenho em si, que so um navegador de verdade poderia validar.
 */

class ResizeObserverMock {
  static instancias: ResizeObserverMock[] = [];
  observados: Element[] = [];
  desconectado = false;
  constructor(public callback: ResizeObserverCallback) {
    ResizeObserverMock.instancias.push(this);
  }
  observe(alvo: Element) {
    this.observados.push(alvo);
  }
  unobserve() {}
  disconnect() {
    this.desconectado = true;
  }
}

class IntersectionObserverMock {
  static instancias: IntersectionObserverMock[] = [];
  desconectado = false;
  constructor(public callback: IntersectionObserverCallback) {
    IntersectionObserverMock.instancias.push(this);
  }
  observe() {}
  unobserve() {}
  disconnect() {
    this.desconectado = true;
  }
  /** Dispara o callback como o navegador faria. */
  emitir(intersecta: boolean) {
    this.callback(
      [{ isIntersecting: intersecta } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}

globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;
globalThis.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

export { ResizeObserverMock, IntersectionObserverMock };

/** Preferencia de movimento controlavel por teste. */
let movimentoReduzido = false;
export function definirMovimentoReduzido(valor: boolean) {
  movimentoReduzido = valor;
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: query.includes('prefers-reduced-motion') ? movimentoReduzido : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }),
});

// O container precisa ter tamanho, senao o hook nunca sai do estado inicial.
Object.defineProperty(HTMLElement.prototype, 'getBoundingClientRect', {
  writable: true,
  value: () => ({
    width: 400,
    height: 300,
    top: 0,
    left: 0,
    right: 400,
    bottom: 300,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  }),
});

Object.defineProperty(HTMLElement.prototype, 'clientWidth', { value: 400, configurable: true });
Object.defineProperty(HTMLElement.prototype, 'clientHeight', { value: 300, configurable: true });

/** Contexto 2D minimo: registra chamadas sem desenhar nada. */
const contexto2d = () => ({
  clearRect: vi.fn(),
  fillRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  setTransform: vi.fn(),
  scale: vi.fn(),
  globalCompositeOperation: '',
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 1,
});

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  writable: true,
  value: function (tipo: string) {
    // WebGL indisponivel de proposito: exercita o caminho de fallback.
    return tipo === '2d' ? contexto2d() : null;
  },
});
