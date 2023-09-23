import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { pessoasData, pedidosData, produtosData } from '@demo/index';
import { ArchbaseObjectInspector } from './ArchbaseObjectInspector';

const ArchbaseObjectInspectorExample = () => {
  return (
    <ArchbaseObjectInspector
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
  title: 'Views/Object Inspector',
  component: ArchbaseObjectInspectorExample,
} as Meta;

const pessoaData = [pessoasData[0]];
const pedidoData = [pedidosData[0]];
const produtoData = [produtosData[0]];

export const Example: StoryObj<typeof ArchbaseObjectInspectorExample> = {
  args: {
    render: () => {
      <ArchbaseObjectInspectorExample />;
    },
  },
};
