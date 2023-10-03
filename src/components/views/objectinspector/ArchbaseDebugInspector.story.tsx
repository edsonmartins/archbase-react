import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { pessoasData, pedidosData, produtosData } from '@demo/index';
import { ArchbaseDebugInspector } from './ArchbaseDebugInspector';

const ArchbaseDebugInspectorExample = () => {
  const [debugInspector, setDebugInspector] = useState(true);

  return (
    <ArchbaseDebugInspector
      debugObjectInspectorHotKey="ctrl+shift+D"
      title="Object Inspector"
      icon={'⚛'}
      visible={debugInspector}
      objectsToInspect={[
        { name: 'Pessoa', object: pessoaData },
        { name: 'Pedido', object: pedidoData },
        { name: 'Produto', object: produtoData },
      ]}
      onDebugInspectorChange={() => setDebugInspector(!debugInspector)}
    />
  );
};

export default {
  title: 'Views/Debug Inspector',
  component: ArchbaseDebugInspectorExample,
} as Meta;

const pessoaData = [pessoasData[0]];
const pedidoData = [pedidosData[0]];
const produtoData = [produtosData[0]];

export const Example: StoryObj<typeof ArchbaseDebugInspectorExample> = {
  args: {
    render: () => {
      <ArchbaseDebugInspectorExample />;
    },
  },
};
