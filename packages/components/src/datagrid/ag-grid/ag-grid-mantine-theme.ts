/**
 * AG Grid Mantine Theme Integration
 *
 * Creates a Quartz-based theme that integrates with Mantine's theme system,
 * supporting both light and dark color schemes.
 */
import { themeQuartz, type Theme } from 'ag-grid-community';
import type { MantineTheme } from '@mantine/core';

/**
 * Options for creating AG Grid theme
 */
export interface ArchbaseAgGridThemeOptions {
  headerFontWeight?: number | 'normal' | 'bold';
}

/**
 * Creates an AG Grid theme integrated with Mantine's theming system
 */
export const createArchbaseAgGridTheme = (
  theme: MantineTheme,
  colorScheme: 'light' | 'dark',
  options?: ArchbaseAgGridThemeOptions
): Theme => {
  const isDark = colorScheme === 'dark';
  const fontWeight = options?.headerFontWeight === 'normal' ? 400
    : options?.headerFontWeight === 'bold' ? 700
    : options?.headerFontWeight ?? 600;

  return themeQuartz.withParams({
    // Background colors
    backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
    foregroundColor: isDark ? theme.colors.gray[0] : theme.colors.dark[9],

    // Header styling
    headerBackgroundColor: isDark ? theme.colors.dark[7] : theme.white,
    headerFontWeight: fontWeight,
    headerTextColor: isDark ? theme.colors.gray[0] : theme.colors.dark[9],

    // Accent/Primary color
    accentColor: theme.colors[theme.primaryColor][6],

    // Row hover
    rowHoverColor: isDark ? theme.colors.dark[5] : theme.colors.gray[1],

    // Selection colors
    selectedRowBackgroundColor: isDark
      ? `rgba(${hexToRgb(theme.colors[theme.primaryColor][9])}, 0.3)`
      : `rgba(${hexToRgb(theme.colors[theme.primaryColor][1])}, 0.5)`,

    // Borders
    borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
    borderRadius: parseInt(String(theme.radius.sm)) || 4,

    // Typography
    fontFamily: theme.fontFamily || 'inherit',
    fontSize: parseInt(String(theme.fontSizes.sm)) || 14,

    // Cell styling
    cellTextColor: isDark ? theme.colors.gray[0] : theme.colors.dark[9],

    // Odd row (striped) - subtle alternating
    oddRowBackgroundColor: isDark ? theme.colors.dark[5] : theme.colors.gray[0],

    // Checkbox
    checkboxCheckedBackgroundColor: theme.colors[theme.primaryColor][6],
    checkboxCheckedBorderColor: theme.colors[theme.primaryColor][6],
    checkboxUncheckedBackgroundColor: 'transparent',
    checkboxUncheckedBorderColor: isDark ? theme.colors.gray[5] : theme.colors.gray[4],

    // Column separator
    columnBorder: true,

    // Wrapper border - disabled since container already has border
    wrapperBorder: false,
    wrapperBorderRadius: 0,

    // Spacing
    cellHorizontalPadding: 8,
    headerHeight: 40,
    rowHeight: 40,

    // Icons
    iconSize: 16,
  });
};

/**
 * Helper function to convert hex color to RGB values
 */
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return '0, 0, 0';
  }
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
};

/**
 * Get CSS variables for additional styling not covered by theme params
 */
export const getAgGridMantineCssVars = (
  theme: MantineTheme,
  colorScheme: 'light' | 'dark'
): Record<string, string> => {
  const isDark = colorScheme === 'dark';

  // Cell focus background color
  const cellFocusBgColor = isDark
    ? `rgba(${hexToRgb(theme.colors[theme.primaryColor][7])}, 0.3)`
    : `rgba(${hexToRgb(theme.colors[theme.primaryColor][4])}, 0.25)`;

  return {
    '--ag-background-color': isDark ? theme.colors.dark[6] : theme.white,
    '--ag-foreground-color': isDark ? theme.colors.gray[0] : theme.colors.dark[9],
    '--ag-header-background-color': isDark ? theme.colors.dark[7] : theme.white,
    '--ag-header-foreground-color': isDark ? theme.colors.gray[0] : theme.colors.dark[9],
    '--ag-border-color': isDark ? theme.colors.dark[4] : theme.colors.gray[3],
    '--ag-row-hover-color': isDark ? theme.colors.dark[5] : theme.colors.gray[1],
    '--ag-selected-row-background-color': isDark
      ? `rgba(${hexToRgb(theme.colors[theme.primaryColor][9])}, 0.3)`
      : `rgba(${hexToRgb(theme.colors[theme.primaryColor][1])}, 0.5)`,
    '--ag-odd-row-background-color': isDark ? theme.colors.dark[5] : theme.colors.gray[0],
    '--ag-font-family': theme.fontFamily || 'inherit',
    '--ag-font-size': `${theme.fontSizes.sm}`,
    '--ag-grid-size': '4px',
    '--ag-icon-size': '16px',
    '--ag-cell-horizontal-padding': '8px',
    '--ag-checkbox-checked-color': theme.colors[theme.primaryColor][6],
    '--ag-checkbox-unchecked-color': isDark ? theme.colors.gray[5] : theme.colors.gray[4],
    '--ag-input-focus-border-color': theme.colors[theme.primaryColor][6],
    // Cell selection/range - background color instead of border
    '--ag-range-selection-border-color': 'transparent',
    '--ag-range-selection-background-color': isDark
      ? `rgba(${hexToRgb(theme.colors[theme.primaryColor][7])}, 0.4)`
      : `rgba(${hexToRgb(theme.colors[theme.primaryColor][4])}, 0.3)`,
    '--ag-range-selection-highlight-color': isDark
      ? `rgba(${hexToRgb(theme.colors[theme.primaryColor][7])}, 0.4)`
      : `rgba(${hexToRgb(theme.colors[theme.primaryColor][4])}, 0.3)`,
    // Cell focus - custom variable for focused cell background
    '--ag-input-focus-box-shadow': 'none',
    '--archbase-cell-focus-bg': cellFocusBgColor,
  };
};

/**
 * Get custom CSS styles for AG Grid cell focus
 */
export const getAgGridCustomStyles = (
  theme: MantineTheme,
  colorScheme: 'light' | 'dark'
): string => {
  const isDark = colorScheme === 'dark';
  const cellFocusBgColor = isDark
    ? `rgba(${hexToRgb(theme.colors[theme.primaryColor][7])}, 0.3)`
    : `rgba(${hexToRgb(theme.colors[theme.primaryColor][4])}, 0.25)`;

  return `
    .ag-cell-focus:not(.ag-cell-range-selected) {
      background-color: ${cellFocusBgColor} !important;
      border: none !important;
      outline: none !important;
    }
    .ag-cell-focus.ag-cell-range-selected {
      background-color: ${cellFocusBgColor} !important;
    }
    .ag-row-selected .ag-cell-focus {
      background-color: ${cellFocusBgColor} !important;
    }
  `;
};

/**
 * Default export for convenience
 */
export default createArchbaseAgGridTheme;
