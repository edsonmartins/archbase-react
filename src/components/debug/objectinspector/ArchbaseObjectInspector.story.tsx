import { pessoasData } from '@demo/index';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ArchbaseObjectInspector } from './ArchbaseObjectInspector';

const pessoaData = [pessoasData[0]];

const ArchbaseObjectInspectorExample = () => {
	return <ArchbaseObjectInspector data={pessoaData} />;
};

const meta: Meta<typeof ArchbaseObjectInspector> = {
	title: 'Depuração/Object Inspector',
	component: ArchbaseObjectInspector,
};

export default meta;
type Story = StoryObj<typeof ArchbaseObjectInspector>;

export const Primary: Story = {
	name: 'Exemplo simples',
	render: () => <ArchbaseObjectInspectorExample />,
};
