import type { Meta, StoryObj } from '@storybook/react';
import { Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseSwitch } from './ArchbaseSwitch';

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

const ArchbaseSwitchExample = () => {
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
              <Text fw={500}>Switch Component</Text>
            </Group>
          </Card.Section>
          <ArchbaseSwitch
            label="Masculino"
            dataSource={dataSource}
            dataField="sexo"
            trueValue="Masculino"
            falseValue="Feminino"
          />
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

const ArchbaseSwitchBooleanExample = () => {
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
              <Text fw={500}>Switch Boolean</Text>
            </Group>
          </Card.Section>
          <ArchbaseSwitch
            label="Ativo"
            dataSource={dataSource}
            dataField="ativo"
            trueValue={true}
            falseValue={false}
          />
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

const ArchbaseSwitchControlledExample = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="1rem">
            <Group justify="space-between">
              <Text fw={500}>Switch Controlado</Text>
            </Group>
          </Card.Section>
          <ArchbaseSwitch
            label="Ativar recurso"
            isChecked={checked}
            onChangeValue={(value) => setChecked(value)}
          />
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Estado</Text>
            </Group>
          </Card.Section>
          <Text p="md">Checked: {checked ? 'true' : 'false'}</Text>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseSwitch> = {
  title: 'Editores/Switch',
  component: ArchbaseSwitch,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseSwitch é um componente de alternância (toggle) com suporte a DataSource.

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
type Story = StoryObj<typeof ArchbaseSwitch>;

export const ComDataSourceString: Story = {
  name: 'Com DataSource (String)',
  render: () => <ArchbaseSwitchExample />,
};

export const ComDataSourceBoolean: Story = {
  name: 'Com DataSource (Boolean)',
  render: () => <ArchbaseSwitchBooleanExample />,
};

export const Controlado: Story = {
  name: 'Controlado (sem DataSource)',
  render: () => <ArchbaseSwitchControlledExample />,
};
