import React from 'react'
import { Card, Grid, Group, Text } from '@mantine/core'
import { Meta, StoryObj } from '@storybook/react'
import { Pessoa } from 'demo'
import { ArchbaseTreeView } from './ArchbaseTreeView'

const ArchbaseTreeViewExample = () => {
  return (
    <Grid>
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>TreeView</Text>
            </Group>
          </Card.Section>
        </Card>
      </Grid.Col>
    </Grid>
  )
}


const meta: Meta<typeof ArchbaseTreeView> = {
  title: 'Listas e tabelas/Treeview',
  component: ArchbaseTreeView,
};

export default meta;
type Story = StoryObj<typeof ArchbaseTreeView>;


export const Primary: Story = {
  name: 'Exemplo simples',
  render: () => <ArchbaseTreeViewExample />,
};