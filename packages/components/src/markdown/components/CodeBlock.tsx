import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Box, Code, Paper, useMantineTheme } from '@mantine/core';
import type { CodeBlockProps } from '../ArchbaseMarkdown.types';

/**
 * Mapeamento de temas para cores
 */
const THEME_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'atom-one-dark': { bg: '#282c34', text: '#abb2bf', border: '#3e4451' },
  'atom-one-light': { bg: '#fafafa', text: '#383a42', border: '#e0e0e0' },
  'github-dark': { bg: '#0d1117', text: '#c9d1d9', border: '#30363d' },
  'github-light': { bg: '#ffffff', text: '#24292f', border: '#d0d7de' },
  'monokai': { bg: '#272822', text: '#f8f8f2', border: '#3e3d32' },
  'nord': { bg: '#2e3440', text: '#d8dee9', border: '#3b4252' },
  'dracula': { bg: '#282a36', text: '#f8f8f2', border: '#44475a' },
  'cool': { bg: '#1c1c1c', text: '#b0b0b0', border: '#333333' },
  'high-contrast': { bg: '#000000', text: '#ffffff', border: '#ffffff' },
};

/**
 * Mapeamento de linguagem para aliases comuns
 */
const LANGUAGE_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  jsx: 'javascript',
  py: 'python',
  rb: 'ruby',
  rs: 'rust',
  go: 'golang',
  sh: 'shell',
  bash: 'shell',
  zsh: 'shell',
  yaml: 'yml',
  json: 'javascript',
  xml: 'markup',
  html: 'markup',
  svg: 'markup',
};

/**
 * Normaliza o nome da linguagem para detecção de sintaxe
 */
function normalizeLanguage(lang?: string): string | undefined {
  if (!lang) return undefined;
  const normalized = lang.toLowerCase().trim();
  return LANGUAGE_ALIASES[normalized] || normalized;
}

/**
 * Simples syntax highlighting (substituto para react-syntax-highlighter)
 * Divide o código em linhas e aplica cores básicas
 */
function highlightCode(code: string, language?: string): Array<{ line: string; highlight: boolean }> {
  if (!code) return [];

  const lines = code.split('\n');
  return lines.map((line) => ({
    line: line || ' ', // Preserva linhas vazias
    highlight: false,
  }));
}

/**
 * Componente para renderização de blocos de código
 *
 * @example
 * ```tsx
 * <CodeBlock
 *   language="typescript"
 *   value="const x = 42;"
 *   showLineNumbers
 *   theme="github-dark"
 * />
 * ```
 */
export function ArchbaseCodeBlock({
  language,
  value,
  className,
  showLineNumbers = false,
  theme = 'github-dark',
}: CodeBlockProps) {
  const mantineTheme = useMantineTheme();
  const normalizedLanguage = normalizeLanguage(language);
  const themeColors = THEME_COLORS[theme] || THEME_COLORS['github-dark'];

  const lines = useMemo(() => {
    if (!value) return [];
    return highlightCode(value, normalizedLanguage);
  }, [value, normalizedLanguage]);

  if (!value) {
    return null;
  }

  const maxLineDigits = lines.length.toString().length;

  return (
    <Paper
      shadow="sm"
      withBorder
      p="md"
      className={className}
      style={{
        backgroundColor: themeColors.bg,
        borderColor: themeColors.border,
        borderRadius: mantineTheme.radius.md,
        overflow: 'auto',
        maxHeight: '600px',
      }}
    >
      {/* Language indicator */}
      {normalizedLanguage && (
        <Box
          pos="absolute"
          top={8}
          right={8}
          px="xs"
          py={4}
          style={{
            backgroundColor: themeColors.border,
            color: themeColors.text,
            borderRadius: mantineTheme.radius.sm,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            fontWeight: 600,
          }}
        >
          {normalizedLanguage}
        </Box>
      )}
      <Code
        block
        style={{
          color: themeColors.text,
          fontFamily: '"Fira Code", "JetBrains Mono", Consolas, Monaco, monospace',
          fontSize: '0.875rem',
          lineHeight: '1.7',
          backgroundColor: 'transparent',
          padding: 0,
          paddingTop: showLineNumbers ? '1.5rem' : 0,
        }}
      >
        {lines.map((line, index) => (
          <div key={index} style={{ display: 'flex', gap: '1rem' }}>
            {showLineNumbers && (
              <span
                style={{
                  color: mantineTheme.colors.gray[6],
                  minWidth: `${maxLineDigits}ch`,
                  textAlign: 'right',
                  userSelect: 'none',
                  opacity: 0.5,
                }}
              >
                {index + 1}
              </span>
            )}
            <span style={{ whiteSpace: 'pre' }}>{line.line}</span>
          </div>
        ))}
      </Code>
    </Paper>
  );
}

/**
 * Componente para código inline
 */
export function ArchbaseInlineCode({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const mantineTheme = useMantineTheme();

  return (
    <Code
      className={className}
      style={{
        backgroundColor: mantineTheme.colors.gray[1],
        color: mantineTheme.colors.gray[9],
        padding: '0.125rem 0.375rem',
        borderRadius: mantineTheme.radius.sm,
        fontSize: '0.875em',
        fontFamily: '"Fira Code", "JetBrains Mono", Consolas, Monaco, monospace',
      }}
    >
      {children}
    </Code>
  );
}
