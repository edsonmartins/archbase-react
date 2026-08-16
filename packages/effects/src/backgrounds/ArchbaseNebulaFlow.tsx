import { useCallback, useRef, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { useArchbaseCanvasAnimation } from '../hooks/useArchbaseCanvasAnimation';
import { parseColor, toShaderColor } from '../theme/resolveColors';

const VERTEX_SHADER = `
attribute vec4 a_position;
void main() {
  gl_Position = a_position;
}
`;

const FRAGMENT_SHADER = `
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

interface Recursos {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  buffer: WebGLBuffer;
  uniforms: Record<string, WebGLUniformLocation | null>;
}

function compilar(
  gl: WebGLRenderingContext,
  tipo: number,
  fonte: string,
): WebGLShader | null {
  const shader = gl.createShader(tipo);
  if (!shader) return null;
  gl.shaderSource(shader, fonte);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[archbase-effects] Falha ao compilar shader:', gl.getShaderInfoLog(shader));
    }
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Fundo de nebula em shader.
 *
 * Adaptado de Lightswind UI (MIT, Muhilan / codewithMUHILAN). O shader e
 * reproduzido fielmente; o que muda e o ciclo de vida em volta dele.
 *
 * Correcoes em relacao ao original:
 *
 * - Os recursos de GPU — programa, shaders e buffer — nao eram liberados ao
 *   desmontar. Numa aplicacao de navegacao intensa, cada visita vazava um
 *   contexto, ate o navegador comecar a descartar os mais antigos e outros
 *   canvas apagarem sem explicacao.
 * - Sem WebGL disponivel, o original deixava um canvas preto; aqui ha
 *   `fallback` explicito.
 * - Pausa fora da viewport e sob `prefers-reduced-motion`. Shader em laco
 *   continuo atras de uma tela de CRUD e consumo de bateria sem contrapartida.
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
  const recursos = useRef<Recursos | null>(null);
  const ponteiro = useRef({ x: 0, y: 0, forca: 0 });
  const semWebgl = useRef(false);

  const preparar = useCallback(
    (canvas: HTMLCanvasElement) => {
      const gl =
        (canvas.getContext('webgl', { antialias: false, alpha: false }) as WebGLRenderingContext | null) ??
        (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

      if (!gl) {
        semWebgl.current = true;
        return undefined;
      }

      const vertex = compilar(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
      const fragment = compilar(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
      const program = gl.createProgram();
      if (!vertex || !fragment || !program) {
        semWebgl.current = true;
        return undefined;
      }

      gl.attachShader(program, vertex);
      gl.attachShader(program, fragment);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        semWebgl.current = true;
        return undefined;
      }

      // Os shaders ja estao no programa ligado; manter os objetos apenas adia
      // a liberacao da memoria da GPU.
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);

      const buffer = gl.createBuffer();
      if (!buffer) return undefined;

      // Dois triangulos cobrindo a tela inteira.
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );

      const posicao = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(posicao);
      gl.vertexAttribPointer(posicao, 2, gl.FLOAT, false, 0, 0);

      const nomes = [
        'iResolution',
        'iTime',
        'iMouse',
        'iMouseStrength',
        'uColor1',
        'uColor2',
        'uColor3',
        'uSpeed',
        'uScale',
        'uDensity',
        'uInteractive',
      ];
      const uniforms: Record<string, WebGLUniformLocation | null> = {};
      for (const nome of nomes) uniforms[nome] = gl.getUniformLocation(program, nome);

      recursos.current = { gl, program, buffer, uniforms };

      // Libera o que foi alocado na GPU. O contexto em si NAO e descartado
      // aqui: `setup` roda de novo a cada redimensionamento, e
      // `WEBGL_lose_context.loseContext()` mata o contexto do canvas em
      // definitivo — o segundo setup recebia um contexto morto, os shaders nao
      // compilavam e o fundo ficava branco. O sintoma so aparece depois de um
      // resize, o que o torna facil de nao ver no primeiro carregamento.
      return () => {
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        recursos.current = null;
      };
    },
    [],
  );

  const desenharQuadro = useCallback(
    (canvas: HTMLCanvasElement, estado: { time: number }) => {
      const atual = recursos.current;
      if (!atual) return;

      const { gl, program, uniforms } = atual;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);

      const resolvidas = (colors.length >= 3 ? colors : CORES_PADRAO)
        .slice(0, 3)
        .map((cor, indice) => {
          const rgb = parseColor(cor) ?? parseColor(CORES_PADRAO[indice] ?? '#000000');
          return rgb ? toShaderColor(rgb) : ([0, 0, 0] as [number, number, number]);
        });

      gl.uniform2f(uniforms.iResolution ?? null, canvas.width, canvas.height);
      gl.uniform1f(uniforms.iTime ?? null, estado.time / 1000);
      gl.uniform2f(uniforms.iMouse ?? null, ponteiro.current.x, ponteiro.current.y);
      gl.uniform1f(uniforms.iMouseStrength ?? null, ponteiro.current.forca);
      gl.uniform3fv(uniforms.uColor1 ?? null, resolvidas[0] ?? [0, 0, 0]);
      gl.uniform3fv(uniforms.uColor2 ?? null, resolvidas[1] ?? [0, 0, 0]);
      gl.uniform3fv(uniforms.uColor3 ?? null, resolvidas[2] ?? [0, 0, 0]);
      gl.uniform1f(uniforms.uSpeed ?? null, speed);
      gl.uniform1f(uniforms.uScale ?? null, scale);
      gl.uniform1f(uniforms.uDensity ?? null, density);
      gl.uniform1f(uniforms.uInteractive ?? null, interactive ? 1 : 0);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // A influencia do ponteiro decai sozinha: sem isso o redemoinho ficaria
      // congelado no ultimo ponto tocado.
      ponteiro.current.forca *= 0.96;
    },
    [colors, speed, scale, density, interactive],
  );

  const { containerRef, canvasRef } = useArchbaseCanvasAnimation({
    setup: preparar,
    frame: desenharQuadro,
  });

  const aoMoverPonteiro = useCallback(
    (evento: ReactPointerEvent<HTMLDivElement>) => {
      if (!interactive) return;
      const rect = evento.currentTarget.getBoundingClientRect();
      const dpr = Math.min(2, globalThis.devicePixelRatio || 1);
      ponteiro.current.x = (evento.clientX - rect.left) * dpr;
      // WebGL conta a altura de baixo para cima.
      ponteiro.current.y = (rect.height - (evento.clientY - rect.top)) * dpr;
      ponteiro.current.forca = 1;
    },
    [interactive],
  );

  return (
    <div
      ref={containerRef}
      className={className}
      onPointerMove={aoMoverPonteiro}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{ position: 'absolute', inset: 0, display: 'block' }}
      />
      {semWebgl.current ? fallback : null}
      {children ? (
        <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
          {children}
        </div>
      ) : null}
    </div>
  );
}
