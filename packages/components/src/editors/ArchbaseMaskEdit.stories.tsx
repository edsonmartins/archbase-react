import type { Meta, StoryObj } from '@storybook/react';
import { Button, Card, Grid, Group, Text } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseMaskEdit, MaskPattern } from './ArchbaseMaskEdit';
import { ArchbaseNotifications } from '../notification';

// Tipo de dados para o exemplo
interface Pessoa {
  id: number;
  nome: string;
  cpf: string;
  cnpj: string;
  telefone: string;
  cep: string;
}

// Dados de exemplo
const pessoasData: Pessoa[] = [
  { id: 1, nome: 'João Silva', cpf: '', cnpj: '', telefone: '', cep: '' },
];

const ArchbaseMaskEditExample = () => {
  const [withError, setWithError] = useState(false);
  const { dataSource, isBrowsing, isEmpty, edit, save } = useArchbaseDataSourceV2<Pessoa>({
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
              <Text fw={500}>Mask Edit Component (CPF)</Text>
            </Group>
          </Card.Section>
          <ArchbaseMaskEdit
            title="CPF"
            dataSource={dataSource}
            dataField="cpf"
            mask={MaskPattern.CPF}
            onChangeError={(error) => setWithError(!!error)}
          />
          <Button
            mt="md"
            onClick={() => {
              if (withError) {
                ArchbaseNotifications.showError('Corrija os erros antes de salvar', 'Erro');
                return;
              }
              save(() => {
                ArchbaseNotifications.showSuccess('CPF salvo com sucesso', 'Sucesso');
                edit();
              });
            }}
          >
            Salvar
          </Button>
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>DataSource dsPessoas</Text>
            </Group>
          </Card.Section>
          <ArchbaseObjectInspector data={dataSource} />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const ArchbaseMaskEditAllMasksExample = () => {
  const { dataSource, isBrowsing, isEmpty, edit } = useArchbaseDataSourceV2<Pessoa>({
    initialData: pessoasData,
    name: 'dsPessoasMasks',
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
              <Text fw={500}>Várias Máscaras</Text>
            </Group>
          </Card.Section>
          <ArchbaseMaskEdit
            title="CPF"
            dataSource={dataSource}
            dataField="cpf"
            mask={MaskPattern.CPF}
          />
          <ArchbaseMaskEdit
            title="CNPJ"
            dataSource={dataSource}
            dataField="cnpj"
            mask={MaskPattern.CNPJ}
          />
          <ArchbaseMaskEdit
            title="Telefone"
            dataSource={dataSource}
            dataField="telefone"
            mask={MaskPattern.PHONE}
          />
          <ArchbaseMaskEdit
            title="CEP"
            dataSource={dataSource}
            dataField="cep"
            mask={MaskPattern.CEP}
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
          <ArchbaseObjectInspector data={dataSource} />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

const meta: Meta<typeof ArchbaseMaskEdit> = {
  title: 'Editores/Mask Edit',
  component: ArchbaseMaskEdit,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseMaskEdit é um componente de edição com máscara de formatação.

## Máscaras disponíveis
- CPF: 000.000.000-00
- CNPJ: 00.000.000/0000-00
- PHONE: (00) 00000-0000
- CEP: 00000-000
- DATE: 00/00/0000
- TIME: 00:00:00

## Características
- Integração com DataSource
- Validação automática
- Formatação automática
- Máscaras predefinidas e customizadas
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseMaskEdit>;

export const CPF: Story = {
  name: 'Máscara CPF',
  render: () => <ArchbaseMaskEditExample />,
};

export const TodasMascaras: Story = {
  name: 'Todas as Máscaras',
  render: () => <ArchbaseMaskEditAllMasksExample />,
};
