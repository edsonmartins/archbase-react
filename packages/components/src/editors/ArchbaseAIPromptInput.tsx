import React, { forwardRef, useCallback, useState, useRef, KeyboardEvent, ReactNode } from 'react';
import {
  Textarea,
  TextareaProps,
  ActionIcon,
  Group,
  Stack,
  Text,
  Box,
  Loader,
  Badge,
  Menu,
  MantineColor,
  MantineSize,
} from '@mantine/core';
import { IconSend, IconMicrophone, IconChevronUp, IconChevronDown, IconSparkles } from '@tabler/icons-react';

export interface ArchbaseAIPromptSuggestion {
  /** ID único */
  id: string;
  /** Texto da sugestão */
  text: string;
  /** Ícone opcional */
  icon?: ReactNode;
  /** Categoria */
  category?: string;
}

export interface ArchbaseAIPromptInputProps extends Omit<TextareaProps, 'onSubmit'> {
  /** Callback ao enviar (Enter) */
  onSubmit?: (value: string) => void | Promise<void>;
  /** Se está carregando/processando */
  loading?: boolean;
  /** Placeholder */
  placeholder?: string;
  /** Sugestões rápidas */
  suggestions?: ArchbaseAIPromptSuggestion[];
  /** Se deve mostrar sugestões */
  showSuggestions?: boolean;
  /** Histórico de prompts */
  history?: string[];
  /** Se deve habilitar navegação no histórico */
  enableHistory?: boolean;
  /** Máximo de caracteres */
  maxLength?: number;
  /** Se deve mostrar contador */
  showCounter?: boolean;
  /** Se deve habilitar voice input */
  enableVoice?: boolean;
  /** Callback de voice input */
  onVoiceInput?: (transcript: string) => void;
  /** Cor do botão enviar */
  submitColor?: MantineColor;
  /** Ícone do botão enviar */
  submitIcon?: ReactNode;
  /** Tamanho */
  size?: MantineSize;
  /** Mínimo de linhas */
  minRows?: number;
  /** Máximo de linhas */
  maxRows?: number;
  /** Se deve auto-expandir */
  autosize?: boolean;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseAIPromptInput = forwardRef<HTMLTextAreaElement, ArchbaseAIPromptInputProps>(
  (
    {
      onSubmit,
      loading = false,
      placeholder = 'Digite sua mensagem...',
      suggestions = [],
      showSuggestions = true,
      history = [],
      enableHistory = true,
      maxLength,
      showCounter = true,
      enableVoice = false,
      onVoiceInput,
      submitColor = 'blue',
      submitIcon,
      size = 'md',
      minRows = 1,
      maxRows = 6,
      autosize = true,
      disabled = false,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    const [value, setValue] = useState('');
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isRecording, setIsRecording] = useState(false);
    const [showSuggestionsMenu, setShowSuggestionsMenu] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = useCallback(async () => {
      if (!value.trim() || loading || disabled) return;

      const trimmedValue = value.trim();
      setValue('');
      setHistoryIndex(-1);

      if (onSubmit) {
        await onSubmit(trimmedValue);
      }
    }, [disabled, loading, onSubmit, value]);

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLTextAreaElement>) => {
        // Enter sem Shift envia
        if (event.key === 'Enter' && !event.shiftKey) {
          event.preventDefault();
          handleSubmit();
          return;
        }

        // Navegação no histórico
        if (enableHistory && history.length > 0) {
          if (event.key === 'ArrowUp' && event.ctrlKey) {
            event.preventDefault();
            const newIndex = Math.min(historyIndex + 1, history.length - 1);
            setHistoryIndex(newIndex);
            setValue(history[history.length - 1 - newIndex] || '');
          } else if (event.key === 'ArrowDown' && event.ctrlKey) {
            event.preventDefault();
            const newIndex = Math.max(historyIndex - 1, -1);
            setHistoryIndex(newIndex);
            setValue(newIndex === -1 ? '' : history[history.length - 1 - newIndex] || '');
          }
        }
      },
      [enableHistory, handleSubmit, history, historyIndex]
    );

    const handleVoiceClick = useCallback(() => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        console.warn('Speech recognition not supported');
        return;
      }

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();

      recognition.lang = 'pt-BR';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsRecording(true);
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setValue((prev) => prev + (prev ? ' ' : '') + transcript);
        onVoiceInput?.(transcript);
      };

      if (isRecording) {
        recognition.stop();
      } else {
        recognition.start();
      }
    }, [isRecording, onVoiceInput]);

    const handleSuggestionClick = useCallback((suggestion: ArchbaseAIPromptSuggestion) => {
      setValue(suggestion.text);
      setShowSuggestionsMenu(false);
      textareaRef.current?.focus();
    }, []);

    const charCount = value.length;
    const isOverLimit = maxLength ? charCount > maxLength : false;

    return (
      <Stack gap="xs" className={className} style={style}>
        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <Group gap="xs">
            {suggestions.slice(0, 4).map((suggestion) => (
              <Badge
                key={suggestion.id}
                variant="light"
                color="gray"
                size="sm"
                style={{ cursor: 'pointer' }}
                onClick={() => handleSuggestionClick(suggestion)}
                leftSection={suggestion.icon}
              >
                {suggestion.text.length > 30 ? suggestion.text.slice(0, 30) + '...' : suggestion.text}
              </Badge>
            ))}
            {suggestions.length > 4 && (
              <Menu opened={showSuggestionsMenu} onChange={setShowSuggestionsMenu}>
                <Menu.Target>
                  <Badge
                    variant="light"
                    color="blue"
                    size="sm"
                    style={{ cursor: 'pointer' }}
                    leftSection={<IconSparkles size={12} />}
                  >
                    +{suggestions.length - 4} mais
                  </Badge>
                </Menu.Target>
                <Menu.Dropdown>
                  {suggestions.slice(4).map((suggestion) => (
                    <Menu.Item
                      key={suggestion.id}
                      leftSection={suggestion.icon}
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion.text}
                    </Menu.Item>
                  ))}
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        )}

        {/* Input area */}
        <Box
          style={{
            position: 'relative',
            border: '1px solid var(--mantine-color-gray-4)',
            borderRadius: 'var(--mantine-radius-md)',
            backgroundColor: 'var(--mantine-color-body)',
            padding: '8px 12px',
          }}
        >
          <Textarea
            ref={ref || textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            autosize={autosize}
            minRows={minRows}
            maxRows={maxRows}
            size={size}
            disabled={disabled || loading}
            variant="unstyled"
            styles={{
              input: {
                paddingRight: 80,
              },
            }}
            {...rest}
          />

          {/* Actions */}
          <Group
            gap={4}
            style={{
              position: 'absolute',
              right: 8,
              bottom: 8,
            }}
          >
            {/* Voice button */}
            {enableVoice && (
              <ActionIcon
                variant={isRecording ? 'filled' : 'subtle'}
                color={isRecording ? 'red' : 'gray'}
                size={size}
                onClick={handleVoiceClick}
                disabled={disabled || loading}
              >
                <IconMicrophone size={18} />
              </ActionIcon>
            )}

            {/* History navigation */}
            {enableHistory && history.length > 0 && (
              <Group gap={0}>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="xs"
                  onClick={() => {
                    const newIndex = Math.min(historyIndex + 1, history.length - 1);
                    setHistoryIndex(newIndex);
                    setValue(history[history.length - 1 - newIndex] || '');
                  }}
                  disabled={historyIndex >= history.length - 1}
                >
                  <IconChevronUp size={14} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="xs"
                  onClick={() => {
                    const newIndex = Math.max(historyIndex - 1, -1);
                    setHistoryIndex(newIndex);
                    setValue(newIndex === -1 ? '' : history[history.length - 1 - newIndex] || '');
                  }}
                  disabled={historyIndex <= -1}
                >
                  <IconChevronDown size={14} />
                </ActionIcon>
              </Group>
            )}

            {/* Submit button */}
            <ActionIcon
              variant="filled"
              color={submitColor}
              size={size}
              onClick={handleSubmit}
              disabled={!value.trim() || loading || disabled || isOverLimit}
            >
              {loading ? (
                <Loader size="xs" color="white" />
              ) : (
                submitIcon || <IconSend size={18} />
              )}
            </ActionIcon>
          </Group>
        </Box>

        {/* Counter */}
        {showCounter && maxLength && (
          <Text size="xs" c={isOverLimit ? 'red' : 'dimmed'} ta="right">
            {charCount}/{maxLength}
          </Text>
        )}
      </Stack>
    );
  }
);

ArchbaseAIPromptInput.displayName = 'ArchbaseAIPromptInput';

// ================== Hook para histórico de prompts ==================

export interface UseArchbasePromptHistoryOptions {
  maxHistory?: number;
  storageKey?: string;
}

export interface UseArchbasePromptHistoryReturn {
  history: string[];
  addToHistory: (prompt: string) => void;
  clearHistory: () => void;
  currentIndex: number;
  navigateUp: () => string | null;
  navigateDown: () => string | null;
  resetNavigation: () => void;
}

export function useArchbasePromptHistory(
  options: UseArchbasePromptHistoryOptions = {}
): UseArchbasePromptHistoryReturn {
  const { maxHistory = 50, storageKey } = options;
  const [history, setHistory] = useState<string[]>(() => {
    if (storageKey && typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addToHistory = useCallback(
    (prompt: string) => {
      const trimmed = prompt.trim();
      if (!trimmed) return;

      setHistory((prev) => {
        const filtered = prev.filter((p) => p !== trimmed);
        const newHistory = [trimmed, ...filtered].slice(0, maxHistory);

        if (storageKey) {
          localStorage.setItem(storageKey, JSON.stringify(newHistory));
        }

        return newHistory;
      });
      setCurrentIndex(-1);
    },
    [maxHistory, storageKey]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
    if (storageKey) {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  const navigateUp = useCallback(() => {
    if (currentIndex >= history.length - 1) return null;
    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);
    return history[newIndex];
  }, [currentIndex, history]);

  const navigateDown = useCallback(() => {
    if (currentIndex <= 0) {
      setCurrentIndex(-1);
      return null;
    }
    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);
    return history[newIndex];
  }, [currentIndex, history]);

  const resetNavigation = useCallback(() => {
    setCurrentIndex(-1);
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
    currentIndex,
    navigateUp,
    navigateDown,
    resetNavigation,
  };
}
