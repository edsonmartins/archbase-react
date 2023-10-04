import React from 'react'
import { Box, Card, Grid, Group, ScrollArea, Text } from '@mantine/core'
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../views'
import { useArchbaseDataSource } from '../hooks/useArchbaseDataSource'
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener'
import { DataSourceEvent, DataSourceEventNames } from '../datasource'
import { useArchbaseForceUpdate } from '../hooks'
import { Meta, StoryObj } from '@storybook/react'
import { Pessoa, pessoasData } from '../../demo/index'
import { ArchbaseCheckbox } from './ArchbaseCheckbox'

const ArchbaseCheckboxExample = () => {
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
      <Grid.Col offset={1} span={4}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs" mb="1rem">
            <Group position="apart">
              <Text weight={500}>Checkbox Edit</Text>
            </Group>
          </Card.Section>
          <Box sx={(_theme) => ({ height: 100 })}>
            <ArchbaseCheckbox
              label="Masculino"
              dataSource={dataSource}
              dataField="sexo"
              trueValue={'Masculino'}
              falseValue={'Feminino'}
            />
          </Box>
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


const meta: Meta<typeof ArchbaseCheckbox> = {
  title: 'Editors/Checkbox',
  component: ArchbaseCheckbox,
};

export default meta;
type Story = StoryObj<typeof ArchbaseCheckbox>;

const data = [pessoasData[0]]

export const Primary: Story = {
  name: 'Exemplo básico',
  render: () => <ArchbaseCheckboxExample />,
};