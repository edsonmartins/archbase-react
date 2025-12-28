/**
 * ArchbaseMarkdown - Markdown Renderer Component
 *
 * Baseado em react-markdown com plugins remark/rehype.
 * Suporta GitHub Flavored Markdown, syntax highlighting,
 * HTML inline, e componentes customizados.
 */

// Main component
export { ArchbaseMarkdown } from './ArchbaseMarkdown';

// Sub-components
export { ArchbaseCodeBlock, ArchbaseInlineCode } from './components/CodeBlock';
export { ArchbaseLinkRenderer } from './components/LinkRenderer';

// Types
export type {
  ArchbaseMarkdownProps,
  CodeOptions,
  CodeInlineStyle,
  LinkOptions,
  ListOptions,
  PluginOptions,
  CustomComponents,
  SyntaxHighlightTheme,
  TableOptions,
  CodeBlockProps,
  LinkRendererProps,
} from './ArchbaseMarkdown.types';
