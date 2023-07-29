import React from 'react';
import { Card, Grid, Group, Text } from '@mantine/core';
import { Pessoa, pessoas } from '@components/core';
import { useArchbaseDataSource, useArchbaseForceUpdate, useArchbaseDataSourceListener } from '@components/hooks';
import { DataSourceEvent, DataSourceEventNames } from '@components/datasource';
import { Meta, StoryObj } from '@storybook/react';
import { ArchbaseList } from './ArchbaseList';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views';
const data = pessoas;
const ArchbaseListExample = () => {
  const forceUpdate = useArchbaseForceUpdate();
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
  return (
    <Grid>
      <Grid.Col span="content">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Lista de Pessoas</Text>
            </Group>
          </Card.Section>
          <ArchbaseList<Pessoa, string> dataSource={dataSource!} dataFieldId="id" dataFieldText="nome" />
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
  component: ArchbaseListExample,
} as Meta;

export const Example: StoryObj<typeof ArchbaseListExample> = {
  args: {
    render: () => {
      <ArchbaseListExample />;
    },
  },
};
