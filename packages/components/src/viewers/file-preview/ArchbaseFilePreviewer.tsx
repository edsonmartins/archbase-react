import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Box,
  Paper,
  Group,
  Text,
  ActionIcon,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Alert,
  Button,
  Center,
} from '@mantine/core';
import {
  IconDownload,
  IconZoomIn,
  IconZoomOut,
  IconRotate,
  IconMaximize as IconFullscreen,
  IconX,
  IconFile,
  IconAlertCircle,
} from '@tabler/icons-react';
import { useArchbaseTranslation } from '@archbase/core';
import type {
  ArchbaseFilePreviewerProps,
  FileRendererProps,
  LoadingState,
  PreviewError,
} from './ArchbaseFilePreviewer.types';
import {
  detectFileType,
  isFileTypeSupported,
  getUnsupportedMessage,
  fileSourceToUrl,
  revokeFileUrl,
} from './utils/fileTypeDetector';

/**
 * Renderizador de PDF (usando react-pdf)
 */
function PDFRenderer({ file, width, height, onLoad, onError }: FileRendererProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        const url = await fileSourceToUrl(file);
        setPdfUrl(url);
        onLoad?.();
      } catch (e) {
        onError?.({
          code: 'PDF_LOAD_ERROR',
          message: 'Failed to load PDF',
          details: e instanceof Error ? e.message : String(e),
        });
      }
    };

    loadPdf();

    return () => {
      if (pdfUrl) revokeFileUrl(pdfUrl);
    };
  }, [file]);

  if (!pdfUrl) {
    return (
      <Center h="100%">
        <LoadingOverlay visible />
      </Center>
    );
  }

  // Usa iframe para renderização simples de PDF
  // Para funcionalidades mais avançadas, usar ArchbasePDFViewer
  return (
    <iframe
      src={`${pdfUrl}#toolbar=1&navpanes=1`}
      style={{
        width: width || '100%',
        height: height || '100%',
        border: 'none',
      }}
      title="PDF Preview"
    />
  );
}

/**
 * Renderizador de Imagem
 */
function ImageRenderer({ file, width, height, onLoad, onError, style, className }: FileRendererProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const url = await fileSourceToUrl(file);
        setImageUrl(url);
        onLoad?.();
      } catch (e) {
        setImageError(true);
        onError?.({
          code: 'IMAGE_LOAD_ERROR',
          message: 'Failed to load image',
          details: e instanceof Error ? e.message : String(e),
        });
      }
    };

    loadImage();

    return () => {
      if (imageUrl) revokeFileUrl(imageUrl);
    };
  }, [file]);

  if (imageError) {
    return (
      <Center h="100%">
        <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
          Failed to load image
        </Alert>
      </Center>
    );
  }

  if (!imageUrl) {
    return (
      <Center h="100%">
        <LoadingOverlay visible />
      </Center>
    );
  }

  return (
    <Center h="100%">
      <img
        src={imageUrl}
        alt="Preview"
        className={className}
        style={{
          maxWidth: width || '100%',
          maxHeight: height || '100%',
          objectFit: 'contain',
          ...style,
        }}
        onLoad={() => onLoad?.()}
        onError={() => {
          setImageError(true);
          onError?.({
            code: 'IMAGE_RENDER_ERROR',
            message: 'Failed to render image',
          });
        }}
      />
    </Center>
  );
}

/**
 * Renderizador de Vídeo
 */
function VideoRenderer({ file, width, height, onLoad, onError }: FileRendererProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const url = await fileSourceToUrl(file);
        setVideoUrl(url);
        onLoad?.();
      } catch (e) {
        onError?.({
          code: 'VIDEO_LOAD_ERROR',
          message: 'Failed to load video',
          details: e instanceof Error ? e.message : String(e),
        });
      }
    };

    loadVideo();

    return () => {
      if (videoUrl) revokeFileUrl(videoUrl);
    };
  }, [file]);

  if (!videoUrl) {
    return (
      <Center h="100%">
        <LoadingOverlay visible />
      </Center>
    );
  }

  return (
    <video
      src={videoUrl}
      controls
      style={{
        width: width || '100%',
        height: height || '100%',
        maxHeight: '600px',
      }}
      onLoadStart={() => onLoad?.()}
    />
  );
}

/**
 * Renderizador de Áudio
 */
function AudioRenderer({ file, onLoad, onError }: FileRendererProps) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const loadAudio = async () => {
      try {
        const url = await fileSourceToUrl(file);
        setAudioUrl(url);
        onLoad?.();
      } catch (e) {
        onError?.({
          code: 'AUDIO_LOAD_ERROR',
          message: 'Failed to load audio',
          details: e instanceof Error ? e.message : String(e),
        });
      }
    };

    loadAudio();

    return () => {
      if (audioUrl) revokeFileUrl(audioUrl);
    };
  }, [file]);

  if (!audioUrl) {
    return (
      <Center h="100%">
        <LoadingOverlay visible />
      </Center>
    );
  }

  return (
    <Center h="100%">
      <audio src={audioUrl} controls style={{ width: '100%' }} />
    </Center>
  );
}

/**
 * Renderizador de Texto
 */
function TextRenderer({ file, width, height, onLoad, onError, className }: FileRendererProps) {
  const [textContent, setTextContent] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadText = async () => {
      try {
        let text = '';

        if (typeof file === 'string' && file.startsWith('data:')) {
          // Base64 encoded text
          const base64Data = file.split(',')[1];
          text = atob(base64Data);
        } else if (typeof file === 'object' && file !== null) {
          if ('base64' in file && file.base64) {
            const base64Data = file.base64.split(',')[1] || file.base64;
            text = atob(base64Data);
          } else if ('data' in file && file.data) {
            if (typeof file.data === 'string') {
              text = file.data;
            } else if (file.data instanceof ArrayBuffer) {
              text = new TextDecoder().decode(file.data);
            }
          } else if ('url' in file && file.url) {
            const response = await fetch(file.url);
            text = await response.text();
          }
        } else if (file instanceof Blob || file instanceof File) {
          text = await file.text();
        } else if (typeof file === 'string') {
          const response = await fetch(file);
          text = await response.text();
        }

        setTextContent(text);
        onLoad?.();
      } catch (e) {
        setError(true);
        onError?.({
          code: 'TEXT_LOAD_ERROR',
          message: 'Failed to load text',
          details: e instanceof Error ? e.message : String(e),
        });
      }
    };

    loadText();
  }, [file]);

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
        Failed to load text content
      </Alert>
    );
  }

  if (textContent === null) {
    return (
      <Center h="100%">
        <LoadingOverlay visible />
      </Center>
    );
  }

  return (
    <ScrollArea.Autosize
      mah={height || 400}
      type="auto"
      offsetScrollbars
    >
      <pre
        className={className}
        style={{
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          lineHeight: '1.5',
          padding: '1rem',
          margin: 0,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {textContent}
      </pre>
    </ScrollArea.Autosize>
  );
}

/**
 * Renderizador de arquivos não suportados
 */
function UnsupportedRenderer({ fileType, fileName }: { fileType: string; fileName?: string }) {
  const message = getUnsupportedMessage(fileType as any, fileName);

  return (
    <Center h="100%">
      <Stack align="center" gap="md" p="xl">
        <IconFile size={64} opacity={0.3} />
        <Text size="lg" fw={500} ta="center">
          Preview not available
        </Text>
        <Text size="sm" c="dimmed" ta="center" maw={400}>
          {message}
        </Text>
      </Stack>
    </Center>
  );
}

/**
 * Componente ArchbaseFilePreviewer - Preview de múltiplos tipos de arquivo
 *
 * Suporta: PDF, Imagens, Vídeos, Áudio, Texto
 *
 * @example
 * ```tsx
 * <ArchbaseFilePreviewer
 *   file="/path/to/file.pdf"
 *   layoutMode="inline"
 *   showToolbar
 * />
 * ```
 */
export function ArchbaseFilePreviewer({
  file,
  fileType: fileTypeProp,
  layoutMode = 'inline',
  width = '100%',
  height = 600,
  showToolbar = true,
  toolbarActions = true,
  toolbarPosition = 'top',
  initialPage = 1,
  initialScale = 1,
  initialRotation = 0,
  imageFit = 'contain',
  enableImageZoom = true,
  enableImageRotation = true,
  codeLanguage,
  showLineNumbers = false,
  wordWrap = true,
  style,
  className,
  contentClassName,
  disabled = false,
  loading,
  error,
  noData,
  onLoadStart,
  onLoadEnd,
  onError,
  onDownload,
  onPrint,
  onZoomChange,
  onPageChange,
  onRotate,
  onFullscreenToggle,
  onClose,
  ariaLabel,
  title,
  fileName,
  mimeType,
}: ArchbaseFilePreviewerProps) {
  const { t } = useArchbaseTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Estado interno
  const [detectedFileType, setDetectedFileType] = useState<string>('unknown');
  const [loadingState, setLoadingState] = useState<LoadingState>('idle');
  const [previewError, setPreviewError] = useState<PreviewError | null>(null);
  const [scale, setScale] = useState(initialScale);
  const [rotation, setRotation] = useState(initialRotation);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Detecta tipo de arquivo
  useEffect(() => {
    const detectType = async () => {
      if (fileTypeProp) {
        setDetectedFileType(fileTypeProp);
        return;
      }

      setLoadingState('loading');
      onLoadStart?.();

      try {
        const type = await detectFileType(file, mimeType, fileName);
        setDetectedFileType(type);
        setLoadingState('loaded');
        onLoadEnd?.();
      } catch (e) {
        const err = {
          code: 'FILE_TYPE_DETECTION_ERROR',
          message: 'Failed to detect file type',
          details: e instanceof Error ? e.message : String(e),
        };
        setLoadingState('error');
        setPreviewError(err);
        onError?.(err);
      }
    };

    detectType();
  }, [file, fileTypeProp, mimeType, fileName]);

  // Download handler
  const handleDownload = useCallback(async () => {
    try {
      const url = await fileSourceToUrl(file);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || `download-${detectedFileType}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      onDownload?.();
    } catch (e) {
      console.error('Download failed:', e);
    }
  }, [file, fileName, detectedFileType, onDownload]);

  // Print handler
  const handlePrint = useCallback(() => {
    if (containerRef.current) {
      const content = window.open('', '', 'width=800,height=600');
      if (content) {
        content.document.write(
          `<html><head><title>${fileName || 'Print'}</title></head><body>${containerRef.current.innerHTML}</body></html>`
        );
        content.document.close();
        content.print();
      }
    }
    onPrint?.();
  }, [fileName, onPrint]);

  // Zoom handlers
  const handleZoomIn = useCallback(() => {
    setScale((s) => {
      const newScale = Math.min(s + 0.25, 3);
      onZoomChange?.(newScale);
      return newScale;
    });
  }, [onZoomChange]);

  const handleZoomOut = useCallback(() => {
    setScale((s) => {
      const newScale = Math.max(s - 0.25, 0.25);
      onZoomChange?.(newScale);
      return newScale;
    });
  }, [onZoomChange]);

  const handleResetZoom = useCallback(() => {
    setScale(initialScale);
    onZoomChange?.(initialScale);
  }, [initialScale, onZoomChange]);

  // Rotate handler
  const handleRotate = useCallback(() => {
    setRotation((r) => {
      const newRotation = (r + 90) % 360;
      onRotate?.(newRotation);
      return newRotation;
    });
  }, [onRotate]);

  // Fullscreen handler
  const handleFullscreen = useCallback(() => {
    setIsFullscreen((f) => {
      const newValue = !f;
      onFullscreenToggle?.(newValue);
      return newValue;
    });
  }, [onFullscreenToggle]);

  // Toolbar actions config
  const actions = useMemo(() => {
    if (typeof toolbarActions === 'boolean') {
      return toolbarActions
        ? {
            download: true,
            zoomIn: true,
            zoomOut: true,
            rotate: true,
            fullscreen: true,
          }
        : {};
    }
    return toolbarActions;
  }, [toolbarActions]);

  // Render toolbar
  const renderToolbar = () => {
    if (!showToolbar || disabled) return null;

    return (
      <Group gap="xs" px="md" py="sm" style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
        {actions.download && (
          <ActionIcon
            size="sm"
            variant="subtle"
            onClick={handleDownload}
            title={String(t('Download file'))}
          >
            <IconDownload size={16} />
          </ActionIcon>
        )}

        {actions.zoomIn && (
          <>
            <ActionIcon
              size="sm"
              variant="subtle"
              onClick={handleZoomOut}
              disabled={scale <= 0.25}
              title={String(t('Zoom out'))}
            >
              <IconZoomOut size={16} />
            </ActionIcon>
            <Text size="xs" w={40} ta="center">
              {Math.round(scale * 100)}%
            </Text>
            <ActionIcon
              size="sm"
              variant="subtle"
              onClick={handleZoomIn}
              disabled={scale >= 3}
              title={String(t('Zoom in'))}
            >
              <IconZoomIn size={16} />
            </ActionIcon>
          </>
        )}

        {actions.rotate && (
          <ActionIcon
            size="sm"
            variant="subtle"
            onClick={handleRotate}
            title={String(t('Rotate'))}
          >
            <IconRotate size={16} />
          </ActionIcon>
        )}

        {actions.fullscreen && (
          <ActionIcon
            size="sm"
            variant="subtle"
            onClick={handleFullscreen}
            title={String(isFullscreen ? t('Exit fullscreen') : t('Fullscreen'))}
          >
            <IconFullscreen size={16} />
          </ActionIcon>
        )}

        {onClose && (
          <ActionIcon
            size="sm"
            variant="subtle"
            onClick={onClose}
            title={String(t('Close'))}
          >
            <IconX size={16} />
          </ActionIcon>
        )}
      </Group>
    );
  };

  // Get renderer based on file type
  const getRenderer = () => {
    const fileType = detectedFileType;

    const rendererProps: FileRendererProps = {
      file,
      width,
      height,
      onLoad: () => setLoadingState('loaded'),
      onError: (err) => {
        setPreviewError(err);
        setLoadingState('error');
        onError?.(err);
      },
      style: {
        transform: `scale(${scale}) rotate(${rotation}deg)`,
        transition: 'transform 0.2s ease',
      },
      className: contentClassName,
    };

    switch (fileType) {
      case 'pdf':
        return <PDFRenderer {...rendererProps} />;
      case 'image':
        return <ImageRenderer {...rendererProps} />;
      case 'video':
        return <VideoRenderer {...rendererProps} />;
      case 'audio':
        return <AudioRenderer {...rendererProps} />;
      case 'text':
      case 'code':
        return <TextRenderer {...rendererProps} />;
      case 'office':
        return <UnsupportedRenderer fileType={fileType} fileName={fileName} />;
      default:
        return <UnsupportedRenderer fileType={fileType} fileName={fileName} />;
    }
  };

  // Render loading
  if (loadingState === 'loading' && loading) {
    return (
      <Paper withBorder p="xl" style={{ width, height }}>
        <Center h="100%">
          <Stack align="center">
            <LoadingOverlay visible />
            {loading}
          </Stack>
        </Center>
      </Paper>
    );
  }

  // Render error
  if (loadingState === 'error' && previewError) {
    return (
      <Paper withBorder p="xl" style={{ width, height }}>
        <Center h="100%">
          <Alert icon={<IconAlertCircle size={16} />} color="red" title="Error">
            {error || previewError.message}
          </Alert>
        </Center>
      </Paper>
    );
  }

  // Render no data
  if (!file) {
    return (
      <Paper withBorder p="xl" style={{ width, height }}>
        <Center h="100%">
          <Stack align="center" gap="md">
            <IconFile size={64} opacity={0.3} />
            <Text size="lg" c="dimmed">
              {noData || t('No file to preview') as ReactNode}
            </Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  // Main render
  return (
    <Paper
      ref={containerRef}
      withBorder
      shadow="sm"
      style={{
        width: isFullscreen ? '100vw' : width,
        height: isFullscreen ? '100vh' : height,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        ...(isFullscreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999,
          borderRadius: 0,
        }),
        ...style,
      }}
      className={className}
      aria-label={ariaLabel || title || 'File previewer'}
    >
      {toolbarPosition === 'top' || toolbarPosition === 'both' ? renderToolbar() : null}

      <Box
        style={{
          flex: 1,
          overflow: 'auto',
          position: 'relative',
        }}
      >
        {getRenderer()}
      </Box>

      {toolbarPosition === 'bottom' || toolbarPosition === 'both' ? renderToolbar() : null}
    </Paper>
  );
}

ArchbaseFilePreviewer.displayName = 'ArchbaseFilePreviewer';
