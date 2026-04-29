import React, { forwardRef, useMemo } from 'react';
import { Box, Text, Stack, MantineColor, MantineSize } from '@mantine/core';

export interface ArchbaseArcGaugeSegment {
  /** Valor final do segmento (percentual 0-100) */
  value: number;
  /** Cor do segmento */
  color: MantineColor;
  /** Label opcional */
  label?: string;
}

export interface ArchbaseArcGaugeProps {
  /** Valor atual (0-100 ou dentro de min-max) */
  value: number;
  /** Valor mínimo */
  min?: number;
  /** Valor máximo */
  max?: number;
  /** Segmentos coloridos do gauge */
  segments?: ArchbaseArcGaugeSegment[];
  /** Cor padrão do arco */
  color?: MantineColor;
  /** Cor do fundo do arco */
  backgroundColor?: MantineColor;
  /** Cor do ponteiro */
  needleColor?: MantineColor;
  /** Ângulo de início (graus, 0 = direita) */
  startAngle?: number;
  /** Ângulo de fim (graus) */
  endAngle?: number;
  /** Tamanho do componente */
  size?: number;
  /** Espessura do arco */
  thickness?: number;
  /** Se deve mostrar o valor */
  showValue?: boolean;
  /** Formato do valor */
  valueFormat?: (value: number) => string;
  /** Sufixo do valor */
  valueSuffix?: string;
  /** Label inferior */
  label?: string;
  /** Tamanho do label */
  labelSize?: MantineSize;
  /** Se deve mostrar marcadores */
  showTicks?: boolean;
  /** Número de marcadores */
  tickCount?: number;
  /** Se deve mostrar labels nos marcadores */
  showTickLabels?: boolean;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseArcGauge = forwardRef<HTMLDivElement, ArchbaseArcGaugeProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      segments,
      color = 'blue',
      backgroundColor = 'gray.2',
      needleColor = 'dark',
      startAngle = 180,
      endAngle = 0,
      size = 200,
      thickness = 20,
      showValue = true,
      valueFormat,
      valueSuffix = '%',
      label,
      labelSize = 'sm',
      showTicks = false,
      tickCount = 5,
      showTickLabels = false,
      className,
      style,
    },
    ref
  ) => {
    // Normaliza o valor para percentual
    const normalizedValue = useMemo(() => {
      const clamped = Math.min(max, Math.max(min, value));
      return ((clamped - min) / (max - min)) * 100;
    }, [max, min, value]);

    // Calcula os parâmetros do arco
    const arcParams = useMemo(() => {
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = (size - thickness) / 2 - 10; // Margem para ticks
      const innerRadius = radius - thickness;

      // Converte graus para radianos
      const startRad = (startAngle * Math.PI) / 180;
      const endRad = (endAngle * Math.PI) / 180;
      const totalAngle = startRad - endRad;

      // Calcula o ângulo do ponteiro
      const needleAngle = startRad - (normalizedValue / 100) * totalAngle;

      return {
        centerX,
        centerY,
        radius,
        innerRadius,
        startRad,
        endRad,
        totalAngle,
        needleAngle,
      };
    }, [endAngle, normalizedValue, size, startAngle, thickness]);

    // Gera o path do arco
    const createArcPath = (start: number, end: number, radius: number) => {
      const { centerX, centerY } = arcParams;
      const x1 = centerX + radius * Math.cos(start);
      const y1 = centerY - radius * Math.sin(start);
      const x2 = centerX + radius * Math.cos(end);
      const y2 = centerY - radius * Math.sin(end);
      const largeArc = start - end > Math.PI ? 1 : 0;

      return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
    };

    // Gera os segmentos do arco
    const arcSegments = useMemo(() => {
      const { startRad, totalAngle, radius } = arcParams;

      if (!segments || segments.length === 0) {
        // Arco único com cor padrão
        const valueAngle = startRad - (normalizedValue / 100) * totalAngle;
        return [
          {
            path: createArcPath(startRad, valueAngle, radius),
            color: `var(--mantine-color-${color}-6)`,
          },
        ];
      }

      // Múltiplos segmentos
      const result: Array<{ path: string; color: string }> = [];
      let prevAngle = startRad;

      segments.forEach((segment, index) => {
        const segmentAngle = startRad - (Math.min(segment.value, normalizedValue) / 100) * totalAngle;
        const prevValue = index === 0 ? 0 : segments[index - 1].value;

        if (normalizedValue > prevValue) {
          const fromAngle = startRad - (prevValue / 100) * totalAngle;
          const toAngle = startRad - (Math.min(segment.value, normalizedValue) / 100) * totalAngle;

          if (fromAngle !== toAngle) {
            result.push({
              path: createArcPath(fromAngle, toAngle, radius),
              color: `var(--mantine-color-${segment.color}-6)`,
            });
          }
        }

        prevAngle = segmentAngle;
      });

      return result;
    }, [arcParams, color, normalizedValue, segments]);

    // Gera o path do background
    const backgroundPath = useMemo(() => {
      const { startRad, endRad, radius } = arcParams;
      return createArcPath(startRad, endRad, radius);
    }, [arcParams]);

    // Gera os ticks
    const ticks = useMemo(() => {
      if (!showTicks) return [];

      const { centerX, centerY, radius, startRad, totalAngle } = arcParams;
      const result: Array<{
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        labelX: number;
        labelY: number;
        value: number;
      }> = [];

      for (let i = 0; i <= tickCount; i++) {
        const tickValue = min + (i / tickCount) * (max - min);
        const angle = startRad - (i / tickCount) * totalAngle;
        const tickLength = 8;

        const x1 = centerX + radius * Math.cos(angle);
        const y1 = centerY - radius * Math.sin(angle);
        const x2 = centerX + (radius + tickLength) * Math.cos(angle);
        const y2 = centerY - (radius + tickLength) * Math.sin(angle);
        const labelX = centerX + (radius + tickLength + 10) * Math.cos(angle);
        const labelY = centerY - (radius + tickLength + 10) * Math.sin(angle);

        result.push({ x1, y1, x2, y2, labelX, labelY, value: tickValue });
      }

      return result;
    }, [arcParams, max, min, showTicks, tickCount]);

    // Gera o path do ponteiro
    const needlePath = useMemo(() => {
      const { centerX, centerY, radius, needleAngle } = arcParams;
      const needleLength = radius - 5;
      const needleWidth = 4;

      // Ponta do ponteiro
      const tipX = centerX + needleLength * Math.cos(needleAngle);
      const tipY = centerY - needleLength * Math.sin(needleAngle);

      // Base do ponteiro (duas pontas)
      const baseAngle1 = needleAngle + Math.PI / 2;
      const baseAngle2 = needleAngle - Math.PI / 2;
      const base1X = centerX + needleWidth * Math.cos(baseAngle1);
      const base1Y = centerY - needleWidth * Math.sin(baseAngle1);
      const base2X = centerX + needleWidth * Math.cos(baseAngle2);
      const base2Y = centerY - needleWidth * Math.sin(baseAngle2);

      return `M ${tipX} ${tipY} L ${base1X} ${base1Y} L ${base2X} ${base2Y} Z`;
    }, [arcParams]);

    // Formata o valor para exibição
    const displayValue = useMemo(() => {
      if (valueFormat) {
        return valueFormat(value);
      }
      return `${Math.round(value)}${valueSuffix}`;
    }, [value, valueFormat, valueSuffix]);

    return (
      <Stack ref={ref} gap={4} align="center" className={className} style={style}>
        <svg width={size} height={size / 2 + 30} viewBox={`0 0 ${size} ${size / 2 + 30}`}>
          {/* Background arc */}
          <path
            d={backgroundPath}
            fill="none"
            stroke={`var(--mantine-color-${backgroundColor})`}
            strokeWidth={thickness}
            strokeLinecap="round"
          />

          {/* Value arc(s) */}
          {arcSegments.map((segment, index) => (
            <path
              key={index}
              d={segment.path}
              fill="none"
              stroke={segment.color}
              strokeWidth={thickness}
              strokeLinecap="round"
            />
          ))}

          {/* Ticks */}
          {ticks.map((tick, index) => (
            <g key={index}>
              <line
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
                stroke="var(--mantine-color-gray-5)"
                strokeWidth={2}
              />
              {showTickLabels && (
                <text
                  x={tick.labelX}
                  y={tick.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={10}
                  fill="var(--mantine-color-gray-6)"
                >
                  {Math.round(tick.value)}
                </text>
              )}
            </g>
          ))}

          {/* Needle */}
          <path d={needlePath} fill={`var(--mantine-color-${needleColor}-7)`} />

          {/* Center circle */}
          <circle
            cx={arcParams.centerX}
            cy={arcParams.centerY}
            r={8}
            fill={`var(--mantine-color-${needleColor}-7)`}
          />

          {/* Value text */}
          {showValue && (
            <text
              x={arcParams.centerX}
              y={arcParams.centerY + 35}
              textAnchor="middle"
              fontSize={size / 8}
              fontWeight={600}
              fill="var(--mantine-color-dark-7)"
            >
              {displayValue}
            </text>
          )}
        </svg>

        {label && (
          <Text size={labelSize} c="dimmed">
            {label}
          </Text>
        )}
      </Stack>
    );
  }
);

ArchbaseArcGauge.displayName = 'ArchbaseArcGauge';
