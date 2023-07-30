import React from 'react';
import { Box, Card, Grid, Group, Text } from '@mantine/core';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views';
import { Pessoa } from '../core';
import { useArchbaseDataSource } from '@hooks/useArchbaseDataSource';
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener';
import { DataSourceEvent, DataSourceEventNames } from '../datasource';
import { useArchbaseForceUpdate } from '../hooks/';
import { Meta, StoryObj } from '@storybook/react';
import { ArchbaseAsyncSelect } from './ArchbaseAsyncSelect';
import { pessoasData, pedidosData, Pedido } from '@components/core';

const pessoasList: Pessoa[] = pessoasData;
const pedidosList: Pedido[] = pedidosData;

const ArchbaseAsyncSelectExample = () => {
  const forceUpdate = useArchbaseForceUpdate();
  const { dataSource } = useArchbaseDataSource<Pedido, string>({ initialData: pedidosList, name: 'dsPedidos' });
  if (dataSource?.isBrowsing() && !dataSource?.isEmpty()) {
    dataSource.edit();
  }
  useArchbaseDataSourceListener<Pedido, string>({
    dataSource,
    listener: (event: DataSourceEvent<Pedido>): void => {
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
            <ArchbaseAsyncSelect<Pedido, string, Pessoa>
              label="Nome"
              dataSource={dataSource}
              dataField="cliente"
              initialOptions={pessoasList}
              getOptionLabel={(option: Pessoa) => option.nome}
              getOptionValue={(option: Pessoa) => option}
            />
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Objeto Pedido</Text>
            </Group>
          </Card.Section>
          <ArchbaseJsonView data={dataSource?.getCurrentRecord()!} />
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>DataSource dsPedidos</Text>
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



export const Example: StoryObj<typeof ArchbaseAsyncSelectExample> = {
  args: {
    render: () => {
      <ArchbaseAsyncSelectExample />;
    },
  },
};
