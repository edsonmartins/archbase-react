import React from 'react'
import { Box, Card, Flex, Grid, Group, ScrollArea, Text } from '@mantine/core'
import { Meta, StoryObj } from '@storybook/react'

import { ArchbaseJsonView, ArchbaseObjectInspector } from '../debug'
import { useArchbaseDataSource } from '../hooks/useArchbaseDataSource'
import { useArchbaseDataSourceListener } from '../hooks/useArchbaseDataSourceListener'
import { DataSourceEvent, DataSourceEventNames } from '../datasource'
import { useArchbaseForceUpdate, useArchbaseRemoteServiceApi } from '../hooks'
import { pedidosData, Pedido, Pessoa } from '../../demo/index'
import { ArchbaseEdit } from './ArchbaseEdit'
import { ArchbaseNotifications } from '../notification'
import { FakePessoaService } from '../../demo/service/FakePessoaService'
import { API_TYPE } from '../../demo/ioc/DemoIOCTypes'
import { processErrorMessage } from '../core/exceptions'
import { ArchbaseLookupNumber } from './ArchbaseLookupNumber'

const pedidosList: Pedido[] = pedidosData

const ArchbaseLookupNumberExample = () => {
  const forceUpdate = useArchbaseForceUpdate()
  const pessoaApi = useArchbaseRemoteServiceApi<FakePessoaService>(API_TYPE.Pessoa)
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

  const lookupValueDelegator = (value: any): Promise<Pessoa> => {
    return new Promise<Pessoa>(async (resolve, reject) => {
      try {
        const result: Pessoa = await pessoaApi.findOne(parseInt(value))
        resolve(result)
      } catch (error) {
        reject(processErrorMessage(error))
      }
    })
  }

  const handlLookupError = (error: string): void => {
    ArchbaseNotifications.showError(error, 'Atenção')
  }

  const handleLookupResult = (_value: Pessoa): void => {
    //
  }

  const handleActionSearchExecute = (): void => {
    ArchbaseNotifications.showError('Clicou ação localizar.', 'Atenção')
  }

  return (
    <Grid>
      <Grid.Col span={12}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Lookup Number Component</Text>
            </Group>
          </Card.Section>
          <Box sx={(_theme) => ({ height: 100 })}>
            <Flex justify="flex-start" align="center" direction="row" wrap="nowrap" gap="xs">
              <ArchbaseLookupNumber<Pedido, string, Pessoa>
                label="Código"
                dataSource={dataSource}
                dataField="cliente"
                lookupField="cliente.id"
                lookupValueDelegator={lookupValueDelegator}
                onLookupError={handlLookupError}
                onLookupResult={handleLookupResult}
                onActionSearchExecute={handleActionSearchExecute}
                validateOnExit={true}
                required={true}
                validateMessage="Pessoa {0} não encontrada."
                width={150}
              />
              <ArchbaseEdit label="Nome" dataSource={dataSource} dataField="cliente.nome" disabled width={500} />
            </Flex>
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Card.Section withBorder inheritPadding py="xs">
            <Group position="apart">
              <Text weight={500}>Objeto Pedido</Text>
            </Group>
          </Card.Section>
          <ScrollArea sx={(_theme) => ({ height: 500 })}>
            <ArchbaseJsonView data={dataSource?.getCurrentRecord()!} />
          </ScrollArea>
        </Card>
      </Grid.Col>
      <Grid.Col span={6}>
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

const meta: Meta<typeof ArchbaseLookupNumber> = {
  title: 'Editores/Lookup Number',
  component: ArchbaseLookupNumber,
}

export default meta
type Story = StoryObj<typeof ArchbaseLookupNumber>

export const Primary: Story = {
  name: 'Exemplo simples',
  render: () => <ArchbaseLookupNumberExample />,
}
