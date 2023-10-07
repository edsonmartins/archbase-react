import { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'

import { pessoasData, pedidosData, produtosData } from '../../../demo'
import { ArchbaseDebugInspector } from './ArchbaseDebugInspector'

const pessoaData = [pessoasData[0]]
const pedidoData = [pedidosData[0]]
const produtoData = [produtosData[0]]

const ArchbaseDebugInspectorExample = () => {
  const [debugInspector, setDebugInspector] = useState(true)

  return (
    <ArchbaseDebugInspector
      debugObjectInspectorHotKey="ctrl+shift+D"
      title="Object Inspector"
      icon="⚛"
      visible={debugInspector}
      objectsToInspect={[
        { name: 'Pessoa', object: pessoaData },
        { name: 'Pedido', object: pedidoData },
        { name: 'Produto', object: produtoData },
      ]}
      onDebugInspectorChange={() => setDebugInspector(!debugInspector)}
    />
  )
}

const meta: Meta<typeof ArchbaseDebugInspector> = {
  title: 'Views/Debug Inspector',
  component: ArchbaseDebugInspector,
}

export default meta
type Story = StoryObj<typeof ArchbaseDebugInspector>

export const Primary: Story = {
  name: 'Exemplo simples',
  render: () => <ArchbaseDebugInspectorExample />,
}
