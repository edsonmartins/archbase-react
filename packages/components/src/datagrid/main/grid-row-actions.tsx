import React from 'react';
import { ActionIcon, Box, Group, Tooltip, useMantineColorScheme } from '@mantine/core';
import { IconEdit, IconTrash, IconEye } from '@tabler/icons-react';
import { useArchbaseTranslation, archbaseActionProps } from '@archbase/core';
import { useArchbaseTheme } from '@archbase/core';

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

/**
 * As três ações de linha carregam a capacidade padrão que as governa.
 *
 * <p>Ver, editar e excluir são as mesmas capacidades em toda tela — `view`, `edit` e `delete`, as
 * que o {@code useArchbaseCrudSecurity} registra no catálogo. Marcá-las aqui faz o realce do
 * inspetor de capacidades acender em qualquer grade, sem que nenhuma tela precise mudar; marcar à
 * mão em cada uma seria o mesmo trabalho repetido dezenas de vezes, e esquecido em algumas.
 *
 * <p>A marcação é <b>inerte</b>: não protege nada e não altera o comportamento. Quem decide se o
 * botão aparece continua sendo quem passa (ou não) o `onEditRow` correspondente.
 */
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
  const { colorScheme } = useMantineColorScheme();
  const { t } = useArchbaseTranslation();
  
  // Função utilitária para garantir que t() retorne string
  const tString = (key: string) => String(t(key));

  return (
    <Group gap="2" justify='center' align='center'>
      {onViewRow ? (
        <Tooltip withinPortal withArrow position="top" label={tString('View')}>
          <ActionIcon
            variant={variant === 'filled' ? 'transparent' : variant}
            color="gray"
            onClick={() => onViewRow && onViewRow(row)}
            size="md"
            {...archbaseActionProps('view')}
          >
            <IconEye color={colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.dark[4]} size={22} />
          </ActionIcon>
        </Tooltip>
      ) : null}

      {onEditRow ? (
        <Tooltip withinPortal withArrow position="top" label={tString('Edit')}>
          <ActionIcon
            variant={variant === 'filled' ? 'transparent' : variant}
            color="blue"
            onClick={() => onEditRow && onEditRow(row)}
            size="md"
            {...archbaseActionProps('edit')}
          >
            <IconEdit color={colorScheme === 'dark' ? theme.colors.blue[8] : theme.colors.blue[4]} size={22} />
          </ActionIcon>
        </Tooltip>
      ) : null}

      {onRemoveRow ? (
        <Tooltip withinPortal withArrow position="top" label={tString('Remove')}>
          <ActionIcon
            variant={variant === 'filled' ? 'transparent' : variant}
            color="red"
            onClick={() => onRemoveRow && onRemoveRow(row)}
            size="md"
            {...archbaseActionProps('delete')}
          >
            <IconTrash color={colorScheme === 'dark' ? theme.colors.red[8] : theme.colors.red[4]} size={22} />
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
