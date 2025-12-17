import type { Meta, StoryObj } from '@storybook/react';
import { Box, Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseTimeEdit } from './ArchbaseTimeEdit';

// Tipo de dados para o exemplo
interface IntervaloHoras {
  id: number;
  horaInicio: string;
  horaFim: string;
}

// Dados de exemplo
const intervaloData: IntervaloHoras[] = [
  { id: 1, horaInicio: '08:00', horaFim: '18:00' },
];

const ArchbaseTimeEditExample = () => {
  const { dataSource, isBrowsing, isEmpty, edit } = useArchbaseDataSourceV2<IntervaloHoras>({
    initialData: intervaloData,
    name: 'dsIntervalos',
  });

  useEffect(() => {
    if (isBrowsing && !isEmpty) {
      edit();
    }
  }, [isBrowsing, isEmpty, edit]);

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Time Edit Component</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 120 }}>
            <ArchbaseTimeEdit label="Hora Início" dataSource={dataSource} dataField="horaInicio" />
            <ArchbaseTimeEdit label="Hora Fim" dataSource={dataSource} dataField="horaFim" />
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>DataSource dsIntervalos</Text>
            </Group>
          </Card.Section>
          <ScrollArea style={{ height: 500 }}>
            <ArchbaseObjectInspector data={dataSource} />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const ArchbaseTimeEditControlledExample = () => {
  const [time, setTime] = useState('09:30');

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Time Edit Controlado</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 100 }}>
            <ArchbaseTimeEdit
              label="Horário"
              value={time}
              onChangeValue={(value) => setTime(value)}
            />
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Valor</Text>
            </Group>
          </Card.Section>
          <Text p="md">{time}</Text>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseTimeEdit> = {
  title: 'Editores/TimeEdit',
  component: ArchbaseTimeEdit,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseTimeEdit é um componente de edição de hora com suporte a DataSource.

## Características
- Integração com DataSource
- Seletor de hora
- Formato HH:mm
- Modo controlado e não-controlado
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseTimeEdit>;

export const ComDataSource: Story = {
  name: 'Com DataSource',
  render: () => <ArchbaseTimeEditExample />,
};

export const Controlado: Story = {
  name: 'Controlado (sem DataSource)',
  render: () => <ArchbaseTimeEditControlledExample />,
};
