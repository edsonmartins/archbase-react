/**
 * O jsdom não implementa ResizeObserver, e componentes que medem o próprio
 * container — as janelas flutuantes, por exemplo — o instanciam ao montar.
 * Sem este duplo a suíte falha com "ResizeObserver is not defined" antes de
 * qualquer asserção.
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
