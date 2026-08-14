import { useEffect, useState, type ReactNode } from 'react';
import { Group, Paper, Stack, Text } from '@mantine/core';
import {
  migrateSavedQuery,
  useAnalyticsContext,
  useExploration,
  type AnalyticsQuery,
  type ExplorationState,
  type VizType,
} from '@archbase/analytics-core';
import { ResultTable } from '../components/ResultTable';
import { ResultChart } from '../components/ResultChart';
import {
  DegradedNotice,
  EmptyState,
  ErrorState,
  LoadingState,
  NoResultsState,
  TruncatedNotice,
} from '../components/States';

export interface AnalyticsWidgetProps {
  /** Consulta salva a exibir. Alternativa a `query`. */
  savedQueryId?: string;
  /** Consulta direta, para painel montado em codigo. */
  query?: AnalyticsQuery;
  viz?: VizType;
  title?: string;
  height?: number;
  /** Cabecalho e moldura proprios. Falso para embutir em layout do host. */
  withFrame?: boolean;
}

/**
 * Superficie de leitura: exibe uma consulta sem oferecer composicao.
 *
 * Divide todo o nucleo com o explorador — mesma reconciliacao, mesma
 * degradacao, mesmo tratamento de limite. O que muda e a ausencia de controles
 * e a origem registrada na telemetria.
 */
export function AnalyticsWidget({
  savedQueryId,
  query,
  viz: vizForcada,
  title,
  height = 280,
  withFrame = true,
}: AnalyticsWidgetProps) {
  const { config, ports, labeler, strings } = useAnalyticsContext();
  const [inicial, setInicial] = useState<ExplorationState | undefined>(() =>
    query ? { query, viz: { type: vizForcada ?? 'table' }, vizAuto: vizForcada === undefined } : undefined,
  );
  const [carregandoRegistro, setCarregandoRegistro] = useState(savedQueryId !== undefined);

  useEffect(() => {
    if (!savedQueryId) return;
    let mounted = true;
    setCarregandoRegistro(true);

    ports.savedQueryStore
      .get(savedQueryId)
      .then((record) => {
        if (!mounted) return;
        if (record) {
          const migrada = migrateSavedQuery(record);
          setInicial({
            query: migrada.query,
            viz: migrada.viz,
            vizAuto: vizForcada === undefined,
            savedQueryId: record.id,
          });
        }
        setCarregandoRegistro(false);
      })
      .catch(() => {
        if (mounted) setCarregandoRegistro(false);
      });

    return () => {
      mounted = false;
    };
  }, [savedQueryId, ports, vizForcada]);

  return (
    <WidgetFrame title={title} withFrame={withFrame}>
      {carregandoRegistro || !inicial ? (
        carregandoRegistro ? (
          <LoadingState strings={strings} />
        ) : (
          <EmptyState strings={strings} />
        )
      ) : (
        <WidgetBody
          key={JSON.stringify(inicial.query)}
          inicial={inicial}
          vizForcada={vizForcada}
          height={height}
          locale={config.locale}
          ports={ports}
          labeler={labeler}
          strings={strings}
        />
      )}
    </WidgetFrame>
  );
}

function WidgetFrame({
  title,
  withFrame,
  children,
}: {
  title?: string;
  withFrame: boolean;
  children: ReactNode;
}) {
  const conteudo = (
    <Stack gap="xs">
      {title && (
        <Group>
          <Text size="sm" fw={600}>
            {title}
          </Text>
        </Group>
      )}
      {children}
    </Stack>
  );

  return withFrame ? (
    <Paper withBorder p="sm">
      {conteudo}
    </Paper>
  ) : (
    conteudo
  );
}

interface WidgetBodyProps {
  inicial: ExplorationState;
  vizForcada?: VizType;
  height: number;
  locale: string;
  ports: ReturnType<typeof useAnalyticsContext>['ports'];
  labeler: ReturnType<typeof useAnalyticsContext>['labeler'];
  strings: ReturnType<typeof useAnalyticsContext>['strings'];
}

function WidgetBody({
  inicial,
  vizForcada,
  height,
  locale,
  ports,
  labeler,
  strings,
}: WidgetBodyProps) {
  // `availableViz` nao entra aqui: o widget nao oferece troca de visualizacao.
  const { meta, result, loading, error, runnable, viz, reconciliation } = useExploration({
    initialState: inicial,
    origin: 'widget',
  });

  if (!meta || (loading && !result)) return <LoadingState strings={strings} />;
  if (!runnable) return <EmptyState strings={strings} />;
  if (error) return <ErrorState error={error} strings={strings} />;

  const efetiva = vizForcada ?? viz;

  const tabela = () =>
    result ? (
      <ResultTable
        result={result}
        meta={meta}
        formatter={ports.formatter}
        labeler={labeler}
        locale={locale}
        height={height}
      />
    ) : null;

  return (
    <Stack gap="xs">
      {reconciliation && <DegradedNotice reconciliation={reconciliation} strings={strings} />}
      {result?.truncated && <TruncatedNotice strings={strings} />}

      {result && result.rows.length === 0 ? (
        <NoResultsState strings={strings} />
      ) : (
        result && (
          <ResultChart
            result={result}
            viz={efetiva}
            // Widget nao oferece troca de visualizacao: e superficie de leitura.
            availableViz={[efetiva]}
            onChangeViz={() => {}}
            formatter={ports.formatter}
            locale={locale}
            chartRenderer={ports.chartRenderer}
            renderTable={tabela}
          />
        )
      )}
    </Stack>
  );
}
