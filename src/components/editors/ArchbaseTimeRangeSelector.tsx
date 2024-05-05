import React, { useState, useRef, useEffect, FC } from 'react';
import { Select, Button, Group, ActionIcon, Tooltip } from '@mantine/core';
import { DatePickerInput, TimeInput } from '@mantine/dates';
import { IconClock } from '@tabler/icons-react';


// Função para formatar a hora de um objeto Date para uma string "HH:mm"
const formatTime = (date) => {
  if (!date) return '';
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
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

export type ArchbaseTimeRangeSelectorProps = {
  ranges: RangeOption[];
  onRangeChange?: (selectedValue: string, range: { start: Date | null; end: Date | null }) => void;
  defaultRangeValue?: string;
};

export const ArchbaseTimeRangeSelector: FC<ArchbaseTimeRangeSelectorProps> = ({ ranges, onRangeChange, defaultRangeValue }) => {
  const [selectedRange, setSelectedRange] = useState<string>(defaultRangeValue ? defaultRangeValue : (ranges.length > 0 ? ranges[0].value : ''));
  const [customRange, setCustomRange] = useState<CustomRange>({ start: null, end: null });
  const [dateRange, setDateRange] = useState<{ start: Date | null, end: Date | null }>({ start: null, end: null });
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Só executa na montagem do componente ou quando defaultRangeValue realmente muda.
    // Isso configura o valor inicial sem forçar novas atualizações a cada renderização.
    if (defaultRangeValue && (selectedRange !== defaultRangeValue || dateRange.start === null)) {
      const range = ranges.find(r => r.value === defaultRangeValue);
      if (range) {
        const { start, end } = range.rangeFunction(new Date());
        // Verifica se realmente precisa atualizar para evitar loop
        if (dateRange.start !== start || dateRange.end !== end) {
          setDateRange({ start, end });
        }
      } else if (defaultRangeValue === 'custom') {
        // Se for customizado, mas não temos datas definidas, você pode definir um padrão ou deixar como está.
      }
    }
  }, [defaultRangeValue, ranges]); // Somente reativa se defaultRangeValue ou ranges mudar.

  const applyCustomRange = () => {
    setDateRange({ start: customRange.start, end: customRange.end });
    if (onRangeChange) {
      onRangeChange('custom', { start: customRange.start, end: customRange.end });
    }
  };

  const handleRangeChange = (value: string) => {
    setSelectedRange(value);
    const range = ranges.find(r => r.value === value);
    if (range) {
      const { start, end } = range.rangeFunction(new Date());
      setDateRange({ start, end });
      if (onRangeChange) {
        onRangeChange(value, { start, end });
      }
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

  const rangeLabel = dateRange.start && dateRange.end 
    ? `${dateRange.start.toLocaleString()} - ${dateRange.end.toLocaleString()}` 
    : 'Intervalo selecionado';

  return (
    <Group gap="xs" align="center">
      <Tooltip label={rangeLabel} position="bottom" withArrow>
        <div>
          <Select
            label="Selecione um intervalo"
            placeholder="Selecionado..."
            value={selectedRange}
            onChange={handleRangeChange}
            data={[...ranges.map(({ value, label }) => ({ value, label })), { value: 'custom', label: 'Customizado' }]}
            style={{ width: '200px' }} 
          />
        </div>
      </Tooltip>
      {selectedRange === 'custom' && (
        <>
          <DatePickerInput
            label="Data inicial"
            value={customRange.start}
            onChange={(date: Date | null) => setCustomRange(prev => ({ ...prev, start: date }))}
            style={{ width: '140px' }} 
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
          <DatePickerInput
            label="Data final"
            value={customRange.end}
            onChange={(date: Date | null) => setCustomRange(prev => ({ ...prev, end: date }))}
            style={{ width: '140px' }} 
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
          <Button onClick={applyCustomRange} style={{ alignSelf: 'end' }}>Aplicar</Button>
        </>
      )}
    </Group>
  );
};

