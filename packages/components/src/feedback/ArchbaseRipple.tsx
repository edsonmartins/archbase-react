import React, { forwardRef, useCallback, useState, ReactNode, MouseEvent, CSSProperties } from 'react';
import { Box, MantineColor } from '@mantine/core';

interface RippleItem {
  id: number;
  x: number;
  y: number;
  size: number;
}

export interface ArchbaseRippleProps {
  /** Conteúdo a ser envolvido */
  children: ReactNode;
  /** Cor do ripple */
  color?: MantineColor;
  /** Opacidade do ripple */
  opacity?: number;
  /** Duração da animação em ms */
  duration?: number;
  /** Se o ripple deve ser centralizado */
  centered?: boolean;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Se deve cobrir todo o elemento */
  unbounded?: boolean;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: CSSProperties;
}

export const ArchbaseRipple = forwardRef<HTMLDivElement, ArchbaseRippleProps>(
  (
    {
      children,
      color = 'blue',
      opacity = 0.3,
      duration = 600,
      centered = false,
      disabled = false,
      unbounded = false,
      className,
      style,
    },
    ref
  ) => {
    const [ripples, setRipples] = useState<RippleItem[]>([]);
    const [nextId, setNextId] = useState(0);

    const handleClick = useCallback(
      (event: MouseEvent<HTMLDivElement>) => {
        if (disabled) return;

        const element = event.currentTarget;
        const rect = element.getBoundingClientRect();

        let x: number;
        let y: number;
        let size: number;

        if (centered) {
          x = rect.width / 2;
          y = rect.height / 2;
          size = Math.max(rect.width, rect.height);
        } else {
          x = event.clientX - rect.left;
          y = event.clientY - rect.top;
          // Calcula o tamanho para cobrir todo o elemento
          const dx = Math.max(x, rect.width - x);
          const dy = Math.max(y, rect.height - y);
          size = Math.sqrt(dx * dx + dy * dy) * 2;
        }

        const newRipple: RippleItem = {
          id: nextId,
          x,
          y,
          size,
        };

        setRipples((prev) => [...prev, newRipple]);
        setNextId((prev) => prev + 1);

        // Remove o ripple após a animação
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, duration);
      },
      [centered, disabled, duration, nextId]
    );

    const rippleColor = color.includes('.')
      ? `var(--mantine-color-${color})`
      : `var(--mantine-color-${color}-4)`;

    return (
      <Box
        ref={ref}
        className={className}
        style={{
          ...style,
          position: 'relative',
          overflow: unbounded ? 'visible' : 'hidden',
          cursor: disabled ? 'default' : 'pointer',
        }}
        onClick={handleClick}
      >
        {children}

        {/* Ripples container */}
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: unbounded ? 'visible' : 'hidden',
          }}
        >
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              style={{
                position: 'absolute',
                left: ripple.x - ripple.size / 2,
                top: ripple.y - ripple.size / 2,
                width: ripple.size,
                height: ripple.size,
                borderRadius: '50%',
                backgroundColor: rippleColor,
                opacity: opacity,
                transform: 'scale(0)',
                animation: `archbase-ripple ${duration}ms ease-out forwards`,
                pointerEvents: 'none',
              }}
            />
          ))}
        </Box>

        {/* Keyframes injection */}
        <style>
          {`
            @keyframes archbase-ripple {
              0% {
                transform: scale(0);
                opacity: ${opacity};
              }
              100% {
                transform: scale(1);
                opacity: 0;
              }
            }
          `}
        </style>
      </Box>
    );
  }
);

ArchbaseRipple.displayName = 'ArchbaseRipple';

// ================== Hook para uso em componentes customizados ==================

export interface UseArchbaseRippleOptions {
  color?: MantineColor;
  opacity?: number;
  duration?: number;
  centered?: boolean;
  disabled?: boolean;
}

export interface UseArchbaseRippleReturn {
  ripples: RippleItem[];
  handleClick: (event: MouseEvent<HTMLElement>) => void;
  RippleContainer: React.FC;
}

export function useArchbaseRipple(options: UseArchbaseRippleOptions = {}): UseArchbaseRippleReturn {
  const {
    color = 'blue',
    opacity = 0.3,
    duration = 600,
    centered = false,
    disabled = false,
  } = options;

  const [ripples, setRipples] = useState<RippleItem[]>([]);
  const [nextId, setNextId] = useState(0);

  const handleClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (disabled) return;

      const element = event.currentTarget;
      const rect = element.getBoundingClientRect();

      let x: number;
      let y: number;
      let size: number;

      if (centered) {
        x = rect.width / 2;
        y = rect.height / 2;
        size = Math.max(rect.width, rect.height);
      } else {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
        const dx = Math.max(x, rect.width - x);
        const dy = Math.max(y, rect.height - y);
        size = Math.sqrt(dx * dx + dy * dy) * 2;
      }

      const newRipple: RippleItem = {
        id: nextId,
        x,
        y,
        size,
      };

      setRipples((prev) => [...prev, newRipple]);
      setNextId((prev) => prev + 1);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, duration);
    },
    [centered, disabled, duration, nextId]
  );

  const rippleColor = color.includes('.')
    ? `var(--mantine-color-${color})`
    : `var(--mantine-color-${color}-4)`;

  const RippleContainer: React.FC = useCallback(
    () => (
      <>
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            style={{
              position: 'absolute',
              left: ripple.x - ripple.size / 2,
              top: ripple.y - ripple.size / 2,
              width: ripple.size,
              height: ripple.size,
              borderRadius: '50%',
              backgroundColor: rippleColor,
              opacity: opacity,
              transform: 'scale(0)',
              animation: `archbase-ripple ${duration}ms ease-out forwards`,
              pointerEvents: 'none',
            }}
          />
        ))}
        <style>
          {`
            @keyframes archbase-ripple {
              0% {
                transform: scale(0);
                opacity: ${opacity};
              }
              100% {
                transform: scale(1);
                opacity: 0;
              }
            }
          `}
        </style>
      </>
    ),
    [duration, opacity, rippleColor, ripples]
  );

  return {
    ripples,
    handleClick,
    RippleContainer,
  };
}
