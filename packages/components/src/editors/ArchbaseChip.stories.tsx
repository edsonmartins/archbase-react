import type { Meta, StoryObj } from '@storybook/react';
import { Box, Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseChip } from './ArchbaseChip';

// Tipo de dados para o exemplo
interface Pessoa {
  id: number;
  nome: string;
  email: string;
  sexo: string;
  ativo: boolean;
}

// Dados de exemplo
const pessoasData: Pessoa[] = [
  { id: 1, nome: 'João Silva', email: 'joao@email.com', sexo: 'Masculino', ativo: true },
];

const ArchbaseChipExample = () => {
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
          <Card.Section withBorder inheritPadding py="xs" mb="1rem">
            <Group justify="space-between">
              <Text fw={500}>Chip Component</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 100 }}>
            <ArchbaseChip
              label="Masculino"
              dataSource={dataSource}
              dataField="sexo"
              trueValue={'Masculino'}
              falseValue={'Feminino'}
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

const ArchbaseChipControlledExample = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="1rem">
            <Group justify="space-between">
              <Text fw={500}>Chip Controlado</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 100 }}>
            <ArchbaseChip
              label="Selecionado"
              isChecked={checked}
              onChangeValue={(value) => setChecked(value)}
            />
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Estado</Text>
            </Group>
          </Card.Section>
          <Box p="md">
            <Text>Checked: {checked ? 'true' : 'false'}</Text>
          </Box>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseChip> = {
  title: 'Editores/Chip',
  component: ArchbaseChip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseChip é um componente de chip selecionável com suporte a DataSource.

## Características
- Integração com DataSource
- Suporte a valores customizados (trueValue/falseValue)
- Modo controlado e não-controlado
- Visual de chip/tag selecionável
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseChip>;

export const ComDataSource: Story = {
  name: 'Com DataSource',
  render: () => <ArchbaseChipExample />,
};

export const Controlado: Story = {
  name: 'Controlado (sem DataSource)',
  render: () => <ArchbaseChipControlledExample />,
};
