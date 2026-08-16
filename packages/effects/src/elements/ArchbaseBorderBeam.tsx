import { useEffect, type CSSProperties } from 'react';

export interface ArchbaseBorderBeamProps {
  /** Espessura da borda, em pixels. */
  thickness?: number;
  /** Duracao de uma volta completa, em segundos. */
  duration?: number;
  /** Atraso inicial, em segundos. Util para dessincronizar varios cartoes. */
  delay?: number;
  /** Cor onde o feixe comeca. */
  colorFrom?: string;
  /** Cor onde o feixe termina. */
  colorTo?: string;
  /** Fracao da volta ocupada pelo feixe, entre 0 e 1. */
  length?: number;
  /** Inverte o sentido. */
  reverse?: boolean;
  /** Raio da borda. Ausente, herda do elemento pai. */
  radius?: number | string;
  opacity?: number;
  className?: string;
  style?: CSSProperties;
}

const ID_ESTILO = 'archbase-effects-border-beam';

function garantirAnimacao() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(ID_ESTILO)) return;

  const folha = document.createElement('style');
  folha.id = ID_ESTILO;
  // `@property` e o que permite interpolar um angulo: sem registrar o tipo, o
  // navegador trata a custom property como texto e a animacao salta em vez de
  // girar.
  folha.textContent = `
@property --archbase-beam-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
@keyframes archbase-border-beam {
  to { --archbase-beam-angle: 360deg; }
}
@keyframes archbase-border-beam-reverse {
  to { --archbase-beam-angle: -360deg; }
}
@media (prefers-reduced-motion: reduce) {
  .archbase-border-beam { animation: none !important; }
}`;
  document.head.appendChild(folha);
}

/**
 * Feixe de luz percorrendo a borda do elemento pai.
 *
 * Adaptado de Lightswind UI (MIT, Muhilan / codewithMUHILAN). O pai precisa ter
 * `position: relative`.
 *
 * Reimplementado com gradiente conico e mascara, em vez de `offset-path:
 * rect()` animado por framer-motion. Tres razoes:
 *
 * - E puro CSS: nao consome quadro de JavaScript nem depende de biblioteca de
 *   animacao.
 * - `offset-path: rect()` e recente e ainda tem suporte irregular fora do
 *   Chrome; gradiente conico com mascara funciona ha bem mais tempo.
 * - `prefers-reduced-motion` passa a ser tratado por midia, como nos demais
 *   efeitos em CSS deste pacote.
 *
 * Duas props do original saem por nao terem efeito la: `pauseOnHover` aplicava
 * a classe `group-hover:animation-play-state-paused`, que nao existe no
 * Tailwind, e `borderThickness` era declarada com o estilo que a usaria
 * comentado no fonte. Aqui `thickness` funciona de verdade.
 */
export function ArchbaseBorderBeam({
  thickness = 2,
  duration = 6,
  delay = 0,
  colorFrom = '#7400ff',
  colorTo = '#9b41ff',
  length = 0.25,
  reverse = false,
  radius = 'inherit',
  opacity = 1,
  className,
  style,
}: ArchbaseBorderBeamProps) {
  useEffect(() => {
    garantirAnimacao();
  }, []);

  const fim = Math.max(0.02, Math.min(1, length));

  return (
    <span
      aria-hidden
      className={`archbase-border-beam${className ? ` ${className}` : ''}`}
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: radius,
        padding: thickness,
        opacity,
        pointerEvents: 'none',
        background: `conic-gradient(from var(--archbase-beam-angle), transparent 0%, ${colorFrom} ${fim * 40}%, ${colorTo} ${fim * 100}%, transparent ${fim * 100 + 1}%)`,
        // A mascara recorta o miolo e deixa so o anel: e o que transforma o
        // gradiente inteiro numa borda.
        mask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
        WebkitMask: 'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
        maskComposite: 'exclude',
        WebkitMaskComposite: 'xor',
        animation: `${reverse ? 'archbase-border-beam-reverse' : 'archbase-border-beam'} ${duration}s linear infinite`,
        animationDelay: `${-delay}s`,
        ...style,
      }}
    />
  );
}
