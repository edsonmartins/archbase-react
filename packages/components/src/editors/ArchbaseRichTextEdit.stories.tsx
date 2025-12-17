import type { Meta, StoryObj } from '@storybook/react';
import { Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseRichTextEdit } from './ArchbaseRichTextEdit';

// Tipo de dados para o exemplo
interface Pessoa {
  id: number;
  nome: string;
  email: string;
  observacao: string;
}

// Dados de exemplo
const pessoasData: Pessoa[] = [
  { id: 1, nome: 'João Silva', email: 'joao@email.com', observacao: '<p>Observação inicial...</p>' },
];

const ArchbaseRichTextEditExample = () => {
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
      <Grid.Col offset={1} span={5}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>RichTextEdit Component</Text>
            </Group>
          </Card.Section>
          <ArchbaseRichTextEdit
            label="Observação"
            height="300px"
            dataSource={dataSource}
            dataField="observacao"
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
          <ScrollArea style={{ height: 300 }}>
            <ArchbaseObjectInspector data={dataSource} />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const ArchbaseRichTextEditControlledExample = () => {
  const [content, setContent] = useState('<p>Texto formatado inicial</p>');

  return (
    <Grid>
      <Grid.Col offset={1} span={5}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>RichTextEdit Controlado</Text>
            </Group>
          </Card.Section>
          <ArchbaseRichTextEdit
            label="Conteúdo"
            height="300px"
            value={content}
            onChangeValue={(value) => setContent(value)}
          />
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>HTML Gerado</Text>
            </Group>
          </Card.Section>
          <ScrollArea style={{ height: 300 }}>
            <Text size="xs" style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }} p="md">
              {content}
            </Text>
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseRichTextEdit> = {
  title: 'Editores/RichText Edit',
  component: ArchbaseRichTextEdit,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseRichTextEdit é um editor de texto rico (WYSIWYG) com suporte a DataSource.

## Características
- Integração com DataSource
- Formatação de texto (negrito, itálico, sublinhado)
- Listas ordenadas e não-ordenadas
- Links e imagens
- Output em HTML
- Modo controlado e não-controlado
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseRichTextEdit>;

export const ComDataSource: Story = {
  name: 'Com DataSource',
  render: () => <ArchbaseRichTextEditExample />,
};

export const Controlado: Story = {
  name: 'Controlado (sem DataSource)',
  render: () => <ArchbaseRichTextEditControlledExample />,
};
