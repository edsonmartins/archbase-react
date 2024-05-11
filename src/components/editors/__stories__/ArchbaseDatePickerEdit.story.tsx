import { Box, Card, Grid, Group, ScrollArea, Text } from '@mantine/core';
import { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { pessoasData } from '../../../demo/index';
import { DataSourceEvent, DataSourceEventNames } from '../../datasource';
import { ArchbaseJsonView, ArchbaseObjectInspector } from '../../debug';
import { useArchbaseDataSource } from '../../hooks';
import { useArchbaseForceUpdate } from '../../hooks';
import { useArchbaseDataSourceListener } from '../../hooks/useArchbaseDataSourceListener';
import { ArchbaseDatePickerEdit } from '../ArchbaseDatePickerEdit';
import { Pessoa } from '../../../demo/data/Pessoa';

const ArchbaseDatePickerEditExample = () => {
	const forceUpdate = useArchbaseForceUpdate();
	const { dataSource } = useArchbaseDataSource<Pessoa, string>({
		initialData: data,
		name: 'dsPessoas',
	});
	if (dataSource?.isBrowsing() && !dataSource?.isEmpty()) {
		dataSource.edit();
	}
	useArchbaseDataSourceListener<Pessoa, string>({
		dataSource,
		listener: (event: DataSourceEvent<Pessoa>): void => {
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
							<Text fw={500}>Date Picker Component</Text>
						</Group>
					</Card.Section>
					<Box style={{ height: 100 }}>
						<ArchbaseDatePickerEdit
							width={200}
							title="Data nascimento"
							dataSource={dataSource}
							defaultValue={new Date()}
							dataField="data_nasc"
						/>
					</Box>
				</Card>
			</Grid.Col>
			<Grid.Col span={4}>
				<Card shadow="sm" padding="lg" radius="md" withBorder>
					<Card.Section withBorder inheritPadding py="xs">
						<Group justify="space-between">
							<Text fw={500}>DataSource dsPessoas</Text>
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

const data = [pessoasData[0]];

const meta: Meta<typeof ArchbaseDatePickerEdit> = {
	title: 'Editores/DatePicker Edit',
	component: ArchbaseDatePickerEdit,
};

export default meta;
type Story = StoryObj<typeof ArchbaseDatePickerEdit>;

export const Primary: Story = {
	name: 'Exemplo simples',
	render: () => <ArchbaseDatePickerEditExample />,
};
