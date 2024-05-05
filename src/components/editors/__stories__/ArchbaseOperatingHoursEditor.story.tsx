import { Box, Card, Grid, Group, ScrollArea, Space, Text, Textarea } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { ArchbaseOperatingHoursEditor } from '../ArchbaseOperationHoursEditor';

const ArchbaseOperatingHoursEditorExample = () => {
	const [value, setValue] = useState('último dia')
	return (
		<Grid>
			<Grid.Col offset={1} span={5}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify="space-between">
							<Text fw={500}>Operating Hours Editor Component</Text>
						</Group>
					</Card.Section>
					<Box style={{ height: 500 }}>
						<ScrollArea h={500} p={20}>
							<ArchbaseOperatingHoursEditor
							initialValue={''}
							onChange={(value) => {setValue(value)}}
							/>
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
						<Textarea minRows={12} value={value} autosize={true}/>
					</ScrollArea>
				</Card>
			</Grid.Col>
		</Grid>
	);
};

const meta: Meta<typeof ArchbaseOperatingHoursEditor> = {
	title: 'Editores/OperatingHoursEditor',
	component: ArchbaseOperatingHoursEditor,
};

export default meta;
type Story = StoryObj<typeof ArchbaseOperatingHoursEditor>;

export const Primary: Story = {
	name: 'Exemplo simples',
	render: () => <ArchbaseOperatingHoursEditorExample />,
};