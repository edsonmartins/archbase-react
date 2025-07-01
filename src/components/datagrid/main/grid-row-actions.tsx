import React from 'react';
import { ActionIcon, Box, Group, Tooltip } from '@mantine/core';
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import { t } from 'i18next';
import { useArchbaseTheme } from '../../../components/hooks';

export interface ArchbaseGridRowActionsProps<T extends Object> {
  onEditRow?: (row: T) => void;
  onRemoveRow?: (row: T) => void;
  onViewRow?: (row: T) => void;
  row: T;
  variant?: string;
  // Propriedades adicionadas para compatibilidade com ArchbaseDataTable
  table?: any;
  cell?: any;
}

export function ArchbaseGridRowActions<T extends Object>({
  onEditRow,
  onRemoveRow,
  onViewRow,
  row,
  variant = 'filled',
  table,
  cell
}: ArchbaseGridRowActionsProps<T>) {
  const theme = useArchbaseTheme();

  return (
    <Group gap="2" justify='center' align='center'>
      {onViewRow ? (
        <Tooltip withinPortal withArrow position="top" label={t('View')}>
          <ActionIcon
            variant={variant === 'filled' ? 'transparent' : variant}
            color="gray"
            onClick={() => onViewRow && onViewRow(row)}
            size="md"
          >
            <IconEye color={theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.dark[4]} size={22} />
          </ActionIcon>
        </Tooltip>
      ) : null}

      {onEditRow ? (
        <Tooltip withinPortal withArrow position="top" label={t('Edit')}>
          <ActionIcon
            variant={variant === 'filled' ? 'transparent' : variant}
            color="blue"
            onClick={() => onEditRow && onEditRow(row)}
            size="md"
          >
            <IconEdit color={theme.colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[4]} size={22} />
          </ActionIcon>
        </Tooltip>
      ) : null}

      {onRemoveRow ? (
        <Tooltip withinPortal withArrow position="top" label={t('Remove')}>
          <ActionIcon
            variant={variant === 'filled' ? 'transparent' : variant}
            color="red"
            onClick={() => onRemoveRow && onRemoveRow(row)}
            size="md"
          >
            <IconTrash color={theme.colorScheme === 'dark' ? theme.colors.red[8] : theme.colors.red[4]} size={22} />
          </ActionIcon>
        </Tooltip>
      ) : null}
    </Group>
  );
}

// Adaptador para usar com o formato de parâmetros do ArchbaseDataTable
export function createDataTableRowActions<T extends Object>(
  onEditRow?: (row: T) => void,
  onRemoveRow?: (row: T) => void,
  onViewRow?: (row: T) => void,
  variant?: string
) {
  return ({ row, table }: { row: any; table: any }) => (
    <ArchbaseGridRowActions
      onEditRow={onEditRow}
      onRemoveRow={onRemoveRow}
      onViewRow={onViewRow}
      row={row.original}
      variant={variant}
      table={table}
    />
  );
}

export default ArchbaseGridRowActions;
