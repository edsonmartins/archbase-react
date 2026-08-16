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
  ActionIcon,
  Box,
  Button,
  Divider,
  Group,
  Menu,
  SegmentedControl,
  Select,
  Stack,
  Switch,
  Text,
  useComputedColorScheme,
} from '@mantine/core';
import { useElementSize } from '@mantine/hooks'
import { DatePickerInput } from '@mantine/dates'
import { IconDownload, IconRefresh } from '@tabler/icons-react'
import {
  resultToCsv,
  useAnalyticsContext,
  useExploration,
  useMemberValues,
  type AnalyticsMember,
  type ResultColumn,
  type ResultRow,
  type VizType,
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
  /** Renderiza uma viz fixa (widget de dashboard) do mesmo resultado. */
  renderWidget: (viz: VizType, height: number) => ReactNode
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

const VIZ_OPCOES: { value: VizType; label: string }[] = [
  { value: 'number', label: 'Indicador' },
  { value: 'table', label: 'Tabela' },
  { value: 'bar', label: 'Barras' },
  { value: 'line', label: 'Linhas' },
  { value: 'area', label: 'Área' },
  { value: 'pie', label: 'Pizza' },
]

function PainelResultado(props: IDockviewPanelProps) {
  const { corpo, renderWidget } = useWorkspace()
  const viz = (props.params as { viz?: VizType } | undefined)?.viz
  const { ref, height } = useElementSize()
  // Troca a viz do widget e persiste nos params do painel (entra no toJSON).
  const trocarViz = (v: string | null) => {
    if (v) props.api.updateParameters({ ...props.params, viz: v })
  }
  return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      {viz && (
        <Group justify="flex-end" px={6} pt={6} style={{ flex: '0 0 auto' }}>
          <Select
            size="xs"
            w={120}
            data={VIZ_OPCOES}
            value={viz}
            onChange={trocarViz}
            allowDeselect={false}
          />
        </Group>
      )}
      <Box ref={ref} style={{ flex: 1, minHeight: 0, padding: 8 }}>
        {viz ? renderWidget(viz, height) : corpo()}
      </Box>
    </Box>
  )
}

const components = {
  metricas: PainelMetricas,
  consulta: PainelConsulta,
  resultado: PainelResultado,
}

type Preset = 'padrao' | 'lateral' | 'dashboard'

const PRESETS: { value: Preset; label: string }[] = [
  { value: 'padrao', label: 'Padrão (métricas | consulta/resultado)' },
  { value: 'lateral', label: 'Lateral (métricas+consulta | resultado)' },
  { value: 'dashboard', label: 'Dashboard (KPIs + gráfico + tabela)' },
]

/** Padrao: Metricas a esquerda; Consulta e Resultado empilhados a direita. */
function layoutPadrao(api: DockviewApi) {
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

/** Lateral: Metricas e Consulta empilhados a esquerda; Resultado a direita. */
function layoutLateral(api: DockviewApi) {
  api.addPanel({ id: 'metricas', component: 'metricas', title: 'Métricas' })
  api.addPanel({
    id: 'resultado',
    component: 'resultado',
    title: 'Resultado',
    position: { referencePanel: 'metricas', direction: 'right' },
  })
  api.addPanel({
    id: 'consulta',
    component: 'consulta',
    title: 'Consulta',
    position: { referencePanel: 'metricas', direction: 'below' },
  })
}

/** Dashboard: Metricas+Consulta a esquerda; KPIs, Grafico e Tabela como widgets
 *  do mesmo resultado a direita (cada painel com uma viz fixa via params). */
function layoutDashboard(api: DockviewApi) {
  api.addPanel({ id: 'metricas', component: 'metricas', title: 'Métricas' })
  api.addPanel({
    id: 'consulta',
    component: 'consulta',
    title: 'Consulta',
    position: { referencePanel: 'metricas', direction: 'below' },
  })
  api.addPanel({
    id: 'kpis',
    component: 'resultado',
    title: 'KPIs',
    params: { viz: 'number' },
    position: { referencePanel: 'metricas', direction: 'right' },
  })
  api.addPanel({
    id: 'grafico',
    component: 'resultado',
    title: 'Gráfico',
    params: { viz: 'bar' },
    position: { referencePanel: 'kpis', direction: 'below' },
  })
  api.addPanel({
    id: 'tabela',
    component: 'resultado',
    title: 'Tabela',
    params: { viz: 'table' },
    position: { referencePanel: 'grafico', direction: 'right' },
  })
}

function aplicarPreset(api: DockviewApi, preset: Preset) {
  api.clear()
  if (preset === 'lateral') layoutLateral(api)
  else if (preset === 'dashboard') layoutDashboard(api)
  else layoutPadrao(api)
}

// ─── Periodo (filtro de tempo) ───────────────────────────────────────────────

type Periodo = 'tudo' | 'ano' | '90' | '30' | '7' | 'mes' | 'custom'

const PERIODOS: { value: Periodo; label: string }[] = [
  { value: 'tudo', label: 'Tudo' },
  { value: 'ano', label: 'Ano' },
  { value: '90', label: '90 dias' },
  { value: '30', label: '30 dias' },
  { value: '7', label: '7 dias' },
  { value: 'mes', label: 'Mês' },
  { value: 'custom', label: 'Personalizado' },
]

function fmtData(d: Date): string {
  return d.toISOString().slice(0, 10)
}

// DatePickerInput devolve Date ou string ISO conforme a versao do Mantine.
type CustomData = string | Date | null
function normData(v: CustomData): string | null {
  if (v == null) return null
  return typeof v === 'string' ? v.slice(0, 10) : fmtData(v)
}

/** Intervalo [inicio, fim] do preset relativo a hoje; null p/ "Tudo"/"Personalizado". */
function rangeDoPeriodo(p: Periodo): [string, string] | null {
  if (p === 'tudo' || p === 'custom') return null
  const hoje = new Date()
  const inicio = new Date(hoje)
  if (p === '7') inicio.setDate(hoje.getDate() - 7)
  else if (p === '30') inicio.setDate(hoje.getDate() - 30)
  else if (p === '90') inicio.setDate(hoje.getDate() - 90)
  else if (p === 'mes') inicio.setDate(1)
  else if (p === 'ano') inicio.setMonth(0, 1)
  return [fmtData(inicio), fmtData(hoje)]
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
  const [preset, setPreset] = useState<Preset>('padrao')
  const { labeler, ports, config, strings } = ctx

  const aplicar = useCallback((p: Preset) => {
    setPreset(p)
    if (apiRef.current) aplicarPreset(apiRef.current, p)
  }, [])

  const resetarLayout = useCallback(() => {
    localStorage.removeItem(LAYOUT_KEY)
    if (apiRef.current) aplicarPreset(apiRef.current, preset)
  }, [preset])
  const { state, dispatch, meta, result, loading, error, runnable, viz, availableViz } = exploration

  // Barra de periodo: aplica o intervalo ao 1o timeDimension como FILTRO
  // (dateRange sem granularidade), preservando a granularidade se o usuario
  // ja estiver agrupando por tempo. "Tudo" limpa o intervalo.
  const [periodo, setPeriodo] = useState<Periodo>('tudo')
  const [custom, setCustom] = useState<[CustomData, CustomData]>([null, null])
  const timeDimMember = meta?.timeDimensions?.[0]?.name

  const aplicarRange = useCallback(
    (range: [string, string] | null) => {
      if (!timeDimMember) return
      const gran = state.query.timeDimensions?.[0]?.granularity
      if (range === null) {
        dispatch({
          type: 'setTimeDimension',
          dimension: gran ? timeDimMember : null,
          granularity: gran,
          dateRange: undefined,
        })
      } else {
        dispatch({ type: 'setTimeDimension', dimension: timeDimMember, granularity: gran, dateRange: range })
      }
    },
    [timeDimMember, state.query.timeDimensions, dispatch],
  )

  const trocarPeriodo = useCallback(
    (p: Periodo) => {
      setPeriodo(p)
      if (p !== 'custom') aplicarRange(rangeDoPeriodo(p))
    },
    [aplicarRange],
  )

  const trocarCustom = useCallback(
    (val: [CustomData, CustomData]) => {
      setCustom(val)
      const a = normData(val[0])
      const b = normData(val[1])
      if (a && b) aplicarRange([a, b])
    },
    [aplicarRange],
  )

  // Exporta o resultado atual em CSV (formatado ou valores crus) e dispara o
  // download com BOM UTF-8 para o Excel respeitar acentos.
  const exportarCsv = useCallback(
    (raw: boolean) => {
      if (!result || !meta) return
      const csv = resultToCsv(result, {
        formatter: ports.formatter,
        labeler,
        meta,
        locale: config.locale,
        raw,
      })
      const agora = new Date()
      const z = (n: number) => String(n).padStart(2, '0')
      const stamp = `${agora.getFullYear()}${z(agora.getMonth() + 1)}${z(agora.getDate())}-${z(agora.getHours())}${z(agora.getMinutes())}`
      const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-${stamp}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    },
    [result, meta, ports, labeler, config.locale],
  )

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
          colorScheme,
        })
      }
      return null
    },
    [result, meta, ports, labeler, config.locale, colorScheme],
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

  const renderWidget = useCallback(
    (vizAlvo: VizType, altura: number) => {
      if (!runnable) return <EmptyState strings={strings} />
      if (loading && !result) return <LoadingState strings={strings} />
      if (error) return <ErrorState error={error} strings={strings} />
      if (result && result.rows.length === 0) return <NoResultsState strings={strings} />
      if (!result) return null
      if (vizAlvo === 'table') return tabela(altura)
      if (ports.chartRenderer) {
        return ports.chartRenderer.render({
          viz: vizAlvo,
          result,
          formatter: ports.formatter,
          locale: config.locale,
        })
      }
      return null
    },
    [runnable, loading, error, result, strings, tabela, ports, config.locale],
  )

  const value = useMemo<WorkspaceValue>(
    () => ({
      ctx,
      exploration,
      suggest,
      selecionados,
      activeValueFilters,
      alternarMembro,
      filtrarPorValor,
      salvar,
      corpo,
      renderWidget,
    }),
    [
      ctx,
      exploration,
      suggest,
      selecionados,
      activeValueFilters,
      alternarMembro,
      filtrarPorValor,
      salvar,
      corpo,
      renderWidget,
    ],
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
    if (!restaurou) aplicarPreset(event.api, 'padrao')
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
          <Select
            size="xs"
            w={300}
            value={preset}
            onChange={(v) => v && aplicar(v as Preset)}
            data={PRESETS}
            allowDeselect={false}
            aria-label="Layout"
          />
          <Button size="compact-xs" variant="default" onClick={resetarLayout}>
            Resetar layout
          </Button>
          <Switch
            size="xs"
            label="Bordas"
            checked={bordas}
            onChange={(e) => setBordas(e.currentTarget.checked)}
          />
          <Menu shadow="md" position="bottom-start" disabled={!result}>
            <Menu.Target>
              <Button
                size="compact-xs"
                variant="default"
                leftSection={<IconDownload size={14} />}
                disabled={!result}
              >
                Exportar
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>CSV</Menu.Label>
              <Menu.Item onClick={() => exportarCsv(false)}>Formatado (como na tela)</Menu.Item>
              <Menu.Item onClick={() => exportarCsv(true)}>Valores crus (planilha)</Menu.Item>
            </Menu.Dropdown>
          </Menu>
          {timeDimMember && (
            <>
              <Divider orientation="vertical" />
              <Text size="xs" c="dimmed" fw={600}>
                Período
              </Text>
              <SegmentedControl
                size="xs"
                value={periodo}
                onChange={(v) => trocarPeriodo(v as Periodo)}
                data={PERIODOS}
              />
              {periodo === 'custom' && (
                <DatePickerInput
                  size="xs"
                  type="range"
                  value={custom as unknown as [string | null, string | null]}
                  onChange={(v) => trocarCustom(v as unknown as [CustomData, CustomData])}
                  placeholder="Intervalo"
                  valueFormat="DD/MM/YYYY"
                  w={220}
                  clearable
                />
              )}
              <ActionIcon
                size="md"
                variant="default"
                onClick={() => aplicarRange(rangeDoPeriodo(periodo))}
                aria-label="Atualizar"
                title="Atualizar"
              >
                <IconRefresh size={15} />
              </ActionIcon>
            </>
          )}
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
