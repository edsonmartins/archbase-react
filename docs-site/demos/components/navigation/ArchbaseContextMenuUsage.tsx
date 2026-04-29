import React from 'react';
import { Stack, Card, Text, Box } from '@mantine/core';
import { IconCopy, IconCut, IconClipboard, IconTrash, IconEdit } from '@tabler/icons-react';
import { ArchbaseContextMenu, ArchbaseContextMenuTrigger } from '@archbase/components';

export function ArchbaseContextMenuUsage() {
  const handleAction = (action: string) => {
    console.log('Action:', action);
  };

  return (
    <Stack gap="md" p="md">
      <Text size="sm" c="dimmed">Clique com botão direito nas áreas abaixo:</Text>

      <ArchbaseContextMenu
        items={[
          { label: 'Copiar', icon: <IconCopy size={16} />, onClick: () => handleAction('copy') },
          { label: 'Cortar', icon: <IconCut size={16} />, onClick: () => handleAction('cut') },
          { label: 'Colar', icon: <IconClipboard size={16} />, onClick: () => handleAction('paste') },
          { type: 'divider' },
          { label: 'Editar', icon: <IconEdit size={16} />, onClick: () => handleAction('edit') },
          { label: 'Excluir', icon: <IconTrash size={16} />, color: 'red', onClick: () => handleAction('delete') },
        ]}
      >
        <Card withBorder p="xl" style={{ cursor: 'context-menu' }}>
          <Text>Menu de contexto básico</Text>
        </Card>
      </ArchbaseContextMenu>

      <ArchbaseContextMenu
        items={[
          {
            label: 'Arquivo',
            children: [
              { label: 'Novo', onClick: () => handleAction('new') },
              { label: 'Abrir', onClick: () => handleAction('open') },
              { label: 'Salvar', onClick: () => handleAction('save') },
            ],
          },
          {
            label: 'Editar',
            children: [
              { label: 'Desfazer', onClick: () => handleAction('undo') },
              { label: 'Refazer', onClick: () => handleAction('redo') },
            ],
          },
        ]}
      >
        <Card withBorder p="xl" style={{ cursor: 'context-menu' }}>
          <Text>Menu com submenus</Text>
        </Card>
      </ArchbaseContextMenu>
    </Stack>
  );
}
