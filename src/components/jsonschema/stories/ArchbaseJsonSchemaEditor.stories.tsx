import { Meta, StoryObj } from '@storybook/react';
import { Schema2 } from '../ArchbaseJsonSchemaEditor.types';
import { ArchbaseJsonSchemaEditor } from '../JsonSchemaEditor';
import { readOnlyData } from './helper';

const meta: Meta<typeof ArchbaseJsonSchemaEditor> = {
	title: 'Editores/SchemaEditor',
	component: ArchbaseJsonSchemaEditor,
};

export default meta;
type Story = StoryObj<typeof ArchbaseJsonSchemaEditor>;

const initialSchemaWithData: Schema2 = {
	jsonSchema: readOnlyData,
	isReadOnly: false,
	fieldId: 0,
	isValidSchema: true,
};

export const NewJsonSchema: Story = {
	name: 'Novo JsonSchema',
	args: {
		onRootSchemaChange: (r) => {
			// console.log(r);
		},
	},
};

export const WithData: Story = {
	name: 'JsonSchema com dados',
	args: {
		defaultRootSchema: initialSchemaWithData,
		onRootSchemaChange: (r) => {
			// console.log(r);
		},
	},
};
