import React from 'react';
import { Stack, Card, Text } from '@mantine/core';
import { IconCopy, IconCut, IconClipboard, IconTrash, IconEdit } from '@tabler/icons-react';
import { ArchbaseContextMenu } from '@archbase/components';

export function ArchbaseContextMenuUsage() {
  const handleAction = (action: string) => {
    console.log('Action:', action);
  };

  return (
    <Stack gap="md" p="md">
      <Text size="sm" c="dimmed">Clique com botão direito nas áreas abaixo:</Text>

      <ArchbaseContextMenu
        items={[
          { key: 'copy', label: 'Copiar', icon: <IconCopy size={16} />, onClick: () => handleAction('copy') },
          { key: 'cut', label: 'Cortar', icon: <IconCut size={16} />, onClick: () => handleAction('cut') },
          { key: 'paste', label: 'Colar', icon: <IconClipboard size={16} />, onClick: () => handleAction('paste') },
          { key: 'divider1', type: 'divider' },
          { key: 'edit', label: 'Editar', icon: <IconEdit size={16} />, onClick: () => handleAction('edit') },
          { key: 'delete', label: 'Excluir', icon: <IconTrash size={16} />, color: 'red', onClick: () => handleAction('delete') },
        ]}
      >
        <Card withBorder p="xl" style={{ cursor: 'context-menu' }}>
          <Text>Menu de contexto básico</Text>
        </Card>
      </ArchbaseContextMenu>

      <ArchbaseContextMenu
        items={[
          {
            key: 'file',
            label: 'Arquivo',
            children: [
              { key: 'new', label: 'Novo', onClick: () => handleAction('new') },
              { key: 'open', label: 'Abrir', onClick: () => handleAction('open') },
              { key: 'save', label: 'Salvar', onClick: () => handleAction('save') },
            ],
          },
          {
            key: 'edit',
            label: 'Editar',
            children: [
              { key: 'undo', label: 'Desfazer', onClick: () => handleAction('undo') },
              { key: 'redo', label: 'Refazer', onClick: () => handleAction('redo') },
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
