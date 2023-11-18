import { Meta, StoryObj } from '@storybook/react';
import JsonSchemaEditor from '..';
import { printIt, readOnlyData } from './helper';

const meta: Meta<typeof JsonSchemaEditor> = {
	title: 'Editores/SchemaEditor',
	component: JsonSchemaEditor,
};

export default meta;
type Story = StoryObj<typeof JsonSchemaEditor>;

export const NewJsonSchema: Story = {
	name: 'Novo JsonSchema',
	args: {
		onSchemaChange: (r) => {
			console.log(r);
		},
	},
};

export const WithData: Story = {
	name: 'JsonSchema com dados',
	args: {
		data: readOnlyData,
		onSchemaChange: (r) => {
			printIt(r);
		},
	},
};
