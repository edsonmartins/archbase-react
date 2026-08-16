import { useMemo, useState } from 'react'
import {
  ActionIcon,
  Badge,
  Box,
  Group,
  SegmentedControl,
  Stack,
  Text,
  useMantineColorScheme,
} from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'
import {
  AnalyticsProvider,
  createInMemorySavedQueryStore,
  createPtBrFormatter,
  type AnalyticsPorts,
} from '@archbase/analytics-core'
import { AnalyticsExplorer } from '@archbase/analytics-mantine'
import { createMantineChartRenderer } from '@archbase/analytics-mantine/charts'
import { createVTableRenderer } from '@archbase/analytics-vtable'
import { AnalyticsWorkspace } from '@archbase/analytics-dockview'
import { mockFetch } from './mockModel'

/**
 * Bancada do explorador de analytics — dados 100% mock (ver mockModel.ts).
 * É aqui que iteramos os componentes (VTable, charts, workspace) sem Cube,
 * backend ou token. Editar a lib em packages/analytics-* recarrega na hora.
 */
export function App() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const [layout, setLayout] = useState<'workspace' | 'explorer'>('workspace')

  const ports = useMemo<AnalyticsPorts>(
    () => ({
      tokenProvider: async () => 'Bearer mock',
      savedQueryStore: createInMemorySavedQueryStore(),
      formatter: createPtBrFormatter(),
      chartRenderer: createMantineChartRenderer(),
      tableRenderer: createVTableRenderer(),
      telemetry: (evento) => console.debug('[analytics]', evento),
    }),
    [],
  )

  return (
    <Stack gap="sm" p="md" style={{ height: '100vh' }}>
      <Group justify="space-between">
        <Text fw={600} size="lg">
          Explorador — Bancada (dados mock)
        </Text>
        <Group gap="xs">
          <SegmentedControl
            size="xs"
            value={layout}
            onChange={(v) => setLayout(v as 'workspace' | 'explorer')}
            data={[
              { label: 'Workspace', value: 'workspace' },
              { label: 'Explorer', value: 'explorer' },
            ]}
          />
          <ActionIcon variant="default" onClick={toggleColorScheme} aria-label="Alternar tema">
            {colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoon size={16} />}
          </ActionIcon>
          <Badge color="grape" variant="light">
            @archbase/analytics · playground
          </Badge>
        </Group>
      </Group>
      <Box style={{ flex: 1, minHeight: 0 }}>
        <AnalyticsProvider baseUrl="/api/analytics" ports={ports} locale="pt-BR" fetchImpl={mockFetch}>
          {layout === 'workspace' ? <AnalyticsWorkspace /> : <AnalyticsExplorer ownerId="demo" />}
        </AnalyticsProvider>
      </Box>
    </Stack>
  )
}
