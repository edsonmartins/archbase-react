import type { ReactNode } from 'react';
import { Box, Group, SegmentedControl, Stack } from '@mantine/core';
import { useElementSize } from '@mantine/hooks';
import {
  isVizAvailable,
  type ChartRenderer,
  type NormalizedResult,
  type ValueFormatter,
  type VizType,
} from '@archbase/analytics-core';

const ROTULO_VIZ: Record<VizType, string> = {
  table: 'Tabela',
  bar: 'Barras',
  line: 'Linhas',
  area: 'Area',
  pie: 'Pizza',
  number: 'Indicador',
};

export interface ResultChartProps {
  result: NormalizedResult;
  viz: VizType;
  availableViz: VizType[];
  onChangeViz: (viz: VizType) => void;
  formatter: ValueFormatter;
  locale: string;
  chartRenderer?: ChartRenderer;
  /**
   * Renderizacao da visualizacao `table`, delegada ao hospedeiro da composicao.
   * Recebe a altura medida da area de conteudo (abaixo do seletor), para que a
   * tabela virtualizada preencha o espaco exato e role internamente.
   */
  renderTable?: (height: number) => ReactNode;
}

/**
 * Superficie de visualizacao. A escolha inicial vem do metadado
 * `default_viz`; a partir da primeira troca manual, do usuario.
 *
 * O seletor oferece apenas o que o renderizador injetado declara suportar — sem
 * isso, uma visualizacao herdada do modelo poderia ser oferecida e falhar
 * somente no render.
 */
export function ResultChart({
  result,
  viz,
  availableViz,
  onChangeViz,
  formatter,
  locale,
  chartRenderer,
  renderTable,
}: ResultChartProps) {
  const { ref: conteudoRef, height: alturaConteudo } = useElementSize();
  const opcoes = availableViz.map((candidate) => ({
    value: candidate,
    label: ROTULO_VIZ[candidate],
  }));

  const conteudo = () => {
    if (viz === 'table') return renderTable?.(alturaConteudo) ?? null;
    if (!chartRenderer || !isVizAvailable(viz, chartRenderer)) return renderTable?.(alturaConteudo) ?? null;
    return chartRenderer.render({ viz, result, formatter, locale });
  };

  return (
    <Stack gap="xs" style={{ height: '100%', minHeight: 0 }}>
      {opcoes.length > 1 && (
        <Group justify="flex-end">
          <SegmentedControl
            size="xs"
            data={opcoes}
            value={viz}
            onChange={(value) => onChangeViz(value as VizType)}
          />
        </Group>
      )}
      <Box ref={conteudoRef} style={{ flex: 1, minHeight: 0 }}>
        {conteudo()}
      </Box>
    </Stack>
  );
}
