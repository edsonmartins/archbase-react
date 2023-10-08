import React from 'react'
import { Card, Grid, Group, Text } from '@mantine/core'
import { Meta, StoryObj } from '@storybook/react'

import { ArchbaseJsonView, ArchbaseObjectInspector } from '../debug'
import { pedidosData, Pedido } from '../../demo/index'
import { useArchbaseDataSource } from '../hooks/useArchbaseDataSource'
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener'
import { DataSourceEvent, DataSourceEventNames } from '../datasource'
import { useArchbaseForceUpdate } from '../hooks'
import { ArchbaseRadioGroup } from './ArchbaseRadioGroup'
import { PedidoStatus } from '../../demo/data/types'

const pedido: Pedido[] = [pedidosData[0]]

const enumToOptionsArray = (enumObject, reverse = false) => {
  const bothDirectionsArray = Object.keys(enumObject).map((key) => ({
    label: enumObject[key],
    value: key,
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
      <Grid.Col offset={1} span={4}>
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
  )
}

const meta: Meta<typeof ArchbaseRadioGroup> = {
  title: 'Editores/RadioGroup',
  component: ArchbaseRadioGroup,
}

export default meta
type Story = StoryObj<typeof ArchbaseRadioGroup>

export const Primary: Story = {
  name: 'Exemplo simples',
  render: () => <ArchbaseRadioGroupExample />,
}
