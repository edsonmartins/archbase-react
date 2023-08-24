import React from 'react';
import { Card, Grid, Group, Text } from '@mantine/core';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views';
import { Pessoa, pessoasData } from '@demo/index';
import { useArchbaseDataSource } from '../hooks/useArchbaseDataSource';
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener';
import { DataSourceEvent, DataSourceEventNames } from '../datasource';
import { useArchbaseForceUpdate } from '../hooks';
import { Meta, StoryObj } from '@storybook/react';
import { ArchbasePasswordEdit } from './ArchbasePasswordEdit';

const ArchbasePasswordEditExample = () => {
  const forceUpdate = useArchbaseForceUpdate();
  const { dataSource } = useArchbaseDataSource<Pessoa, string>({ initialData: data, name: 'dsPessoas' });
  if (dataSource?.isBrowsing() && !dataSource?.isEmpty()) {
    dataSource.edit();
  }
  useArchbaseDataSourceListener<Pessoa, string>({
    dataSource,
    listener: (event: DataSourceEvent<Pessoa>): void => {
      switch (event.type) {
        case DataSourceEventNames.fieldChanged: {
          forceUpdate();
          break;
        }
        default:
      }
    },
  });

  return (
    <Grid>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>PasswordEdit Component</Text>
            </Group>
          </Card.Section>
          <ArchbasePasswordEdit label="Senha" dataSource={dataSource} dataField="senha" />
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Objeto Pessoa</Text>
            </Group>
          </Card.Section>
          <ArchbaseJsonView data={data} />
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
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
  title: 'Editors/Password Edit',
  component: ArchbasePasswordEditExample,
} as Meta;

const data = [pessoasData[0]];

export const Example: StoryObj<typeof ArchbasePasswordEditExample> = {
  args: {
    render: () => {
      <ArchbasePasswordEditExample />;
    },
  },
};
