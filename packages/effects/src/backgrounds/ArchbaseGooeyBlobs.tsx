import { useEffect, useId, type CSSProperties, type ReactNode } from 'react';

export interface ArchbaseGooeyBlobsProps {
  children?: ReactNode;
  /** Cores das bolhas. A quantidade de bolhas segue a quantidade de cores. */
  colors?: string[];
  /** Diametro base, em pixels. Cada bolha varia em torno dele. */
  size?: number;
  /** Duracao do ciclo mais lento, em segundos. */
  duration?: number;
  /**
   * Intensidade da fusao. Valores altos derretem as bolhas umas nas outras;
   * zero as deixa separadas.
   */
  gooeyness?: number;
  /** Desfoque aplicado antes da fusao. */
  blur?: number;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
}

const CORES_PADRAO = ['#7c3aed', '#2563eb', '#db2777'];
const ID_ESTILO = 'archbase-effects-gooey';

function garantirAnimacao() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(ID_ESTILO)) return;

  const folha = document.createElement('style');
  folha.id = ID_ESTILO;
  // Tres trajetorias distintas: bolhas com o mesmo caminho denunciam a
  // repeticao e o efeito perde o ar organico.
  folha.textContent = `
@keyframes archbase-gooey-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%      { transform: translate(30px, -18px) scale(1.12); }
  66%      { transform: translate(-16px, 22px) scale(0.9); }
}
@keyframes archbase-gooey-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%      { transform: translate(-26px, 20px) scale(0.88); }
  66%      { transform: translate(22px, -16px) scale(1.16); }
}
@keyframes archbase-gooey-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%      { transform: translate(16px, 26px) scale(1.1); }
  66%      { transform: translate(-32px, -12px) scale(0.85); }
}
@media (prefers-reduced-motion: reduce) {
  .archbase-gooey-blob { animation: none !important; }
}`;
  document.head.appendChild(folha);
}

/**
 * Bolhas que se fundem — o efeito "gooey".
 *
 * Reconstruido a partir da tecnica usada em Lightswind UI (MIT, Muhilan /
 * codewithMUHILAN), onde ela aparecia embutida num botao. Aqui e um fundo
 * reutilizavel.
 *
 * A fusao vem de um filtro SVG: desfoca, aumenta o contraste do canal alfa e
 * recompoe. Formas que apenas se aproximam passam a se derreter uma na outra —
 * nao ha calculo de fisica, e nenhum quadro de JavaScript e consumido.
 *
 * O identificador do filtro sai de `useId`, e nao de um contador global ou de
 * `Math.random()`: duas instancias na mesma pagina precisam de filtros
 * distintos, e valor aleatorio pode divergir entre servidor e cliente.
 */
export function ArchbaseGooeyBlobs({
  children,
  colors = CORES_PADRAO,
  size = 180,
  duration = 9,
  gooeyness = 18,
  blur = 12,
  opacity = 0.85,
  className,
  style,
}: ArchbaseGooeyBlobsProps) {
  const idBruto = useId();
  const filtroId = `archbase-gooey-${idBruto.replace(/:/g, '')}`;

  useEffect(() => {
    garantirAnimacao();
  }, []);

  const paleta = colors.length > 0 ? colors : CORES_PADRAO;

  return (
    <div
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}
    >
      <svg aria-hidden width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id={filtroId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="desfoque" />
            {/* A matriz espreme o canal alfa: o meio-termo do desfoque some e
                as bordas se encontram, produzindo a fusao. */}
            <feColorMatrix
              in="desfoque"
              mode="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${gooeyness} -${gooeyness / 2}`}
              result="fusao"
            />
            <feBlend in="SourceGraphic" in2="fusao" />
          </filter>
        </defs>
      </svg>

      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity,
          filter: `url(#${filtroId})`,
        }}
      >
        {paleta.map((cor, indice) => {
          const variacao = 1 - (indice % 3) * 0.15;
          return (
            <span
              key={`${cor}-${indice}`}
              className="archbase-gooey-blob"
              style={{
                position: 'absolute',
                width: size * variacao,
                height: size * variacao,
                borderRadius: '50%',
                background: cor,
                // Distribuicao em torno do centro, sem sobrepor exatamente.
                left: `${28 + (indice % 3) * 22}%`,
                top: `${30 + ((indice + 1) % 3) * 18}%`,
                animation: `archbase-gooey-${(indice % 3) + 1} ${duration + indice}s ease-in-out infinite`,
                animationDelay: `${indice * 0.8}s`,
              }}
            />
          );
        })}
      </div>

      {children ? (
        <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
