import React from 'react';
import { Box, Card, Grid, Group, Text } from '@mantine/core';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views';
import { Pessoa, pessoas } from '../core';
import { useArchbaseDataSource } from '@hooks/useArchbaseDataSource';
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener';
import { DataSourceEvent, DataSourceEventNames } from '../datasource';
import { useArchbaseForceUpdate } from '../hooks/';
import { Meta, StoryObj } from '@storybook/react';
import { ArchbaseAsyncSelect } from './ArchbaseAsyncSelect';
import { pessoasData } from '@components/core/data/pessoasData';

const pessoasList: Pessoa[] = pessoasData;

const ArchbaseAsyncSelectExample = () => {
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
              <Text weight={500}>AsyncSelect Component</Text>
            </Group>
          </Card.Section>
          <Box sx={(_theme) => ({height:500})}>
            <ArchbaseAsyncSelect<Pessoa, string>
              label="Nome"
              dataSource={dataSource}
              dataField="nome"
              initialOptions={pessoasList}
              getOptionLabel={(option: Pessoa) => option.nome}
              getOptionValue={(option: Pessoa) => option.id}
            />
          </Box>
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
  title: 'Editors/AsyncSelect',
  component: ArchbaseAsyncSelectExample,
} as Meta;

const data = [pessoas[0]];

export const Example: StoryObj<typeof ArchbaseAsyncSelectExample> = {
  args: {
    render: () => {
      <ArchbaseAsyncSelectExample />;
    },
  },
};
