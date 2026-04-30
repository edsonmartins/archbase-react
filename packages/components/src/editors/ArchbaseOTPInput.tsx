import React, { useCallback, useEffect, useState } from 'react';
import {
  PinInput,
  PinInputProps,
  Stack,
  Group,
  Text,
  Button,
  Box,
} from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';

// =============================================================================
// Types
// =============================================================================

export interface ArchbaseOTPInputProps extends Omit<PinInputProps, 'value' | 'onChange' | 'error'> {
  /** Número de dígitos (padrão: 6) */
  length?: number;
  /** Valor atual */
  value?: string;
  /** Callback ao mudar */
  onChange?: (value: string) => void;
  /** Callback ao completar */
  onComplete?: (value: string) => void;
  /** Mostrar botão de reenviar */
  showResend?: boolean;
  /** Callback ao reenviar */
  onResend?: () => void;
  /** Tempo de espera para reenviar (segundos) */
  resendCooldown?: number;
  /** Texto do botão reenviar */
  resendText?: string;
  /** Erro */
  errorMessage?: string;
  /** Máscara */
  mask?: boolean;
}

// =============================================================================
// ArchbaseOTPInput Component
// =============================================================================

export function ArchbaseOTPInput({
  length = 6,
  value = '',
  onChange,
  onComplete,
  showResend = false,
  onResend,
  resendCooldown = 60,
  resendText = 'Reenviar código',
  errorMessage,
  mask = false,
  ...props
}: ArchbaseOTPInputProps) {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = useCallback(
    (newValue: string) => {
      onChange?.(newValue);
      if (newValue.length === length) {
        onComplete?.(newValue);
      }
    },
    [onChange, onComplete, length]
  );

  const handleResend = useCallback(() => {
    onResend?.();
    setCountdown(resendCooldown);
  }, [onResend, resendCooldown]);

  return (
    <Stack gap="sm" align="center">
      <PinInput
        {...props}
        length={length}
        value={value}
        onChange={handleChange}
        type={mask ? 'number' : 'number'}
        mask={mask}
        error={!!errorMessage}
      />

      {errorMessage && (
        <Text size="sm" c="red">
          {errorMessage}
        </Text>
      )}

      {showResend && (
        <Group gap="xs">
          {countdown > 0 ? (
            <Text size="sm" c="dimmed">
              Reenviar em {countdown}s
            </Text>
          ) : (
            <Button
              variant="subtle"
              size="xs"
              leftSection={<IconRefresh size={14} />}
              onClick={handleResend}
            >
              {resendText}
            </Button>
          )}
        </Group>
      )}
    </Stack>
  );
}

// =============================================================================
// Convenience Components
// =============================================================================

export function ArchbaseOTP4Input(props: Omit<ArchbaseOTPInputProps, 'length'>) {
  return <ArchbaseOTPInput length={4} {...props} />;
}

export function ArchbaseOTP6Input(props: Omit<ArchbaseOTPInputProps, 'length'>) {
  return <ArchbaseOTPInput length={6} {...props} />;
}

export default ArchbaseOTPInput;
