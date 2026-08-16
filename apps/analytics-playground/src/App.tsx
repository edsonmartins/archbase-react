import { useMemo } from 'react'
import { Badge, Box, Group, Stack, Text } from '@mantine/core'
import {
  AnalyticsProvider,
  createInMemorySavedQueryStore,
  createPtBrFormatter,
  type AnalyticsPorts,
} from '@archbase/analytics-core'
import { AnalyticsExplorer } from '@archbase/analytics-mantine'
import { createMantineChartRenderer } from '@archbase/analytics-mantine/charts'
import { createVTableRenderer } from '@archbase/analytics-vtable'
import { mockFetch } from './mockModel'

/**
 * Bancada do explorador de analytics — dados 100% mock (ver mockModel.ts).
 * É aqui que iteramos os componentes (tabela/VTable, charts) sem Cube, backend
 * ou token. Editar a lib em packages/analytics-* recarrega na hora (alias→src).
 */
export function App() {
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
        <Badge color="grape" variant="light">
          @archbase/analytics · playground
        </Badge>
      </Group>
      <Box style={{ flex: 1, minHeight: 0 }}>
        <AnalyticsProvider baseUrl="/api/analytics" ports={ports} locale="pt-BR" fetchImpl={mockFetch}>
          <AnalyticsExplorer ownerId="demo" />
        </AnalyticsProvider>
      </Box>
    </Stack>
  )
}
