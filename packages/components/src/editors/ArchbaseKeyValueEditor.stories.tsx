import type { Meta, StoryObj } from '@storybook/react';
import { Box, Card, Grid, Group, ScrollArea, Space, Text, Textarea } from '@mantine/core';
import React, { useState } from 'react';
import { ArchbaseKeyValueEditor } from './ArchbaseKeyValueEditor';

interface ArchbaseKeyValueEditorExampleProps {
  layout?: 'horizontal' | 'vertical';
}

const ArchbaseKeyValueEditorExample = (props: ArchbaseKeyValueEditorExampleProps) => {
  const [value, setValue] = useState('');

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Key Value Editor Component</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 500 }}>
            <ScrollArea h={500} p={20}>
              <ArchbaseKeyValueEditor
                initialValue={value}
                layout={props.layout}
                onChangeKeyValue={(newValue) => setValue(newValue)}
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
            <Textarea minRows={12} value={value} autosize={true} readOnly />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const ArchbaseKeyValueEditorWithInitialValueExample = () => {
  const initialData = 'nome=João\nemail=joao@email.com\nidade=30';
  const [value, setValue] = useState(initialData);

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Key Value Editor com Valor Inicial</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 500 }}>
            <ScrollArea h={500} p={20}>
              <ArchbaseKeyValueEditor
                initialValue={value}
                onChangeKeyValue={(newValue) => setValue(newValue)}
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
            <Textarea minRows={12} value={value} autosize={true} readOnly />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseKeyValueEditor> = {
  title: 'Editores/KeyValueEditor',
  component: ArchbaseKeyValueEditor,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseKeyValueEditor é um componente para edição de pares chave-valor.

## Características
- Layout horizontal ou vertical
- Adição e remoção dinâmica de pares
- Saída em formato texto (chave=valor por linha)
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseKeyValueEditor>;

export const Horizontal: Story = {
  name: 'Layout Horizontal',
  render: () => <ArchbaseKeyValueEditorExample layout="horizontal" />,
};

export const Vertical: Story = {
  name: 'Layout Vertical',
  render: () => <ArchbaseKeyValueEditorExample layout="vertical" />,
};

export const ComValorInicial: Story = {
  name: 'Com Valor Inicial',
  render: () => <ArchbaseKeyValueEditorWithInitialValueExample />,
};
