import React from 'react';
import { ArchbaseSplitPane, ArchbaseSplitPanePane, ArchbaseSplitPaneResizer } from '@archbase/layout';
import { Text, Card, Stack } from '@mantine/core';

export function SplitPaneVertical() {
  return (
    <div style={{ height: 400, border: '1px solid #e9ecef', borderRadius: 8 }}>
      <ArchbaseSplitPane direction="column">
        <ArchbaseSplitPanePane defaultSize="50%" minSize={150}>
          <Card h="100%" radius={0} withBorder p="md">
            <Stack>
              <Text fw={500}>Painel Superior</Text>
              <Text size="sm" c="dimmed">
                Área de visualização ou gráficos
              </Text>
            </Stack>
          </Card>
        </ArchbaseSplitPanePane>
        <ArchbaseSplitPaneResizer />
        <ArchbaseSplitPanePane defaultSize="50%" minSize={150}>
          <Card h="100%" radius={0} p="md">
            <Stack>
              <Text fw={500}>Painel Inferior</Text>
              <Text size="sm" c="dimmed">
                Tabela de dados ou logs
              </Text>
            </Stack>
          </Card>
        </ArchbaseSplitPanePane>
      </ArchbaseSplitPane>
    </div>
  );
}
