import React from 'react'
import { Card, Grid, Group, ScrollArea, Text } from '@mantine/core'
import { Meta, StoryObj } from '@storybook/react'

import { ArchbaseJsonView, ArchbaseObjectInspector } from '../debug'
import { Pessoa, pessoasData } from '../../demo/index'
import { useArchbaseDataSource } from '../hooks/useArchbaseDataSource'
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener'
import { DataSourceEvent, DataSourceEventNames } from '../datasource'
import { useArchbaseForceUpdate } from '../hooks'
import { ArchbaseRating } from './ArchbaseRating'

const ArchbaseRatingExample = () => {
  const forceUpdate = useArchbaseForceUpdate()
  const { dataSource } = useArchbaseDataSource<Pessoa, string>({
    initialData: data,
    name: 'dsPessoas',
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
    },
  })

  return (
    <Grid>
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Rating Component</Text>
            </Group>
          </Card.Section>
          <ArchbaseRating<Pessoa, string> label="Avaliação" dataSource={dataSource} dataField="avaliacao" count={5} />
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
  )
}

const data = [pessoasData[0]]

const meta: Meta<typeof ArchbaseRating> = {
  title: 'Editores/Rating',
  component: ArchbaseRating,
}

export default meta
type Story = StoryObj<typeof ArchbaseRating>

export const Primary: Story = {
  name: 'Exemplo simples',
  render: () => <ArchbaseRatingExample />,
}
