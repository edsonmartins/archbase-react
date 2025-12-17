import type { Meta, StoryObj } from '@storybook/react';
import { Box, Card, Grid, Group, ScrollArea, Space, Text } from '@mantine/core';
import React, { useMemo, useState } from 'react';
import { ArchbaseTimeRangeSelector } from './ArchbaseTimeRangeSelector';
import { ArchbaseObjectInspector } from '../debug';
import { subDays } from 'date-fns';

const ArchbaseTimeRangeSelectorExample = () => {
  const ULTIMOS_7_DIAS = 'últimos 7 dias';
  const ULTIMOS_30_DIAS = 'últimos 30 dias';
  const ULTIMO_DIA = 'último dia';

  const [value, setValue] = useState(ULTIMOS_7_DIAS);
  const [range, setRange] = useState({ start: subDays(new Date(), 7), end: new Date() });

  const ranges = useMemo(
    () => [
      {
        label: ULTIMO_DIA,
        value: ULTIMO_DIA,
        rangeFunction: (current: Date) => ({ start: subDays(current, 1), end: current }),
      },
      {
        label: ULTIMOS_7_DIAS,
        value: ULTIMOS_7_DIAS,
        rangeFunction: (current: Date) => ({ start: subDays(current, 7), end: current }),
      },
      {
        label: ULTIMOS_30_DIAS,
        value: ULTIMOS_30_DIAS,
        rangeFunction: (current: Date) => ({ start: subDays(current, 30), end: current }),
      },
    ],
    []
  );

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Time Range Selector Component</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 200 }}>
            <ScrollArea h={200} p={20}>
              <ArchbaseTimeRangeSelector
                defaultRangeValue={ULTIMOS_7_DIAS}
                ranges={ranges}
                onRangeChange={(selectedValue, selectedRange) => {
                  setValue(selectedValue);
                  setRange(selectedRange);
                }}
              />
            </ScrollArea>
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Resultado</Text>
            </Group>
          </Card.Section>
          <ScrollArea h={300}>
            <Space h={20} />
            <Text p="md" fw={500}>
              Selecionado: {value}
            </Text>
            <ArchbaseObjectInspector data={range} />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const ArchbaseTimeRangeSelectorCustomExample = () => {
  const HOJE = 'hoje';
  const ONTEM = 'ontem';
  const ESTA_SEMANA = 'esta semana';
  const ESTE_MES = 'este mês';

  const [value, setValue] = useState(HOJE);
  const [range, setRange] = useState({ start: new Date(), end: new Date() });

  const ranges = useMemo(
    () => [
      {
        label: HOJE,
        value: HOJE,
        rangeFunction: (current: Date) => ({ start: current, end: current }),
      },
      {
        label: ONTEM,
        value: ONTEM,
        rangeFunction: (current: Date) => {
          const yesterday = subDays(current, 1);
          return { start: yesterday, end: yesterday };
        },
      },
      {
        label: ESTA_SEMANA,
        value: ESTA_SEMANA,
        rangeFunction: (current: Date) => ({ start: subDays(current, 7), end: current }),
      },
      {
        label: ESTE_MES,
        value: ESTE_MES,
        rangeFunction: (current: Date) => ({ start: subDays(current, 30), end: current }),
      },
    ],
    []
  );

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Seletor Customizado</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 200 }}>
            <ScrollArea h={200} p={20}>
              <ArchbaseTimeRangeSelector
                defaultRangeValue={HOJE}
                ranges={ranges}
                onRangeChange={(selectedValue, selectedRange) => {
                  setValue(selectedValue);
                  setRange(selectedRange);
                }}
              />
            </ScrollArea>
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Resultado</Text>
            </Group>
          </Card.Section>
          <ScrollArea h={300}>
            <Space h={20} />
            <Text p="md" fw={500}>
              Selecionado: {value}
            </Text>
            <ArchbaseObjectInspector data={range} />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseTimeRangeSelector> = {
  title: 'Editores/TimeRangeSelector',
  component: ArchbaseTimeRangeSelector,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseTimeRangeSelector é um componente para seleção de períodos de tempo pré-definidos.

## Características
- Períodos pré-configurados
- Função de cálculo customizada por período
- Retorna objeto com data inicial e final
- Valor padrão configurável
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseTimeRangeSelector>;

export const ExemploBasico: Story = {
  name: 'Exemplo Básico',
  render: () => <ArchbaseTimeRangeSelectorExample />,
};

export const PeríodosCustomizados: Story = {
  name: 'Períodos Customizados',
  render: () => <ArchbaseTimeRangeSelectorCustomExample />,
};
