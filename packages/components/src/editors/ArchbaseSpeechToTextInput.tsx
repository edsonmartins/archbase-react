import React, { useCallback, useState, useEffect, useRef } from 'react';
import {
  TextInput,
  TextInputProps,
  Textarea,
  TextareaProps,
  ActionIcon,
  Tooltip,
  Box,
  Text,
  Loader,
} from '@mantine/core';
import { IconMicrophone, IconMicrophoneOff, IconPlayerStop } from '@tabler/icons-react';

// =============================================================================
// Types
// =============================================================================

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

export interface UseArchbaseSpeechToTextOptions {
  /** Idioma (padrão: pt-BR) */
  lang?: string;
  /** Modo contínuo */
  continuous?: boolean;
  /** Resultados intermediários */
  interimResults?: boolean;
  /** Callback ao obter transcrição */
  onTranscript?: (transcript: string, isFinal: boolean) => void;
  /** Callback em caso de erro */
  onError?: (error: string) => void;
  /** Callback ao iniciar */
  onStart?: () => void;
  /** Callback ao parar */
  onEnd?: () => void;
}

export interface UseArchbaseSpeechToTextReturn {
  /** Se está gravando */
  isListening: boolean;
  /** Transcrição atual */
  transcript: string;
  /** Se o browser suporta */
  isSupported: boolean;
  /** Último erro */
  error: string | null;
  /** Iniciar gravação */
  start: () => void;
  /** Parar gravação */
  stop: () => void;
  /** Limpar transcrição */
  clear: () => void;
}

// =============================================================================
// Hook useArchbaseSpeechToText
// =============================================================================

export function useArchbaseSpeechToText({
  lang = 'pt-BR',
  continuous = false,
  interimResults = true,
  onTranscript,
  onError,
  onStart,
  onEnd,
}: UseArchbaseSpeechToTextOptions = {}): UseArchbaseSpeechToTextReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const isSupported = typeof window !== 'undefined' &&
    (!!window.SpeechRecognition || !!window.webkitSpeechRecognition);

  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionClass();

    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const currentTranscript = finalTranscript || interimTranscript;
      setTranscript(prev => finalTranscript ? prev + finalTranscript : prev);
      onTranscript?.(currentTranscript, !!finalTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const errorMessage = getErrorMessage(event.error);
      setError(errorMessage);
      onError?.(errorMessage);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      onEnd?.();
    };

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
      onStart?.();
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [lang, continuous, interimResults, onTranscript, onError, onStart, onEnd, isSupported]);

  const start = useCallback(() => {
    if (!recognitionRef.current || isListening) return;
    setTranscript('');
    setError(null);
    try {
      recognitionRef.current.start();
    } catch (e) {
      // Already started
    }
  }, [isListening]);

  const stop = useCallback(() => {
    if (!recognitionRef.current || !isListening) return;
    recognitionRef.current.stop();
  }, [isListening]);

  const clear = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    isSupported,
    error,
    start,
    stop,
    clear,
  };
}

function getErrorMessage(error: string): string {
  const messages: Record<string, string> = {
    'no-speech': 'Nenhuma fala detectada',
    'audio-capture': 'Microfone não disponível',
    'not-allowed': 'Permissão de microfone negada',
    'network': 'Erro de conexão',
    'aborted': 'Gravação cancelada',
    'language-not-supported': 'Idioma não suportado',
    'service-not-allowed': 'Serviço não permitido',
  };
  return messages[error] || `Erro: ${error}`;
}

// =============================================================================
// ArchbaseSpeechToTextButton Component
// =============================================================================

export interface ArchbaseSpeechToTextButtonProps {
  /** Callback ao obter transcrição */
  onTranscript: (transcript: string) => void;
  /** Idioma (padrão: pt-BR) */
  lang?: string;
  /** Modo contínuo */
  continuous?: boolean;
  /** Desabilitado */
  disabled?: boolean;
  /** Tamanho do botão */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Cor */
  color?: string;
  /** Tooltip quando desabilitado/não suportado */
  unsupportedTooltip?: string;
}

export function ArchbaseSpeechToTextButton({
  onTranscript,
  lang = 'pt-BR',
  continuous = false,
  disabled = false,
  size = 'md',
  color = 'blue',
  unsupportedTooltip = 'Reconhecimento de voz não suportado neste navegador',
}: ArchbaseSpeechToTextButtonProps) {
  const {
    isListening,
    isSupported,
    error,
    start,
    stop,
  } = useArchbaseSpeechToText({
    lang,
    continuous,
    onTranscript: (text, isFinal) => {
      if (isFinal) {
        onTranscript(text);
      }
    },
  });

  const handleClick = useCallback(() => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  }, [isListening, start, stop]);

  if (!isSupported) {
    return (
      <Tooltip label={unsupportedTooltip}>
        <ActionIcon
          variant="light"
          color="gray"
          size={size}
          disabled
        >
          <IconMicrophoneOff size={16} />
        </ActionIcon>
      </Tooltip>
    );
  }

  return (
    <Tooltip label={isListening ? 'Parar gravação' : 'Gravar voz'}>
      <ActionIcon
        variant={isListening ? 'filled' : 'light'}
        color={isListening ? 'red' : color}
        size={size}
        disabled={disabled}
        onClick={handleClick}
        style={{
          animation: isListening ? 'pulse 1.5s infinite' : undefined,
        }}
      >
        {isListening ? <IconPlayerStop size={16} /> : <IconMicrophone size={16} />}
      </ActionIcon>
    </Tooltip>
  );
}

// =============================================================================
// ArchbaseSpeechToTextInput Component
// =============================================================================

export interface ArchbaseSpeechToTextInputProps extends Omit<TextInputProps, 'value' | 'onChange'> {
  /** Valor atual */
  value?: string;
  /** Callback ao mudar */
  onChange?: (value: string) => void;
  /** Idioma (padrão: pt-BR) */
  lang?: string;
  /** Modo contínuo */
  continuous?: boolean;
  /** Substituir ou anexar transcrição */
  mode?: 'replace' | 'append';
  /** Mostrar indicador de gravação */
  showRecordingIndicator?: boolean;
}

export function ArchbaseSpeechToTextInput({
  value = '',
  onChange,
  lang = 'pt-BR',
  continuous = false,
  mode = 'append',
  showRecordingIndicator = true,
  ...props
}: ArchbaseSpeechToTextInputProps) {
  const handleTranscript = useCallback(
    (transcript: string) => {
      if (mode === 'replace') {
        onChange?.(transcript);
      } else {
        onChange?.(value ? `${value} ${transcript}` : transcript);
      }
    },
    [onChange, value, mode]
  );

  const {
    isListening,
    isSupported,
  } = useArchbaseSpeechToText({ lang, continuous });

  return (
    <TextInput
      {...props}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      rightSection={
        <Box style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {showRecordingIndicator && isListening && (
            <Box
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: 'var(--mantine-color-red-6)',
                animation: 'pulse 1s infinite',
              }}
            />
          )}
          <ArchbaseSpeechToTextButton
            onTranscript={handleTranscript}
            lang={lang}
            continuous={continuous}
            size="xs"
          />
        </Box>
      }
      rightSectionWidth={isListening ? 52 : 36}
    />
  );
}

// =============================================================================
// ArchbaseSpeechToTextArea Component
// =============================================================================

export interface ArchbaseSpeechToTextAreaProps extends Omit<TextareaProps, 'value' | 'onChange'> {
  /** Valor atual */
  value?: string;
  /** Callback ao mudar */
  onChange?: (value: string) => void;
  /** Idioma (padrão: pt-BR) */
  lang?: string;
  /** Modo contínuo */
  continuous?: boolean;
  /** Substituir ou anexar transcrição */
  mode?: 'replace' | 'append';
}

export function ArchbaseSpeechToTextArea({
  value = '',
  onChange,
  lang = 'pt-BR',
  continuous = true,
  mode = 'append',
  ...props
}: ArchbaseSpeechToTextAreaProps) {
  const handleTranscript = useCallback(
    (transcript: string) => {
      if (mode === 'replace') {
        onChange?.(transcript);
      } else {
        onChange?.(value ? `${value} ${transcript}` : transcript);
      }
    },
    [onChange, value, mode]
  );

  return (
    <Box style={{ position: 'relative' }}>
      <Textarea
        {...props}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <Box
        style={{
          position: 'absolute',
          right: 8,
          bottom: 8,
        }}
      >
        <ArchbaseSpeechToTextButton
          onTranscript={handleTranscript}
          lang={lang}
          continuous={continuous}
          size="sm"
        />
      </Box>
    </Box>
  );
}

// =============================================================================
// CSS Keyframes (inject via style tag)
// =============================================================================

const pulseKeyframes = `
@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}
`;

// Inject keyframes
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = pulseKeyframes;
  document.head.appendChild(style);
}

export default ArchbaseSpeechToTextInput;
