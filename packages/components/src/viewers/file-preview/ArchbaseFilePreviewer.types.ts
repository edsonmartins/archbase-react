import type { CSSProperties, ReactNode } from 'react';

/**
 * Tipos de arquivo suportados para preview
 */
export type FileType =
  | 'pdf'
  | 'image'
  | 'video'
  | 'audio'
  | 'text'
  | 'code'
  | 'office'
  | 'unknown';

/**
 * Tipos de imagem suportados
 */
export type ImageType = 'jpg' | 'jpeg' | 'png' | 'gif' | 'bmp' | 'webp' | 'svg' | 'ico';

/**
 * Tipos de vídeo suportados
 */
export type VideoType = 'mp4' | 'webm' | 'ogg' | 'mov' | 'avi' | 'mkv';

/**
 * Tipos de áudio suportados
 */
export type AudioType = 'mp3' | 'wav' | 'ogg' | 'aac' | 'flac';

/**
 * Tipos de texto suportados
 */
export type TextType = 'txt' | 'md' | 'json' | 'xml' | 'html' | 'css' | 'js' | 'ts';

/**
 * Tipos de código suportados
 */
export type CodeType = 'js' | 'ts' | 'jsx' | 'tsx' | 'py' | 'java' | 'c' | 'cpp' | 'go' | 'rs' | 'php' | 'rb' | 'sh';

/**
 * Tipos de Office suportados
 */
export type OfficeType = 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx';

/**
 * Source do arquivo - pode ser URL, File object, ou base64
 */
export type FileSource =
  | string // URL ou base64
  | File // File object do browser
  | Blob // Blob object
  | { url: string }
  | { data: string | ArrayBuffer }
  | { base64: string };

/**
 * Opções de layout para o previewer
 */
export type LayoutMode = 'inline' | 'modal' | 'fullscreen';

/**
 * Opções de toolbar
 */
export interface ToolbarActions {
  download?: boolean;
  print?: boolean;
  zoomIn?: boolean;
  zoomOut?: boolean;
  fitWidth?: boolean;
  fitPage?: boolean;
  rotate?: boolean;
  fullscreen?: boolean;
  close?: boolean;
}

/**
 * Estado de carregamento do arquivo
 */
export type LoadingState = 'idle' | 'loading' | 'loaded' | 'error';

/**
 * Erro de preview
 */
export interface PreviewError {
  code: string;
  message: string;
  details?: string;
}

/**
 * Props do componente ArchbaseFilePreviewer
 */
export interface ArchbaseFilePreviewerProps {
  /** Source do arquivo a ser visualizado */
  file: FileSource;

  /** Tipo do arquivo (opcional, detectado automaticamente) */
  fileType?: FileType;

  /** --- Layout --- */
  /** Modo de exibição */
  layoutMode?: LayoutMode;
  /** Largura do container */
  width?: string | number;
  /** Altura do container */
  height?: string | number;

  /** --- Toolbar --- */
  /** Mostrar toolbar */
  showToolbar?: boolean;
  /** Ações disponíveis na toolbar */
  toolbarActions?: ToolbarActions | boolean;
  /** Posição da toolbar */
  toolbarPosition?: 'top' | 'bottom' | 'both';

  /** --- Opções de PDF --- */
  /** Página inicial */
  initialPage?: number;
  /** Zoom inicial */
  initialScale?: number;
  /** Rotação inicial */
  initialRotation?: number;

  /** --- Opções de Imagem --- */
  /** Ajuste de imagem */
  imageFit?: 'contain' | 'cover' | 'fill' | 'none';
  /** Habilitar zoom em imagens */
  enableImageZoom?: boolean;
  /** Habilitar rotação de imagens */
  enableImageRotation?: boolean;

  /** --- Opções de Texto/Código --- */
  /** Tipos de código para syntax highlighting */
  codeLanguage?: string;
  /** Mostrar números de linha */
  showLineNumbers?: boolean;
  /** Quebra de linha automática */
  wordWrap?: boolean;

  /** --- Estilização --- */
  style?: CSSProperties;
  className?: string;
  contentClassName?: string;

  /** --- Estados --- */
  disabled?: boolean;
  loading?: ReactNode;
  error?: ReactNode;
  noData?: ReactNode;

  /** --- Eventos --- */
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: PreviewError) => void;
  onDownload?: () => void;
  onPrint?: () => void;
  onZoomChange?: (scale: number) => void;
  onPageChange?: (page: number, totalPages: number) => void;
  onRotate?: (rotation: number) => void;
  onFullscreenToggle?: (isFullscreen: boolean) => void;
  onClose?: () => void;

  /** --- Acessibilidade --- */
  ariaLabel?: string;
  title?: string;

  /** --- Outros --- */
  /** Nome do arquivo (para download) */
  fileName?: string;
  /** MIME type (para detecção de tipo) */
  mimeType?: string;
}

/**
 * Props internas para renderizadores de arquivo
 */
export interface FileRendererProps {
  file: FileSource;
  width?: string | number;
  height?: string | number;
  onLoad?: () => void;
  onError?: (error: PreviewError) => void;
  style?: CSSProperties;
  className?: string;
}
