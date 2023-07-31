import React from 'react';
import { ArchbaseDatePickerEdit } from './ArchbaseDatePickerEdit';
import { Card, Grid, Group, Text } from '@mantine/core';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views';
import { Pessoa, pessoasData } from '@demo/index';
import { useArchbaseDataSource } from '../hooks';
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener';
import { DataSourceEvent, DataSourceEventNames } from '../datasource';
import { Meta, StoryObj } from '@storybook/react';
import { useArchbaseForceUpdate } from '../hooks/';

const ArchbaseDatePickerEditExample = () => {
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
      <Grid.Col span="content">
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Date Picker Component</Text>
            </Group>
          </Card.Section>
          <ArchbaseDatePickerEdit label="Descrição" dataSource={dataSource} dataField="data_nasc" />
        </Card>
      </Grid.Col>
      <Grid.Col span={3}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Objeto Pessoa</Text>
            </Group>
          </Card.Section>
          <ArchbaseJsonView data={data} />
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
  title: 'Editors/DatePicker Edit',
  component: ArchbaseDatePickerEditExample,
} as Meta;

const data = [pessoasData[0]];

export const Example: StoryObj<typeof ArchbaseDatePickerEditExample> = {
  args: {
    render: () => {
      <ArchbaseDatePickerEditExample />;
    },
  },
};
