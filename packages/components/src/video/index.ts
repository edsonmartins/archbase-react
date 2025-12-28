/**
 * ArchbaseVideoPlayer - Video Player Component
 *
 * Player de vídeo completo com controles customizados,
 * suporte a múltiplas qualidades, legendas,
 * Picture-in-Picture, e fullscreen.
 */

// Main component
export { ArchbaseVideoPlayer } from './ArchbaseVideoPlayer';

// Hook
export { useVideoPlayer } from './hooks/useVideoPlayer';

// Types
export type {
  ArchbaseVideoPlayerProps,
  VideoSource,
  VideoFormat,
  VideoQuality,
  TextTrack,
  PlayerState,
  BufferState,
  VideoToolbarActions,
  AutoplayBehavior,
  VideoControlsProps,
  ProgressBarProps,
} from './ArchbaseVideoPlayer.types';
