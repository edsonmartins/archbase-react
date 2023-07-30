import React, { useState, useEffect, ReactNode } from 'react';
import { Card, Grid, Group, Text } from '@mantine/core';
import { Pessoa, pessoas } from '@components/core';
import { useArchbaseDataSource, useArchbaseForceUpdate, useArchbaseDataSourceListener } from '@components/hooks';
import { DataSourceEvent, DataSourceEventNames } from '@components/datasource';
import { Meta, StoryObj } from '@storybook/react';
import { ArchbaseList } from './ArchbaseList';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views';
import { ThemeIcon } from '@mantine/core';
import { IconUser } from '@tabler/icons-react';
const data = pessoas;

interface ArchbaseListBasicExampleProps {
  showIcon: boolean;
  showPhoto: boolean;
  justifyContent: 'flex-start' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  spacing: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

const ArchbaseListBasicExample = ({ showIcon, showPhoto, justifyContent, spacing }: ArchbaseListBasicExampleProps) => {
  const forceUpdate = useArchbaseForceUpdate();
  const [icon, setIcon] = useState<ReactNode | undefined>();
  const [photo, setPhoto] = useState<ReactNode | string | undefined>();
  const { dataSource } = useArchbaseDataSource<Pessoa, string>({ initialData: data, name: 'dsPessoas' });

  useArchbaseDataSourceListener<Pessoa, string>({
    dataSource,
    listener: (event: DataSourceEvent<Pessoa>): void => {
      switch (event.type) {
        case DataSourceEventNames.afterScroll: {
          forceUpdate();
          break;
        }
        default:
      }
    },
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

  console.log(icon);
  return (
    <Grid>
      <Grid.Col span="content">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Lista de Pessoas</Text>
            </Group>
          </Card.Section>
          <ArchbaseList<Pessoa, string>
            dataSource={dataSource!}
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
      <Grid.Col span={3}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Objeto Pessoa</Text>
            </Group>
          </Card.Section>
          <ArchbaseJsonView data={dataSource?.getCurrentRecord()!} />
        </Card>
      </Grid.Col>
      <Grid.Col span={3}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>DataSource dsPessoas</Text>
            </Group>
          </Card.Section>
          <ArchbaseObjectInspector data={dataSource} />
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default {
  title: 'List/List',
  component: ArchbaseListBasicExample,
} as Meta;

export const Example: StoryObj<typeof ArchbaseListBasicExample> = {
  render: (args) => {
    return <ArchbaseListBasicExample {...args} />;
  },
  args: {
    showIcon: false,
    showPhoto: false,
    justifyContent: 'flex-start',
    spacing: 'md'
  },
  argTypes: {
    justifyContent: {
      options: ['flex-start', 'center', 'space-between', 'space-around', 'space-evenly'],
      control: { type: 'radio' },
    },
    spacing: {
      options: ['xs' , 'sm' , 'md' , 'lg' , 'xl'],
      control: { type: 'select' },
    },
  },
};
