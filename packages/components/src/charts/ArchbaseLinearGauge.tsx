import React, { forwardRef, useMemo } from 'react';
import { Box, Text, Stack, MantineColor, MantineSize } from '@mantine/core';

export interface ArchbaseLinearGaugeZone {
  /** Valor inicial da zona */
  from: number;
  /** Valor final da zona */
  to: number;
  /** Cor da zona */
  color: MantineColor;
  /** Label opcional */
  label?: string;
}

export interface ArchbaseLinearGaugeProps {
  /** Valor atual */
  value: number;
  /** Valor mínimo */
  min?: number;
  /** Valor máximo */
  max?: number;
  /** Orientação */
  orientation?: 'horizontal' | 'vertical';
  /** Zonas coloridas */
  zones?: ArchbaseLinearGaugeZone[];
  /** Cor padrão da barra */
  color?: MantineColor;
  /** Cor do fundo */
  backgroundColor?: MantineColor;
  /** Cor do indicador */
  indicatorColor?: MantineColor;
  /** Largura (horizontal) ou altura (vertical) */
  size?: number;
  /** Espessura da barra */
  thickness?: number;
  /** Se deve mostrar o valor */
  showValue?: boolean;
  /** Formato do valor */
  valueFormat?: (value: number) => string;
  /** Sufixo do valor */
  valueSuffix?: string;
  /** Label */
  label?: string;
  /** Tamanho do label */
  labelSize?: MantineSize;
  /** Se deve mostrar ticks */
  showTicks?: boolean;
  /** Número de ticks */
  tickCount?: number;
  /** Se deve mostrar labels nos ticks */
  showTickLabels?: boolean;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseLinearGauge = forwardRef<HTMLDivElement, ArchbaseLinearGaugeProps>(
  (
    {
      value,
      min = 0,
      max = 100,
      orientation = 'horizontal',
      zones,
      color = 'blue',
      backgroundColor = 'gray.2',
      indicatorColor = 'dark',
      size = 200,
      thickness = 20,
      showValue = true,
      valueFormat,
      valueSuffix = '',
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
    const isHorizontal = orientation === 'horizontal';
    const svgWidth = isHorizontal ? size : thickness + 40;
    const svgHeight = isHorizontal ? thickness + 40 : size;

    // Normaliza o valor para percentual
    const normalizedValue = useMemo(() => {
      const clamped = Math.min(max, Math.max(min, value));
      return ((clamped - min) / (max - min)) * 100;
    }, [max, min, value]);

    // Posição do indicador
    const indicatorPosition = useMemo(() => {
      const barLength = size - 20; // Margem para o indicador
      return 10 + (normalizedValue / 100) * barLength;
    }, [normalizedValue, size]);

    // Gera as zonas da barra
    const barZones = useMemo(() => {
      const barLength = size - 20;
      const barStart = 10;

      if (!zones || zones.length === 0) {
        // Zona única
        const valueLength = (normalizedValue / 100) * barLength;
        return [
          {
            x: isHorizontal ? barStart : 20,
            y: isHorizontal ? 20 : barStart + barLength - valueLength,
            width: isHorizontal ? valueLength : thickness,
            height: isHorizontal ? thickness : valueLength,
            color: `var(--mantine-color-${color}-6)`,
          },
        ];
      }

      // Múltiplas zonas
      return zones.map((zone) => {
        const fromPercent = ((zone.from - min) / (max - min)) * 100;
        const toPercent = ((zone.to - min) / (max - min)) * 100;
        const clampedFrom = Math.max(0, Math.min(fromPercent, normalizedValue));
        const clampedTo = Math.max(0, Math.min(toPercent, normalizedValue));

        if (clampedFrom >= clampedTo) return null;

        const start = (clampedFrom / 100) * barLength;
        const length = ((clampedTo - clampedFrom) / 100) * barLength;

        return {
          x: isHorizontal ? barStart + start : 20,
          y: isHorizontal ? 20 : barStart + barLength - start - length,
          width: isHorizontal ? length : thickness,
          height: isHorizontal ? thickness : length,
          color: `var(--mantine-color-${zone.color}-6)`,
        };
      }).filter(Boolean);
    }, [color, isHorizontal, max, min, normalizedValue, size, thickness, zones]);

    // Gera os ticks
    const ticks = useMemo(() => {
      if (!showTicks) return [];

      const barLength = size - 20;
      const barStart = 10;
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
        const position = barStart + (i / tickCount) * barLength;
        const tickLength = 6;

        if (isHorizontal) {
          result.push({
            x1: position,
            y1: 20 + thickness,
            x2: position,
            y2: 20 + thickness + tickLength,
            labelX: position,
            labelY: 20 + thickness + tickLength + 12,
            value: tickValue,
          });
        } else {
          result.push({
            x1: 20 + thickness,
            y1: barStart + barLength - (i / tickCount) * barLength,
            x2: 20 + thickness + tickLength,
            y2: barStart + barLength - (i / tickCount) * barLength,
            labelX: 20 + thickness + tickLength + 15,
            labelY: barStart + barLength - (i / tickCount) * barLength,
            value: tickValue,
          });
        }
      }

      return result;
    }, [isHorizontal, max, min, showTicks, size, thickness, tickCount]);

    // Formata o valor para exibição
    const displayValue = useMemo(() => {
      if (valueFormat) {
        return valueFormat(value);
      }
      return `${Math.round(value)}${valueSuffix}`;
    }, [value, valueFormat, valueSuffix]);

    // Coordenadas do indicador (triângulo)
    const indicatorPoints = useMemo(() => {
      const triangleSize = 8;

      if (isHorizontal) {
        const cx = indicatorPosition;
        const cy = 20 - 2;
        return `${cx},${cy - triangleSize} ${cx - triangleSize / 2},${cy} ${cx + triangleSize / 2},${cy}`;
      } else {
        const cx = 20 - 2;
        const cy = 10 + size - 20 - (normalizedValue / 100) * (size - 20);
        return `${cx - triangleSize},${cy} ${cx},${cy - triangleSize / 2} ${cx},${cy + triangleSize / 2}`;
      }
    }, [indicatorPosition, isHorizontal, normalizedValue, size]);

    return (
      <Stack ref={ref} gap={4} align="center" className={className} style={style}>
        {label && (
          <Text size={labelSize} c="dimmed">
            {label}
          </Text>
        )}

        <svg width={svgWidth} height={svgHeight}>
          {/* Background bar */}
          <rect
            x={isHorizontal ? 10 : 20}
            y={isHorizontal ? 20 : 10}
            width={isHorizontal ? size - 20 : thickness}
            height={isHorizontal ? thickness : size - 20}
            rx={4}
            fill={`var(--mantine-color-${backgroundColor})`}
          />

          {/* Value zones */}
          {barZones.map((zone, index) => (
            zone && (
              <rect
                key={index}
                x={zone.x}
                y={zone.y}
                width={zone.width}
                height={zone.height}
                rx={4}
                fill={zone.color}
              />
            )
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
                strokeWidth={1}
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

          {/* Indicator triangle */}
          <polygon
            points={indicatorPoints}
            fill={`var(--mantine-color-${indicatorColor}-7)`}
          />
        </svg>

        {showValue && (
          <Text size="sm" fw={600}>
            {displayValue}
          </Text>
        )}
      </Stack>
    );
  }
);

ArchbaseLinearGauge.displayName = 'ArchbaseLinearGauge';
