import React, { useEffect } from 'react';
import { TextInput, ActionIcon, useMantineColorScheme } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import { useArchbaseTranslation } from '@archbase/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useArchbaseTheme } from '@archbase/core';

/**
 * Props para o componente de pesquisa global
 */
export interface GlobalSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  debounceTime?: number;
}

/**
 * Componente para barra de pesquisa global integrado com Mantine
 * Usa debounce para evitar chamadas excessivas durante a digitação
 */
export const GlobalSearchInput: React.FC<GlobalSearchInputProps> = ({
  value,
  onChange,
  onClear,
  debounceTime = 500 // Valor padrão de debounce (300ms)
}) => {
  const { t } = useArchbaseTranslation();
  const tString = (key: string) => String(t(key));
  const theme = useArchbaseTheme();
  const scheme = useMantineColorScheme();

  // Estado interno para o input
  const [inputValue, setInputValue] = React.useState(value);

  // Flag para indicar que o clear foi chamado intencionalmente
  // Isso evita que o debounce restaure o valor antigo após o clear
  const clearIntentionalRef = React.useRef(false);

  // Aplicar debounce ao valor digitado
  const [debouncedValue] = useDebouncedValue(inputValue, debounceTime);

  // Atualizar o valor interno quando o valor externo muda
  React.useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Propagar o valor com debounce para o callback
  React.useEffect(() => {
    // Se o clear foi intencional e o inputValue está vazio, não fazer nada
    // Isso evita que o debounce com valor antigo sobrescreva o clear
    if (clearIntentionalRef.current && inputValue === '') {
      // Se o debouncedValue também está vazio, resetar a flag
      if (debouncedValue === '') {
        clearIntentionalRef.current = false;
      }
      return;
    }

    if (debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value, inputValue]);

  // Manipular mudança no input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearIntentionalRef.current = false; // Reset flag ao digitar
    setInputValue(event.currentTarget.value);
  };

  // Manipular limpar input
  const handleClear = () => {
    console.log('[GlobalSearchInput] handleClear chamado');
    clearIntentionalRef.current = true; // Marcar que o clear foi intencional
    setInputValue('');
    onClear();
  };

  // Renderizar botão de limpar quando houver texto
  const rightSection = inputValue ? (
    <ActionIcon
      onClick={handleClear}
      variant="transparent"
      color="gray"
      aria-label="Limpar busca"
    >
      <IconX size={16} />
    </ActionIcon>
  ) : null;

  return (
    <TextInput
      placeholder={tString('Buscar...')}
      value={inputValue}
      onChange={handleInputChange}
      leftSection={<IconSearch size={16} color={theme.colors.gray[6]} />}
      rightSection={rightSection}
      styles={(theme) => ({
        root: {
          width: '300px',
        },
        input: {
          '&:focus': {
            borderColor: theme.colors[theme.primaryColor][6],
          },
          '&::placeholder': {
            color: scheme.colorScheme === 'dark' ? theme.colors.gray[5] : theme.colors.gray[6],
          },
          backgroundColor: scheme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
          color: scheme.colorScheme === 'dark' ? theme.colors.gray[2] : theme.colors.dark[9],
        },
      })}
      size="sm"
    />
  );
};

export default GlobalSearchInput;
