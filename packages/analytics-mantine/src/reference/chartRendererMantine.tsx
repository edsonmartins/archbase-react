import { AreaChart, BarChart, LineChart, PieChart } from '@mantine/charts';
import { Box, Center, Paper, SimpleGrid, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import type {
  ChartRenderProps,
  ChartRenderer,
  NormalizedResult,
  ResultColumn,
  ValueFormatter,
  VizType,
} from '@archbase/analytics-core';

const SUPORTADAS: readonly VizType[] = ['bar', 'line', 'area', 'pie', 'number'];

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

function contexto(column: ResultColumn, locale: string) {
  return { format: column.format, precision: column.precision, memberName: column.member, locale };
}

/** Formata o eixo pela porta: nenhuma conversao de unidade acontece aqui. */
function axisFormatter(
  formatter: ValueFormatter,
  column: ResultColumn | undefined,
  locale: string,
) {
  if (!column) return undefined;
  return (value: number) => formatter.format(value, contexto(column, locale));
}

/** Agrega uma medida sobre as linhas: media para nao-aditivas (razao `percent`
 *  ou `aggType` de media, ex.: ticket medio), soma para as aditivas. */
function agregar(result: NormalizedResult, column: ResultColumn): number {
  const valores = result.rows
    .map((row) => Number(row[column.member]))
    .filter((v) => Number.isFinite(v));
  if (valores.length === 0) return 0;
  const soma = valores.reduce((a, b) => a + b, 0);
  const aggType = column.aggType?.toLowerCase();
  const media = column.format === 'percent' || aggType === 'avg' || aggType === 'avgdistinct';
  return media ? soma / valores.length : soma;
}

/** Envolve o conteudo com padding e altura cheia — o grafico nao cola nas bordas. */
function moldura(node: ReactNode): ReactNode {
  return <Box p="md" style={{ height: '100%', minHeight: 0 }}>{node}</Box>;
}

function MantineChart({ viz, result, formatter, locale }: ChartRenderProps) {
  const measures = measureColumns(result);
  const category = categoryColumn(result);

  if (measures.length === 0 || result.rows.length === 0) {
    return (
      <Center p="xl" style={{ height: '100%' }}>
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
      return moldura(
        <BarChart h="100%" data={data} dataKey={dataKey} series={series} valueFormatter={valueFormatter} />,
      );

    case 'line':
      return moldura(
        <LineChart h="100%" data={data} dataKey={dataKey} series={series} valueFormatter={valueFormatter} />,
      );

    case 'area':
      return moldura(
        <AreaChart h="100%" data={data} dataKey={dataKey} series={series} valueFormatter={valueFormatter} />,
      );

    case 'pie': {
      const measure = measures[0];
      if (!measure) return null;
      // Agrega por valor da categoria: sem isso, uma consulta com 2 dimensoes
      // vira dezenas de fatias minusculas com nomes repetidos.
      const porCategoria = new Map<string, number>();
      for (const row of result.rows) {
        const nome = String(row[dataKey] ?? '');
        porCategoria.set(nome, (porCategoria.get(nome) ?? 0) + (Number(row[measure.member]) || 0));
      }
      const fatias = [...porCategoria.entries()].map(([name, value], index) => ({
        name,
        value,
        color: PALETA[index % PALETA.length] ?? 'blue.6',
      }));
      return moldura(
        <Center style={{ height: '100%' }}>
          <PieChart
            data={fatias}
            withTooltip
            withLabelsLine
            withLabels
            labelsType="percent"
            size={260}
            valueFormatter={valueFormatter}
          />
        </Center>,
      );
    }

    case 'number':
      // Indicador: um card de KPI por medida (total agregado, formatado).
      return moldura(
        <SimpleGrid
          cols={{ base: 1, xs: 2, sm: Math.min(Math.max(measures.length, 1), 4) }}
          spacing="md"
        >
          {measures.map((m) => (
            <Paper key={m.member} withBorder p="md" radius="md">
              <Text size="xs" c="dimmed" fw={600} tt="uppercase">
                {m.title}
              </Text>
              <Text fw={700} fz={28} mt={4}>
                {formatter.format(agregar(result, m), contexto(m, locale))}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>,
      );

    default:
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
