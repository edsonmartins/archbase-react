import React from 'react'
import { Card, Grid, Group, Text } from '@mantine/core'
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views'
import { useArchbaseDataSource } from '../hooks/useArchbaseDataSource'
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener'
import { DataSourceEvent, DataSourceEventNames } from '../datasource'
import { useArchbaseForceUpdate } from '../hooks'
import { Meta, StoryObj } from '@storybook/react'
import { ArchbaseMaskEdit, MaskPattern } from './ArchbaseMaskEdit'
import { Pessoa, pessoasData } from '../../demo/index'

const ArchbaseEditExample = () => {
  const forceUpdate = useArchbaseForceUpdate()
  const { dataSource } = useArchbaseDataSource<Pessoa, string>({
    initialData: data,
    name: 'dsPessoas'
  })
  if (dataSource?.isBrowsing() && !dataSource?.isEmpty()) {
    dataSource.edit()
  }
  useArchbaseDataSourceListener<Pessoa, string>({
    dataSource,
    listener: (event: DataSourceEvent<Pessoa>): void => {
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
      <Grid.Col span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Mask Edit Component</Text>
            </Group>
          </Card.Section>
          <ArchbaseMaskEdit
            label="CPF"
            dataSource={dataSource}
            dataField="cpf"
            mask={MaskPattern.CPF}
          />
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
  )
}

export default {
  title: 'Editors/Mask Edit',
  component: ArchbaseEditExample
} as Meta

const data = [pessoasData[0]]

export const Example: StoryObj<typeof ArchbaseEditExample> = {
  args: {
    render: () => {
      ;<ArchbaseEditExample />
    }
  }
}
