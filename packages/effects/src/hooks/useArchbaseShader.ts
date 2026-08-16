import { useCallback, useRef, useState } from 'react';
import { useArchbaseCanvasAnimation } from './useArchbaseCanvasAnimation';

/*
 * Mecanica compartilhada dos efeitos em shader.
 *
 * Todo fundo WebGL deste pacote e o mesmo programa: dois triangulos cobrindo a
 * tela e um fragment shader decidindo a cor de cada pixel. O que muda entre
 * eles e o corpo do shader e os uniforms.
 *
 * Extrair isto evita repetir — e repetir errado — compilacao, verificacao de
 * link, liberacao de recursos e conversao de ponteiro. O porte da nebula ja
 * havia custado um defeito nessa area: `loseContext()` na limpeza matava o
 * canvas em definitivo, e o segundo `setup` recebia um contexto morto.
 */

export type ValorUniforme = number | readonly number[];

export interface UseArchbaseShaderOptions {
  /** Corpo do fragment shader. Recebe iResolution, iTime, iMouse e iMouseStrength. */
  fragment: string;
  /**
   * Uniforms proprios do efeito, lidos a cada quadro. Numero vira `uniform1f`;
   * vetor de 2, 3 ou 4 posicoes vira `uniform2f`/`3fv`/`4fv`.
   */
  uniforms?: () => Record<string, ValorUniforme>;
  /** Alimenta iMouse e iMouseStrength a partir do ponteiro sobre o elemento. */
  interactive?: boolean;
  /** Decaimento da influencia do ponteiro por quadro. */
  mouseDecay?: number;
}

export interface UseArchbaseShaderResult {
  containerRef: (node: HTMLElement | null) => void;
  canvasRef: (node: HTMLCanvasElement | null) => void;
  /** Falso quando o navegador nao entregou contexto ou o shader nao compilou. */
  supported: boolean;
  onPointerMove: (evento: {
    clientX: number;
    clientY: number;
    currentTarget: { getBoundingClientRect: () => { left: number; top: number; height: number } };
  }) => void;
}

const VERTEX = `
attribute vec4 a_position;
void main() { gl_Position = a_position; }
`;

const UNIFORMS_BASE = ['iResolution', 'iTime', 'iMouse', 'iMouseStrength'] as const;

interface Recursos {
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  buffer: WebGLBuffer;
  locais: Map<string, WebGLUniformLocation | null>;
}

function compilar(gl: WebGLRenderingContext, tipo: number, fonte: string): WebGLShader | null {
  const shader = gl.createShader(tipo);
  if (!shader) return null;

  gl.shaderSource(shader, fonte);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[archbase-effects] Shader nao compilou:', gl.getShaderInfoLog(shader));
    }
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function useArchbaseShader({
  fragment,
  uniforms,
  interactive = true,
  mouseDecay = 0.96,
}: UseArchbaseShaderOptions): UseArchbaseShaderResult {
  const recursos = useRef<Recursos | null>(null);
  const ponteiro = useRef({ x: 0, y: 0, forca: 0 });
  const uniformsRef = useRef(uniforms);
  uniformsRef.current = uniforms;

  const [suportado, setSuportado] = useState(true);

  const preparar = useCallback(
    (canvas: HTMLCanvasElement) => {
      const gl =
        (canvas.getContext('webgl', { antialias: false, alpha: false }) as WebGLRenderingContext | null) ??
        (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);

      if (!gl) {
        setSuportado(false);
        return undefined;
      }

      const vs = compilar(gl, gl.VERTEX_SHADER, VERTEX);
      const fs = compilar(gl, gl.FRAGMENT_SHADER, fragment);
      const program = gl.createProgram();

      if (!vs || !fs || !program) {
        setSuportado(false);
        return undefined;
      }

      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);

      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn('[archbase-effects] Programa nao ligou:', gl.getProgramInfoLog(program));
        }
        setSuportado(false);
        return undefined;
      }

      // Ja estao no programa ligado; manter os objetos so adia a liberacao.
      gl.deleteShader(vs);
      gl.deleteShader(fs);

      const buffer = gl.createBuffer();
      if (!buffer) return undefined;

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );

      const posicao = gl.getAttribLocation(program, 'a_position');
      gl.enableVertexAttribArray(posicao);
      gl.vertexAttribPointer(posicao, 2, gl.FLOAT, false, 0, 0);

      const locais = new Map<string, WebGLUniformLocation | null>();
      for (const nome of UNIFORMS_BASE) locais.set(nome, gl.getUniformLocation(program, nome));
      for (const nome of Object.keys(uniformsRef.current?.() ?? {})) {
        locais.set(nome, gl.getUniformLocation(program, nome));
      }

      recursos.current = { gl, program, buffer, locais };
      setSuportado(true);

      // Libera o que foi alocado. O contexto NAO e descartado aqui: `setup`
      // roda de novo a cada redimensionamento, e `loseContext()` mataria o
      // canvas em definitivo.
      return () => {
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
        recursos.current = null;
      };
    },
    [fragment],
  );

  const desenhar = useCallback((canvas: HTMLCanvasElement, estado: { time: number }) => {
    const atual = recursos.current;
    if (!atual) return;

    const { gl, program, locais } = atual;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    gl.uniform2f(locais.get('iResolution') ?? null, canvas.width, canvas.height);
    gl.uniform1f(locais.get('iTime') ?? null, estado.time / 1000);
    gl.uniform2f(locais.get('iMouse') ?? null, ponteiro.current.x, ponteiro.current.y);
    gl.uniform1f(locais.get('iMouseStrength') ?? null, ponteiro.current.forca);

    for (const [nome, valor] of Object.entries(uniformsRef.current?.() ?? {})) {
      const local = locais.get(nome) ?? null;
      if (typeof valor === 'number') {
        gl.uniform1f(local, valor);
      } else if (valor.length === 2) {
        gl.uniform2f(local, valor[0] ?? 0, valor[1] ?? 0);
      } else if (valor.length === 3) {
        gl.uniform3fv(local, valor as number[]);
      } else if (valor.length === 4) {
        gl.uniform4fv(local, valor as number[]);
      }
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // A influencia do ponteiro decai sozinha, senao o efeito ficaria congelado
    // no ultimo ponto tocado.
    ponteiro.current.forca *= mouseDecay;
  }, [mouseDecay]);

  const { containerRef, canvasRef } = useArchbaseCanvasAnimation({
    setup: preparar,
    frame: desenhar,
  });

  const onPointerMove = useCallback<UseArchbaseShaderResult['onPointerMove']>(
    (evento) => {
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

  return { containerRef, canvasRef, supported: suportado, onPointerMove };
}
