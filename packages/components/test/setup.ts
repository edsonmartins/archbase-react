/**
 * O jsdom nao implementa as APIs que o Mantine consulta ao montar. Sem estes
 * duplos, os componentes lancam antes de qualquer asercao — e o erro aparece
 * como AggregateError no render, que nao diz o que falta.
 */
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

globalThis.ResizeObserver = ResizeObserverMock as unknown as typeof ResizeObserver;

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

window.HTMLElement.prototype.scrollIntoView = () => {};
