import React, { useCallback } from 'react';
import {
  RangeSlider,
  RangeSliderProps,
  Stack,
  Group,
  Text,
  Box,
} from '@mantine/core';

// =============================================================================
// Types
// =============================================================================

export type RangeValue = [number, number];

export interface ArchbaseRangeSliderProps extends Omit<RangeSliderProps, 'value' | 'onChange'> {
  /** Valor atual [min, max] */
  value?: RangeValue;
  /** Callback ao mudar */
  onChange?: (value: RangeValue) => void;
  /** Callback ao soltar o slider */
  onChangeEnd?: (value: RangeValue) => void;
  /** Mostrar valores */
  showValues?: boolean;
  /** Formatador de valores */
  formatValue?: (value: number) => string;
  /** Prefixo dos valores */
  valuePrefix?: string;
  /** Sufixo dos valores */
  valueSuffix?: string;
}

// =============================================================================
// ArchbaseRangeSlider Component
// =============================================================================

export function ArchbaseRangeSlider({
  value = [0, 100],
  onChange,
  onChangeEnd,
  showValues = true,
  formatValue,
  valuePrefix = '',
  valueSuffix = '',
  min = 0,
  max = 100,
  ...props
}: ArchbaseRangeSliderProps) {
  const handleChange = useCallback(
    (newValue: RangeValue) => {
      onChange?.(newValue);
    },
    [onChange]
  );

  const handleChangeEnd = useCallback(
    (newValue: RangeValue) => {
      onChangeEnd?.(newValue);
    },
    [onChangeEnd]
  );

  const displayValue = (val: number) => {
    if (formatValue) return formatValue(val);
    return `${valuePrefix}${val}${valueSuffix}`;
  };

  return (
    <Stack gap="xs">
      <RangeSlider
        {...props}
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        onChangeEnd={handleChangeEnd}
      />
      {showValues && (
        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Min: {displayValue(value[0])}
          </Text>
          <Text size="sm" c="dimmed">
            Max: {displayValue(value[1])}
          </Text>
        </Group>
      )}
    </Stack>
  );
}

// =============================================================================
// Convenience Components
// =============================================================================

export function ArchbasePriceRangeSlider(
  props: Omit<ArchbaseRangeSliderProps, 'valuePrefix'>
) {
  return <ArchbaseRangeSlider valuePrefix="R$ " {...props} />;
}

export function ArchbasePercentRangeSlider(
  props: Omit<ArchbaseRangeSliderProps, 'valueSuffix' | 'min' | 'max'>
) {
  return <ArchbaseRangeSlider min={0} max={100} valueSuffix="%" {...props} />;
}

export default ArchbaseRangeSlider;
