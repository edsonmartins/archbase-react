import type { Meta, StoryObj } from '@storybook/react';
import { Box, Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseDatePickerEdit } from './ArchbaseDatePickerEdit';

// Tipo de dados para o exemplo
interface Pessoa {
  id: number;
  nome: string;
  email: string;
  data_nasc: Date | null;
}

// Dados de exemplo
const pessoasData: Pessoa[] = [
  { id: 1, nome: 'João Silva', email: 'joao@email.com', data_nasc: new Date('1990-05-15') },
];

const ArchbaseDatePickerEditExample = () => {
  const { dataSource, isBrowsing, isEmpty, edit } = useArchbaseDataSourceV2<Pessoa>({
    initialData: pessoasData,
    name: 'dsPessoas',
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
              <Text fw={500}>Date Picker Component</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 100 }}>
            <ArchbaseDatePickerEdit
              width={200}
              title="Data nascimento"
              dataSource={dataSource}
              defaultValue={new Date()}
              dataField="data_nasc"
            />
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>DataSource dsPessoas</Text>
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

const ArchbaseDatePickerEditControlledExample = () => {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Date Picker Controlado</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 100 }}>
            <ArchbaseDatePickerEdit
              width={200}
              title="Data"
              value={date}
              onSelectDate={(newDate) => setDate(newDate)}
            />
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Valor Selecionado</Text>
            </Group>
          </Card.Section>
          <Box p="md">
            <Text size="sm" fw={500}>Data:</Text>
            <Text size="sm" c="dimmed">{date ? date.toLocaleDateString('pt-BR') : '(vazio)'}</Text>
          </Box>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseDatePickerEdit> = {
  title: 'Editores/DatePicker Edit',
  component: ArchbaseDatePickerEdit,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseDatePickerEdit é um componente de seleção de data com suporte a DataSource.

## Características
- Integração com DataSource
- Calendário interativo
- Formatação de data configurável
- Modo controlado e não-controlado
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseDatePickerEdit>;

export const ComDataSource: Story = {
  name: 'Com DataSource',
  render: () => <ArchbaseDatePickerEditExample />,
};

export const Controlado: Story = {
  name: 'Controlado (sem DataSource)',
  render: () => <ArchbaseDatePickerEditControlledExample />,
};
