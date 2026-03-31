import React from 'react';
import { Box, Paper, Text } from '@mantine/core';
import { ArchbaseMosaicLayout } from '@archbase/layout';

export function ArchbaseMosaicLayoutUsage() {
  const panels = {
    a: {
      id: 'a',
      title: 'Painel A',
      component: (
        <Paper p="md" h="100%" bg="blue.1">
          <Text fw={600}>Conteúdo A</Text>
          <Text size="sm" c="dimmed">Painel principal do mosaic</Text>
        </Paper>
      ),
      closable: true,
    },
    b: {
      id: 'b',
      title: 'Painel B',
      component: (
        <Paper p="md" h="100%" bg="green.1">
          <Text fw={600}>Conteúdo B</Text>
          <Text size="sm" c="dimmed">Painel superior direito</Text>
        </Paper>
      ),
      closable: true,
    },
    c: {
      id: 'c',
      title: 'Painel C',
      component: (
        <Paper p="md" h="100%" bg="orange.1">
          <Text fw={600}>Conteúdo C</Text>
          <Text size="sm" c="dimmed">Painel inferior direito</Text>
        </Paper>
      ),
      closable: true,
    },
  };

  return (
    <Box h={400}>
      <ArchbaseMosaicLayout
        panels={panels}
        initialLayout={{
          direction: 'row',
          first: 'a',
          second: {
            direction: 'column',
            first: 'b',
            second: 'c',
          },
        }}
        height="100%"
      />
    </Box>
  );
}
