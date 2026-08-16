import { useCallback, useRef, type ReactNode } from 'react';
import { Badge, Box, Tooltip, useMantineColorScheme } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'framer-motion';

export interface ArchbaseMagnifyDockItem {
  id: string;
  /** Icone do item. */
  icon: ReactNode;
  /** Nome acessivel e texto da dica. Obrigatorio: item so com icone e mudo. */
  label: string;
  onClick?: () => void;
  /** Contador exibido no canto. Zero ou ausente nao mostra nada. */
  badge?: number;
  disabled?: boolean;
}

export interface ArchbaseMagnifyDockProps {
  items: ArchbaseMagnifyDockItem[];
  /** Tamanho do item em repouso, em pixels. */
  baseSize?: number;
  /** Tamanho maximo sob o ponteiro. */
  magnification?: number;
  /** Alcance da magnificacao, em pixels. */
  distance?: number;
  spring?: { mass: number; stiffness: number; damping: number };
  className?: string;
  'aria-label'?: string;
}

const MOLA_PADRAO = { mass: 0.1, stiffness: 150, damping: 12 };

/**
 * Barra de icones com magnificacao sob o ponteiro, no estilo do dock do macOS.
 *
 * Adaptado de Lightswind UI (MIT, Muhilan / codewithMUHILAN).
 *
 * Nao confundir com `ArchbaseDockLayout`, que e layout de paineis acoplaveis —
 * conceitos distintos que a palavra "dock" une por acidente.
 *
 * Correcoes em relacao ao original:
 *
 * - Os itens eram `div` com `role="button"` e `tabIndex={0}`, mas **sem
 *   tratador de teclado**: recebiam foco e nao faziam nada com Enter ou Espaco.
 *   Aqui sao `<button>` de verdade, e o comportamento vem do navegador.
 * - Item so com icone nao tinha nome acessivel — o leitor anunciava "botao" e
 *   nada mais. `label` agora e obrigatorio e vira o nome.
 * - O original marcava `aria-haspopup="true"` em todos, o que promete um menu
 *   que nao existe.
 * - A magnificacao e desligada sob `prefers-reduced-motion`; a barra continua
 *   inteiramente utilizavel, apenas sem o efeito.
 */
export function ArchbaseMagnifyDock({
  items,
  baseSize = 44,
  magnification = 68,
  distance = 140,
  spring = MOLA_PADRAO,
  className,
  'aria-label': ariaLabel = 'Atalhos',
}: ArchbaseMagnifyDockProps) {
  const movimentoReduzido = useReducedMotion();
  // Fora do alcance: em repouso nenhum item cresce.
  const ponteiroX = useMotionValue(Number.POSITIVE_INFINITY);

  const aoMover = useCallback(
    (evento: React.PointerEvent<HTMLDivElement>) => {
      if (movimentoReduzido) return;
      ponteiroX.set(evento.clientX);
    },
    [ponteiroX, movimentoReduzido],
  );

  const aoSair = useCallback(() => {
    ponteiroX.set(Number.POSITIVE_INFINITY);
  }, [ponteiroX]);

  return (
    <Box
      component="div"
      role="toolbar"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      className={className}
      onPointerMove={aoMover}
      onPointerLeave={aoSair}
      style={{
        display: 'inline-flex',
        alignItems: 'flex-end',
        gap: 8,
        padding: 8,
        borderRadius: 16,
        background: 'var(--mantine-color-default)',
        border: '1px solid var(--mantine-color-default-border)',
        boxShadow: 'var(--mantine-shadow-md)',
      }}
    >
      {items.map((item) => (
        <ItemDoDock
          key={item.id}
          item={item}
          ponteiroX={ponteiroX}
          baseSize={baseSize}
          magnification={movimentoReduzido ? baseSize : magnification}
          distance={distance}
          spring={spring}
        />
      ))}
    </Box>
  );
}

interface ItemProps {
  item: ArchbaseMagnifyDockItem;
  ponteiroX: MotionValue<number>;
  baseSize: number;
  magnification: number;
  distance: number;
  spring: { mass: number; stiffness: number; damping: number };
}

function ItemDoDock({
  item,
  ponteiroX,
  baseSize,
  magnification,
  distance,
  spring,
}: ItemProps) {
  const referencia = useRef<HTMLButtonElement>(null);
  const { colorScheme } = useMantineColorScheme();

  const distanciaDoCentro = useTransform(ponteiroX, (valor) => {
    if (typeof valor !== 'number' || Number.isNaN(valor)) return 0;
    const caixa = referencia.current?.getBoundingClientRect();
    if (!caixa) return 0;
    return valor - caixa.x - caixa.width / 2;
  });

  const tamanhoAlvo = useTransform(
    distanciaDoCentro,
    [-distance, 0, distance],
    [baseSize, magnification, baseSize],
  );
  const tamanho = useSpring(tamanhoAlvo, spring);

  return (
    <Tooltip label={item.label} position="top" withArrow openDelay={120} events={{ hover: true, focus: true, touch: false }}>
      {/* `motion.button` direto, e nao `UnstyledButton` polimorfico: o tipo de
          `style` do Mantine nao aceita `MotionValue`, e o reset de botao sao
          tres linhas. */}
      <motion.button
        ref={referencia}
        type="button"
        onClick={item.onClick}
        disabled={item.disabled}
        // O nome acessivel vem do rotulo: item so com icone seria anunciado
        // apenas como "botao".
        aria-label={item.label}
        style={{
          width: tamanho,
          height: tamanho,
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background:
            colorScheme === 'dark'
              ? 'var(--mantine-color-dark-5)'
              : 'var(--mantine-color-gray-0)',
          border: '1px solid var(--mantine-color-default-border)',
          cursor: item.disabled ? 'not-allowed' : 'pointer',
          opacity: item.disabled ? 0.5 : 1,
          padding: 0,
          font: 'inherit',
          color: 'inherit',
        }}
      >
        {item.icon}

        {item.badge !== undefined && item.badge > 0 && (
          <Badge
            size="xs"
            circle
            color="red"
            style={{ position: 'absolute', top: -2, right: -2 }}
            // O contador ja e anunciado no rotulo do botao pelo consumidor, se
            // fizer sentido; aqui ele e decorativo para nao duplicar a fala.
            aria-hidden
          >
            {item.badge > 99 ? '99+' : item.badge}
          </Badge>
        )}
      </motion.button>
    </Tooltip>
  );
}
