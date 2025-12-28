import type { CSSProperties, ReactNode, ElementType } from 'react';
import type { PluggableList } from 'unified';
import type { Components } from 'react-markdown';

/**
 * Estilo de syntax highlighting para blocos de código
 */
export type SyntaxHighlightTheme =
  | 'atom-one-dark'
  | 'atom-one-light'
  | 'github-dark'
  | 'github-light'
  | 'monokai'
  | 'nord'
  | 'dracula'
  | 'cool'
  | 'high-contrast';

/**
 * Estilo de código inline
 */
export type CodeInlineStyle = 'inline' | 'shiki' | 'none';

/**
 * Opções de renderização de código
 */
export interface CodeOptions {
  /** Habilitar syntax highlighting */
  highlightEnabled?: boolean;
  /** Tema para syntax highlighting */
  highlightTheme?: SyntaxHighlightTheme;
  /** Mostrar números de linha */
  showLineNumbers?: boolean;
  /** Linguagem padrão quando não especificada */
  defaultLanguage?: string;
  /** Estilo de código inline */
  inlineStyle?: CodeInlineStyle;
}

/**
 * Opções de links
 */
export interface LinkOptions {
  /** Abrir links externos em nova aba */
  openExternalInNewTab?: boolean;
  /** Adicionar atributo rel nofollow em links externos */
  externalNoFollow?: boolean;
  /** Adicionar atributo rel noopener em links externos */
  externalNoOpener?: boolean;
  /** Função customizada para validar URLs */
  isUrlCustom?: (url: string) => boolean;
}

/**
 * Opções de tabela
 */
export interface TableOptions {
  /** Classe CSS base para tabelas */
  tableClassName?: string;
  /** Classe CSS para cabeçalho */
  headerClassName?: string;
  /** Classe CSS para corpo */
  bodyClassName?: string;
  /** Habilitar estilo striped */
  striped?: boolean;
  /** Habilitar hover nas linhas */
  hover?: boolean;
  /** Habilitar bordas */
  bordered?: boolean;
}

/**
 * Opções de lista
 */
export interface ListOptions {
  /** Classe CSS base para listas */
  listClassName?: string;
  /** Classe CSS para itens de lista */
  itemClassName?: string;
  /** Estilo de marker para listas ordenadas */
  orderedListStyle?: 'decimal' | 'lower-alpha' | 'upper-alpha' | 'lower-roman' | 'upper-roman';
}

/**
 * Plugin options para remark/rehype
 */
export interface PluginOptions {
  /** Plugins remark customizados */
  remarkPlugins?: PluggableList;
  /** Plugins rehype customizados */
  rehypePlugins?: PluggableList;
  /** Habilitar GitHub Flavored Markdown */
  remarkGfm?: boolean;
  /** Habilitar HTML inline no markdown */
  rehypeRaw?: boolean;
}

/**
 * Configurações de renderização customizada
 * Nota: Usamos Omit para evitar conflitos de tipo com Components de react-markdown
 */
export interface CustomComponents {
  /** Componente customizado para parágrafos */
  p?: ElementType;
  /** Componente customizado para headings */
  h1?: ElementType;
  h2?: ElementType;
  h3?: ElementType;
  h4?: ElementType;
  h5?: ElementType;
  h6?: ElementType;
  /** Componente customizado para listas */
  ul?: ElementType;
  ol?: ElementType;
  li?: ElementType;
  /** Componente customizado para blockquote */
  blockquote?: ElementType;
  /** Componente customizado para código */
  code?: ElementType;
  pre?: ElementType;
  /** Componente customizado para tabelas */
  table?: ElementType;
  thead?: ElementType;
  tbody?: ElementType;
  tr?: ElementType;
  th?: ElementType;
  td?: ElementType;
  /** Componente customizado para links */
  a?: ElementType;
  /** Componente customizado para imagens */
  img?: ElementType;
  /** Componente customizado para HR */
  hr?: ElementType;
  /** Componente customizado para strong/bold */
  strong?: ElementType;
  /** Componente customizado para emphasis/italic */
  em?: ElementType;
  /** Componente customizado para del */
  del?: ElementType;
}

/**
 * Props do componente ArchbaseMarkdown
 */
export interface ArchbaseMarkdownProps {
  /** Conteúdo Markdown a ser renderizado */
  children: string;

  /** --- Opções de Código --- */
  codeOptions?: CodeOptions;

  /** --- Opções de Links --- */
  linkOptions?: LinkOptions;

  /** --- Opções de Tabela --- */
  tableOptions?: TableOptions;

  /** --- Opções de Lista --- */
  listOptions?: ListOptions;

  /** --- Opções de Plugins --- */
  pluginOptions?: PluginOptions;

  /** --- Componentes Customizados --- */
  components?: CustomComponents;

  /** --- Estilização --- */
  style?: CSSProperties;
  className?: string;
  contentClassName?: string;

  /** --- Estados --- */
  disabled?: boolean;
  loading?: ReactNode;
  error?: ReactNode;

  /** --- Eventos --- */
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: Error) => void;
  onLinkClick?: (href: string) => void | boolean;

  /** --- Acessibilidade --- */
  ariaLabel?: string;
  role?: string;

  /** --- Outros --- */
  /** Permitir saltos de linha extras */
  skipHtml?: boolean;
  /** Desabilitar quebras de linha automáticas */
  unwrapDisallowed?: boolean;
}

/**
 * Props internas para componentes de código
 */
export interface CodeBlockProps {
  language?: string;
  value?: string;
  className?: string;
  showLineNumbers?: boolean;
  theme?: SyntaxHighlightTheme;
}

/**
 * Props internas para link renderer
 */
export interface LinkRendererProps {
  href?: string;
  children?: ReactNode;
  openExternalInNewTab?: boolean;
  onClick?: (href: string) => void | boolean;
}
