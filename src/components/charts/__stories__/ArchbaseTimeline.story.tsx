import { Card, Grid, Group, Text } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ArchbaseTimeline } from '../ArchbaseTimeline';
import data from './data.json';

const ArchbaseTimelineExample = () => {
	return (
		<Grid>
			<Grid.Col span={12}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify="space-between">
							<Text fw={500}>Timeline</Text>
						</Group>
					</Card.Section>
					<ArchbaseTimeline
						data={data}
						height={500}
						scale={0.5}
						decimalPlaces={2}
						formatData={(value) => {
							return {
								startTime: new Date(value.startTime),
								endTime: new Date(value.endTime),
								type: value.task,
							};
						}}
						startTime={new Date('2024-04-01 17:06:14')}
						endTime={new Date('2024-04-01 17:06:26')}
					/>
				</Card>
			</Grid.Col>
		</Grid>
	);
};

const meta: Meta<typeof ArchbaseTimeline> = {
	title: 'Gráficos/Timeline',
	component: ArchbaseTimeline,
};

export default meta;
type Story = StoryObj<typeof ArchbaseTimeline>;

export const Primary: Story = {
	name: 'Exemplo simples',
	render: () => <ArchbaseTimelineExample />,
};
