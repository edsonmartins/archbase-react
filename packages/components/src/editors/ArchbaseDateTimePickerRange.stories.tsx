import type { Meta, StoryObj } from '@storybook/react';
import { Box, Card, Grid, Group, Text } from '@mantine/core';
import { DateValue } from '@mantine/dates';
import React, { useState } from 'react';
import { formatISO } from 'date-fns';
import { ArchbaseDateTimePickerRange } from './ArchbaseDateTimePickerRange';

const ArchbaseDateTimePickerRangeExample = () => {
  const [selectedRange, setSelectedRange] = useState<DateValue[]>();

  return (
    <Grid>
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>DateTime Picker Range Component</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 500 }}>
            <ArchbaseDateTimePickerRange
              onSelectDateRange={setSelectedRange}
              label="Informe o período"
            />
            <Box mt="md">
              <Text size="sm" fw={500}>Período selecionado:</Text>
              <Text size="sm" c="dimmed">
                {selectedRange && selectedRange[0] && selectedRange[1]
                  ? formatISO(selectedRange[0]!) + ' -> ' + formatISO(selectedRange[1]!)
                  : '(selecione as datas e horários)'}
              </Text>
            </Box>
          </Box>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const ArchbaseDateTimePickerRangeWithInitialValueExample = () => {
  const initialStart = new Date();
  initialStart.setHours(9, 0, 0, 0);
  const initialEnd = new Date();
  initialEnd.setDate(initialEnd.getDate() + 7);
  initialEnd.setHours(18, 0, 0, 0);

  const [selectedRange, setSelectedRange] = useState<DateValue[]>([initialStart, initialEnd]);

  return (
    <Grid>
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>DateTime Picker Range com Valor Inicial</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 500 }}>
            <ArchbaseDateTimePickerRange
              onSelectDateRange={setSelectedRange}
              label="Informe o período"
              value={selectedRange as [Date | null, Date | null]}
            />
            <Box mt="md">
              <Text size="sm" fw={500}>Período selecionado:</Text>
              <Text size="sm" c="dimmed">
                {selectedRange && selectedRange[0] && selectedRange[1]
                  ? formatISO(selectedRange[0]!) + ' -> ' + formatISO(selectedRange[1]!)
                  : ''}
              </Text>
            </Box>
          </Box>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseDateTimePickerRange> = {
  title: 'Editores/DateTimePicker Range',
  component: ArchbaseDateTimePickerRange,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseDateTimePickerRange é um componente de seleção de período com data e hora.

## Características
- Seleção de intervalo de datas com horário
- Calendário interativo com seletor de hora
- Formatação de data e hora configurável
- Visualização clara do período selecionado
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseDateTimePickerRange>;

export const ExemploBasico: Story = {
  name: 'Exemplo Básico',
  render: () => <ArchbaseDateTimePickerRangeExample />,
};

export const ComValorInicial: Story = {
  name: 'Com Valor Inicial',
  render: () => <ArchbaseDateTimePickerRangeWithInitialValueExample />,
};
