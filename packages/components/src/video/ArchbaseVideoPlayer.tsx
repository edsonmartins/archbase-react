import { useEffect, useState, type ReactNode } from 'react';
import {
  Box,
  Group,
  ActionIcon,
  Progress,
  Text,
  Slider,
  Menu,
  Button,
  Stack,
  Center,
  LoadingOverlay,
  Paper,
  Tooltip,
} from '@mantine/core';
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerSkipForward,
  IconPlayerSkipBack,
  IconVolume,
  IconVolume3,
  IconMaximize,
  IconMinimize,
  IconPictureInPicture,
  IconSettings,
  IconSubmarine,
  IconX,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useArchbaseTranslation } from '@archbase/core';
import { useVideoPlayer } from './hooks/useVideoPlayer';
import type {
  ArchbaseVideoPlayerProps,
  VideoControlsProps,
  ProgressBarProps,
} from './ArchbaseVideoPlayer.types';

/**
 * Formata tempo em segundos para MM:SS ou HH:MM:SS
 */
function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00';

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Componente de barra de progresso do vídeo
 */
function VideoProgressBar({
  currentTime,
  duration,
  buffered,
  onSeek,
  accentColor,
  disabled = false,
}: ProgressBarProps) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Calcula buffered progress
  const bufferedSegments = buffered.map((b) => ({
    start: duration > 0 ? (b.start / duration) * 100 : 0,
    end: duration > 0 ? (b.end / duration) * 100 : 0,
  }));

  const handleSeek = (value: number) => {
    onSeek((value / 100) * duration);
  };

  return (
    <Box pos="relative" style={{ width: '100%' }}>
      {/* Buffer indicator */}
      <Box
        pos="absolute"
        top={0}
        left={0}
        h="100%"
        style={{
          width: '100%',
          display: 'flex',
          gap: '1px',
        }}
      >
        {bufferedSegments.map((seg, i) => (
          <Box
            key={i}
            style={{
              left: `${seg.start}%`,
              width: `${seg.end - seg.start}%`,
              height: '100%',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            }}
          />
        ))}
      </Box>

      <Progress
        value={progress}
        styles={{
          root: { cursor: disabled ? 'not-allowed' : 'pointer' },
          section: { backgroundColor: accentColor || 'var(--mantine-color-blue-6)' },
        }}
        onClick={(e) => {
          if (disabled) return;
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          const x = e.clientX - rect.left;
          const percentage = x / rect.width;
          handleSeek(percentage * 100);
        }}
      />
    </Box>
  );
}

/**
 * Componente de controles do vídeo
 */
function VideoControls({
  isPlaying,
  isMuted,
  volume,
  currentTime,
  duration,
  buffered,
  isFullscreen,
  isPiP,
  hasSubtitles,
  subtitlesEnabled,
  playbackRate,
  onPlayPause,
  onMuteToggle,
  onVolumeChange,
  onSeek,
  onFullscreenToggle,
  onPiPToggle,
  onSubtitleToggle,
  onRateChange,
}: VideoControlsProps) {
  const { t } = useArchbaseTranslation();

  return (
    <Box
      p="sm"
      style={{
        background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
      }}
    >
      {/* Progress Bar */}
      <Box mb="xs">
        <VideoProgressBar
          currentTime={currentTime}
          duration={duration}
          buffered={buffered}
          onSeek={onSeek}
        />
      </Box>

      {/* Control Bar */}
      <Group justify="space-between" wrap="nowrap">
        <Group gap="xs">
          {/* Play/Pause */}
          <ActionIcon size="lg" variant="filled" onClick={onPlayPause}>
            {isPlaying ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />}
          </ActionIcon>

          {/* Skip buttons */}
          <ActionIcon
            size="sm"
            variant="subtle"
            onClick={() => onSeek(Math.max(0, currentTime - 10))}
            title={String(t('Backward 10s'))}
          >
            <IconPlayerSkipBack size={16} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            variant="subtle"
            onClick={() => onSeek(Math.min(duration, currentTime + 10))}
            title={String(t('Forward 10s'))}
          >
            <IconPlayerSkipForward size={16} />
          </ActionIcon>

          {/* Volume */}
          <Group gap={0}>
            <ActionIcon size="sm" variant="subtle" onClick={onMuteToggle}>
              {isMuted || volume === 0 ? (
                <IconVolume3 size={16} />
              ) : (
                <IconVolume size={16} />
              )}
            </ActionIcon>
            <Slider
              style={{ width: 60 }}
              value={isMuted ? 0 : volume * 100}
              onChange={(v) => {
                const vol = (v as number) / 100;
                onVolumeChange(vol);
                if (vol > 0 && isMuted) {
                  onMuteToggle();
                }
              }}
              size="xs"
            />
          </Group>

          {/* Time */}
          <Text size="xs" c="white" miw={80}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
        </Group>

        <Group gap="xs">
          {/* Subtitles */}
          {hasSubtitles && (
            <ActionIcon
              size="sm"
              variant={subtitlesEnabled ? 'filled' : 'subtle'}
              onClick={onSubtitleToggle}
              title={String(t('Subtitles'))}
            >
              <IconSubmarine size={16} />
            </ActionIcon>
          )}

          {/* Playback Rate */}
          <Menu shadow="md" width={150} position="top">
            <Menu.Target>
              <ActionIcon size="sm" variant="subtle" title={String(t('Playback speed'))}>
                <Text size="xs" fw={500}>
                  {playbackRate}x
                </Text>
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>{t('Playback speed') as ReactNode}</Menu.Label>
              {[0.25, 0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                <Menu.Item
                  key={rate}
                  onClick={() => onRateChange(rate)}
                  leftSection={rate === playbackRate && '✓'}
                >
                  {rate}x
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>

          {/* PiP */}
          <ActionIcon
            size="sm"
            variant="subtle"
            onClick={onPiPToggle}
            title={String(t('Picture in Picture'))}
          >
            <IconPictureInPicture size={16} />
          </ActionIcon>

          {/* Fullscreen */}
          <ActionIcon
            size="sm"
            variant="subtle"
            onClick={onFullscreenToggle}
            title={String(isFullscreen ? t('Exit fullscreen') : t('Fullscreen'))}
          >
            {isFullscreen ? <IconMinimize size={16} /> : <IconMaximize size={16} />}
          </ActionIcon>
        </Group>
      </Group>
    </Box>
  );
}

/**
 * Componente ArchbaseVideoPlayer - Player de vídeo completo
 *
 * @example
 * ```tsx
 * <ArchbaseVideoPlayer
 *   src="/path/to/video.mp4"
 *   poster="/path/to/poster.jpg"
 *   controls
 *   autoplay="muted"
 * />
 * ```
 */
export function ArchbaseVideoPlayer({
  src,
  autoplay = false,
  loop = false,
  muted = false,
  volume = 1,
  startTime = 0,
  qualities,
  defaultQuality,
  textTracks,
  defaultSubtitles = false,
  controls = true,
  toolbarActions = true,
  alwaysShowControls = false,
  hideControlsOnIdle = true,
  idleTimeout = 3000,
  poster,
  width = '100%',
  height = 'auto',
  fit = 'contain',
  aspectRatio,
  style,
  className,
  containerClassName,
  accentColor,
  disabled = false,
  loading,
  error,
  noData,
  onLoadStart,
  onLoadedMetadata,
  onCanPlay,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onProgress,
  onVolumeChange,
  onSeeking,
  onSeeked,
  onRateChange,
  onQualityChange,
  onSubtitleToggle,
  onFullscreenChange,
  onPiPChange,
  onError,
  ariaLabel,
  title,
  playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2],
  disableClickToPlay = false,
  disableKeyboard = false,
  preload = 'metadata',
  crossOrigin,
}: ArchbaseVideoPlayerProps) {
  const { t } = useArchbaseTranslation();

  const player = useVideoPlayer({
    src,
    autoplay,
    loop,
    muted,
    volume,
    startTime,
    qualities,
    textTracks,
    defaultSubtitles,
    preload,
  });

  // Controls visibility state
  const [controlsVisible, setControlsVisible] = useState(true);
  const [isIdle, setIsIdle] = useState(false);

  // Handle idle timeout
  useEffect(() => {
    if (!hideControlsOnIdle || alwaysShowControls) return;

    let idleTimer: NodeJS.Timeout;

    const resetIdle = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      if (player.isPlaying) {
        idleTimer = setTimeout(() => setIsIdle(true), idleTimeout);
      }
    };

    const container = player.containerRef.current;
    if (container) {
      container.addEventListener('mousemove', resetIdle);
      container.addEventListener('click', resetIdle);
      container.addEventListener('touchstart', resetIdle);
    }

    if (player.isPlaying) {
      idleTimer = setTimeout(() => setIsIdle(true), idleTimeout);
    }

    return () => {
      clearTimeout(idleTimer);
      if (container) {
        container.removeEventListener('mousemove', resetIdle);
        container.removeEventListener('click', resetIdle);
        container.removeEventListener('touchstart', resetIdle);
      }
    };
  }, [hideControlsOnIdle, alwaysShowControls, idleTimeout, player.isPlaying]);

  // Keyboard shortcuts
  useEffect(() => {
    if (disableKeyboard) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const container = player.containerRef.current;
      if (!container || !document.activeElement || !container.contains(document.activeElement)) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          player.togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          player.seek(player.currentTime - 5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          player.seek(player.currentTime + 5);
          break;
        case 'ArrowUp':
          e.preventDefault();
          player.setVolume(Math.min(1, player.volume + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          player.setVolume(Math.max(0, player.volume - 0.1));
          break;
        case 'f':
          e.preventDefault();
          player.toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          player.toggleMute();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [disableKeyboard, player]);

  // Sync callbacks
  useEffect(() => {
    if (player.playerState === 'loading') onLoadStart?.();
  }, [player.playerState, onLoadStart]);

  useEffect(() => {
    if (player.duration > 0) {
      const video = player.videoRef.current;
      onLoadedMetadata?.({
        duration: player.duration,
        width: video?.videoWidth || 0,
        height: video?.videoHeight || 0,
      });
    }
  }, [player.duration, onLoadedMetadata]);

  useEffect(() => {
    if (player.playerState === 'ready') onCanPlay?.();
  }, [player.playerState, onCanPlay]);

  useEffect(() => {
    if (player.isPlaying) onPlay?.();
    else onPause?.();
  }, [player.isPlaying, onPlay, onPause]);

  useEffect(() => {
    if (player.playerState === 'ended') onEnded?.();
  }, [player.playerState, onEnded]);

  useEffect(() => {
    onTimeUpdate?.(player.currentTime, player.duration);
    onProgress?.(player.buffered);
  }, [player.currentTime, player.buffered, onTimeUpdate, onProgress]);

  useEffect(() => {
    onVolumeChange?.(player.volume, player.muted);
  }, [player.volume, player.muted, onVolumeChange]);

  useEffect(() => {
    onRateChange?.(player.playbackRate);
  }, [player.playbackRate, onRateChange]);

  useEffect(() => {
    onFullscreenChange?.(player.isFullscreen);
  }, [player.isFullscreen, onFullscreenChange]);

  useEffect(() => {
    onPiPChange?.(player.isPiP);
  }, [player.isPiP, onPiPChange]);

  // Click to play/pause
  const handleContainerClick = () => {
    if (!disableClickToPlay) {
      player.togglePlay();
    }
  };

  // Error state
  if (player.playerState === 'error') {
    return (
      <Paper
        withBorder
        p="xl"
        style={{ width, height: typeof height === 'number' ? height : undefined }}
        className={containerClassName}
      >
        <Center h="100%">
          <Stack align="center">
            <IconAlertCircle size={48} style={{ color: 'var(--mantine-color-red-6)' }} />
            <Text c="red">{error || t('Failed to load video') as ReactNode}</Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  // No data state
  if (!src) {
    return (
      <Paper
        withBorder
        p="xl"
        style={{ width, height: typeof height === 'number' ? height : undefined }}
        className={containerClassName}
      >
        <Center h="100%">
          <Text c="dimmed">{noData || t('No video source provided') as ReactNode}</Text>
        </Center>
      </Paper>
    );
  }

  // Calculate aspect ratio padding
  const aspectRatioPadding = (() => {
    if (aspectRatio) {
      const [w, h] = aspectRatio.split(':').map(Number);
      return `${(h / w) * 100}%`;
    }
    return '56.25%'; // 16:9 default
  })();

  const shouldShowControls = controls && !disabled && (alwaysShowControls || !isIdle);

  return (
    <Box
      ref={player.containerRef}
      className={containerClassName}
      style={{
        position: 'relative',
        width,
        background: '#000',
        borderRadius: 'var(--mantine-radius-md)',
        overflow: 'hidden',
        ...style,
      }}
      aria-label={ariaLabel || title || 'Video player'}
    >
      {aspectRatio && (
        <Box style={{ paddingTop: aspectRatioPadding }} />
      )}

      <Box
        style={{
          position: aspectRatio ? 'absolute' : 'relative',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={handleContainerClick}
      >
        {/* Loading overlay */}
        {player.playerState === 'loading' && (
          <LoadingOverlay visible />
        )}

        {/* Video element */}
        <video
          ref={player.videoRef}
          className={className}
          style={{
            width: aspectRatio ? '100%' : width,
            height: aspectRatio ? '100%' : height,
            maxHeight: aspectRatio ? undefined : '80vh',
            objectFit: fit,
            cursor: disableClickToPlay ? 'default' : 'pointer',
          }}
          poster={poster}
          crossOrigin={crossOrigin}
          preload={preload}
          onLoadStart={player.handleLoadStart}
          onLoadedMetadata={player.handleLoadedMetadata}
          onCanPlay={player.handleCanPlay}
          onPlay={player.handlePlay}
          onPause={player.handlePause}
          onEnded={player.handleEnded}
          onTimeUpdate={player.handleTimeUpdate}
          onVolumeChange={player.handleVolumeChange}
          onRateChange={player.handleRateChange}
          onError={(e) => {
            player.handleError(e);
            onError?.(e.currentTarget.error || new Error('Video error'));
          }}
          onSeeking={onSeeking}
          onSeeked={() => onSeeked?.(player.currentTime)}
        >
          {player.sources.map((source, i) => (
            <source key={i} src={source.src} type={source.type} />
          ))}

          {textTracks?.map((track, i) => (
            <track
              key={i}
              kind={track.kind}
              src={track.src}
              srcLang={track.srclang}
              label={track.label}
              default={track.default}
            />
          ))}
        </video>

        {/* Play button overlay (when paused) */}
        {!player.isPlaying && player.playerState === 'ready' && !disableClickToPlay && (
          <Center pos="absolute" inset={0}>
            <ActionIcon
              size="xl"
              variant="filled"
              radius="xl"
              onClick={(e) => {
                e.stopPropagation();
                player.play();
              }}
              style={{
                opacity: 0.8,
                transition: 'opacity 0.2s',
              }}
            >
              <IconPlayerPlay size={32} />
            </ActionIcon>
          </Center>
        )}

        {/* Controls */}
        {shouldShowControls && (
          <Box
            pos="absolute"
            inset={0}
            style={{
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
            }}
          >
            <div style={{ pointerEvents: 'auto' }}>
              <VideoControls
                isPlaying={player.isPlaying}
                isMuted={player.muted}
                volume={player.volume}
                currentTime={player.currentTime}
                duration={player.duration}
                buffered={player.buffered}
                isFullscreen={player.isFullscreen}
                isPiP={player.isPiP}
                hasSubtitles={!!textTracks?.length}
                subtitlesEnabled={player.subtitlesEnabled}
                playbackRate={player.playbackRate}
                onPlayPause={player.togglePlay}
                onMuteToggle={player.toggleMute}
                onVolumeChange={player.setVolume}
                onSeek={player.seek}
                onFullscreenToggle={player.toggleFullscreen}
                onPiPToggle={player.togglePiP}
                onSubtitleToggle={() => {
                  const newState = !player.subtitlesEnabled;
                  player.setSubtitlesEnabled(newState);
                  onSubtitleToggle?.(newState);
                }}
                onRateChange={(rate) => {
                  player.setPlaybackRate(rate);
                }}
              />
            </div>
          </Box>
        )}
      </Box>
    </Box>
  );
}

ArchbaseVideoPlayer.displayName = 'ArchbaseVideoPlayer';
