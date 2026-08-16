import { useCallback, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { useArchbaseCanvasAnimation } from '../hooks/useArchbaseCanvasAnimation';
import { readColorScheme } from '../theme/resolveColors';

export interface ArchbaseNeuralLinkProps {
  nodeColor?: string;
  lineColor?: string;
  packetColor?: string;
  /** Quantidade de nos. O custo cresce ao quadrado — veja a nota abaixo. */
  nodeCount?: number;
  /** Distancia maxima para ligar dois nos, em pixels. */
  maxDistance?: number;
  /** Intervalo medio entre pacotes, em milissegundos. Zero desliga. */
  packetInterval?: number;
  /** Nos sao atraidos pelo ponteiro. */
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

interface No {
  x: number;
  y: number;
  vx: number;
  vy: number;
  raio: number;
  pulso: number;
}

interface Pacote {
  origem: number;
  destino: number;
  progresso: number;
  velocidade: number;
}

const TAU = Math.PI * 2;
/**
 * Teto de nos. A deteccao de vizinhanca e O(n²): 200 nos ja sao 19.900
 * distancias por quadro, e a partir dai o efeito come o orcamento de quadro
 * inteiro. O original nao tinha limite.
 */
const MAXIMO_NOS = 200;

/**
 * Malha neural: nos flutuantes que se ligam quando proximos, com pacotes
 * viajando pelas ligacoes.
 *
 * Adaptado de Lightswind UI (MIT, Muhilan / codewithMUHILAN).
 *
 * Diferencas:
 *
 * - `nodeCount` tem teto. O custo da vizinhanca cresce ao quadrado, e sem
 *   limite bastava um numero distraido na prop para derrubar a taxa de quadros.
 * - Pacote cujo no de destino saiu do alcance e descartado, em vez de continuar
 *   viajando para uma ligacao que nao existe mais.
 * - Ponteiro ouvido no proprio elemento; tema por custom property.
 */
export function ArchbaseNeuralLink({
  nodeColor,
  lineColor,
  packetColor,
  nodeCount = 70,
  maxDistance = 110,
  packetInterval = 900,
  interactive = true,
  className,
  style,
  children,
}: ArchbaseNeuralLinkProps) {
  const nos = useRef<No[]>([]);
  const pacotes = useRef<Pacote[]>([]);
  const proximoPacote = useRef(0);
  const ponteiro = useRef({ x: -9999, y: -9999, dentro: false });
  const containerEl = useRef<HTMLDivElement | null>(null);
  const cores = useRef({ no: '#a5b4fc', linha: '#6366f1', pacote: '#22d3ee' });

  const preparar = useCallback(
    (canvas: HTMLCanvasElement, tamanho: { width: number; height: number; dpr: number }) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return undefined;
      ctx.setTransform(tamanho.dpr, 0, 0, tamanho.dpr, 0, 0);

      const escuro = readColorScheme(containerEl.current) === 'dark';
      cores.current = {
        no: nodeColor ?? (escuro ? '#a5b4fc' : '#4f46e5'),
        linha: lineColor ?? (escuro ? '#6366f1' : '#818cf8'),
        pacote: packetColor ?? '#22d3ee',
      };

      const quantidade = Math.min(MAXIMO_NOS, Math.max(2, nodeCount));
      nos.current = Array.from({ length: quantidade }, () => ({
        x: Math.random() * tamanho.width,
        y: Math.random() * tamanho.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        raio: 1.4 + Math.random() * 1.8,
        pulso: 1,
      }));
      pacotes.current = [];
      proximoPacote.current = 0;
      return undefined;
    },
    [nodeColor, lineColor, packetColor, nodeCount],
  );

  const desenharQuadro = useCallback(
    (
      canvas: HTMLCanvasElement,
      estado: { time: number; size: { width: number; height: number } },
    ) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = estado.size;
      ctx.clearRect(0, 0, width, height);

      const lista = nos.current;
      const { x: mx, y: my, dentro } = ponteiro.current;

      for (const n of lista) {
        n.x += n.vx;
        n.y += n.vy;

        // Rebate nas bordas em vez de reaparecer do outro lado: a malha fica
        // coesa, sem ligacao atravessando a tela inteira.
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.min(width, Math.max(0, n.x));
        n.y = Math.min(height, Math.max(0, n.y));

        if (interactive && dentro) {
          const dx = mx - n.x;
          const dy = my - n.y;
          const distancia = Math.hypot(dx, dy);
          if (distancia > 0.001 && distancia < maxDistance * 1.6) {
            const forca = (1 - distancia / (maxDistance * 1.6)) * 0.02;
            n.vx += (dx / distancia) * forca;
            n.vy += (dy / distancia) * forca;
          }
        }

        // Atrito impede que a atracao acumule velocidade sem limite.
        n.vx *= 0.995;
        n.vy *= 0.995;
        n.pulso += (1 - n.pulso) * 0.08;
      }

      // Ligacoes. O laco e triangular (j > i) para nao medir cada par duas vezes.
      ctx.lineWidth = 1;
      for (let i = 0; i < lista.length; i += 1) {
        const a = lista[i];
        if (!a) continue;
        for (let j = i + 1; j < lista.length; j += 1) {
          const b = lista[j];
          if (!b) continue;

          const distancia = Math.hypot(b.x - a.x, b.y - a.y);
          if (distancia >= maxDistance) continue;

          ctx.globalAlpha = (1 - distancia / maxDistance) * 0.35;
          ctx.strokeStyle = cores.current.linha;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Pacotes.
      if (packetInterval > 0 && estado.time > proximoPacote.current && lista.length > 1) {
        const origem = Math.floor(Math.random() * lista.length);
        const destino = Math.floor(Math.random() * lista.length);
        if (origem !== destino) {
          pacotes.current.push({ origem, destino, progresso: 0, velocidade: 0.012 });
          const no = lista[origem];
          if (no) no.pulso = 2.5;
        }
        proximoPacote.current = estado.time + packetInterval * (0.5 + Math.random());
      }

      ctx.globalAlpha = 1;
      for (let i = pacotes.current.length - 1; i >= 0; i -= 1) {
        const p = pacotes.current[i];
        if (!p) continue;

        const a = lista[p.origem];
        const b = lista[p.destino];
        // Ligacao desfeita durante o trajeto: o pacote e descartado em vez de
        // continuar viajando por uma aresta que nao existe mais.
        if (!a || !b || Math.hypot(b.x - a.x, b.y - a.y) >= maxDistance) {
          pacotes.current.splice(i, 1);
          continue;
        }

        p.progresso += p.velocidade;
        if (p.progresso >= 1) {
          b.pulso = 2.5;
          pacotes.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = cores.current.pacote;
        ctx.beginPath();
        ctx.arc(a.x + (b.x - a.x) * p.progresso, a.y + (b.y - a.y) * p.progresso, 2, 0, TAU);
        ctx.fill();
      }

      // Nos por ultimo, para ficarem acima das linhas.
      ctx.fillStyle = cores.current.no;
      for (const n of lista) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.raio * n.pulso, 0, TAU);
        ctx.fill();
      }
    },
    [interactive, maxDistance, packetInterval],
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
