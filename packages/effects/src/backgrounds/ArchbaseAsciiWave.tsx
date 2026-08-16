import { useCallback, useRef, type CSSProperties } from 'react';
import { useArchbaseCanvasAnimation } from '../hooks/useArchbaseCanvasAnimation';
import { readCssVariable } from '../theme/resolveColors';

export interface ArchbaseAsciiWaveProps {
  /** Cor dos caracteres. Ausente, usa a cor primaria do tema. */
  color?: string;
  speed?: number;
  /** Corpo da fonte monoespacada, em pixels. */
  fontSize?: number;
  /** Largura da coluna. Menor adensa o desenho e custa mais. */
  columnWidth?: number;
  /** Rampa de densidade, do mais claro ao mais denso. */
  ramp?: string;
  /** Probabilidade de buraco por celula, entre 0 e 1. */
  dropoutChance?: number;
  className?: string;
  style?: CSSProperties;
}

const RAMPA_PADRAO = ' .:+x*#';

/**
 * Onda em ASCII: colunas de caracteres cuja altura pulsa e cujo conteudo
 * escorre para cima, como chama.
 *
 * Adaptado de Lightswind UI (MIT, Muhilan / codewithMUHILAN).
 *
 * Correcoes em relacao ao original:
 *
 * - O original importava `useTheme` de `next-themes`, o que amarrava o efeito
 *   ao Next.js. Aqui a cor sai de custom property, sem dependencia.
 * - O tempo avancava `+= 16` por quadro, presumindo 60 Hz. Em tela de 120 Hz a
 *   animacao rodava ao dobro da velocidade, e em maquina sobrecarregada, em
 *   camera lenta. Agora avanca pelo tempo real decorrido.
 * - Pausa fora de tela e sob movimento reduzido.
 */
export function ArchbaseAsciiWave({
  color,
  speed = 1,
  fontSize = 12,
  columnWidth = 10,
  ramp = RAMPA_PADRAO,
  dropoutChance = 0.05,
  className,
  style,
}: ArchbaseAsciiWaveProps) {
  const corResolvida = useRef('#ff4500');
  const containerEl = useRef<HTMLDivElement | null>(null);

  const preparar = useCallback(
    (canvas: HTMLCanvasElement, tamanho: { dpr: number }) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return undefined;
      ctx.setTransform(tamanho.dpr, 0, 0, tamanho.dpr, 0, 0);
      ctx.textBaseline = 'top';

      corResolvida.current =
        color ??
        readCssVariable(containerEl.current, '--mantine-primary-color-filled', '#ff4500');
      return undefined;
    },
    [color],
  );

  const desenharQuadro = useCallback(
    (
      canvas: HTMLCanvasElement,
      estado: { time: number; size: { width: number; height: number } },
    ) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height } = estado.size;
      // Tempo real, nao contagem de quadros: o desenho fica igual a 60 e a
      // 120 Hz, que era o que o incremento fixo do original quebrava.
      const t = estado.time;

      ctx.clearRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = corResolvida.current;

      const colunas = Math.ceil(width / columnWidth);
      const linhas = Math.ceil(height / fontSize);
      const caracteres = ramp.split('');

      for (let x = 0; x < colunas; x += 1) {
        // Geometria fixa: a montanha nao viaja, so a amplitude respira. Somar
        // tempo aqui produziria onda deslizando de lado, que nao e o efeito.
        const forma = Math.sin(x * 0.1) * 0.6 + Math.cos(x * 0.25) * 0.4;
        const respiro = Math.sin(t * 0.002 * speed) * 0.1;
        const tremor = Math.sin(t * 0.008 * speed + x * 100) * 0.05;

        const altura = Math.max(0.15, ((forma + respiro + tremor + 1) / 2) * 0.6 + 0.15);
        const linhasAtivas = Math.floor(altura * linhas);

        for (let y = linhas - 1; y > linhas - linhasAtivas; y -= 1) {
          if (Math.random() < dropoutChance) continue;

          // O deslocamento entra so no tempo: o conteudo sobe sem arrastar de
          // lado. `x * 10` e apenas semente por coluna.
          const fluxo = t * 0.005 * speed;
          const ruido = Math.sin(y * 0.2 - fluxo + x * 10);

          const distanciaDoTopo = y - (linhas - linhasAtivas);
          const esmaecimento = Math.min(1, distanciaDoTopo / 6);

          const indice = Math.floor(((ruido + 1) / 2) * caracteres.length);
          const caractere = caracteres[Math.min(indice, caracteres.length - 1)] ?? ' ';

          ctx.globalAlpha = esmaecimento;
          ctx.fillText(caractere, x * columnWidth, y * fontSize);
        }
      }

      ctx.globalAlpha = 1;
    },
    [fontSize, columnWidth, ramp, speed, dropoutChance],
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

  return (
    <div
      ref={registrar}
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
