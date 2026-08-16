import {
  useCallback,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react';
import { useArchbaseCanvasAnimation } from '../hooks/useArchbaseCanvasAnimation';

export interface ArchbaseStardustButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  /** Paleta das particulas. */
  colors?: string[];
  /** Particulas em repouso. Ao passar o ponteiro, triplica. */
  particleCount?: number;
  particleSpeed?: number;
}

interface Particula {
  x: number;
  y: number;
  vx: number;
  vy: number;
  tamanho: number;
  vida: number;
  cor: string;
}

const CORES_PADRAO = ['#a78bfa', '#22d3ee', '#f472b6', '#fbbf24'];
const TAU = Math.PI * 2;

/**
 * Botao com poeira estelar. As particulas nascem nas bordas e sao atraidas
 * para dentro; passar o ponteiro intensifica a emissao.
 *
 * Adaptado de Lightswind UI (MIT, Muhilan / codewithMUHILAN).
 *
 * Diferencas:
 *
 * - O original emitia particulas continuamente, mesmo com o botao parado e o
 *   ponteiro longe. Aqui a emissao em repouso e reduzida e o laco respeita as
 *   mesmas regras de pausa do resto do pacote.
 * - E um `<button>` de verdade: recebe foco, dispara por teclado e repassa
 *   todos os atributos. O original renderizava efeito sobre um elemento que
 *   nao participava da navegacao por teclado.
 * - Sob movimento reduzido, o botao continua inteiramente funcional — apenas
 *   sem particulas.
 */
export function ArchbaseStardustButton({
  children,
  colors = CORES_PADRAO,
  particleCount = 18,
  particleSpeed = 1,
  onPointerEnter,
  onPointerLeave,
  style,
  ...resto
}: ArchbaseStardustButtonProps) {
  const particulas = useRef<Particula[]>([]);
  const sobreposto = useRef(false);
  const [focado, setFocado] = useState(false);

  const preparar = useCallback((canvas: HTMLCanvasElement, tamanho: { dpr: number }) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    ctx.setTransform(tamanho.dpr, 0, 0, tamanho.dpr, 0, 0);
    particulas.current = [];
    return undefined;
  }, []);

  const desenharQuadro = useCallback(
    (canvas: HTMLCanvasElement, estado: { size: { width: number; height: number } }) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = estado.size;
      ctx.clearRect(0, 0, width, height);

      const ativo = sobreposto.current || focado;
      const alvo = ativo ? particleCount : Math.ceil(particleCount / 3);

      while (particulas.current.length < alvo) {
        // Nascem na borda, com direcao para dentro.
        const angulo = Math.random() * TAU;
        const velocidade = (0.2 + Math.random() * 0.7) * particleSpeed;
        particulas.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angulo) * velocidade,
          vy: Math.sin(angulo) * velocidade,
          tamanho: 0.6 + Math.random() * 1.6,
          vida: 1,
          cor: colors[Math.floor(Math.random() * colors.length)] ?? '#ffffff',
        });
      }

      for (let i = particulas.current.length - 1; i >= 0; i -= 1) {
        const p = particulas.current[i];
        if (!p) continue;

        p.x += p.vx;
        p.y += p.vy;
        p.vida -= ativo ? 0.008 : 0.016;

        const fora = p.x < 0 || p.x > width || p.y < 0 || p.y > height;
        if (p.vida <= 0 || fora) {
          particulas.current.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.vida * (ativo ? 0.9 : 0.45);
        ctx.fillStyle = p.cor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.tamanho, 0, TAU);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    },
    [colors, particleCount, particleSpeed, focado],
  );

  const { containerRef, canvasRef, reducedMotion } = useArchbaseCanvasAnimation({
    setup: preparar,
    frame: desenharQuadro,
  });

  return (
    <button
      {...resto}
      ref={containerRef as unknown as (node: HTMLButtonElement | null) => void}
      onPointerEnter={(e) => {
        sobreposto.current = true;
        onPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        sobreposto.current = false;
        onPointerLeave?.(e);
      }}
      onFocus={() => setFocado(true)}
      onBlur={() => setFocado(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        border: 'none',
        borderRadius: 10,
        padding: '10px 22px',
        color: '#fff',
        background: 'linear-gradient(135deg, #4c1d95, #1e1b4b)',
        font: 'inherit',
        fontWeight: 600,
        ...style,
      }}
    >
      {!reducedMotion && (
        <canvas
          ref={canvasRef}
          aria-hidden
          style={{ position: 'absolute', inset: 0, display: 'block', pointerEvents: 'none' }}
        />
      )}
      <span style={{ position: 'relative', zIndex: 1 }}>{children}</span>
    </button>
  );
}
