import { Box, Card, Grid, Group, ScrollArea, Space, Text, Textarea } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ArchbaseKeyValueEditor } from '../ArchbaseKeyValueEditor';

const ArchbaseKeyValueEditorExample = (props) => {
	const [value, setValue] = useState('')
	return (
		<Grid>
			<Grid.Col offset={1} span={4}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify="space-between">
							<Text fw={500}>Key Value Editor Component</Text>
						</Group>
					</Card.Section>
					<Box style={{ height: 500 }}>
						<ScrollArea h={500} p={20}>
							<ArchbaseKeyValueEditor initialValue={value} layout={props.layout} onChangeKeyValue={(value) => { setValue(value) }} />
						</ScrollArea>
					</Box>
				</Card>
			</Grid.Col>
			<Grid.Col offset={1} span={4}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify='space-between'>
							<Text fw={500}>Resultado</Text>
						</Group>
					</Card.Section>
					<ScrollArea h={300}>
						<Space h={20} />
						<Textarea minRows={12} value={value} autosize={true} />
					</ScrollArea>
				</Card>
			</Grid.Col>
		</Grid>
	);
};

const meta: Meta<typeof ArchbaseKeyValueEditor> = {
	title: 'Editores/KeyValueEditor',
	component: ArchbaseKeyValueEditor,
};

export default meta;
type Story = StoryObj<typeof ArchbaseKeyValueEditor>;

export const horizontal: Story = {
	name: 'Horizontal',
	render: () => <ArchbaseKeyValueEditorExample />,
};

export const vertical: Story = {
	name: 'Vertical',
	render: () => <ArchbaseKeyValueEditorExample layout={'vertical'} />,
};