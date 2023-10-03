import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { pessoasData } from '@demo/index';
import { ArchbaseObjectInspector } from './ArchbaseObjectInspector';

const ArchbaseObjectInspectorExample = () => {
  return <ArchbaseObjectInspector data={pessoaData} />;
};

export default {
  title: 'Views/Object Inspector',
  component: ArchbaseObjectInspectorExample,
} as Meta;

const pessoaData = [pessoasData[0]];

export const Example: StoryObj<typeof ArchbaseObjectInspectorExample> = {
  args: {
    render: () => {
      <ArchbaseObjectInspectorExample />;
    },
  },
};
