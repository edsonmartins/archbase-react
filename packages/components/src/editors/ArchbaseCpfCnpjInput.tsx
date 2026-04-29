import React, { useCallback, useState, useMemo } from 'react';
import { TextInput, TextInputProps, ThemeIcon, Tooltip } from '@mantine/core';
import { IconCheck, IconX, IconId } from '@tabler/icons-react';

// =============================================================================
// CPF/CNPJ Validation Utilities
// =============================================================================

function stripNonDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function validateCPF(cpf: string): boolean {
  const digits = stripNonDigits(cpf);
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i]) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i]) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(digits[10])) return false;

  return true;
}

export function validateCNPJ(cnpj: string): boolean {
  const digits = stripNonDigits(cnpj);
  if (digits.length !== 14) return false;
  if (/^(\d)\1+$/.test(digits)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i]) * weights1[i];
  }
  let remainder = sum % 11;
  let digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(digits[12])) return false;

  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(digits[i]) * weights2[i];
  }
  remainder = sum % 11;
  let digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(digits[13])) return false;

  return true;
}

export function formatCPF(cpf: string): string {
  const digits = stripNonDigits(cpf);
  return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

export function formatCNPJ(cnpj: string): string {
  const digits = stripNonDigits(cnpj);
  return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export type DocumentType = 'cpf' | 'cnpj' | 'unknown';

export function detectDocumentType(value: string): DocumentType {
  const digits = stripNonDigits(value);
  if (digits.length <= 11) return 'cpf';
  if (digits.length <= 14) return 'cnpj';
  return 'unknown';
}

// =============================================================================
// Types
// =============================================================================

export interface ArchbaseCpfCnpjInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  /** Valor atual */
  value?: string;
  /** Callback ao mudar */
  onChange?: (value: string) => void;
  /** Tipo de documento (auto-detecta se não informado) */
  documentType?: 'cpf' | 'cnpj' | 'auto';
  /** Mostrar ícone de validação */
  showValidationIcon?: boolean;
  /** Callback ao validar */
  onValidate?: (isValid: boolean, type: DocumentType) => void;
}

// =============================================================================
// ArchbaseCpfCnpjInput Component
// =============================================================================

export function ArchbaseCpfCnpjInput({
  value = '',
  onChange,
  documentType = 'auto',
  showValidationIcon = true,
  onValidate,
  ...props
}: ArchbaseCpfCnpjInputProps) {
  const digits = stripNonDigits(value);
  const detectedType = documentType === 'auto' ? detectDocumentType(value) : documentType;

  const isValid = useMemo(() => {
    if (detectedType === 'cpf' && digits.length === 11) {
      return validateCPF(digits);
    }
    if (detectedType === 'cnpj' && digits.length === 14) {
      return validateCNPJ(digits);
    }
    return false;
  }, [digits, detectedType]);

  const formattedValue = useMemo(() => {
    if (detectedType === 'cpf') {
      return digits.replace(/(\d{3})(\d{3})?(\d{3})?(\d{2})?/, (_, p1, p2, p3, p4) => {
        let result = p1;
        if (p2) result += '.' + p2;
        if (p3) result += '.' + p3;
        if (p4) result += '-' + p4;
        return result;
      });
    }
    if (detectedType === 'cnpj') {
      return digits.replace(/(\d{2})(\d{3})?(\d{3})?(\d{4})?(\d{2})?/, (_, p1, p2, p3, p4, p5) => {
        let result = p1;
        if (p2) result += '.' + p2;
        if (p3) result += '.' + p3;
        if (p4) result += '/' + p4;
        if (p5) result += '-' + p5;
        return result;
      });
    }
    return value;
  }, [digits, detectedType, value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDigits = stripNonDigits(e.target.value);
      const maxLength = detectedType === 'cnpj' ? 14 : 11;
      const truncated = newDigits.slice(0, maxLength);
      onChange?.(truncated);
    },
    [onChange, detectedType]
  );

  React.useEffect(() => {
    if (digits.length === 11 || digits.length === 14) {
      onValidate?.(isValid, detectedType);
    }
  }, [isValid, detectedType, digits.length, onValidate]);

  const rightSection = showValidationIcon && (digits.length === 11 || digits.length === 14) ? (
    <Tooltip label={isValid ? 'Válido' : 'Inválido'}>
      <ThemeIcon
        size="sm"
        variant="light"
        color={isValid ? 'green' : 'red'}
        radius="xl"
      >
        {isValid ? <IconCheck size={14} /> : <IconX size={14} />}
      </ThemeIcon>
    </Tooltip>
  ) : (
    <ThemeIcon size="sm" variant="light" color="gray" radius="xl">
      <IconId size={14} />
    </ThemeIcon>
  );

  return (
    <TextInput
      {...props}
      value={formattedValue}
      onChange={handleChange}
      rightSection={rightSection}
      placeholder={detectedType === 'cnpj' ? '00.000.000/0000-00' : '000.000.000-00'}
      maxLength={detectedType === 'cnpj' ? 18 : 14}
    />
  );
}

export default ArchbaseCpfCnpjInput;
