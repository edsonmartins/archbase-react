import React from 'react'
import { Card, Grid, Group, Text } from '@mantine/core'
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views'
import { pedidosData, Pedido } from '../../demo/index'
import { useArchbaseDataSource } from '../hooks/useArchbaseDataSource'
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener'
import { DataSourceEvent, DataSourceEventNames } from '../datasource'
import { useArchbaseForceUpdate } from '../hooks'
import { Meta, StoryObj } from '@storybook/react'
import { ArchbaseRadioGroup } from './ArchbaseRadioGroup'
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

const ArchbaseRadioGroupExample = () => {
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
              <Text weight={500}>RadioGroup Component</Text>
            </Group>
          </Card.Section>
          <ArchbaseRadioGroup<Pedido, string, PedidoStatus>
            label="Status"
            initialOptions={statusArray}
            dataSource={dataSource}
            dataField="status"
            convertFromString={(selected) => Number(selected)}
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
  title: 'Editors/RadioGroup',
  component: ArchbaseRadioGroupExample
} as Meta

export const Example: StoryObj<typeof ArchbaseRadioGroupExample> = {
  args: {
    render: () => {
      ;<ArchbaseRadioGroupExample />
    }
  }
}
