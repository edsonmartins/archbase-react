import { useEffect, useId, useState, type CSSProperties, type ReactNode } from 'react';

export interface ArchbaseElectroBorderProps {
  children?: ReactNode;
  /** Cor da borda e do halo. */
  color?: string;
  /** Espessura da borda, em pixels. */
  borderWidth?: number;
  /** Intensidade da distorcao. Zero deixa a borda reta. */
  distortion?: number;
  /** Multiplicador de velocidade da animacao. */
  speed?: number;
  radius?: number | string;
  /** Halo externo. */
  glow?: boolean;
  glowBlur?: number;
  className?: string;
  style?: CSSProperties;
}

function prefereMenosMovimento(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Borda eletrica: contorno distorcido por turbulencia, util para destacar um
 * cartao ou um alerta sem recorrer a cor chapada.
 *
 * Adaptado de Lightswind UI (MIT, Muhilan / codewithMUHILAN).
 *
 * Unico efeito do pacote que nao usa canvas: e filtro SVG
 * (`feTurbulence` + `feDisplacementMap`) animado por SMIL. Nao consome quadro
 * de JavaScript — o navegador anima no compositor.
 *
 * Diferencas:
 *
 * - O original animava por SMIL sem consultar `prefers-reduced-motion`, e SMIL
 *   ignora a preferencia por conta propria. Aqui a animacao e removida do DOM
 *   quando o usuario pediu menos movimento; a borda permanece, estatica.
 * - O identificador do filtro vem de `useId`, nao de `Math.random()`. Com
 *   identificador aleatorio, duas instancias podiam colidir apos hidratacao e
 *   uma delas ficava sem filtro.
 */
export function ArchbaseElectroBorder({
  children,
  color = '#7c3aed',
  borderWidth = 2,
  distortion = 24,
  speed = 1,
  radius = 12,
  glow = true,
  glowBlur = 14,
  className,
  style,
}: ArchbaseElectroBorderProps) {
  const idBruto = useId();
  const filtroId = `archbase-electro-${idBruto.replace(/:/g, '')}`;
  const [reduzido, setReduzido] = useState(prefereMenosMovimento);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
    const aoMudar = () => setReduzido(consulta.matches);
    setReduzido(consulta.matches);
    consulta.addEventListener('change', aoMudar);
    return () => consulta.removeEventListener('change', aoMudar);
  }, []);

  const duracao = `${Math.max(0.5, 6 / speed)}s`;

  return (
    <div
      className={className}
      style={{ position: 'relative', display: 'inline-block', borderRadius: radius, ...style }}
    >
      <svg
        aria-hidden
        width="0"
        height="0"
        style={{ position: 'absolute', pointerEvents: 'none' }}
      >
        <defs>
          <filter id={filtroId} colorInterpolationFilters="sRGB" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02"
              numOctaves={3}
              seed={7}
              result="ruido"
            >
              {/* Sem a animacao o filtro segue valendo: a borda fica parada. */}
              {!reduzido && (
                <animate
                  attributeName="baseFrequency"
                  values="0.02;0.045;0.02"
                  dur={duracao}
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="ruido"
              scale={distortion}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: radius,
          border: `${borderWidth}px solid ${color}`,
          filter: `url(#${filtroId})`,
          pointerEvents: 'none',
        }}
      />

      {glow && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: radius,
            border: `${borderWidth}px solid ${color}`,
            filter: `url(#${filtroId}) blur(${glowBlur}px)`,
            opacity: 0.6,
            pointerEvents: 'none',
          }}
        />
      )}

      <div style={{ position: 'relative', borderRadius: radius }}>{children}</div>
    </div>
  );
}
