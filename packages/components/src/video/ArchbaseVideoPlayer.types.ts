import type { CSSProperties, ReactNode } from 'react';

/**
 * Formatos de vídeo suportados
 */
export type VideoFormat = 'mp4' | 'webm' | 'ogg' | 'mov' | 'avi' | 'mkv' | 'm4v' | 'flv' | 'wmv';

/**
 * Source do vídeo
 */
export type VideoSource =
  | string // URL
  | { src: string; type?: string }
  | { url: string }
  | { base64: string }
  | File
  | Blob;

/**
 * Qualidade de vídeo disponível
 */
export interface VideoQuality {
  label: string;
  src: string;
  type?: string;
  res?: { width: number; height: number };
  bitrate?: number;
}

/**
 * Faixa de legenda
 */
export interface TextTrack {
  kind: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
  src: string;
  srclang: string;
  label: string;
  default?: boolean;
}

/**
 * Estado do player
 */
export type PlayerState =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'playing'
  | 'paused'
  | 'ended'
  | 'error';

/**
 * Estado de buffer
 */
export interface BufferState {
  start: number;
  end: number;
  length: number;
}

/**
 * Ações da toolbar
 */
export interface VideoToolbarActions {
  playPause?: boolean;
  volume?: boolean;
  fullscreen?: boolean;
  pictureInPicture?: boolean;
  currentTime?: boolean;
  duration?: boolean;
  progressBar?: boolean;
  settings?: boolean;
  subtitles?: boolean;
  download?: boolean;
}

/**
 * Opções de reprodução automática
 */
export type AutoplayBehavior = boolean | 'muted' | 'any' | 'play';

/**
 * Props do componente ArchbaseVideoPlayer
 */
export interface ArchbaseVideoPlayerProps {
  /** Source do vídeo */
  src: VideoSource | VideoSource[];

  /** --- Reprodução --- */
  /** Reproduzir automaticamente */
  autoplay?: AutoplayBehavior;
  /** Repetir vídeo */
  loop?: boolean;
  /** Mutar por padrão */
  muted?: boolean;
  /** Volume inicial (0-1) */
  volume?: number;
  /** Tempo inicial (segundos) */
  startTime?: number;

  /** --- Qualidade --- */
  /** Lista de qualidades disponíveis */
  qualities?: VideoQuality[];
  /** Qualidade selecionada */
  defaultQuality?: string;

  /** --- Legendas --- */
  /** Faixas de legendas */
  textTracks?: TextTrack[];
  /** Mostrar legendas por padrão */
  defaultSubtitles?: boolean;

  /** --- Toolbar --- */
  /** Mostrar controles */
  controls?: boolean;
  /** Ações disponíveis na toolbar */
  toolbarActions?: VideoToolbarActions | boolean;
  /** Toolbar sempre visível */
  alwaysShowControls?: boolean;
  /** Esconder toolbar após inatividade */
  hideControlsOnIdle?: boolean;
  /** Tempo de inatividade (ms) */
  idleTimeout?: number;

  /** --- Pôster --- */
  /** Imagem de capa */
  poster?: string;

  /** --- Layout --- */
  /** Largura */
  width?: string | number;
  /** Altura */
  height?: string | number;
  /** Modo de ajuste */
  fit?: 'contain' | 'cover' | 'fill' | 'none';
  /** Aspect ratio */
  aspectRatio?: `${number}:${number}` | '16:9' | '4:3' | '21:9';

  /** --- Estilização --- */
  style?: CSSProperties;
  className?: string;
  containerClassName?: string;
  /** Cor de destaque (progress bar, etc) */
  accentColor?: string;

  /** --- Estados --- */
  disabled?: boolean;
  loading?: ReactNode;
  error?: ReactNode;
  noData?: ReactNode;

  /** --- Eventos --- */
  onLoadStart?: () => void;
  onLoadedMetadata?: (metadata: { duration: number; width: number; height: number }) => void;
  onCanPlay?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onProgress?: (buffered: BufferState[]) => void;
  onVolumeChange?: (volume: number, muted: boolean) => void;
  onSeeking?: () => void;
  onSeeked?: (time: number) => void;
  onRateChange?: (rate: number) => void;
  onQualityChange?: (quality: string) => void;
  onSubtitleToggle?: (enabled: boolean) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  onPiPChange?: (isPiP: boolean) => void;
  onError?: (error: MediaError | Error) => void;

  /** --- Acessibilidade --- */
  ariaLabel?: string;
  title?: string;

  /** --- Outros --- */
  /** Velocidade de reprodução disponíveis */
  playbackRates?: number[];
  /** Desabilitar clique na tela para play/pause */
  disableClickToPlay?: boolean;
  /** Desabilitar atalhos de teclado */
  disableKeyboard?: boolean;
  /** Preload */
  preload?: 'none' | 'metadata' | 'auto';
  /** Cross origin */
  crossOrigin?: 'anonymous' | 'use-credentials';
}

/**
 * Props para sub-componentes
 */
export interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  buffered: BufferState[];
  isFullscreen: boolean;
  isPiP: boolean;
  hasSubtitles: boolean;
  subtitlesEnabled: boolean;
  playbackRate: number;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onVolumeChange: (volume: number) => void;
  onSeek: (time: number) => void;
  onFullscreenToggle: () => void;
  onPiPToggle: () => void;
  onSubtitleToggle: () => void;
  onRateChange: (rate: number) => void;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  buffered: BufferState[];
  onSeek: (time: number) => void;
  accentColor?: string;
  disabled?: boolean;
}
