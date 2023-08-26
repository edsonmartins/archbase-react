import React from 'react';
import { Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views';
import { pedidosData, Pedido, produtosData } from '@demo/index';
import { useArchbaseDataSource } from '../hooks/useArchbaseDataSource';
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener';
import { ArchbaseDataSource, DataSourceEvent, DataSourceEventNames } from '../datasource';
import { useArchbaseForceUpdate } from '../hooks';
import { Meta, StoryObj } from '@storybook/react';
import { ArchbaseChipGroup } from './ArchbaseChipGroup';
import { Produto } from '@demo/data/types';

const pedido: Pedido[] = [pedidosData[0]];
const produtos: Produto[] = produtosData;

const getProdutosFromIds = (produtoIds: string[] | string) => {
  if (produtoIds === null) {
    return [];
  }

  return produtos
    .filter((produto) => produtoIds.includes(produto.id.toString()))
    .map((produto) => ({
      produto: produto,
      quantidade: 1,
      total: produto.preco,
    }));
};

const getIdFromProduto = (produto: any) => {
  return produto.produto.id;
};

const getValueFromProduto = (produto: any) => {
  return produto.id;
};

const getLabelFromProduto = (produto: any) => {
  return produto.descricao;
};

const updateTotalValue = (dataSource: ArchbaseDataSource<Pedido, string>, produtos: any) => {
  const total = produtos.reduce((acumulado, produto) => {
    return acumulado + produto.total;
  }, 0);
  dataSource?.setFieldValue('vlTotal', total);
};

const ArchbaseChipGroupExample = () => {
  const forceUpdate = useArchbaseForceUpdate();
  const { dataSource } = useArchbaseDataSource<Pedido, string>({
    initialData: pedido,
    name: 'dsPedidos',
  });
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
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Chip Group Component</Text>
            </Group>
          </Card.Section>
          <ArchbaseChipGroup<Pedido, string, Produto>
            initialOptions={produtos}
            dataSource={dataSource}
            dataField="itens"
            convertFromValue={getProdutosFromIds}
            getOptionLabel={getLabelFromProduto}
            getOptionValue={getValueFromProduto}
            convertToValue={getIdFromProduto}
            onSelectValue={() => updateTotalValue(dataSource!, dataSource?.getFieldValue('itens'))}
            multiple={true}
          />
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Objeto Pessoa</Text>
            </Group>
          </Card.Section>
          <ScrollArea sx={(_theme) => ({ height: 500 })}>
            <ArchbaseJsonView data={dataSource?.getCurrentRecord()!} />
          </ScrollArea>
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>DataSource dsPessoas</Text>
            </Group>
          </Card.Section>
          <ScrollArea sx={(_theme) => ({ height: 500 })}>
            <ArchbaseObjectInspector data={dataSource} />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  );
};

export default {
  title: 'Editors/Chip Group',
  component: ArchbaseChipGroupExample,
} as Meta;

export const Example: StoryObj<typeof ArchbaseChipGroupExample> = {
  args: {
    render: () => {
      <ArchbaseChipGroupExample />;
    },
  },
};
