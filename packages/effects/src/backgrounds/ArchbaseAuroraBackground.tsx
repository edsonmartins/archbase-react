import { useEffect, useMemo, type CSSProperties, type ReactNode } from 'react';
import { readColorScheme } from '../theme/resolveColors';

export interface ArchbaseAuroraBackgroundProps {
  children?: ReactNode;
  /** Cores das faixas da aurora. */
  colors?: string[];
  /** Duracao de um ciclo completo, em segundos. */
  duration?: number;
  /** Desfoque das faixas, em pixels. Menor deixa o listrado aparente. */
  blur?: number;
  /** Opacidade da camada. */
  opacity?: number;
  /** Esmaece as bordas, para a aurora nao terminar em linha reta. */
  fadeEdges?: boolean;
  className?: string;
  style?: CSSProperties;
}

const CORES_PADRAO = ['#3b82f6', '#a5b4fc', '#93c5fd', '#c4b5fd', '#60a5fa'];
const ID_ESTILO = 'archbase-effects-aurora';

/**
 * Injeta a animacao uma unica vez no documento.
 *
 * O pacote nao tem etapa de CSS — e uma biblioteca de efeitos com zero
 * dependencia, e acrescentar um pipeline de estilo para um `@keyframes` seria
 * desproporcional. A folha e idempotente: varias instancias compartilham a
 * mesma regra.
 */
function garantirAnimacao() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(ID_ESTILO)) return;

  const folha = document.createElement('style');
  folha.id = ID_ESTILO;
  folha.textContent = `
@keyframes archbase-aurora {
  from { background-position: 50% 50%, 50% 50%; }
  to   { background-position: 350% 50%, 350% 50%; }
}
@media (prefers-reduced-motion: reduce) {
  .archbase-aurora-layer { animation: none !important; }
}`;
  document.head.appendChild(folha);
}

/**
 * Aurora: faixas de cor que deslizam devagar atras do conteudo.
 *
 * Inspirado no `aurora-background` de Lightswind UI (MIT, Muhilan /
 * codewithMUHILAN). Nao e porte linha a linha: o original era inteiramente
 * classes utilitarias do Tailwind com valores arbitrarios, entao aqui o efeito
 * foi reconstruido em CSS proprio.
 *
 * E puro CSS — nao consome quadro de JavaScript, ao contrario dos fundos em
 * canvas deste pacote. Sob `prefers-reduced-motion` a animacao e removida e as
 * faixas ficam paradas, preservando o desenho.
 */
export function ArchbaseAuroraBackground({
  children,
  colors = CORES_PADRAO,
  duration = 60,
  blur = 10,
  opacity = 0.5,
  fadeEdges = true,
  className,
  style,
}: ArchbaseAuroraBackgroundProps) {
  useEffect(() => {
    garantirAnimacao();
  }, []);

  const gradiente = useMemo(() => {
    const paleta = colors.length > 0 ? colors : CORES_PADRAO;
    // Faixas repetidas em angulo: o deslocamento do `background-position` faz
    // a leitura de movimento, sem mover elemento algum.
    const paradas = paleta
      .map((cor, indice) => `${cor} ${10 + indice * 5}%`)
      .join(', ');
    return `repeating-linear-gradient(100deg, ${paradas})`;
  }, [colors]);

  const veu = useMemo(() => {
    const escuro = typeof document !== 'undefined' && readColorScheme(null) === 'dark';
    const base = escuro ? '#000' : '#fff';
    return `repeating-linear-gradient(100deg, ${base} 0%, ${base} 7%, transparent 10%, transparent 12%, ${base} 16%)`;
  }, []);

  return (
    <div
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}
    >
      <div
        aria-hidden
        className="archbase-aurora-layer"
        style={{
          position: 'absolute',
          inset: -10,
          pointerEvents: 'none',
          opacity,
          filter: `blur(${blur}px)`,
          backgroundImage: `${veu}, ${gradiente}`,
          backgroundSize: '300%, 200%',
          backgroundPosition: '50% 50%, 50% 50%',
          // A regra de movimento reduzido vive na folha injetada, alcancando
          // esta camada pela classe: o navegador aplica a preferencia sem o
          // componente precisar observar nada.
          animation: `archbase-aurora ${duration}s linear infinite`,
          maskImage: fadeEdges
            ? 'radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)'
            : undefined,
          WebkitMaskImage: fadeEdges
            ? 'radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)'
            : undefined,
        }}
      />

      {children ? (
        <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
