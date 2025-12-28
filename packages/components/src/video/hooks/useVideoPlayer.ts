import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  VideoSource,
  PlayerState,
  BufferState,
  VideoQuality,
  TextTrack,
  AutoplayBehavior,
} from '../ArchbaseVideoPlayer.types';

interface UseVideoPlayerOptions {
  src: VideoSource | VideoSource[];
  autoplay?: AutoplayBehavior;
  loop?: boolean;
  muted?: boolean;
  volume?: number;
  startTime?: number;
  qualities?: VideoQuality[];
  textTracks?: TextTrack[];
  defaultSubtitles?: boolean;
  preload?: 'none' | 'metadata' | 'auto';
}

/**
 * Hook customizado para gerenciar estado e lógica do player de vídeo
 */
export function useVideoPlayer({
  src,
  autoplay = false,
  loop = false,
  muted = false,
  volume = 1,
  startTime = 0,
  qualities,
  textTracks,
  defaultSubtitles = false,
  preload = 'metadata',
}: UseVideoPlayerOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Player state
  const [playerState, setPlayerState] = useState<PlayerState>('idle');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState<BufferState[]>([]);
  const [volumeState, setVolumeState] = useState({ volume, muted });
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<string | undefined>(
    qualities?.[0]?.label
  );
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(defaultSubtitles);

  // Normaliza source para array
  const sources = useMemoSources(src);

  // Video element handlers
  const handleLoadStart = useCallback(() => {
    setPlayerState('loading');
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
      if (startTime > 0) {
        video.currentTime = startTime;
      }
      setPlayerState('ready');

      // Handle autoplay
      if (autoplay) {
        if (autoplay === 'muted' || autoplay === 'any') {
          video.muted = true;
          setVolumeState((v) => ({ ...v, muted: true }));
        }
        video.play().catch(() => {
          // Auto-play was blocked, that's ok
        });
      }
    }
  }, [autoplay, startTime]);

  const handleCanPlay = useCallback(() => {
    setPlayerState('ready');
  }, []);

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
    setPlayerState('playing');
  }, []);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    setPlayerState('paused');
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setPlayerState('ended');
    if (loop && videoRef.current) {
      videoRef.current.play();
    }
  }, [loop]);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      setCurrentTime(video.currentTime);

      // Update buffered ranges
      const ranges: BufferState[] = [];
      for (let i = 0; i < video.buffered.length; i++) {
        ranges.push({
          start: video.buffered.start(i),
          end: video.buffered.end(i),
          length: video.buffered.end(i) - video.buffered.start(i),
        });
      }
      setBuffered(ranges);
    }
  }, []);

  const handleVolumeChange = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      setVolumeState({
        volume: video.volume,
        muted: video.muted,
      });
    }
  }, []);

  const handleRateChange = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      setPlaybackRate(video.playbackRate);
    }
  }, []);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    const error = video.error;
    setPlayerState('error');
    console.error('Video error:', error);
  }, []);

  // Control methods
  const play = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  const pause = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback((time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(time, duration));
    }
  }, [duration]);

  const setVolume = useCallback((vol: number) => {
    if (videoRef.current) {
      videoRef.current.volume = Math.max(0, Math.min(1, vol));
      if (vol > 0 && volumeState.muted) {
        videoRef.current.muted = false;
      }
    }
  }, [volumeState.muted]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
    }
  }, []);

  const setPlaybackRateValue = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  }, []);

  const enterFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (container) {
      try {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        }
        setIsFullscreen(true);
      } catch (e) {
        console.warn('Fullscreen not supported', e);
      }
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        await (document as any).webkitExitFullscreen();
      }
      setIsFullscreen(false);
    } catch (e) {
      console.warn('Exit fullscreen error', e);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  const enterPiP = useCallback(async () => {
    if (videoRef.current && 'pictureInPictureEnabled' in document) {
      try {
        await videoRef.current.requestPictureInPicture();
        setIsPiP(true);
      } catch (e) {
        console.warn('PiP not supported', e);
      }
    }
  }, []);

  const exitPiP = useCallback(async () => {
    if (document.pictureInPictureElement) {
      try {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } catch (e) {
        console.warn('Exit PiP error', e);
      }
    }
  }, []);

  const togglePiP = useCallback(() => {
    if (isPiP) {
      exitPiP();
    } else {
      enterPiP();
    }
  }, [isPiP, enterPiP, exitPiP]);

  // Listen for fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Listen for PiP change
  useEffect(() => {
    const handlePiPChange = () => {
      setIsPiP(!!document.pictureInPictureElement);
    };

    document.addEventListener('enterpictureinpicture', handlePiPChange);
    document.addEventListener('leavepictureinpicture', handlePiPChange);
    return () => {
      document.removeEventListener('enterpictureinpicture', handlePiPChange);
      document.removeEventListener('leavepictureinpicture', handlePiPChange);
    };
  }, []);

  return {
    videoRef,
    containerRef,
    playerState,
    isPlaying,
    currentTime,
    duration,
    buffered,
    volume: volumeState.volume,
    muted: volumeState.muted,
    playbackRate,
    isFullscreen,
    isPiP,
    selectedQuality,
    subtitlesEnabled,
    sources,
    // Methods
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    setPlaybackRate: setPlaybackRateValue,
    toggleFullscreen,
    togglePiP,
    setSelectedQuality,
    setSubtitlesEnabled,
    // Event handlers
    handleLoadStart,
    handleLoadedMetadata,
    handleCanPlay,
    handlePlay,
    handlePause,
    handleEnded,
    handleTimeUpdate,
    handleVolumeChange,
    handleRateChange,
    handleError,
  };
}

/**
 * Helper to normalize video source
 */
function useMemoSources(src: VideoSource | VideoSource[]): Array<{ src: string; type?: string }> {
  if (Array.isArray(src)) {
    return src.map((s) => normalizeSource(s));
  }
  return [normalizeSource(src)];
}

function normalizeSource(source: VideoSource): { src: string; type?: string } {
  if (typeof source === 'string') {
    return { src: source };
  }
  if (source instanceof File || source instanceof Blob) {
    return { src: URL.createObjectURL(source), type: source.type };
  }
  if ('src' in source) {
    return { src: source.src, type: source.type };
  }
  if ('url' in source) {
    return { src: source.url };
  }
  if ('base64' in source) {
    const base64 = source.base64.startsWith('data:') ? source.base64 : `data:video/mp4;base64,${source.base64}`;
    return { src: base64 };
  }
  return { src: '' };
}
