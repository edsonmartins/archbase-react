import React, { ReactNode, useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Button,
  Group,
  Overlay,
  Paper,
  Portal,
  Text,
  Title,
  Transition,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconX } from '@tabler/icons-react';

export interface ArchbaseOnboardingTourStep {
  /** ID único do step */
  id: string;
  /** Seletor CSS do elemento a ser destacado */
  target?: string;
  /** Título do step */
  title?: ReactNode;
  /** Conteúdo/descrição do step */
  content?: ReactNode;
}

export interface ArchbaseOnboardingTourProps {
  /** Array de steps do tour */
  steps: ArchbaseOnboardingTourStep[];
  /** Callback quando o tour é iniciado */
  onStart?: () => void;
  /** Callback quando o tour é finalizado */
  onEnd?: () => void;
  /** Callback quando o step muda */
  onChange?: (step: ArchbaseOnboardingTourStep) => void;
  /** Iniciar o tour automaticamente ao montar o componente */
  autoStart?: boolean;
  /** Se o tour deve ser repetido (loop) */
  loop?: boolean;
  /** Conteúdo da aplicação */
  children: ReactNode;
  /** Label do botão próximo */
  nextLabel?: string;
  /** Label do botão anterior */
  prevLabel?: string;
  /** Label do botão finalizar */
  finishLabel?: string;
  /** Label do botão pular */
  skipLabel?: string;
  /** Mostrar botão pular */
  showSkip?: boolean;
}

/**
 * ArchbaseOnboardingTour — Tour interativo de onboarding sem dependências externas.
 * Usa Mantine Overlay + Portal para destacar elementos e exibir tooltips.
 */
export function ArchbaseOnboardingTour({
  steps,
  onStart,
  onEnd,
  onChange,
  autoStart = false,
  loop = false,
  children,
  nextLabel = 'Próximo',
  prevLabel = 'Anterior',
  finishLabel = 'Finalizar',
  skipLabel = 'Pular',
  showSkip = true,
}: ArchbaseOnboardingTourProps) {
  const theme = useMantineTheme();
  const [active, setActive] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const rafRef = useRef<number>(0);

  const currentStep = steps[currentIndex];
  const isLast = currentIndex === steps.length - 1;
  const isFirst = currentIndex === 0;

  // Measure target element position
  const measureTarget = useCallback(() => {
    if (!active || !currentStep?.target) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(currentStep.target);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect(rect);
      // Scroll into view if needed
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      setTargetRect(null);
    }
  }, [active, currentStep]);

  useEffect(() => {
    if (!active) return;
    measureTarget();
    // Re-measure on scroll/resize
    const handler = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(measureTarget);
    };
    window.addEventListener('scroll', handler, true);
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler, true);
      window.removeEventListener('resize', handler);
      cancelAnimationFrame(rafRef.current);
    };
  }, [active, currentIndex, measureTarget]);

  useEffect(() => {
    if (autoStart && steps.length > 0) {
      setActive(true);
      onStart?.();
    }
  }, [autoStart]);

  const goNext = useCallback(() => {
    if (isLast) {
      if (loop) {
        setCurrentIndex(0);
        onChange?.(steps[0]);
      } else {
        setActive(false);
        onEnd?.();
      }
    } else {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      onChange?.(steps[next]);
    }
  }, [currentIndex, isLast, loop, steps, onChange, onEnd]);

  const goPrev = useCallback(() => {
    if (!isFirst) {
      const prev = currentIndex - 1;
      setCurrentIndex(prev);
      onChange?.(steps[prev]);
    }
  }, [currentIndex, isFirst, steps, onChange]);

  const skip = useCallback(() => {
    setActive(false);
    onEnd?.();
  }, [onEnd]);

  // Tooltip position: below the target, or centered if no target
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10001,
      };
    }
    const top = targetRect.bottom + 12;
    const left = targetRect.left + targetRect.width / 2;
    // Clamp to viewport
    return {
      position: 'fixed',
      top: Math.min(top, window.innerHeight - 220),
      left: Math.min(Math.max(left - 175, 16), window.innerWidth - 366),
      zIndex: 10001,
      width: 350,
    };
  };

  return (
    <>
      {children}
      {active && (
        <Portal>
          {/* Overlay */}
          <Overlay fixed opacity={0.5} zIndex={9999} />

          {/* Highlight cutout */}
          {targetRect && (
            <Box
              style={{
                position: 'fixed',
                top: targetRect.top - 4,
                left: targetRect.left - 4,
                width: targetRect.width + 8,
                height: targetRect.height + 8,
                border: `2px solid ${theme.colors.blue[5]}`,
                borderRadius: theme.radius.sm,
                zIndex: 10000,
                boxShadow: `0 0 0 9999px rgba(0, 0, 0, 0.5)`,
                pointerEvents: 'none',
                backgroundColor: 'transparent',
              }}
            />
          )}

          {/* Tooltip */}
          <Transition mounted transition="pop" duration={200}>
            {(transitionStyles) => (
              <Paper
                shadow="lg"
                p="md"
                radius="md"
                style={{
                  ...getTooltipStyle(),
                  ...transitionStyles,
                }}
              >
                {currentStep?.title && (
                  <Title order={5} mb="xs">
                    {currentStep.title}
                  </Title>
                )}
                {currentStep?.content && (
                  <Text size="sm" c="dimmed" mb="md">
                    {currentStep.content}
                  </Text>
                )}
                <Text size="xs" c="dimmed" mb="sm">
                  {currentIndex + 1} / {steps.length}
                </Text>
                <Group justify="space-between">
                  <Group gap="xs">
                    {showSkip && (
                      <Button variant="subtle" size="xs" onClick={skip}>
                        {skipLabel}
                      </Button>
                    )}
                  </Group>
                  <Group gap="xs">
                    {!isFirst && (
                      <Button
                        variant="default"
                        size="xs"
                        leftSection={<IconArrowLeft size={14} />}
                        onClick={goPrev}
                      >
                        {prevLabel}
                      </Button>
                    )}
                    <Button
                      size="xs"
                      rightSection={!isLast ? <IconArrowRight size={14} /> : undefined}
                      onClick={goNext}
                    >
                      {isLast ? finishLabel : nextLabel}
                    </Button>
                  </Group>
                </Group>
              </Paper>
            )}
          </Transition>
        </Portal>
      )}
    </>
  );
}

/**
 * Hook para controlar o tour programaticamente
 */
export function useArchbaseOnboarding() {
  const [started, setStarted] = useState(false);
  return {
    started,
    start: () => setStarted(true),
    stop: () => setStarted(false),
  };
}
