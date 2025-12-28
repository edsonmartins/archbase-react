import type { CSSProperties, ReactNode } from 'react';
import type { MantineTheme } from '@mantine/core';

/**
 * Formato de exportação do tema
 */
export type ThemeExportFormat = 'json' | 'typescript' | 'css' | 'mantine';

/**
 * Preset de cores
 */
export interface ColorPreset {
  /** Nome do preset */
  name: string;
  /** Cores principais */
  colors: Record<string, string>;
  /** Cores de primary */
  primary?: Record<string, string>;
  /** Cores de accent */
  accent?: Record<string, string>;
}

/**
 * Configuração de fonte
 */
export interface FontConfig {
  /** Família da fonte */
  family: string;
  /** Tamanhos disponíveis */
  sizes: Record<string, string | number>;
  /** Altura de linha */
  lineHeight?: Record<string, number>;
  /** Peso da fonte */
  weights?: Record<string, number>;
}

/**
 * Configuração de espaçamento
 */
export interface SpacingConfig {
  /** Valores de escala */
  scale: number;
  /** Valores customizados */
  values?: Record<string, number>;
}

/**
 * Configuração de bordas
 */
export interface BorderConfig {
  /** Radius padrão */
  radius: Record<string, string | number>;
  /** Width de bordas */
  widths?: Record<string, string | number>;
}

/**
 * Configuração de sombra
 */
export interface ShadowConfig {
  /** Sombras customizadas */
  shadows: Record<string, string>;
}

/**
 * Opções de preview
 */
export interface PreviewOptions {
  /** Mostrar grid de cores */
  showColors?: boolean;
  /** Mostrar tipografia */
  showTypography?: boolean;
  /** Mostrar componentes */
  showComponents?: boolean;
  /** Layout do preview */
  layout?: 'vertical' | 'horizontal' | 'tabs';
}

/**
 * Opções do editor
 */
export interface ThemeEditorOptions {
  /** Seções editáveis */
  sections?: ('colors' | 'typography' | 'spacing' | 'borders' | 'shadows' | 'breakpoints')[];
  /** Presets disponíveis */
  presets?: ColorPreset[];
  /** Opções de preview */
  preview?: PreviewOptions;
  /** Exportar ao mudar */
  autoExport?: boolean;
  /** Callback de mudança */
  onChange?: (theme: MantineTheme) => void;
}

/**
 * Seção do tema
 */
export type ThemeSection = 'colors' | 'typography' | 'spacing' | 'borders' | 'shadows' | 'breakpoints';

/**
 * Props do componente ArchbaseThemeEditor
 */
export interface ArchbaseThemeEditorProps {
  /** Tema atual */
  theme?: Partial<MantineTheme>;
  /** Callback quando tema muda */
  onChange?: (theme: Partial<MantineTheme>) => void;
  /** Callback ao aplicar tema */
  onApply?: (theme: MantineTheme) => void;

  /** --- Opções --- */
  options?: ThemeEditorOptions;
  /** Seção inicial */
  initialSection?: ThemeSection;
  /** Preset inicial */
  initialPreset?: string;

  /** --- Exportação --- */
  /** Formatos disponíveis para exportação */
  exportFormats?: ThemeExportFormat[];
  /** Callback ao exportar */
  onExport?: (format: ThemeExportFormat, data: string) => void;
  /** Nome do tema para exportação */
  themeName?: string;

  /** --- Layout --- */
  /** Largura */
  width?: string | number;
  /** Altura */
  height?: string | number;
  /** Layout do editor */
  layout?: 'inline' | 'sidebar' | 'modal' | 'floating';

  /** --- Estilização --- */
  style?: CSSProperties;
  className?: string;
  editorClassName?: string;
  previewClassName?: string;

  /** --- Estados --- */
  disabled?: boolean;
  loading?: ReactNode;
  /** Modo apenas leitura */
  readOnly?: boolean;
  /** Esconder preview */
  hidePreview?: boolean;

  /** --- Acessibilidade --- */
  ariaLabel?: string;
  title?: string;

  /** --- Outros --- */
  /** Botões de ação customizados */
  actions?: ReactNode;
  /** Header customizado */
  header?: ReactNode;
  /** Footer customizado */
  footer?: ReactNode;
}

/**
 * Props para ColorPicker
 */
export interface ColorPickerProps {
  /** Cor atual */
  value: string;
  /** Callback de mudança */
  onChange: (color: string) => void;
  /** Label */
  label?: string;
  /** Presets de cores */
  presets?: string[];
  /** Alpha */
  withAlpha?: boolean;
  /** Desabilitado */
  disabled?: boolean;
  /** Nome da variável CSS */
  cssVar?: string;
}

/**
 * Props para TypographyEditor
 */
export interface TypographyEditorProps {
  /** Config de fontes */
  value: FontConfig;
  /** Callback de mudança */
  onChange: (config: FontConfig) => void;
  /** Preview text */
  previewText?: string;
  /** Desabilitado */
  disabled?: boolean;
}

/**
 * Props para SpacingEditor
 */
export interface SpacingEditorProps {
  /** Config de espaçamento */
  value: SpacingConfig;
  /** Callback de mudança */
  onChange: (config: SpacingConfig) => void;
  /** Mostrar preview */
  showPreview?: boolean;
  /** Desabilitado */
  disabled?: boolean;
}
