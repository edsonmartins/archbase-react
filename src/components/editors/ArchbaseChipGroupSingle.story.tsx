import React from 'react'
import { Card, Grid, Group, Text } from '@mantine/core'
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views'
import { pedidosData, Pedido } from '../../demo/index'
import { useArchbaseDataSource } from '../hooks/useArchbaseDataSource'
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener'
import { DataSourceEvent, DataSourceEventNames } from '../datasource'
import { useArchbaseForceUpdate } from '../hooks'
import { Meta, StoryObj } from '@storybook/react'
import { ArchbaseChipGroup } from './ArchbaseChipGroup'
import { PedidoStatus } from '../../demo/data/types'

const pedido: Pedido[] = [pedidosData[0]]

const enumToOptionsArray = (enumObject, reverse = false) => {
  const bothDirectionsArray = Object.keys(enumObject).map((key) => ({
    label: enumObject[key],
    value: key
  }))
  if (reverse) {
    return bothDirectionsArray.slice(bothDirectionsArray.length / 2)
  }

  return bothDirectionsArray.slice(0, bothDirectionsArray.length / 2)
}

const statusArray = enumToOptionsArray(PedidoStatus)

const ArchbaseChipGroupSingleExample = () => {
  const forceUpdate = useArchbaseForceUpdate()
  const { dataSource } = useArchbaseDataSource<Pedido, string>({
    initialData: pedido,
    name: 'dsPedidos'
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
    }
  })

  return (
    <Grid>
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Chip Group Component (multiple = false)</Text>
            </Group>
          </Card.Section>
          <ArchbaseChipGroup<Pedido, string, PedidoStatus>
            initialOptions={statusArray}
            dataSource={dataSource}
            dataField="status"
            convertFromValue={(selected) => Number(selected)}
            multiple={false}
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
          <ArchbaseJsonView data={dataSource?.getCurrentRecord()!} />
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
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
  )
}

export default {
  title: 'Editors/Chip Group/Com um único valor selecionado',
  component: ArchbaseChipGroupSingleExample
} as Meta

export const Example: StoryObj<typeof ArchbaseChipGroupSingleExample> = {
  args: {
    render: () => {
      ;<ArchbaseChipGroupSingleExample />
    }
  }
}
