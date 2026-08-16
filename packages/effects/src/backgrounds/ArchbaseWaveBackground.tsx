import { useCallback, type CSSProperties, type ReactNode } from 'react';
import { useArchbaseShader } from '../hooks/useArchbaseShader';
import { parseColor, toShaderColor } from '../theme/resolveColors';

const FRAGMENT = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform float iMouseStrength;

uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uAmplitude;

void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - iResolution.xy) / min(iResolution.x, iResolution.y);
  vec2 mouseUV = (2.0 * iMouse - iResolution.xy) / min(iResolution.x, iResolution.y);

  float dist = length(uv - mouseUV);
  vec2 dir = (uv - mouseUV) / (dist + 0.0001);

  // Onda irradiando do ponteiro.
  float influence = exp(-dist * dist * 3.5) * iMouseStrength;
  uv += dir * influence * 0.2 * sin(dist * 10.0 - iTime * 4.0);

  // Camadas de seno com frequencia crescente: o que produz a dobra do tecido.
  for (float i = 1.0; i < 8.0; i++) {
    uv.y += uAmplitude * 0.1 * sin(uv.x * i * i + iTime * 0.5) * sin(uv.y * i * i + iTime * 0.5);
  }

  float t = clamp(uv.y + 0.5, 0.0, 1.0);
  vec3 col = mix(uColor1, uColor2, t);
  col = mix(col, uColor3, clamp(uv.y, 0.0, 1.0));

  float glow = exp(-dist * dist * 5.0) * iMouseStrength;
  col += uColor2 * glow * 0.35;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export interface ArchbaseWaveBackgroundProps {
  /** Tres cores da faixa. Menos de tres completa com o padrao. */
  colors?: string[];
  /** Intensidade da dobra. */
  amplitude?: number;
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** Renderizado quando o navegador nao tem WebGL. */
  fallback?: ReactNode;
}

const CORES_PADRAO = ['#0f172a', '#1d4ed8', '#38bdf8'];

/**
 * Fundo de ondas em shader: camadas de seno que dobram o plano, com onda
 * irradiando do ponteiro.
 *
 * Adaptado de Lightswind UI (MIT, Muhilan / codewithMUHILAN).
 *
 * O original tinha dois caminhos de cor no shader — um padrao codificado e um
 * customizado — selecionados por um uniform `u_has_custom_colors`. Aqui existe
 * so o caminho customizado, com as cores padrao vindo da prop: dois caminhos
 * significavam dois visuais para manter, e o padrao nunca era o que se queria
 * num produto com tema proprio.
 */
export function ArchbaseWaveBackground({
  colors = CORES_PADRAO,
  amplitude = 1,
  interactive = true,
  className,
  style,
  children,
  fallback = null,
}: ArchbaseWaveBackgroundProps) {
  const uniforms = useCallback(() => {
    const lista = colors.length >= 3 ? colors : CORES_PADRAO;
    const resolver = (indice: number) => {
      const rgb = parseColor(lista[indice] ?? '') ?? parseColor(CORES_PADRAO[indice] ?? '#000000');
      return rgb ? toShaderColor(rgb) : ([0, 0, 0] as [number, number, number]);
    };

    return {
      uColor1: resolver(0),
      uColor2: resolver(1),
      uColor3: resolver(2),
      uAmplitude: amplitude,
    };
  }, [colors, amplitude]);

  const { containerRef, canvasRef, supported, onPointerMove } = useArchbaseShader({
    fragment: FRAGMENT,
    uniforms,
    interactive,
  });

  return (
    <div
      ref={containerRef}
      className={className}
      onPointerMove={onPointerMove}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ position: 'absolute', inset: 0, display: 'block' }}
      />
      {!supported ? fallback : null}
      {children ? (
        <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
