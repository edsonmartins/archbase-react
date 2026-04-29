import React, { ReactNode, CSSProperties, useRef, useEffect, useState } from 'react';
import { Box, BoxProps, useMantineTheme } from '@mantine/core';

// =============================================================================
// Types
// =============================================================================

export type MarqueeDirection = 'left' | 'right' | 'up' | 'down';

export interface ArchbaseMarqueeProps extends Omit<BoxProps, 'children'> {
  /** Conteúdo a ser animado */
  children: ReactNode;
  /** Direção do movimento */
  direction?: MarqueeDirection;
  /** Velocidade em pixels por segundo */
  speed?: number;
  /** Pausar ao passar o mouse */
  pauseOnHover?: boolean;
  /** Pausar ao clicar */
  pauseOnClick?: boolean;
  /** Número de cópias do conteúdo (para loop contínuo) */
  copies?: number;
  /** Gap entre as cópias */
  gap?: number;
  /** Gradient fade nas bordas */
  gradient?: boolean;
  /** Largura do gradient em pixels */
  gradientWidth?: number;
  /** Cor do gradient (background) */
  gradientColor?: string;
  /** Desabilitar animação */
  disabled?: boolean;
  /** Delay antes de iniciar (ms) */
  delay?: number;
}

// =============================================================================
// Keyframes CSS
// =============================================================================

const getKeyframes = (direction: MarqueeDirection, distance: number): string => {
  const name = `marquee-${direction}-${Math.abs(distance)}`;

  switch (direction) {
    case 'left':
      return `
        @keyframes ${name} {
          from { transform: translateX(0); }
          to { transform: translateX(-${distance}px); }
        }
      `;
    case 'right':
      return `
        @keyframes ${name} {
          from { transform: translateX(-${distance}px); }
          to { transform: translateX(0); }
        }
      `;
    case 'up':
      return `
        @keyframes ${name} {
          from { transform: translateY(0); }
          to { transform: translateY(-${distance}px); }
        }
      `;
    case 'down':
      return `
        @keyframes ${name} {
          from { transform: translateY(-${distance}px); }
          to { transform: translateY(0); }
        }
      `;
  }
};

// =============================================================================
// ArchbaseMarquee Component
// =============================================================================

export function ArchbaseMarquee({
  children,
  direction = 'left',
  speed = 50,
  pauseOnHover = true,
  pauseOnClick = false,
  copies = 2,
  gap = 40,
  gradient = true,
  gradientWidth = 50,
  gradientColor,
  disabled = false,
  delay = 0,
  ...boxProps
}: ArchbaseMarqueeProps) {
  const theme = useMantineTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentSize, setContentSize] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const isHorizontal = direction === 'left' || direction === 'right';

  // Measure content size
  useEffect(() => {
    if (contentRef.current) {
      const size = isHorizontal
        ? contentRef.current.offsetWidth
        : contentRef.current.offsetHeight;
      setContentSize(size + gap);

      // Add small delay before showing animation
      const timer = setTimeout(() => setIsReady(true), delay);
      return () => clearTimeout(timer);
    }
  }, [children, isHorizontal, gap, delay]);

  // Calculate animation duration based on speed
  const duration = contentSize / speed;

  // Generate keyframes
  const keyframeName = `marquee-${direction}-${contentSize}`;
  const keyframesCss = contentSize > 0 ? getKeyframes(direction, contentSize) : '';

  // Gradient styles
  const bgColor = gradientColor ?? theme.colors.dark[7];
  const gradientStyle: CSSProperties = gradient
    ? {
        maskImage: isHorizontal
          ? `linear-gradient(to right, transparent, black ${gradientWidth}px, black calc(100% - ${gradientWidth}px), transparent)`
          : `linear-gradient(to bottom, transparent, black ${gradientWidth}px, black calc(100% - ${gradientWidth}px), transparent)`,
        WebkitMaskImage: isHorizontal
          ? `linear-gradient(to right, transparent, black ${gradientWidth}px, black calc(100% - ${gradientWidth}px), transparent)`
          : `linear-gradient(to bottom, transparent, black ${gradientWidth}px, black calc(100% - ${gradientWidth}px), transparent)`,
      }
    : {};

  // Container styles
  const containerStyle: CSSProperties = {
    overflow: 'hidden',
    ...gradientStyle,
  };

  // Track styles
  const trackStyle: CSSProperties = {
    display: 'flex',
    flexDirection: isHorizontal ? 'row' : 'column',
    gap: gap,
    width: isHorizontal ? 'max-content' : '100%',
    animation:
      disabled || !isReady || contentSize === 0
        ? 'none'
        : `${keyframeName} ${duration}s linear infinite`,
    animationPlayState: isPaused ? 'paused' : 'running',
  };

  // Event handlers
  const handleMouseEnter = () => {
    if (pauseOnHover) setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (pauseOnHover) setIsPaused(false);
  };

  const handleClick = () => {
    if (pauseOnClick) setIsPaused(!isPaused);
  };

  // Render copies
  const renderCopies = () => {
    const items = [];
    for (let i = 0; i < copies; i++) {
      items.push(
        <Box key={i} ref={i === 0 ? contentRef : undefined}>
          {children}
        </Box>
      );
    }
    return items;
  };

  return (
    <>
      {/* Inject keyframes */}
      {keyframesCss && (
        <style dangerouslySetInnerHTML={{ __html: keyframesCss }} />
      )}

      <Box
        ref={containerRef}
        style={containerStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        {...boxProps}
      >
        <Box style={trackStyle}>{renderCopies()}</Box>
      </Box>
    </>
  );
}

// =============================================================================
// Convenience Components
// =============================================================================

/** Marquee horizontal da esquerda para direita */
export function ArchbaseMarqueeLeft(
  props: Omit<ArchbaseMarqueeProps, 'direction'>
) {
  return <ArchbaseMarquee direction="left" {...props} />;
}

/** Marquee horizontal da direita para esquerda */
export function ArchbaseMarqueeRight(
  props: Omit<ArchbaseMarqueeProps, 'direction'>
) {
  return <ArchbaseMarquee direction="right" {...props} />;
}

/** Marquee vertical de cima para baixo */
export function ArchbaseMarqueeUp(
  props: Omit<ArchbaseMarqueeProps, 'direction'>
) {
  return <ArchbaseMarquee direction="up" {...props} />;
}

/** Marquee vertical de baixo para cima */
export function ArchbaseMarqueeDown(
  props: Omit<ArchbaseMarqueeProps, 'direction'>
) {
  return <ArchbaseMarquee direction="down" {...props} />;
}

// =============================================================================
// ArchbaseTextTicker (ticker de notícias)
// =============================================================================

export interface ArchbaseTextTickerProps extends Omit<ArchbaseMarqueeProps, 'children'> {
  /** Array de textos */
  items: string[];
  /** Separador entre itens */
  separator?: ReactNode;
}

export function ArchbaseTextTicker({
  items,
  separator = ' • ',
  ...props
}: ArchbaseTextTickerProps) {
  return (
    <ArchbaseMarquee {...props}>
      <Box style={{ display: 'flex', alignItems: 'center', whiteSpace: 'nowrap' }}>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <span>{item}</span>
            {index < items.length - 1 && (
              <span style={{ margin: '0 8px', opacity: 0.5 }}>{separator}</span>
            )}
          </React.Fragment>
        ))}
      </Box>
    </ArchbaseMarquee>
  );
}

export default ArchbaseMarquee;
