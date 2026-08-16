import { useCallback, useEffect, useRef, useState } from 'react';

/*
 * Laco de animacao compartilhado por todos os efeitos deste pacote.
 *
 * Existe porque as quatro implementacoes originais repetiam os mesmos quatro
 * defeitos, e corrigi-los em cada componente convidaria o proximo a repeti-los:
 *
 * 1. O requestAnimationFrame nunca parava. Mesmo parado ou fora de tela, o
 *    laco continuava agendando quadros — acorda a GPU sem desenhar nada, e num
 *    painel administrativo isso roda o dia inteiro.
 * 2. Nenhum respeitava `prefers-reduced-motion`. Fundo animado permanente e
 *    barreira de acessibilidade, nao enfeite opcional.
 * 3. Redimensionamento so era observado em `window`, entao painel que muda de
 *    largura sem a janela mudar deixava o canvas esticado.
 * 4. A densidade de pixels do dispositivo era ignorada ou aplicada de forma
 *    inconsistente, deixando o desenho borrado em tela retina.
 */

export interface CanvasSize {
  /** Largura em pixels de CSS. */
  width: number;
  /** Altura em pixels de CSS. */
  height: number;
  /** Densidade aplicada ao buffer do canvas. */
  dpr: number;
}

export interface FrameState {
  /** Milissegundos desde o primeiro quadro. */
  time: number;
  /** Milissegundos desde o quadro anterior. */
  delta: number;
  /** Contador de quadros desenhados. */
  frame: number;
  size: CanvasSize;
}

export interface UseArchbaseCanvasAnimationOptions {
  /**
   * Preparacao executada apos o canvas existir e a cada mudanca de tamanho.
   * Pode devolver uma funcao de limpeza.
   */
  setup?: (canvas: HTMLCanvasElement, size: CanvasSize) => undefined | (() => void);
  /** Desenha um quadro. */
  frame?: (canvas: HTMLCanvasElement, state: FrameState) => void;
  /**
   * `continuous` desenha enquanto visivel; `onDemand` desenha apenas quando
   * `requestFrame()` e chamado.
   *
   * Grade arrastavel, por exemplo, nao tem o que animar parada: `onDemand`
   * elimina o laco ocioso sem perder fluidez no arrasto.
   */
  mode?: 'continuous' | 'onDemand';
  /** Pausa quando o elemento sai da viewport. */
  pauseOffscreen?: boolean;
  /** Pausa quando o usuario pediu menos movimento. */
  respectReducedMotion?: boolean;
  /** Ajusta o buffer a densidade de pixels do dispositivo. */
  applyDevicePixelRatio?: boolean;
  /** Teto de densidade. Retina 3x triplica o custo sem ganho perceptivel. */
  maxDevicePixelRatio?: number;
  /** Pausa controlada pelo hospedeiro. */
  paused?: boolean;
}

export interface UseArchbaseCanvasAnimationResult {
  containerRef: (node: HTMLElement | null) => void;
  canvasRef: (node: HTMLCanvasElement | null) => void;
  /** Verdadeiro enquanto o laco desenha. */
  running: boolean;
  /** Verdadeiro quando parado por `prefers-reduced-motion`. */
  reducedMotion: boolean;
  size: CanvasSize;
  /** Agenda um unico quadro. Util em `onDemand`. */
  requestFrame: () => void;
}

const SIZE_ZERO: CanvasSize = { width: 0, height: 0, dpr: 1 };

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useArchbaseCanvasAnimation(
  options: UseArchbaseCanvasAnimationOptions,
): UseArchbaseCanvasAnimationResult {
  const {
    mode = 'continuous',
    pauseOffscreen = true,
    respectReducedMotion = true,
    applyDevicePixelRatio = true,
    maxDevicePixelRatio = 2,
    paused = false,
  } = options;

  const [container, setContainer] = useState<HTMLElement | null>(null);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [size, setSize] = useState<CanvasSize>(SIZE_ZERO);
  const [visible, setVisible] = useState(!pauseOffscreen);
  const [reduced, setReduced] = useState(() => respectReducedMotion && prefersReducedMotion());
  const [running, setRunning] = useState(false);

  // Callbacks vivem em ref para que trocar a funcao de desenho a cada render
  // nao reinicie o laco — reiniciar perderia o estado acumulado da animacao.
  const setupRef = useRef(options.setup);
  const frameRef = useRef(options.frame);
  setupRef.current = options.setup;
  frameRef.current = options.frame;

  const rafRef = useRef(0);
  const startedAtRef = useRef(0);
  const lastAtRef = useRef(0);
  const countRef = useRef(0);
  const sizeRef = useRef<CanvasSize>(SIZE_ZERO);

  useEffect(() => {
    if (!respectReducedMotion) {
      setReduced(false);
      return;
    }
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(query.matches);
    setReduced(query.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, [respectReducedMotion]);

  // Dimensionamento pelo container, nao pela janela: painel que muda de largura
  // sem a janela mudar precisa reagir igual.
  useEffect(() => {
    if (!container || !canvas) return;

    const apply = () => {
      const rect = container.getBoundingClientRect();
      const dpr = applyDevicePixelRatio
        ? Math.min(maxDevicePixelRatio, globalThis.devicePixelRatio || 1)
        : 1;

      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const next: CanvasSize = { width, height, dpr };
      sizeRef.current = next;
      setSize(next);
    };

    apply();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(apply);
    observer.observe(container);
    return () => observer.disconnect();
  }, [container, canvas, applyDevicePixelRatio, maxDevicePixelRatio]);

  useEffect(() => {
    if (!container || !pauseOffscreen) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => setVisible(entries.some((entry) => entry.isIntersecting)),
      { threshold: 0 },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [container, pauseOffscreen]);

  // `setup` roda a cada mudanca de tamanho porque trocar as dimensoes do canvas
  // zera o estado do contexto — escala, composicao, buffers do WebGL.
  useEffect(() => {
    if (!canvas || size.width === 0) return;
    return setupRef.current?.(canvas, size);
  }, [canvas, size]);

  const drawOnce = useCallback(() => {
    if (!canvas) return;
    const now = performance.now();
    if (startedAtRef.current === 0) startedAtRef.current = now;
    const delta = lastAtRef.current === 0 ? 0 : now - lastAtRef.current;
    lastAtRef.current = now;
    countRef.current += 1;

    frameRef.current?.(canvas, {
      time: now - startedAtRef.current,
      delta,
      frame: countRef.current,
      size: sizeRef.current,
    });
  }, [canvas]);

  const requestFrame = useCallback(() => {
    if (!canvas) return;
    // Um unico quadro, sem entrar em laco.
    requestAnimationFrame(() => drawOnce());
  }, [canvas, drawOnce]);

  const active =
    !paused && !reduced && size.width > 0 && canvas !== null && (!pauseOffscreen || visible);

  useEffect(() => {
    if (mode !== 'continuous' || !active) {
      setRunning(false);
      return;
    }

    setRunning(true);
    let alive = true;

    const loop = () => {
      if (!alive) return;
      drawOnce();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      alive = false;
      // Parada de verdade: nada de reagendar um quadro vazio so para manter o
      // laco vivo, que e o que fazia a versao original acordar a GPU parada.
      cancelAnimationFrame(rafRef.current);
      lastAtRef.current = 0;
      setRunning(false);
    };
  }, [mode, active, drawOnce]);

  // Em `onDemand` e com movimento reduzido, ainda vale um quadro estatico: o
  // efeito aparece, apenas nao se move.
  useEffect(() => {
    if (mode === 'continuous' && !reduced) return;
    if (!canvas || size.width === 0) return;
    requestFrame();
  }, [mode, reduced, canvas, size, requestFrame]);

  return {
    containerRef: setContainer,
    canvasRef: setCanvas,
    running,
    reducedMotion: reduced,
    size,
    requestFrame,
  };
}
