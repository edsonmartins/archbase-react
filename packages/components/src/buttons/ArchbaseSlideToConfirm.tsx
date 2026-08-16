import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Box, Loader, Text, useMantineTheme } from '@mantine/core';
import { IconArrowRight, IconCheck } from '@tabler/icons-react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export type ArchbaseSlideToConfirmStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ArchbaseSlideToConfirmProps {
  /** Texto exibido antes da confirmacao. */
  label?: string;
  /** Texto exibido apos confirmar. */
  successLabel?: string;
  /** Executada ao completar o gesto. Rejeitar volta o controle ao inicio. */
  onConfirm: () => Promise<void> | void;
  /** Chamada quando `onConfirm` rejeita. */
  onError?: (erro: unknown) => void;
  width?: number;
  height?: number;
  disabled?: boolean;
  /** Volta ao estado inicial apos confirmar, em milissegundos. Zero mantem. */
  resetAfter?: number;
  /** Fracao do curso necessaria para confirmar, entre 0 e 1. */
  threshold?: number;
  className?: string;
  'aria-label'?: string;
}

/**
 * Confirmacao por deslize, para acoes destrutivas ou irreversiveis.
 *
 * Adaptado de Lightswind UI (MIT, Muhilan / codewithMUHILAN).
 *
 * A diferenca principal nao e visual. O original era um `div` arrastavel: quem
 * navega por teclado ou usa leitor de tela **nao conseguia confirmar** — num
 * controle cuja unica funcao e confirmar. Aqui ele e um `slider` de verdade:
 *
 * - `role="slider"` com `aria-valuenow`, entao o leitor anuncia o progresso;
 * - setas movem o polegar, `Home`/`End` vao aos extremos, `End` confirma;
 * - `Enter` e `Espaco` confirmam direto, para quem so quer executar a acao.
 *
 * O gesto continua sendo a defesa contra o clique acidental — o teclado apenas
 * deixa de ser excluido dela.
 */
export function ArchbaseSlideToConfirm({
  label = 'Deslize para confirmar',
  successLabel = 'Confirmado',
  onConfirm,
  onError,
  width = 320,
  height = 56,
  disabled = false,
  resetAfter = 0,
  threshold = 0.9,
  className,
  'aria-label': ariaLabel,
}: ArchbaseSlideToConfirmProps) {
  const theme = useMantineTheme();
  const [status, setStatus] = useState<ArchbaseSlideToConfirmStatus>('idle');

  const curso = width - height;
  const tamanhoPolegar = height - 8;

  const x = useMotionValue(0);
  const opacidadeTexto = useTransform(x, [0, curso * 0.5], [1, 0]);
  const larguraPreenchida = useTransform(x, [0, curso], [height, width]);
  const montado = useRef(true);

  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
    };
  }, []);

  const voltarAoInicio = useCallback(() => {
    animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
  }, [x]);

  const confirmar = useCallback(async () => {
    if (status !== 'idle' || disabled) return;

    animate(x, curso, { type: 'spring', stiffness: 400, damping: 30 });
    setStatus('loading');

    try {
      await onConfirm();
      // A acao pode terminar depois que o componente saiu da tela; atualizar
      // estado ai dispara aviso do React e nao serve a ninguem.
      if (!montado.current) return;
      setStatus('success');

      if (resetAfter > 0) {
        window.setTimeout(() => {
          if (!montado.current) return;
          setStatus('idle');
          voltarAoInicio();
        }, resetAfter);
      }
    } catch (erro) {
      if (!montado.current) return;
      setStatus('error');
      voltarAoInicio();
      // O original engolia a falha e voltava ao inicio sem sinal. Quem confirmou
      // ficava sem saber se a acao aconteceu.
      onError?.(erro);
      window.setTimeout(() => {
        if (montado.current) setStatus('idle');
      }, 1200);
    }
  }, [status, disabled, curso, x, onConfirm, onError, resetAfter, voltarAoInicio]);

  const aoSoltar = useCallback(() => {
    if (status !== 'idle') return;
    if (x.get() >= curso * threshold) void confirmar();
    else voltarAoInicio();
  }, [status, x, curso, threshold, confirmar, voltarAoInicio]);

  const aoTeclar = useCallback(
    (evento: KeyboardEvent<HTMLDivElement>) => {
      if (status !== 'idle' || disabled) return;
      const passo = curso / 10;

      switch (evento.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          evento.preventDefault();
          animate(x, Math.min(curso, x.get() + passo), { duration: 0.12 });
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          evento.preventDefault();
          animate(x, Math.max(0, x.get() - passo), { duration: 0.12 });
          break;
        case 'Home':
          evento.preventDefault();
          voltarAoInicio();
          break;
        case 'End':
        case 'Enter':
        case ' ':
          evento.preventDefault();
          void confirmar();
          break;
        default:
          break;
      }
    },
    [status, disabled, curso, x, confirmar, voltarAoInicio],
  );

  const corSucesso = theme.colors.green?.[6] ?? '#22c55e';
  const corPrimaria = theme.colors[theme.primaryColor]?.[6] ?? '#228be6';
  const concluido = status === 'success';

  return (
    <Box
      className={className}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel ?? label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={concluido ? 100 : 0}
      aria-valuetext={concluido ? successLabel : label}
      aria-disabled={disabled}
      aria-busy={status === 'loading'}
      onKeyDown={aoTeclar}
      style={{
        position: 'relative',
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        borderRadius: height / 2,
        border: `1px solid ${concluido ? corSucesso : 'var(--mantine-color-default-border)'}`,
        background: 'var(--mantine-color-default)',
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : undefined,
      }}
    >
      <motion.div
        aria-hidden
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '100%',
          borderRadius: height / 2,
          width: concluido ? width : larguraPreenchida,
          backgroundColor: concluido ? corSucesso : corPrimaria,
          opacity: concluido ? 0.16 : 0.08,
        }}
      />

      <motion.span
        style={{
          position: 'absolute',
          opacity: status === 'idle' ? opacidadeTexto : 0,
          pointerEvents: 'none',
        }}
      >
        <Text size="sm" fw={500} c="dimmed">
          {label}
        </Text>
      </motion.span>

      {concluido && (
        <Text size="sm" fw={500} style={{ position: 'absolute' }} c={corSucesso}>
          {successLabel}
        </Text>
      )}

      <motion.div
        drag={status === 'idle' && !disabled ? 'x' : false}
        dragConstraints={{ left: 0, right: curso }}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={aoSoltar}
        whileTap={{ scale: status === 'idle' && !disabled ? 0.95 : 1 }}
        style={{
          position: 'absolute',
          left: 4,
          zIndex: 1,
          x,
          width: tamanhoPolegar,
          height: tamanhoPolegar,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: concluido ? corSucesso : 'var(--mantine-color-body)',
          color: concluido ? '#fff' : undefined,
          boxShadow: 'var(--mantine-shadow-sm)',
          cursor: disabled ? 'not-allowed' : status === 'idle' ? 'grab' : 'default',
        }}
      >
        {status === 'loading' ? (
          <Loader size="xs" />
        ) : concluido ? (
          <IconCheck size={20} />
        ) : (
          <IconArrowRight size={20} opacity={0.7} />
        )}
      </motion.div>
    </Box>
  );
}
