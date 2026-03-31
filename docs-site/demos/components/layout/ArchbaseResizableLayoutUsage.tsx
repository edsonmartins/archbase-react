import React from 'react';
import { Box, Paper, Text } from '@mantine/core';
import { ArchbaseResizableLayout } from '@archbase/layout';

export function ArchbaseResizableLayoutUsage() {
  return (
    <Box h={300}>
      <ArchbaseResizableLayout
        direction="horizontal"
        panels={[
          {
            id: 'left',
            children: (
              <Paper p="md" h="100%" bg="blue.1">
                <Text fw={600}>Esquerda</Text>
                <Text size="sm" c="dimmed">Painel esquerdo (30%)</Text>
              </Paper>
            ),
            defaultSize: 30,
          },
          {
            id: 'center',
            children: (
              <Paper p="md" h="100%" bg="green.1">
                <Text fw={600}>Centro</Text>
                <Text size="sm" c="dimmed">Painel central (40%)</Text>
              </Paper>
            ),
            defaultSize: 40,
          },
          {
            id: 'right',
            children: (
              <Paper p="md" h="100%" bg="orange.1">
                <Text fw={600}>Direita</Text>
                <Text size="sm" c="dimmed">Painel direito (30%)</Text>
              </Paper>
            ),
            defaultSize: 30,
          },
        ]}
        height="100%"
      />
    </Box>
  );
}
