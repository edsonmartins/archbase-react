import React from 'react';
import { Box, Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views';
import { useArchbaseDataSource } from '@hooks/useArchbaseDataSource';
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener';
import { DataSourceEvent, DataSourceEventNames } from '../datasource';
import { useArchbaseForceUpdate } from '../hooks';
import { Meta, StoryObj } from '@storybook/react';
import { ArchbaseAsyncSelect, OptionsResult } from './ArchbaseAsyncSelect';
import { pedidosData, Pedido, Pessoa } from '@demo/index';
import { useArchbaseServiceApi } from '@components/hooks';
import { API_TYPE } from '@demo/ioc/DemoIOCTypes';
import { FakePessoaService } from 'demo/service/FakePessoaService';
import { Page } from '@components/service';
import { processErrorMessage } from '@components/core/exceptions';

const pedidosList: Pedido[] = pedidosData;
const PAGE_SIZE = 10;

const ArchbaseAsyncSelectExample = () => {
  const forceUpdate = useArchbaseForceUpdate();
  const pessoaApi = useArchbaseServiceApi<FakePessoaService>(API_TYPE.Pessoa)
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

  const loadRemotePessoas = async (page, value): Promise<OptionsResult<Pessoa>> => {
    return new Promise<OptionsResult<Pessoa>>(async (resolve, reject) => {
      try {
      const result : Page<Pessoa> = await pessoaApi.findAllWithFilter(value,page,PAGE_SIZE)
      resolve({options: result.content, page: result.pageable.pageNumber, totalPages: result.totalPages});
      } catch (error) {
        reject(processErrorMessage(error));
      }
    });
  }

  return (
    <Grid>
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>AsyncSelect Component</Text>
            </Group>
          </Card.Section>
          <Box sx={(_theme) => ({height:100})}>
            <ArchbaseAsyncSelect<Pedido, string, Pessoa>
              label="Nome"
              dataSource={dataSource}
              dataField="cliente"
              getOptionLabel={(option: Pessoa) => option && option.nome}
              getOptionValue={(option: Pessoa) => option}
              getOptions={loadRemotePessoas}
            />
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Objeto Pedido</Text>
            </Group>
          </Card.Section>
          <ScrollArea sx={(_theme) => ({height:500})}>
            <ArchbaseJsonView data={dataSource?.getCurrentRecord()!} />
          </ScrollArea>
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>DataSource dsPedidos</Text>
            </Group>
          </Card.Section>
          <ScrollArea sx={(_theme) => ({height:500})}>
            <ArchbaseObjectInspector data={dataSource} />
          </ScrollArea>
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
