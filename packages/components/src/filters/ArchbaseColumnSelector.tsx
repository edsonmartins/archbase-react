import React, { useState, useCallback, useMemo } from 'react';
import {
  Paper,
  Text,
  TextInput,
  Checkbox,
  Group,
  Button,
  ActionIcon,
  ScrollArea,
  Stack,
  Box,
} from '@mantine/core';
import {
  IconSearch,
  IconArrowUp,
  IconArrowDown,
  IconGripVertical,
} from '@tabler/icons-react';

export interface ArchbaseColumnItem {
  field: string;
  label: string;
  visible: boolean;
  order?: number;
}

export interface ArchbaseColumnSelectorProps {
  /** Lista de colunas com configuração de visibilidade e ordem */
  columns: ArchbaseColumnItem[];
  /** Callback chamado quando a configuração de colunas muda */
  onChange: (columns: Array<{ field: string; label: string; visible: boolean; order: number }>) => void;
  /** Rótulo exibido no topo do componente */
  label?: string;
  /** Descrição exibida abaixo do rótulo */
  description?: string;
  /** Exibir campo de busca */
  showSearch?: boolean;
  /** Exibir botões Selecionar Todos / Desmarcar Todos */
  showSelectAll?: boolean;
  /** Altura máxima da lista de colunas */
  maxHeight?: number;
  /** Estilos inline */
  style?: React.CSSProperties;
  /** Classe CSS */
  className?: string;
  /** Largura do componente */
  width?: number | string;
}

function normalizeColumns(columns: ArchbaseColumnItem[]): Array<{ field: string; label: string; visible: boolean; order: number }> {
  return columns.map((col, index) => ({
    field: col.field,
    label: col.label,
    visible: col.visible,
    order: col.order ?? index,
  }));
}

function sortByOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items].sort((a, b) => a.order - b.order);
}

export function ArchbaseColumnSelector({
  columns,
  onChange,
  label,
  description,
  showSearch = true,
  showSelectAll = true,
  maxHeight = 400,
  style,
  className,
  width,
}: ArchbaseColumnSelectorProps) {
  const [internalColumns, setInternalColumns] = useState(() =>
    sortByOrder(normalizeColumns(columns)),
  );
  const [search, setSearch] = useState('');

  const filteredColumns = useMemo(() => {
    if (!search.trim()) return internalColumns;
    const term = search.toLowerCase();
    return internalColumns.filter((col) =>
      col.label.toLowerCase().includes(term),
    );
  }, [internalColumns, search]);

  const emitChange = useCallback(
    (updated: Array<{ field: string; label: string; visible: boolean; order: number }>) => {
      setInternalColumns(updated);
      onChange(updated);
    },
    [onChange],
  );

  const handleToggle = useCallback(
    (field: string) => {
      const updated = internalColumns.map((col) =>
        col.field === field ? { ...col, visible: !col.visible } : col,
      );
      emitChange(updated);
    },
    [internalColumns, emitChange],
  );

  const handleSelectAll = useCallback(() => {
    const updated = internalColumns.map((col) => ({ ...col, visible: true }));
    emitChange(updated);
  }, [internalColumns, emitChange]);

  const handleDeselectAll = useCallback(() => {
    const updated = internalColumns.map((col) => ({ ...col, visible: false }));
    emitChange(updated);
  }, [internalColumns, emitChange]);

  const handleMoveUp = useCallback(
    (field: string) => {
      const index = internalColumns.findIndex((col) => col.field === field);
      if (index <= 0) return;
      const updated = [...internalColumns];
      const prevOrder = updated[index - 1].order;
      updated[index - 1] = { ...updated[index - 1], order: updated[index].order };
      updated[index] = { ...updated[index], order: prevOrder };
      emitChange(sortByOrder(updated));
    },
    [internalColumns, emitChange],
  );

  const handleMoveDown = useCallback(
    (field: string) => {
      const index = internalColumns.findIndex((col) => col.field === field);
      if (index < 0 || index >= internalColumns.length - 1) return;
      const updated = [...internalColumns];
      const nextOrder = updated[index + 1].order;
      updated[index + 1] = { ...updated[index + 1], order: updated[index].order };
      updated[index] = { ...updated[index], order: nextOrder };
      emitChange(sortByOrder(updated));
    },
    [internalColumns, emitChange],
  );

  const allSelected = internalColumns.every((col) => col.visible);
  const noneSelected = internalColumns.every((col) => !col.visible);

  return (
    <Paper
      shadow="xs"
      p="md"
      withBorder
      style={{ width, ...style }}
      className={className}
    >
      <Stack gap="sm">
        {label && (
          <Box>
            <Text fw={600} size="sm">
              {label}
            </Text>
            {description && (
              <Text size="xs" c="dimmed">
                {description}
              </Text>
            )}
          </Box>
        )}

        {showSearch && (
          <TextInput
            placeholder="Buscar colunas..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            size="sm"
          />
        )}

        {showSelectAll && (
          <Group gap="xs">
            <Button
              variant="subtle"
              size="xs"
              onClick={handleSelectAll}
              disabled={allSelected}
            >
              Selecionar todos
            </Button>
            <Button
              variant="subtle"
              size="xs"
              onClick={handleDeselectAll}
              disabled={noneSelected}
            >
              Desmarcar todos
            </Button>
          </Group>
        )}

        <ScrollArea.Autosize mah={maxHeight}>
          <Stack gap={4}>
            {filteredColumns.map((col, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === filteredColumns.length - 1;
              const isSearching = search.trim().length > 0;

              return (
                <Group
                  key={col.field}
                  gap="xs"
                  wrap="nowrap"
                  p={4}
                  style={{
                    borderRadius: 'var(--mantine-radius-sm)',
                    cursor: 'default',
                  }}
                >
                  <IconGripVertical
                    size={16}
                    style={{ color: 'var(--mantine-color-dimmed)', flexShrink: 0 }}
                  />

                  <Checkbox
                    checked={col.visible}
                    onChange={() => handleToggle(col.field)}
                    label={col.label}
                    size="sm"
                    style={{ flex: 1 }}
                  />

                  {!isSearching && (
                    <Group gap={2} wrap="nowrap" style={{ flexShrink: 0 }}>
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        disabled={isFirst}
                        onClick={() => handleMoveUp(col.field)}
                        aria-label={`Mover ${col.label} para cima`}
                      >
                        <IconArrowUp size={14} />
                      </ActionIcon>
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        disabled={isLast}
                        onClick={() => handleMoveDown(col.field)}
                        aria-label={`Mover ${col.label} para baixo`}
                      >
                        <IconArrowDown size={14} />
                      </ActionIcon>
                    </Group>
                  )}
                </Group>
              );
            })}

            {filteredColumns.length === 0 && (
              <Text size="sm" c="dimmed" ta="center" py="md">
                Nenhuma coluna encontrada
              </Text>
            )}
          </Stack>
        </ScrollArea.Autosize>
      </Stack>
    </Paper>
  );
}

ArchbaseColumnSelector.displayName = 'ArchbaseColumnSelector';
