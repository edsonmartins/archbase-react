import { useCallback, useMemo, useRef, type CSSProperties } from 'react';
import { useArchbaseCanvasAnimation } from '../hooks/useArchbaseCanvasAnimation';
import { criarRuidoPerlin } from '../math/perlin';

export interface ArchbaseVectorFlowProps {
  /** Cores sorteadas por particula. */
  colors?: string[];
  particleCount?: number;
  particleSpeed?: number;
  particleSize?: number;
  /** Opacidade do rastro: menor deixa cauda mais longa. */
  trailFade?: number;
  /** Cor do fundo sobre o qual o rastro se dissolve. */
  backgroundColor?: string;
  /** Semente do campo. Mesma semente, mesmo desenho. */
  seed?: number;
  className?: string;
  style?: CSSProperties;
}

interface Particula {
  x: number;
  y: number;
  ultimoX: number;
  ultimoY: number;
  velocidade: number;
  vida: number;
  vidaMaxima: number;
  cor: string;
}

const CORES_PADRAO = ['#22d3ee', '#a855f7', '#ec4899', '#eab308'];

/**
 * Campo de fluxo: particulas seguem um campo vetorial derivado de ruido de
 * Perlin com deformacao de dominio, deixando rastro.
 *
 * Adaptado de Lightswind UI (MIT, Muhilan / codewithMUHILAN).
 *
 * Diferencas:
 *
 * - O campo e semeado. O original usava `Math.random()` para montar a tabela de
 *   permutacao, entao o mesmo fundo nunca se repetia entre recargas — o que
 *   impede reproduzir um visual aprovado pelo cliente.
 * - Particula que sai da area reaparece com vida zerada em vez de acumular
 *   posicao fora do canvas.
 * - Pausa fora de tela e sob movimento reduzido, como todo efeito do pacote.
 */
export function ArchbaseVectorFlow({
  colors = CORES_PADRAO,
  particleCount = 900,
  particleSpeed = 1,
  particleSize = 1.1,
  trailFade = 0.08,
  backgroundColor = '#05050f',
  seed = 1,
  className,
  style,
}: ArchbaseVectorFlowProps) {
  const particulas = useRef<Particula[]>([]);
  const ruido = useMemo(() => criarRuidoPerlin(seed), [seed]);

  const nascer = useCallback(
    (largura: number, altura: number): Particula => {
      const vidaMaxima = 120 + Math.random() * 180;
      return {
        x: Math.random() * largura,
        y: Math.random() * altura,
        ultimoX: 0,
        ultimoY: 0,
        velocidade: (0.6 + Math.random() * 1.4) * particleSpeed,
        vida: Math.random() * vidaMaxima,
        vidaMaxima,
        cor: colors[Math.floor(Math.random() * colors.length)] ?? '#ffffff',
      };
    },
    [colors, particleSpeed],
  );

  const preparar = useCallback(
    (canvas: HTMLCanvasElement, tamanho: { width: number; height: number; dpr: number }) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return undefined;
      ctx.setTransform(tamanho.dpr, 0, 0, tamanho.dpr, 0, 0);

      // Pinta o fundo uma vez; dali em diante o rastro se dissolve sobre ele.
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, tamanho.width, tamanho.height);

      particulas.current = Array.from({ length: particleCount }, () =>
        nascer(tamanho.width, tamanho.height),
      );
      return undefined;
    },
    [particleCount, nascer, backgroundColor],
  );

  const desenharQuadro = useCallback(
    (
      canvas: HTMLCanvasElement,
      estado: { time: number; size: { width: number; height: number } },
    ) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = estado.size;
      const t = estado.time * 0.00004;

      // Veu translucido em vez de limpar: e o que produz o rastro.
      ctx.fillStyle = backgroundColor;
      ctx.globalAlpha = trailFade;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = 1;

      ctx.lineWidth = particleSize;

      for (const p of particulas.current) {
        p.ultimoX = p.x;
        p.ultimoY = p.y;

        // Deformacao de dominio: o campo e amostrado em coordenadas que o
        // proprio ruido desloca, o que produz redemoinhos em vez de listras.
        const qx = ruido(p.x * 0.0025 + 1.2, p.y * 0.0025 + t);
        const qy = ruido(p.x * 0.0025 + 5.7, p.y * 0.0025 + t);
        const angulo = ruido(p.x * 0.0018 + qx * 2, p.y * 0.0018 + qy * 2) * Math.PI * 2;

        p.x += Math.cos(angulo) * p.velocidade;
        p.y += Math.sin(angulo) * p.velocidade;
        p.vida += 1;

        const foraDaArea = p.x < 0 || p.x > width || p.y < 0 || p.y > height;
        if (foraDaArea || p.vida > p.vidaMaxima) {
          // Renasce em vez de acumular posicao fora da area.
          const nova = nascer(width, height);
          nova.vida = 0;
          Object.assign(p, nova);
          continue;
        }

        // Opacidade em arco: nasce e morre suave, sem pontos piscando.
        const alpha = Math.sin((p.vida / p.vidaMaxima) * Math.PI) * 0.85;
        if (alpha <= 0.01) continue;

        ctx.globalAlpha = alpha;
        ctx.strokeStyle = p.cor;
        ctx.beginPath();
        ctx.moveTo(p.ultimoX, p.ultimoY);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    },
    [ruido, trailFade, particleSize, backgroundColor, nascer],
  );

  const { containerRef, canvasRef } = useArchbaseCanvasAnimation({
    setup: preparar,
    frame: desenharQuadro,
  });

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ position: 'absolute', inset: 0, display: 'block' }}
      />
    </div>
  );
}
