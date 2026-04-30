import React, { forwardRef, useCallback, ReactNode } from 'react';
import {
  Box,
  Button,
  ActionIcon,
  Group,
  Stack,
  Text,
  Paper,
  MantineColor,
  MantineSize,
} from '@mantine/core';
import { IconPlus, IconTrash, IconGripVertical } from '@tabler/icons-react';
import { useFieldArray, UseFieldArrayReturn, Control, FieldValues, ArrayPath, FieldArrayWithId } from 'react-hook-form';

export interface ArchbaseFieldArrayItemProps<T extends FieldValues> {
  /** Índice do item */
  index: number;
  /** Dados do item */
  item: FieldArrayWithId<T>;
  /** Função para remover o item */
  remove: () => void;
  /** Se pode remover (baseado em minItems) */
  canRemove: boolean;
  /** Se pode arrastar */
  canDrag: boolean;
  /** Props de drag handle */
  dragHandleProps?: Record<string, any>;
}

export interface ArchbaseFieldArrayProps<T extends FieldValues> {
  /** Nome do campo no form */
  name: ArrayPath<T>;
  /** Control do react-hook-form */
  control: Control<T>;
  /** Renderizador do item */
  renderItem: (props: ArchbaseFieldArrayItemProps<T>) => ReactNode;
  /** Valor padrão para novos itens */
  defaultValue?: Record<string, any>;
  /** Mínimo de itens */
  minItems?: number;
  /** Máximo de itens */
  maxItems?: number;
  /** Label do botão adicionar */
  addLabel?: string;
  /** Componente de empty state */
  emptyState?: ReactNode;
  /** Se permite reordenar */
  sortable?: boolean;
  /** Se deve mostrar o header */
  showHeader?: boolean;
  /** Título do campo */
  title?: string;
  /** Descrição do campo */
  description?: string;
  /** Cor do botão adicionar */
  addButtonColor?: MantineColor;
  /** Variante do botão adicionar */
  addButtonVariant?: 'filled' | 'light' | 'outline' | 'subtle' | 'default';
  /** Tamanho */
  size?: MantineSize;
  /** Se deve usar Paper em volta de cada item */
  withPaper?: boolean;
  /** Se deve mostrar índice */
  showIndex?: boolean;
  /** Espaçamento entre itens */
  gap?: MantineSize | number;
  /** Se está desabilitado */
  disabled?: boolean;
  /** Callback quando array muda */
  onArrayChange?: (items: any[]) => void;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

function ArchbaseFieldArrayInner<T extends FieldValues>(
  {
    name,
    control,
    renderItem,
    defaultValue = {},
    minItems = 0,
    maxItems,
    addLabel = 'Adicionar',
    emptyState,
    sortable = false,
    showHeader = true,
    title,
    description,
    addButtonColor = 'blue',
    addButtonVariant = 'light',
    size = 'sm',
    withPaper = true,
    showIndex = false,
    gap = 'sm',
    disabled = false,
    onArrayChange,
    className,
    style,
  }: ArchbaseFieldArrayProps<T>,
  ref: React.Ref<HTMLDivElement>
) {
  const { fields, append, remove, move, swap } = useFieldArray({
    control,
    name,
  });

  const handleAdd = useCallback(() => {
    if (maxItems && fields.length >= maxItems) return;
    append(defaultValue as any);
    onArrayChange?.([...fields, defaultValue]);
  }, [append, defaultValue, fields, maxItems, onArrayChange]);

  const handleRemove = useCallback(
    (index: number) => {
      if (fields.length <= minItems) return;
      remove(index);
      onArrayChange?.(fields.filter((_, i) => i !== index));
    },
    [fields, minItems, onArrayChange, remove]
  );

  const canAdd = !maxItems || fields.length < maxItems;
  const canRemove = fields.length > minItems;

  const DefaultEmptyState = (
    <Paper p="xl" withBorder style={{ textAlign: 'center' }}>
      <Text c="dimmed" size="sm">
        Nenhum item adicionado
      </Text>
      <Button
        mt="sm"
        variant={addButtonVariant}
        color={addButtonColor}
        size={size}
        leftSection={<IconPlus size={16} />}
        onClick={handleAdd}
        disabled={disabled || !canAdd}
      >
        {addLabel}
      </Button>
    </Paper>
  );

  return (
    <Stack ref={ref} gap={gap} className={className} style={style}>
      {/* Header */}
      {showHeader && (title || description) && (
        <Box>
          {title && (
            <Text fw={500} size="sm">
              {title}
            </Text>
          )}
          {description && (
            <Text size="xs" c="dimmed">
              {description}
            </Text>
          )}
        </Box>
      )}

      {/* Items */}
      {fields.length === 0 ? (
        emptyState || DefaultEmptyState
      ) : (
        <Stack gap={gap}>
          {fields.map((field, index) => {
            const itemContent = (
              <Group gap="sm" wrap="nowrap" align="flex-start">
                {/* Drag handle */}
                {sortable && (
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size={size}
                    style={{ cursor: 'grab' }}
                    disabled={disabled}
                  >
                    <IconGripVertical size={16} />
                  </ActionIcon>
                )}

                {/* Index */}
                {showIndex && (
                  <Text size="sm" c="dimmed" w={30} ta="center">
                    {index + 1}
                  </Text>
                )}

                {/* Item content */}
                <Box style={{ flex: 1 }}>
                  {renderItem({
                    index,
                    item: field,
                    remove: () => handleRemove(index),
                    canRemove: canRemove && !disabled,
                    canDrag: sortable && !disabled,
                  })}
                </Box>

                {/* Remove button */}
                <ActionIcon
                  variant="subtle"
                  color="red"
                  size={size}
                  onClick={() => handleRemove(index)}
                  disabled={!canRemove || disabled}
                  title="Remover"
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            );

            return withPaper ? (
              <Paper key={field.id} p="sm" withBorder>
                {itemContent}
              </Paper>
            ) : (
              <Box key={field.id}>{itemContent}</Box>
            );
          })}

          {/* Add button */}
          {canAdd && (
            <Button
              variant={addButtonVariant}
              color={addButtonColor}
              size={size}
              leftSection={<IconPlus size={16} />}
              onClick={handleAdd}
              disabled={disabled}
            >
              {addLabel}
            </Button>
          )}
        </Stack>
      )}
    </Stack>
  );
}

export const ArchbaseFieldArray = forwardRef(ArchbaseFieldArrayInner) as <T extends FieldValues>(
  props: ArchbaseFieldArrayProps<T> & { ref?: React.Ref<HTMLDivElement> }
) => React.ReactElement;

(ArchbaseFieldArray as any).displayName = 'ArchbaseFieldArray';

// ================== Hook simplificado ==================

export interface UseArchbaseFieldArrayOptions<T extends FieldValues> {
  name: ArrayPath<T>;
  control: Control<T>;
  minItems?: number;
  maxItems?: number;
  defaultValue?: Record<string, any>;
}

export interface UseArchbaseFieldArrayReturn<T extends FieldValues>
  extends UseFieldArrayReturn<T> {
  canAdd: boolean;
  canRemove: boolean;
  addItem: () => void;
  removeItem: (index: number) => void;
}

export function useArchbaseFieldArray<T extends FieldValues>(
  options: UseArchbaseFieldArrayOptions<T>
): UseArchbaseFieldArrayReturn<T> {
  const { minItems = 0, maxItems, defaultValue = {} } = options;

  const fieldArray = useFieldArray({
    control: options.control,
    name: options.name,
  });

  const canAdd = !maxItems || fieldArray.fields.length < maxItems;
  const canRemove = fieldArray.fields.length > minItems;

  const addItem = useCallback(() => {
    if (canAdd) {
      fieldArray.append(defaultValue as any);
    }
  }, [canAdd, defaultValue, fieldArray]);

  const removeItem = useCallback(
    (index: number) => {
      if (canRemove) {
        fieldArray.remove(index);
      }
    },
    [canRemove, fieldArray]
  );

  return {
    ...fieldArray,
    canAdd,
    canRemove,
    addItem,
    removeItem,
  };
}
