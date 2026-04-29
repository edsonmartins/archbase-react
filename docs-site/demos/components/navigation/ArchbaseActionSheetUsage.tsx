import React, { useState } from 'react';
import { Stack, Button, Text, Group } from '@mantine/core';
import { IconShare, IconDownload, IconBookmark, IconTrash, IconEdit } from '@tabler/icons-react';
import { ArchbaseActionSheet } from '@archbase/components';

export function ArchbaseActionSheetUsage() {
  const [opened, setOpened] = useState(false);
  const [openedDestructive, setOpenedDestructive] = useState(false);

  const handleAction = (action: string) => {
    console.log('Action:', action);
    setOpened(false);
    setOpenedDestructive(false);
  };

  return (
    <Stack gap="md" p="md">
      <Text size="sm" c="dimmed">
        ActionSheet é ideal para mobile. Em desktop, aparece como menu dropdown.
      </Text>

      <Group>
        <Button onClick={() => setOpened(true)}>Abrir ActionSheet</Button>
        <Button color="red" onClick={() => setOpenedDestructive(true)}>
          Com ação destrutiva
        </Button>
      </Group>

      <ArchbaseActionSheet
        opened={opened}
        onClose={() => setOpened(false)}
        title="Compartilhar"
        description="Escolha como deseja compartilhar este item"
        actions={[
          {
            label: 'Compartilhar',
            icon: <IconShare size={20} />,
            onClick: () => handleAction('share'),
          },
          {
            label: 'Download',
            icon: <IconDownload size={20} />,
            onClick: () => handleAction('download'),
          },
          {
            label: 'Salvar nos favoritos',
            icon: <IconBookmark size={20} />,
            onClick: () => handleAction('bookmark'),
          },
        ]}
      />

      <ArchbaseActionSheet
        opened={openedDestructive}
        onClose={() => setOpenedDestructive(false)}
        title="Editar item"
        actions={[
          {
            label: 'Editar',
            icon: <IconEdit size={20} />,
            onClick: () => handleAction('edit'),
          },
          {
            label: 'Excluir permanentemente',
            icon: <IconTrash size={20} />,
            color: 'red',
            onClick: () => handleAction('delete'),
          },
        ]}
        showCancel
        cancelLabel="Cancelar"
      />
    </Stack>
  );
}
