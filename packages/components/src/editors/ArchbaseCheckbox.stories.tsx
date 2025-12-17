import type { Meta, StoryObj } from '@storybook/react';
import { Box, Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseCheckbox } from './ArchbaseCheckbox';

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

const ArchbaseCheckboxExample = () => {
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
              <Text fw={500}>Checkbox Edit</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 100 }}>
            <ArchbaseCheckbox
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

const ArchbaseCheckboxBooleanExample = () => {
  const { dataSource, isBrowsing, isEmpty, edit } = useArchbaseDataSourceV2<Pessoa>({
    initialData: pessoasData,
    name: 'dsPessoasBoolean',
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
              <Text fw={500}>Checkbox Boolean</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 100 }}>
            <ArchbaseCheckbox
              label="Ativo"
              dataSource={dataSource}
              dataField="ativo"
              trueValue={true}
              falseValue={false}
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

const ArchbaseCheckboxControlledExample = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="1rem">
            <Group justify="space-between">
              <Text fw={500}>Checkbox Controlado</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 100 }}>
            <ArchbaseCheckbox
              label="Aceito os termos"
              isChecked={checked}
              onChangeValue={(value, event) => setChecked(value)}
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

const meta: Meta<typeof ArchbaseCheckbox> = {
  title: 'Editores/Checkbox',
  component: ArchbaseCheckbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseCheckbox é um componente de checkbox com suporte a DataSource.

## Características
- Integração com DataSource
- Suporte a valores customizados (trueValue/falseValue)
- Suporte a valores booleanos
- Modo controlado e não-controlado
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseCheckbox>;

export const ComDataSourceString: Story = {
  name: 'Com DataSource (String)',
  render: () => <ArchbaseCheckboxExample />,
};

export const ComDataSourceBoolean: Story = {
  name: 'Com DataSource (Boolean)',
  render: () => <ArchbaseCheckboxBooleanExample />,
};

export const Controlado: Story = {
  name: 'Controlado (sem DataSource)',
  render: () => <ArchbaseCheckboxControlledExample />,
};
