import React, { useState } from 'react'
import { Box, Card, Grid, Group, Text } from '@mantine/core'
import { Meta, StoryObj } from '@storybook/react'
import { DateValue } from '@mantine/dates'
import { formatISO } from 'date-fns'

import { Pessoa, pessoasData } from '../../demo/index'
import { useArchbaseDataSource } from '../hooks'
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener'
import { DataSourceEvent, DataSourceEventNames } from '../datasource'
import { useArchbaseForceUpdate } from '../hooks'
import { ArchbaseDateTimePickerRange } from './ArchbaseDateTimePickerRange'

const ArchbaseDateTimePickerRangeExample = () => {
  const forceUpdate = useArchbaseForceUpdate()
  const [selectedRange, setSelectedRange] = useState<DateValue[]>()
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
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>DateTime Picker Range Component</Text>
            </Group>
          </Card.Section>
          <Box sx={(_theme) => ({ height: 500 })}>
            <ArchbaseDateTimePickerRange onSelectDateRange={setSelectedRange} label="Informe o período" />
            <Text size="1rem">
              {selectedRange && formatISO(selectedRange[0]!) + ' -> ' + formatISO(selectedRange[1]!)}
            </Text>
          </Box>
        </Card>
      </Grid.Col>
    </Grid>
  )
}

const data = [pessoasData[0]]

const meta: Meta<typeof ArchbaseDateTimePickerRange> = {
  title: 'Editors/DateTimePicker Range',
  component: ArchbaseDateTimePickerRange,
}

export default meta
type Story = StoryObj<typeof ArchbaseDateTimePickerRange>

export const Primary: Story = {
  name: 'Exemplo simples',
  render: () => <ArchbaseDateTimePickerRangeExample />,
}
