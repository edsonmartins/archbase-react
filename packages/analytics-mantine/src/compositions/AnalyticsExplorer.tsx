import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Accordion,
  Box,
  Divider,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Stack,
  useComputedColorScheme,
} from '@mantine/core';
import {
  migrateSavedQuery,
  readDeepLink,
  serializeExploration,
  useAnalyticsContext,
  useExploration,
  useMemberValues,
  writeDeepLink,
  type AnalyticsMember,
  type ExplorationState,
  type ResultColumn,
  type ResultRow,
  type SavedQueryRecord,
} from '@archbase/analytics-core';
import { MemberPalette } from '../components/MemberPalette';
import { QueryCanvas } from '../components/QueryCanvas';
import { FilterBuilder } from '../components/FilterBuilder';
import { TimeDimensionControl } from '../components/TimeDimensionControl';
import { ResultTable } from '../components/ResultTable';
import { ResultChart } from '../components/ResultChart';
import { SavedQueryBar } from '../components/SavedQueryBar';
import { ExportButton } from '../components/ExportButton';
import {
  DegradedNotice,
  EmptyState,
  ErrorState,
  LoadingState,
  NoResultsState,
  TruncatedNotice,
} from '../components/States';

export interface AnalyticsExplorerProps {
  /**
   * Sincronizacao de deep link. Omitido, o explorador nao toca na URL: o
   * roteamento pertence ao produto consumidor, e a biblioteca so le e escreve
   * os parametros configurados quando o host pede.
   */
  deepLink?: {
    search: string;
    onChange: (search: string) => void;
  };
  /** Identidade do autor, gravada na consulta salva. */
  ownerId?: string;
  height?: number;
  onDrill?: (row: Record<string, unknown>, member: string) => void;
}

export function AnalyticsExplorer({
  deepLink,
  ownerId = '',
  height,
  onDrill,
}: AnalyticsExplorerProps) {
  const { config, ports, labeler, strings } = useAnalyticsContext();
  const exploration = useExploration({ origin: 'explorer' });
  const { suggest } = useMemberValues();
  const colorScheme = useComputedColorScheme('dark');

  const {
    state,
    dispatch,
    meta,
    metaLoading,
    result,
    loading,
    error,
    runnable,
    canCompare,
    viz,
    availableViz,
    reconciliation,
  } = exploration;

  // Filtros de valor ativos (operador `equals`), por membro — para o menu de
  // filtro por valor na paleta marcar o icone e pre-selecionar os checkboxes.
  const activeValueFilters = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const f of state.query.filters ?? []) {
      if (f.operator === 'equals' && (f.values?.length ?? 0) > 0) map.set(f.member, f.values ?? []);
    }
    return map;
  }, [state.query.filters]);

  // Aplica/atualiza/remove o filtro `equals` de um membro a partir do menu.
  const filtrarPorValor = useCallback(
    (member: string, values: string[] | null) => {
      const filtros = state.query.filters ?? [];
      const idx = filtros.findIndex((f) => f.member === member && f.operator === 'equals');
      if (values === null) {
        if (idx >= 0) dispatch({ type: 'removeFilter', index: idx });
        return;
      }
      const filter = { member, operator: 'equals' as const, values };
      if (idx >= 0) dispatch({ type: 'updateFilter', index: idx, filter });
      else dispatch({ type: 'addFilter', filter });
    },
    [state.query.filters, dispatch],
  );

  const abrirRegistro = useCallback(
    (record: SavedQueryRecord) => {
      const migrada = migrateSavedQuery(record);
      const proximo: ExplorationState = {
        query: migrada.query,
        viz: migrada.viz,
        vizAuto: false,
        savedQueryId: record.id,
      };
      dispatch({ type: 'replace', state: proximo });

      ports.telemetry?.({
        type: 'saved_query_opened',
        members: [
          ...(migrada.query.measures ?? []),
          ...(migrada.query.dimensions ?? []),
        ],
        origin: 'explorer',
        durationMs: 0,
        savedQueryId: record.id,
      });
    },
    [dispatch, ports],
  );

  const abrirPorId = useCallback(
    async (id: string) => {
      const record = await ports.savedQueryStore.get(id);
      if (record) abrirRegistro(record);
    },
    [ports, abrirRegistro],
  );

  // Restauracao do deep link acontece uma vez. Reaplicar a cada mudanca de URL
  // desfaria o que o usuario acabou de alterar.
  const restaurado = useRef(false);
  useEffect(() => {
    if (restaurado.current || !deepLink || !meta) return;
    restaurado.current = true;

    const { state: restaurada, savedQueryId } = readDeepLink(
      deepLink.search,
      config.deepLinkParams,
    );

    if (restaurada) {
      dispatch({
        type: 'replace',
        state: { ...restaurada, savedQueryId: savedQueryId ?? undefined },
      });
      return;
    }

    if (savedQueryId) void abrirPorId(savedQueryId);
  }, [deepLink, meta, config.deepLinkParams, dispatch, abrirPorId]);

  // Escrita do deep link a cada mudanca de estado: copiar a URL precisa
  // entregar exatamente a exploracao em tela.
  const serializado = useMemo(() => serializeExploration(state), [state]);
  useEffect(() => {
    if (!deepLink || !restaurado.current) return;
    deepLink.onChange(writeDeepLink(deepLink.search, config.deepLinkParams, state));
    // O estado serializado e a identidade estrutural da exploracao; depender do
    // objeto `state` reescreveria a URL a cada render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serializado, state.savedQueryId]);

  const salvar = useCallback(
    async (name: string) => {
      const gravada = await ports.savedQueryStore.save({
        id: state.savedQueryId,
        schemaVersion: 1,
        query: state.query,
        viz: { ...state.viz, type: viz },
        meta: { name, ownerId, scope: 'private' },
      });
      dispatch({ type: 'replace', state: { ...state, savedQueryId: gravada.id } });
    },
    [ports, state, viz, ownerId, dispatch],
  );

  const alternarMembro = useCallback(
    (member: AnalyticsMember) => {
      if (member.kind === 'measure') dispatch({ type: 'toggleMeasure', member: member.name });
      else if (member.kind === 'timeDimension')
        dispatch({ type: 'setTimeDimension', dimension: member.name });
      else dispatch({ type: 'toggleDimension', member: member.name });
    },
    [dispatch],
  );

  if (!meta) return <LoadingState strings={strings} />;

  const selecionados = [
    ...(state.query.measures ?? []),
    ...(state.query.dimensions ?? []),
    ...(state.query.timeDimensions ?? []).map((item) => item.dimension),
  ];

  const tabela = (altura: number) => {
    if (!result) return null;
    const drill = onDrill ? (row: ResultRow, column: ResultColumn) => onDrill(row, column.member) : undefined;
    // Altura da area de conteudo medida pelo ResultChart; fallback antes da 1a medicao.
    const alturaCorpo = altura > 0 ? Math.floor(altura) : (height ?? 420);
    // Port injetado (ex.: VTable) tem precedencia; sem ele, a tabela Mantine
    // embutida e o default. A biblioteca base nao depende de nenhuma grade rica.
    if (ports.tableRenderer) {
      return ports.tableRenderer.render({
        result,
        meta,
        formatter: ports.formatter,
        labeler,
        locale: config.locale,
        height: alturaCorpo,
        colorScheme,
        onDrill: drill,
      });
    }
    return (
      <ResultTable
        result={result}
        meta={meta}
        formatter={ports.formatter}
        labeler={labeler}
        locale={config.locale}
        height={alturaCorpo}
        onDrill={drill}
      />
    );
  };

  const corpo = () => {
    if (!runnable) return <EmptyState strings={strings} />;
    if (loading && !result) return <LoadingState strings={strings} />;
    if (error) return <ErrorState error={error} strings={strings} />;
    if (result && result.rows.length === 0) return <NoResultsState strings={strings} />;

    return (
      <ResultChart
        result={result ?? { columns: [], rows: [], periods: [], rowsByPeriod: [], deltas: [], truncated: false, query: state.query }}
        viz={viz}
        availableViz={availableViz}
        onChangeViz={(proximo) => dispatch({ type: 'setViz', viz: proximo })}
        formatter={ports.formatter}
        locale={config.locale}
        chartRenderer={ports.chartRenderer}
        renderTable={tabela}
      />
    );
  };

  return (
    <Grid gap="md" style={{ height: height ?? '100%', minHeight: 0 }} styles={{ inner: { height: '100%' } }}>
      <Grid.Col span={{ base: 12, sm: 3 }} style={{ height: '100%' }}>
        <Paper
          withBorder
          p="xs"
          h="100%"
          style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}
        >
          {metaLoading && !meta ? (
            <LoadingState strings={strings} />
          ) : (
            <ScrollArea type="hover" style={{ flex: 1, minHeight: 0 }}>
              <MemberPalette
                meta={meta}
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
            </ScrollArea>
          )}
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 12, sm: 9 }} style={{ height: '100%' }}>
        <Stack gap="sm" style={{ height: '100%', minHeight: 0 }}>
          <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm">
            <Box style={{ flex: 1, minWidth: 0 }}>
              <SavedQueryBar
                store={ports.savedQueryStore}
                currentId={state.savedQueryId}
                onOpen={abrirRegistro}
                onSave={salvar}
                canSave={runnable}
                labels={{ save: strings.save }}
              />
            </Box>
            <ExportButton
              result={result}
              meta={meta}
              formatter={ports.formatter}
              labeler={labeler}
              locale={config.locale}
            />
          </Group>

          <Accordion defaultValue="consulta" variant="contained">
            <Accordion.Item value="consulta">
              <Accordion.Control>{strings.queryPanel}</Accordion.Control>
              <Accordion.Panel>
                <Stack gap="sm">
              <QueryCanvas
                query={state.query}
                meta={meta}
                labeler={labeler}
                locale={config.locale}
                onRemoveMeasure={(member) => dispatch({ type: 'toggleMeasure', member })}
                onRemoveDimension={(member) => dispatch({ type: 'toggleDimension', member })}
                onRemoveTimeDimension={() =>
                  dispatch({ type: 'setTimeDimension', dimension: null })
                }
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
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>

          {reconciliation && (
            <DegradedNotice reconciliation={reconciliation} strings={strings} />
          )}
          {result?.truncated && <TruncatedNotice strings={strings} />}

          <Box style={{ flex: 1, minHeight: 0 }}>{corpo()}</Box>
        </Stack>
      </Grid.Col>
    </Grid>
  );
}
