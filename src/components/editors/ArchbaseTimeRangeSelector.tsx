import React, { useState, useRef, useEffect, FC, useMemo, useImperativeHandle } from 'react';
import { Select, Button, Group, ActionIcon, Tooltip, Popover, Text, Box, Stack, ComboboxItem } from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { IconClock, IconCalendar } from '@tabler/icons-react';

// Função para formatar a hora de um objeto Date para uma string "HH:mm"
const formatTime = (date) => {
  if (!date) return '';
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Função para formatar a data para exibição
const formatDate = (date: Date | null): string => {
  if (!date) return '';
  return date.toLocaleDateString();
};

// Função para formatar o intervalo de datas para exibição resumida (versão curta para o botão)
const formatDateRange = (start: Date | null, end: Date | null): string => {
  if (!start || !end) return 'Selecionar intervalo';

  const startDate = formatDate(start);
  const startTime = formatTime(start);
  const endDate = formatDate(end);
  const endTime = formatTime(end);

  // Se as datas são iguais, exibe apenas uma vez
  if (startDate === endDate) {
    return `${startDate} ${startTime} - ${endTime}`;
  }

  return `${startDate} ${startTime} - ${endDate} ${endTime}`;
};

// Função para formatar o intervalo de datas com mais detalhes (para tooltip)
const formatDateRangeDetailed = (start: Date | null, end: Date | null): string => {
  if (!start || !end) return 'Nenhum intervalo selecionado';

  const startFull = start.toLocaleString();
  const endFull = end.toLocaleString();

  return `De: ${startFull}\nAté: ${endFull}`;
};

type CustomRange = {
  start: Date | null;
  end: Date | null;
};

export type RangeOption = {
  label: string;
  value: string;
  rangeFunction: (current: Date) => { start: Date; end: Date };
};

export type ArchbaseTimeRangeSelectorRef = {
  updateCurrentRange: () => { start: Date | null; end: Date | null };
  getCurrentRange: () => { selectedValue: string | null, range: { start: Date | null; end: Date | null } };
};

export type ArchbaseTimeRangeSelectorProps = {
  ranges: RangeOption[];
  onRangeChange?: (selectedValue: string|null, range: { start: Date | null; end: Date | null }) => void;
  defaultRangeValue?: string|null;
  label?: string;                    // Label visível fora do popover
  popoverTitle?: string;             // Título dentro do popover
  width?: number | string;
  position?: 'bottom' | 'top' | 'left' | 'right';
  componentRef?: React.MutableRefObject<ArchbaseTimeRangeSelectorRef>;
};

export const ArchbaseTimeRangeSelector: FC<ArchbaseTimeRangeSelectorProps> = ({
  ranges,
  onRangeChange,
  defaultRangeValue,
  label,
  popoverTitle = 'Intervalo de tempo',
  width = 300,
  position = 'bottom',
  componentRef
}) => {
  const [selectedRange, setSelectedRange] = useState<string|null>(defaultRangeValue ? defaultRangeValue : (ranges.length > 0 ? ranges[0].value : ''));
  const [customRange, setCustomRange] = useState<CustomRange>({ start: null, end: null });
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });
  const [opened, setOpened] = useState(false);

  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  // Ref para expor métodos públicos do componente
  const internalRef = useRef<ArchbaseTimeRangeSelectorRef>({
    updateCurrentRange: () => dateRange,
    getCurrentRange: () => ({ selectedValue: selectedRange, range: dateRange })
  });

  // Texto para exibir no botão
  const buttonText = useMemo(() => {
    const option = ranges.find(r => r.value === selectedRange);
    if (option && selectedRange !== 'custom') {
      return option.label;
    }

    return formatDateRange(dateRange.start, dateRange.end);
  }, [selectedRange, dateRange, ranges]);

  // Atualizar a referência interna com a função updateCurrentRange
  useEffect(() => {
    internalRef.current = {
      ...internalRef.current,
      updateCurrentRange: () => {
        if (selectedRange && selectedRange !== 'custom') {
          const range = ranges.find(r => r.value === selectedRange);
          if (range) {
            const newRange = range.rangeFunction(new Date());
            setDateRange(newRange);
            if (onRangeChange) {
              onRangeChange(selectedRange, newRange);
            }
            return newRange;
          }
        }
        return dateRange;
      },
      getCurrentRange: () => ({
        selectedValue: selectedRange,
        range: dateRange
      })
    };
  }, [selectedRange, ranges, onRangeChange, dateRange]);

  // Expor os métodos via componentRef
  useEffect(() => {
    if (componentRef) {
      componentRef.current = {
        updateCurrentRange: () => {
          // Explicitamente retorna o resultado da chamada para garantir a tipagem correta
          return internalRef.current.updateCurrentRange();
        },
        getCurrentRange: () => {
          return internalRef.current.getCurrentRange();
        }
      };
    }
  }, [componentRef]);

  // Configura o valor inicial
  useEffect(() => {
    // Configura o valor inicial
    if (defaultRangeValue && (selectedRange !== defaultRangeValue || dateRange.start === null)) {
      const range = ranges.find(r => r.value === defaultRangeValue);
      if (range) {
        const { start, end } = range.rangeFunction(new Date());
        if (dateRange.start !== start || dateRange.end !== end) {
          setDateRange({ start, end });
        }
      } else if (defaultRangeValue === 'custom' && customRange.start && customRange.end) {
        // Se for customizado e temos datas definidas, utilize-as
        setDateRange({ start: customRange.start, end: customRange.end });
      }
    }
  }, [defaultRangeValue, ranges]);

  const applyCustomRange = () => {
    setDateRange({ start: customRange.start, end: customRange.end });
    setOpened(false);
    if (onRangeChange) {
      onRangeChange('custom', { start: customRange.start, end: customRange.end });
    }
  };

  const handleRangeChange = (value: string | null) => {
    setSelectedRange(value);

    // Se não for range customizado, podemos aplicar imediatamente
    if (value !== 'custom') {
      const range = ranges.find(r => r.value === value);
      if (range) {
        const { start, end } = range.rangeFunction(new Date());
        setDateRange({ start, end });
        setOpened(false);
        if (onRangeChange) {
          onRangeChange(value, { start, end });
        }
      }
    } else {
      // Para range customizado, inicializar com o intervalo atual se estiver vazio
      if (!customRange.start && !customRange.end && dateRange.start && dateRange.end) {
        setCustomRange({ start: dateRange.start, end: dateRange.end });
      }
      // Não fechamos o popover para permitir a configuração do range customizado
    }
  };

  const updateTime = (timeString: string, isStart: boolean) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date((isStart ? customRange.start : customRange.end) || new Date());
    date.setHours(hours, minutes);
    setCustomRange(prev => ({
      ...prev,
      [isStart ? 'start' : 'end']: new Date(date)
    }));
  };

  return (
    <Box>
      {label && (
        <Text size="sm" fw={500} mb={6}>
          {label}
        </Text>
      )}

      <Popover
        position={position}
        opened={opened}
        onChange={setOpened}
        width={width}
        trapFocus
        shadow="md"
        withinPortal
        closeOnEscape
        closeOnClickOutside={false}
      >
        <Popover.Target>
          <Tooltip
            label={formatDateRangeDetailed(dateRange.start, dateRange.end)}
            position="top"
            openDelay={300}
            disabled={!dateRange.start || !dateRange.end}
            multiline
          >
            <Button
              variant="light"
              rightSection={<IconCalendar size={16} />}
              style={{ width: typeof width === 'number' ? width : width }}
              onClick={() => setOpened((o) => !o)}
            >
              {buttonText}
            </Button>
          </Tooltip>
        </Popover.Target>

        <Popover.Dropdown>
          <Box p="xs">
            <Text size="sm" fw={500} mb="md">{popoverTitle}</Text>

            <Stack gap="xs" w="100%">
              <Select
                label="Selecione um intervalo"
                placeholder="Selecionado..."
                value={selectedRange}
                onChange={handleRangeChange}
                data={[...ranges.map(({ value, label }) => ({ value, label })), { value: 'custom', label: 'Customizado' }]}
                style={{ width: '100%' }}
              />

              {selectedRange === 'custom' && (
                <>
                  <Group grow mt="xs">
                    <DatePickerInput
                      label="Data inicial"
                      value={customRange.start}
                      onChange={(date: Date | null) => setCustomRange(prev => ({ ...prev, start: date }))}
                      style={{ flex: 1 }}
                      popoverProps={{ withinPortal: false, closeOnClickOutside: false }}
                    />
                    <TimeInput
                      label="Hora inicial"
                      value={formatTime(customRange.start)}
                      onChange={(event) => updateTime(event.currentTarget.value, true)}
                      rightSection={
                        <ActionIcon onClick={() => startRef.current?.click()}>
                          <IconClock size="1rem" stroke={1.5} />
                        </ActionIcon>
                      }
                      ref={startRef}
                      style={{ width: '100px' }}
                    />
                  </Group>

                  <Group grow mt="xs">
                    <DatePickerInput
                      label="Data final"
                      value={customRange.end}
                      onChange={(date: Date | null) => setCustomRange(prev => ({ ...prev, end: date }))}
                      style={{ flex: 1 }}
                      popoverProps={{ withinPortal: false, closeOnClickOutside: false }}
                    />
                    <TimeInput
                      label="Hora final"
                      value={formatTime(customRange.end)}
                      onChange={(event) => updateTime(event.currentTarget.value, false)}
                      rightSection={
                        <ActionIcon onClick={() => endRef.current?.click()}>
                          <IconClock size="1rem" stroke={1.5} />
                        </ActionIcon>
                      }
                      ref={endRef}
                      style={{ width: '100px' }}
                    />
                  </Group>

                  <Group justify="flex-end" mt="md">
                    <Button onClick={() => setOpened(false)} variant="outline" mr="xs">Cancelar</Button>
                    <Button onClick={applyCustomRange}>Aplicar</Button>
                  </Group>
                </>
              )}
            </Stack>
          </Box>
        </Popover.Dropdown>
      </Popover>
    </Box>
  );
};
