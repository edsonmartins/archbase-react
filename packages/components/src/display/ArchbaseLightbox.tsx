import React, { useCallback, useState, createContext, useContext, ReactNode } from 'react';
import Lightbox, {
  Slide,
  SlideImage,
  ControllerRef,
  LightboxExternalProps,
} from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Download from 'yet-another-react-lightbox/plugins/download';
import Counter from 'yet-another-react-lightbox/plugins/counter';
import Captions from 'yet-another-react-lightbox/plugins/captions';

// Import CSS
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/counter.css';
import 'yet-another-react-lightbox/plugins/captions.css';

// =============================================================================
// Types
// =============================================================================

export interface ArchbaseLightboxSlide {
  /** URL da imagem */
  src: string;
  /** Título da imagem */
  title?: string;
  /** Descrição da imagem */
  description?: string;
  /** Texto alternativo */
  alt?: string;
  /** Largura da imagem (para otimização) */
  width?: number;
  /** Altura da imagem (para otimização) */
  height?: number;
  /** URL para download (se diferente de src) */
  downloadUrl?: string;
  /** Nome do arquivo para download */
  downloadFilename?: string;
}

export interface ArchbaseLightboxProps extends Omit<LightboxExternalProps, 'slides' | 'open' | 'close'> {
  /** Array de slides/imagens */
  slides: ArchbaseLightboxSlide[];
  /** Índice inicial do slide */
  index?: number;
  /** Se o lightbox está aberto */
  open: boolean;
  /** Callback ao fechar */
  onClose: () => void;
  /** Habilita zoom */
  enableZoom?: boolean;
  /** Habilita thumbnails */
  enableThumbnails?: boolean;
  /** Habilita slideshow */
  enableSlideshow?: boolean;
  /** Habilita fullscreen */
  enableFullscreen?: boolean;
  /** Habilita download */
  enableDownload?: boolean;
  /** Mostra contador */
  showCounter?: boolean;
  /** Mostra captions (título/descrição) */
  showCaptions?: boolean;
  /** Intervalo do slideshow em ms */
  slideshowDelay?: number;
  /** Nível máximo de zoom */
  maxZoomPixelRatio?: number;
  /** Callback ao mudar de slide */
  onSlideChange?: (index: number) => void;
}

// =============================================================================
// Hook useArchbaseLightbox
// =============================================================================

export interface UseArchbaseLightboxReturn {
  /** Se o lightbox está aberto */
  isOpen: boolean;
  /** Índice atual */
  currentIndex: number;
  /** Slides configurados */
  slides: ArchbaseLightboxSlide[];
  /** Abre o lightbox */
  open: (slides: ArchbaseLightboxSlide[], index?: number) => void;
  /** Fecha o lightbox */
  close: () => void;
  /** Vai para um slide específico */
  goTo: (index: number) => void;
  /** Props para passar ao componente */
  lightboxProps: {
    slides: ArchbaseLightboxSlide[];
    index: number;
    open: boolean;
    onClose: () => void;
    onSlideChange: (index: number) => void;
  };
}

export function useArchbaseLightbox(): UseArchbaseLightboxReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState<ArchbaseLightboxSlide[]>([]);

  const open = useCallback((newSlides: ArchbaseLightboxSlide[], index = 0) => {
    setSlides(newSlides);
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  return {
    isOpen,
    currentIndex,
    slides,
    open,
    close,
    goTo,
    lightboxProps: {
      slides,
      index: currentIndex,
      open: isOpen,
      onClose: close,
      onSlideChange: setCurrentIndex,
    },
  };
}

// =============================================================================
// Context
// =============================================================================

interface LightboxContextType {
  open: (slides: ArchbaseLightboxSlide[], index?: number) => void;
  close: () => void;
}

const LightboxContext = createContext<LightboxContextType | null>(null);

export function useArchbaseLightboxContext(): LightboxContextType {
  const context = useContext(LightboxContext);
  if (!context) {
    throw new Error('useArchbaseLightboxContext must be used within ArchbaseLightboxProvider');
  }
  return context;
}

// =============================================================================
// Provider
// =============================================================================

export interface ArchbaseLightboxProviderProps {
  children: ReactNode;
  /** Props padrão para o lightbox */
  defaultProps?: Partial<ArchbaseLightboxProps>;
}

export function ArchbaseLightboxProvider({ children, defaultProps }: ArchbaseLightboxProviderProps) {
  const lightbox = useArchbaseLightbox();

  return (
    <LightboxContext.Provider value={{ open: lightbox.open, close: lightbox.close }}>
      {children}
      <ArchbaseLightbox {...defaultProps} {...lightbox.lightboxProps} />
    </LightboxContext.Provider>
  );
}

// =============================================================================
// Component
// =============================================================================

export function ArchbaseLightbox({
  slides,
  index = 0,
  open,
  onClose,
  enableZoom = true,
  enableThumbnails = true,
  enableSlideshow = false,
  enableFullscreen = true,
  enableDownload = false,
  showCounter = true,
  showCaptions = true,
  slideshowDelay = 3000,
  maxZoomPixelRatio = 4,
  onSlideChange,
  ...rest
}: ArchbaseLightboxProps) {
  // Converte slides para o formato do lightbox
  const lightboxSlides: Slide[] = slides.map((slide) => ({
    src: slide.src,
    alt: slide.alt,
    width: slide.width,
    height: slide.height,
    title: slide.title,
    description: slide.description,
    download: slide.downloadUrl
      ? { url: slide.downloadUrl, filename: slide.downloadFilename }
      : undefined,
  }));

  // Configura plugins baseado nas props
  const plugins = [];
  if (enableZoom) plugins.push(Zoom);
  if (enableThumbnails) plugins.push(Thumbnails);
  if (enableSlideshow) plugins.push(Slideshow);
  if (enableFullscreen) plugins.push(Fullscreen);
  if (enableDownload) plugins.push(Download);
  if (showCounter) plugins.push(Counter);
  if (showCaptions) plugins.push(Captions);

  const handleViewChange = useCallback(
    ({ index: newIndex }: { index: number }) => {
      onSlideChange?.(newIndex);
    },
    [onSlideChange]
  );

  return (
    <Lightbox
      open={open}
      close={onClose}
      index={index}
      slides={lightboxSlides}
      plugins={plugins}
      on={{ view: handleViewChange }}
      zoom={{
        maxZoomPixelRatio,
        scrollToZoom: true,
      }}
      slideshow={{
        delay: slideshowDelay,
        autoplay: false,
      }}
      thumbnails={{
        position: 'bottom',
        width: 120,
        height: 80,
        border: 2,
        borderRadius: 4,
        padding: 4,
        gap: 8,
      }}
      carousel={{
        finite: false,
        preload: 2,
        padding: '16px',
      }}
      animation={{
        fade: 250,
        swipe: 250,
      }}
      controller={{
        closeOnPullDown: true,
        closeOnBackdropClick: true,
      }}
      {...rest}
    />
  );
}

ArchbaseLightbox.displayName = 'ArchbaseLightbox';

// =============================================================================
// Exports
// =============================================================================

export default ArchbaseLightbox;
