import { useEffect, useMemo, useState, type ReactNode } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeExternalLinks from 'rehype-external-links';
import { Box, Paper, Text, Group, Stack, LoadingOverlay } from '@mantine/core';
import { ArchbaseCodeBlock, ArchbaseInlineCode } from './components/CodeBlock';
import { ArchbaseLinkRenderer } from './components/LinkRenderer';
import type {
  ArchbaseMarkdownProps,
  CustomComponents,
  SyntaxHighlightTheme,
} from './ArchbaseMarkdown.types';

/**
 * Tema padrão para syntax highlighting
 */
const DEFAULT_HIGHLIGHT_THEME: SyntaxHighlightTheme = 'github-dark';

/**
 * Componente ArchbaseMarkdown - Renderização de Markdown em React
 *
 * Baseado em react-markdown com plugins remark/rehype.
 *
 * @example
 * ```tsx
 * <ArchbaseMarkdown>
 *   # Título
 *
 *   Este é um parágrafo com **negrito** e *itálico*.
 *
 *   ```typescript
 *   const x = 42;
 *   ```
 * </ArchbaseMarkdown>
 * ```
 */
export function ArchbaseMarkdown({
  children,
  codeOptions = {},
  linkOptions = {},
  tableOptions = {},
  listOptions = {},
  pluginOptions = {},
  components: customComponents = {},
  style,
  className,
  contentClassName,
  disabled = false,
  loading,
  error,
  ariaLabel,
  role = 'article',
  onLoadStart,
  onLoadEnd,
  onError,
  onLinkClick,
  skipHtml = false,
  unwrapDisallowed = false,
}: ArchbaseMarkdownProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Opções de código com valores padrão
  const finalCodeOptions = {
    highlightEnabled: true,
    showLineNumbers: true,
    defaultLanguage: 'text',
    inlineStyle: 'inline' as const,
    ...codeOptions,
  };

  // Opções de links com valores padrão
  const finalLinkOptions = {
    openExternalInNewTab: true,
    externalNoFollow: true,
    externalNoOpener: true,
    ...linkOptions,
  };

  // Opções de plugins com valores padrão
  const finalPluginOptions = {
    remarkGfm: true,
    rehypeRaw: false,
    remarkPlugins: [],
    rehypePlugins: [],
    ...pluginOptions,
  };

  // Constrói array de plugins remark
  const remarkPlugins = useMemo(() => {
    const plugins: typeof finalPluginOptions.remarkPlugins = [
      ...(finalPluginOptions.remarkPlugins || []),
    ];

    if (finalPluginOptions.remarkGfm) {
      plugins.push(remarkGfm);
    }

    return plugins;
  }, [finalPluginOptions.remarkPlugins, finalPluginOptions.remarkGfm]);

  // Constrói array de plugins rehype
  const rehypePlugins = useMemo(() => {
    const plugins: typeof finalPluginOptions.rehypePlugins = [
      ...(finalPluginOptions.rehypePlugins || []),
    ];

    if (finalPluginOptions.rehypeRaw) {
      plugins.push(rehypeRaw);
    }

    plugins.push([
      rehypeExternalLinks,
      {
        target: '_blank',
        rel: ['noopener', 'noreferrer'],
      },
    ]);

    return plugins;
  }, [finalPluginOptions.rehypePlugins, finalPluginOptions.rehypeRaw]);

  // Componentes customizados
  const components: CustomComponents = {
    ...customComponents,

    // Parágrafos
    p: ({ node, children, ...props }) => (
      <Text
        component="p"
        mb="sm"
        style={{ lineHeight: 1.7 }}
        {...props}
      >
        {children}
      </Text>
    ),

    // Headings
    h1: ({ node, children, ...props }) => (
      <Text component="h1" size="xl" fw={700} mt="xl" mb="md" {...props}>
        {children}
      </Text>
    ),
    h2: ({ node, children, ...props }) => (
      <Text component="h2" size="lg" fw={600} mt="lg" mb="sm" {...props}>
        {children}
      </Text>
    ),
    h3: ({ node, children, ...props }) => (
      <Text component="h3" size="md" fw={600} mt="md" mb="xs" {...props}>
        {children}
      </Text>
    ),
    h4: ({ node, children, ...props }) => (
      <Text component="h4" size="sm" fw={600} mt="sm" mb="xs" {...props}>
        {children}
      </Text>
    ),
    h5: ({ node, children, ...props }) => (
      <Text component="h5" size="sm" fw={500} mt="xs" mb="xs" {...props}>
        {children}
      </Text>
    ),
    h6: ({ node, children, ...props }) => (
      <Text component="h6" size="xs" fw={500} mt="xs" mb="xs" {...props}>
        {children}
      </Text>
    ),

    // Listas
    ul: ({ node, children, className, ...props }) => (
      <Box
        component="ul"
        className={className || listOptions.listClassName}
        pl="lg"
        mb="md"
        style={{ listStyleType: 'disc' }}
        {...props}
      >
        {children}
      </Box>
    ),
    ol: ({ node, children, className, ordered, ...props }) => (
      <Box
        component="ol"
        className={className || listOptions.listClassName}
        pl="lg"
        mb="md"
        style={{
          listStyleType: listOptions.orderedListStyle || 'decimal',
        }}
        {...props}
      >
        {children}
      </Box>
    ),
    li: ({ node, children, className, ...props }) => (
      <Text
        component="li"
        className={className || listOptions.itemClassName}
        mb="xs"
        style={{ lineHeight: 1.7 }}
        {...props}
      >
        {children}
      </Text>
    ),

    // Blockquote
    blockquote: ({ node, children, ...props }) => (
      <Paper
        withBorder
        p="md"
        mb="md"
        pl="xl"
        style={{
          borderLeftWidth: '4px',
          borderLeftStyle: 'solid',
          borderLeftColor: 'var(--mantine-color-blue-6)',
          backgroundColor: 'var(--mantine-color-blue-0)',
        }}
        {...props}
      >
        <Text size="sm" c="dimmed" style={{ lineHeight: 1.7, fontStyle: 'italic' }}>
          {children}
        </Text>
      </Paper>
    ),

    // Código inline
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      if (!inline && language) {
        return (
          <ArchbaseCodeBlock
            language={language}
            value={String(children).replace(/\n$/, '')}
            showLineNumbers={finalCodeOptions.showLineNumbers}
            theme={finalCodeOptions.highlightTheme || DEFAULT_HIGHLIGHT_THEME}
          />
        );
      }

      return <ArchbaseInlineCode>{children}</ArchbaseInlineCode>;
    },

    // Tabelas
    table: ({ node, children, ...props }) => {
      const striped = tableOptions.striped ?? true;
      const hover = tableOptions.hover ?? true;
      const bordered = tableOptions.bordered ?? true;

      return (
        <Box
          style={{
            overflowX: 'auto',
            width: '100%',
            marginBottom: '1rem',
          }}
        >
          <Box
            component="table"
            className={tableOptions.tableClassName}
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: bordered ? '1px solid var(--mantine-color-gray-3)' : 'none',
            }}
            {...props}
          >
            {children}
          </Box>
        </Box>
      );
    },
    thead: ({ node, children, ...props }) => (
      <Box
        component="thead"
        className={tableOptions.headerClassName}
        style={{
          backgroundColor: 'var(--mantine-color-gray-0)',
        }}
        {...props}
      >
        {children}
      </Box>
    ),
    tbody: ({ node, children, ...props }) => (
      <Box component="tbody" className={tableOptions.bodyClassName} {...props}>
        {children}
      </Box>
    ),
    tr: ({ node, children, ...props }) => (
      <Box
        component="tr"
        style={{
          borderBottom: '1px solid var(--mantine-color-gray-3)',
        }}
        {...props}
      >
        {children}
      </Box>
    ),
    th: ({ node, children, ...props }) => (
      <Box
        component="th"
        style={{
          padding: '0.75rem',
          textAlign: 'left',
          fontWeight: 600,
          borderBottom: '2px solid var(--mantine-color-gray-4)',
        }}
        {...props}
      >
        {children}
      </Box>
    ),
    td: ({ node, children, ...props }) => (
      <Box
        component="td"
        style={{
          padding: '0.75rem',
        }}
        {...props}
      >
        {children}
      </Box>
    ),

    // Links
    a: ({ node, href, children, ...props }) => (
      <ArchbaseLinkRenderer
        href={href}
        openExternalInNewTab={finalLinkOptions.openExternalInNewTab}
        onClick={onLinkClick}
        {...props}
      >
        {children}
      </ArchbaseLinkRenderer>
    ),

    // Imagens
    img: ({ node, src, alt, ...props }) => (
      <Box
        component="img"
        src={src}
        alt={alt}
        style={{
          maxWidth: '100%',
          height: 'auto',
          borderRadius: 'var(--mantine-radius-md)',
          margin: '1rem 0',
        }}
        {...props}
      />
    ),

    // HR
    hr: ({ node, ...props }) => (
      <Box
        component="hr"
        my="xl"
        style={{
          border: 'none',
          borderTop: '1px solid var(--mantine-color-gray-3)',
        }}
        {...props}
      />
    ),

    // Strong/Bold
    strong: ({ node, children, ...props }) => (
      <Text span fw={700} {...props}>
        {children}
      </Text>
    ),

    // Em/Italic
    em: ({ node, children, ...props }) => (
      <Text span italic {...props}>
        {children}
      </Text>
    ),

    // Del/Strikethrough
    del: ({ node, children, ...props }) => (
      <Text span td="line-through" c="dimmed" {...props}>
        {children}
      </Text>
    ),
  };

  // Lifecycle
  useEffect(() => {
    if (disabled) return;

    setIsLoading(true);
    setHasError(false);
    setErrorMessage(null);
    onLoadStart?.();

    try {
      // Simula processamento
      setIsLoading(false);
      onLoadEnd?.();
    } catch (err) {
      setIsLoading(false);
      setHasError(true);
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
      onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  }, [children, disabled, onLoadStart, onLoadEnd, onError]);

  // Render
  if (disabled) {
    return (
      <Text c="dimmed" style={{ fontStyle: 'italic' }}>
        Markdown rendering is disabled
      </Text>
    );
  }

  if (hasError) {
    return (
      <Paper withBorder p="md" c="red">
        {error || <Text>Failed to render markdown: {errorMessage}</Text>}
      </Paper>
    );
  }

  return (
    <Box
      className={className}
      style={style}
      aria-label={ariaLabel}
      role={role}
    >
      <LoadingOverlay visible={isLoading} />
      {isLoading && loading}

      {!isLoading && (
        <Box className={contentClassName}>
          <ReactMarkdown
            remarkPlugins={remarkPlugins}
            rehypePlugins={rehypePlugins}
            skipHtml={skipHtml}
            unwrapDisallowed={unwrapDisallowed}
            components={components as Components}
          >
            {children}
          </ReactMarkdown>
        </Box>
      )}
    </Box>
  );
}

ArchbaseMarkdown.displayName = 'ArchbaseMarkdown';
