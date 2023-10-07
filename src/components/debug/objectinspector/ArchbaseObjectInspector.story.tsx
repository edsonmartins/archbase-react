import { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { pessoasData, pedidosData, produtosData } from '@demo/index'

import { ArchbaseDebugInspector } from './ArchbaseDebugInspector'

const ArchbaseDebugInspectorExample = () => {
  return (
    <ArchbaseDebugInspector
      debugObjectInspectorHotKey="ctrl+shift+D"
      title="Object Inspector"
      icon="⚛"
      visible={true}
      objectsToInspect={[
        { name: 'Pessoa', object: pessoaData },
        { name: 'Pedido', object: pedidoData },
        { name: 'Produto', object: produtoData },
      ]}
    />
  )
}

const pessoaData = [pessoasData[0]]
const pedidoData = [pedidosData[0]]
const produtoData = [produtosData[0]]

const meta: Meta<typeof ArchbaseDebugInspector> = {
  title: 'Depuração/Debug Inspector',
  component: ArchbaseDebugInspector,
}

export default meta
type Story = StoryObj<typeof ArchbaseDebugInspector>

export const Primary: Story = {
  name: 'Exemplo simples',
  render: () => <ArchbaseDebugInspectorExample />,
}
