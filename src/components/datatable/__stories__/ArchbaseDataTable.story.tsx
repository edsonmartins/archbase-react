import { Card, Grid, Group, Text } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ArchbaseDataTable } from '../ArchbaseDataTable';
import { Pessoa } from 'demo/data/Pessoa';

const ArchbaseDataTableExample = () => {
	return (
		<Grid>
			<Grid.Col span={12}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify="space-between">
							<Text fw={500}>DataTable</Text>
						</Group>
					</Card.Section>
				</Card>
			</Grid.Col>
		</Grid>
	);
};

const meta: Meta<typeof ArchbaseDataTable<Pessoa, string>> = {
	title: 'Listas e tabelas/DataTable',
	component: ArchbaseDataTable,
};

export default meta;
type Story = StoryObj<typeof ArchbaseDataTable>;

export const Primary: Story = {
	name: 'Exemplo simples',
	render: () => <ArchbaseDataTableExample />,
};
