import React from 'react';
import { ArchbaseSplitPane, ArchbaseSplitPanePane, ArchbaseSplitPaneResizer } from '@archbase/layout';
import { Text, Card, Stack } from '@mantine/core';

export function SplitPaneSizes() {
  return (
    <div style={{ height: 400, border: '1px solid #e9ecef', borderRadius: 8 }}>
      <ArchbaseSplitPane>
        <ArchbaseSplitPanePane defaultSize="20%" minSize={150} maxSize={400}>
          <Card h="100%" radius={0} withBorder p="md">
            <Stack gap="xs">
              <Text fw={500} size="sm">Navegação</Text>
              <Text size="xs" c="dimmed">20% inicial</Text>
            </Stack>
          </Card>
        </ArchbaseSplitPanePane>
        <ArchbaseSplitPaneResizer />
        <ArchbaseSplitPanePane defaultSize="50%" minSize={300} maxSize={600}>
          <Card h="100%" radius={0} withBorder p="md">
            <Stack gap="xs">
              <Text fw={500} size="sm">Conteúdo</Text>
              <Text size="xs" c="dimmed">50% inicial</Text>
            </Stack>
          </Card>
        </ArchbaseSplitPanePane>
        <ArchbaseSplitPaneResizer />
        <ArchbaseSplitPanePane defaultSize="30%" minSize={150} maxSize={400}>
          <Card h="100%" radius={0} p="md">
            <Stack gap="xs">
              <Text fw={500} size="sm">Detalhes</Text>
              <Text size="xs" c="dimmed">30% inicial</Text>
            </Stack>
          </Card>
        </ArchbaseSplitPanePane>
      </ArchbaseSplitPane>
    </div>
  );
}
