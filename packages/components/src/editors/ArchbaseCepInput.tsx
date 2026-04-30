import React, { useCallback, useState } from 'react';
import { TextInput, TextInputProps, Loader, ThemeIcon, Tooltip } from '@mantine/core';
import { IconMapPin, IconCheck, IconX } from '@tabler/icons-react';

// =============================================================================
// Types
// =============================================================================

export interface CepAddress {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service?: string;
}

export interface ArchbaseCepInputProps extends Omit<TextInputProps, 'value' | 'onChange' | 'onError'> {
  /** Valor atual */
  value?: string;
  /** Callback ao mudar */
  onChange?: (value: string) => void;
  /** Callback ao encontrar endereço */
  onAddressFound?: (address: CepAddress) => void;
  /** Callback em caso de erro */
  onCepError?: (error: Error) => void;
  /** Auto-buscar ao completar CEP */
  autoFetch?: boolean;
  /** Mostrar ícone de status */
  showStatusIcon?: boolean;
}

// =============================================================================
// CEP Utilities
// =============================================================================

function stripNonDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatCep(cep: string): string {
  const digits = stripNonDigits(cep);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
}

async function fetchCepViaCep(cep: string): Promise<CepAddress | null> {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    if (data.erro) return null;
    return {
      cep: data.cep,
      state: data.uf,
      city: data.localidade,
      neighborhood: data.bairro,
      street: data.logradouro,
      service: 'viacep',
    };
  } catch {
    return null;
  }
}

async function fetchCepBrasilAPI(cep: string): Promise<CepAddress | null> {
  try {
    const response = await fetch(`https://brasilapi.com.br/api/cep/v1/${cep}`);
    const data = await response.json();
    if (data.errors) return null;
    return {
      cep: data.cep,
      state: data.state,
      city: data.city,
      neighborhood: data.neighborhood,
      street: data.street,
      service: 'brasilapi',
    };
  } catch {
    return null;
  }
}

// =============================================================================
// ArchbaseCepInput Component
// =============================================================================

export function ArchbaseCepInput({
  value = '',
  onChange,
  onAddressFound,
  onCepError,
  autoFetch = true,
  showStatusIcon = true,
  ...props
}: ArchbaseCepInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'found' | 'notfound'>('idle');

  const digits = stripNonDigits(value);

  const fetchAddress = useCallback(async (cep: string) => {
    if (cep.length !== 8) return;

    setIsLoading(true);
    setStatus('idle');

    try {
      let address = await fetchCepViaCep(cep);
      if (!address) {
        address = await fetchCepBrasilAPI(cep);
      }

      if (address) {
        setStatus('found');
        onAddressFound?.(address);
      } else {
        setStatus('notfound');
        onCepError?.(new Error('CEP não encontrado'));
      }
    } catch (error) {
      setStatus('notfound');
      onCepError?.(error instanceof Error ? error : new Error('Erro ao buscar CEP'));
    } finally {
      setIsLoading(false);
    }
  }, [onAddressFound, onCepError]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newDigits = stripNonDigits(e.target.value).slice(0, 8);
      onChange?.(newDigits);

      if (autoFetch && newDigits.length === 8) {
        fetchAddress(newDigits);
      } else {
        setStatus('idle');
      }
    },
    [onChange, autoFetch, fetchAddress]
  );

  const rightSection = isLoading ? (
    <Loader size="xs" />
  ) : showStatusIcon && digits.length === 8 ? (
    <Tooltip label={status === 'found' ? 'CEP encontrado' : 'CEP não encontrado'}>
      <ThemeIcon
        size="sm"
        variant="light"
        color={status === 'found' ? 'green' : status === 'notfound' ? 'red' : 'gray'}
        radius="xl"
      >
        {status === 'found' ? <IconCheck size={14} /> : status === 'notfound' ? <IconX size={14} /> : <IconMapPin size={14} />}
      </ThemeIcon>
    </Tooltip>
  ) : (
    <ThemeIcon size="sm" variant="light" color="gray" radius="xl">
      <IconMapPin size={14} />
    </ThemeIcon>
  );

  return (
    <TextInput
      {...props}
      value={formatCep(value)}
      onChange={handleChange}
      rightSection={rightSection}
      placeholder="00000-000"
      maxLength={9}
    />
  );
}

export default ArchbaseCepInput;
