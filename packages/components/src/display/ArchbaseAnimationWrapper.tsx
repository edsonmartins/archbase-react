import React, { forwardRef, ReactNode, Children, cloneElement, isValidElement } from 'react';
import { Transition, TransitionProps, Box } from '@mantine/core';

export type ArchbaseAnimationPreset =
  | 'fade'
  | 'scale'
  | 'scale-y'
  | 'scale-x'
  | 'skew-up'
  | 'skew-down'
  | 'rotate-left'
  | 'rotate-right'
  | 'slide-down'
  | 'slide-up'
  | 'slide-left'
  | 'slide-right'
  | 'pop'
  | 'pop-bottom-left'
  | 'pop-bottom-right'
  | 'pop-top-left'
  | 'pop-top-right';

export interface ArchbaseAnimationWrapperProps {
  /** Conteúdo a ser animado */
  children: ReactNode;
  /** Se o conteúdo está visível */
  visible?: boolean;
  /** Preset de animação */
  preset?: ArchbaseAnimationPreset;
  /** Duração da animação em ms */
  duration?: number;
  /** Delay antes de iniciar em ms */
  delay?: number;
  /** Função de timing */
  timingFunction?: string;
  /** Se deve manter montado quando invisível */
  keepMounted?: boolean;
  /** Callback quando a animação de entrada completa */
  onEntered?: () => void;
  /** Callback quando a animação de saída completa */
  onExited?: () => void;
  /** Callback quando a animação de entrada inicia */
  onEnter?: () => void;
  /** Callback quando a animação de saída inicia */
  onExit?: () => void;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseAnimationWrapper = forwardRef<HTMLDivElement, ArchbaseAnimationWrapperProps>(
  (
    {
      children,
      visible = true,
      preset = 'fade',
      duration = 200,
      delay = 0,
      timingFunction = 'ease',
      keepMounted = false,
      onEntered,
      onExited,
      onEnter,
      onExit,
      className,
      style,
    },
    ref
  ) => {
    return (
      <Transition
        mounted={visible}
        transition={preset}
        duration={duration}
        timingFunction={timingFunction}
        keepMounted={keepMounted}
        onEntered={onEntered}
        onExited={onExited}
        onEnter={onEnter}
        onExit={onExit}
      >
        {(styles) => (
          <Box
            ref={ref}
            className={className}
            style={{
              ...style,
              ...styles,
              transitionDelay: delay ? `${delay}ms` : undefined,
            }}
          >
            {children}
          </Box>
        )}
      </Transition>
    );
  }
);

ArchbaseAnimationWrapper.displayName = 'ArchbaseAnimationWrapper';

// ================== Animated List ==================

export interface ArchbaseAnimatedListProps {
  /** Itens da lista */
  children: ReactNode;
  /** Se os itens estão visíveis */
  visible?: boolean;
  /** Preset de animação */
  preset?: ArchbaseAnimationPreset;
  /** Duração da animação em ms */
  duration?: number;
  /** Delay base em ms */
  baseDelay?: number;
  /** Delay incremental entre itens em ms */
  staggerDelay?: number;
  /** Função de timing */
  timingFunction?: string;
  /** Se deve animar na ordem reversa */
  reverse?: boolean;
  /** Classe CSS do container */
  className?: string;
  /** Estilo do container */
  style?: React.CSSProperties;
}

export const ArchbaseAnimatedList = forwardRef<HTMLDivElement, ArchbaseAnimatedListProps>(
  (
    {
      children,
      visible = true,
      preset = 'slide-up',
      duration = 200,
      baseDelay = 0,
      staggerDelay = 50,
      timingFunction = 'ease',
      reverse = false,
      className,
      style,
    },
    ref
  ) => {
    const childArray = Children.toArray(children);
    const count = childArray.length;

    return (
      <Box ref={ref} className={className} style={style}>
        {childArray.map((child, index) => {
          const itemIndex = reverse ? count - 1 - index : index;
          const delay = baseDelay + itemIndex * staggerDelay;

          return (
            <Transition
              key={index}
              mounted={visible}
              transition={preset}
              duration={duration}
              timingFunction={timingFunction}
            >
              {(styles) => (
                <Box
                  style={{
                    ...styles,
                    transitionDelay: `${delay}ms`,
                  }}
                >
                  {child}
                </Box>
              )}
            </Transition>
          );
        })}
      </Box>
    );
  }
);

ArchbaseAnimatedList.displayName = 'ArchbaseAnimatedList';

// ================== Fade In When Visible ==================

export interface ArchbaseFadeInWhenVisibleProps {
  /** Conteúdo a ser animado */
  children: ReactNode;
  /** Preset de animação */
  preset?: ArchbaseAnimationPreset;
  /** Duração da animação em ms */
  duration?: number;
  /** Delay antes de iniciar em ms */
  delay?: number;
  /** Threshold de visibilidade (0-1) */
  threshold?: number;
  /** Se deve animar apenas uma vez */
  once?: boolean;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseFadeInWhenVisible = forwardRef<HTMLDivElement, ArchbaseFadeInWhenVisibleProps>(
  (
    {
      children,
      preset = 'fade',
      duration = 400,
      delay = 0,
      threshold = 0.1,
      once = true,
      className,
      style,
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const elementRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once && elementRef.current) {
              observer.unobserve(elementRef.current);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        },
        { threshold }
      );

      if (elementRef.current) {
        observer.observe(elementRef.current);
      }

      return () => {
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      };
    }, [once, threshold]);

    return (
      <Box ref={elementRef}>
        <Transition
          mounted={isVisible}
          transition={preset}
          duration={duration}
          timingFunction="ease"
        >
          {(styles) => (
            <Box
              ref={ref}
              className={className}
              style={{
                ...style,
                ...styles,
                transitionDelay: delay ? `${delay}ms` : undefined,
              }}
            >
              {children}
            </Box>
          )}
        </Transition>
      </Box>
    );
  }
);

ArchbaseFadeInWhenVisible.displayName = 'ArchbaseFadeInWhenVisible';
