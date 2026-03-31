import React, { useState } from 'react';
import { Stack, Text } from '@mantine/core';
import { ArchbaseNotificationCenter } from '@archbase/components';
import type { ArchbaseNotificationItem } from '@archbase/components';

const sampleNotifications: ArchbaseNotificationItem[] = [
  {
    id: '1',
    title: 'Novo pedido recebido',
    message: 'O pedido #1234 foi criado com sucesso e aguarda processamento.',
    type: 'info',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 min atras
  },
  {
    id: '2',
    title: 'Backup concluido',
    message: 'O backup diario do banco de dados foi concluido com sucesso.',
    type: 'success',
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 min atras
  },
  {
    id: '3',
    title: 'Espaco em disco baixo',
    message: 'O servidor principal esta com menos de 10% de espaco em disco disponivel.',
    type: 'warning',
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atras
  },
];

export function ArchbaseNotificationCenterUsage() {
  const [notifications, setNotifications] = useState(sampleNotifications);

  return (
    <Stack gap="md" p="md">
      <Text size="sm" c="dimmed">
        Clique no sino para ver as notificacoes:
      </Text>
      <ArchbaseNotificationCenter
        notifications={notifications}
        onMarkAsRead={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
          );
        }}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onRemove={(id) => {
          setNotifications((prev) => prev.filter((n) => n.id !== id));
        }}
        onClearAll={() => setNotifications([])}
        renderAs="popover"
        showBadge
        title="Notificacoes"
      />
    </Stack>
  );
}
