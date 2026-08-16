import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  Box,
  Button,
  Divider,
  Group,
  Stack,
  Switch,
  Text,
  useComputedColorScheme,
} from '@mantine/core';
import {
  useAnalyticsContext,
  useExploration,
  useMemberValues,
  type AnalyticsMember,
  type ResultColumn,
  type ResultRow,
} from '@archbase/analytics-core'
import {
  EmptyState,
  ErrorState,
  FilterBuilder,
  LoadingState,
  MemberPalette,
  NoResultsState,
  QueryCanvas,
  ResultChart,
  SavedQueryBar,
  TimeDimensionControl,
} from '@archbase/analytics-mantine'
import {
  DockviewReact,
  themeDark,
  themeLight,
  type DockviewApi,
  type DockviewReadyEvent,
  type IDockviewPanelProps,
} from 'dockview-react'
import 'dockview-react/dist/styles/dockview.css'

const LAYOUT_KEY = 'analytics-workspace-layout'

// ─── Contexto: os paineis do dockview consomem o mesmo estado de exploracao ──

interface WorkspaceValue {
  ctx: ReturnType<typeof useAnalyticsContext>
  exploration: ReturnType<typeof useExploration>
  suggest: (member: string) => Promise<string[]>
  selecionados: string[]
  activeValueFilters: Map<string, string[]>
  alternarMembro: (member: AnalyticsMember) => void
  filtrarPorValor: (member: string, values: string[] | null) => void
  salvar: (name: string) => Promise<void>
  corpo: () => ReactNode
}

const WorkspaceContext = createContext<WorkspaceValue | null>(null)
const useWorkspace = () => {
  const v = useContext(WorkspaceContext)
  if (!v) throw new Error('Painel fora do AnalyticsWorkspace')
  return v
}

// ─── Paineis ─────────────────────────────────────────────────────────────────

function PainelMetricas(_props: IDockviewPanelProps) {
  const { ctx, exploration, suggest, selecionados, activeValueFilters, alternarMembro, filtrarPorValor } =
    useWorkspace()
  const { labeler, ports, config, strings } = ctx
  if (!exploration.meta) return <LoadingState strings={strings} />
  return (
    <Box p="xs" style={{ height: '100%', overflow: 'hidden' }}>
      <MemberPalette
        meta={exploration.meta}
        selected={selecionados}
        onToggle={alternarMembro}
        labeler={labeler}
        formatter={ports.formatter}
        locale={config.locale}
        searchPlaceholder={strings.searchMembers}
        onSuggestValues={suggest}
        onFilterValues={filtrarPorValor}
        activeValueFilters={activeValueFilters}
      />
    </Box>
  )
}

function PainelConsulta(_props: IDockviewPanelProps) {
  const { ctx, exploration, suggest, salvar } = useWorkspace()
  const { labeler, ports, config, strings } = ctx
  const { state, dispatch, meta, canCompare, runnable } = exploration
  if (!meta) return <LoadingState strings={strings} />
  return (
    <Box p="xs" style={{ height: '100%', overflow: 'auto' }}>
      <Stack gap="sm">
        <SavedQueryBar
          store={ports.savedQueryStore}
          currentId={state.savedQueryId}
          onSave={salvar}
          canSave={runnable}
          labels={{ save: strings.save }}
        />
        <QueryCanvas
          query={state.query}
          meta={meta}
          labeler={labeler}
          locale={config.locale}
          onRemoveMeasure={(member) => dispatch({ type: 'toggleMeasure', member })}
          onRemoveDimension={(member) => dispatch({ type: 'toggleDimension', member })}
          onRemoveTimeDimension={() => dispatch({ type: 'setTimeDimension', dimension: null })}
          labels={{ empty: strings.emptyExploration }}
        />
        <Divider />
        <TimeDimensionControl
          timeDimension={state.query.timeDimensions?.[0]}
          meta={meta}
          labeler={labeler}
          locale={config.locale}
          canCompare={canCompare}
          onChange={(dimension, granularity, dateRange) =>
            dispatch({ type: 'setTimeDimension', dimension, granularity, dateRange })
          }
          onChangeCompare={(ranges) => dispatch({ type: 'setCompareDateRanges', ranges })}
          labels={{ addCompare: strings.addComparison }}
        />
        <FilterBuilder
          filters={state.query.filters ?? []}
          meta={meta}
          labeler={labeler}
          locale={config.locale}
          onAdd={(filter) => dispatch({ type: 'addFilter', filter })}
          onUpdate={(index, filter) => dispatch({ type: 'updateFilter', index, filter })}
          onRemove={(index) => dispatch({ type: 'removeFilter', index })}
          onSuggestValues={suggest}
        />
      </Stack>
    </Box>
  )
}

function PainelResultado(_props: IDockviewPanelProps) {
  const { corpo } = useWorkspace()
  return (
    <Box p="xs" style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Box style={{ flex: 1, minHeight: 0 }}>{corpo()}</Box>
    </Box>
  )
}

const components = {
  metricas: PainelMetricas,
  consulta: PainelConsulta,
  resultado: PainelResultado,
}

/** Arranjo default: Metricas a esquerda, Consulta e Resultado empilhados a direita. */
function adicionarPaineisPadrao(api: DockviewApi) {
  api.addPanel({ id: 'metricas', component: 'metricas', title: 'Métricas' })
  api.addPanel({
    id: 'consulta',
    component: 'consulta',
    title: 'Consulta',
    position: { referencePanel: 'metricas', direction: 'right' },
  })
  api.addPanel({
    id: 'resultado',
    component: 'resultado',
    title: 'Resultado',
    position: { referencePanel: 'consulta', direction: 'below' },
  })
}

// ─── Workspace ───────────────────────────────────────────────────────────────

/**
 * Explorador em workspace dockavel (dockview): Metricas, Consulta e Resultado
 * como paineis que o usuario arrasta, redimensiona (sashes), flutua e esconde.
 * O layout persiste no localStorage; a mesma fiacao de exploracao alimenta os
 * tres paineis via contexto.
 */
export function AnalyticsWorkspace() {
  const ctx = useAnalyticsContext()
  const exploration = useExploration({ origin: 'explorer' })
  const { suggest } = useMemberValues()
  const colorScheme = useComputedColorScheme('dark')
  const apiRef = useRef<DockviewApi | null>(null)
  const [bordas, setBordas] = useState(true)
  const { labeler, ports, config, strings } = ctx

  const resetarLayout = useCallback(() => {
    localStorage.removeItem(LAYOUT_KEY)
    const api = apiRef.current
    if (!api) return
    api.clear()
    adicionarPaineisPadrao(api)
  }, [])
  const { state, dispatch, meta, result, loading, error, runnable, viz, availableViz } = exploration

  const selecionados = [
    ...(state.query.measures ?? []),
    ...(state.query.dimensions ?? []),
    ...(state.query.timeDimensions ?? []).map((item) => item.dimension),
  ]

  const activeValueFilters = useMemo(() => {
    const map = new Map<string, string[]>()
    for (const f of state.query.filters ?? []) {
      if (f.operator === 'equals' && (f.values?.length ?? 0) > 0) map.set(f.member, f.values ?? [])
    }
    return map
  }, [state.query.filters])

  const alternarMembro = useCallback(
    (member: AnalyticsMember) => {
      if (member.kind === 'measure') dispatch({ type: 'toggleMeasure', member: member.name })
      else if (member.kind === 'timeDimension')
        dispatch({ type: 'setTimeDimension', dimension: member.name })
      else dispatch({ type: 'toggleDimension', member: member.name })
    },
    [dispatch],
  )

  const filtrarPorValor = useCallback(
    (member: string, values: string[] | null) => {
      const filtros = state.query.filters ?? []
      const idx = filtros.findIndex((f) => f.member === member && f.operator === 'equals')
      if (values === null) {
        if (idx >= 0) dispatch({ type: 'removeFilter', index: idx })
        return
      }
      const filter = { member, operator: 'equals' as const, values }
      if (idx >= 0) dispatch({ type: 'updateFilter', index: idx, filter })
      else dispatch({ type: 'addFilter', filter })
    },
    [state.query.filters, dispatch],
  )

  const salvar = useCallback(
    async (name: string) => {
      const gravada = await ports.savedQueryStore.save({
        id: state.savedQueryId,
        schemaVersion: 1,
        query: state.query,
        viz: { ...state.viz, type: viz },
        meta: { name, ownerId: '', scope: 'private' },
      })
      dispatch({ type: 'replace', state: { ...state, savedQueryId: gravada.id } })
    },
    [ports, state, viz, dispatch],
  )

  const tabela = useCallback(
    (altura: number) => {
      if (!result || !meta) return null
      const alturaCorpo = altura > 0 ? Math.floor(altura) : 420
      if (ports.tableRenderer) {
        return ports.tableRenderer.render({
          result,
          meta,
          formatter: ports.formatter,
          labeler,
          locale: config.locale,
          height: alturaCorpo,
        })
      }
      return null
    },
    [result, meta, ports, labeler, config.locale],
  )

  const corpo = useCallback(() => {
    if (!runnable) return <EmptyState strings={strings} />
    if (loading && !result) return <LoadingState strings={strings} />
    if (error) return <ErrorState error={error} strings={strings} />
    if (result && result.rows.length === 0) return <NoResultsState strings={strings} />
    return (
      <ResultChart
        result={
          result ?? { columns: [], rows: [], periods: [], rowsByPeriod: [], deltas: [], truncated: false, query: state.query }
        }
        viz={viz}
        availableViz={availableViz}
        onChangeViz={(proximo) => dispatch({ type: 'setViz', viz: proximo })}
        formatter={ports.formatter}
        locale={config.locale}
        chartRenderer={ports.chartRenderer}
        renderTable={tabela}
      />
    )
  }, [runnable, loading, result, error, strings, viz, availableViz, ports, config.locale, tabela, dispatch, state.query])

  const value = useMemo<WorkspaceValue>(
    () => ({ ctx, exploration, suggest, selecionados, activeValueFilters, alternarMembro, filtrarPorValor, salvar, corpo }),
    [ctx, exploration, suggest, selecionados, activeValueFilters, alternarMembro, filtrarPorValor, salvar, corpo],
  )

  const onReady = (event: DockviewReadyEvent) => {
    apiRef.current = event.api
    const salvo = localStorage.getItem(LAYOUT_KEY)
    let restaurou = false
    if (salvo) {
      try {
        event.api.fromJSON(JSON.parse(salvo))
        restaurou = true
      } catch {
        restaurou = false
      }
    }
    if (!restaurou) adicionarPaineisPadrao(event.api)
    event.api.onDidLayoutChange(() => {
      try {
        localStorage.setItem(LAYOUT_KEY, JSON.stringify(event.api.toJSON()))
      } catch {
        /* quota/serializacao — ignora */
      }
    })
  }

  if (!meta) return <Text p="md">Carregando modelo…</Text>

  return (
    <WorkspaceContext.Provider value={value}>
      <Stack gap={6} style={{ height: '100%', minHeight: 0 }}>
        <Group gap="md">
          <Button size="compact-xs" variant="default" onClick={resetarLayout}>
            Resetar layout
          </Button>
          <Switch
            size="xs"
            label="Bordas"
            checked={bordas}
            onChange={(e) => setBordas(e.currentTarget.checked)}
          />
        </Group>
        <div
          style={{
            flex: 1,
            minHeight: 0,
            width: '100%',
            border: bordas ? '1px solid var(--mantine-color-default-border)' : undefined,
            borderRadius: bordas ? 6 : undefined,
            overflow: 'hidden',
          }}
        >
          <DockviewReact
            components={components}
            onReady={onReady}
            theme={colorScheme === 'dark' ? themeDark : themeLight}
          />
        </div>
      </Stack>
    </WorkspaceContext.Provider>
  )
}
