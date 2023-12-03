import { ArchbaseObjectInspector } from '@components/debug';
import { Badge, Box, Card, Flex, Grid, Group, ScrollArea, Text } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Schema2 } from '../ArchbaseJsonSchemaEditor.types';
import { ArchbaseJsonSchemaEditor } from '../JsonSchemaEditor';
import { readOnlyData } from './helper';

const ArchbaseJsonSchemaEditorExample = (data) => {
	const [schema, setSchema] = useState<Schema2 | undefined>();
	const [isValidSchema, setIsValidSchema] = useState<boolean>(true);
	return (
		<Flex direction="column">
			<Card shadow="sm" padding="lg" radius="md" withBorder m={20}>
				<Card.Section withBorder inheritPadding py="xs" mb="1rem">
					<Group position="apart">
						<Text weight={500}>Editor de Schema JSON</Text>
					</Group>
				</Card.Section>
				<ScrollArea sx={(_theme) => ({ height: 500 })}>
					<Badge color={isValidSchema ? 'green' : 'red'}>{isValidSchema ? 'Schema Válido' : 'Schema Inválido'}</Badge>
					<ArchbaseJsonSchemaEditor
						rootSchema={schema}
						onRootSchemaChange={(r, isValid) => {
							setSchema(r);
							setIsValidSchema(isValid);
							console.log(r, isValid);
						}}
						defaultRootSchema={data}
					/>
				</ScrollArea>
			</Card>
			<Card shadow="sm" padding="lg" radius="md" withBorder m={20} mt={0}>
				<Card.Section withBorder inheritPadding py="xs">
					<Group position="apart">
						<Text weight={500}>Schema do JSON</Text>
					</Group>
				</Card.Section>
				<ScrollArea sx={(_theme) => ({ height: 500 })}>
					<ArchbaseObjectInspector data={schema} />
				</ScrollArea>
			</Card>
		</Flex>
	);
};

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
	render: () => <ArchbaseJsonSchemaEditorExample />,
};

export const WithData: Story = {
	name: 'JsonSchema com dados',
	render: () => <ArchbaseJsonSchemaEditorExample data={initialSchemaWithData} />,
};
