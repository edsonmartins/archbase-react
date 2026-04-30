import React, { forwardRef, useMemo } from 'react';
import { Progress, MantineColor, MantineSize, Box, Text, Stack } from '@mantine/core';

export interface ArchbaseChunkProgressBarProps {
  /** Valor atual (0-100) */
  value: number;
  /** Quantidade de chunks */
  chunkCount?: number;
  /** Gap entre os chunks em pixels */
  gap?: number;
  /** Cor dos chunks incompletos */
  color?: MantineColor;
  /** Cor dos chunks completos */
  completedColor?: MantineColor;
  /** Se deve animar os chunks */
  animated?: boolean;
  /** Se deve ter listras */
  striped?: boolean;
  /** Tamanho da barra */
  size?: MantineSize | number;
  /** Raio da barra */
  radius?: MantineSize | number;
  /** Label opcional */
  label?: string;
  /** Se deve mostrar o percentual */
  showPercentage?: boolean;
  /** Formato do percentual */
  percentageFormat?: (value: number) => string;
  /** Largura */
  width?: number | string;
  /** Classe CSS */
  className?: string;
  /** Estilo */
  style?: React.CSSProperties;
}

export const ArchbaseChunkProgressBar = forwardRef<HTMLDivElement, ArchbaseChunkProgressBarProps>(
  (
    {
      value,
      chunkCount = 10,
      gap = 2,
      color = 'gray.3',
      completedColor = 'blue',
      animated = false,
      striped = false,
      size = 'md',
      radius = 'sm',
      label,
      showPercentage = false,
      percentageFormat,
      width,
      className,
      style,
    },
    ref
  ) => {
    // Calcula as seções do progress baseado no valor e chunks
    const sections = useMemo(() => {
      const clampedValue = Math.min(100, Math.max(0, value));
      const chunkSize = 100 / chunkCount;
      const completedChunks = Math.floor(clampedValue / chunkSize);
      const partialChunk = (clampedValue % chunkSize) / chunkSize;

      const result: Array<{ value: number; color: MantineColor }> = [];

      // Chunks completos
      for (let i = 0; i < completedChunks; i++) {
        result.push({
          value: chunkSize - (gap * (chunkCount - 1)) / chunkCount,
          color: completedColor,
        });
        if (i < chunkCount - 1) {
          result.push({
            value: gap / chunkCount,
            color: 'transparent' as MantineColor,
          });
        }
      }

      // Chunk parcial
      if (completedChunks < chunkCount && partialChunk > 0) {
        const partialValue = (chunkSize - (gap * (chunkCount - 1)) / chunkCount) * partialChunk;
        result.push({
          value: partialValue,
          color: completedColor,
        });
        result.push({
          value: chunkSize - partialValue - (gap * (chunkCount - 1)) / chunkCount,
          color: color,
        });
        if (completedChunks < chunkCount - 1) {
          result.push({
            value: gap / chunkCount,
            color: 'transparent' as MantineColor,
          });
        }
      }

      // Chunks restantes vazios
      for (let i = completedChunks + (partialChunk > 0 ? 1 : 0); i < chunkCount; i++) {
        result.push({
          value: chunkSize - (gap * (chunkCount - 1)) / chunkCount,
          color: color,
        });
        if (i < chunkCount - 1) {
          result.push({
            value: gap / chunkCount,
            color: 'transparent' as MantineColor,
          });
        }
      }

      return result;
    }, [chunkCount, color, completedColor, gap, value]);

    // Formato do percentual
    const formattedPercentage = useMemo(() => {
      const clampedValue = Math.min(100, Math.max(0, value));
      if (percentageFormat) return percentageFormat(clampedValue);
      return `${Math.round(clampedValue)}%`;
    }, [percentageFormat, value]);

    return (
      <Stack ref={ref} gap={4} className={className} style={{ ...style, width }}>
        {(label || showPercentage) && (
          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {label && (
              <Text size="sm" fw={500}>
                {label}
              </Text>
            )}
            {showPercentage && (
              <Text size="sm" c="dimmed">
                {formattedPercentage}
              </Text>
            )}
          </Box>
        )}
        <Progress.Root size={size} radius={radius}>
          {sections.map((section, index) => (
            <Progress.Section
              key={index}
              value={section.value}
              color={section.color}
              animated={animated && section.color === completedColor}
              striped={striped && section.color === completedColor}
            />
          ))}
        </Progress.Root>
      </Stack>
    );
  }
);

ArchbaseChunkProgressBar.displayName = 'ArchbaseChunkProgressBar';
