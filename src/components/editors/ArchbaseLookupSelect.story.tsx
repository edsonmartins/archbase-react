import React from 'react'
import { Box, Card, Flex, Grid, Group, ScrollArea, Text } from '@mantine/core'
import { Meta, StoryObj } from '@storybook/react'

import { ArchbaseJsonView, ArchbaseObjectInspector } from '../debug'
import { useArchbaseDataSource } from '../hooks/useArchbaseDataSource'
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener'
import { DataSourceEvent, DataSourceEventNames } from '../datasource'
import { useArchbaseForceUpdate } from '../hooks'
import { pedidosData, Pedido, Pessoa, pessoasData } from '../../demo/index'
import { ArchbaseEdit } from './ArchbaseEdit'
import { ArchbaseLookupSelect } from './ArchbaseLookupSelect'

const pedidosList: Pedido[] = pedidosData

const ArchbaseLookupSelectExample = () => {
  const forceUpdate = useArchbaseForceUpdate()
  const { dataSource: dsPessoas } = useArchbaseDataSource<Pessoa, string>({
    initialData: pessoasData,
    name: 'dsPessoas',
  })
  const { dataSource } = useArchbaseDataSource<Pedido, string>({
    initialData: pedidosList,
    name: 'dsPedidos',
  })
  if (dataSource?.isBrowsing() && !dataSource?.isEmpty()) {
    dataSource.edit()
  }
  useArchbaseDataSourceListener<Pedido, string>({
    dataSource,
    listener: (event: DataSourceEvent<Pedido>): void => {
      switch (event.type) {
        case DataSourceEventNames.fieldChanged: {
          forceUpdate()
          break
        }
        default:
      }
    },
  })

  return (
    <Grid>
      <Grid.Col offset={1} span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Lookup Edit Component</Text>
            </Group>
          </Card.Section>
          <Box sx={(_theme) => ({ height: 100 })}>
            <Flex justify="flex-start" align="center" direction="row" wrap="nowrap" gap="xs">
              <ArchbaseLookupSelect<Pedido, string, Pessoa>
                label="Código"
                dataSource={dataSource}
                dataField="cliente"
                lookupDataSource={dsPessoas}
                lookupDataFieldText="nome"
                lookupDataFieldId="id"
                required={true}
                width={150}
                getOptionLabel={(option: Pessoa) => option.nome}
                getOptionValue={(option: Pessoa) => option}
              />
              <ArchbaseEdit label="Nome" dataSource={dataSource} dataField="cliente.nome" disabled width={500} />
            </Flex>
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>DataSource dsPedidos</Text>
            </Group>
          </Card.Section>
          <ScrollArea sx={(_theme) => ({ height: 500 })}>
            <ArchbaseObjectInspector data={dataSource} />
          </ScrollArea>
        </Card>
      </Grid.Col>
    </Grid>
  )
}

const meta: Meta<typeof ArchbaseLookupSelect> = {
  title: 'Editores/Lookup Select',
  component: ArchbaseLookupSelect,
}

export default meta
type Story = StoryObj<typeof ArchbaseLookupSelect>

export const Primary: Story = {
  name: 'Exemplo simples',
  render: () => <ArchbaseLookupSelectExample />,
}
