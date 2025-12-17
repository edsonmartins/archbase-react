import type { Meta, StoryObj } from '@storybook/react';
import { Avatar, Card, Grid, Group, Text, ThemeIcon } from '@mantine/core';
import { IconUser, IconAt, IconPhoneCall } from '@tabler/icons-react';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useArchbaseDataSourceV2 } from '@archbase/data';
import { ArchbaseObjectInspector } from '../debug';
import { ArchbaseList, ArchbaseListCustomItemProps } from './ArchbaseList';
import { useArchbaseListContext } from '../hooks';

// Tipo de dados para o exemplo
interface Pessoa {
  id: string;
  nome: string;
  email: string;
  celular: string;
  foto: string | null;
}

// Dados de exemplo
const pessoasData: Pessoa[] = [
  { id: '1', nome: 'João Silva', email: 'joao@email.com', celular: '(11) 99999-1111', foto: null },
  { id: '2', nome: 'Maria Santos', email: 'maria@email.com', celular: '(11) 99999-2222', foto: null },
  { id: '3', nome: 'Pedro Oliveira', email: 'pedro@email.com', celular: '(11) 99999-3333', foto: null },
  { id: '4', nome: 'Ana Costa', email: 'ana@email.com', celular: '(11) 99999-4444', foto: null },
  { id: '5', nome: 'Carlos Ferreira', email: 'carlos@email.com', celular: '(11) 99999-5555', foto: null },
  { id: '6', nome: 'Lucia Lima', email: 'lucia@email.com', celular: '(11) 99999-6666', foto: null },
  { id: '7', nome: 'Roberto Souza', email: 'roberto@email.com', celular: '(11) 99999-7777', foto: null },
  { id: '8', nome: 'Fernanda Martins', email: 'fernanda@email.com', celular: '(11) 99999-8888', foto: null },
];

interface ArchbaseListBasicExampleProps {
  showIcon: boolean;
  showPhoto: boolean;
  justifyContent: 'flex-start' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  spacing: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const ArchbaseListBasicExample = ({ showIcon, showPhoto, justifyContent, spacing }: ArchbaseListBasicExampleProps) => {
  const [icon, setIcon] = useState<ReactNode | undefined>();
  const [photo, setPhoto] = useState<ReactNode | string | undefined>();
  const { dataSource } = useArchbaseDataSourceV2<Pessoa>({
    initialData: pessoasData,
    name: 'dsPessoas',
  });

  useEffect(() => {
    if (showIcon) {
      setIcon(
        <ThemeIcon color="blue" size={20} radius="xl">
          <IconUser size="1rem" />
        </ThemeIcon>,
      );
    } else {
      setIcon(undefined);
    }
    if (showPhoto) {
      setPhoto('foto');
    } else {
      setPhoto(undefined);
    }
  }, [showIcon, showPhoto]);

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Lista de Pessoas</Text>
            </Group>
          </Card.Section>
          <ArchbaseList<Pessoa, string>
            dataSource={dataSource}
            dataFieldId="id"
            dataFieldText="nome"
            icon={icon}
            image={photo}
            imageRadius={50}
            imageWidth={24}
            imageHeight={24}
            justify={justifyContent}
            spacing={spacing}
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

type CustomItemProps = ArchbaseListCustomItemProps<Pessoa, string>;

const classes = {
  icon: {
    color: 'light-dark(var(--mantine-color-gray-7), var(--mantine-color-dark-3))',
  },
  name: {
    fontFamily: `Greycliff CF, var(--mantine-font-family)`,
  },
};

const CustomItem = (props: CustomItemProps) => {
  const listContextValue = useArchbaseListContext<Pessoa, string>();
  const itemRef = useRef<any>(null);

  useEffect(() => {
    if (itemRef.current && props.active) {
      itemRef.current.focus();
    }
  }, [props.active]);

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();
    if (!props.disabled) {
      if (listContextValue.handleSelectItem) {
        listContextValue.handleSelectItem(props.index, props.recordData);
      }
    }
  };

  const backgroundColor = props.active ? listContextValue.activeBackgroundColor : '';
  const color = props.active ? listContextValue.activeColor : '';

  return (
    <div onClick={handleClick} style={{ padding: '8px', backgroundColor, color }} ref={itemRef} tabIndex={-1}>
      <Group wrap="nowrap">
        <Avatar src={props.recordData.foto} size={94} radius="md" />
        <div>
          <Text fz="lg" fw={500} style={classes.name}>
            {props.recordData.nome}
          </Text>

          <Group wrap="nowrap" gap={10} mt={3}>
            <IconAt stroke={1.5} size="1rem" style={classes.icon} />
            <Text fz="xs" c="dimmed" style={classes.name}>
              {props.recordData.email}
            </Text>
          </Group>

          <Group wrap="nowrap" gap={10} mt={5}>
            <IconPhoneCall stroke={1.5} size="1rem" style={classes.icon} />
            <Text fz="xs" c="dimmed" style={classes.name}>
              {props.recordData.celular}
            </Text>
          </Group>
        </div>
      </Group>
    </div>
  );
};

const ArchbaseListCustomItemExample = () => {
  const { dataSource } = useArchbaseDataSourceV2<Pessoa>({
    initialData: pessoasData,
    name: 'dsPessoasCustom',
  });

  return (
    <Grid>
      <Grid.Col offset={1} span={7}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group justify="space-between">
              <Text fw={500}>Lista de Pessoas customizada</Text>
            </Group>
          </Card.Section>
          <ArchbaseList<Pessoa, string>
            height={700}
            dataSource={dataSource}
            component={{
              type: CustomItem,
              props: { opcao1: 'teste', opcao2: 'teste' },
            }}
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

const meta: Meta<typeof ArchbaseList> = {
  title: 'Listas e Tabelas/List',
  component: ArchbaseList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
O ArchbaseList é um componente de lista com suporte a DataSource.

## Características
- Integração com DataSource
- Suporte a ícones e imagens
- Item customizável
- Seleção de item com navegação por teclado
- Espaçamento configurável
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ArchbaseList>;

export const ListaSimples: StoryObj<typeof ArchbaseListBasicExample> = {
  name: 'Lista Simples',
  render: (args) => {
    return <ArchbaseListBasicExample {...args} />;
  },
  args: {
    showIcon: false,
    showPhoto: false,
    justifyContent: 'flex-start',
    spacing: 'md',
  },
  argTypes: {
    justifyContent: {
      options: ['flex-start', 'center', 'space-between', 'space-around', 'space-evenly'],
      control: { type: 'radio' },
    },
    spacing: {
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      control: { type: 'select' },
    },
  },
};

export const ItemCustomizado: StoryObj<typeof ArchbaseList> = {
  name: 'Item Customizado',
  render: () => {
    return <ArchbaseListCustomItemExample />;
  },
};
