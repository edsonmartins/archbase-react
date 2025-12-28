import React from 'react';
import { CloseButton, Group, Text, Badge } from '@mantine/core';
import type { FilterPillProps } from '../ArchbaseCompositeFilters.types';

/**
 * Componente que exibe um filtro ativo como uma pill removível
 */
export function FilterPill({
  filter,
  onRemove,
  onOperatorClick,
  onValueClick,
  isHighlighted = false,
  compact = false,
  styles,
}: FilterPillProps) {
  const operatorDisplay = getOperatorDisplay(filter.operator);

  return (
    <Badge
      leftSection={filter.icon}
      rightSection={
        <CloseButton
          size="xs"
          onMouseDown={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          style={{ marginLeft: 4 }}
        />
      }
      styles={{
        root: {
          display: 'inline-flex',
          alignItems: 'center',
          padding: compact ? '2px 8px' : '4px 12px',
          fontSize: compact ? 12 : 14,
          ...(isHighlighted && {
            boxShadow: '0 0 0 2px var(--mantine-color-blue-filled)',
          }),
          ...styles,
        },
        label: {
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        },
      }}
      variant="light"
      color="blue"
    >
      <Group gap={4} wrap="nowrap">
        <Text span fw={500}>{filter.label}</Text>
        <Text
          span
          c="dimmed"
          style={{ cursor: onOperatorClick ? 'pointer' : 'default' }}
          onClick={onOperatorClick}
        >
          {operatorDisplay}
        </Text>
        <Text
          span
          c="blue"
          style={{ cursor: onValueClick ? 'pointer' : 'default' }}
          onClick={onValueClick}
        >
          {filter.displayValue}
        </Text>
      </Group>
    </Badge>
  );
}

/**
 * Retorna a exibição do operador em formato legível
 */
function getOperatorDisplay(operator: string): string {
  const displayMap: Record<string, string> = {
    'contains': 'contains',
    'starts_with': 'starts with',
    'ends_with': 'ends with',
    '=': '=',
    '!=': '≠',
    '>': '>',
    '<': '<',
    '>=': '≥',
    '<=': '≤',
    'is_null': 'is null',
    'is_not_null': 'is not null',
    'between': 'between',
    'date_before': 'before',
    'date_after': 'after',
    'date_between': 'between',
    'in': 'in',
    'not_in': 'not in',
  };

  return displayMap[operator] || operator;
}
