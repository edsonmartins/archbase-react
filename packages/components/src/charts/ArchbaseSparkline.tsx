import React, { forwardRef, useMemo } from 'react';
import { Sparkline, SparklineProps } from '@mantine/charts';
import { Box, Text, Group, Stack, MantineSize, MantineColor } from '@mantine/core';
import { IconTrendingUp, IconTrendingDown, IconMinus } from '@tabler/icons-react';

export type SparklineTrendDirection = 'up' | 'down' | 'neutral';

export interface ArchbaseSparklineProps extends Omit<SparklineProps, 'data' | 'trendColors'> {
  /** Dados do sparkline (array de números) */
  data: number[];
  /** Cor do sparkline */
  color?: MantineColor;
  /** Cor de preenchimento (para área) */
  fillColor?: MantineColor;
  /** Opacidade do preenchimento */
  fillOpacity?: number;
  /** Tipo de curva */
  curveType?: 'linear' | 'natural' | 'monotone' | 'step' | 'stepBefore' | 'stepAfter';
  /** Largura da linha */
  strokeWidth?: number;
  /** Se deve mostrar o indicador de tendência */
  showTrend?: boolean;
  /** Se deve colorir automaticamente baseado na tendência */
  autoTrendColors?: boolean;
  /** Cor para tendência positiva */
  trendUpColor?: MantineColor;
  /** Cor para tendência negativa */
  trendDownColor?: MantineColor;
  /** Cor para tendência neutra */
  trendNeutralColor?: MantineColor;
  /** Se deve mostrar o valor atual */
  showValue?: boolean;
  /** Formato do valor */
  valueFormat?: (value: number) => string;
  /** Label opcional */
  label?: string;
  /** Tamanho do label */
  labelSize?: MantineSize;
  /** Altura do sparkline */
  height?: number;
  /** Largura do sparkline */
  width?: number | string;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseSparkline = forwardRef<HTMLDivElement, ArchbaseSparklineProps>(
  (
    {
      data,
      color = 'blue',
      fillColor,
      fillOpacity = 0.2,
      curveType = 'natural',
      strokeWidth = 2,
      showTrend = false,
      autoTrendColors = false,
      trendUpColor = 'green',
      trendDownColor = 'red',
      trendNeutralColor = 'gray',
      showValue = false,
      valueFormat,
      label,
      labelSize = 'sm',
      height = 40,
      width,
      className,
      style,
      ...rest
    },
    ref
  ) => {
    // Calcula a tendência
    const trend = useMemo((): SparklineTrendDirection => {
      if (data.length < 2) return 'neutral';
      const first = data[0];
      const last = data[data.length - 1];
      if (last > first) return 'up';
      if (last < first) return 'down';
      return 'neutral';
    }, [data]);

    // Calcula a variação percentual
    const changePercent = useMemo(() => {
      if (data.length < 2) return 0;
      const first = data[0];
      const last = data[data.length - 1];
      if (first === 0) return 0;
      return ((last - first) / Math.abs(first)) * 100;
    }, [data]);

    // Determina a cor baseada na tendência
    const effectiveColor = useMemo(() => {
      if (!autoTrendColors) return color;
      switch (trend) {
        case 'up':
          return trendUpColor;
        case 'down':
          return trendDownColor;
        default:
          return trendNeutralColor;
      }
    }, [color, trend, autoTrendColors, trendDownColor, trendNeutralColor, trendUpColor]);

    // Formata o valor
    const formattedValue = useMemo(() => {
      if (data.length === 0) return '-';
      const lastValue = data[data.length - 1];
      if (valueFormat) return valueFormat(lastValue);
      return lastValue.toLocaleString('pt-BR');
    }, [data, valueFormat]);

    // Ícone de tendência
    const TrendIcon = useMemo(() => {
      switch (trend) {
        case 'up':
          return IconTrendingUp;
        case 'down':
          return IconTrendingDown;
        default:
          return IconMinus;
      }
    }, [trend]);

    const trendColor = useMemo(() => {
      switch (trend) {
        case 'up':
          return `var(--mantine-color-${trendUpColor}-6)`;
        case 'down':
          return `var(--mantine-color-${trendDownColor}-6)`;
        default:
          return `var(--mantine-color-${trendNeutralColor}-6)`;
      }
    }, [trend, trendDownColor, trendNeutralColor, trendUpColor]);

    if (data.length === 0) {
      return (
        <Box ref={ref} className={className} style={{ ...style, width, height }}>
          <Text size="sm" c="dimmed">
            Sem dados
          </Text>
        </Box>
      );
    }

    return (
      <Stack ref={ref} gap={4} className={className} style={{ ...style, width }}>
        {label && (
          <Text size={labelSize} c="dimmed">
            {label}
          </Text>
        )}

        <Group gap="xs" align="flex-end">
          <Box style={{ flex: 1 }}>
            <Sparkline
              data={data}
              color={effectiveColor}
              fillOpacity={fillOpacity}
              curveType={curveType}
              strokeWidth={strokeWidth}
              h={height}
              {...rest}
            />
          </Box>

          {(showValue || showTrend) && (
            <Stack gap={0} align="flex-end">
              {showValue && (
                <Text size="sm" fw={600}>
                  {formattedValue}
                </Text>
              )}
              {showTrend && (
                <Group gap={2}>
                  <TrendIcon size={14} color={trendColor} />
                  <Text size="xs" c={trend === 'neutral' ? 'dimmed' : effectiveColor}>
                    {changePercent >= 0 ? '+' : ''}
                    {changePercent.toFixed(1)}%
                  </Text>
                </Group>
              )}
            </Stack>
          )}
        </Group>
      </Stack>
    );
  }
);

ArchbaseSparkline.displayName = 'ArchbaseSparkline';
