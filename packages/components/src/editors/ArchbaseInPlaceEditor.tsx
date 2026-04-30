import React, { useState, useCallback, useRef, useEffect, KeyboardEvent } from 'react';
import {
  Text,
  TextInput,
  NumberInput,
  Select,
  Textarea,
  Box,
  Group,
  ActionIcon,
  Loader,
  Tooltip,
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { IconCheck, IconX, IconPencil } from '@tabler/icons-react';
import { useClickOutside } from '@mantine/hooks';

// =============================================================================
// Types
// =============================================================================

export type InPlaceEditorType = 'text' | 'number' | 'select' | 'textarea' | 'date';

export interface SelectOption {
  value: string;
  label: string;
}

export interface ArchbaseInPlaceEditorProps {
  /** Valor atual */
  value: any;
  /** Callback ao salvar */
  onSave: (value: any) => void | Promise<void>;
  /** Callback ao cancelar */
  onCancel?: () => void;
  /** Tipo do editor */
  type?: InPlaceEditorType;
  /** Opções para select */
  options?: SelectOption[];
  /** Formatador para exibição */
  formatter?: (value: any) => string;
  /** Validador */
  validate?: (value: any) => boolean | string;
  /** Placeholder do input */
  placeholder?: string;
  /** Texto quando vazio */
  emptyText?: string;
  /** Desabilitado */
  disabled?: boolean;
  /** Salvar ao perder foco */
  saveOnBlur?: boolean;
  /** Mostrar botões de ação */
  showActions?: boolean;
  /** Mostrar ícone de edição no hover */
  showEditIcon?: boolean;
  /** Tamanho do texto */
  textSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Peso do texto */
  textWeight?: number;
  /** Cor do texto */
  textColor?: string;
  /** Número de linhas para textarea */
  textareaRows?: number;
  /** Props do NumberInput */
  numberProps?: {
    min?: number;
    max?: number;
    step?: number;
    decimalScale?: number;
    prefix?: string;
    suffix?: string;
  };
  /** Props do DateInput */
  dateProps?: {
    locale?: string;
    valueFormat?: string;
    minDate?: Date;
    maxDate?: Date;
  };
}

// =============================================================================
// Default Formatters
// =============================================================================

const defaultFormatters: Record<InPlaceEditorType, (value: any) => string> = {
  text: (value) => String(value ?? ''),
  number: (value) => {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat('pt-BR').format(value);
  },
  select: (value) => String(value ?? ''),
  textarea: (value) => String(value ?? ''),
  date: (value) => {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    return date.toLocaleDateString('pt-BR');
  },
};

// =============================================================================
// ArchbaseInPlaceEditor Component
// =============================================================================

export function ArchbaseInPlaceEditor({
  value,
  onSave,
  onCancel,
  type = 'text',
  options = [],
  formatter,
  validate,
  placeholder = 'Clique para editar',
  emptyText = 'Vazio',
  disabled = false,
  saveOnBlur = true,
  showActions = true,
  showEditIcon = true,
  textSize = 'sm',
  textWeight,
  textColor,
  textareaRows = 3,
  numberProps = {},
  dateProps = {},
}: ArchbaseInPlaceEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useClickOutside(() => {
    if (isEditing && saveOnBlur) {
      handleSave();
    }
  });

  // Reset edit value when value prop changes
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select?.();
    }
  }, [isEditing]);

  // Format display value
  const displayFormatter = formatter ?? defaultFormatters[type];
  const displayValue = displayFormatter(value);

  // Start editing
  const handleStartEdit = useCallback(() => {
    if (disabled) return;
    setEditValue(value);
    setError(null);
    setIsEditing(true);
  }, [disabled, value]);

  // Cancel editing
  const handleCancel = useCallback(() => {
    setEditValue(value);
    setError(null);
    setIsEditing(false);
    onCancel?.();
  }, [value, onCancel]);

  // Save value
  const handleSave = useCallback(async () => {
    // Validate
    if (validate) {
      const result = validate(editValue);
      if (result !== true) {
        setError(typeof result === 'string' ? result : 'Valor inválido');
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSave(editValue);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setIsLoading(false);
    }
  }, [editValue, validate, onSave]);

  // Handle keyboard
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter' && type !== 'textarea') {
        event.preventDefault();
        handleSave();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        handleCancel();
      }
    },
    [type, handleSave, handleCancel]
  );

  // Render input based on type
  const renderInput = () => {
    const commonProps = {
      ref: inputRef,
      value: editValue,
      placeholder,
      error: error ?? undefined,
      disabled: isLoading,
      onKeyDown: handleKeyDown,
      size: 'sm' as const,
      style: { flex: 1 },
    };

    switch (type) {
      case 'number':
        return (
          <NumberInput
            {...commonProps}
            value={editValue ?? ''}
            onChange={(val) => setEditValue(val)}
            hideControls
            {...numberProps}
          />
        );

      case 'select':
        return (
          <Select
            {...commonProps}
            value={editValue}
            onChange={(val) => {
              setEditValue(val);
              if (saveOnBlur) {
                // Auto-save on select
                setTimeout(() => handleSave(), 0);
              }
            }}
            data={options}
            searchable
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={editValue ?? ''}
            placeholder={placeholder}
            error={error ?? undefined}
            disabled={isLoading}
            onKeyDown={handleKeyDown}
            size="sm"
            style={{ flex: 1 }}
            onChange={(e) => setEditValue(e.target.value)}
            rows={textareaRows}
            autosize
            minRows={textareaRows}
          />
        );

      case 'date':
        return (
          <DateInput
            {...commonProps}
            value={editValue ? new Date(editValue) : null}
            onChange={(val) => setEditValue(val)}
            {...dateProps}
          />
        );

      case 'text':
      default:
        return (
          <TextInput
            {...commonProps}
            value={editValue ?? ''}
            onChange={(e) => setEditValue(e.target.value)}
          />
        );
    }
  };

  // Render viewing mode
  if (!isEditing) {
    const hasValue = value !== null && value !== undefined && value !== '';
    const selectLabel = type === 'select'
      ? options.find(o => o.value === value)?.label
      : null;

    return (
      <Box
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleStartEdit}
        style={{
          cursor: disabled ? 'default' : 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 4px',
          borderRadius: 4,
          backgroundColor: isHovered && !disabled ? 'var(--mantine-color-gray-1)' : 'transparent',
          transition: 'background-color 150ms',
        }}
      >
        <Text
          size={textSize}
          fw={textWeight}
          c={hasValue ? textColor : 'dimmed'}
          style={{
            fontStyle: hasValue ? 'normal' : 'italic',
          }}
        >
          {hasValue ? (selectLabel ?? displayValue) : emptyText}
        </Text>
        {showEditIcon && isHovered && !disabled && (
          <IconPencil size={14} style={{ opacity: 0.5 }} />
        )}
      </Box>
    );
  }

  // Render editing mode
  return (
    <Box ref={containerRef}>
      <Group gap="xs" wrap="nowrap" align="flex-start">
        {renderInput()}
        {showActions && (
          <Group gap={4} wrap="nowrap">
            {isLoading ? (
              <Loader size="xs" />
            ) : (
              <>
                <Tooltip label="Salvar (Enter)">
                  <ActionIcon
                    variant="light"
                    color="green"
                    size="sm"
                    onClick={handleSave}
                  >
                    <IconCheck size={14} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label="Cancelar (Esc)">
                  <ActionIcon
                    variant="light"
                    color="red"
                    size="sm"
                    onClick={handleCancel}
                  >
                    <IconX size={14} />
                  </ActionIcon>
                </Tooltip>
              </>
            )}
          </Group>
        )}
      </Group>
    </Box>
  );
}

// =============================================================================
// Convenience Components
// =============================================================================

/** Editor inline de texto */
export function ArchbaseInPlaceTextEditor(
  props: Omit<ArchbaseInPlaceEditorProps, 'type'>
) {
  return <ArchbaseInPlaceEditor type="text" {...props} />;
}

/** Editor inline de número */
export function ArchbaseInPlaceNumberEditor(
  props: Omit<ArchbaseInPlaceEditorProps, 'type'>
) {
  return <ArchbaseInPlaceEditor type="number" {...props} />;
}

/** Editor inline de select */
export function ArchbaseInPlaceSelectEditor(
  props: Omit<ArchbaseInPlaceEditorProps, 'type'>
) {
  return <ArchbaseInPlaceEditor type="select" {...props} />;
}

/** Editor inline de data */
export function ArchbaseInPlaceDateEditor(
  props: Omit<ArchbaseInPlaceEditorProps, 'type'>
) {
  return <ArchbaseInPlaceEditor type="date" {...props} />;
}

export default ArchbaseInPlaceEditor;
