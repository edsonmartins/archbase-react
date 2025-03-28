import { Box, Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DataSourceEvent, DataSourceEventNames } from '../../datasource';
import { ArchbaseObjectInspector } from '../../debug';
import { useArchbaseForceUpdate } from '../../hooks';
import { useArchbaseDataSource } from '../../hooks/useArchbaseDataSource';
import { useArchbaseDataSourceListener } from '../../hooks/useArchbaseDataSourceListener';
import { ArchbaseTimeEdit } from '../ArchbaseTimeEdit';
import { IntervaloHoras } from 'demo/data/types';

const ArchbaseTimeEditExample = () => {
	const forceUpdate = useArchbaseForceUpdate();
	const { dataSource } = useArchbaseDataSource<IntervaloHoras, string>({
		initialData: data,
		name: 'dsIntervalos',
	});
	if (dataSource?.isBrowsing() && !dataSource?.isEmpty()) {
		dataSource.edit();
	}
	useArchbaseDataSourceListener<IntervaloHoras, string>({
		dataSource,
		listener: (event: DataSourceEvent<IntervaloHoras>): void => {
			switch (event.type) {
				case DataSourceEventNames.fieldChanged: {
					forceUpdate();
					break;
				}
				default:
			}
		},
	});

	return (
		<Grid>
			<Grid.Col offset={1} span={4}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify="space-between">
							<Text fw={500}>Time Edit Component</Text>
						</Group>
					</Card.Section>
					<Box style={{ height: 120 }}>
						<ArchbaseTimeEdit label="Hora Início" dataSource={dataSource} dataField="horaInicio" />
						<ArchbaseTimeEdit label="Hora Fim" dataSource={dataSource} dataField="horaFim" />
					</Box>
				</Card>
			</Grid.Col>
			<Grid.Col span={4}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify="space-between">
							<Text fw={500}>DataSource dsIntervalos</Text>
						</Group>
					</Card.Section>
					<ScrollArea style={{ height: 500 }}>
						<ArchbaseObjectInspector data={dataSource} />
					</ScrollArea>
				</Card>
			</Grid.Col>
		</Grid>
	);
};

const data = [{horaInicio: "08:00", horaFim: "18:00"}];

const meta: Meta<typeof ArchbaseTimeEdit> = {
	title: 'Editores/TimeEdit',
	component: ArchbaseTimeEdit,
};

export default meta;
type Story = StoryObj<typeof ArchbaseTimeEdit>;

export const Primary: Story = {
	name: 'Exemplo simples',
	render: () => <ArchbaseTimeEditExample />,
};
