import type { Meta, StoryObj } from '@storybook/react';
import { Card, Grid, Group, Text } from '@mantine/core';
import React from 'react';
import { ArchbaseTimeline, ArchbaseTimelineProps } from './ArchbaseTimeline';

// Dados de exemplo inline
const timelineData = [
  { task: 'Task A', startTime: '2024-04-01T20:05:00.000Z', endTime: '2024-04-01T20:05:05.000Z' },
  { task: 'Task A', startTime: '2024-04-01T20:05:10.000Z', endTime: '2024-04-01T20:05:15.000Z' },
  { task: 'Task A', startTime: '2024-04-01T20:05:20.000Z', endTime: '2024-04-01T20:05:25.000Z' },
  { task: 'Task B', startTime: '2024-04-01T20:05:02.000Z', endTime: '2024-04-01T20:05:08.000Z' },
  { task: 'Task B', startTime: '2024-04-01T20:05:12.000Z', endTime: '2024-04-01T20:05:18.000Z' },
  { task: 'Task B', startTime: '2024-04-01T20:05:22.000Z', endTime: '2024-04-01T20:05:28.000Z' },
  { task: 'Task C', startTime: '2024-04-01T20:05:05.000Z', endTime: '2024-04-01T20:05:12.000Z' },
  { task: 'Task C', startTime: '2024-04-01T20:05:15.000Z', endTime: '2024-04-01T20:05:22.000Z' },
  { task: 'Task C', startTime: '2024-04-01T20:05:25.000Z', endTime: '2024-04-01T20:05:32.000Z' },
  { task: 'Task D', startTime: '2024-04-01T20:05:00.000Z', endTime: '2024-04-01T20:05:30.000Z' },
  { task: 'Task E', startTime: '2024-04-01T20:05:03.000Z', endTime: '2024-04-01T20:05:07.000Z' },
  { task: 'Task E', startTime: '2024-04-01T20:05:13.000Z', endTime: '2024-04-01T20:05:17.000Z' },
  { task: 'Task E', startTime: '2024-04-01T20:05:23.000Z', endTime: '2024-04-01T20:05:27.000Z' },
];

const ArchbaseTimelineExample = ({
  withGridline,
  withOnHoverVerticalLine,
  verticalLineStrokeWidth,
  verticalLineStrokeOpacity,
  verticalLineColor,
  tickLabelAngle,
}: ArchbaseTimelineProps) => {
  return (
    <Grid>
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Timeline</Text>
            </Group>
          </Card.Section>
          <ArchbaseTimeline
            data={timelineData}
            height={500}
            scale={0.2}
            decimalPlaces={2}
            tickRate={0.2}
            withGridline={withGridline}
            withOnHoverVerticalLine={withOnHoverVerticalLine}
            verticalLineStrokeWidth={verticalLineStrokeWidth}
            verticalLineStrokeOpacity={verticalLineStrokeOpacity}
            verticalLineColor={verticalLineColor}
            tickLabelAngle={tickLabelAngle}
            formatData={(value) => {
              return {
                startTime: new Date(value.startTime),
                endTime: new Date(value.endTime),
                type: value.task,
              };
            }}
          />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseTimeline> = {
  title: 'Gráficos/Timeline',
  component: ArchbaseTimeline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseTimeline é um componente para visualização de dados temporais em formato de linha do tempo.

## Características
- Visualização de eventos ao longo do tempo
- Suporte a múltiplas categorias/tipos
- Gridlines opcionais
- Linha vertical no hover
- Escala e zoom configuráveis
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseTimeline>;

export const ExemploSimples: Story = {
  name: 'Exemplo Simples',
  args: {},
  render: (args) => <ArchbaseTimelineExample {...args} />,
};

export const ComGrid: Story = {
  name: 'Com Grid',
  args: {
    withGridline: true,
    withOnHoverVerticalLine: true,
    verticalLineStrokeWidth: 2,
    verticalLineColor: 'red',
    tickLabelAngle: -30,
  },
  render: (args) => <ArchbaseTimelineExample {...args} />,
};

export const ComMarcadorArea: Story = {
  name: 'Com Marcador em Área',
  args: {
    withGridline: true,
    withOnHoverVerticalLine: true,
    verticalLineStrokeWidth: 200,
    verticalLineStrokeOpacity: 0.3,
    verticalLineColor: 'green',
    tickLabelAngle: -30,
  },
  render: (args) => <ArchbaseTimelineExample {...args} />,
};
