import type { Meta, StoryObj } from '@storybook/react';
import { Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseTextArea } from './ArchbaseTextArea';

// Tipo de dados para o exemplo
interface Pessoa {
  id: number;
  nome: string;
  email: string;
  observacao: string;
}

// Dados de exemplo
const pessoasData: Pessoa[] = [
  { id: 1, nome: 'João Silva', email: 'joao@email.com', observacao: 'Observação inicial...' },
];

const ArchbaseTextAreaExample = () => {
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
              <Text fw={500}>TextArea Component</Text>
            </Group>
          </Card.Section>
          <ArchbaseTextArea
            label="Observação"
            dataSource={dataSource}
            dataField="observacao"
            autosize={true}
            minRows={2}
            maxRows={4}
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

const ArchbaseTextAreaControlledExample = () => {
  const [text, setText] = useState('');

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>TextArea Controlado</Text>
            </Group>
          </Card.Section>
          <ArchbaseTextArea
            label="Descrição"
            value={text}
            onChangeValue={(value) => setText(value)}
            autosize={true}
            minRows={3}
            maxRows={6}
            placeholder="Digite uma descrição..."
          />
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Valor</Text>
            </Group>
          </Card.Section>
          <Text p="md" size="sm" style={{ whiteSpace: 'pre-wrap' }}>
            {text || '(vazio)'}
          </Text>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseTextArea> = {
  title: 'Editores/Textarea',
  component: ArchbaseTextArea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseTextArea é um componente de área de texto multilinhas com suporte a DataSource.

## Características
- Integração com DataSource
- Autosize (ajuste automático de altura)
- Linhas mínimas e máximas configuráveis
- Modo controlado e não-controlado
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseTextArea>;

export const ComDataSource: Story = {
  name: 'Com DataSource',
  render: () => <ArchbaseTextAreaExample />,
};

export const Controlado: Story = {
  name: 'Controlado (sem DataSource)',
  render: () => <ArchbaseTextAreaControlledExample />,
};
