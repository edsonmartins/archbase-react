import React, { ReactNode, useCallback, useRef, useState, useEffect } from 'react';
import {
  Box,
  BoxProps,
  ActionIcon,
  Group,
  Paper,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { IconChevronLeft, IconChevronRight, IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react';

// =============================================================================
// Types
// =============================================================================

export interface ArchbaseCarouselProps extends Omit<BoxProps, 'children'> {
  /** Slides do carousel */
  children: ReactNode[];
  /** Slide inicial (0-indexed) */
  initialSlide?: number;
  /** Slides visíveis por vez */
  slidesToShow?: number;
  /** Slides para avançar por clique */
  slidesToScroll?: number;
  /** Gap entre slides em pixels */
  gap?: number;
  /** Mostrar controles de navegação */
  showControls?: boolean;
  /** Posição dos controles */
  controlsPosition?: 'sides' | 'bottom' | 'bottom-right';
  /** Tamanho dos controles */
  controlSize?: number;
  /** Mostrar indicadores (dots) */
  showIndicators?: boolean;
  /** Posição dos indicadores */
  indicatorsPosition?: 'bottom' | 'top';
  /** Loop infinito */
  loop?: boolean;
  /** Autoplay */
  autoplay?: boolean;
  /** Intervalo do autoplay em ms */
  autoplayInterval?: number;
  /** Pausar autoplay no hover */
  pauseOnHover?: boolean;
  /** Mostrar botão de play/pause */
  showPlayPause?: boolean;
  /** Animação de transição */
  transitionDuration?: number;
  /** Função de easing */
  transitionTimingFunction?: string;
  /** Callback ao mudar slide */
  onSlideChange?: (index: number) => void;
  /** Altura do carousel */
  height?: number | string;
  /** Controle externo do slide atual */
  activeSlide?: number;
  /** Arrastar para navegar */
  draggable?: boolean;
  /** Alinhamento dos slides */
  align?: 'start' | 'center' | 'end';
  /** Orientação */
  orientation?: 'horizontal' | 'vertical';
}

// =============================================================================
// ArchbaseCarousel Component
// =============================================================================

export function ArchbaseCarousel({
  children,
  initialSlide = 0,
  slidesToShow = 1,
  slidesToScroll = 1,
  gap = 16,
  showControls = true,
  controlsPosition = 'sides',
  controlSize = 36,
  showIndicators = true,
  indicatorsPosition = 'bottom',
  loop = false,
  autoplay = false,
  autoplayInterval = 3000,
  pauseOnHover = true,
  showPlayPause = false,
  transitionDuration = 300,
  transitionTimingFunction = 'ease',
  onSlideChange,
  height = 300,
  activeSlide: controlledSlide,
  draggable = true,
  align = 'start',
  orientation = 'horizontal',
  ...boxProps
}: ArchbaseCarouselProps) {
  const slides = React.Children.toArray(children);
  const totalSlides = slides.length;
  const maxSlide = Math.max(0, totalSlides - slidesToShow);

  const [internalSlide, setInternalSlide] = useState(initialSlide);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);

  const isControlled = controlledSlide !== undefined;
  const currentSlide = isControlled ? controlledSlide : internalSlide;

  const containerRef = useRef<HTMLDivElement>(null);
  const isHorizontal = orientation === 'horizontal';

  // Autoplay
  const interval = useInterval(() => {
    if (isPlaying) {
      goToNext();
    }
  }, autoplayInterval);

  useEffect(() => {
    if (autoplay && isPlaying) {
      interval.start();
    } else {
      interval.stop();
    }
    return interval.stop;
  }, [autoplay, isPlaying]);

  // Navigation
  const goToSlide = useCallback(
    (index: number) => {
      let newIndex = index;

      if (loop) {
        if (newIndex < 0) newIndex = maxSlide;
        if (newIndex > maxSlide) newIndex = 0;
      } else {
        newIndex = Math.max(0, Math.min(newIndex, maxSlide));
      }

      if (!isControlled) {
        setInternalSlide(newIndex);
      }
      onSlideChange?.(newIndex);
    },
    [loop, maxSlide, isControlled, onSlideChange]
  );

  const goToPrev = useCallback(() => {
    goToSlide(currentSlide - slidesToScroll);
  }, [currentSlide, slidesToScroll, goToSlide]);

  const goToNext = useCallback(() => {
    goToSlide(currentSlide + slidesToScroll);
  }, [currentSlide, slidesToScroll, goToSlide]);

  // Drag handling
  const handleDragStart = useCallback(
    (clientPos: number) => {
      if (!draggable) return;
      setIsDragging(true);
      setDragStart(clientPos);
      setDragOffset(0);
    },
    [draggable]
  );

  const handleDragMove = useCallback(
    (clientPos: number) => {
      if (!isDragging) return;
      setDragOffset(clientPos - dragStart);
    },
    [isDragging, dragStart]
  );

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 50;
    if (Math.abs(dragOffset) > threshold) {
      if (isHorizontal) {
        dragOffset > 0 ? goToPrev() : goToNext();
      } else {
        dragOffset > 0 ? goToPrev() : goToNext();
      }
    }
    setDragOffset(0);
  }, [isDragging, dragOffset, isHorizontal, goToPrev, goToNext]);

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    handleDragStart(isHorizontal ? e.clientX : e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(isHorizontal ? e.clientX : e.clientY);
  };

  const handleMouseUp = () => handleDragEnd();
  const handleMouseLeave = () => {
    if (isDragging) handleDragEnd();
    if (pauseOnHover && autoplay) setIsPlaying(true);
  };

  const handleMouseEnter = () => {
    if (pauseOnHover && autoplay) setIsPlaying(false);
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(isHorizontal ? e.touches[0].clientX : e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(isHorizontal ? e.touches[0].clientX : e.touches[0].clientY);
  };

  const handleTouchEnd = () => handleDragEnd();

  // Calculate transform
  const slideWidth = containerRef.current
    ? (containerRef.current.offsetWidth - gap * (slidesToShow - 1)) / slidesToShow
    : 0;

  const slideHeight = containerRef.current
    ? (containerRef.current.offsetHeight - gap * (slidesToShow - 1)) / slidesToShow
    : 0;

  const translateValue = isHorizontal
    ? -(currentSlide * (slideWidth + gap)) + dragOffset
    : -(currentSlide * (slideHeight + gap)) + dragOffset;

  // Check if can navigate
  const canGoPrev = loop || currentSlide > 0;
  const canGoNext = loop || currentSlide < maxSlide;

  // Indicator count
  const indicatorCount = Math.ceil(totalSlides / slidesToShow);

  // Render controls
  const renderControls = () => {
    if (!showControls) return null;

    const prevButton = (
      <ActionIcon
        variant="filled"
        color="dark"
        size={controlSize}
        radius="xl"
        onClick={goToPrev}
        disabled={!canGoPrev}
        style={{ opacity: canGoPrev ? 1 : 0.3 }}
      >
        <IconChevronLeft size={controlSize * 0.5} />
      </ActionIcon>
    );

    const nextButton = (
      <ActionIcon
        variant="filled"
        color="dark"
        size={controlSize}
        radius="xl"
        onClick={goToNext}
        disabled={!canGoNext}
        style={{ opacity: canGoNext ? 1 : 0.3 }}
      >
        <IconChevronRight size={controlSize * 0.5} />
      </ActionIcon>
    );

    if (controlsPosition === 'sides') {
      return (
        <>
          <Box
            style={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
            }}
          >
            {prevButton}
          </Box>
          <Box
            style={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
            }}
          >
            {nextButton}
          </Box>
        </>
      );
    }

    return null;
  };

  // Render indicators
  const renderIndicators = () => {
    if (!showIndicators) return null;

    const indicators = [];
    for (let i = 0; i <= maxSlide; i += slidesToScroll) {
      const isActive = currentSlide === i ||
        (currentSlide > i && currentSlide < i + slidesToScroll);

      indicators.push(
        <UnstyledButton
          key={i}
          onClick={() => goToSlide(i)}
          style={{
            width: isActive ? 24 : 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: isActive
              ? 'var(--mantine-color-blue-filled)'
              : 'var(--mantine-color-gray-4)',
            transition: 'all 200ms ease',
          }}
        />
      );
    }

    return (
      <Group
        gap={6}
        justify="center"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          [indicatorsPosition === 'top' ? 'top' : 'bottom']: 12,
          zIndex: 10,
        }}
      >
        {indicators}
      </Group>
    );
  };

  // Render bottom controls
  const renderBottomControls = () => {
    if (controlsPosition !== 'bottom' && controlsPosition !== 'bottom-right') {
      return null;
    }

    return (
      <Group
        justify={controlsPosition === 'bottom' ? 'center' : 'flex-end'}
        p="sm"
        gap="xs"
      >
        {showPlayPause && autoplay && (
          <ActionIcon
            variant="subtle"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <IconPlayerPause size={18} /> : <IconPlayerPlay size={18} />}
          </ActionIcon>
        )}
        <ActionIcon
          variant="subtle"
          onClick={goToPrev}
          disabled={!canGoPrev}
        >
          <IconChevronLeft size={18} />
        </ActionIcon>
        <Text size="sm" c="dimmed">
          {currentSlide + 1} / {maxSlide + 1}
        </Text>
        <ActionIcon
          variant="subtle"
          onClick={goToNext}
          disabled={!canGoNext}
        >
          <IconChevronRight size={18} />
        </ActionIcon>
      </Group>
    );
  };

  return (
    <Box {...boxProps}>
      <Box
        ref={containerRef}
        style={{
          position: 'relative',
          height,
          overflow: 'hidden',
          cursor: draggable ? (isDragging ? 'grabbing' : 'grab') : 'default',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Track */}
        <Box
          style={{
            display: 'flex',
            flexDirection: isHorizontal ? 'row' : 'column',
            gap,
            height: '100%',
            transform: isHorizontal
              ? `translateX(${translateValue}px)`
              : `translateY(${translateValue}px)`,
            transition: isDragging
              ? 'none'
              : `transform ${transitionDuration}ms ${transitionTimingFunction}`,
            userSelect: 'none',
          }}
        >
          {slides.map((slide, index) => (
            <Box
              key={index}
              style={{
                flex: `0 0 calc((100% - ${gap * (slidesToShow - 1)}px) / ${slidesToShow})`,
                minWidth: isHorizontal
                  ? `calc((100% - ${gap * (slidesToShow - 1)}px) / ${slidesToShow})`
                  : '100%',
                minHeight: !isHorizontal
                  ? `calc((100% - ${gap * (slidesToShow - 1)}px) / ${slidesToShow})`
                  : '100%',
              }}
            >
              {slide}
            </Box>
          ))}
        </Box>

        {/* Controls */}
        {renderControls()}
        {renderIndicators()}
      </Box>

      {/* Bottom controls */}
      {renderBottomControls()}
    </Box>
  );
}

// =============================================================================
// ArchbaseCarouselSlide Component
// =============================================================================

export interface ArchbaseCarouselSlideProps extends BoxProps {
  children: ReactNode;
}

export function ArchbaseCarouselSlide({ children, ...props }: ArchbaseCarouselSlideProps) {
  return (
    <Box
      style={{
        width: '100%',
        height: '100%',
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

// =============================================================================
// ArchbaseImageCarousel Component
// =============================================================================

export interface ImageSlide {
  src: string;
  alt?: string;
  title?: string;
  description?: string;
}

export interface ArchbaseImageCarouselProps
  extends Omit<ArchbaseCarouselProps, 'children'> {
  /** Array de imagens */
  images: ImageSlide[];
  /** Object fit das imagens */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  /** Mostrar overlay com título/descrição */
  showOverlay?: boolean;
  /** Posição do overlay */
  overlayPosition?: 'bottom' | 'top' | 'center';
  /** Callback ao clicar em uma imagem */
  onImageClick?: (image: ImageSlide, index: number) => void;
}

export function ArchbaseImageCarousel({
  images,
  objectFit = 'cover',
  showOverlay = true,
  overlayPosition = 'bottom',
  onImageClick,
  ...carouselProps
}: ArchbaseImageCarouselProps) {
  const getOverlayStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      left: 0,
      right: 0,
      padding: 16,
      background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
      color: 'white',
    };

    switch (overlayPosition) {
      case 'top':
        return {
          ...base,
          top: 0,
          background: 'linear-gradient(rgba(0,0,0,0.7), transparent)',
        };
      case 'center':
        return {
          ...base,
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(0,0,0,0.5)',
        };
      case 'bottom':
      default:
        return {
          ...base,
          bottom: 0,
        };
    }
  };

  return (
    <ArchbaseCarousel {...carouselProps}>
      {images.map((image, index) => (
        <Box
          key={index}
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            cursor: onImageClick ? 'pointer' : 'default',
          }}
          onClick={() => onImageClick?.(image, index)}
        >
          <img
            src={image.src}
            alt={image.alt ?? ''}
            style={{
              width: '100%',
              height: '100%',
              objectFit,
            }}
          />
          {showOverlay && (image.title || image.description) && (
            <Box style={getOverlayStyles()}>
              {image.title && (
                <Text size="lg" fw={600} c="white">
                  {image.title}
                </Text>
              )}
              {image.description && (
                <Text size="sm" c="white" style={{ opacity: 0.9 }}>
                  {image.description}
                </Text>
              )}
            </Box>
          )}
        </Box>
      ))}
    </ArchbaseCarousel>
  );
}

// =============================================================================
// ArchbaseCardCarousel Component
// =============================================================================

export interface ArchbaseCardCarouselProps
  extends Omit<ArchbaseCarouselProps, 'children'> {
  /** Renderizador de card */
  renderCard: (index: number) => ReactNode;
  /** Total de cards */
  totalCards: number;
}

export function ArchbaseCardCarousel({
  renderCard,
  totalCards,
  slidesToShow = 3,
  gap = 24,
  ...carouselProps
}: ArchbaseCardCarouselProps) {
  const cards = [];
  for (let i = 0; i < totalCards; i++) {
    cards.push(renderCard(i));
  }

  return (
    <ArchbaseCarousel slidesToShow={slidesToShow} gap={gap} {...carouselProps}>
      {cards}
    </ArchbaseCarousel>
  );
}

// =============================================================================
// Hook useArchbaseCarousel
// =============================================================================

export interface UseArchbaseCarouselOptions {
  totalSlides: number;
  slidesToShow?: number;
  slidesToScroll?: number;
  loop?: boolean;
  initialSlide?: number;
}

export function useArchbaseCarousel({
  totalSlides,
  slidesToShow = 1,
  slidesToScroll = 1,
  loop = false,
  initialSlide = 0,
}: UseArchbaseCarouselOptions) {
  const [activeSlide, setActiveSlide] = useState(initialSlide);
  const maxSlide = Math.max(0, totalSlides - slidesToShow);

  const goToSlide = useCallback(
    (index: number) => {
      let newIndex = index;

      if (loop) {
        if (newIndex < 0) newIndex = maxSlide;
        if (newIndex > maxSlide) newIndex = 0;
      } else {
        newIndex = Math.max(0, Math.min(newIndex, maxSlide));
      }

      setActiveSlide(newIndex);
    },
    [loop, maxSlide]
  );

  const goToPrev = useCallback(() => {
    goToSlide(activeSlide - slidesToScroll);
  }, [activeSlide, slidesToScroll, goToSlide]);

  const goToNext = useCallback(() => {
    goToSlide(activeSlide + slidesToScroll);
  }, [activeSlide, slidesToScroll, goToSlide]);

  const goToFirst = useCallback(() => goToSlide(0), [goToSlide]);
  const goToLast = useCallback(() => goToSlide(maxSlide), [goToSlide, maxSlide]);

  const canGoPrev = loop || activeSlide > 0;
  const canGoNext = loop || activeSlide < maxSlide;

  return {
    activeSlide,
    setActiveSlide: goToSlide,
    goToPrev,
    goToNext,
    goToFirst,
    goToLast,
    canGoPrev,
    canGoNext,
    maxSlide,
  };
}

export default ArchbaseCarousel;
