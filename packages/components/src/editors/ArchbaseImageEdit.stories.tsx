import type { Meta, StoryObj } from '@storybook/react';
import { Box, Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseImageEdit } from './ArchbaseImageEdit';

// Tipo de dados para o exemplo
interface Pessoa {
  id: number;
  nome: string;
  email: string;
  foto: string | null;
}

// Dados de exemplo
const pessoasData: Pessoa[] = [
  { id: 1, nome: 'João Silva', email: 'joao@email.com', foto: null },
];

const ArchbaseImageEditExample = () => {
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
              <Text fw={500}>Image Editor Component</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 400 }}>
            <ArchbaseImageEdit
              dataSource={dataSource}
              dataField="foto"
              width={140}
              height={150}
              label="Foto"
              description="Selecione uma imagem"
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

const ArchbaseImageEditControlledExample = () => {
  const [imageData, setImageData] = useState<string | null>(null);

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Image Editor Controlado</Text>
            </Group>
          </Card.Section>
          <Box style={{ height: 400 }}>
            <ArchbaseImageEdit
              width={140}
              height={150}
              label="Foto"
              description="Selecione uma imagem"
              value={imageData}
              onChangeImage={(value) => setImageData(value)}
            />
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Valor da Imagem</Text>
            </Group>
          </Card.Section>
          <Box p="md">
            <Text size="sm" fw={500}>Tem imagem:</Text>
            <Text size="sm" c="dimmed">{imageData ? 'Sim' : 'Não'}</Text>
            {imageData && (
              <Text size="xs" c="dimmed" mt="xs">
                Tamanho: {(imageData.length / 1024).toFixed(2)} KB (base64)
              </Text>
            )}
          </Box>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseImageEdit> = {
  title: 'Editores/Image Edit',
  component: ArchbaseImageEdit,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseImageEdit é um componente de edição de imagem com suporte a DataSource.

## Características
- Integração com DataSource
- Upload de imagem via drag-and-drop ou seleção
- Preview da imagem
- Redimensionamento configurável
- Modo controlado e não-controlado
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseImageEdit>;

export const ComDataSource: Story = {
  name: 'Com DataSource',
  render: () => <ArchbaseImageEditExample />,
};

export const Controlado: Story = {
  name: 'Controlado (sem DataSource)',
  render: () => <ArchbaseImageEditControlledExample />,
};
