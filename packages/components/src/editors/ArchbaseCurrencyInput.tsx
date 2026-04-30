import React, { useCallback, useState } from 'react';
import { NumberInput, NumberInputProps } from '@mantine/core';

// =============================================================================
// Types
// =============================================================================

export type CurrencyCode = 'BRL' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CNY' | 'ARS' | 'CLP' | 'COP' | 'MXN';

export interface CurrencyConfig {
  prefix: string;
  thousandSeparator: string;
  decimalSeparator: string;
  decimalScale: number;
}

const CURRENCY_CONFIGS: Record<CurrencyCode, CurrencyConfig> = {
  BRL: { prefix: 'R$ ', thousandSeparator: '.', decimalSeparator: ',', decimalScale: 2 },
  USD: { prefix: '$ ', thousandSeparator: ',', decimalSeparator: '.', decimalScale: 2 },
  EUR: { prefix: '€ ', thousandSeparator: '.', decimalSeparator: ',', decimalScale: 2 },
  GBP: { prefix: '£ ', thousandSeparator: ',', decimalSeparator: '.', decimalScale: 2 },
  JPY: { prefix: '¥ ', thousandSeparator: ',', decimalSeparator: '.', decimalScale: 0 },
  CNY: { prefix: '¥ ', thousandSeparator: ',', decimalSeparator: '.', decimalScale: 2 },
  ARS: { prefix: '$ ', thousandSeparator: '.', decimalSeparator: ',', decimalScale: 2 },
  CLP: { prefix: '$ ', thousandSeparator: '.', decimalSeparator: ',', decimalScale: 0 },
  COP: { prefix: '$ ', thousandSeparator: '.', decimalSeparator: ',', decimalScale: 2 },
  MXN: { prefix: '$ ', thousandSeparator: ',', decimalSeparator: '.', decimalScale: 2 },
};

export interface ArchbaseCurrencyInputProps extends Omit<NumberInputProps, 'value' | 'onChange'> {
  /** Moeda */
  currency?: CurrencyCode;
  /** Valor atual */
  value?: number | null;
  /** Callback ao mudar */
  onChange?: (value: number | null) => void;
  /** Permitir valores negativos */
  allowNegative?: boolean;
  /** Mostrar símbolo da moeda */
  showSymbol?: boolean;
}

// =============================================================================
// ArchbaseCurrencyInput Component
// =============================================================================

export function ArchbaseCurrencyInput({
  currency = 'BRL',
  value,
  onChange,
  allowNegative = false,
  showSymbol = true,
  ...props
}: ArchbaseCurrencyInputProps) {
  const config = CURRENCY_CONFIGS[currency];

  const handleChange = useCallback(
    (newValue: string | number) => {
      if (newValue === '' || newValue === null || newValue === undefined) {
        onChange?.(null);
      } else {
        onChange?.(typeof newValue === 'string' ? parseFloat(newValue) : newValue);
      }
    },
    [onChange]
  );

  return (
    <NumberInput
      {...props}
      value={value ?? ''}
      onChange={handleChange}
      prefix={showSymbol ? config.prefix : undefined}
      thousandSeparator={config.thousandSeparator}
      decimalSeparator={config.decimalSeparator}
      decimalScale={config.decimalScale}
      fixedDecimalScale
      allowNegative={allowNegative}
      hideControls
    />
  );
}

// =============================================================================
// Convenience Components
// =============================================================================

export function ArchbaseBRLInput(props: Omit<ArchbaseCurrencyInputProps, 'currency'>) {
  return <ArchbaseCurrencyInput currency="BRL" {...props} />;
}

export function ArchbaseUSDInput(props: Omit<ArchbaseCurrencyInputProps, 'currency'>) {
  return <ArchbaseCurrencyInput currency="USD" {...props} />;
}

export function ArchbaseEURInput(props: Omit<ArchbaseCurrencyInputProps, 'currency'>) {
  return <ArchbaseCurrencyInput currency="EUR" {...props} />;
}

export default ArchbaseCurrencyInput;
