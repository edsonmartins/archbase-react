import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { ActionIcon, Box, Group, type MantineColor } from '@mantine/core';
import { useReducedMotion } from '@mantine/hooks';
import { IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';

export interface ArchbaseStickyTopBarProps {
  children: ReactNode;
  /**
   * Visibilidade controlada. Ignorada quando `showOnScroll` esta ligado.
   */
  visible?: boolean;
  /** Aparece depois de rolar; util para barra de acao que so importa adiante. */
  showOnScroll?: boolean;
  /** Rolagem, em pixels, a partir da qual a barra aparece. */
  scrollThreshold?: number;
  /** Botao de fechar. */
  dismissible?: boolean;
  onDismiss?: () => void;
  /**
   * Chave de persistencia da dispensa. Definida, a barra nao volta a aparecer
   * para quem ja a fechou — mensagem de sistema que reaparece a cada
   * navegacao vira ruido e ensina o usuario a ignorar o lugar todo.
   */
  dismissStorageKey?: string;
  color?: MantineColor;
  /** Fixa no topo da janela. Desligado, acompanha o fluxo da pagina. */
  sticky?: boolean;
  /** Altura reservada, em pixels. */
  height?: number;
  zIndex?: number;
  /**
   * Papel semantico. `status` para informacao passageira; `region` para
   * conteudo que o usuario pode querer reencontrar.
   */
  role?: 'status' | 'region' | 'alert';
  'aria-label'?: string;
  className?: string;
}

function jaDispensada(chave?: string): boolean {
  if (!chave || typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(chave) === 'dispensada';
  } catch {
    // Modo privado ou armazenamento bloqueado: a barra volta a aparecer, que e
    // o comportamento menos surpreendente entre os dois ruins.
    return false;
  }
}

/**
 * Barra fixa no topo, para aviso de sistema ou acao contextual.
 *
 * Adaptado de Lightswind UI (MIT, Muhilan / codewithMUHILAN), com o que faltava
 * para uso em produto:
 *
 * - **Dispensavel, com memoria opcional.** O original nao fechava. Aviso que
 *   nao se fecha e o usuario cobre com a mao.
 * - **Semantica.** Era um `div` mudo; agora recebe papel e rotulo, e um leitor
 *   de tela anuncia a mensagem quando ela chega.
 * - **`useSyncExternalStore` nao entra aqui, mas o listener de rolagem e
 *   passivo** — sem isso o navegador nao pode adiantar a rolagem enquanto o
 *   manipulador roda.
 * - **Movimento reduzido** troca o deslize por aparecer e sumir.
 */
export function ArchbaseStickyTopBar({
  children,
  visible = true,
  showOnScroll = false,
  scrollThreshold = 200,
  dismissible = false,
  onDismiss,
  dismissStorageKey,
  color = 'blue',
  sticky = true,
  height = 44,
  zIndex = 200,
  role = 'status',
  'aria-label': ariaLabel,
  className,
}: ArchbaseStickyTopBarProps) {
  const movimentoReduzido = useReducedMotion();
  const [dispensada, setDispensada] = useState(() => jaDispensada(dismissStorageKey));
  const [passouDoLimite, setPassouDoLimite] = useState(false);

  useEffect(() => {
    if (!showOnScroll || typeof window === 'undefined') return;

    const aoRolar = () => setPassouDoLimite(window.scrollY > scrollThreshold);
    aoRolar();
    // `passive` permite ao navegador rolar sem esperar este manipulador.
    window.addEventListener('scroll', aoRolar, { passive: true });
    return () => window.removeEventListener('scroll', aoRolar);
  }, [showOnScroll, scrollThreshold]);

  const dispensar = useCallback(() => {
    setDispensada(true);
    if (dismissStorageKey && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(dismissStorageKey, 'dispensada');
      } catch {
        // Sem armazenamento, a dispensa vale so para esta sessao.
      }
    }
    onDismiss?.();
  }, [dismissStorageKey, onDismiss]);

  const aparecendo = !dispensada && (showOnScroll ? passouDoLimite : visible);

  const transicao = movimentoReduzido
    ? { duration: 0.01 }
    : { type: 'spring' as const, stiffness: 320, damping: 30 };

  return (
    <AnimatePresence>
      {aparecendo && (
        <motion.div
          initial={movimentoReduzido ? { opacity: 0 } : { y: -height, opacity: 0 }}
          animate={movimentoReduzido ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={movimentoReduzido ? { opacity: 0 } : { y: -height, opacity: 0 }}
          transition={transicao}
          style={{
            position: sticky ? 'sticky' : 'relative',
            top: 0,
            zIndex,
            width: '100%',
          }}
        >
          <Box
            className={className}
            role={role}
            aria-label={ariaLabel}
            aria-live={role === 'alert' ? 'assertive' : 'polite'}
            bg={color}
            style={{ minHeight: height, color: 'var(--mantine-color-white)' }}
            px="md"
            py={6}
          >
            <Group justify="space-between" wrap="nowrap" h="100%">
              <Box style={{ flex: 1, minWidth: 0 }}>{children}</Box>

              {dismissible && (
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  aria-label="Fechar aviso"
                  onClick={dispensar}
                  style={{ color: 'inherit' }}
                >
                  <IconX size={16} />
                </ActionIcon>
              )}
            </Group>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
