import { useCallback, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { useArchbaseCanvasAnimation } from '../hooks/useArchbaseCanvasAnimation';
import { readColorScheme, readCssVariable } from '../theme/resolveColors';

export interface ArchbaseBeamGridProps {
  /** Lado da celula, em pixels. */
  gridSize?: number;
  /** Cor das linhas da grade. Ausente, deriva do tema. */
  gridColor?: string;
  /** Cor dos feixes. */
  beamColor?: string;
  beamSpeed?: number;
  beamThickness?: number;
  beamCount?: number;
  /** Halo em volta do feixe. Custa desempenho: `shadowBlur` e caro. */
  glow?: boolean;
  glowIntensity?: number;
  /** Ilumina celulas proximas ao ponteiro. */
  interactive?: boolean;
  /** Raio de influencia do ponteiro, em pixels. */
  interactionRadius?: number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

interface Feixe {
  eixo: 'h' | 'v';
  linha: number;
  posicao: number;
  velocidade: number;
  comprimento: number;
}

/**
 * Grade tecnica com feixes percorrendo as linhas e celulas que acendem sob o
 * ponteiro.
 *
 * Adaptado de Lightswind UI (MIT, Muhilan / codewithMUHILAN).
 *
 * Diferencas:
 *
 * - A grade estatica e desenhada uma vez num canvas fora de tela e copiada a
 *   cada quadro, em vez de redesenhar centenas de linhas por quadro. Numa area
 *   grande com celula pequena isso e a diferenca entre 60 e 20 quadros.
 * - O halo (`shadowBlur`) e opcional e desligavel: e a operacao mais cara do
 *   canvas 2D, e em grade densa domina o custo do quadro.
 * - Tema lido por custom property, nao por classe `dark` no documento.
 */
export function ArchbaseBeamGrid({
  gridSize = 40,
  gridColor,
  beamColor,
  beamSpeed = 1,
  beamThickness = 2,
  beamCount = 6,
  glow = true,
  glowIntensity = 12,
  interactive = true,
  interactionRadius = 140,
  className,
  style,
  children,
}: ArchbaseBeamGridProps) {
  const feixes = useRef<Feixe[]>([]);
  const grade = useRef<HTMLCanvasElement | null>(null);
  const ponteiro = useRef({ x: -9999, y: -9999, dentro: false });
  const containerEl = useRef<HTMLDivElement | null>(null);
  const cores = useRef({ grade: 'rgba(255,255,255,0.08)', feixe: '#22d3ee' });

  const preparar = useCallback(
    (canvas: HTMLCanvasElement, tamanho: { width: number; height: number; dpr: number }) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return undefined;
      ctx.setTransform(tamanho.dpr, 0, 0, tamanho.dpr, 0, 0);

      const escuro = readColorScheme(containerEl.current) === 'dark';
      cores.current = {
        grade: gridColor ?? (escuro ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'),
        feixe:
          beamColor ??
          readCssVariable(containerEl.current, '--mantine-primary-color-filled', '#22d3ee'),
      };

      // Grade estatica pre-renderizada: copiar um bitmap por quadro custa uma
      // fracao de redesenhar cada linha.
      const fora = document.createElement('canvas');
      fora.width = Math.floor(tamanho.width * tamanho.dpr);
      fora.height = Math.floor(tamanho.height * tamanho.dpr);
      const foraCtx = fora.getContext('2d');
      if (foraCtx) {
        foraCtx.setTransform(tamanho.dpr, 0, 0, tamanho.dpr, 0, 0);
        foraCtx.strokeStyle = cores.current.grade;
        foraCtx.lineWidth = 1;
        foraCtx.beginPath();
        for (let x = 0; x <= tamanho.width; x += gridSize) {
          foraCtx.moveTo(Math.floor(x) + 0.5, 0);
          foraCtx.lineTo(Math.floor(x) + 0.5, tamanho.height);
        }
        for (let y = 0; y <= tamanho.height; y += gridSize) {
          foraCtx.moveTo(0, Math.floor(y) + 0.5);
          foraCtx.lineTo(tamanho.width, Math.floor(y) + 0.5);
        }
        foraCtx.stroke();
      }
      grade.current = fora;

      const colunas = Math.max(1, Math.floor(tamanho.width / gridSize));
      const linhas = Math.max(1, Math.floor(tamanho.height / gridSize));

      feixes.current = Array.from({ length: beamCount }, () => {
        const horizontal = Math.random() > 0.5;
        return {
          eixo: horizontal ? 'h' : 'v',
          linha: Math.floor(Math.random() * (horizontal ? linhas : colunas)),
          posicao: Math.random() * (horizontal ? tamanho.width : tamanho.height),
          velocidade: (0.8 + Math.random() * 1.6) * beamSpeed * (Math.random() > 0.5 ? 1 : -1),
          comprimento: gridSize * (2 + Math.random() * 4),
        };
      });

      return undefined;
    },
    [gridSize, gridColor, beamColor, beamCount, beamSpeed],
  );

  const desenharQuadro = useCallback(
    (canvas: HTMLCanvasElement, estado: { size: { width: number; height: number } }) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = estado.size;
      ctx.clearRect(0, 0, width, height);

      if (grade.current) ctx.drawImage(grade.current, 0, 0, width, height);

      ctx.strokeStyle = cores.current.feixe;
      ctx.lineWidth = beamThickness;
      if (glow) {
        ctx.shadowBlur = glowIntensity;
        ctx.shadowColor = cores.current.feixe;
      }

      for (const feixe of feixes.current) {
        feixe.posicao += feixe.velocidade;
        const limite = feixe.eixo === 'h' ? width : height;
        if (feixe.posicao > limite + feixe.comprimento) feixe.posicao = -feixe.comprimento;
        if (feixe.posicao < -feixe.comprimento) feixe.posicao = limite + feixe.comprimento;

        const fixo = feixe.linha * gridSize + 0.5;
        ctx.beginPath();
        if (feixe.eixo === 'h') {
          ctx.moveTo(feixe.posicao, fixo);
          ctx.lineTo(feixe.posicao + feixe.comprimento, fixo);
        } else {
          ctx.moveTo(fixo, feixe.posicao);
          ctx.lineTo(fixo, feixe.posicao + feixe.comprimento);
        }
        ctx.stroke();
      }

      ctx.shadowBlur = 0;

      if (interactive && ponteiro.current.dentro) {
        const { x, y } = ponteiro.current;
        const alcance = Math.ceil(interactionRadius / gridSize);
        const colunaCentral = Math.floor(x / gridSize);
        const linhaCentral = Math.floor(y / gridSize);

        for (let dc = -alcance; dc <= alcance; dc += 1) {
          for (let dl = -alcance; dl <= alcance; dl += 1) {
            const cx = (colunaCentral + dc) * gridSize;
            const cy = (linhaCentral + dl) * gridSize;
            const distancia = Math.hypot(cx + gridSize / 2 - x, cy + gridSize / 2 - y);
            if (distancia > interactionRadius) continue;

            ctx.globalAlpha = (1 - distancia / interactionRadius) * 0.5;
            ctx.strokeStyle = cores.current.feixe;
            ctx.lineWidth = 1;
            ctx.strokeRect(cx + 0.5, cy + 0.5, gridSize, gridSize);
          }
        }
        ctx.globalAlpha = 1;
      }
    },
    [beamThickness, glow, glowIntensity, gridSize, interactive, interactionRadius],
  );

  const { containerRef, canvasRef } = useArchbaseCanvasAnimation({
    setup: preparar,
    frame: desenharQuadro,
  });

  const registrar = useCallback(
    (node: HTMLDivElement | null) => {
      containerEl.current = node;
      containerRef(node);
    },
    [containerRef],
  );

  const aoMover = useCallback(
    (evento: ReactPointerEvent<HTMLDivElement>) => {
      if (!interactive) return;
      const rect = evento.currentTarget.getBoundingClientRect();
      ponteiro.current = {
        x: evento.clientX - rect.left,
        y: evento.clientY - rect.top,
        dentro: true,
      };
    },
    [interactive],
  );

  const aoSair = useCallback(() => {
    ponteiro.current.dentro = false;
  }, []);

  return (
    <div
      ref={registrar}
      className={className}
      onPointerMove={aoMover}
      onPointerLeave={aoSair}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}
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
