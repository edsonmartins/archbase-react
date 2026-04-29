import React, { useCallback, useMemo, useState } from 'react';
import {
  DatePickerInput,
  DatePickerInputProps,
  DatesRangeValue,
  DateValue,
} from '@mantine/dates';
import {
  Box,
  Button,
  Group,
  Popover,
  Stack,
  Text,
  Divider,
  SimpleGrid,
} from '@mantine/core';
import { IconCalendar } from '@tabler/icons-react';
import 'dayjs/locale/pt-br';

// =============================================================================
// Types
// =============================================================================

export interface DateRangePreset {
  /** Identificador único */
  id: string;
  /** Label exibido */
  label: string;
  /** Função que retorna o range */
  getValue: () => [Date, Date];
}

export interface ArchbaseMultiViewCalendarProps
  extends Omit<
    DatePickerInputProps<'range'>,
    'value' | 'onChange' | 'type' | 'numberOfColumns' | 'presets'
  > {
  /** Valor atual [startDate, endDate] */
  value?: DatesRangeValue;
  /** Callback ao mudar */
  onChange?: (value: DatesRangeValue) => void;
  /** Número de colunas (meses visíveis) */
  numberOfColumns?: number;
  /** Presets de data rápidos */
  presets?: DateRangePreset[];
  /** Mostrar presets */
  showPresets?: boolean;
  /** Locale (padrão: pt-BR) */
  locale?: string;
  /** Formato de exibição */
  valueFormat?: string;
}

// =============================================================================
// Utilities
// =============================================================================

function toDate(value: DateValue): Date | null {
  if (!value) return null;
  if (value instanceof Date) return value;
  return new Date(value);
}

function formatDate(value: DateValue, locale: string = 'pt-BR'): string {
  const date = toDate(value);
  if (!date) return '';
  return date.toLocaleDateString(locale);
}

// =============================================================================
// Default Presets
// =============================================================================

export const defaultDatePresets: DateRangePreset[] = [
  {
    id: 'today',
    label: 'Hoje',
    getValue: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
      return [today, endOfDay];
    },
  },
  {
    id: 'yesterday',
    label: 'Ontem',
    getValue: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      const endOfYesterday = new Date(yesterday);
      endOfYesterday.setHours(23, 59, 59, 999);
      return [yesterday, endOfYesterday];
    },
  },
  {
    id: 'last7days',
    label: 'Últimos 7 dias',
    getValue: () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const start = new Date();
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return [start, end];
    },
  },
  {
    id: 'last30days',
    label: 'Últimos 30 dias',
    getValue: () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const start = new Date();
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      return [start, end];
    },
  },
  {
    id: 'thisWeek',
    label: 'Esta semana',
    getValue: () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const start = new Date(today);
      start.setDate(today.getDate() - dayOfWeek);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return [start, end];
    },
  },
  {
    id: 'lastWeek',
    label: 'Semana passada',
    getValue: () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      const start = new Date(today);
      start.setDate(today.getDate() - dayOfWeek - 7);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      end.setHours(23, 59, 59, 999);
      return [start, end];
    },
  },
  {
    id: 'thisMonth',
    label: 'Este mês',
    getValue: () => {
      const start = new Date();
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      return [start, end];
    },
  },
  {
    id: 'lastMonth',
    label: 'Mês passado',
    getValue: () => {
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      return [start, end];
    },
  },
  {
    id: 'thisYear',
    label: 'Este ano',
    getValue: () => {
      const start = new Date(new Date().getFullYear(), 0, 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(new Date().getFullYear(), 11, 31);
      end.setHours(23, 59, 59, 999);
      return [start, end];
    },
  },
  {
    id: 'lastYear',
    label: 'Ano passado',
    getValue: () => {
      const year = new Date().getFullYear() - 1;
      const start = new Date(year, 0, 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(year, 11, 31);
      end.setHours(23, 59, 59, 999);
      return [start, end];
    },
  },
];

// =============================================================================
// ArchbaseMultiViewCalendar Component
// =============================================================================

export function ArchbaseMultiViewCalendar({
  value,
  onChange,
  numberOfColumns = 2,
  presets = defaultDatePresets,
  showPresets = true,
  locale = 'pt-BR',
  valueFormat = 'DD/MM/YYYY',
  ...props
}: ArchbaseMultiViewCalendarProps) {
  const handleChange = useCallback(
    (newValue: DatesRangeValue) => {
      onChange?.(newValue);
    },
    [onChange]
  );

  return (
    <DatePickerInput
      {...props}
      type="range"
      value={value}
      onChange={handleChange}
      numberOfColumns={numberOfColumns}
      locale={locale}
      valueFormat={valueFormat}
      leftSection={<IconCalendar size={16} />}
      popoverProps={{
        ...props.popoverProps,
        width: showPresets ? 'auto' : undefined,
      }}
    />
  );
}

// =============================================================================
// ArchbaseMultiViewCalendarWithPresets Component
// =============================================================================

export interface ArchbaseMultiViewCalendarWithPresetsProps
  extends Omit<ArchbaseMultiViewCalendarProps, 'showPresets'> {
  /** Presets de data rápidos */
  presets?: DateRangePreset[];
  /** Label para seção de presets */
  presetsLabel?: string;
}

export function ArchbaseMultiViewCalendarWithPresets({
  value,
  onChange,
  numberOfColumns = 2,
  presets = defaultDatePresets,
  presetsLabel = 'Períodos rápidos',
  locale = 'pt-BR',
  valueFormat = 'DD/MM/YYYY',
  ...props
}: ArchbaseMultiViewCalendarWithPresetsProps) {
  const [opened, setOpened] = useState(false);

  const handleChange = useCallback(
    (newValue: DatesRangeValue) => {
      onChange?.(newValue);
    },
    [onChange]
  );

  const handlePresetClick = useCallback(
    (preset: DateRangePreset) => {
      const [start, end] = preset.getValue();
      onChange?.([start, end]);
      setOpened(false);
    },
    [onChange]
  );

  const displayValue = useMemo(() => {
    if (!value || !value[0] || !value[1]) {
      return props.placeholder || 'Selecione um período';
    }
    const startStr = formatDate(value[0], locale);
    const endStr = formatDate(value[1], locale);
    return `${startStr} - ${endStr}`;
  }, [value, props.placeholder, locale]);

  // Find matching preset
  const activePreset = useMemo(() => {
    if (!value || !value[0] || !value[1]) return null;
    const startDate = toDate(value[0]);
    const endDate = toDate(value[1]);
    if (!startDate || !endDate) return null;

    const start = startDate.toDateString();
    const end = endDate.toDateString();

    return presets.find((preset) => {
      const [presetStart, presetEnd] = preset.getValue();
      return presetStart.toDateString() === start && presetEnd.toDateString() === end;
    });
  }, [value, presets]);

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      width="auto"
      position="bottom-start"
      shadow="md"
    >
      <Popover.Target>
        <Button
          variant="default"
          leftSection={<IconCalendar size={16} />}
          onClick={() => setOpened((o) => !o)}
        >
          {activePreset ? activePreset.label : displayValue}
        </Button>
      </Popover.Target>

      <Popover.Dropdown>
        <Group align="flex-start" gap="md" wrap="nowrap">
          {/* Presets */}
          <Stack gap="xs" style={{ minWidth: 150 }}>
            <Text size="xs" fw={500} c="dimmed">
              {presetsLabel}
            </Text>
            {presets.map((preset) => (
              <Button
                key={preset.id}
                variant={activePreset?.id === preset.id ? 'light' : 'subtle'}
                size="xs"
                justify="flex-start"
                onClick={() => handlePresetClick(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </Stack>

          <Divider orientation="vertical" />

          {/* Calendar */}
          <Box>
            <DatePickerInput
              type="range"
              value={value}
              onChange={handleChange}
              numberOfColumns={numberOfColumns}
              locale={locale}
              valueFormat={valueFormat}
            />
          </Box>
        </Group>
      </Popover.Dropdown>
    </Popover>
  );
}

// =============================================================================
// ArchbaseDateRangeQuickPicker Component
// =============================================================================

export interface ArchbaseDateRangeQuickPickerProps {
  /** Valor atual [startDate, endDate] */
  value?: DatesRangeValue;
  /** Callback ao mudar */
  onChange?: (value: DatesRangeValue) => void;
  /** Presets disponíveis */
  presets?: DateRangePreset[];
  /** Colunas de presets */
  columns?: number;
}

export function ArchbaseDateRangeQuickPicker({
  value,
  onChange,
  presets = defaultDatePresets.slice(0, 6),
  columns = 3,
}: ArchbaseDateRangeQuickPickerProps) {
  const handlePresetClick = useCallback(
    (preset: DateRangePreset) => {
      const [start, end] = preset.getValue();
      onChange?.([start, end]);
    },
    [onChange]
  );

  // Find active preset
  const activePresetId = useMemo(() => {
    if (!value || !value[0] || !value[1]) return null;
    const startDate = toDate(value[0]);
    const endDate = toDate(value[1]);
    if (!startDate || !endDate) return null;

    const start = startDate.toDateString();
    const end = endDate.toDateString();

    const found = presets.find((preset) => {
      const [presetStart, presetEnd] = preset.getValue();
      return presetStart.toDateString() === start && presetEnd.toDateString() === end;
    });

    return found?.id ?? null;
  }, [value, presets]);

  return (
    <SimpleGrid cols={columns} spacing="xs">
      {presets.map((preset) => (
        <Button
          key={preset.id}
          variant={activePresetId === preset.id ? 'filled' : 'light'}
          size="xs"
          onClick={() => handlePresetClick(preset)}
        >
          {preset.label}
        </Button>
      ))}
    </SimpleGrid>
  );
}

// =============================================================================
// Utility: Create Custom Preset
// =============================================================================

export function createDatePreset(
  id: string,
  label: string,
  getValue: () => [Date, Date]
): DateRangePreset {
  return { id, label, getValue };
}

export default ArchbaseMultiViewCalendar;
