import { Box, Card, Grid, Group, Text } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ArchbaseCronExpressionEditor } from '../ArchbaseCronExpressionEditor';

const ArchbaseCronExpressionEditorExample = () => {
	return (
		<Group justify='center'>
			<Card shadow="sm" padding="lg" radius="md" withBorder w={{base: '100%', sm: 800, lg: 1000}}>
				<Card.Section withBorder inheritPadding py="xs">
					<Group justify="space-between">
						<Text fw={500}>Cron Expression Editor Component</Text>
					</Group>
				</Card.Section>
				<Box style={{ height: 500 }}>
					<ArchbaseCronExpressionEditor label="Cron" initialValue={''} onChange={(value) => {}} />
				</Box>
			</Card>
		</Group>
	);
};

const meta: Meta<typeof ArchbaseCronExpressionEditor> = {
	title: 'Editores/CronExpressionEditor',
	component: ArchbaseCronExpressionEditor,
};

export default meta;
type Story = StoryObj<typeof ArchbaseCronExpressionEditor>;

export const Primary: Story = {
	name: 'Exemplo simples',
	render: () => <ArchbaseCronExpressionEditorExample />,
};
