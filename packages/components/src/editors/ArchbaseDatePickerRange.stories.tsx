import type { Meta, StoryObj } from '@storybook/react';
import { Box, Card, Grid, Group, Text } from '@mantine/core';
import { DateValue } from '@mantine/dates';
import React, { useState } from 'react';
import { formatISO } from 'date-fns';
import { ArchbaseDatePickerRange } from './ArchbaseDatePickerRange';

const ArchbaseDatePickerRangeExample = () => {
  const [selectedRange, setSelectedRange] = useState<DateValue[]>();

  return (
    <Grid>
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Date Picker Range Component</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 500 }}>
            <ArchbaseDatePickerRange
              onSelectDateRange={setSelectedRange}
              label="Informe o período"
            />
            <Box mt="md">
              <Text size="sm" fw={500}>Período selecionado:</Text>
              <Text size="sm" c="dimmed">
                {selectedRange && selectedRange[0]
                  ? formatISO(selectedRange[0]!) +
                    ' -> ' +
                    (selectedRange[1] ? formatISO(selectedRange[1]!) : '(aguardando data final)')
                  : '(nenhum período selecionado)'}
              </Text>
            </Box>
          </Box>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const ArchbaseDatePickerRangeWithInitialValueExample = () => {
  const initialStart = new Date();
  const initialEnd = new Date();
  initialEnd.setDate(initialEnd.getDate() + 7);

  const [selectedRange, setSelectedRange] = useState<DateValue[]>([initialStart, initialEnd]);

  return (
    <Grid>
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Date Picker Range com Valor Inicial</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 500 }}>
            <ArchbaseDatePickerRange
              onSelectDateRange={setSelectedRange}
              label="Informe o período"
              value={selectedRange as [Date | null, Date | null]}
            />
            <Box mt="md">
              <Text size="sm" fw={500}>Período selecionado:</Text>
              <Text size="sm" c="dimmed">
                {selectedRange && selectedRange[0]
                  ? formatISO(selectedRange[0]!) +
                    ' -> ' +
                    (selectedRange[1] ? formatISO(selectedRange[1]!) : '')
                  : ''}
              </Text>
            </Box>
          </Box>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseDatePickerRange> = {
  title: 'Editores/DatePicker Range',
  component: ArchbaseDatePickerRange,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseDatePickerRange é um componente de seleção de período de datas.

## Características
- Seleção de intervalo de datas
- Calendário interativo
- Formatação de data configurável
- Visualização clara do período selecionado
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseDatePickerRange>;

export const ExemploBasico: Story = {
  name: 'Exemplo Básico',
  render: () => <ArchbaseDatePickerRangeExample />,
};

export const ComValorInicial: Story = {
  name: 'Com Valor Inicial',
  render: () => <ArchbaseDatePickerRangeWithInitialValueExample />,
};
