import { vi } from 'vitest';

/**
 * O jsdom nao implementa as APIs que o Mantine consulta ao montar. Sem estes
 * duplos os componentes lancam antes de qualquer asercao.
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

window.HTMLElement.prototype.scrollIntoView = vi.fn();
