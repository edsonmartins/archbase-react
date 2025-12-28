import type { MantineTheme } from '@mantine/core';
import type { ThemeExportFormat } from '../ArchbaseThemeEditor.types';

/**
 * Presets de cores
 */
export const COLOR_PRESETS = [
  {
    name: 'Blue',
    colors: {
      blue: '#228BE6',
      'blue-light': '#4DABF7',
      'blue-dark': '#1C7ED6',
    },
  },
  {
    name: 'Green',
    colors: {
      green: '#40C057',
      'green-light': '#69DB7C',
      'green-dark': '#37B24D',
    },
  },
  {
    name: 'Red',
    colors: {
      red: '#FA5252',
      'red-light': '#FF8787',
      'red-dark': '#E03131',
    },
  },
  {
    name: 'Orange',
    colors: {
      orange: '#FD7E14',
      'orange-light': '#FFA94D',
      'orange-dark': '#F76707',
    },
  },
  {
    name: 'Purple',
    colors: {
      purple: '#7950F2',
      'purple-light': '#9775FA',
      'purple-dark': '#7048E8',
    },
  },
  {
    name: 'Dark',
    colors: {
      dark: '#212529',
      gray: '#868E96',
      'gray-light': '#DEE2E6',
    },
  },
];

/**
 * Exporta tema como JSON
 */
export function exportThemeAsJSON(theme: Partial<MantineTheme>): string {
  return JSON.stringify(theme, null, 2);
}

/**
 * Exporta tema como TypeScript
 */
export function exportThemeAsTypeScript(theme: Partial<MantineTheme>, themeName: string = 'myTheme'): string {
  const colors = theme.colors || {};
  const fontFamily = theme.fontFamily || 'sans-serif';
  const primaryColor = theme.primaryColor || 'blue';
  const radius = theme.radius || {};

  return `import { MantineTheme } from '@mantine/core';

export const ${themeName}: MantineTheme = {
  fontFamily: '${fontFamily}',
  primaryColor: '${primaryColor}',
  colors: ${JSON.stringify(colors, null, 2)},
  radius: ${JSON.stringify(radius, null, 2)},
  // ... outras configurações
};

export default ${themeName};
`;
}

/**
 * Exporta tema como CSS variables
 */
export function exportThemeAsCSS(theme: Partial<MantineTheme>, prefix: string = 'mantine'): string {
  const colors = theme.colors || {};
  const cssVars: string[] = [];

  // Cores
  Object.entries(colors).forEach(([colorName, colorScale]) => {
    if (typeof colorScale === 'object') {
      Object.entries(colorScale).forEach(([, shadeValue]) => {
        // CSS var format: --mantine-blue-6: #228BE6;
        // cssVars.push(`--${prefix}-${colorName}-${shade}: ${shadeValue};`);
      });
    } else if (typeof colorScale === 'string') {
      cssVars.push(`--${prefix}-${colorName}: ${colorScale};`);
    }
  });

  // Outras propriedades
  if (theme.fontFamily) {
    cssVars.push(`--${prefix}-font-family: ${theme.fontFamily};`);
  }

  return `:root {\n${cssVars.map(v => `  ${v}`).join('\n')}\n}`;
}

/**
 * Exporta tema no formato do Mantine (para usar no createTheme)
 */
export function exportThemeForMantine(theme: Partial<MantineTheme>): string {
  return `import { createTheme } from '@mantine/core';

const theme = createTheme({
  ${Object.entries(theme)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => {
      if (key === 'colors' && typeof value === 'object') {
        return `colors: ${JSON.stringify(value, null, 2)},`;
      }
      if (typeof value === 'string') {
        return `${key}: '${value}',`;
      }
      if (typeof value === 'object') {
        return `${key}: ${JSON.stringify(value, null, 2)},`;
      }
      return `${key}: ${value},`;
    })
    .join('\n  ')}
});

export default theme;
`;
}

/**
 * Exporta tema em formato especificado
 */
export function exportTheme(
  theme: Partial<MantineTheme>,
  format: ThemeExportFormat,
  themeName: string = 'myTheme'
): string {
  switch (format) {
    case 'json':
      return exportThemeAsJSON(theme);
    case 'typescript':
      return exportThemeAsTypeScript(theme, themeName);
    case 'css':
      return exportThemeAsCSS(theme);
    case 'mantine':
      return exportThemeForMantine(theme);
    default:
      return exportThemeAsJSON(theme);
  }
}

/**
 * Baixa tema como arquivo
 */
export function downloadTheme(theme: Partial<MantineTheme>, format: ThemeExportFormat, filename: string = 'theme'): void {
  const content = exportTheme(theme, format, filename);
  const mimeTypes: Record<ThemeExportFormat, string> = {
    json: 'application/json',
    typescript: 'text/typescript',
    css: 'text/css',
    mantine: 'text/typescript',
  };

  const blob = new Blob([content], { type: mimeTypes[format] || 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.${format === 'typescript' ? 'ts' : format === 'mantine' ? 'ts' : format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copia tema para clipboard
 */
export async function copyThemeToClipboard(
  theme: Partial<MantineTheme>,
  format: ThemeExportFormat,
  themeName: string = 'myTheme'
): Promise<boolean> {
  try {
    const content = exportTheme(theme, format, themeName);
    await navigator.clipboard.writeText(content);
    return true;
  } catch {
    return false;
  }
}

/**
 * Merge tema com defaults
 */
export function mergeTheme(base: Partial<MantineTheme>, override: Partial<MantineTheme>): Partial<MantineTheme> {
  return {
    ...base,
    ...override,
    colors: {
      ...base.colors,
      ...override.colors,
    },
    fontFamily: override.fontFamily || base.fontFamily,
    primaryColor: override.primaryColor || base.primaryColor,
    radius: {
      ...base.radius,
      ...override.radius,
    },
    spacing: {
      ...base.spacing,
      ...override.spacing,
    },
    fontSizes: {
      ...base.fontSizes,
      ...override.fontSizes,
    },
  };
}

/**
 * Extrai paleta de cores de um tema
 */
export function extractColorPalette(theme: MantineTheme): Record<string, string> {
  const colors: Record<string, string> = {};
  const colorNames = Object.keys(theme.colors);

  colorNames.forEach((colorName) => {
    const colorScale = theme.colors[colorName];
    if (typeof colorScale === 'object' && colorScale !== null) {
      // Pega o shade 6 (padrão) ou o meio da escala
      const shade = colorScale[6] || colorScale[5] || colorScale[4];
      if (shade) {
        colors[colorName] = shade;
      }
    }
  });

  return colors;
}

/**
 * Cria tema a partir de preset
 */
export function themeFromPreset(presetName: string, customColors?: Record<string, string>): Partial<MantineTheme> {
  const preset = COLOR_PRESETS.find((p) => p.name.toLowerCase() === presetName.toLowerCase());

  if (!preset && !customColors) {
    return {};
  }

  const colors: Record<string, any> = {};

  if (preset) {
    Object.entries(preset.colors).forEach(([key, value]) => {
      if (key.includes('-')) {
        const [base, shade] = key.split('-');
        if (!colors[base]) colors[base] = {};
        colors[base][shade === 'light' ? '1' : shade === 'dark' ? '9' : '6'] = value;
      } else {
        if (!colors[key]) colors[key] = {};
        colors[key]['6'] = value;
      }
    });
  }

  if (customColors) {
    Object.entries(customColors).forEach(([key, value]) => {
      if (!colors[key]) colors[key] = {};
      colors[key]['6'] = value;
    });
  }

  return {
    colors,
    primaryColor: preset ? preset.colors[Object.keys(preset.colors)[0]].toLowerCase() : 'blue',
  };
}

/**
 * Valida se cor é válida (hex, rgb, etc)
 */
export function isValidColor(color: string): boolean {
  const hexPattern = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const rgbPattern = /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/;
  const rgbaPattern = /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/;

  return hexPattern.test(color) || rgbPattern.test(color) || rgbaPattern.test(color);
}

/**
 * Converte hex para RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Converte RGB para hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Gera escala de cores a partir de uma cor base
 */
export function generateColorScale(baseColor: string): string[] {
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [baseColor];

  const scale: string[] = [];
  const steps = 10;

  for (let i = 0; i < steps; i++) {
    const factor = 0.5 + (i / steps) * 0.5; // 0.5 a 1.0

    if (i === 5) {
      scale.push(baseColor);
    } else {
      const r = Math.round(rgb.r * factor);
      const g = Math.round(rgb.g * factor);
      const b = Math.round(rgb.b * factor);
      scale.push(rgbToHex(r, g, b));
    }
  }

  return scale;
}
