/*
 * Ruido de Perlin 2D classico.
 *
 * Vive no pacote em vez de virar dependencia: sao 40 linhas, e qualquer
 * biblioteca de ruido traria consigo APIs 3D e simplex que nenhum efeito daqui
 * usa. A tabela de permutacao e gerada uma vez por semente.
 */

const TAMANHO = 256;

function embaralhar(semente: number): Uint8Array {
  const tabela = new Uint8Array(TAMANHO * 2);
  const base = new Uint8Array(TAMANHO);
  for (let i = 0; i < TAMANHO; i += 1) base[i] = i;

  // Gerador congruente linear: determinismo por semente, sem Math.random —
  // o mesmo fundo precisa poder ser reproduzido.
  let estado = semente >>> 0;
  const proximo = () => {
    estado = (estado * 1664525 + 1013904223) >>> 0;
    return estado / 0xffffffff;
  };

  for (let i = TAMANHO - 1; i > 0; i -= 1) {
    const j = Math.floor(proximo() * (i + 1));
    const tmp = base[i] ?? 0;
    base[i] = base[j] ?? 0;
    base[j] = tmp;
  }

  for (let i = 0; i < TAMANHO * 2; i += 1) tabela[i] = base[i % TAMANHO] ?? 0;
  return tabela;
}

const suavizar = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const interpolar = (t: number, a: number, b: number) => a + t * (b - a);

function gradiente(hash: number, x: number, y: number): number {
  // Quatro direcoes diagonais bastam em 2D.
  switch (hash & 3) {
    case 0:
      return x + y;
    case 1:
      return -x + y;
    case 2:
      return x - y;
    default:
      return -x - y;
  }
}

export interface RuidoPerlin {
  /** Devolve valor em [-1, 1]. */
  (x: number, y: number): number;
}

export function criarRuidoPerlin(semente = 1): RuidoPerlin {
  const p = embaralhar(semente);

  return (x: number, y: number): number => {
    const xi = Math.floor(x) & 255;
    const yi = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);

    const u = suavizar(xf);
    const v = suavizar(yf);

    const aa = p[(p[xi] ?? 0) + yi] ?? 0;
    const ab = p[(p[xi] ?? 0) + yi + 1] ?? 0;
    const ba = p[(p[xi + 1] ?? 0) + yi] ?? 0;
    const bb = p[(p[xi + 1] ?? 0) + yi + 1] ?? 0;

    const x1 = interpolar(u, gradiente(aa, xf, yf), gradiente(ba, xf - 1, yf));
    const x2 = interpolar(u, gradiente(ab, xf, yf - 1), gradiente(bb, xf - 1, yf - 1));

    return interpolar(v, x1, x2);
  };
}
