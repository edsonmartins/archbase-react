import { AreaChart, BarChart, LineChart, PieChart } from '@mantine/charts';
import { Center, Text } from '@mantine/core';
import type {
  ChartRenderProps,
  ChartRenderer,
  NormalizedResult,
  ResultColumn,
  ValueFormatter,
  VizType,
} from '@archbase/analytics-core';

const SUPORTADAS: readonly VizType[] = ['bar', 'line', 'area', 'pie'];

/**
 * Renderizador de referencia sobre `@mantine/charts`.
 *
 * Material de exemplo e de teste — a implementacao de producao pertence ao
 * produto consumidor. Vive em subpath proprio
 * (`@archbase/analytics-mantine/charts`) para que a biblioteca de grafico fique
 * fora do grafo de dependencias de quem usa apenas tabela.
 */
export function createMantineChartRenderer(): ChartRenderer {
  return {
    supports: (viz) => SUPORTADAS.includes(viz),
    render: (props) => <MantineChart {...props} />,
  };
}

function measureColumns(result: NormalizedResult): ResultColumn[] {
  return result.columns.filter((column) => column.kind === 'measure');
}

function categoryColumn(result: NormalizedResult): ResultColumn | undefined {
  return result.columns.find((column) => column.kind !== 'measure');
}

/** Formata o eixo pela porta: nenhuma conversao de unidade acontece aqui. */
function axisFormatter(
  formatter: ValueFormatter,
  column: ResultColumn | undefined,
  locale: string,
) {
  if (!column) return undefined;
  return (value: number) =>
    formatter.format(value, {
      format: column.format,
      precision: column.precision,
      memberName: column.member,
      locale,
    });
}

function MantineChart({ viz, result, formatter, locale }: ChartRenderProps) {
  const measures = measureColumns(result);
  const category = categoryColumn(result);

  if (measures.length === 0 || result.rows.length === 0) {
    return (
      <Center p="xl">
        <Text size="sm" c="dimmed">
          Sem dados para exibir.
        </Text>
      </Center>
    );
  }

  const dataKey = category?.member ?? measures[0]?.member ?? '';
  const series = measures.map((column, index) => ({
    name: column.member,
    label: column.title,
    color: PALETA[index % PALETA.length] ?? 'blue.6',
  }));

  const valueFormatter = axisFormatter(formatter, measures[0], locale);
  const data = result.rows as unknown as Array<Record<string, unknown>>;

  switch (viz) {
    case 'bar':
      return (
        <BarChart h={320} data={data} dataKey={dataKey} series={series} valueFormatter={valueFormatter} />
      );

    case 'line':
      return (
        <LineChart h={320} data={data} dataKey={dataKey} series={series} valueFormatter={valueFormatter} />
      );

    case 'area':
      return (
        <AreaChart h={320} data={data} dataKey={dataKey} series={series} valueFormatter={valueFormatter} />
      );

    case 'pie': {
      const measure = measures[0];
      if (!measure) return null;
      const fatias = result.rows.map((row, index) => ({
        name: String(row[dataKey] ?? ''),
        value: Number(row[measure.member] ?? 0),
        color: PALETA[index % PALETA.length] ?? 'blue.6',
      }));
      return <PieChart h={320} data={fatias} withTooltip valueFormatter={valueFormatter} />;
    }

    default:
      // `table` e `number` nao passam pelo renderizador; `supports` ja os
      // exclui, e chegar aqui indicaria chamada fora do contrato.
      return null;
  }
}

const PALETA = [
  'blue.6',
  'teal.6',
  'grape.6',
  'orange.6',
  'cyan.6',
  'lime.6',
  'pink.6',
  'indigo.6',
];
