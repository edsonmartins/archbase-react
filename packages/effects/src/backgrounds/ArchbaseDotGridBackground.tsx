import { useCallback, useEffect, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { useArchbaseCanvasAnimation } from '../hooks/useArchbaseCanvasAnimation';
import { readCssVariable } from '../theme/resolveColors';

export interface ArchbaseDotGridBackgroundProps {
  /** Diametro do ponto, em pixels. */
  dotSize?: number;
  /** Espacamento entre pontos, como multiplo do diametro. */
  dotSpacing?: number;
  /** Cor dos pontos. Ausente, herda a cor de texto do tema. */
  dotColor?: string;
  /** Expoente da atenuacao radial: maior concentra o brilho no centro. */
  scaleFactor?: number;
  /** Escala minima do ponto nas bordas. */
  minScale?: number;
  /** Permite arrastar a grade. */
  draggable?: boolean;
  /** Mantem o movimento apos soltar. */
  inertia?: boolean;
  /** Atrito da inercia, entre 0 e 1. */
  inertiaDamping?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const TAU = Math.PI * 2;
/** Razao de altura da grade hexagonal. */
const RAZAO_HEX = 0.866;
/** A grade cobre 3x o container para o arrasto nao revelar borda. */
const COBERTURA = 3;

/**
 * Fundo de grade de pontos com atenuacao radial e arrasto com inercia.
 *
 * Adaptado de Lightswind UI (MIT, Muhilan / codewithMUHILAN).
 *
 * Diferencas em relacao ao original, todas deliberadas:
 *
 * - Desenha sob demanda. O original mantinha um `requestAnimationFrame` eterno
 *   para uma inercia que passa a maior parte do tempo em repouso; aqui o laco
 *   so existe enquanto ha velocidade a dissipar.
 * - Respeita `prefers-reduced-motion`: a grade aparece e continua arrastavel,
 *   mas sem a inercia que continua se movendo sozinha.
 * - Observa o container, nao a janela.
 * - A prop `cols` do original foi removida: era declarada e nunca usada.
 */
export function ArchbaseDotGridBackground({
  dotSize = 12,
  dotSpacing = 3.6,
  dotColor,
  scaleFactor = 6,
  minScale = 0.04,
  draggable = true,
  inertia = true,
  inertiaDamping = 0.92,
  className,
  style,
  children,
}: ArchbaseDotGridBackgroundProps) {
  const pontos = useRef<Float32Array>(new Float32Array(0));
  const grade = useRef({ largura: 0, altura: 0 });
  const posicao = useRef({ x: 0, y: 0 });
  const velocidade = useRef({ x: 0, y: 0 });
  const arrastando = useRef(false);
  const inicioArrasto = useRef({ mouseX: 0, mouseY: 0, gradeX: 0, gradeY: 0 });
  const ultimoPonteiro = useRef({ x: 0, y: 0 });
  const corResolvida = useRef('#ffffff');
  const inerciaRaf = useRef(0);
  const containerEl = useRef<HTMLDivElement | null>(null);

  const limitar = useCallback((x: number, y: number, largura: number, altura: number) => {
    return {
      x: Math.min(0, Math.max(largura - grade.current.largura, x)),
      y: Math.min(0, Math.max(altura - grade.current.altura, y)),
    };
  }, []);

  const desenhar = useCallback(
    (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const distanciaMaxima = Math.hypot(cx, cy) * 1.15;
      const raio = dotSize * 0.5;
      const margem = dotSize * 6;
      const gx = posicao.current.x;
      const gy = posicao.current.y;
      const lista = pontos.current;

      ctx.fillStyle = corResolvida.current;

      for (let i = 0; i < lista.length; i += 2) {
        const px = lista[i];
        const py = lista[i + 1];
        if (px === undefined || py === undefined) continue;

        const sx = px + gx;
        const sy = py + gy;
        if (sx < -margem || sx > width + margem) continue;
        if (sy < -margem || sy > height + margem) continue;

        const dx = sx - cx;
        const dy = sy - cy;
        const escala = Math.max(minScale, (1.05 - Math.hypot(dx, dy) / distanciaMaxima) ** scaleFactor);
        if (escala < 0.005) continue;

        ctx.beginPath();
        ctx.arc(sx, sy, raio * escala, 0, TAU);
        ctx.fill();
      }
    },
    [dotSize, minScale, scaleFactor],
  );

  const { containerRef, canvasRef, requestFrame, reducedMotion, size } = useArchbaseCanvasAnimation({
    mode: 'onDemand',
    setup: (canvas, tamanho) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(tamanho.dpr, 0, 0, tamanho.dpr, 0, 0);

      const celula = dotSize * dotSpacing;
      const colunas = Math.ceil((tamanho.width * COBERTURA) / celula) + 2;
      const linhas = Math.ceil((tamanho.height * COBERTURA) / (celula * RAZAO_HEX)) + 2;

      grade.current = {
        largura: colunas * celula + celula,
        altura: linhas * celula * RAZAO_HEX + celula,
      };

      const lista = new Float32Array(colunas * linhas * 2);
      let i = 0;
      for (let linha = 0; linha < linhas; linha += 1) {
        for (let coluna = 0; coluna < colunas; coluna += 1) {
          lista[i++] = coluna * celula + (linha % 2 ? celula * 0.5 : 0) + celula * 0.5;
          lista[i++] = linha * celula * RAZAO_HEX + celula * 0.5;
        }
      }
      pontos.current = lista;

      corResolvida.current =
        dotColor ?? readCssVariable(containerEl.current, '--mantine-color-text', '#ffffff');

      const centrado = limitar(
        (tamanho.width - grade.current.largura) / 2,
        (tamanho.height - grade.current.altura) / 2,
        tamanho.width,
        tamanho.height,
      );
      posicao.current = centrado;
      return undefined;
    },
    frame: desenhar,
  });

  const registrarContainer = useCallback(
    (node: HTMLDivElement | null) => {
      containerEl.current = node;
      containerRef(node);
    },
    [containerRef],
  );

  // A inercia e um laco proprio e efemero: nasce ao soltar o ponteiro e morre
  // quando a velocidade se dissipa. Nao ha animacao permanente aqui.
  const dissiparInercia = useCallback(() => {
    const container = containerEl.current;
    if (!container) return;

    const passo = () => {
      const velocidadeTotal = Math.abs(velocidade.current.x) + Math.abs(velocidade.current.y);
      if (arrastando.current || velocidadeTotal <= 0.05) {
        inerciaRaf.current = 0;
        return;
      }
      velocidade.current.x *= inertiaDamping;
      velocidade.current.y *= inertiaDamping;

      const proximo = limitar(
        posicao.current.x + velocidade.current.x,
        posicao.current.y + velocidade.current.y,
        container.clientWidth,
        container.clientHeight,
      );
      posicao.current = proximo;
      requestFrame();
      inerciaRaf.current = requestAnimationFrame(passo);
    };

    cancelAnimationFrame(inerciaRaf.current);
    inerciaRaf.current = requestAnimationFrame(passo);
  }, [inertiaDamping, limitar, requestFrame]);

  useEffect(() => () => cancelAnimationFrame(inerciaRaf.current), []);

  const aoPressionar = useCallback(
    (evento: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggable) return;
      arrastando.current = true;
      velocidade.current = { x: 0, y: 0 };
      cancelAnimationFrame(inerciaRaf.current);
      inicioArrasto.current = {
        mouseX: evento.clientX,
        mouseY: evento.clientY,
        gradeX: posicao.current.x,
        gradeY: posicao.current.y,
      };
      ultimoPonteiro.current = { x: evento.clientX, y: evento.clientY };
      evento.currentTarget.setPointerCapture(evento.pointerId);
    },
    [draggable],
  );

  const aoMover = useCallback(
    (evento: ReactPointerEvent<HTMLDivElement>) => {
      if (!arrastando.current) return;
      const container = containerEl.current;
      if (!container) return;

      velocidade.current = {
        x: evento.clientX - ultimoPonteiro.current.x,
        y: evento.clientY - ultimoPonteiro.current.y,
      };
      ultimoPonteiro.current = { x: evento.clientX, y: evento.clientY };

      posicao.current = limitar(
        inicioArrasto.current.gradeX + evento.clientX - inicioArrasto.current.mouseX,
        inicioArrasto.current.gradeY + evento.clientY - inicioArrasto.current.mouseY,
        container.clientWidth,
        container.clientHeight,
      );
      requestFrame();
    },
    [limitar, requestFrame],
  );

  const aoSoltar = useCallback(() => {
    if (!arrastando.current) return;
    arrastando.current = false;
    // Movimento reduzido: a grade para onde o usuario soltou, sem deslizar.
    if (inertia && !reducedMotion) dissiparInercia();
  }, [inertia, reducedMotion, dissiparInercia]);

  useEffect(() => {
    if (size.width > 0) requestFrame();
  }, [size, requestFrame]);

  return (
    <div
      ref={registrarContainer}
      className={className}
      onPointerDown={aoPressionar}
      onPointerMove={aoMover}
      onPointerUp={aoSoltar}
      onPointerCancel={aoSoltar}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        userSelect: 'none',
        cursor: draggable ? 'grab' : undefined,
        ...style,
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ position: 'absolute', inset: 0, display: 'block' }}
      />
      {children ? (
        <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
