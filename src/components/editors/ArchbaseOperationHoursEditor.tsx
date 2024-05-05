import React, { useEffect, useState } from 'react'
import { MultiSelect, Button, Group, Box, Text, ActionIcon } from '@mantine/core'
import { TimeInput } from '@mantine/dates'
import { IconClock, IconTrash } from '@tabler/icons-react'

type CustomRange = {
  start: Date | null
  end: Date | null
}

export type ArchbaseOperatingHoursEditorProps = {
  onChange: (value: any) => void
  readOnly?: boolean
  initialValue: any
  label?: any
  error?: string
}

const dayMappings = {
  '1': 'MONDAY',
  '2': 'TUESDAY',
  '3': 'WEDNESDAY',
  '4': 'THURSDAY',
  '5': 'FRIDAY',
  '6': 'SATURDAY',
  '7': 'SUNDAY'
}

function formatTimeForOutput(time) {
  if (!time) return ''
  return (
    time.getHours().toString().padStart(2, '0') +
    ':' +
    time.getMinutes().toString().padStart(2, '0')
  )
}

const parseOperatingHours = (inputString) => {
  if (!inputString || inputString === '') return [];
  return inputString.split(';').map(part => {
    const [daysPart, timeRange] = part.split('|');
    return {
      days: daysPart.split(',').filter(day => day),
      timeRange
    };
  });
};

const daysOfWeek = [
  { value: '1', label: 'Segunda-feira' },
  { value: '2', label: 'Terça-feira' },
  { value: '3', label: 'Quarta-feira' },
  { value: '4', label: 'Quinta-feira' },
  { value: '5', label: 'Sexta-feira' },
  { value: '6', label: 'Sábado' },
  { value: '7', label: 'Domingo' }
]

const daysOfWeekTranslate = [
  { value: 'MONDAY', label: 'Seg' },
  { value: 'TUESDAY', label: 'Ter' },
  { value: 'WEDNESDAY', label: 'Qua' },
  { value: 'THURSDAY', label: 'Qui' },
  { value: 'FRIDAY', label: 'Sex' },
  { value: 'SATURDAY', label: 'Sáb' },
  { value: 'SUNDAY', label: 'Dom' }
]

// Função para transformar o estado do componente na string de horário
const formatOperatingHours = (operatingHours) => {
  if (!Array.isArray(operatingHours)) return '';
  return operatingHours
    .map((oh) => {
      const daysLabel = oh.days
        .map((day) => day)
        .join(',');
      return `${daysLabel}|${oh.timeRange}`;
    })
    .join(';');
};

export function ArchbaseOperatingHoursEditor({
  label,
  initialValue,
  onChange,
  readOnly = false,
  error
}: ArchbaseOperatingHoursEditorProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [customRange, setCustomRange] = useState<CustomRange>({ start: null, end: null })
  const [operatingHours, setOperatingHours] = useState<any>([])

  // Atualiza o estado do componente com base no valor inicial fornecido
  useEffect(() => {
    if (initialValue) {
      setOperatingHours(parseOperatingHours(initialValue))
    }
  }, [initialValue])

  useEffect(() => {
    // Quando o estado interno muda, atualiza o valor externo
    onChange(formatOperatingHours(operatingHours))
  }, [operatingHours, onChange])

  const updateTime = (timeString: string, isStart: boolean) => {
    const [hours, minutes] = timeString.split(':').map(Number)
    const date = new Date((isStart ? customRange.start : customRange.end) || new Date())
    date.setHours(hours, minutes)
    setCustomRange((prev) => ({
      ...prev,
      [isStart ? 'start' : 'end']: new Date(date)
    }))
  }

  const formatTime = (date) => {
    if (!date) return ''
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const addOperatingHours = () => {
    if (selectedDays.length > 0 && customRange && customRange.start && customRange.end) {
        // Os valores em selectedDays estão sendo mapeados corretamente aqui.
        const formattedDays = selectedDays.map((day) => dayMappings[day]); // Esta deve ser uma array de strings como ['MONDAY', 'TUESDAY']
        
        const formattedStartTime = formatTimeForOutput(customRange.start);
        const formattedEndTime = formatTimeForOutput(customRange.end);
        
        // A variável formattedDays já é um array, não precisa ser uma string aqui.
        const newOperatingHour = {
            days: formattedDays, // deve permanecer como array para compatibilidade com o restante do código
            timeRange: `${formattedStartTime}-${formattedEndTime}`,
        };

        setOperatingHours([...operatingHours, newOperatingHour]);
        setSelectedDays([]);
        setCustomRange({ start: null, end: null });
    }
};

  return (
    <div>
      {label && (
        <div>
          <strong>{label}</strong>
        </div>
      )}
      <MultiSelect
        data={daysOfWeek}
        value={selectedDays}
        onChange={setSelectedDays}
        placeholder="Selecione os dias"
        label="Dias da semana"
        clearable
        disabled={readOnly}
      />
      <Group grow>
        <TimeInput
          disabled={readOnly}
          value={formatTime(customRange.start)}
          placeholder="HH:MM"
          label="Hora de Início"
          onChange={(event) => updateTime(event.currentTarget.value, true)}
          rightSection={<IconClock size="1rem" stroke={1.5} />}
        />
        <TimeInput
          disabled={readOnly}
          value={formatTime(customRange.end)}
          onChange={(event) => updateTime(event.currentTarget.value, false)}
          rightSection={<IconClock size="1rem" stroke={1.5} />}
          placeholder="HH:MM"
          label="Hora de Término"
        />
      </Group>
      <Button
        onClick={addOperatingHours}
        disabled={!selectedDays.length || !customRange.start || !customRange.end || readOnly}
      >
        Adicionar
      </Button>

      {operatingHours.map((oh, index) => (
        <Box key={index} mt={2}>
          <Group justify='space-between'>
            <Group wrap='nowrap'>
              <Text fw={700} size={"12px"}>{oh.days.map((day) => daysOfWeekTranslate.find((d) => d.value === day)?.label || 'Dia desconhecido').join(',')}</Text>
              <Text size={"12px"} fw={700} color="blue">{oh.timeRange}</Text>
            </Group>
            <ActionIcon
              color="red"
              disabled={readOnly}
              onClick={() => {
                const updatedHours = [...operatingHours]
                updatedHours.splice(index, 1)
                setOperatingHours(updatedHours)
              }}
            >
              <IconTrash size="1.2rem" color="red"/>
            </ActionIcon>
          </Group>
        </Box>
      ))}
    </div>
  )
}
