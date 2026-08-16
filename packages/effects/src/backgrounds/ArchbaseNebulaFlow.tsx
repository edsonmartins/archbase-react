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

uniform float uSpeed;
uniform float uScale;
uniform float uDensity;
uniform float uInteractive;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.55;
  float frequency = 1.0;
  mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p * frequency);
    p = rot * p;
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 uv = fragCoord / iResolution.xy;
  vec2 p = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

  vec2 mouseUV = (2.0 * iMouse - iResolution.xy) / min(iResolution.x, iResolution.y);
  float mouseDist = length(p - mouseUV);
  float influence = exp(-mouseDist * mouseDist * 2.5) * iMouseStrength * uInteractive;

  float angle = influence * 2.2 * sin(iTime * 1.2);
  mat2 swirl = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
  p = swirl * p;
  p -= (p - mouseUV) * influence * 0.12;

  float t = iTime * uSpeed * 0.15;

  vec2 q = vec2(fbm(p * uScale + vec2(t, t * 0.5)),
                fbm(p * uScale + vec2(t * 0.2, t)));

  vec2 r = vec2(fbm(p * uScale + 4.0 * q + vec2(1.7, 9.2) + t * 0.15),
                fbm(p * uScale + 4.0 * q + vec2(8.3, 2.8) + t * 0.12));

  float f = fbm(p * uScale + 4.0 * r);

  vec3 col = mix(uColor1, uColor2, clamp(f * f * 4.0, 0.0, 1.0));
  col = mix(col, uColor3, clamp(length(q), 0.0, 1.0));

  float stars = pow(f, 3.5) * uDensity * 0.75;
  col += vec3(stars * 1.2, stars * 1.0, stars * 1.3);

  float vignette = 1.0 - dot(uv - 0.5, uv - 0.5) * 1.3;
  col *= max(0.0, vignette);

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

export interface ArchbaseNebulaFlowProps {
  /** Tres cores das camadas de gas. Menos de tres completa com o padrao. */
  colors?: [string, string, string] | string[];
  speed?: number;
  scale?: number;
  /** Densidade dos pontos brilhantes. */
  density?: number;
  /** Reage ao ponteiro sobre o elemento. */
  interactive?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** Renderizado quando o navegador nao tem WebGL. */
  fallback?: ReactNode;
}

const CORES_PADRAO = ['#0b0a2a', '#3b1e6e', '#a855f7'];

/**
 * Fundo de nebula em shader.
 *
 * Adaptado de Lightswind UI (MIT, Muhilan / codewithMUHILAN). O shader e
 * reproduzido fielmente; o ciclo de vida vem de `useArchbaseShader`, que
 * concentra compilacao, uniforms e liberacao de recursos para todos os efeitos
 * WebGL do pacote — inclusive a regra de nao descartar o contexto na limpeza,
 * que custou um defeito quando estava escrita aqui.
 */
export function ArchbaseNebulaFlow({
  colors = CORES_PADRAO,
  speed = 1,
  scale = 1.6,
  density = 1,
  interactive = true,
  className,
  style,
  children,
  fallback = null,
}: ArchbaseNebulaFlowProps) {
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
      uSpeed: speed,
      uScale: scale,
      uDensity: density,
      uInteractive: interactive ? 1 : 0,
    };
  }, [colors, speed, scale, density, interactive]);

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
