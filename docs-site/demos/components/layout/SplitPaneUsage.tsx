import React from 'react';
import { ArchbaseSplitPane, ArchbaseSplitPanePane, ArchbaseSplitPaneResizer } from '@archbase/layout';
import { Text, Card, Stack } from '@mantine/core';

export function SplitPaneUsage() {
  return (
    <div style={{ height: 400, border: '1px solid #e9ecef', borderRadius: 8 }}>
      <ArchbaseSplitPane>
        <ArchbaseSplitPanePane>
          <Card h="100%" radius={0} withBorder p="md">
            <Stack>
              <Text fw={500}>Painel Lateral</Text>
              <Text size="sm" c="dimmed">
                Arraste a barra divisória para redimensionar
              </Text>
            </Stack>
          </Card>
        </ArchbaseSplitPanePane>
        <ArchbaseSplitPaneResizer />
        <ArchbaseSplitPanePane>
          <Card h="100%" radius={0} p="md">
            <Stack>
              <Text fw={500}>Área Principal</Text>
              <Text size="sm" c="dimmed">
                Conteúdo principal do aplicativo
              </Text>
            </Stack>
          </Card>
        </ArchbaseSplitPanePane>
      </ArchbaseSplitPane>
    </div>
  );
}
