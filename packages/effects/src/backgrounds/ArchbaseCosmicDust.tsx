import { useCallback, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { useArchbaseCanvasAnimation } from '../hooks/useArchbaseCanvasAnimation';
import { readColorScheme } from '../theme/resolveColors';

export interface ArchbaseCosmicDustProps {
  /** Quantidade de particulas em cena. */
  particleCount?: number;
  /** Multiplicador de velocidade. */
  speedMultiplier?: number;
  /** Tamanho base da particula. */
  particleSize?: number;
  /** Paleta explicita. Ausente, decide pelo esquema de cor do tema. */
  colors?: string[];
  /** Reage ao ponteiro sobre o proprio elemento. */
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

interface Particula {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tamanho: number;
  cor: string;
  opacidade: number;
  rastro: number[];
}

const PALETA_ESCURA = ['34,211,238', '168,85,247', '236,72,153', '234,179,8'];
const PALETA_CLARA = ['99,102,241', '139,92,246', '244,63,94', '16,185,129'];

const RAIO_INFLUENCIA = 180;
const TAMANHO_RASTRO = 6;

/**
 * Poeira cosmica: particulas em deriva que orbitam o ponteiro.
 *
 * Adaptado de Lightswind UI (MIT, Muhilan / codewithMUHILAN).
 *
 * Correcoes em relacao ao original:
 *
 * - O ponteiro era ouvido em `window`, o que fazia um fundo de 300px reagir a
 *   movimento em qualquer canto da pagina e processar eventos que nao lhe
 *   diziam respeito. Agora o listener e do proprio elemento.
 * - Quando o ponteiro caia exatamente sobre uma particula, `dx / dist` dividia
 *   por zero e a posicao virava `NaN` — a particula desaparecia em definitivo.
 * - O rastro era um array de objetos `{x, y}` recriado a cada quadro; virou um
 *   buffer plano reaproveitado, sem alocacao por quadro.
 * - Tema detectado por `data-mantine-color-scheme`, nao por classe `dark`.
 */
export function ArchbaseCosmicDust({
  particleCount = 120,
  speedMultiplier = 1,
  particleSize = 1.5,
  colors,
  interactive = true,
  className,
  style,
  children,
}: ArchbaseCosmicDustProps) {
  const particulas = useRef<Particula[]>([]);
  const ponteiro = useRef({ x: 0, y: 0, alvoX: 0, alvoY: 0, moveu: false });
  const containerEl = useRef<HTMLDivElement | null>(null);
  const paleta = useRef<string[]>(PALETA_ESCURA);

  const criarParticula = useCallback(
    (largura: number, altura: number, aleatorio: boolean): Particula => {
      const lista = paleta.current;
      const cor = lista[Math.floor(Math.random() * lista.length)] ?? '255,255,255';
      return {
        x: Math.random() * largura,
        y: aleatorio ? Math.random() * altura : altura + 10,
        vx: (Math.random() - 0.5) * 1.2 * speedMultiplier,
        vy: (-Math.random() - 0.2) * 1.5 * speedMultiplier,
        tamanho: (Math.random() * 0.8 + 0.6) * particleSize,
        cor,
        opacidade: Math.random() * 0.4 + 0.4,
        rastro: [],
      };
    },
    [speedMultiplier, particleSize],
  );

  const preparar = useCallback(
    (canvas: HTMLCanvasElement, tamanho: { width: number; height: number; dpr: number }) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return undefined;
      ctx.setTransform(tamanho.dpr, 0, 0, tamanho.dpr, 0, 0);

      paleta.current =
        colors ?? (readColorScheme(containerEl.current) === 'dark' ? PALETA_ESCURA : PALETA_CLARA);

      particulas.current = Array.from({ length: particleCount }, () =>
        criarParticula(tamanho.width, tamanho.height, true),
      );

      ponteiro.current.alvoX = tamanho.width / 2;
      ponteiro.current.alvoY = tamanho.height / 2;
      ponteiro.current.x = ponteiro.current.alvoX;
      ponteiro.current.y = ponteiro.current.alvoY;
      return undefined;
    },
    [colors, particleCount, criarParticula],
  );

  const desenharQuadro = useCallback(
    (
      canvas: HTMLCanvasElement,
      estado: { time: number; size: { width: number; height: number } },
    ) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = estado.size;
      const t = estado.time;
      ctx.clearRect(0, 0, width, height);

      // Sem interacao do usuario, o foco orbita o centro — a cena continua viva
      // sem exigir que alguem mexa o mouse.
      if (!ponteiro.current.moveu) {
        const raio = Math.min(width, height) * 0.15;
        ponteiro.current.alvoX = width / 2 + Math.cos(t * 0.001) * raio;
        ponteiro.current.alvoY = height / 2 + Math.sin(t * 0.001) * raio;
      }

      ponteiro.current.x += (ponteiro.current.alvoX - ponteiro.current.x) * 0.08;
      ponteiro.current.y += (ponteiro.current.alvoY - ponteiro.current.y) * 0.08;

      const mx = ponteiro.current.x;
      const my = ponteiro.current.y;
      const lista = particulas.current;

      for (let indice = 0; indice < lista.length; indice += 1) {
        const p = lista[indice];
        if (!p) continue;

        p.vx += Math.sin(t * 0.002 + indice) * 0.02 * speedMultiplier;

        const dx = mx - p.x;
        const dy = my - p.y;
        const distancia = Math.hypot(dx, dy);

        // O guarda de distancia zero e o que impede a divisao por zero que, no
        // original, transformava a posicao em NaN e apagava a particula.
        if (distancia > 0.001 && distancia < RAIO_INFLUENCIA) {
          const forca = (1 - distancia / RAIO_INFLUENCIA) * 0.8 * speedMultiplier;
          p.vx += (dx / distancia) * forca * 0.04;
          p.vy += (dy / distancia) * forca * 0.04;
          // Componente tangencial: produz o giro em torno do ponteiro.
          p.vx += (-dy / distancia) * forca * 0.18;
          p.vy += (dx / distancia) * forca * 0.18;
        }

        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x += p.vx;
        p.y += p.vy;

        p.rastro.push(p.x, p.y);
        if (p.rastro.length > TAMANHO_RASTRO * 2) p.rastro.splice(0, 2);

        if (p.y < -10 || p.x < -10 || p.x > width + 10) {
          lista[indice] = criarParticula(width, height, false);
          continue;
        }

        if (p.rastro.length >= 4) {
          ctx.beginPath();
          ctx.moveTo(p.rastro[0] ?? 0, p.rastro[1] ?? 0);
          for (let i = 2; i < p.rastro.length; i += 2) {
            ctx.lineTo(p.rastro[i] ?? 0, p.rastro[i + 1] ?? 0);
          }
          ctx.strokeStyle = `rgba(${p.cor}, ${p.opacidade * 0.25})`;
          ctx.lineWidth = p.tamanho * 0.6;
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.tamanho, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.cor}, ${p.opacidade})`;
        ctx.fill();
      }
    },
    [speedMultiplier, criarParticula],
  );

  const { containerRef, canvasRef } = useArchbaseCanvasAnimation({
    setup: preparar,
    frame: desenharQuadro,
  });

  const registrarContainer = useCallback(
    (node: HTMLDivElement | null) => {
      containerEl.current = node;
      containerRef(node);
    },
    [containerRef],
  );

  const aoMoverPonteiro = useCallback(
    (evento: ReactPointerEvent<HTMLDivElement>) => {
      if (!interactive) return;
      const rect = evento.currentTarget.getBoundingClientRect();
      ponteiro.current.alvoX = evento.clientX - rect.left;
      ponteiro.current.alvoY = evento.clientY - rect.top;
      ponteiro.current.moveu = true;
    },
    [interactive],
  );

  const aoSairPonteiro = useCallback(() => {
    // Devolve o controle a orbita automatica quando o ponteiro sai.
    ponteiro.current.moveu = false;
  }, []);

  return (
    <div
      ref={registrarContainer}
      className={className}
      onPointerMove={aoMoverPonteiro}
      onPointerLeave={aoSairPonteiro}
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
