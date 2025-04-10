import React, { useState, useRef, useEffect, FC, useMemo } from 'react';
import { Select, Button, Group, ActionIcon, Tooltip, Popover, Text, Box, Stack } from '@mantine/core';
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
  // Nova propriedade para receber o intervalo de datas do componente pai
  defaultDateRange?: { start: Date | null; end: Date | null };
  label?: string;
  popoverTitle?: string;
  width?: number | string;
  position?: 'bottom' | 'top' | 'left' | 'right';
  componentRef?: React.MutableRefObject<ArchbaseTimeRangeSelectorRef>;
};

export const ArchbaseTimeRangeSelector: FC<ArchbaseTimeRangeSelectorProps> = (props) => {
  const {
    ranges,
    onRangeChange,
    defaultRangeValue,
    defaultDateRange,
    label,
    popoverTitle = 'Intervalo de tempo',
    width = 300,
    position = 'bottom',
    componentRef
  } = props;

  // Aceitar null explicitamente para o valor inicial
  const [selectedRange, setSelectedRange] = useState<string|null>(defaultRangeValue || null);
  const [customRange, setCustomRange] = useState<CustomRange>({ start: null, end: null });
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });
  const [opened, setOpened] = useState(false);

  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  // Ref para expor métodos públicos do componente
  const internalRef = useRef<ArchbaseTimeRangeSelectorRef>({
    updateCurrentRange: () => {
      // Para ranger predefinidos, recalcular baseado na data atual
      if (selectedRange && selectedRange !== 'custom') {
        const range = ranges.find(r => r.value === selectedRange);
        if (range) {
          const newRange = range.rangeFunction(new Date());
          setDateRange(newRange);
          return newRange;
        }
      }
      // Para custom ou não definido, retornar o valor atual
      return dateRange;
    },
    getCurrentRange: () => ({
      selectedValue: selectedRange,
      range: dateRange
    })
  });

  // Texto para exibir no botão
  const buttonText = useMemo(() => {
    // Se for um range predefinido, mostrar o label do range
    const option = ranges.find(r => r.value === selectedRange);
    if (option && selectedRange !== 'custom') {
      return option.label;
    }

    // Se for um range customizado ou não há seleção, mostrar o formato de data
    return formatDateRange(dateRange.start, dateRange.end);
  }, [selectedRange, dateRange, ranges]);

  // Sincronizar a ref interna quando o estado muda
  useEffect(() => {
    internalRef.current = {
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

  // Expor a referência para o componente pai
  useEffect(() => {
    if (componentRef) {
      componentRef.current = internalRef.current;
    }
  }, [componentRef, internalRef.current]);

  // Inicializar o estado com base nas props
  useEffect(() => {
    // Inicializar dateRange a partir de defaultDateRange se disponível
    if (defaultDateRange && defaultDateRange.start && defaultDateRange.end) {
      setDateRange({
        start: new Date(defaultDateRange.start.getTime()),
        end: new Date(defaultDateRange.end.getTime())
      });
    }
  }, []);

  // Atualizar o estado quando o defaultRangeValue muda
  useEffect(() => {
    if (defaultRangeValue !== undefined) {
      // Atualizar o selectedRange
      setSelectedRange(defaultRangeValue);

      // Se for um range predefinido
      if (defaultRangeValue && defaultRangeValue !== 'custom') {
        const range = ranges.find(r => r.value === defaultRangeValue);
        if (range) {
          const newRange = range.rangeFunction(new Date());
          setDateRange(newRange);
        }
      }
      // Se for custom e temos defaultDateRange disponível
      else if (defaultRangeValue === 'custom' && defaultDateRange &&
               defaultDateRange.start && defaultDateRange.end) {
        // Criar novas instâncias para evitar problemas de referência
        setDateRange({
          start: new Date(defaultDateRange.start.getTime()),
          end: new Date(defaultDateRange.end.getTime())
        });

        // Também atualizar o customRange para ficar sincronizado
        setCustomRange({
          start: new Date(defaultDateRange.start.getTime()),
          end: new Date(defaultDateRange.end.getTime())
        });
      }
    }
  }, [defaultRangeValue, ranges, defaultDateRange]);

  // Aplicar um intervalo customizado
  const applyCustomRange = () => {
    // Verificar se as datas foram definidas
    if (!customRange.start || !customRange.end) {
      return;
    }

    // IMPORTANTE: Criar novas instâncias de datas para evitar referências compartilhadas
    const newDateRange = {
      start: new Date(customRange.start.getTime()),
      end: new Date(customRange.end.getTime())
    };

    // Atualizar o estado interno
    setSelectedRange('custom');
    setDateRange(newDateRange);

    // Fechar o popover
    setOpened(false);

    // Notificar o componente pai
    if (onRangeChange) {
      onRangeChange('custom', newDateRange);
    }
  };

  // Manipular a mudança de range (predefinido ou customizado)
  const handleRangeChange = (value: string | null) => {
    setSelectedRange(value);

    // Se não for range customizado, aplicar imediatamente
    if (value && value !== 'custom') {
      const range = ranges.find(r => r.value === value);
      if (range) {
        const newRange = range.rangeFunction(new Date());
        setDateRange(newRange);
        setOpened(false);

        // Notificar o componente pai
        if (onRangeChange) {
          onRangeChange(value, newRange);
        }
      }
    } else if (value === 'custom') {
      // Para range customizado, inicializar com o intervalo atual se estiver vazio
      if (!customRange.start && !customRange.end && dateRange.start && dateRange.end) {
        // Criar novas instâncias das datas
        setCustomRange({
          start: new Date(dateRange.start.getTime()),
          end: new Date(dateRange.end.getTime())
        });
      }
      // Mantém o popover aberto para configuração
    }
  };

  // Atualizar as horas do intervalo customizado
  const updateTime = (timeString: string, isStart: boolean) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    // Usar a data atual se não houver uma data definida
    const date = new Date((isStart ? customRange.start : customRange.end) || new Date());
    date.setHours(hours, minutes);

    // Atualizar apenas a parte relevante do estado
    setCustomRange(prev => ({
      ...prev,
      [isStart ? 'start' : 'end']: new Date(date)
    }));
  };

  return (
    <Box>
      {/* Exibir o label se fornecido */}
      {label && (
        <Text size="sm" fw={500} mb={6}>
          {label}
        </Text>
      )}

      {/* Popover para seleção de intervalo */}
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
              {/* Seletor de intervalos predefinidos ou customizado */}
              <Select
                label="Selecione um intervalo"
                placeholder="Selecionado..."
                value={selectedRange}
                onChange={handleRangeChange}
                data={[
                  ...ranges.map(({ value, label }) => ({ value, label })),
                  { value: 'custom', label: 'Customizado' }
                ]}
                style={{ width: '100%' }}
              />

              {/* Controles para configuração de intervalo customizado */}
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
                    <Button
                      onClick={applyCustomRange}
                      disabled={!customRange.start || !customRange.end}
                    >
                      Aplicar
                    </Button>
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
