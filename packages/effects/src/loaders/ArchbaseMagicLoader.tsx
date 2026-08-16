import { useCallback, useRef, type CSSProperties } from 'react';
import { useArchbaseCanvasAnimation } from '../hooks/useArchbaseCanvasAnimation';

export interface ArchbaseMagicLoaderProps {
  /** Lado do canvas, em pixels. */
  size?: number;
  /** Particulas emitidas por quadro. */
  particleCount?: number;
  /** Multiplicador de velocidade. */
  speed?: number;
  /** Faixa de matiz percorrida, em graus. */
  hueRange?: [number, number];
  /** Rotulo acessivel. */
  label?: string;
  className?: string;
  style?: CSSProperties;
}

interface Particula {
  x: number;
  y: number;
  angulo: number;
  velocidade: number;
  aceleracao: number;
  decaimento: number;
  vida: number;
  raio: number;
}

const TAU = Math.PI * 2;
/** Teto de particulas vivas: sem ele, `speed` baixo acumula sem limite. */
const MAXIMO_PARTICULAS = 600;

/**
 * Indicador de carregamento com rastro de particulas.
 *
 * Adaptado de Lightswind UI (MIT, Muhilan / codewithMUHILAN).
 *
 * Correcoes em relacao ao original:
 *
 * - O original removia particulas com `splice` **durante** o `forEach` que as
 *   percorria, o que desloca os indices e faz o laco pular elementos. Aqui a
 *   varredura e feita para tras, que torna a remocao segura.
 * - O laco continuava agendando quadros mesmo fora de tela; agora ele para.
 * - Sem `prefers-reduced-motion` no original. Aqui, movimento reduzido troca a
 *   animacao por um indicador estatico, sem deixar o usuario sem sinal de que
 *   algo esta carregando.
 * - Sem teto de particulas, um `speed` baixo fazia a lista crescer sem limite.
 */
export function ArchbaseMagicLoader({
  size = 200,
  particleCount = 1,
  speed = 1,
  hueRange = [0, 360],
  label = 'Carregando',
  className,
  style,
}: ArchbaseMagicLoaderProps) {
  const particulas = useRef<Particula[]>([]);
  const tick = useRef(0);
  const rotacao = useRef(0);

  const preparar = useCallback(
    (canvas: HTMLCanvasElement, tamanho: { width: number; height: number; dpr: number }) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return undefined;
      ctx.setTransform(tamanho.dpr, 0, 0, tamanho.dpr, 0, 0);
      // `lighter` faz os rastros somarem luz onde se cruzam.
      ctx.globalCompositeOperation = 'lighter';

      particulas.current = [];
      tick.current = 0;
      rotacao.current = 0;

      // Semeia o anel inicial aqui, e nao so no primeiro quadro. Um indicador
      // de carregamento que leva dezenas de quadros para aparecer nao cumpre a
      // funcao — quem esperava sinal ficou sem sinal justamente no instante em
      // que ele mais importa.
      const centroX = tamanho.width / 2;
      const centroY = tamanho.height / 2;
      const raio = Math.min(tamanho.width, tamanho.height) * 0.25;

      for (let i = 0; i < 24; i += 1) {
        const angulo = (i / 24) * TAU;
        particulas.current.push({
          x: centroX + Math.cos(angulo) * raio,
          y: centroY + Math.sin(angulo) * raio,
          angulo,
          velocidade: 0,
          aceleracao: 0.01,
          decaimento: 0.01,
          vida: 1 - (i / 24) * 0.6,
          raio: 7,
        });
      }
      return undefined;
    },
    [],
  );

  const desenharQuadro = useCallback(
    (canvas: HTMLCanvasElement, estado: { size: { width: number; height: number } }) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = estado.size;
      const centroX = width / 2;
      const centroY = height / 2;
      const raioEmissao = Math.min(width, height) * 0.25;
      const lista = particulas.current;

      if (lista.length < MAXIMO_PARTICULAS) {
        for (let i = 0; i < particleCount; i += 1) {
          lista.push({
            x: centroX + Math.cos(tick.current / 20) * raioEmissao,
            y: centroY + Math.sin(tick.current / 20) * raioEmissao,
            angulo: rotacao.current,
            velocidade: 0,
            aceleracao: 0.01,
            decaimento: 0.01,
            vida: 1,
            raio: 7,
          });
        }
      }

      // Para tras: remover durante varredura crescente desloca os indices
      // seguintes e faz o laco pular particulas — o defeito do original.
      for (let i = lista.length - 1; i >= 0; i -= 1) {
        const p = lista[i];
        if (!p) continue;

        p.velocidade += p.aceleracao;
        p.x += Math.cos(p.angulo) * p.velocidade * speed;
        p.y += Math.sin(p.angulo) * p.velocidade * speed;
        p.angulo += Math.PI / 64;
        p.aceleracao *= 1.01;
        p.vida -= p.decaimento;

        if (p.vida <= 0) lista.splice(i, 1);
      }

      ctx.clearRect(0, 0, width, height);

      const [matizInicial, matizFinal] = hueRange;
      const faixa = Math.max(1, matizFinal - matizInicial);

      for (let i = 0; i < lista.length; i += 1) {
        const p = lista[i];
        if (!p) continue;

        const matiz = matizInicial + ((tick.current + p.vida * 120) % faixa);
        const cor = `hsla(${matiz}, 100%, 60%, ${p.vida})`;
        ctx.fillStyle = cor;
        ctx.strokeStyle = cor;

        const anterior = lista[i - 1];
        if (anterior) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(anterior.x, anterior.y);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.001, p.vida * p.raio), 0, TAU);
        ctx.fill();
      }

      rotacao.current += (Math.PI / 6) * speed;
      tick.current += 1;
    },
    [particleCount, speed, hueRange],
  );

  const { containerRef, canvasRef, reducedMotion } = useArchbaseCanvasAnimation({
    setup: preparar,
    frame: desenharQuadro,
  });

  return (
    <div
      ref={containerRef}
      className={className}
      role="status"
      aria-live="polite"
      aria-label={label}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        ...style,
      }}
    >
      {reducedMotion ? (
        // Movimento reduzido nao pode significar ausencia de sinal: sem a
        // animacao, o usuario ainda precisa saber que algo esta carregando.
        <span style={{ fontSize: 14, opacity: 0.75 }}>{label}…</span>
      ) : (
        // Posicionado como em todo efeito do pacote. Era o unico canvas em
        // fluxo normal, e um canvas dimensionado por JS dentro de um flex
        // container e exatamente o arranjo em que uma diferenca de layout
        // aparece so em certos navegadores.
        <canvas
          ref={canvasRef}
          aria-hidden
          style={{ position: 'absolute', inset: 0, display: 'block' }}
        />
      )}
    </div>
  );
}
