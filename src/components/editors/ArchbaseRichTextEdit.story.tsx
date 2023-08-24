import React from 'react';
import { Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views';
import { Pessoa, pessoasData } from '@demo/index';
import { useArchbaseDataSource } from '../hooks/useArchbaseDataSource';
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener';
import { DataSourceEvent, DataSourceEventNames } from '../datasource';
import { useArchbaseForceUpdate } from '../hooks';
import { Meta, StoryObj } from '@storybook/react';
import { ArchbaseRichTextEdit } from './ArchbaseRichTextEdit';

const ArchbaseRichTextEditExample = () => {
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
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>RichTextEdit Component</Text>
            </Group>
          </Card.Section>
          <ArchbaseRichTextEdit label="Observação" height="300px" dataSource={dataSource} dataField="observacao" />
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Objeto Pessoa</Text>
            </Group>
          </Card.Section>
          <ScrollArea sx={(_theme) => ({ height: 250 })}>
            <ArchbaseJsonView data={data} />
          </ScrollArea>
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>DataSource dsPessoas</Text>
            </Group>
          </Card.Section>
          <ScrollArea sx={(_theme) => ({ height: 250 })}>
            <ArchbaseObjectInspector data={dataSource} />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default {
  title: 'Editors/RichText Edit',
  component: ArchbaseRichTextEditExample,
} as Meta;

const data = [pessoasData[0]];

export const Example: StoryObj<typeof ArchbaseRichTextEditExample> = {
  args: {
    render: () => {
      <ArchbaseRichTextEditExample />;
    },
  },
};
