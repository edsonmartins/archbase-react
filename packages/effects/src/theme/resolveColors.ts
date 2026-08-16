/*
 * Resolucao de cor sem depender do Mantine.
 *
 * O pacote nao importa @mantine/core de proposito: sao componentes de canvas e
 * WebGL, e arrastar uma biblioteca de UI inteira para ler quatro cores seria
 * desproporcional. O Mantine ja publica seu tema como custom properties no
 * documento (`--mantine-color-blue-6`, `--mantine-color-text`), entao ler dali
 * entrega integracao de tema com dependencia zero.
 *
 * Em hospedeiro sem Mantine, o fallback assume o controle e nada quebra.
 */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

const HEX_CURTO = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i;
const HEX_LONGO = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i;
const RGB_FUNC = /rgba?\(\s*([0-9.]+)[\s,]+([0-9.]+)[\s,]+([0-9.]+)/i;

/** Converte cor CSS em RGB 0-255. Devolve `null` no que nao souber ler. */
export function parseColor(value: string): RgbColor | null {
  const texto = value.trim();
  if (texto === '') return null;

  const curto = HEX_CURTO.exec(texto);
  if (curto) {
    const [, r, g, b] = curto;
    return {
      r: parseInt(`${r}${r}`, 16),
      g: parseInt(`${g}${g}`, 16),
      b: parseInt(`${b}${b}`, 16),
    };
  }

  const longo = HEX_LONGO.exec(texto);
  if (longo) {
    const [, r, g, b] = longo;
    return { r: parseInt(r ?? '0', 16), g: parseInt(g ?? '0', 16), b: parseInt(b ?? '0', 16) };
  }

  const func = RGB_FUNC.exec(texto);
  if (func) {
    const [, r, g, b] = func;
    return { r: Number(r), g: Number(g), b: Number(b) };
  }

  return null;
}

/** Normaliza para 0-1, que e o intervalo que os shaders esperam. */
export function toShaderColor(color: RgbColor): [number, number, number] {
  return [color.r / 255, color.g / 255, color.b / 255];
}

/**
 * Le uma custom property a partir do elemento, subindo a cascata. Devolve o
 * fallback quando a variavel nao existe — hospedeiro sem Mantine, por exemplo.
 */
export function readCssVariable(
  element: Element | null,
  variable: string,
  fallback: string,
): string {
  if (typeof window === 'undefined' || !element) return fallback;
  const valor = getComputedStyle(element).getPropertyValue(variable).trim();
  return valor === '' ? fallback : valor;
}

export function readCssColor(
  element: Element | null,
  variable: string,
  fallback: string,
): RgbColor {
  return (
    parseColor(readCssVariable(element, variable, fallback)) ??
    parseColor(fallback) ?? { r: 255, g: 255, b: 255 }
  );
}

/**
 * Esquema de cor corrente. O Mantine marca `data-mantine-color-scheme` na raiz;
 * sem ele, vale a preferencia do sistema.
 */
export function readColorScheme(element: Element | null): 'light' | 'dark' {
  if (typeof document === 'undefined') return 'light';

  const marcado =
    element?.closest('[data-mantine-color-scheme]')?.getAttribute('data-mantine-color-scheme') ??
    document.documentElement.getAttribute('data-mantine-color-scheme');

  if (marcado === 'dark' || marcado === 'light') return marcado;
  if (document.documentElement.classList.contains('dark')) return 'dark';

  return typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}
