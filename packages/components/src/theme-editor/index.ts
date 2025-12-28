/**
 * ArchbaseThemeColorEditor - Theme Color Editor Component
 *
 * Editor visual de temas para Mantine v7+
 * Suporte a cores, tipografia, espaçamento e bordas.
 */

// Main component - renamed to avoid conflict with existing ThemeEditor
export { ArchbaseThemeEditor as ArchbaseThemeColorEditor } from './ArchbaseThemeEditor';

// Types
export type {
  ArchbaseThemeEditorProps as ArchbaseThemeColorEditorProps,
  ThemeSection,
  ThemeEditorOptions,
  ThemeExportFormat,
  ColorPreset,
  FontConfig,
  SpacingConfig,
  BorderConfig,
  ShadowConfig,
  PreviewOptions,
  ColorPickerProps,
  TypographyEditorProps,
  SpacingEditorProps,
} from './ArchbaseThemeEditor.types';

// Utils
export {
  COLOR_PRESETS,
  exportTheme,
  exportThemeAsJSON,
  exportThemeAsTypeScript,
  exportThemeAsCSS,
  exportThemeForMantine,
  downloadTheme,
  copyThemeToClipboard,
  mergeTheme,
  extractColorPalette,
  themeFromPreset,
  isValidColor,
  hexToRgb,
  rgbToHex,
  generateColorScale,
} from './utils/themeExport';
