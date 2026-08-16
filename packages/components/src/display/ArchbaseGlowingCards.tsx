import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
} from 'react';
import { Box, Paper } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';

export interface ArchbaseGlowingCardsProps {
  children: ReactNode;
  /** Raio do brilho que acompanha o ponteiro, em pixels. */
  glowRadius?: number;
  /** Opacidade do brilho, entre 0 e 1. */
  glowOpacity?: number;
  gap?: number | string;
  /** Colunas fixas. Ausente, ajusta ao espaco disponivel. */
  columns?: number;
  /** Largura minima do cartao quando as colunas sao automaticas. */
  minCardWidth?: number;
  className?: string;
  style?: CSSProperties;
}

export interface ArchbaseGlowingCardProps {
  children: ReactNode;
  /** Cor do brilho deste cartao. */
  glowColor?: string;
  /** Eleva o cartao ao passar o ponteiro. */
  hoverEffect?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

const ContextoDoGrupo = createContext<RefObject<HTMLDivElement | null> | null>(null);

/**
 * Grade de cartoes com um unico brilho que atravessa todos, acompanhando o
 * ponteiro.
 *
 * Adaptado de Lightswind UI (MIT, Muhilan / codewithMUHILAN).
 *
 * A posicao do ponteiro e publicada em custom properties no container, e cada
 * cartao publica o proprio deslocamento dentro dele. O gradiente subtrai um do
 * outro, o que faz o foco atravessar a grade como uma luz unica em vez de
 * acender dentro de cada cartao isoladamente.
 *
 * Nada disso passa por estado do React: mover o ponteiro sobre uma grade grande
 * nao dispara render. O original recalculava estado por evento, o que
 * transforma um enfeite em travamento quando os cartoes se multiplicam.
 */
export function ArchbaseGlowingCards({
  children,
  glowRadius = 280,
  glowOpacity = 0.35,
  gap = 16,
  columns,
  minCardWidth = 240,
  className,
  style,
}: ArchbaseGlowingCardsProps) {
  const container = useRef<HTMLDivElement>(null);
  const movimentoReduzido = useReducedMotion();

  const aoMover = useCallback(
    (evento: React.PointerEvent<HTMLDivElement>) => {
      if (movimentoReduzido) return;
      const elemento = container.current;
      if (!elemento) return;

      const caixa = elemento.getBoundingClientRect();
      elemento.style.setProperty('--archbase-glow-x', `${evento.clientX - caixa.left}px`);
      elemento.style.setProperty('--archbase-glow-y', `${evento.clientY - caixa.top}px`);
      elemento.style.setProperty('--archbase-glow-alpha', String(glowOpacity));
    },
    [glowOpacity, movimentoReduzido],
  );

  const aoSair = useCallback(() => {
    container.current?.style.setProperty('--archbase-glow-alpha', '0');
  }, []);

  return (
    <ContextoDoGrupo.Provider value={container}>
      <Box
        ref={container}
        className={className}
        onPointerMove={aoMover}
        onPointerLeave={aoSair}
        style={
          {
            display: 'grid',
            gap,
            gridTemplateColumns: columns
              ? `repeat(${columns}, minmax(0, 1fr))`
              : `repeat(auto-fit, minmax(${minCardWidth}px, 1fr))`,
            '--archbase-glow-x': '50%',
            '--archbase-glow-y': '50%',
            '--archbase-glow-radius': `${glowRadius}px`,
            // Com movimento reduzido o brilho fica visivel e parado no centro:
            // o desenho permanece, o movimento nao.
            '--archbase-glow-alpha': movimentoReduzido ? String(glowOpacity) : '0',
            ...style,
          } as CSSProperties
        }
      >
        {children}
      </Box>
    </ContextoDoGrupo.Provider>
  );
}

/**
 * Cartao do grupo. Fora de `ArchbaseGlowingCards` continua valido — apenas sem
 * o brilho, porque as custom properties nao existem.
 */
export function ArchbaseGlowingCard({
  children,
  glowColor = 'var(--mantine-primary-color-filled)',
  hoverEffect = true,
  onClick,
  className,
  style,
}: ArchbaseGlowingCardProps) {
  const cartao = useRef<HTMLDivElement>(null);
  const container = useContext(ContextoDoGrupo);
  const interativo = typeof onClick === 'function';

  // O deslocamento do cartao dentro do grupo muda com o layout, nao com o
  // ponteiro: medir aqui mantem o movimento livre de JavaScript.
  useEffect(() => {
    const elemento = cartao.current;
    const pai = container?.current;
    if (!elemento || !pai) return;

    const medir = () => {
      const c = elemento.getBoundingClientRect();
      const p = pai.getBoundingClientRect();
      elemento.style.setProperty('--archbase-card-x', `${c.left - p.left}px`);
      elemento.style.setProperty('--archbase-card-y', `${c.top - p.top}px`);
    };

    medir();
    if (typeof ResizeObserver === 'undefined') return;
    const observador = new ResizeObserver(medir);
    observador.observe(pai);
    observador.observe(elemento);
    return () => observador.disconnect();
  }, [container]);

  const aoTeclar = useCallback(
    (evento: KeyboardEvent<HTMLDivElement>) => {
      if (!interativo) return;
      if (evento.key === 'Enter' || evento.key === ' ') {
        evento.preventDefault();
        onClick?.();
      }
    },
    [interativo, onClick],
  );

  return (
    <Paper
      ref={cartao}
      withBorder
      radius="md"
      p="md"
      className={className}
      onClick={onClick}
      // Cartao clicavel precisa ser alcancavel por teclado; cartao decorativo
      // nao deve entrar na ordem de foco.
      role={interativo ? 'button' : undefined}
      tabIndex={interativo ? 0 : undefined}
      onKeyDown={interativo ? aoTeclar : undefined}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: interativo ? 'pointer' : undefined,
        transition: hoverEffect ? 'transform 160ms ease, box-shadow 160ms ease' : undefined,
        ...style,
      }}
    >
      <span
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 'var(--archbase-glow-alpha, 0)' as unknown as number,
          transition: 'opacity 200ms ease',
          background: `radial-gradient(var(--archbase-glow-radius, 280px) circle at calc(var(--archbase-glow-x, 50%) - var(--archbase-card-x, 0px)) calc(var(--archbase-glow-y, 50%) - var(--archbase-card-y, 0px)), ${glowColor}, transparent 60%)`,
        }}
      />

      <div style={{ position: 'relative' }}>{children}</div>
    </Paper>
  );
}
