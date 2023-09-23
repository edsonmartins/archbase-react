import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { pessoasData, pedidosData, produtosData } from '@demo/index';
import { ArchbaseDebugInspector } from './ArchbaseDebugInspector';

const ArchbaseDebugInspectorExample = () => {
  return (
    <ArchbaseDebugInspector
      debugObjectInspectorHotKey="ctrl+shift+D"
      title="Object Inspector"
      icon={'⚛'}
      visible={true}
      objectsToInspect={[
        { name: 'Pessoa', object: pessoaData },
        { name: 'Pedido', object: pedidoData },
        { name: 'Produto', object: produtoData },
      ]}
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
